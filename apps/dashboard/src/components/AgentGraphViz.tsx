'use client';

import { useState } from 'react';
import { AgentDefinition } from '@mystack/core';
import { Badge } from './Badge';

interface AgentGraphVizProps {
  agents: AgentDefinition[];
  onSelectAgent?: (agent: AgentDefinition) => void;
  selectedAgentId?: string;
}

export function AgentGraphViz({ agents, onSelectAgent, selectedAgentId }: AgentGraphVizProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  // Group agents into explicit functional tiers
  const tiers: {
    Lead: AgentDefinition[];
    Engineering: AgentDefinition[];
    Quality: AgentDefinition[];
    Operations: AgentDefinition[];
  } = {
    Lead: [],
    Engineering: [],
    Quality: [],
    Operations: [],
  };

  for (const agent of agents) {
    if (agent.id.includes('lead') || agent.id.includes('ceo') || agent.id.includes('pm') || agent.id.includes('architect')) {
      tiers.Lead.push(agent);
    } else if (agent.id.includes('qa') || agent.id.includes('security') || agent.id.includes('testing')) {
      tiers.Quality.push(agent);
    } else if (agent.id.includes('release') || agent.id.includes('ops') || agent.id.includes('devops')) {
      tiers.Operations.push(agent);
    } else {
      tiers.Engineering.push(agent);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Agent collaboration topology and handoff relations
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Badge variant="primary">Lead ({tiers.Lead.length})</Badge>
          <Badge variant="secondary">Engineering ({tiers.Engineering.length})</Badge>
          <Badge variant="warning">Quality ({tiers.Quality.length})</Badge>
          <Badge variant="neutral">Operations ({tiers.Operations.length})</Badge>
        </div>
      </div>

      <div
        className="glass-panel"
        style={{
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
        }}
      >
        {Object.entries(tiers).map(([tierName, tierAgents]) => (
          <div
            key={tierName}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
              {tierName} Tier
            </h4>

            {tierAgents.map((agent) => {
              const isSelected = selectedAgentId === agent.id;
              const isHovered = hoveredAgent === agent.id;

              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectAgent?.(agent)}
                  onMouseEnter={() => setHoveredAgent(agent.id)}
                  onMouseLeave={() => setHoveredAgent(null)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: isSelected
                      ? 'var(--accent-primary)'
                      : isHovered
                      ? 'rgba(99, 102, 241, 0.2)'
                      : 'var(--bg-glass)',
                    border: isSelected
                      ? '1px solid #818cf8'
                      : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{agent.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v{agent.version}</span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: isSelected ? '#e0e7ff' : 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {agent.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {(agent.permissions ?? ['read:code']).map((p) => (
                      <span
                        key={p}
                        style={{
                          fontSize: '0.65rem',
                          background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.15)',
                          color: isSelected ? '#fff' : '#a5b4fc',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
