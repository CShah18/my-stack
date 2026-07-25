import { Middleware } from '../types.js';

export const loggingMiddleware: Middleware = async (agent, input, context, next) => {
  const startedAt = Date.now();
  context.logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    agentId: agent.id,
    message: `[Orchestrator] Starting execution of agent '${agent.name}' (${agent.id})`,
    data: { input },
  });

  try {
    const result = await next();
    const durationMs = Date.now() - startedAt;
    context.logs.push({
      timestamp: new Date().toISOString(),
      level: 'info',
      agentId: agent.id,
      message: `[Orchestrator] Completed execution of agent '${agent.name}' in ${durationMs}ms`,
      data: { status: result.status },
    });
    return result;
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const errorMsg = error instanceof Error ? error.message : String(error);
    context.logs.push({
      timestamp: new Date().toISOString(),
      level: 'error',
      agentId: agent.id,
      message: `[Orchestrator] Failed execution of agent '${agent.name}' after ${durationMs}ms: ${errorMsg}`,
    });
    throw error;
  }
};
