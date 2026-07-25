import { NextRequest, NextResponse } from 'next/server';
import { MyStack } from '@mystack/sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workflowId, variables } = body;

    if (!workflowId) {
      return NextResponse.json({ error: 'workflowId is required' }, { status: 400 });
    }

    const mystack = await MyStack.init({ root: process.cwd() });
    const execution = await mystack.runWorkflow(workflowId, variables);
    return NextResponse.json({ execution });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
