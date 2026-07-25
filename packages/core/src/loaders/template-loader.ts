import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { TemplateDefinition } from '../types/template.js';
import { TemplateDefinitionSchema } from '../schemas/index.js';
import { YamlLoader } from './yaml-loader.js';

export class TemplateLoader extends YamlLoader<TemplateDefinition> {
  constructor() {
    super(TemplateDefinitionSchema);
  }

  public override async loadAll(dirPath: string): Promise<TemplateDefinition[]> {
    try {
      const entries = await readdir(dirPath);
      const results: TemplateDefinition[] = [];

      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const fileStat = await stat(fullPath);

        if (fileStat.isDirectory()) {
          // Look for template.yaml or any .yaml inside subdirectory
          const subResults = await this.loadAll(fullPath);
          results.push(...subResults);
        } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
          results.push(await this.load(fullPath));
        }
      }
      return results;
    } catch {
      return [];
    }
  }
}
