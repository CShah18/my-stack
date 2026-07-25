import { AgentDefinition, StepExecution, ExecutionContext } from '@mystack/core';
import { AgentHandler, Middleware } from './types.js';
import { OrchestratorEventBus } from './event-bus.js';
import { loggingMiddleware } from './middleware/logging.js';
import { validationMiddleware } from './middleware/validation.js';
import { securityMiddleware } from './middleware/security.js';

export * from './types.js';
export * from './event-bus.js';
export * from './middleware/logging.js';
export * from './middleware/validation.js';
export * from './middleware/retry.js';
export * from './middleware/security.js';

export interface OrchestratorOptions {
  agents?: AgentDefinition[];
  handler?: AgentHandler;
  middlewares?: Middleware[];
}

export class AgentOrchestrator {
  private agents: Map<string, AgentDefinition> = new Map();
  private middlewares: Middleware[] = [];
  private handler: AgentHandler;
  public readonly events = new OrchestratorEventBus();

  constructor(options?: OrchestratorOptions) {
    this.handler = options?.handler ?? this.defaultHandler;
    this.use(securityMiddleware);
    this.use(validationMiddleware);
    this.use(loggingMiddleware);

    if (options?.middlewares) {
      for (const mw of options.middlewares) {
        this.use(mw);
      }
    }

    if (options?.agents) {
      for (const agent of options.agents) {
        this.registerAgent(agent);
      }
    }
  }

  public registerAgent(agent: AgentDefinition): void {
    this.agents.set(agent.id, agent);
    this.events.emit('agent:registered', { agent });
  }

  public getAgent(id: string): AgentDefinition | undefined {
    return this.agents.get(id);
  }

  public listAgents(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }

  public use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  public setHandler(handler: AgentHandler): void {
    this.handler = handler;
  }

  public async dispatch(
    agentId: string,
    input: unknown,
    context: ExecutionContext,
  ): Promise<StepExecution> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent with ID '${agentId}' not found in orchestrator.`);
    }

    this.events.emit('dispatch:start', { agent, input, context });

    const coreExecution = async (): Promise<StepExecution> => {
      const startedAt = new Date().toISOString();
      try {
        const output = await this.handler(agent, input, context);
        const completedAt = new Date().toISOString();
        return {
          stepId: `step-${Date.now()}`,
          agentId: agent.id,
          status: 'completed',
          input,
          output,
          startedAt,
          completedAt,
          retryCount: 0,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return {
          stepId: `step-${Date.now()}`,
          agentId: agent.id,
          status: 'failed',
          input,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          error: {
            code: 'AGENT_EXECUTION_ERROR',
            message: errorMsg,
          },
          retryCount: 0,
        };
      }
    };

    // Build middleware onion execution
    let index = -1;
    const runner = async (i: number): Promise<StepExecution> => {
      if (i <= index) {
        throw new Error('next() called multiple times in middleware');
      }
      index = i;

      const middleware = this.middlewares[i];
      if (middleware) {
        return middleware(agent, input, context, () => runner(i + 1));
      } else {
        return coreExecution();
      }
    };

    try {
      const result = await runner(0);
      this.events.emit('dispatch:complete', { agent, result, context });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.events.emit('dispatch:error', { agent, error: err, context });
      throw err;
    }
  }

  private defaultHandler: AgentHandler = async (agent, input, context) => {
    return {
      agentId: agent.id,
      agentName: agent.name,
      message: `Executed agent '${agent.name}' successfully.`,
      input,
      contextId: context.executionId,
    };
  };
}
