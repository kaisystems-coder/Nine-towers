import { ninePieces } from '@/data/products';
import { collections } from '@/data/collections';
import { categories } from '@/data/categories';
import type { Category, Product } from '@/data/types';

/**
 * Catalogue queries over a product list. The list comes from the product
 * store (server: lib/products-store.ts) or the CatalogProvider (browser), so
 * edits made in the admin show up everywhere.
 */
export function createCatalog(list: Product[]) {
  const getProduct = (slug: string) => list.find((p) => p.slug === slug);
  const getProductById = (id: string) => list.find((p) => p.id === id);
  const byTag = (tag: Product['tags'][number], limit?: number) => {
    const out = sortProducts(list.filter((p) => p.tags.includes(tag)), 'featured');
    return limit ? out.slice(0, limit) : out;
  };

  return {
    all: list,
    getProduct,
    getProductById,
    byCategory: (category: Category) => sortProducts(list.filter((p) => p.category === category), 'featured'),
    byCollection: (slug: string) => sortProducts(list.filter((p) => p.collections.includes(slug)), 'featured'),
    byTag,
    newIn: (limit = 10) => sortProducts(list.filter((p) => p.inStock), 'new').slice(0, limit),
    bestSellers: (limit = 8) => {
      const best = byTag('bestseller');
      if (best.length >= limit) return best.slice(0, limit);
      const fill = sortProducts(list, 'featured').filter((p) => !best.includes(p));
      return [...best, ...fill].slice(0, limit);
    },
    /** The nine home-page pieces; topped up from Featured if any were removed. */
    getNinePieces: () => {
      const chosen = ninePieces.map(getProduct).filter(Boolean) as Product[];
      const fill = sortProducts(list, 'featured').filter((p) => !chosen.includes(p));
      return [...chosen, ...fill].slice(0, 9);
    },
    youMayAlsoLike: (product: Product, limit = 8) =>
      sortProducts(list.filter((p) => p.category === product.category && p.id !== product.id), 'featured').slice(0, limit),
    /** Pieces from other categories that share a collection: the look, completed. */
    completeTheLook: (product: Product, limit = 4) => {
      const others = list.filter((p) => p.category !== product.category);
      const shared = others.filter((p) => p.inStock && p.collections.some((c) => product.collections.includes(c)));
      const pool = shared.length >= limit ? shared : [...shared, ...others.filter((p) => !shared.includes(p))];
      return sortProducts(pool, 'featured').slice(0, limit);
    },
    searchProducts: (query: string, limit = 8) => searchList(list, query, limit),
    /** Subcategories that have at least one product, with a cover photo. */
    subcategoriesWithStock: (category: Category) =>
      categories[category].subcategories
        .map((s) => {
          const items = sortProducts(list.filter((p) => p.category === category && p.subcategory === s.slug), 'featured');
          return { ...s, count: items.length, cover: items[0]?.images[0] };
        })
        .filter((s) => s.count > 0),
    /** Collections that have at least one product, with a cover photo. */
    collectionsWithStock: () =>
      collections
        .map((c) => {
          const items = sortProducts(list.filter((p) => p.collections.includes(c.slug)), 'featured');
          return { ...c, count: items.length, cover: items[0]?.images[0] };
        })
        .filter((c) => c.count > 0),
    /** First photo of the top featured product in a category. */
    categoryCover: (category: Category) => sortProducts(list.filter((p) => p.category === category), 'featured')[0]?.images[0],
  };
}

export type Catalog = ReturnType<typeof createCatalog>;

export type SortKey = 'featured' | 'new' | 'price-asc' | 'price-desc';

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function sortProducts(list: Product[], sort: SortKey) {
  const copy = [...list];
  switch (sort) {
    case 'new':
      return copy.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    case 'price-asc':
      // Prices on request (0) go last either way.
      return copy.sort((a, b) => +(a.price <= 0) - +(b.price <= 0) || a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => +(a.price <= 0) - +(b.price <= 0) || b.price - a.price);
    default:
      return copy.sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99) || b.addedAt.localeCompare(a.addedAt));
  }
}

function searchList(list: Product[], query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return list
    .map((p) => {
      const hay = [p.name, p.itemNo ?? '', p.category, p.subcategory, p.description, ...p.details, ...(p.variants?.flatMap((v) => v.options.map((o) => o.label)) ?? [])]
        .join(' ')
        .toLowerCase();
      const name = p.name.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return null;
        score += name.includes(t) ? 3 : 1;
      }
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .slice(0, limit)
    .map((r) => r!.p);
}

/** Every colour label that appears in a list, for the filter drawer. */
export function colourFacets(list: Product[]) {
  const map = new Map<string, { label: string; swatch?: string }>();
  for (const p of list)
    for (const v of p.variants ?? [])
      if (v.type === 'colour') for (const o of v.options) map.set(o.value, { label: o.label, swatch: o.swatch });
  return [...map.entries()].map(([value, o]) => ({ value, ...o }));
}

export function productColours(p: Product) {
  return p.variants?.find((v) => v.type === 'colour')?.options.map((o) => o.value) ?? [];
}

/** Coarse material groups derived from product details. */
export const materialGroups = [
  { value: 'stainless-steel', label: 'Stainless steel', match: /stainless steel/i },
  { value: 'gold-tone', label: 'Gold tone', match: /gold-tone|gold plated|gold-plated/i },
  { value: 'silver-tone', label: 'Silver tone', match: /silver-tone/i },
  { value: 'crystal', label: 'Crystal', match: /crystal|pavé/i },
  { value: 'pearl', label: 'Pearl', match: /pearl/i },
  { value: 'faux-leather', label: 'Faux leather', match: /faux leather/i },
] as const;

export function productMaterials(p: Product) {
  const text = [...p.details, p.description].join(' ');
  return materialGroups.filter((m) => m.match.test(text)).map((m) => m.value);
}

export const priceBands = [
  { value: 'u300', label: 'Under TT$300', min: 0.01, max: 299.99 },
  { value: '300-600', label: 'TT$300 – 600', min: 300, max: 600 },
  { value: '600-1200', label: 'TT$600 – 1,200', min: 600.01, max: 1200 },
  { value: 'o1200', label: 'Over TT$1,200', min: 1200.01, max: Infinity },
] as const;
