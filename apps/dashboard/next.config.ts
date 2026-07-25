import type { NextConfig } from 'next';
import { resolve } from 'node:path';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@cshah-mystack/core',
    '@cshah-mystack/sdk',
    '@cshah-mystack/orchestrator',
    '@cshah-mystack/workflow-engine',
    '@cshah-mystack/memory',
    '@cshah-mystack/prompts',
  ],
  serverExternalPackages: ['yaml'],
  outputFileTracingRoot: resolve(__dirname, '../../'),
};

export default nextConfig;
