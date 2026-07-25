'use client';

import { useState, useEffect } from 'react';
import { PluginDefinition } from '@cshah-mystack/core';
import { Badge } from '@/components/Badge';

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<PluginDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plugins')
      .then((res) => res.json())
      .then((data) => {
        setPlugins(data.plugins ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          Plugin Registry
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Extensible plugin packages bundling agents, skills, workflows, and rules
        </p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading plugins...</p>
      ) : plugins.length === 0 ? (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No plugins loaded</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Add plugin directories to <code>./plugins/</code> to extend MyStack.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="glass-panel animate-fade-in"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{plugin.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Author: {plugin.author}
                  </p>
                </div>
                <Badge variant="primary">v{plugin.version}</Badge>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {plugin.description}
              </p>

              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Provided Assets:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {plugin.provides.agents && plugin.provides.agents.length > 0 && (
                    <Badge variant="secondary">🤖 Agents ({plugin.provides.agents.length})</Badge>
                  )}
                  {plugin.provides.skills && plugin.provides.skills.length > 0 && (
                    <Badge variant="warning">📚 Skills ({plugin.provides.skills.length})</Badge>
                  )}
                  {plugin.provides.workflows && plugin.provides.workflows.length > 0 && (
                    <Badge variant="primary">🔄 Workflows ({plugin.provides.workflows.length})</Badge>
                  )}
                  {plugin.provides.rules && plugin.provides.rules.length > 0 && (
                    <Badge variant="danger">🛡️ Rules ({plugin.provides.rules.length})</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
