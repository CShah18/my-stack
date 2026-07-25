import { logger } from '../utils/logger.js';
import { MyStack } from '@cshah-mystack/sdk';

export async function pluginListCommand(): Promise<void> {
  logger.banner('MyStack Plugin Registry', 'Listing discovered plugins');

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const plugins = mystack.getPlugins();

    if (plugins.length === 0) {
      logger.info('No plugins loaded. Place plugin directories in ./plugins');
      return;
    }

    const rows = plugins.map((p) => {
      const def = p.definition;
      const counts = [
        def.provides.agents?.length ? `${def.provides.agents.length} agents` : null,
        def.provides.skills?.length ? `${def.provides.skills.length} skills` : null,
        def.provides.workflows?.length ? `${def.provides.workflows.length} workflows` : null,
        def.provides.rules?.length ? `${def.provides.rules.length} rules` : null,
      ]
        .filter(Boolean)
        .join(', ');

      return [def.id, def.name, def.version, def.author, counts || 'None'];
    });

    logger.table(['Plugin ID', 'Name', 'Version', 'Author', 'Provided Assets'], rows);
    logger.info(`Total Plugins: ${plugins.length}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}

export async function pluginInfoCommand(pluginId: string): Promise<void> {
  logger.banner('MyStack Plugin Info', `Inspecting plugin: ${pluginId}`);

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const plugins = mystack.getPlugins();
    const plugin = plugins.find((p) => p.definition.id === pluginId);

    if (!plugin) {
      logger.error(`Plugin '${pluginId}' not found.`);
      process.exit(1);
    }

    const def = plugin.definition;
    logger.info(`ID:          ${def.id}`);
    logger.info(`Name:        ${def.name}`);
    logger.info(`Version:     ${def.version}`);
    logger.info(`Author:      ${def.author}`);
    logger.info(`Description: ${def.description}`);
    logger.info(`Path:        ${plugin.pluginDir}`);

    console.log('\nProvided Asset Directories:');
    logger.info(`  - Agents:    ${def.provides.agents?.join(', ') || 'None'}`);
    logger.info(`  - Skills:    ${def.provides.skills?.join(', ') || 'None'}`);
    logger.info(`  - Workflows: ${def.provides.workflows?.join(', ') || 'None'}`);
    logger.info(`  - Rules:     ${def.provides.rules?.join(', ') || 'None'}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
