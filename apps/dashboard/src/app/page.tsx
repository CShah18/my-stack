import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import Link from 'next/link';

async function getOverviewData() {
  try {
    const { MyStack } = await import('@cshah-mystack/sdk');
    const mystack = await MyStack.init({ root: process.cwd() });
    const config = mystack.getConfig();
    const assets = await mystack.loadAllAssets();
    return {
      config,
      counts: {
        agents: assets.agents.length,
        skills: assets.skills.length,
        workflows: assets.workflows.length,
        rules: assets.rules.length,
      },
      workflows: assets.workflows,
      agents: assets.agents,
    };
  } catch {
    return {
      config: { name: 'mystack', version: '0.1.0' },
      counts: { agents: 0, skills: 0, workflows: 0, rules: 0 },
      workflows: [],
      agents: [],
    };
  }
}

export default async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          System Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
          Real-time metrics and registered assets for {data.config.name}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <StatCard
          icon="🤖"
          title="AI Agents"
          value={data.counts.agents}
          subtitle="Specialized autonomous roles"
          accentColor="var(--accent-primary)"
        />
        <StatCard
          icon="🔄"
          title="Workflows"
          value={data.counts.workflows}
          subtitle="Multi-agent pipelines"
          accentColor="var(--accent-secondary)"
        />
        <StatCard
          icon="📚"
          title="Skills"
          value={data.counts.skills}
          subtitle="Reusable domain patterns"
          accentColor="var(--accent-warning)"
        />
        <StatCard
          icon="🛡️"
          title="Rules"
          value={data.counts.rules}
          subtitle="Quality & security constraints"
          accentColor="var(--accent-danger)"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Workflows</h2>
            <Link href="/workflows">
              <Badge variant="primary">View All →</Badge>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.workflows.map((wf) => (
              <div
                key={wf.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {wf.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {wf.description}
                  </p>
                </div>
                <Badge variant="secondary">{wf.steps.length} steps</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
            Featured Agents
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.agents.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--accent-primary-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                  }}
                >
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{agent.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agent.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
