'use client';

import { useState, useEffect } from 'react';
import { AgentDefinition } from '@mystack/core';
import { AgentCard } from '@/components/AgentCard';
import { Badge } from '@/components/Badge';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents ?? []);
        if (data.agents && data.agents.length > 0) {
          setSelectedAgent(data.agents[0]);
        }
        setLoading(false);
      });
  }, []);

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
            Agent Registry
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Explore autonomous specialized agents registered in your workspace
          </p>
        </div>
        <input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            outline: 'none',
            minWidth: '260px',
          }}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading agent definitions...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
              maxHeight: 'calc(100vh - 180px)',
              overflowY: 'auto',
            }}
          >
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent?.id === agent.id}
                onClick={() => setSelectedAgent(agent)}
              />
            ))}
          </div>

          {selectedAgent && (
            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedAgent.name}</h2>
                <Badge variant="primary">v{selectedAgent.version}</Badge>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 16px 0' }}>
                ID: {selectedAgent.id}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Responsibilities
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {selectedAgent.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Quality Checklist
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedAgent.qualityChecklist.map((check, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>✔</span>
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    System Prompt Template
                  </h4>
                  <pre
                    style={{
                      background: 'var(--bg-primary)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: '#a78bfa',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto',
                    }}
                  >
                    {selectedAgent.prompt.system}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
