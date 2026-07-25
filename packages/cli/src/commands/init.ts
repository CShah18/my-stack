import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { logger } from '../utils/logger.js';
import { generateConfigTemplate } from '../utils/templates.js';

export interface InitOptions {
  force?: boolean;
}

export async function initCommand(projectName?: string, options?: InitOptions): Promise<void> {
  const name = projectName ?? 'mystack-app';
  const targetDir = resolve(process.cwd());

  logger.banner('MyStack Workspace Initialization', `Initializing project: ${name}`);

  const spinner = logger.spinner('Scaffolding project directory structure...');

  const dirs = [
    'agents',
    'skills',
    'workflows',
    'rules',
    'templates',
    'plugins',
    '.mystack',
  ];

  try {
    for (const d of dirs) {
      await mkdir(join(targetDir, d), { recursive: true });
    }

    const configPath = join(targetDir, 'mystack.config.yaml');
    let exists = false;
    try {
      await stat(configPath);
      exists = true;
    } catch {
      exists = false;
    }

    if (exists && !options?.force) {
      spinner.warn("'mystack.config.yaml' already exists. Use --force to overwrite.");
    } else {
      await writeFile(configPath, generateConfigTemplate(name), 'utf-8');
      spinner.succeed('Created mystack.config.yaml');
    }

    logger.success(`Successfully initialized MyStack workspace in ${targetDir}`);
    logger.info('Run `mystack doctor` to verify system health.');
    logger.info('Run `mystack list agents` to view registered agents.');
  } catch (error) {
    spinner.fail('Initialization failed');
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
