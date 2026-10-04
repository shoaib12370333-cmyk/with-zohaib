import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from './lib/auth';

// Gatekeeper for everything under /admin and /api/admin.
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin/');
  const isPublicAuthApi = pathname === '/api/admin/login';

  if (isLoginPage || isPublicAuthApi) return NextResponse.next();

  let session = null;
  try {
    session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    session = null; // e.g. SESSION_SECRET missing — treat as logged out
  }

  if (!session) {
    if (isAdminApi) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
