import { AgentDefinition } from '@mystack/core';
import { Badge } from './Badge';

interface AgentCardProps {
  agent: AgentDefinition;
  onClick?: () => void;
  isSelected?: boolean;
}

export function AgentCard({ agent, onClick, isSelected }: AgentCardProps) {
  return (
    <div
      onClick={onClick}
      className="glass-panel glass-panel-interactive animate-fade-in"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        borderColor: isSelected ? 'var(--accent-primary)' : undefined,
        boxShadow: isSelected ? '0 0 20px var(--accent-primary-glow)' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {agent.name}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {agent.id}</span>
        </div>
        <Badge variant="primary">v{agent.version}</Badge>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {agent.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {agent.capabilities.slice(0, 3).map((cap) => (
          <Badge key={cap} variant="neutral">
            {cap}
          </Badge>
        ))}
        {agent.capabilities.length > 3 && (
          <Badge variant="neutral">+{agent.capabilities.length - 3} more</Badge>
        )}
      </div>
    </div>
  );
}
