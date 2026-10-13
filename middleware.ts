import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

/** Every /admin page needs a valid session, except the sign-in page. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const signedIn = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === '/admin/login') {
    return signedIn ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next();
  }
  if (!signedIn) {
    const url = new URL('/admin/login', req.url);
    if (pathname !== '/admin') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = { matcher: ['/admin', '/admin/:path*'] };
