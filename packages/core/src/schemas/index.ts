import { z } from 'zod';

export const ToolReferenceSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.unknown()).optional(),
  required: z.array(z.string()).optional(),
});

export const HandoffRuleSchema = z.object({
  targetAgentId: z.string(),
  condition: z.string().optional(),
  artifactsToPass: z.array(z.string()),
  contextKeysToPass: z.array(z.string()),
});

export const PromptVariableSchema = z.object({
  name: z.string(),
  description: z.string(),
  required: z.boolean().optional(),
  defaultValue: z.string().optional(),
});

export const PromptTemplateSchema = z.object({
  id: z.string(),
  system: z.string(),
  template: z.string(),
  variables: z.array(PromptVariableSchema),
  outputFormat: z.enum(['markdown', 'json', 'yaml', 'text']).optional(),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
});

export const AgentDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  responsibilities: z.array(z.string()),
  capabilities: z.array(z.string()),
  tools: z.array(ToolReferenceSchema),
  prompt: PromptTemplateSchema,
  inputSchemaName: z.string().optional(),
  outputSchemaName: z.string().optional(),
  dependencies: z.array(z.string()),
  qualityChecklist: z.array(z.string()),
  handoffRules: z.array(HandoffRuleSchema),
  metadata: z.record(z.unknown()).optional(),
});

export const SkillCategorySchema = z.enum([
  'language',
  'framework',
  'tool',
  'platform',
  'practice',
  'database',
  'ai',
]);

export const ResourceReferenceSchema = z.object({
  type: z.enum(['url', 'file', 'doc', 'repo']),
  title: z.string(),
  uri: z.string(),
});

export const SkillExampleSchema = z.object({
  title: z.string(),
  description: z.string(),
  code: z.string(),
});

export const SkillDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  category: SkillCategorySchema,
  tags: z.array(z.string()),
  instructions: z.string(),
  examples: z.array(SkillExampleSchema),
  references: z.array(ResourceReferenceSchema),
  metadata: z.record(z.unknown()).optional(),
});

export const StepInputSchema = z.object({
  source: z.enum(['variables', 'previous_step', 'static']),
  key: z.string().optional(),
  value: z.unknown().optional(),
});

export const StepValidationSchema = z.object({
  rules: z.array(z.string()),
  requireHumanApproval: z.boolean().optional(),
});

export const RetryPolicySchema = z.object({
  maxAttempts: z.number(),
  backoffFactor: z.number(),
  initialIntervalMs: z.number(),
});

export const WorkflowStepSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  name: z.string(),
  description: z.string(),
  input: StepInputSchema,
  validation: StepValidationSchema.optional(),
  onFailure: z.enum(['halt', 'retry', 'skip', 'fallback']),
  retryPolicy: RetryPolicySchema.optional(),
  timeout: z.number().optional(),
});

export const WorkflowVariableSchema = z.object({
  name: z.string(),
  description: z.string(),
  required: z.boolean().optional(),
  defaultValue: z.unknown().optional(),
});

export const WorkflowHooksSchema = z.object({
  onStart: z.string().optional(),
  onSuccess: z.string().optional(),
  onFailure: z.string().optional(),
});

export const WorkflowDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  trigger: z.enum(['command', 'event', 'schedule', 'manual']),
  steps: z.array(WorkflowStepSchema),
  variables: z.array(WorkflowVariableSchema),
  hooks: WorkflowHooksSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const RuleCategorySchema = z.enum([
  'typescript',
  'security',
  'accessibility',
  'performance',
  'style',
  'testing',
  'documentation',
  'architecture',
]);

export const RuleExampleSchema = z.object({
  description: z.string(),
  good: z.string(),
  bad: z.string(),
});

export const RuleDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  severity: z.enum(['error', 'warning', 'info']),
  category: RuleCategorySchema,
  enforcement: z.enum(['always', 'suggest', 'project-specific']),
  instruction: z.string(),
  examples: z.array(RuleExampleSchema),
  metadata: z.record(z.unknown()).optional(),
});

export const PluginProvidesSchema = z.object({
  agents: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  workflows: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  templates: z.array(z.string()).optional(),
});

export const PluginDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  author: z.string(),
  homepage: z.string().optional(),
  repository: z.string().optional(),
  provides: PluginProvidesSchema,
  dependencies: z.array(z.string()).optional(),
  peerDependencies: z.record(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const ExecutionStatusSchema = z.enum([
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
  'paused',
]);

export const MyStackSettingsSchema = z.object({
  defaultModel: z.string().optional(),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']),
  outputDir: z.string(),
  cacheEnabled: z.boolean(),
});

export const MyStackConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  agents: z.array(z.string()),
  skills: z.array(z.string()),
  workflows: z.array(z.string()),
  rules: z.array(z.string()),
  templates: z.array(z.string()),
  plugins: z.array(z.string()),
  settings: MyStackSettingsSchema,
});
