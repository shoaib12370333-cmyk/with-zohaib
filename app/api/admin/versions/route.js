import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { listVersions, getVersion, saveContent } from '@/lib/db';
import { sameOrigin } from '@/lib/auth';

export async function GET() {
  try {
    return NextResponse.json(await listVersions());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Restore an earlier version (this itself becomes a new version, so it is undoable).
export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { id } = await request.json();
    const data = await getVersion(Number(id));
    if (!data) return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    await saveContent(data, `Restored version #${id}`);
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Restore failed' }, { status: 500 });
  }
}
