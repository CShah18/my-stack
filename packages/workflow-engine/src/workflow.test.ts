import { describe, it, expect } from 'vitest';
import { WorkflowEngine } from './index.js';
import { AgentOrchestrator } from '@mystack/orchestrator';
import { WorkflowDefinition, AgentDefinition } from '@mystack/core';

describe('WorkflowEngine', () => {
  const mockAgent: AgentDefinition = {
    id: 'architect',
    name: 'Solution Architect',
    description: 'System design',
    version: '1.0.0',
    responsibilities: ['design'],
    capabilities: ['architecture'],
    tools: [],
    prompt: {
      id: 'p1',
      system: 'System architect',
      template: '{{input}}',
      variables: [{ name: 'input', description: 'input' }],
    },
    dependencies: [],
    qualityChecklist: [],
    handoffRules: [],
  };

  const mockWorkflow: WorkflowDefinition = {
    id: 'test-wf',
    name: 'Test Workflow',
    description: 'Workflow engine test',
    version: '1.0.0',
    trigger: 'command',
    variables: [
      { name: 'target', description: 'Target', defaultValue: 'app' },
    ],
    steps: [
      {
        id: 'step-1',
        agentId: 'architect',
        name: 'Step 1 Architecture',
        description: 'First step',
        input: { source: 'variables' },
        onFailure: 'halt',
      },
    ],
  };

  it('should execute workflow state machine steps to completion', async () => {
    const orchestrator = new AgentOrchestrator({ agents: [mockAgent] });
    const engine = new WorkflowEngine(orchestrator);

    const context = await engine.execute(mockWorkflow, { target: 'dashboard' });

    expect(context.status).toBe('completed');
    expect(context.workflowId).toBe('test-wf');
    expect(context.steps.length).toBe(1);
    expect(context.steps[0]?.status).toBe('completed');
    expect(context.logs.length).toBeGreaterThan(0);
  });

  it('should support execution status lookup and state tracking', async () => {
    const orchestrator = new AgentOrchestrator({ agents: [mockAgent] });
    const engine = new WorkflowEngine(orchestrator);

    const context = await engine.execute(mockWorkflow);
    const retrieved = engine.getStatus(context.executionId);

    expect(retrieved?.executionId).toBe(context.executionId);
    expect(retrieved?.status).toBe('completed');
  });
});
