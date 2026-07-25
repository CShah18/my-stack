import { TemplateFile, TemplateVariable, TemplateHooks } from './common.js';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'project' | 'feature' | 'component' | 'page' | 'api' | 'test';
  files: TemplateFile[];
  variables: TemplateVariable[];
  hooks?: TemplateHooks;
  metadata?: Record<string, unknown>;
}
