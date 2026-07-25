import { WorkflowStep, StepExecution } from '@mystack/core';
import { Badge } from './Badge';

interface WorkflowStepVizProps {
  steps: WorkflowStep[];
  executedSteps?: StepExecution[];
  currentStepIndex?: number;
}

export function WorkflowStepViz({ steps, executedSteps = [], currentStepIndex = -1 }: WorkflowStepVizProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {steps.map((step, index) => {
        const execution = executedSteps.find((e) => e.agentId === step.agentId || e.stepId === step.id);
        const isRunning = currentStepIndex === index;
        const isCompleted = execution?.status === 'completed';
        const isFailed = execution?.status === 'failed';

        let badgeVariant: 'primary' | 'secondary' | 'warning' | 'danger' | 'neutral' = 'neutral';
        let statusIcon = '⏳';
        let statusLabel = 'Pending';

        if (isCompleted) {
          badgeVariant = 'secondary';
          statusIcon = '✔';
          statusLabel = 'Completed';
        } else if (isFailed) {
          badgeVariant = 'danger';
          statusIcon = '✖';
          statusLabel = 'Failed';
        } else if (isRunning) {
          badgeVariant = 'warning';
          statusIcon = '⚡';
          statusLabel = 'Running';
        }

        return (
          <div
            key={step.id}
            className="glass-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderColor: isRunning ? 'var(--accent-warning)' : isCompleted ? 'rgba(0, 212, 170, 0.4)' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isCompleted
                    ? 'rgba(0, 212, 170, 0.2)'
                    : isFailed
                    ? 'rgba(255, 92, 92, 0.2)'
                    : isRunning
                    ? 'rgba(255, 184, 77, 0.2)'
                    : 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass-bright)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: isCompleted
                    ? '#5eead4'
                    : isFailed
                    ? '#fca5a5'
                    : isRunning
                    ? '#fcd34d'
                    : 'var(--text-muted)',
                }}
              >
                {index + 1}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {step.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Agent: <span style={{ color: 'var(--accent-primary)' }}>{step.agentId}</span> — {step.description}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Badge variant={badgeVariant}>
                {statusIcon} {statusLabel}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
