export interface PluginProvides {
  agents?: string[];
  skills?: string[];
  workflows?: string[];
  rules?: string[];
  templates?: string[];
}

export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  homepage?: string;
  repository?: string;
  provides: PluginProvides;
  dependencies?: string[];
  peerDependencies?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
