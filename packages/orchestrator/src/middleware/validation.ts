import { Middleware } from '../types.js';

export const validationMiddleware: Middleware = async (agent, input, context, next) => {
  if (!agent.id || !agent.name) {
    throw new Error('Invalid agent definition: Missing required fields (id, name).');
  }

  // Verify agent dependencies if any
  if (agent.dependencies && agent.dependencies.length > 0) {
    const completedAgentIds = new Set(
      context.steps
        .filter((s) => s.status === 'completed')
        .map((s) => s.agentId),
    );

    for (const depId of agent.dependencies) {
      if (!completedAgentIds.has(depId)) {
        context.logs.push({
          timestamp: new Date().toISOString(),
          level: 'warn',
          agentId: agent.id,
          message: `[Orchestrator] Agent '${agent.id}' depends on '${depId}' which has not been completed yet in this execution.`,
        });
      }
    }
  }

  return next();
};
