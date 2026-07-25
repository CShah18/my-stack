import { join } from 'node:path';
import { PluginDefinition } from '../types/plugin.js';

export interface ResolvedPlugin {
  definition: PluginDefinition;
  pluginDir: string;
  assetDirectories: {
    agents: string[];
    skills: string[];
    workflows: string[];
    rules: string[];
    templates: string[];
  };
}

export class PluginResolver {
  public resolve(plugin: PluginDefinition, pluginDir: string): ResolvedPlugin {
    const resolveRel = (paths: string[] = []) =>
      paths.map((p) => join(pluginDir, p));

    return {
      definition: plugin,
      pluginDir,
      assetDirectories: {
        agents: resolveRel(plugin.provides.agents),
        skills: resolveRel(plugin.provides.skills),
        workflows: resolveRel(plugin.provides.workflows),
        rules: resolveRel(plugin.provides.rules),
        templates: resolveRel(plugin.provides.templates),
      },
    };
  }
}
