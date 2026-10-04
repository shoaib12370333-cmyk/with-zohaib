import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sameOrigin } from '@/lib/auth';

export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
