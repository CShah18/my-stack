import { ExecutionStatus } from '@cshah-mystack/core';

export class WorkflowStateMachine {
  private allowedTransitions: Record<ExecutionStatus, ExecutionStatus[]> = {
    pending: ['running', 'cancelled'],
    running: ['completed', 'failed', 'paused', 'cancelled'],
    paused: ['running', 'cancelled'],
    completed: [],
    failed: [],
    cancelled: [],
  };

  public canTransition(current: ExecutionStatus, next: ExecutionStatus): boolean {
    return this.allowedTransitions[current].includes(next);
  }

  public transition(current: ExecutionStatus, next: ExecutionStatus): ExecutionStatus {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid state transition from '${current}' to '${next}'`);
    }
    return next;
  }
}
