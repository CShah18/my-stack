import { NextResponse } from 'next/server';
import { MyStack } from '@mystack/sdk';

export async function GET() {
  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const skills = await mystack.loadSkills();
    return NextResponse.json({ skills });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
