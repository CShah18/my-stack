import { NextResponse } from 'next/server';
import { MyStack } from '@mystack/sdk';

export async function GET() {
  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const config = mystack.getConfig();
    const assets = await mystack.loadAllAssets();

    return NextResponse.json({
      config,
      counts: {
        agents: assets.agents.length,
        skills: assets.skills.length,
        workflows: assets.workflows.length,
        rules: assets.rules.length,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
