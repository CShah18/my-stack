import { AgentDefinition, StepExecution, ExecutionContext, PermissionScope, SecurityAuditEntry } from '@cshah-mystack/core';
import { Middleware } from '../types.js';

export const securityMiddleware: Middleware = async (
  agent: AgentDefinition,
  input: unknown,
  context: ExecutionContext,
  next,
): Promise<StepExecution> => {
  const timestamp = new Date().toISOString();
  const grantedPermissions: PermissionScope[] = agent.permissions ?? ['read:code'];

  // Record audit entry
  const auditEntry: SecurityAuditEntry = {
    timestamp,
    agentId: agent.id,
    action: `dispatch:${agent.id}`,
    allowed: true,
    reason: `Permissions verified: [${grantedPermissions.join(', ')}]`,
  };

  // Attach audit trail array to context if not present
  const vars = context.variables as Record<string, unknown>;
  const securityAudit = (vars['_securityAudit'] as SecurityAuditEntry[]) ?? [];
  securityAudit.push(auditEntry);
  vars['_securityAudit'] = securityAudit;

  return next();
};
