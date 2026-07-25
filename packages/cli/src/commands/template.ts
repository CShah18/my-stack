import { logger } from '../utils/logger.js';
import { MyStack } from '@cshah-mystack/sdk';

export async function templateListCommand(): Promise<void> {
  logger.banner('MyStack Template Library', 'Available project scaffolds');

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const templates = mystack.listTemplates();

    if (templates.length === 0) {
      logger.info('No templates found. Add template YAML files to ./templates/');
      return;
    }

    const rows = templates.map((t) => [
      t.id,
      t.name,
      t.category,
      t.version,
      `${t.files.length} files`,
      `${t.variables.filter((v) => v.required).length} required vars`,
    ]);

    logger.table(
      ['ID', 'Name', 'Category', 'Version', 'Files', 'Variables'],
      rows,
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}

export async function templateInfoCommand(templateId: string): Promise<void> {
  logger.banner('MyStack Template Inspector', `Template: ${templateId}`);

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const templates = mystack.listTemplates();
    const template = templates.find((t) => t.id === templateId);

    if (!template) {
      logger.error(`Template '${templateId}' not found.`);
      return;
    }

    logger.info(`Name:        ${template.name}`);
    logger.info(`Description: ${template.description}`);
    logger.info(`Version:     ${template.version}`);
    logger.info(`Category:    ${template.category}`);
    logger.info('');

    logger.info('Variables:');
    const varRows = template.variables.map((v) => [
      v.name,
      v.description,
      v.required ? '✔ Required' : 'Optional',
      v.defaultValue ?? '-',
    ]);
    logger.table(['Name', 'Description', 'Required', 'Default'], varRows);

    logger.info('Generated Files:');
    const fileRows = template.files.map((f) => [
      f.path,
      `${f.content.length} chars`,
      f.isExecutable ? '✔' : '-',
    ]);
    logger.table(['Path Pattern', 'Size', 'Executable'], fileRows);

    if (template.hooks?.postGenerate?.length) {
      logger.info('Post-Generate Hooks:');
      for (const cmd of template.hooks.postGenerate) {
        logger.info(`  $ ${cmd}`);
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
