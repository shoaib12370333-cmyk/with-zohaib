import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/db';

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error('Failed to load messages:', err);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}
