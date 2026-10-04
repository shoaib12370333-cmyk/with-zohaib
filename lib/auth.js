import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'admin_session';
const DEV_SECRET = 'dev-only-insecure-secret-change-me';

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Never silently sign sessions with a public, guessable key in production.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET is not set. Add it in your environment variables and redeploy.');
    }
    return new TextEncoder().encode(DEV_SECRET);
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('14d')
    .sign(getSecretKey());
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload && payload.role === 'admin' ? payload : null;
  } catch {
    return null;
  }
}

/** Constant-time string comparison (hashes first so lengths never leak). */
export function safeEqual(a, b) {
  const ha = createHash('sha256').update(String(a ?? '')).digest();
  const hb = createHash('sha256').update(String(b ?? '')).digest();
  return timingSafeEqual(ha, hb);
}

export async function isAdminRequest() {
  const store = await cookies();
  return !!(await verifySessionToken(store.get(SESSION_COOKIE)?.value));
}

/** Best-effort client identifier for rate limiting (hashed — no raw IPs stored). */
export function clientKey(request) {
  const fwd = request.headers.get('x-forwarded-for') || '';
  const ip = fwd.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(ip + (process.env.SESSION_SECRET || '')).digest('hex').slice(0, 24);
}

/** Rejects cross-site mutation requests (defence in depth on top of SameSite cookies). */
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients / same-origin GET-style fetches
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}
