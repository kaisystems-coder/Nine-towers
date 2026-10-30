import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_COOKIE, verifyAdmin } from './auth';

/**
 * Verifies the owner's Supabase session and returns its token, for calls that
 * RLS checks against their membership. Used by admin pages and server actions;
 * kept out of app/admin/actions.ts so it is never exposed as a server action.
 */
export async function requireAdmin(): Promise<string> {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!token || !(await verifyAdmin(token))) redirect('/admin/login');
  return token;
}
