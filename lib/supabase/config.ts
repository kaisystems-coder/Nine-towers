/**
 * Supabase connection settings for the shared multi-tenant project.
 * The URL and publishable key are public by design: the key only ever acts as
 * `anon` or as the signed-in user, and row level security does the enforcing.
 * They live here as defaults so a deploy needs no Vercel setup; env vars still
 * override them. There is no service-role key anywhere in this app.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezotkeijhffwylgsjkhq.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_wgwiIF4zkI7nHifFV2w99A_fiUstF2_';

/**
 * This site's tenant (public.tenants, slug nine-towers-collection). Server-side
 * only. A TENANT_ID env var overrides it.
 */
export const TENANT_ID = process.env.TENANT_ID || 'e1f78424-edc8-48d3-87f7-d438f5a7c499';

/** The store owner's Supabase login. The admin form asks for the password only. */
export const OWNER_EMAIL = process.env.ADMIN_EMAIL || 'owner@ninetowerscollection.com';

/** Public bucket for photos uploaded in the admin, under {TENANT_ID}/. */
export const PHOTO_BUCKET = 'product-photos';
export const PHOTO_PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/`;
