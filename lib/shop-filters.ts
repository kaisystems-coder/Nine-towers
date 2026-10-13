import { priceBands, productColours, productMaterials, sortProducts, type SortKey } from './catalog';
import type { Product } from '@/data/types';

export type Filters = {
  category: string[];
  sub: string[];
  price: string[];
  colour: string[];
  material: string[];
  inStock: boolean;
  q: string;
  sort: SortKey;
  view: 'compact' | 'large';
};

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

export function parseFilters(params: URLSearchParams): Filters {
  const sort = params.get('sort') as SortKey | null;
  return {
    category: list(params.get('category')),
    sub: list(params.get('sub')),
    price: list(params.get('price')),
    colour: list(params.get('colour')),
    material: list(params.get('material')),
    inStock: params.get('stock') === 'in',
    q: params.get('q') ?? '',
    sort: sort && ['featured', 'new', 'price-asc', 'price-desc'].includes(sort) ? sort : 'featured',
    view: params.get('view') === 'large' ? 'large' : 'compact',
  };
}

export function filtersToParams(f: Filters) {
  const p = new URLSearchParams();
  if (f.category.length) p.set('category', f.category.join(','));
  if (f.sub.length) p.set('sub', f.sub.join(','));
  if (f.price.length) p.set('price', f.price.join(','));
  if (f.colour.length) p.set('colour', f.colour.join(','));
  if (f.material.length) p.set('material', f.material.join(','));
  if (f.inStock) p.set('stock', 'in');
  if (f.q) p.set('q', f.q);
  if (f.sort !== 'featured') p.set('sort', f.sort);
  if (f.view !== 'compact') p.set('view', f.view);
  return p;
}

export function applyFilters(products: Product[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  const out = products.filter((p) => {
    if (f.category.length && !f.category.includes(p.category)) return false;
    if (f.sub.length && !f.sub.includes(p.subcategory)) return false;
    if (f.price.length && !priceBands.some((b) => f.price.includes(b.value) && p.price >= b.min && p.price <= b.max)) return false;
    if (f.colour.length && !productColours(p).some((c) => f.colour.includes(c))) return false;
    if (f.material.length && !productMaterials(p).some((m) => f.material.includes(m))) return false;
    if (f.inStock && !p.inStock) return false;
    if (q && ![p.name, p.itemNo ?? '', p.description, ...p.details].join(' ').toLowerCase().includes(q)) return false;
    return true;
  });
  return sortProducts(out, f.sort);
}

export function activeCount(f: Filters) {
  return f.category.length + f.sub.length + f.price.length + f.colour.length + f.material.length + (f.inStock ? 1 : 0) + (f.q ? 1 : 0);
}
