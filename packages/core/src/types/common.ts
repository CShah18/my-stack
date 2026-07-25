export interface ToolReference {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
  required?: string[];
}

export interface HandoffRule {
  targetAgentId: string;
  condition?: string;
  artifactsToPass: string[];
  contextKeysToPass: string[];
}

export interface ResourceReference {
  type: 'url' | 'file' | 'doc' | 'repo';
  title: string;
  uri: string;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffFactor: number;
  initialIntervalMs: number;
}

export interface StepInput {
  source: 'variables' | 'previous_step' | 'static';
  key?: string;
  value?: unknown;
}

export interface StepValidation {
  rules: string[];
  requireHumanApproval?: boolean;
}

export type WorkflowTrigger = 'command' | 'event' | 'schedule' | 'manual';

export interface WorkflowHooks {
  onStart?: string;
  onSuccess?: string;
  onFailure?: string;
}

export interface TemplateFile {
  path: string;
  content: string;
  isExecutable?: boolean;
}

export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required?: boolean;
}

export interface TemplateHooks {
  postGenerate?: string[];
}

export type RuleCategory =
  | 'typescript'
  | 'security'
  | 'accessibility'
  | 'performance'
  | 'style'
  | 'testing'
  | 'documentation'
  | 'architecture';

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'tool'
  | 'platform'
  | 'practice'
  | 'database'
  | 'ai';
