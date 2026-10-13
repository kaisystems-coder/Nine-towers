'use client';

import { ProductRail } from '@/components/home/ProductRail';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { useRecentlyViewed } from '@/lib/wishlist-store';
import { useUI } from '@/lib/ui-store';
import type { Product } from '@/data/types';

/** Pieces this visitor has looked at, newest first (localStorage). */
export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const hydrated = useUI((s) => s.hydrated);
  const slugs = useRecentlyViewed((s) => s.slugs);
  const catalog = useCatalog();
  if (!hydrated) return null;
  const items = slugs
    .filter((s) => s !== exclude)
    .map(catalog.getProduct)
    .filter(Boolean)
    .slice(0, 8) as Product[];
  if (!items.length) return null;
  return <ProductRail id="recent-title" title="Recently Viewed" products={items} className="bg-ivory pb-2xl" />;
}
