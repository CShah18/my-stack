import { Middleware } from '../types.js';

export const retryMiddleware: Middleware = async (agent, input, context, next) => {
  let attempt = 0;
  const maxAttempts = 3;
  const backoffFactor = 1.5;
  let intervalMs = 100;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      const result = await next();
      result.retryCount = attempt - 1;
      return result;
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
      context.logs.push({
        timestamp: new Date().toISOString(),
        level: 'warn',
        agentId: agent.id,
        message: `[Orchestrator] Retry attempt ${attempt}/${maxAttempts} for agent '${agent.id}' after error. Waiting ${intervalMs}ms...`,
      });
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      intervalMs = Math.round(intervalMs * backoffFactor);
    }
  }

  throw new Error(`Max retry attempts reached for agent '${agent.id}'`);
};
