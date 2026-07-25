type BadgeVariant = 'primary' | 'secondary' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const styles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
    primary: {
      bg: 'rgba(124, 92, 255, 0.15)',
      color: '#a78bfa',
      border: 'rgba(124, 92, 255, 0.3)',
    },
    secondary: {
      bg: 'rgba(0, 212, 170, 0.15)',
      color: '#5eead4',
      border: 'rgba(0, 212, 170, 0.3)',
    },
    warning: {
      bg: 'rgba(255, 184, 77, 0.15)',
      color: '#fcd34d',
      border: 'rgba(255, 184, 77, 0.3)',
    },
    danger: {
      bg: 'rgba(255, 92, 92, 0.15)',
      color: '#fca5a5',
      border: 'rgba(255, 92, 92, 0.3)',
    },
    neutral: {
      bg: 'rgba(255, 255, 255, 0.06)',
      color: 'var(--text-secondary)',
      border: 'var(--border-glass)',
    },
  };

  const style = styles[variant] ?? styles.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {children}
    </span>
  );
}
