import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from './lib/auth';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin/');
  const isLoginApi = pathname === '/api/admin/login';

  if (!pathname.startsWith('/admin') && !isAdminApi) {
    return NextResponse.next();
  }
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
