import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'admin_session';

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-me';
  return new TextEncoder().encode(secret);
}

export async function createSessionToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
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

// For use in Server Components (public site pages/layouts) to know whether
// the current visitor is logged in as admin, so they can see edit controls.
export async function isAdminRequest() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  return !!session;
}
