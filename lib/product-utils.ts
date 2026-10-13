import type { Product } from '@/data/types';
import type { Selections } from './cart-store';

/** Starting stock for seed products that don't list a quantity yet. */
const DEFAULT_STOCK = { product: 8, option: 6 } as const;

/**
 * Makes stock the source of truth: `inStock` flags are derived from the
 * quantities, products with no photos get a placeholder path, and seed data
 * without quantities gets sensible defaults.
 */
export function normalizeProduct(p: Product): Product {
  const images = p.images?.length ? p.images : [`/products/${p.slug}/1.jpg`];
  const variants = p.variants?.filter((v) => v.options.length);
  if (variants?.length) {
    const nv = variants.map((v) => ({
      ...v,
      options: v.options.map((o) => {
        const stock = Math.max(0, Math.floor(o.stock ?? (o.inStock ? DEFAULT_STOCK.option : 0)));
        return { ...o, stock, inStock: stock > 0 };
      }),
    }));
    const total = nv[0].options.reduce((s, o) => s + (o.stock ?? 0), 0);
    return { ...p, images, variants: nv, stock: total, inStock: total > 0 };
  }
  const stock = Math.max(0, Math.floor(p.stock ?? (p.inStock ? DEFAULT_STOCK.product : 0)));
  return { ...p, images, variants: undefined, stock, inStock: stock > 0 };
}

/** Units available for a product with the given colour/size selected. */
export function stockFor(p: Product, sel: Selections = {}): number {
  if (!p.variants?.length) return p.stock ?? (p.inStock ? Infinity : 0);
  let min = Infinity;
  for (const v of p.variants) {
    const o = v.options.find((x) => x.value === sel[v.type]);
    if (!o) return 0;
    min = Math.min(min, o.stock ?? (o.inStock ? Infinity : 0));
  }
  return min;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/["'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
