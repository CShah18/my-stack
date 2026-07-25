import { Badge } from '@/components/Badge';

async function getSettingsData() {
  try {
    const { MyStack, SecretMasker } = await import('@mystack/sdk');
    const mystack = await MyStack.init({ root: process.cwd() });
    const config = mystack.getConfig();
    const agents = await mystack.loadAgents();
    const provider = mystack.getSecretsProvider();

    const knownKeys = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY'];
    const secretsStatus = await Promise.all(
      knownKeys.map(async (key) => {
        const hasKey = await provider.has(key);
        const val = hasKey ? await provider.get(key) : undefined;
        return {
          key,
          active: hasKey,
          masked: val ? SecretMasker.mask(val) : 'Not Configured',
        };
      }),
    );

    const agentPermissions = agents.map((a) => ({
      id: a.id,
      name: a.name,
      permissions: a.permissions ?? ['read:code'],
    }));

    return {
      config,
      nodeVersion: process.version,
      env: process.env.NODE_ENV ?? 'development',
      secretsStatus,
      agentPermissions,
    };
  } catch {
    return {
      config: {
        name: 'mystack',
        version: '0.1.0',
        agents: ['./agents'],
        skills: ['./skills'],
        workflows: ['./workflows'],
        rules: ['./rules'],
        templates: ['./templates'],
        plugins: ['./plugins'],
        settings: { logLevel: 'info', outputDir: '.mystack', cacheEnabled: true },
      },
      nodeVersion: process.version,
      env: 'development',
      secretsStatus: [],
      agentPermissions: [],
    };
  }
}

export default async function SettingsPage() {
  const data = await getSettingsData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          Project Settings & Security
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Workspace configuration, API secrets management, and agent security audit
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Workspace Config */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>mystack.config.yaml</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Project Name</span>
              <span style={{ fontWeight: 600 }}>{data.config.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Framework Version</span>
              <Badge variant="primary">v{data.config.version}</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Log Level</span>
              <span style={{ fontWeight: 600 }}>{data.config.settings.logLevel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Output Directory</span>
              <span style={{ fontWeight: 600 }}>{data.config.settings.outputDir}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cache Enabled</span>
              <Badge variant={data.config.settings.cacheEnabled ? 'secondary' : 'warning'}>
                {String(data.config.settings.cacheEnabled)}
              </Badge>
            </div>
          </div>
        </div>

        {/* API Secrets Manager */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>🔑 Secrets & API Keys</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.secretsStatus.map((s) => (
              <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{s.key}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.masked}</div>
                </div>
                <Badge variant={s.active ? 'secondary' : 'warning'}>
                  {s.active ? '✔ Configured' : '✖ Missing'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Permissions Security Audit */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>🛡️ Agent Security Audit & Permission Scopes</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Enforces least privilege execution access control per agent before dispatch
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {data.agentPermissions.map((agent) => (
            <div
              key={agent.id}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{agent.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agent.id}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {agent.permissions.map((p) => (
                  <Badge key={p} variant="primary">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
