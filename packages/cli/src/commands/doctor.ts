import { join } from 'node:path';
import { stat } from 'node:fs/promises';
import { logger } from '../utils/logger.js';
import { MyStack } from '@mystack/sdk';

export async function doctorCommand(): Promise<void> {
  logger.banner('MyStack Doctor', 'System health and environment check');

  let passed = true;

  // 1. Check Node version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0] ?? '0', 10);
  if (majorVersion >= 20) {
    logger.success(`Node.js version: ${nodeVersion} (>= 20 LTS)`);
  } else {
    logger.error(`Node.js version: ${nodeVersion} (Required: >= 20 LTS)`);
    passed = false;
  }

  // 2. Check mystack.config.yaml
  const configPath = join(process.cwd(), 'mystack.config.yaml');
  try {
    await stat(configPath);
    logger.success('mystack.config.yaml found');
  } catch {
    logger.error('mystack.config.yaml missing. Run `mystack init` to create one.');
    passed = false;
  }

  // 3. Test SDK initialization and asset loading
  const spinner = logger.spinner('Validating asset schemas...');
  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const { agents, skills, workflows, rules } = await mystack.loadAllAssets();
    spinner.succeed(
      `Loaded and validated ${agents.length} agents, ${skills.length} skills, ${workflows.length} workflows, ${rules.length} rules`,
    );
  } catch (error) {
    spinner.fail('Asset validation failed');
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    passed = false;
  }

  console.log('');
  if (passed) {
    logger.success('All checks passed! MyStack workspace is healthy and ready.');
  } else {
    logger.error('Some health checks failed. Please fix the reported issues.');
    process.exit(1);
  }
}
