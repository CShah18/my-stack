import { PromptTemplate } from '@mystack/core';
import { PromptCompiler } from './compiler.js';

export * from './compiler.js';

export class PromptEngine {
  private compiler = new PromptCompiler();

  public render(template: PromptTemplate, variables: Record<string, unknown>): string {
    const compiled = this.compiler.compile(template.template);
    return compiled.render(variables);
  }

  public renderSystem(template: PromptTemplate, variables: Record<string, unknown>): string {
    const compiled = this.compiler.compile(template.system);
    return compiled.render(variables);
  }

  public validate(template: PromptTemplate, variables: Record<string, unknown>): { valid: boolean; missingVariables: string[] } {
    const missingVariables: string[] = [];
    if (template.variables) {
      for (const v of template.variables) {
        if (v.required && !(v.name in variables)) {
          missingVariables.push(v.name);
        }
      }
    }
    return {
      valid: missingVariables.length === 0,
      missingVariables,
    };
  }
}
