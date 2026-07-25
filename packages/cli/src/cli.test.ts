import { describe, it, expect } from 'vitest';
import { generateAgentTemplate, generateSkillTemplate } from './utils/templates.js';

describe('CLI Templates Generator', () => {
  it('should generate valid agent template YAML string', () => {
    const yaml = generateAgentTemplate('test-agent', 'Test Agent', 'Description');
    expect(yaml).toContain('id: test-agent');
    expect(yaml).toContain('name: Test Agent');
    expect(yaml).toContain('description: Description');
  });

  it('should generate valid skill template YAML string', () => {
    const yaml = generateSkillTemplate('test-skill', 'Test Skill', 'Skill Description');
    expect(yaml).toContain('id: test-skill');
    expect(yaml).toContain('name: Test Skill');
  });
});
