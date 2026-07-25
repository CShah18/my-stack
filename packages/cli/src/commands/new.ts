import { writeFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { logger } from '../utils/logger.js';
import {
  generateAgentTemplate,
  generateSkillTemplate,
  generateWorkflowTemplate,
  generateRuleTemplate,
} from '../utils/templates.js';
import { MyStack, TemplateEngine } from '@mystack/sdk';

export async function newCommand(type: string, name: string): Promise<void> {
  const assetType = type.toLowerCase();

  // Check if 'type' matches a template ID (project scaffolding)
  if (['nextjs-app', 'agent-plugin', 'express-api'].includes(assetType) || assetType === 'template') {
    return newFromTemplate(assetType === 'template' ? name : assetType, name);
  }

  const id = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const displayName = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  logger.banner('MyStack Scaffold Generator', `Creating new ${assetType}: ${id}`);

  let dir = '';
  let filename = '';
  let content = '';

  switch (assetType) {
    case 'agent':
      dir = 'agents';
      filename = `${id}.agent.yaml`;
      content = generateAgentTemplate(id, displayName, `Custom agent for ${displayName}`);
      break;
    case 'skill':
      dir = 'skills';
      filename = `${id}.skill.yaml`;
      content = generateSkillTemplate(id, displayName, `Custom skill for ${displayName}`);
      break;
    case 'workflow':
      dir = 'workflows';
      filename = `${id}.workflow.yaml`;
      content = generateWorkflowTemplate(id, displayName, `Custom workflow for ${displayName}`);
      break;
    case 'rule':
      dir = 'rules';
      filename = `${id}.rule.yaml`;
      content = generateRuleTemplate(id, displayName, `Custom rule for ${displayName}`);
      break;
    default:
      logger.error(`Unknown asset type '${type}'. Valid types: agent, skill, workflow, rule, template.`);
      logger.info('For project scaffolds, use: mystack new <template-id> <project-name>');
      process.exit(1);
  }

  const targetPath = join(process.cwd(), dir, filename);

  try {
    try {
      await stat(targetPath);
      logger.error(`File '${targetPath}' already exists.`);
      process.exit(1);
    } catch {
      // File doesn't exist, proceed
    }

    await writeFile(targetPath, content, 'utf-8');
    logger.success(`Created ${assetType} definition at ${targetPath}`);
    logger.info(`Run \`mystack doctor\` to validate the new asset.`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to create asset: ${msg}`);
    process.exit(1);
  }
}

async function newFromTemplate(templateId: string, projectName: string): Promise<void> {
  logger.banner('MyStack Template Scaffolding', `Template: ${templateId} → ${projectName}`);

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const templates = mystack.listTemplates();
    const template = templates.find((t) => t.id === templateId);

    if (!template) {
      logger.error(`Template '${templateId}' not found.`);
      logger.info(`Available templates: ${templates.map((t) => t.id).join(', ') || 'none loaded'}`);
      process.exit(1);
    }

    const engine = mystack.getTemplateEngine();
    const variables: Record<string, string> = {
      projectName,
      pluginName: projectName,
    };

    const result = engine.render(template, variables);

    for (const file of result.files) {
      const targetPath = join(process.cwd(), file.path);
      const dir = dirname(targetPath);
      await mkdir(dir, { recursive: true });
      await writeFile(targetPath, file.content, 'utf-8');
      logger.success(`  Created ${file.path}`);
    }

    logger.success(`\nScaffolded ${result.files.length} files from template '${templateId}'.`);

    if (result.postGenerateCommands.length > 0) {
      logger.info('\nPost-generation commands (run manually):');
      for (const cmd of result.postGenerateCommands) {
        logger.info(`  $ ${cmd}`);
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Template scaffolding failed: ${msg}`);
    process.exit(1);
  }
}
