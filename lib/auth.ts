/**
 * Admin sessions: a signed, expiring token in an httpOnly cookie.
 * Uses Web Crypto so it runs in both middleware (edge) and server actions.
 * The signing key comes from ADMIN_SESSION_SECRET, or the admin password
 * itself, so changing the password signs everyone out.
 */
export const SESSION_COOKIE = 'ntc_admin';
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const enc = new TextEncoder();

function signingSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

async function hmacKey(secret: string) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

const toB64Url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function fromB64Url(s: string) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function createSessionToken() {
  const secret = signingSecret();
  if (!secret) throw new Error('ADMIN_PASSWORD is not set.');
  const payload = `v1.${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}`;
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload));
  return `${payload}.${toB64Url(sig)}`;
}

export async function verifySessionToken(token?: string | null) {
  const secret = signingSecret();
  if (!secret || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  try {
    return await crypto.subtle.verify('HMAC', await hmacKey(secret), fromB64Url(parts[2]), enc.encode(`${parts[0]}.${parts[1]}`));
  } catch {
    return false;
  }
}

/** Constant-time password check (compares HMACs, never the raw strings). */
export async function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const key = await hmacKey('ntc-password-compare');
  const [a, b] = await Promise.all([
    crypto.subtle.sign('HMAC', key, enc.encode(input)),
    crypto.subtle.sign('HMAC', key, enc.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
