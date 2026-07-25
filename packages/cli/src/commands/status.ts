import { logger } from '../utils/logger.js';
import { MyStack } from '@cshah-mystack/sdk';

export async function statusCommand(executionId: string): Promise<void> {
  logger.banner('MyStack Execution Status', `Checking execution: ${executionId}`);

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    let execution = mystack.getExecution(executionId);

    if (!execution) {
      // Try memory store lookup
      const stored = await mystack.getMemoryStore().get<import('@cshah-mystack/core').ExecutionContext>(
        `execution_${executionId}`,
      );
      if (stored) {
        execution = stored;
      }
    }

    if (!execution) {
      logger.error(`Execution ID '${executionId}' not found.`);
      process.exit(1);
    }

    logger.info(`Workflow ID:  ${execution.workflowId}`);
    logger.info(`Status:       ${execution.status.toUpperCase()}`);
    logger.info(`Started At:   ${execution.startedAt}`);
    logger.info(`Completed At: ${execution.completedAt ?? 'N/A'}`);

    console.log('\nSteps Executed:');
    const rows = execution.steps.map((s) => [
      s.stepId,
      s.agentId,
      s.status.toUpperCase(),
      s.startedAt ?? 'N/A',
      s.completedAt ?? 'N/A',
    ]);

    logger.table(['Step ID', 'Agent ID', 'Status', 'Started', 'Completed'], rows);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
