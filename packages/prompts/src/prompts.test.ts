import { describe, it, expect } from 'vitest';
import { PromptEngine } from './index.js';
import { PromptTemplate } from '@cshah-mystack/core';

describe('PromptEngine', () => {
  const engine = new PromptEngine();

  const mockTemplate: PromptTemplate = {
    id: 'p1',
    system: 'You are {{role}}.',
    template: 'Task: {{taskName}}',
    variables: [
      { name: 'role', description: 'System role' },
      { name: 'taskName', description: 'Task name' },
    ],
  };

  it('should compile system and user template with variables', () => {
    const userRendered = engine.render(mockTemplate, { taskName: 'Build Dashboard' });
    const systemRendered = engine.renderSystem(mockTemplate, { role: 'Fullstack Lead' });

    expect(systemRendered).toBe('You are Fullstack Lead.');
    expect(userRendered).toBe('Task: Build Dashboard');
  });

  it('should report missing required variables during validation', () => {
    const templateWithRequired: PromptTemplate = {
      ...mockTemplate,
      variables: [{ name: 'input', description: 'Input', required: true }],
    };

    const validation = engine.validate(templateWithRequired, {});
    expect(validation.valid).toBe(false);
    expect(validation.missingVariables).toContain('input');
  });
});
