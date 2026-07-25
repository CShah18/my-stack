import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { PluginDefinition } from '../types/plugin.js';
import { YamlLoader } from './yaml-loader.js';
import { PluginDefinitionSchema } from '../schemas/index.js';

export class PluginLoader extends YamlLoader<PluginDefinition> {
  constructor() {
    super(PluginDefinitionSchema);
  }

  public override async loadAll(dirPath: string): Promise<PluginDefinition[]> {
    try {
      const entries = await readdir(dirPath);
      const plugins: PluginDefinition[] = [];

      for (const entry of entries) {
        const entryPath = join(dirPath, entry);
        const st = await stat(entryPath);
        if (st.isDirectory()) {
          const manifestPath = join(entryPath, 'plugin.yaml');
          try {
            await stat(manifestPath);
            const loaded = await this.load(manifestPath);
            plugins.push(loaded);
          } catch {
            // No plugin.yaml in this directory, skip
          }
        }
      }
      return plugins;
    } catch {
      return [];
    }
  }
}
