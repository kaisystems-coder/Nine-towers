import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Serves photos uploaded through the admin when running without Vercel Blob
 * (local development). Files live in data/uploads/ so they're available the
 * moment they're saved, without restarting the server.
 */
const TYPES: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif' };

export async function GET(_: Request, { params }: { params: { name: string } }) {
  const m = /^[a-z0-9-]+\.(jpg|png|webp|avif)$/.exec(params.name);
  if (!m) return new Response('Not found', { status: 404 });
  try {
    const file = await fs.readFile(path.join(process.cwd(), 'data', 'uploads', params.name));
    return new Response(file, {
      headers: { 'Content-Type': TYPES[m[1]], 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
