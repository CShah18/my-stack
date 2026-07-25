import { describe, it, expect } from 'vitest';
import { MyStack } from './index.js';
import { resolve } from 'node:path';

describe('MyStack SDK', () => {
  const root = resolve(process.cwd(), '../../');

  it('should initialize MyStack workspace and discover assets', async () => {
    const mystack = await MyStack.init({ root });

    const config = mystack.getConfig();
    expect(config.name).toBe('mystack');

    const agents = await mystack.loadAgents();
    expect(agents.length).toBeGreaterThan(0);

    const skills = await mystack.loadSkills();
    expect(skills.length).toBeGreaterThan(0);

    const workflows = await mystack.loadWorkflows();
    expect(workflows.length).toBeGreaterThan(0);
  });

  it('should expose accessors for core engines', async () => {
    const mystack = await MyStack.init({ root });

    expect(mystack.getOrchestrator()).toBeDefined();
    expect(mystack.getWorkflowEngine()).toBeDefined();
    expect(mystack.getMemoryStore()).toBeDefined();
    expect(mystack.getPromptEngine()).toBeDefined();
    expect(mystack.getSecretsProvider()).toBeDefined();
    expect(mystack.getTemplateEngine()).toBeDefined();
  });
});
