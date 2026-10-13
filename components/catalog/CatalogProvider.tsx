'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createCatalog, type Catalog } from '@/lib/catalog';
import type { Product } from '@/data/types';

const Ctx = createContext<Catalog | null>(null);

/** Gives browser components (bag, search, wishlist) the live catalogue. */
export function CatalogProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const catalog = useMemo(() => createCatalog(products), [products]);
  return <Ctx.Provider value={catalog}>{children}</Ctx.Provider>;
}

export function useCatalog(): Catalog {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCatalog must be used inside <CatalogProvider>.');
  return c;
}
