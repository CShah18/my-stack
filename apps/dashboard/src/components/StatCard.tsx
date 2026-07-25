interface StatCardProps {
  icon: string;
  title: string;
  value: number | string;
  subtitle: string;
  accentColor?: string;
}

export function StatCard({ icon, title, value, subtitle, accentColor = 'var(--accent-primary)' }: StatCardProps) {
  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: accentColor,
          filter: 'blur(50px)',
          opacity: 0.2,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
          {title}
        </span>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {subtitle}
      </div>
    </div>
  );
}
