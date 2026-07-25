import { WorkflowTrigger, StepInput, StepValidation, RetryPolicy, WorkflowHooks } from './common.js';

export interface WorkflowVariable {
  name: string;
  description: string;
  required?: boolean;
  defaultValue?: unknown;
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  name: string;
  description: string;
  input: StepInput;
  validation?: StepValidation;
  onFailure: 'halt' | 'retry' | 'skip' | 'fallback';
  retryPolicy?: RetryPolicy;
  timeout?: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  variables: WorkflowVariable[];
  hooks?: WorkflowHooks;
  metadata?: Record<string, unknown>;
}
