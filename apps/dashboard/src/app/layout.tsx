import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MyStack — AI Engineering Operating System',
  description: 'Visual operating dashboard for MyStack agents, workflows, skills, and rules.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Sidebar />
        <main
          style={{
            marginLeft: '260px',
            flex: 1,
            padding: '40px',
            minHeight: '100vh',
            maxWidth: 'calc(100vw - 260px)',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
