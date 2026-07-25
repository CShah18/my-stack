import { logger } from '../utils/logger.js';
import { MyStack } from '@cshah-mystack/sdk';

export async function listCommand(assetType?: string): Promise<void> {
  const type = (assetType ?? 'agents').toLowerCase();
  logger.banner('MyStack Asset Listing', `Listing: ${type}`);

  try {
    const mystack = await MyStack.init({ root: process.cwd() });

    switch (type) {
      case 'agents': {
        const agents = await mystack.loadAgents();
        const rows = agents.map((a) => [a.id, a.name, a.version, a.description]);
        logger.table(['ID', 'Name', 'Version', 'Description'], rows);
        logger.info(`Total Agents: ${agents.length}`);
        break;
      }
      case 'skills': {
        const skills = await mystack.loadSkills();
        const rows = skills.map((s) => [s.id, s.name, s.category, s.version, s.description]);
        logger.table(['ID', 'Name', 'Category', 'Version', 'Description'], rows);
        logger.info(`Total Skills: ${skills.length}`);
        break;
      }
      case 'workflows': {
        const workflows = await mystack.loadWorkflows();
        const rows = workflows.map((w) => [
          w.id,
          w.name,
          String(w.steps.length) + ' steps',
          w.version,
          w.description,
        ]);
        logger.table(['ID', 'Name', 'Steps', 'Version', 'Description'], rows);
        logger.info(`Total Workflows: ${workflows.length}`);
        break;
      }
      case 'rules': {
        const rules = await mystack.loadRules();
        const rows = rules.map((r) => [
          r.id,
          r.name,
          r.severity.toUpperCase(),
          r.category,
          r.description,
        ]);
        logger.table(['ID', 'Name', 'Severity', 'Category', 'Description'], rows);
        logger.info(`Total Rules: ${rules.length}`);
        break;
      }
      default: {
        logger.error(`Unknown asset type '${assetType}'. Valid types: agents, skills, workflows, rules.`);
        process.exit(1);
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
