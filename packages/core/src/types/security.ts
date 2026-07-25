export type PermissionScope =
  | 'read:code'
  | 'write:code'
  | 'exec:command'
  | 'network:fetch'
  | 'secrets:read'
  | 'fs:read'
  | 'fs:write';

export interface SecretsProvider {
  get(key: string): Promise<string | undefined>;
  has(key: string): Promise<boolean>;
  list(): Promise<string[]>;
  set(key: string, value: string): Promise<void>;
}

export interface SecurityAuditEntry {
  timestamp: string;
  agentId: string;
  action: string;
  scope?: PermissionScope;
  allowed: boolean;
  reason?: string;
}

export interface SecurityContext {
  agentId: string;
  grantedScopes: PermissionScope[];
  auditLog: SecurityAuditEntry[];
}
