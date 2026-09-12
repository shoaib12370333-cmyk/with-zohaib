import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correct = process.env.ADMIN_PASSWORD;

    if (!correct) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD is not set on the server yet. Add it in your Vercel project settings, then redeploy.' },
        { status: 500 }
      );
    }

    if (password !== correct) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = await createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error('Login failed:', err);
    return NextResponse.json({ error: `Login failed: ${err.message || 'unknown error'}` }, { status: 500 });
  }
}
