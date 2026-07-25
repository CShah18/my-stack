import { describe, it, expect, vi } from 'vitest';
import { AgentOrchestrator } from './index.js';
import { AgentDefinition, ExecutionContext } from '@mystack/core';

describe('AgentOrchestrator', () => {
  const mockAgent: AgentDefinition = {
    id: 'test-agent',
    name: 'Test Agent',
    description: 'Unit testing agent',
    version: '1.0.0',
    responsibilities: ['testing'],
    capabilities: ['unit-test'],
    tools: [],
    prompt: {
      id: 'p1',
      system: 'You are a test agent.',
      template: '{{input}}',
      variables: [{ name: 'input', description: 'input' }],
    },
    permissions: ['read:code', 'write:code'],
    dependencies: [],
    qualityChecklist: ['check'],
    handoffRules: [],
  };

  const mockContext: ExecutionContext = {
    executionId: 'exec-1',
    workflowId: 'wf-1',
    currentStepId: 'step-1',
    status: 'running',
    startedAt: new Date().toISOString(),
    variables: {},
    logs: [],
    steps: {},
  };

  it('should register and retrieve an agent', () => {
    const orchestrator = new AgentOrchestrator();
    orchestrator.registerAgent(mockAgent);

    expect(orchestrator.getAgent('test-agent')).toEqual(mockAgent);
    expect(orchestrator.listAgents()).toHaveLength(1);
  });

  it('should dispatch step execution through middleware onion pipeline', async () => {
    const orchestrator = new AgentOrchestrator({
      agents: [mockAgent],
      handler: async (agent, input) => {
        return { message: `Executed ${agent.name}`, input };
      },
    });

    const result = await orchestrator.dispatch('test-agent', 'hello', mockContext);

    expect(result.status).toBe('completed');
    expect(result.agentId).toBe('test-agent');
    expect((result.output as { message: string }).message).toBe('Executed Test Agent');
  });

  it('should throw error when dispatching unknown agent ID', async () => {
    const orchestrator = new AgentOrchestrator();

    await expect(
      orchestrator.dispatch('unknown-agent', 'data', mockContext),
    ).rejects.toThrowError("Agent with ID 'unknown-agent' not found in orchestrator.");
  });

  it('should audit permission checks in context variables', async () => {
    const orchestrator = new AgentOrchestrator({ agents: [mockAgent] });
    await orchestrator.dispatch('test-agent', 'data', mockContext);

    const audit = (mockContext.variables as Record<string, unknown>)['_securityAudit'];
    expect(audit).toBeDefined();
    expect(Array.isArray(audit)).toBe(true);
  });
});
