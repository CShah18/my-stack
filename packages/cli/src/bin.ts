import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { runCommand } from './commands/run.js';
import { statusCommand } from './commands/status.js';
import { listCommand } from './commands/list.js';
import { newCommand } from './commands/new.js';
import { infoCommand } from './commands/info.js';
import { pluginListCommand, pluginInfoCommand } from './commands/plugin.js';
import { authSetKeyCommand, authListKeysCommand, authCheckCommand } from './commands/auth.js';
import { templateListCommand, templateInfoCommand } from './commands/template.js';

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
  .description('Scaffold a new asset or project from template (agent, skill, workflow, rule, nextjs-app, agent-plugin, express-api)')
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

const authCmd = program
  .command('auth')
  .description('Manage API keys, secrets, and auth health');

authCmd
  .command('set-key <key> <value>')
  .description('Set a runtime secret key')
  .action((key, value) => authSetKeyCommand(key, value));

authCmd
  .command('list-keys')
  .description('List configured secrets and API keys (masked)')
  .action(() => authListKeysCommand());

authCmd
  .command('check')
  .description('Perform security and auth environment check')
  .action(() => authCheckCommand());

const templateCmd = program
  .command('template')
  .description('Browse and inspect available project templates');

templateCmd
  .command('list')
  .description('List all available project templates')
  .action(() => templateListCommand());

templateCmd
  .command('info <template-id>')
  .description('Display detailed template information and variables')
  .action((templateId) => templateInfoCommand(templateId));

program.parseAsync(process.argv).catch((err) => {
  console.error('Fatal CLI error:', err);
  process.exit(1);
});
