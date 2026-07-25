import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { MyStack } = await import('@mystack/sdk');
    const mystack = await MyStack.init({ root: process.cwd() });
    const templates = mystack.listTemplates();
    return NextResponse.json({ templates });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg, templates: [] }, { status: 500 });
  }
}
