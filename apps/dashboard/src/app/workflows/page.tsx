'use client';

import { useState, useEffect } from 'react';
import { WorkflowDefinition, ExecutionContext, SecurityAuditEntry } from '@cshah-mystack/core';
import { WorkflowStepViz } from '@/components/WorkflowStepViz';
import { Badge } from '@/components/Badge';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [execution, setExecution] = useState<ExecutionContext | null>(null);
  const [running, setRunning] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  useEffect(() => {
    fetch('/api/workflows')
      .then((res) => res.json())
      .then((data) => {
        setWorkflows(data.workflows ?? []);
        if (data.workflows && data.workflows.length > 0) {
          setSelectedWorkflow(data.workflows[0]);
        }
      });
  }, []);

  const handleRunWorkflow = async () => {
    if (!selectedWorkflow) return;
    setRunning(true);
    setExecution(null);

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: selectedWorkflow.id }),
      });
      const data = await res.json();
      if (data.execution) {
        setExecution(data.execution);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const logs = execution?.logs ?? [];
  const filteredLogs = logs.filter((l) => (logFilter === 'all' ? true : l.level === logFilter));

  const securityAudit = (execution?.variables as Record<string, unknown>)?.[
    '_securityAudit'
  ] as SecurityAuditEntry[] | undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          Workflow Runner & Live Logs
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Execute multi-agent engineering pipelines, stream real-time logs, and inspect security audit entries
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Available Pipelines
          </h3>
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => {
                setSelectedWorkflow(wf);
                setExecution(null);
              }}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: selectedWorkflow?.id === wf.id ? 'var(--bg-glass-active)' : 'var(--bg-glass)',
                border: selectedWorkflow?.id === wf.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{wf.name}</h4>
                <Badge variant="neutral">{wf.steps.length} steps</Badge>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {wf.description}
              </p>
            </div>
          ))}
        </div>

        {selectedWorkflow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedWorkflow.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                  {selectedWorkflow.description}
                </p>
              </div>
              <button
                onClick={handleRunWorkflow}
                disabled={running}
                className="gradient-btn"
                style={{ opacity: running ? 0.6 : 1 }}
              >
                {running ? '⚡ Executing Pipeline...' : '🚀 Execute Workflow'}
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  Pipeline Execution Steps
                </h3>
                {execution && (
                  <Badge variant={execution.status === 'completed' ? 'secondary' : execution.status === 'failed' ? 'danger' : 'warning'}>
                    Status: {execution.status.toUpperCase()}
                  </Badge>
                )}
              </div>
              <WorkflowStepViz
                steps={selectedWorkflow.steps}
                executedSteps={execution?.steps}
              />
            </div>

            {/* Live Logs Terminal */}
            {execution && (
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    📟 Live Execution Stream Logs ({filteredLogs.length})
                  </h3>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(['all', 'info', 'warn', 'error'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setLogFilter(lvl)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '0.75rem',
                          background: logFilter === lvl ? 'var(--accent-primary)' : 'var(--bg-glass)',
                          color: '#fff',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#090d16',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {filteredLogs.map((log, i) => (
                    <div
                      key={i}
                      style={{
                        color:
                          log.level === 'error'
                            ? '#fca5a5'
                            : log.level === 'warn'
                            ? '#fcd34d'
                            : '#a78bfa',
                      }}
                    >
                      [{log.timestamp.slice(11, 19)}] [{log.level.toUpperCase()}] {log.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Audit Panel */}
            {securityAudit && securityAudit.length > 0 && (
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  🛡️ Security Audit Log ({securityAudit.length} checks)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {securityAudit.map((audit, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>
                          {audit.agentId}
                        </span>{' '}
                        — {audit.reason}
                      </div>
                      <Badge variant={audit.allowed ? 'secondary' : 'danger'}>
                        {audit.allowed ? '✔ Allowed' : '✖ Blocked'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
