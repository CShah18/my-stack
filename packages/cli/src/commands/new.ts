import { writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { logger } from '../utils/logger.js';
import {
  generateAgentTemplate,
  generateSkillTemplate,
  generateWorkflowTemplate,
  generateRuleTemplate,
} from '../utils/templates.js';

export async function newCommand(type: string, name: string): Promise<void> {
  const assetType = type.toLowerCase();
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
      logger.error(`Unknown asset type '${type}'. Valid types: agent, skill, workflow, rule.`);
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
