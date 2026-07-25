import { logger } from '../utils/logger.js';
import { MyStack } from '@cshah-mystack/sdk';

export async function infoCommand(): Promise<void> {
  logger.banner('MyStack Workspace Overview', 'Current project state & configuration');

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const config = mystack.getConfig();
    const assets = await mystack.loadAllAssets();

    logger.info(`Project Name: ${config.name}`);
    logger.info(`Version:      ${config.version}`);
    logger.info(`Root Dir:     ${process.cwd()}`);
    console.log('');

    logger.info('Registered Assets Summary:');
    logger.table(
      ['Asset Category', 'Configured Paths', 'Loaded Count'],
      [
        ['Agents', config.agents.join(', '), String(assets.agents.length)],
        ['Skills', config.skills.join(', '), String(assets.skills.length)],
        ['Workflows', config.workflows.join(', '), String(assets.workflows.length)],
        ['Rules', config.rules.join(', '), String(assets.rules.length)],
      ],
    );

    logger.info('Settings:');
    logger.info(`  - Log Level:     ${config.settings.logLevel}`);
    logger.info(`  - Output Dir:    ${config.settings.outputDir}`);
    logger.info(`  - Cache Enabled: ${config.settings.cacheEnabled}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
