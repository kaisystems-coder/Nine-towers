import 'server-only';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { products as seed } from '@/data/products';
import { createCatalog } from './catalog';
import { normalizeProduct } from './product-utils';
import { PHOTO_BUCKET, PHOTO_PUBLIC_PREFIX, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, TENANT_ID } from './supabase/config';
import { PRODUCT_SELECT, fromRow, toSaveArgs, type ProductRow } from './supabase/rows';
import type { Product } from '@/data/types';

/**
 * The catalogue lives in Supabase (shared project, this site's tenant):
 * public.store_products plus one store_product_options row per colour/size,
 * each with its own stock. See supabase/migrations/.
 *
 * - The storefront reads published products as `anon` (RLS), cached and
 *   refreshed the moment the admin saves.
 * - The admin reads and writes with the owner's session token, so RLS checks
 *   every change against their membership. No service-role key.
 * - If Supabase can't be reached (or has nothing yet), the storefront falls
 *   back to the starter catalogue in data/products.ts so it never goes blank.
 */
export const PRODUCTS_TAG = 'products';

const ORDER = 'order=featured.asc.nullslast,added_at.desc,name.asc';

function rest(path: string, token?: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    cache: 'no-store',
  });
}

async function failure(res: Response, what: string) {
  const body = await res.text().catch(() => '');
  return new Error(`${what} failed (${res.status}). ${body.slice(0, 200)}`);
}

/** Throws on failure or when there's nothing yet, so neither gets cached. */
const fetchPublished = unstable_cache(
  async (): Promise<Product[]> => {
    const res = await rest(`store_products?select=${PRODUCT_SELECT}&tenant_id=eq.${TENANT_ID}&is_published=eq.true&${ORDER}`);
    if (!res.ok) throw await failure(res, 'Loading products');
    const rows = (await res.json()) as ProductRow[];
    if (!rows.length) throw new Error('No products in Supabase yet.');
    return rows.map(fromRow);
  },
  ['ntc-products-supabase-v1'],
  { tags: [PRODUCTS_TAG], revalidate: 3600 }
);

/** Storefront read. */
export async function loadProducts(): Promise<Product[]> {
  try {
    return (await fetchPublished()).map(normalizeProduct);
  } catch (e) {
    console.error('[products] Using the starter catalogue:', (e as Error).message);
    return seed.map(normalizeProduct);
  }
}

export async function getCatalog() {
  return createCatalog(await loadProducts());
}

/** Admin read: never cached, includes unpublished products. */
export async function loadProductsFresh(token: string) {
  const res = await rest(`store_products?select=${PRODUCT_SELECT}&tenant_id=eq.${TENANT_ID}&${ORDER}`, token);
  if (!res.ok) throw await failure(res, 'Loading products');
  const rows = (await res.json()) as ProductRow[];
  const updatedAt = rows.reduce((max, r) => (r.updated_at > max ? r.updated_at : max), '');
  return { products: rows.map((r) => normalizeProduct(fromRow(r))), updatedAt };
}

function refresh(slugs: string[]) {
  revalidateTag(PRODUCTS_TAG);
  revalidatePath('/', 'layout');
  // On-demand product pages (including a cached "not found") are refreshed one by one.
  for (const slug of new Set(slugs)) revalidatePath(`/product/${slug}`);
}

/** Saves one product and its options in a single transaction. */
export async function saveProduct(token: string, product: Product, touched: string[] = []) {
  const res = await rest('rpc/store_save_product', token, { method: 'POST', body: JSON.stringify(toSaveArgs(TENANT_ID, product)) });
  if (!res.ok) {
    const body = await res.text();
    if (body.includes('store_products_tenant_id_slug_key')) throw new Error('Another product already uses this web address.');
    throw new Error(`Saving failed (${res.status}). ${body.slice(0, 200)}`);
  }
  refresh([product.slug, ...touched]);
}

export async function removeProduct(token: string, code: string, slug: string) {
  const res = await rest(`store_products?tenant_id=eq.${TENANT_ID}&code=eq.${encodeURIComponent(code)}`, token, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  });
  if (!res.ok) throw await failure(res, 'Deleting');
  if (!((await res.json()) as unknown[]).length) throw new Error('That product was already removed.');
  refresh([slug]);
}

const IMAGE_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

/** Stores an uploaded photo under this tenant's folder and returns its public URL. */
export async function uploadImage(token: string, file: File, slug: string): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error('Upload a JPG, PNG, WebP or AVIF image.');
  if (file.size > 4.5 * 1024 * 1024) throw new Error('That image is over 4.5MB. Use a smaller file.');
  const path = `${TENANT_ID}/${slug || 'product'}-${Date.now().toString(36)}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${PHOTO_BUCKET}/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': file.type },
    body: file,
    cache: 'no-store',
  });
  if (!res.ok) throw await failure(res, 'Uploading the photo');
  return PHOTO_PUBLIC_PREFIX + path;
}
