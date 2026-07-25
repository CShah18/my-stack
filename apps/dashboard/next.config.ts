import type { NextConfig } from 'next';
import { resolve } from 'node:path';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@mystack/core',
    '@mystack/sdk',
    '@mystack/orchestrator',
    '@mystack/workflow-engine',
    '@mystack/memory',
    '@mystack/prompts',
  ],
  serverExternalPackages: ['yaml'],
  outputFileTracingRoot: resolve(__dirname, '../../'),
};

export default nextConfig;
