import { OWNER_EMAIL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, TENANT_ID } from './supabase/config';

/**
 * Admin sessions are Supabase Auth sessions for the store owner's account.
 * The access and refresh tokens live in httpOnly cookies; middleware refreshes
 * the access token before it expires. Runs in middleware (edge) and on the
 * server, so it only uses fetch and Web APIs.
 */
export const ACCESS_COOKIE = 'ntc_sb_at';
export const REFRESH_COOKIE = 'ntc_sb_rt';
export const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7; // signed out after a week without a visit

export type Session = { access_token: string; refresh_token: string; expires_in: number };

async function tokenRequest(grant: 'password' | 'refresh_token', body: Record<string, string>): Promise<Session | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grant}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    return res.ok ? ((await res.json()) as Session) : null;
  } catch {
    return null;
  }
}

/** The admin form asks for the password only; the owner's email is fixed per site. */
export const signInWithPassword = (password: string) => tokenRequest('password', { email: OWNER_EMAIL, password });
export const refreshSession = (refreshToken: string) => tokenRequest('refresh_token', { refresh_token: refreshToken });

/**
 * Seconds until the access token expires, read from its payload. This is NOT a
 * signature check; it only decides whether to refresh. verifyAdmin() and RLS
 * do the real checking.
 */
export function secondsLeft(token?: string | null) {
  if (!token) return -1;
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(part + '==='.slice((part.length + 3) % 4))) as { exp?: number };
    return typeof exp === 'number' ? exp - Math.floor(Date.now() / 1000) : -1;
  } catch {
    return -1;
  }
}

/**
 * The real check: Supabase Auth verifies the token, then (with that same token,
 * so RLS applies) we read the caller's membership of this site's tenant.
 */
export async function verifyAdmin(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const headers = { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}` };
  try {
    const user = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers, cache: 'no-store' });
    if (!user.ok) return false;
    const { id } = (await user.json()) as { id: string };
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/memberships?select=role&user_id=eq.${id}&tenant_id=eq.${TENANT_ID}&role=in.(owner,admin,staff)`,
      { headers, cache: 'no-store' }
    );
    return res.ok && ((await res.json()) as unknown[]).length > 0;
  } catch {
    return false;
  }
}

/** Cookie settings for a fresh session. */
export function sessionCookies(s: Session) {
  const base = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };
  return [
    { name: ACCESS_COOKIE, value: s.access_token, ...base, maxAge: s.expires_in },
    { name: REFRESH_COOKIE, value: s.refresh_token, ...base, maxAge: REFRESH_TTL_SECONDS },
  ];
}
