import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/db';

// Middleware already guarantees requests here are from a logged-in admin.

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request) {
  try {
    const data = await request.json();
    await saveContent(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Save content failed:', err);
    return NextResponse.json({ error: err.message || 'Failed to save' }, { status: 500 });
  }
}
