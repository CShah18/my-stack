import { ToolReference, HandoffRule } from './common.js';
import { PromptTemplate } from './prompt.js';

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  responsibilities: string[];
  capabilities: string[];
  tools: ToolReference[];
  prompt: PromptTemplate;
  inputSchemaName?: string;
  outputSchemaName?: string;
  dependencies: string[];
  qualityChecklist: string[];
  handoffRules: HandoffRule[];
  metadata?: Record<string, unknown>;
}
