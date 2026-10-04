import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/db';
import { sameOrigin } from '@/lib/auth';

// proxy.js already guarantees the caller is a logged-in admin.

export async function GET() {
  return NextResponse.json(await getContent());
}

export async function PUT(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { data, note } = await request.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 });
    }
    if (JSON.stringify(data).length > 1_500_000) {
      return NextResponse.json({ error: 'Content is too large' }, { status: 413 });
    }
    await saveContent(data, String(note || '').slice(0, 120));
    revalidatePath('/', 'layout'); // refresh every public page
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Save content failed:', err);
    return NextResponse.json({ error: err.message || 'Failed to save' }, { status: 500 });
  }
}
