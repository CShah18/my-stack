export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';

export interface ExecutionError {
  code: string;
  message: string;
  stack?: string;
  details?: unknown;
}

export interface ExecutionLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  stepId?: string;
  agentId?: string;
  message: string;
  data?: unknown;
}

export interface StepExecution {
  stepId: string;
  agentId: string;
  status: ExecutionStatus;
  input: unknown;
  output?: unknown;
  startedAt?: string;
  completedAt?: string;
  error?: ExecutionError;
  retryCount: number;
}

export interface ExecutionContext {
  executionId: string;
  workflowId: string;
  startedAt: string;
  completedAt?: string;
  variables: Record<string, unknown>;
  steps: StepExecution[];
  status: ExecutionStatus;
  logs: ExecutionLog[];
}
