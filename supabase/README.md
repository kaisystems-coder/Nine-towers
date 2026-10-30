# Supabase

This site is one tenant on the shared multi-tenant project `ezotkeijhffwylgsjkhq`
(Pro plan, ca-central-1). Rules: `.claude/multi-tenant-supabase-guidelines.md` on the Desktop.

| | |
|---|---|
| Tenant | `nine-towers-collection`, id `e1f78424-edc8-48d3-87f7-d438f5a7c499` |
| Owner login | `owner@ninetowerscollection.com` (role `owner`); the admin form asks for the password only |
| Products | `public.store_products`, one row per product |
| Stock | `stock` on the product when it has no colours/sizes, otherwise one `public.store_product_options` row per option |
| Photos | site photos stay in `public/products/`; admin uploads go to the public bucket `product-photos` under `{tenant_id}/` |

## Migrations

1. `20261020120000_core_tenancy.sql` (in the V Star Properties repo): tenants, memberships, `private.is_member` / `has_role`, immutable-tenant trigger. Already applied; shared by every client.
2. `20261026120000_store_products.sql`: products, options, `public.store_save_product` (SECURITY INVOKER, so RLS checks every row), and the photo bucket with tenant-folder policies.

## How the site uses it

- **Storefront** reads published products as `anon` through PostgREST (`lib/products-store.ts`), cached by Next under the `products` tag. If Supabase can't be reached or has no rows, it falls back to the starter catalogue in `data/products.ts`, so the shop never goes blank.
- **/admin** signs in with Supabase Auth (`lib/auth.ts`), keeps the session in httpOnly cookies, refreshes it in `middleware.ts`, and writes as the owner. RLS checks every write against the owner's membership. Saving refreshes the storefront straight away.
- No service-role key anywhere in the app. The URL, publishable key and tenant id are public defaults in `lib/supabase/config.ts`; env vars override them.

## Password reset

Dashboard → Authentication → Users → the owner user → update the password there.
