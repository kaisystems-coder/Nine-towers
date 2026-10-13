'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/data/types';

/** Selected variant values, keyed by variant type: { colour: 'gold', size: '7' } */
export type Selections = Partial<Record<'colour' | 'size', string>>;

export type CartItem = {
  /** productId + selections, so one bag in two colours is two lines */
  key: string;
  productId: string;
  selections: Selections;
  qty: number;
};

export type ResolvedLine = CartItem & {
  product: Product;
  variantLabel?: string;
  unitPrice: number;
  lineTotal: number;
};

export const MAX_QTY = 10;

export function lineKey(productId: string, selections: Selections) {
  const sel = Object.entries(selections)
    .filter(([, v]) => v)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return sel ? `${productId}::${sel}` : productId;
}

export function variantLabelFor(product: Product, selections: Selections) {
  const labels = (product.variants ?? []).flatMap((v) => {
    const o = v.options.find((opt) => opt.value === selections[v.type]);
    if (!o) return [];
    return [v.type === 'size' && product.category === 'jewellery' ? `Size ${o.label}` : o.label];
  });
  return labels.length ? labels.join(' / ') : undefined;
}

type Lookup = (id: string) => Product | undefined;

export function resolveLines(items: CartItem[], lookup: Lookup): ResolvedLine[] {
  return items
    .map((item) => {
      const product = lookup(item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        variantLabel: variantLabelFor(product, item.selections),
        unitPrice: product.price,
        lineTotal: product.price * item.qty,
      };
    })
    .filter(Boolean) as ResolvedLine[];
}

type CartState = {
  items: CartItem[];
  note: string;
  /** `max` caps the line at the units in stock. */
  addItem: (productId: string, selections?: Selections, qty?: number, max?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  setNote: (note: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      note: '',
      addItem: (productId, selections = {}, qty = 1, max = MAX_QTY) =>
        set((s) => {
          const cap = Math.max(0, Math.min(MAX_QTY, max));
          if (!cap) return s;
          const key = lineKey(productId, selections);
          const existing = s.items.find((i) => i.key === key);
          if (existing)
            return {
              items: s.items.map((i) => (i.key === key ? { ...i, qty: Math.min(cap, i.qty + qty) } : i)),
            };
          return { items: [...s.items, { key, productId, selections, qty: Math.min(cap, qty) }] };
        }),
      removeItem: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      updateQty: (key, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
        })),
      setNote: (note) => set({ note }),
      clear: () => set({ items: [], note: '' }),
    }),
    {
      name: 'ntc-bag',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

/** Derived values: subtotal(lines), count(items). */
export const subtotal = (lines: ResolvedLine[]) => lines.reduce((s, l) => s + l.lineTotal, 0);
export const count = (items: CartItem[]) => items.reduce((s, i) => s + i.qty, 0);
/** Lines whose price is still "on request". */
export const unpricedCount = (lines: ResolvedLine[]) => lines.filter((l) => l.unitPrice <= 0).length;

/** The photo of the selected colour/size, falling back to the main photo. */
export function lineImage(product: Product, selections: Selections) {
  for (const v of product.variants ?? []) {
    const o = v.options.find((x) => x.value === selections[v.type]);
    if (o?.image) return o.image;
  }
  return product.images[0];
}

export const useCartCount = () => useCart((s) => count(s.items));
