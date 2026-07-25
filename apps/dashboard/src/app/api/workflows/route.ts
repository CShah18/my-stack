import { NextResponse } from 'next/server';
import { MyStack } from '@cshah-mystack/sdk';

export async function GET() {
  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const workflows = await mystack.loadWorkflows();
    return NextResponse.json({ workflows });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
