'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Overview', icon: '⚡' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/workflows', label: 'Workflows', icon: '🔄' },
  { href: '/catalog', label: 'Skills & Rules', icon: '📚' },
  { href: '/plugins', label: 'Plugins', icon: '🔌' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '260px',
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 20px',
        zIndex: 100,
      }}
    >
      <div style={{ marginBottom: '40px' }}>
        <h1
          className="gradient-text"
          style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}
        >
          MyStack
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
          AI Engineering OS v0.1.0
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-glass-active)' : 'transparent',
                border: isActive ? '1px solid var(--border-glass-bright)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: '16px',
          background: 'var(--bg-glass)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-secondary)',
              display: 'inline-block',
              boxShadow: '0 0 10px var(--accent-secondary)',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>System Active</span>
        </div>
      </div>
    </aside>
  );
}
