import { logger } from '../utils/logger.js';
import { MyStack } from '@mystack/sdk';

export interface RunOptions {
  var?: string[];
}

export async function runCommand(workflowId: string, options?: RunOptions): Promise<void> {
  logger.banner('MyStack Execution Engine', `Running workflow: ${workflowId}`);

  // Parse variables from --var key=value flags
  const variables: Record<string, unknown> = {};
  if (options?.var) {
    for (const v of options.var) {
      const [key, ...rest] = v.split('=');
      if (key) {
        variables[key] = rest.join('=');
      }
    }
  }

  const spinner = logger.spinner('Initializing workspace and loading workflows...');

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    spinner.succeed('Workspace loaded.');

    const engine = mystack.getWorkflowEngine();

    engine.on('step:start', ({ step }) => {
      logger.info(`⚡ [Step: ${step.name}] Running agent '${step.agentId}'...`);
    });

    engine.on('step:complete', ({ step }) => {
      logger.success(`✔ [Step: ${step.name}] Completed successfully`);
    });

    engine.on('step:skipped', ({ step, reason }) => {
      logger.warn(`⊘ [Step: ${step.name}] Skipped: ${reason}`);
    });

    engine.on('step:failed', ({ step, error }) => {
      logger.error(`✖ [Step: ${step.name}] Failed: ${error.message}`);
    });

    engine.on('workflow:paused', ({ workflow }) => {
      logger.warn(`⏸ Workflow '${workflow.name}' paused at step requiring approval. Use 'mystack status' to check state.`);
    });

    const execution = await mystack.runWorkflow(workflowId, variables);

    console.log('');
    if (execution.status === 'completed') {
      logger.success(`Workflow '${workflowId}' executed successfully! (Execution ID: ${execution.executionId})`);
      logger.info(`Total steps executed: ${execution.steps.length}`);
    } else if (execution.status === 'paused') {
      logger.warn(`Workflow '${workflowId}' is paused. (Execution ID: ${execution.executionId})`);
    } else {
      logger.error(`Workflow '${workflowId}' ended with status '${execution.status}'. (Execution ID: ${execution.executionId})`);
      process.exit(1);
    }
  } catch (error) {
    spinner.fail('Workflow execution failed');
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
