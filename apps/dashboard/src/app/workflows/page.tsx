'use client';

import { useState, useEffect } from 'react';
import { WorkflowDefinition, ExecutionContext } from '@mystack/core';
import { WorkflowStepViz } from '@/components/WorkflowStepViz';
import { Badge } from '@/components/Badge';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [execution, setExecution] = useState<ExecutionContext | null>(null);
  const [running, setRunning] = useState(false);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          Workflow Runner
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Execute multi-agent engineering pipelines and inspect live step executions
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
                {running ? '⚡ Running...' : '🚀 Execute Workflow'}
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                Pipeline Execution Steps
              </h3>
              <WorkflowStepViz
                steps={selectedWorkflow.steps}
                executedSteps={execution?.steps}
              />
            </div>

            {execution && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
                  Execution Context Logs
                </h3>
                <div
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {execution.logs.map((log, i) => (
                    <div key={i} style={{ color: log.level === 'error' ? '#fca5a5' : log.level === 'warn' ? '#fcd34d' : '#a78bfa' }}>
                      [{log.timestamp.slice(11, 19)}] {log.message}
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
