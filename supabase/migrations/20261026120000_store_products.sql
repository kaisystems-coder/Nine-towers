-- Products and per-option stock, for any shop client on the shared project.
-- Columns mirror data/types.ts (camelCase -> snake_case). Quantities live in
-- `stock`: on the product when it has no colours/sizes, otherwise one row per
-- option in store_product_options. Template: guidelines sections 4 and 5.

create table public.store_products (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references public.tenants(id) on delete cascade,
  code              text not null,              -- the app's product id, e.g. 'ntc-4391'
  slug              text not null check (slug ~ '^[a-z0-9-]+$'),
  name              text not null,
  item_no           text,                       -- supplier item number
  category          text not null,
  subcategory       text not null,
  price             numeric(10,2) not null default 0 check (price >= 0),  -- TTD; 0 = price on request
  compare_at_price  numeric(10,2) check (compare_at_price >= 0),
  description       text not null default '',
  details           text[] not null default '{}',
  care              text[] not null default '{}',
  images            text[] not null default '{}',  -- site paths (/products/...) or public bucket URLs
  variant_type      text check (variant_type in ('colour','size')),  -- null = no options
  stock             integer not null default 0 check (stock >= 0),   -- used when variant_type is null
  tags              text[] not null default '{}',
  collections       text[] not null default '{}',
  featured          integer,
  added_at          date not null default current_date,
  is_published      boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (id, tenant_id),     -- composite FK target for options
  unique (tenant_id, code),
  unique (tenant_id, slug)    -- slugs are URLs, unique per site
);
create index store_products_tenant_idx on public.store_products (tenant_id);
alter table public.store_products enable row level security;

create trigger store_products_tenant_immutable
  before update on public.store_products
  for each row execute function private.forbid_tenant_change();

create trigger store_products_touch_updated_at
  before update on public.store_products
  for each row execute function private.touch_updated_at();

create policy store_products_public_read on public.store_products
  for select to anon, authenticated using (is_published = true);
create policy store_products_member_read on public.store_products
  for select to authenticated using (private.is_member(tenant_id));
create policy store_products_staff_insert on public.store_products
  for insert to authenticated
  with check (private.has_role(tenant_id, array['owner','admin','staff']));
create policy store_products_staff_update on public.store_products
  for update to authenticated
  using (private.has_role(tenant_id, array['owner','admin','staff']))
  with check (private.has_role(tenant_id, array['owner','admin','staff']));
create policy store_products_admin_delete on public.store_products
  for delete to authenticated
  using (private.has_role(tenant_id, array['owner','admin']));


create table public.store_product_options (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  product_id  uuid not null,
  position    integer not null default 0,
  label       text not null,
  value       text not null,
  swatch      text,           -- hex, colour options only
  image       text,           -- one of the product's images
  stock       integer not null default 0 check (stock >= 0),
  foreign key (product_id, tenant_id) references public.store_products (id, tenant_id) on delete cascade,
  unique (product_id, value)
);
create index store_product_options_tenant_idx on public.store_product_options (tenant_id);
create index store_product_options_product_idx on public.store_product_options (product_id, position);
alter table public.store_product_options enable row level security;

create trigger store_product_options_tenant_immutable
  before update on public.store_product_options
  for each row execute function private.forbid_tenant_change();

-- Options of a published product are public, like the product itself.
create policy store_product_options_public_read on public.store_product_options
  for select to anon, authenticated
  using (exists (select 1 from public.store_products p
                 where p.id = product_id and p.tenant_id = store_product_options.tenant_id and p.is_published));
create policy store_product_options_member_read on public.store_product_options
  for select to authenticated using (private.is_member(tenant_id));
create policy store_product_options_staff_insert on public.store_product_options
  for insert to authenticated
  with check (private.has_role(tenant_id, array['owner','admin','staff']));
create policy store_product_options_staff_update on public.store_product_options
  for update to authenticated
  using (private.has_role(tenant_id, array['owner','admin','staff']))
  with check (private.has_role(tenant_id, array['owner','admin','staff']));
-- Staff can delete options: saving a product replaces its option rows.
create policy store_product_options_staff_delete on public.store_product_options
  for delete to authenticated
  using (private.has_role(tenant_id, array['owner','admin','staff']));


-- Saves one product and its options in a single transaction. SECURITY INVOKER,
-- so every statement runs as the caller and RLS checks each row against their
-- membership; nothing here trusts _tenant beyond what the policies allow.
create or replace function public.store_save_product(_tenant uuid, _product jsonb, _options jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  _id uuid;
begin
  insert into public.store_products as p (
    tenant_id, code, slug, name, item_no, category, subcategory, price, compare_at_price,
    description, details, care, images, variant_type, stock, tags, collections, featured,
    added_at, is_published
  ) values (
    _tenant,
    _product->>'code',
    _product->>'slug',
    _product->>'name',
    nullif(_product->>'item_no', ''),
    _product->>'category',
    _product->>'subcategory',
    coalesce((_product->>'price')::numeric, 0),
    (_product->>'compare_at_price')::numeric,
    coalesce(_product->>'description', ''),
    coalesce(array(select jsonb_array_elements_text(_product->'details')), '{}'),
    coalesce(array(select jsonb_array_elements_text(_product->'care')), '{}'),
    coalesce(array(select jsonb_array_elements_text(_product->'images')), '{}'),
    nullif(_product->>'variant_type', ''),
    coalesce((_product->>'stock')::integer, 0),
    coalesce(array(select jsonb_array_elements_text(_product->'tags')), '{}'),
    coalesce(array(select jsonb_array_elements_text(_product->'collections')), '{}'),
    (_product->>'featured')::integer,
    coalesce((_product->>'added_at')::date, current_date),
    coalesce((_product->>'is_published')::boolean, true)
  )
  on conflict (tenant_id, code) do update set
    slug = excluded.slug, name = excluded.name, item_no = excluded.item_no,
    category = excluded.category, subcategory = excluded.subcategory, price = excluded.price,
    compare_at_price = excluded.compare_at_price, description = excluded.description,
    details = excluded.details, care = excluded.care, images = excluded.images,
    variant_type = excluded.variant_type, stock = excluded.stock, tags = excluded.tags,
    collections = excluded.collections, featured = excluded.featured,
    added_at = excluded.added_at, is_published = excluded.is_published
  returning p.id into _id;

  delete from public.store_product_options where product_id = _id and tenant_id = _tenant;

  insert into public.store_product_options (tenant_id, product_id, position, label, value, swatch, image, stock)
  select _tenant, _id, (o.ord - 1)::integer, o.v->>'label', o.v->>'value',
         nullif(o.v->>'swatch', ''), nullif(o.v->>'image', ''), coalesce((o.v->>'stock')::integer, 0)
  from jsonb_array_elements(coalesce(_options, '[]'::jsonb)) with ordinality as o(v, ord);

  return _id;
end $$;

revoke execute on function public.store_save_product(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.store_save_product(uuid, jsonb, jsonb) to authenticated;


-- Public bucket for shop photos (they appear on live sites), every object
-- under {tenant_id}/. Reads are public by URL; writes are tenant-scoped.
-- Guidelines section 7.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-photos', 'product-photos', true, 5242880,  -- 5 MB
        array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

create policy product_photos_read on storage.objects
  for select to authenticated
  using (bucket_id = 'product-photos'
         and private.is_member(((storage.foldername(name))[1])::uuid));
create policy product_photos_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-photos'
              and private.has_role(((storage.foldername(name))[1])::uuid, array['owner','admin','staff']));
create policy product_photos_update on storage.objects
  for update to authenticated
  using (bucket_id = 'product-photos'
         and private.has_role(((storage.foldername(name))[1])::uuid, array['owner','admin','staff']))
  with check (bucket_id = 'product-photos'
         and private.has_role(((storage.foldername(name))[1])::uuid, array['owner','admin','staff']));
create policy product_photos_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-photos'
         and private.has_role(((storage.foldername(name))[1])::uuid, array['owner','admin']));
