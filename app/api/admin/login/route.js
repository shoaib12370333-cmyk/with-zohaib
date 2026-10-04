import { NextResponse } from 'next/server';
import { createSessionToken, safeEqual, clientKey, sameOrigin, SESSION_COOKIE } from '@/lib/auth';
import { rateLimit, clearRateLimit } from '@/lib/db';
import { verifyTotp } from '@/lib/totp';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { password, code } = await request.json();
    const correct = process.env.ADMIN_PASSWORD;
    const totpSecret = process.env.ADMIN_TOTP_SECRET;

    if (!correct) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD is not set on the server yet. Add it in your environment variables, then redeploy.' }, { status: 500 });
    }
    if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
      return NextResponse.json({ error: 'SESSION_SECRET is not set on the server yet. Add it in your environment variables, then redeploy.' }, { status: 500 });
    }

    // Brute-force protection: 8 attempts per 15 minutes per visitor.
    const key = `login:${clientKey(request)}`;
    const limit = await rateLimit(key, 8, 15 * 60);
    if (!limit.ok) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minute(s).` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const passwordOk = safeEqual(password, correct);

    // Step 1 (password) — reveal whether a 2FA code is needed only after the password is right.
    if (passwordOk && totpSecret && !code) {
      return NextResponse.json({ needsCode: true });
    }

    const codeOk = !totpSecret || verifyTotp(totpSecret, code);
    if (!passwordOk || !codeOk) {
      await sleep(600);
      return NextResponse.json({ error: passwordOk ? 'Incorrect 2FA code' : 'Incorrect password' }, { status: 401 });
    }

    await clearRateLimit(key);
    const token = await createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });
    return res;
  } catch (err) {
    console.error('Login failed:', err);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
