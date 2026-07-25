import { EventEmitter } from 'node:events';
import { WorkflowDefinition, ExecutionContext } from '@cshah-mystack/core';
import { AgentOrchestrator } from '@cshah-mystack/orchestrator';
import { WorkflowEventType, WorkflowEventPayloads } from './types.js';
import { WorkflowStateMachine } from './state-machine.js';
import { InputResolver } from './input-resolver.js';
import { ValidationGate } from './validation-gate.js';

export * from './types.js';
export * from './state-machine.js';
export * from './input-resolver.js';
export * from './validation-gate.js';

export class WorkflowEngine {
  private orchestrator: AgentOrchestrator;
  private executions: Map<string, ExecutionContext> = new Map();
  private workflowDefs: Map<string, WorkflowDefinition> = new Map();
  private stateMachine = new WorkflowStateMachine();
  private inputResolver = new InputResolver();
  private validationGate = new ValidationGate();
  private emitter = new EventEmitter();

  constructor(orchestrator: AgentOrchestrator) {
    this.orchestrator = orchestrator;
  }

  public on<K extends WorkflowEventType>(
    event: K,
    listener: (payload: WorkflowEventPayloads[K]) => void,
  ): void {
    this.emitter.on(event, listener);
  }

  public off<K extends WorkflowEventType>(
    event: K,
    listener: (payload: WorkflowEventPayloads[K]) => void,
  ): void {
    this.emitter.off(event, listener);
  }

  private emit<K extends WorkflowEventType>(event: K, payload: WorkflowEventPayloads[K]): void {
    this.emitter.emit(event, payload);
  }

  public async execute(
    workflow: WorkflowDefinition,
    variables?: Record<string, unknown>,
  ): Promise<ExecutionContext> {
    this.workflowDefs.set(workflow.id, workflow);

    const context: ExecutionContext = {
      executionId: `exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      workflowId: workflow.id,
      startedAt: new Date().toISOString(),
      variables: variables ?? {},
      steps: [],
      status: 'pending',
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `[Engine] Starting execution for workflow '${workflow.name}' (${workflow.id})`,
        },
      ],
    };

    context.status = this.stateMachine.transition(context.status, 'running');
    this.executions.set(context.executionId, context);
    this.emit('workflow:start', { workflow, context });

    return this.runWorkflowLoop(workflow, context, 0);
  }

  private async runWorkflowLoop(
    workflow: WorkflowDefinition,
    context: ExecutionContext,
    startStepIndex: number,
  ): Promise<ExecutionContext> {
    for (let i = startStepIndex; i < workflow.steps.length; i++) {
      const step = workflow.steps[i]!;

      // Check for pause/cancel
      if (context.status === 'paused') {
        this.emit('workflow:paused', { workflow, context });
        return context;
      }
      if (context.status === 'cancelled') {
        this.emit('workflow:cancelled', { workflow, context });
        return context;
      }

      this.emit('step:start', { step, context });

      const resolvedInput = this.inputResolver.resolve(step.input, context);

      try {
        const stepResult = await this.orchestrator.dispatch(step.agentId, resolvedInput, context);
        context.steps.push(stepResult);

        if (stepResult.status === 'failed') {
          if (step.onFailure === 'halt') {
            context.status = this.stateMachine.transition(context.status, 'failed');
            context.completedAt = new Date().toISOString();
            const err = new Error(stepResult.error?.message ?? `Step '${step.name}' failed`);
            this.emit('step:failed', { step, context, error: err });
            this.emit('workflow:failed', { workflow, context, error: err });
            return context;
          } else if (step.onFailure === 'skip') {
            this.emit('step:skipped', { step, context, reason: 'Step failed, skipping per policy' });
            continue;
          }
        }

        const gateResult = this.validationGate.evaluate(step.validation, stepResult);
        if (gateResult.requiresApproval) {
          context.status = this.stateMachine.transition(context.status, 'paused');
          context.logs.push({
            timestamp: new Date().toISOString(),
            level: 'info',
            stepId: step.id,
            message: `[Engine] Workflow paused at step '${step.name}' requiring human approval.`,
          });
          this.emit('workflow:paused', { workflow, context });
          return context;
        }

        this.emit('step:complete', { step, context });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (step.onFailure === 'halt') {
          context.status = this.stateMachine.transition(context.status, 'failed');
          context.completedAt = new Date().toISOString();
          this.emit('step:failed', { step, context, error: err });
          this.emit('workflow:failed', { workflow, context, error: err });
          return context;
        } else if (step.onFailure === 'skip') {
          this.emit('step:skipped', { step, context, reason: `Step error skipped: ${err.message}` });
        }
      }
    }

    context.status = this.stateMachine.transition(context.status, 'completed');
    context.completedAt = new Date().toISOString();
    this.emit('workflow:complete', { workflow, context });
    return context;
  }

  public async pause(executionId: string): Promise<void> {
    const context = this.executions.get(executionId);
    if (!context) throw new Error(`Execution '${executionId}' not found.`);
    context.status = this.stateMachine.transition(context.status, 'paused');
    const workflow = this.workflowDefs.get(context.workflowId);
    if (workflow) {
      this.emit('workflow:paused', { workflow, context });
    }
  }

  public async resume(executionId: string): Promise<ExecutionContext> {
    const context = this.executions.get(executionId);
    if (!context) throw new Error(`Execution '${executionId}' not found.`);
    if (context.status !== 'paused') {
      throw new Error(`Cannot resume execution in status '${context.status}'.`);
    }

    const workflow = this.workflowDefs.get(context.workflowId);
    if (!workflow) throw new Error(`Workflow definition '${context.workflowId}' not found.`);

    context.status = this.stateMachine.transition(context.status, 'running');
    const nextStepIndex = context.steps.length;
    return this.runWorkflowLoop(workflow, context, nextStepIndex);
  }

  public async cancel(executionId: string): Promise<void> {
    const context = this.executions.get(executionId);
    if (!context) throw new Error(`Execution '${executionId}' not found.`);
    context.status = this.stateMachine.transition(context.status, 'cancelled');
    const workflow = this.workflowDefs.get(context.workflowId);
    if (workflow) {
      this.emit('workflow:cancelled', { workflow, context });
    }
  }

  public getStatus(executionId: string): ExecutionContext | undefined {
    return this.executions.get(executionId);
  }
}
