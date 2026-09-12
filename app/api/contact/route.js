import { NextResponse } from 'next/server';
import { saveMessage } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body || {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await saveMessage(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Could not save message' }, { status: 500 });
  }
}
