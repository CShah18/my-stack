import { TemplateDefinition } from '../types/template.js';
import { TemplateVariable, TemplateFile } from '../types/common.js';

export interface TemplateRenderResult {
  files: Array<{ path: string; content: string; isExecutable?: boolean }>;
  postGenerateCommands: string[];
}

export class TemplateEngine {
  /**
   * Interpolate {{variable}} placeholders in a string.
   */
  public interpolate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      return variables[key] ?? `{{${key}}}`;
    });
  }

  /**
   * Render all files in a template definition, interpolating variables.
   */
  public render(
    template: TemplateDefinition,
    userVariables: Record<string, string>,
  ): TemplateRenderResult {
    // Merge default values with user-provided variables
    const resolvedVars: Record<string, string> = {};
    for (const v of template.variables) {
      if (userVariables[v.name] !== undefined) {
        resolvedVars[v.name] = userVariables[v.name]!;
      } else if (v.defaultValue !== undefined) {
        resolvedVars[v.name] = v.defaultValue;
      } else if (v.required) {
        throw new Error(`Required template variable '${v.name}' is not provided.`);
      }
    }

    const renderedFiles = template.files.map((file: TemplateFile) => ({
      path: this.interpolate(file.path, resolvedVars),
      content: this.interpolate(file.content, resolvedVars),
      isExecutable: file.isExecutable,
    }));

    const postGenerateCommands = (template.hooks?.postGenerate ?? []).map((cmd: string) =>
      this.interpolate(cmd, resolvedVars),
    );

    return { files: renderedFiles, postGenerateCommands };
  }

  /**
   * Validate that all required variables have values.
   */
  public validateVariables(
    templateVars: TemplateVariable[],
    provided: Record<string, string>,
  ): string[] {
    const missing: string[] = [];
    for (const v of templateVars) {
      if (v.required && provided[v.name] === undefined && v.defaultValue === undefined) {
        missing.push(v.name);
      }
    }
    return missing;
  }
}
