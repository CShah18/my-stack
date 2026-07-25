import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { runCommand } from './commands/run.js';
import { statusCommand } from './commands/status.js';
import { listCommand } from './commands/list.js';
import { newCommand } from './commands/new.js';
import { infoCommand } from './commands/info.js';
import { pluginListCommand, pluginInfoCommand } from './commands/plugin.js';

const program = new Command();

program
  .name('mystack')
  .description('MyStack — AI Engineering Operating System CLI')
  .version('0.1.0');

program
  .command('init [project-name]')
  .description('Initialize a new MyStack project workspace')
  .option('-f, --force', 'Overwrite existing mystack.config.yaml')
  .action((projectName, options) => initCommand(projectName, options));

program
  .command('doctor')
  .description('Check system health and environment setup')
  .action(() => doctorCommand());

program
  .command('run <workflow-id>')
  .description('Run a MyStack workflow pipeline')
  .option('-v, --var <key=value...>', 'Variables to pass to workflow execution')
  .action((workflowId, options) => runCommand(workflowId, options));

program
  .command('status <execution-id>')
  .description('Check execution status of a workflow')
  .action((executionId) => statusCommand(executionId));

program
  .command('list [asset-type]')
  .description('List registered assets (agents, skills, workflows, rules)')
  .action((assetType) => listCommand(assetType));

program
  .command('new <type> <name>')
  .description('Scaffold a new asset YAML (agent, skill, workflow, rule)')
  .action((type, name) => newCommand(type, name));

program
  .command('info')
  .description('Display current MyStack project configuration and asset counts')
  .action(() => infoCommand());

const pluginCmd = program
  .command('plugin')
  .description('Manage and inspect MyStack plugins');

pluginCmd
  .command('list')
  .description('List all loaded plugins and their provided assets')
  .action(() => pluginListCommand());

pluginCmd
  .command('info <plugin-id>')
  .description('Display detailed breakdown of a specific plugin')
  .action((pluginId) => pluginInfoCommand(pluginId));

program.parseAsync(process.argv).catch((err) => {
  console.error('Fatal CLI error:', err);
  process.exit(1);
});
