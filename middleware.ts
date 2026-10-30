import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE, refreshSession, secondsLeft, sessionCookies, type Session } from '@/lib/auth';

/**
 * Every /admin page needs a session, except the sign-in page. This gate only
 * reads the token's expiry and refreshes it when it's close to running out;
 * pages and server actions verify the session with Supabase (lib/auth.ts), and
 * RLS checks every write.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;

  let fresh: Session | null = null;
  let signedIn = secondsLeft(access) > 60;
  if (!signedIn && refresh) {
    fresh = await refreshSession(refresh);
    signedIn = !!fresh;
    // Hand the new token to this request too, so the page renders signed in.
    if (fresh) req.cookies.set(ACCESS_COOKIE, fresh.access_token);
  }

  let res: NextResponse;
  if (pathname === '/admin/login') {
    res = signedIn ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next();
  } else if (!signedIn) {
    const url = new URL('/admin/login', req.url);
    if (pathname !== '/admin') url.searchParams.set('next', pathname);
    res = NextResponse.redirect(url);
  } else {
    res = NextResponse.next({ request: { headers: req.headers } });
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    res.headers.set('Cache-Control', 'no-store');
  }

  if (fresh) for (const c of sessionCookies(fresh)) res.cookies.set(c);
  else if (!signedIn && (access || refresh)) {
    res.cookies.delete(ACCESS_COOKIE);
    res.cookies.delete(REFRESH_COOKIE);
  }
  return res;
}

export const config = { matcher: ['/admin', '/admin/:path*'] };
