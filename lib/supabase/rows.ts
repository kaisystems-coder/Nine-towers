import type { Category, Product, Tag } from '@/data/types';

/** A store_products row with its options embedded (PostgREST select). */
export type ProductRow = {
  id: string;
  code: string;
  slug: string;
  name: string;
  item_no: string | null;
  category: string;
  subcategory: string;
  price: number | string;
  compare_at_price: number | string | null;
  description: string;
  details: string[];
  care: string[];
  images: string[];
  variant_type: 'colour' | 'size' | null;
  stock: number;
  tags: string[];
  collections: string[];
  featured: number | null;
  added_at: string;
  is_published: boolean;
  updated_at: string;
  store_product_options?: OptionRow[];
};

export type OptionRow = {
  position: number;
  label: string;
  value: string;
  swatch: string | null;
  image: string | null;
  stock: number;
};

/** Columns to select, with options embedded through the composite foreign key. */
export const PRODUCT_SELECT = '*,store_product_options(position,label,value,swatch,image,stock)';

const num = (v: number | string | null | undefined) => (v === null || v === undefined ? undefined : Number(v));

export function fromRow(r: ProductRow): Product {
  const options = [...(r.store_product_options ?? [])].sort((a, b) => a.position - b.position);
  const variants =
    r.variant_type && options.length
      ? [
          {
            type: r.variant_type,
            options: options.map((o) => ({
              label: o.label,
              value: o.value,
              ...(o.swatch ? { swatch: o.swatch } : {}),
              ...(o.image ? { image: o.image } : {}),
              stock: o.stock,
              inStock: o.stock > 0,
            })),
          },
        ]
      : undefined;
  const stock = variants ? variants[0].options.reduce((s, o) => s + (o.stock ?? 0), 0) : r.stock;
  const compareAt = num(r.compare_at_price);
  return {
    id: r.code,
    slug: r.slug,
    name: r.name,
    ...(r.item_no ? { itemNo: r.item_no } : {}),
    category: r.category as Category,
    subcategory: r.subcategory,
    price: num(r.price) ?? 0,
    ...(compareAt ? { compareAtPrice: compareAt } : {}),
    description: r.description,
    details: r.details ?? [],
    ...(r.care?.length ? { care: r.care } : {}),
    images: r.images ?? [],
    ...(variants ? { variants } : {}),
    tags: (r.tags ?? []) as Tag[],
    collections: r.collections ?? [],
    inStock: stock > 0,
    stock,
    ...(r.featured !== null && r.featured !== undefined ? { featured: r.featured } : {}),
    addedAt: r.added_at,
  };
}

/** Arguments for public.store_save_product(_tenant, _product, _options). */
export function toSaveArgs(tenant: string, p: Product) {
  const v = p.variants?.[0];
  return {
    _tenant: tenant,
    _product: {
      code: p.id,
      slug: p.slug,
      name: p.name,
      item_no: p.itemNo ?? '',
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      compare_at_price: p.compareAtPrice ?? null,
      description: p.description,
      details: p.details ?? [],
      care: p.care ?? [],
      images: p.images ?? [],
      variant_type: v ? v.type : '',
      stock: v ? 0 : p.stock ?? 0,
      tags: p.tags ?? [],
      collections: p.collections ?? [],
      featured: p.featured ?? null,
      added_at: p.addedAt,
      is_published: true,
    },
    _options: (v?.options ?? []).map((o) => ({
      label: o.label,
      value: o.value,
      swatch: o.swatch ?? '',
      image: o.image ?? '',
      stock: o.stock ?? 0,
    })),
  };
}
