import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPosts, savePost, deletePost } from '@/lib/db';
import { sameOrigin } from '@/lib/auth';

const refresh = () => {
  revalidatePath('/blog', 'layout');
  revalidatePath('/');
  revalidatePath('/sitemap.xml');
};

export async function GET() {
  try {
    return NextResponse.json(await getPosts({ includeDrafts: true }));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const post = await request.json();
    if ((post.body || '').length > 200_000) return NextResponse.json({ error: 'Post is too long' }, { status: 413 });
    const saved = await savePost(post);
    refresh();
    return NextResponse.json(saved);
  } catch (err) {
    const dup = /duplicate key/i.test(err.message || '');
    return NextResponse.json({ error: dup ? 'Another post already uses that URL slug.' : err.message || 'Save failed' }, { status: dup ? 409 : 500 });
  }
}

export async function DELETE(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const id = Number(new URL(request.url).searchParams.get('id'));
    if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await deletePost(id);
    refresh();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 });
  }
}
