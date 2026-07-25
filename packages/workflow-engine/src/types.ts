import { WorkflowDefinition, ExecutionContext, WorkflowStep } from '@mystack/core';

export type WorkflowEventType =
  | 'workflow:start'
  | 'workflow:complete'
  | 'workflow:failed'
  | 'workflow:paused'
  | 'workflow:cancelled'
  | 'step:start'
  | 'step:complete'
  | 'step:failed'
  | 'step:skipped';

export interface WorkflowEventPayloads {
  'workflow:start': { workflow: WorkflowDefinition; context: ExecutionContext };
  'workflow:complete': { workflow: WorkflowDefinition; context: ExecutionContext };
  'workflow:failed': { workflow: WorkflowDefinition; context: ExecutionContext; error: Error };
  'workflow:paused': { workflow: WorkflowDefinition; context: ExecutionContext };
  'workflow:cancelled': { workflow: WorkflowDefinition; context: ExecutionContext };
  'step:start': { step: WorkflowStep; context: ExecutionContext };
  'step:complete': { step: WorkflowStep; context: ExecutionContext };
  'step:failed': { step: WorkflowStep; context: ExecutionContext; error: Error };
  'step:skipped': { step: WorkflowStep; context: ExecutionContext; reason: string };
}
