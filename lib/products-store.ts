import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { products as seed } from '@/data/products';
import { createCatalog } from './catalog';
import { normalizeProduct } from './product-utils';
import type { Product } from '@/data/types';

/**
 * Where the catalogue lives.
 * - Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production). Every save
 *   writes a new timestamped version; the newest wins and the last 20 are kept
 *   as backups.
 * - Otherwise data/products.json on disk (local development). Commit that file
 *   to publish local edits.
 * - If neither has been written yet, the seed in data/products.ts.
 */
const FILE = path.join(process.cwd(), 'data', 'products.json');
const BLOB_PREFIX = 'catalog/products-';
const KEEP_VERSIONS = 20;
export const PRODUCTS_TAG = 'products';

export type StorageMode = 'blob' | 'file';
export const storageMode = (): StorageMode => (process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file');

type Stored = { updatedAt: string; products: Product[] };

async function readBlob(): Promise<Stored | null> {
  const { list } = await import('@vercel/blob');
  const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1000 });
  if (!blobs.length) return null;
  const latest = [...blobs].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];
  const res = await fetch(latest.url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not read the catalogue from Vercel Blob (${res.status}).`);
  return (await res.json()) as Stored;
}

async function readFile(): Promise<Stored | null> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8')) as Stored;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw e;
  }
}

async function readStored(): Promise<Stored & { source: 'blob' | 'file' | 'seed' }> {
  if (storageMode() === 'blob') {
    const b = await readBlob();
    if (b) return { ...b, source: 'blob' };
  }
  const f = await readFile();
  if (f) return { ...f, source: 'file' };
  return { updatedAt: '', products: seed, source: 'seed' };
}

/** Storefront read: cached, refreshed instantly when the admin saves. */
export const loadProducts = unstable_cache(
  async () => (await readStored()).products.map(normalizeProduct),
  ['ntc-products-v1'],
  { tags: [PRODUCTS_TAG], revalidate: 3600 }
);

export async function getCatalog() {
  return createCatalog(await loadProducts());
}

/** Admin read: never cached, so the editor always sees the latest save. */
export async function loadProductsFresh() {
  const s = await readStored();
  return { products: s.products.map(normalizeProduct), updatedAt: s.updatedAt, source: s.source };
}

/** Saves the catalogue. `touched` slugs get their product pages refreshed explicitly. */
export async function saveProducts(list: Product[], touched: string[] = []) {
  const payload = JSON.stringify({ updatedAt: new Date().toISOString(), products: list } satisfies Stored, null, 2);
  if (storageMode() === 'blob') {
    const { put, list: listBlobs, del } = await import('@vercel/blob');
    await put(`${BLOB_PREFIX}${Date.now()}.json`, payload, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
    const { blobs } = await listBlobs({ prefix: BLOB_PREFIX, limit: 1000 });
    const old = [...blobs].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).slice(KEEP_VERSIONS);
    if (old.length) await del(old.map((b) => b.url));
  } else {
    try {
      await fs.writeFile(FILE, payload + '\n', 'utf8');
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (code === 'EROFS' || code === 'EACCES' || code === 'EPERM')
        throw new Error('This server can’t save files. Connect a Vercel Blob store (see CLAUDE.md) so the admin can save.');
      throw e;
    }
  }
  revalidateTag(PRODUCTS_TAG);
  revalidatePath('/', 'layout');
  // On-demand product pages (including a cached "not found") are refreshed one by one.
  for (const slug of new Set(touched)) revalidatePath(`/product/${slug}`);
}

const IMAGE_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

/** Stores an uploaded photo and returns the path or URL to save on the product. */
export async function uploadImage(file: File, slug: string): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error('Upload a JPG, PNG, WebP or AVIF image.');
  if (file.size > 4.5 * 1024 * 1024) throw new Error('That image is over 4.5MB. Use a smaller file.');
  const name = `${slug || 'product'}-${Date.now().toString(36)}.${ext}`;
  if (storageMode() === 'blob') {
    const { put } = await import('@vercel/blob');
    const res = await put(`products/${name}`, file, { access: 'public', contentType: file.type, addRandomSuffix: false });
    return res.url;
  }
  // Served by app/uploads/[name]/route.ts, so new files work without a restart.
  const dir = path.join(process.cwd(), 'data', 'uploads');
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  } catch {
    throw new Error('This server can’t store photos. Connect a Vercel Blob store (see CLAUDE.md).');
  }
  return `/uploads/${name}`;
}
