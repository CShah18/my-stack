export interface CompiledTemplate {
  render(variables: Record<string, unknown>): string;
}

export class PromptCompiler {
  public compile(templateString: string): CompiledTemplate {
    return {
      render: (variables: Record<string, unknown>): string => {
        let result = templateString;

        // Process {{#if key}}...{{/if}}
        result = result.replace(
          /{{\s*#if\s+([a-zA-Z0-9_.]+)\s*}}([\s\S]*?){{\s*\/if\s*}}/g,
          (_, key, block) => {
            const val = this.resolvePath(variables, key);
            return val ? block : '';
          },
        );

        // Process {{#each key}}...{{/each}}
        result = result.replace(
          /{{\s*#each\s+([a-zA-Z0-9_.]+)\s*}}([\s\S]*?){{\s*\/each\s*}}/g,
          (_, key, block) => {
            const list = this.resolvePath(variables, key);
            if (!Array.isArray(list)) return '';
            return list
              .map((item) => {
                if (typeof item === 'object' && item !== null) {
                  let itemBlock = block;
                  for (const [k, v] of Object.entries(item)) {
                    itemBlock = itemBlock.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
                  }
                  return itemBlock;
                }
                return block.replace(/{{\s*this\s*}}/g, String(item));
              })
              .join('');
          },
        );

        // Process {{variable}}
        result = result.replace(/{{\s*([a-zA-Z0-9_.]+)\s*}}/g, (match, key) => {
          const val = this.resolvePath(variables, key);
          return val !== undefined ? String(val) : match;
        });

        return result;
      },
    };
  }

  private resolvePath(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = obj;
    for (const part of parts) {
      if (typeof current === 'object' && current !== null && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  }
}
