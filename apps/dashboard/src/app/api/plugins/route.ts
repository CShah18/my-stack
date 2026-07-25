import { NextResponse } from 'next/server';
import { MyStack } from '@cshah-mystack/sdk';

export async function GET() {
  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const plugins = mystack.getPlugins().map((p) => p.definition);
    return NextResponse.json({ plugins });
  } catch {
    return NextResponse.json({ plugins: [] }, { status: 500 });
  }
}
