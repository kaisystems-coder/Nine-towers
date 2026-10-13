'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, SESSION_TTL_SECONDS, adminConfigured, createSessionToken, passwordMatches, verifySessionToken } from '@/lib/auth';
import { loadProductsFresh, saveProducts, uploadImage } from '@/lib/products-store';
import { fieldErrors, productInputSchema, type ProductInput } from '@/lib/admin-schema';
import type { Product } from '@/data/types';

/* ------------------------------------------------------------------ */
/* Session                                                             */
/* ------------------------------------------------------------------ */

async function requireAdmin() {
  if (!(await verifySessionToken(cookies().get(SESSION_COOKIE)?.value))) redirect('/admin/login');
}

// Basic brute-force friction: 5 wrong passwords locks that address for 10 minutes.
const attempts = new Map<string, { count: number; until: number }>();

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: 'The admin password hasn’t been set up yet. Add ADMIN_PASSWORD to the environment.' };
  const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  let rec = attempts.get(ip);
  if (rec?.until && rec.until <= now) rec = undefined; // lock expired: start over
  if (rec?.until && rec.until > now) return { error: 'Too many attempts. Try again in a few minutes.' };

  const ok = await passwordMatches(String(formData.get('password') ?? ''));
  if (!ok) {
    const count = (rec?.count ?? 0) + 1;
    attempts.set(ip, { count, until: count >= 5 ? now + 10 * 60 * 1000 : 0 });
    await new Promise((r) => setTimeout(r, 700));
    return { error: count >= 5 ? 'Too many attempts. Try again in 10 minutes.' : 'That password isn’t right.' };
  }
  attempts.delete(ip);
  cookies().set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  const next = String(formData.get('next') ?? '');
  redirect(next.startsWith('/admin') ? next : '/admin');
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect('/admin/login');
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export type SaveResult = { ok: true; id: string; slug: string } | { ok: false; error: string; fields?: Record<string, string> };

function toProduct(v: ProductInput, existing?: Product): Product {
  const options = v.options.map((o) => ({
    label: o.label,
    value: o.value,
    ...(v.variantType === 'colour' && o.swatch ? { swatch: o.swatch } : {}),
    ...(o.image && v.images.includes(o.image) ? { image: o.image } : {}),
    stock: o.stock,
    inStock: o.stock > 0,
  }));
  const hasOptions = v.variantType !== 'none';
  const stock = hasOptions ? options.reduce((s, o) => s + o.stock, 0) : v.stock;
  const letter = { jewellery: 'j', luggage: 'l', handbags: 'h', electronics: 't' }[v.category];
  return {
    id: existing?.id ?? `ntc-${letter}-${Date.now().toString(36)}`,
    slug: v.slug,
    name: v.name,
    ...(v.itemNo ? { itemNo: v.itemNo } : {}),
    category: v.category,
    subcategory: v.subcategory,
    price: Math.round(v.price * 100) / 100,
    ...(v.compareAtPrice ? { compareAtPrice: Math.round(v.compareAtPrice * 100) / 100 } : {}),
    description: v.description,
    details: v.details,
    ...(v.care.length ? { care: v.care } : {}),
    images: v.images,
    ...(hasOptions ? { variants: [{ type: v.variantType as 'colour' | 'size', options }] } : {}),
    ...(hasOptions ? {} : { stock: v.stock }),
    tags: v.tags,
    collections: v.collections,
    inStock: stock > 0,
    ...(v.featured !== undefined ? { featured: v.featured } : {}),
    addedAt: v.addedAt,
  };
}

export async function saveProduct(input: ProductInput): Promise<SaveResult> {
  await requireAdmin();
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fields: fieldErrors(parsed.error) };
  const v = parsed.data;
  try {
    const { products } = await loadProductsFresh();
    const existing = v.id ? products.find((p) => p.id === v.id) : undefined;
    if (v.id && !existing) return { ok: false, error: 'This product no longer exists. It may have been deleted.' };
    if (products.some((p) => p.slug === v.slug && p.id !== v.id))
      return { ok: false, error: 'Check the highlighted fields.', fields: { slug: 'Another product already uses this web address.' } };
    const product = toProduct(v, existing);
    const next = existing ? products.map((p) => (p.id === existing.id ? product : p)) : [product, ...products];
    await saveProducts(next, [product.slug, ...(existing ? [existing.slug] : [])]);
    return { ok: true, id: product.id, slug: product.slug };
  } catch (e) {
    return { ok: false, error: (e as Error).message || 'Saving failed. Try again.' };
  }
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    const { products } = await loadProductsFresh();
    const gone = products.find((p) => p.id === id);
    if (!gone) return { ok: false, error: 'That product was already removed.' };
    await saveProducts(products.filter((p) => p.id !== id), [gone.slug]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Quick stock edit from the product list. `optionStock` is keyed by option value. */
export async function updateStock(id: string, stock: number | Record<string, number>): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const clean = (n: number) => Math.max(0, Math.min(99999, Math.floor(Number(n) || 0)));
  try {
    const { products } = await loadProductsFresh();
    const p = products.find((x) => x.id === id);
    if (!p) return { ok: false, error: 'That product no longer exists.' };
    let updated: Product;
    if (typeof stock === 'number') {
      updated = { ...p, stock: clean(stock), inStock: clean(stock) > 0 };
    } else {
      const variants = (p.variants ?? []).map((v) => ({
        ...v,
        options: v.options.map((o) => (o.value in stock ? { ...o, stock: clean(stock[o.value]), inStock: clean(stock[o.value]) > 0 } : o)),
      }));
      const total = variants[0]?.options.reduce((s, o) => s + (o.stock ?? 0), 0) ?? 0;
      updated = { ...p, variants, stock: total, inStock: total > 0 };
    }
    await saveProducts(products.map((x) => (x.id === id ? updated : x)), [p.slug]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function uploadProductImage(formData: FormData): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File) || !file.size) return { ok: false, error: 'Choose an image to upload.' };
  try {
    return { ok: true, url: await uploadImage(file, String(formData.get('slug') ?? '')) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
