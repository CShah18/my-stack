import { describe, it, expect } from 'vitest';
import { TemplateEngine } from './templates/index.js';
import { TemplateDefinition } from './types/template.js';

describe('TemplateEngine', () => {
  const engine = new TemplateEngine();

  const mockTemplate: TemplateDefinition = {
    id: 'test-template',
    name: 'Test Template',
    description: 'Unit test template',
    version: '1.0.0',
    category: 'project',
    variables: [
      { name: 'projectName', description: 'Project Name', required: true },
      { name: 'author', description: 'Author', defaultValue: 'Default Author' },
    ],
    files: [
      {
        path: '{{projectName}}/package.json',
        content: '{"name": "{{projectName}}", "author": "{{author}}"}',
      },
    ],
    hooks: {
      postGenerate: ['cd {{projectName}} && npm install'],
    },
  };

  it('should interpolate variable placeholders correctly', () => {
    const result = engine.interpolate('Hello {{name}}!', { name: 'World' });
    expect(result).toBe('Hello World!');
  });

  it('should render template files with merged variables', () => {
    const rendered = engine.render(mockTemplate, { projectName: 'my-app' });

    expect(rendered.files).toHaveLength(1);
    expect(rendered.files[0]?.path).toBe('my-app/package.json');
    expect(rendered.files[0]?.content).toBe('{"name": "my-app", "author": "Default Author"}');
    expect(rendered.postGenerateCommands[0]).toBe('cd my-app && npm install');
  });

  it('should throw an error when required variable is missing', () => {
    expect(() => engine.render(mockTemplate, {})).toThrowError(
      "Required template variable 'projectName' is not provided.",
    );
  });
});
