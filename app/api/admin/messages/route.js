import { NextResponse } from 'next/server';
import { getMessages, setMessageStatus, deleteMessage } from '@/lib/db';
import { sameOrigin } from '@/lib/auth';

const STATUSES = ['new', 'read', 'replied', 'archived'];

export async function GET(request) {
  try {
    const status = new URL(request.url).searchParams.get('status') || 'all';
    return NextResponse.json(await getMessages(status));
  } catch (err) {
    console.error('Failed to load messages:', err);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { id, status } = await request.json();
    if (!STATUSES.includes(status) || !Number.isInteger(id)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    await setMessageStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const id = Number(new URL(request.url).searchParams.get('id'));
    if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await deleteMessage(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 });
  }
}
