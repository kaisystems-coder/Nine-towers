'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { useWishlist } from '@/lib/wishlist-store';
import { useCart } from '@/lib/cart-store';
import { useUI } from '@/lib/ui-store';
import { EASE } from '@/lib/motion';
import { stockFor } from '@/lib/product-utils';
import type { Product } from '@/data/types';

/** Saved pieces with "Move to bag" (uses the first in-stock option of each variant). */
export function WishlistView() {
  const hydrated = useUI((s) => s.hydrated);
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const addItem = useCart((s) => s.addItem);
  const openCart = useUI((s) => s.openCart);
  const catalog = useCatalog();
  const items = ids.map(catalog.getProductById).filter(Boolean) as Product[];

  if (!hydrated) return <div className="min-h-[40vh]" aria-busy="true" />;
  if (!items.length)
    return (
      <div className="py-xl">
        <p className="font-display text-d-s">Nothing saved yet.</p>
        <p className="mt-xs max-w-[48ch] text-body text-stone">Tap the heart on any piece to keep it here. Your wishlist is saved on this device.</p>
        <Link href="/collections/new-in" className="btn btn-primary mt-l">
          <span className="btn-fill" aria-hidden="true" />
          <span className="btn-roll">
            <span>Browse New In</span>
            <span aria-hidden="true">Browse New In</span>
          </span>
        </Link>
      </div>
    );

  const move = (p: Product) => {
    const sel = Object.fromEntries((p.variants ?? []).map((v) => [v.type, (v.options.find((o) => o.inStock) ?? v.options[0]).value]));
    addItem(p.id, sel, 1, stockFor(p, sel));
    remove(p.id);
    openCart('bag');
  };

  return (
    <ul className="grid grid-cols-2 gap-x-s gap-y-l md:gap-x-m md:gap-y-xl lg:grid-cols-4">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((p) => (
          <motion.li key={p.id} layout exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: EASE }}>
            <ProductCard product={p} showQuickAdd={false} />
            <div className="mt-s flex flex-wrap items-center gap-x-m gap-y-xs">
              {p.inStock ? (
                <button type="button" onClick={() => move(p)} className="link-u is-underlined label min-h-11">
                  Move to bag
                </button>
              ) : (
                <span className="label min-h-11 py-[14px] text-stone">Sold out</span>
              )}
              <button type="button" onClick={() => remove(p.id)} className="link-u min-h-11 text-body-s text-stone">
                Remove
              </button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
