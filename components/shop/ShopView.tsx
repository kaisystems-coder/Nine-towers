'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ProductCard } from '@/components/product/ProductCard';
import { Reveal } from '@/components/motion/Reveal';
import { FilterDrawer } from './FilterDrawer';
import { CaretDown, SlidersHorizontal, X } from '@/components/ui/icons';
import { categories } from '@/data/categories';
import { colourFacets, materialGroups, priceBands, sortOptions, type SortKey } from '@/lib/catalog';
import { activeCount, applyFilters, filtersToParams, parseFilters, type Filters } from '@/lib/shop-filters';
import { useUI } from '@/lib/ui-store';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { Category, Product } from '@/data/types';

const PAGE = 12;
type ListKey = 'category' | 'sub' | 'price' | 'colour' | 'material';

function GridIcon({ cols }: { cols: 2 | 4 }) {
  return (
    <span aria-hidden="true" className={cn('grid gap-[2px]', cols === 2 ? 'grid-cols-2' : 'grid-cols-4')}>
      {Array.from({ length: cols === 2 ? 4 : 8 }).map((_, i) => (
        <span key={i} className={cn('block bg-current', cols === 2 ? 'h-[7px] w-[7px]' : 'h-[7px] w-[3px]')} />
      ))}
    </span>
  );
}

type ShopViewProps = { products: Product[]; category?: Category; emptyHref?: string };

/** Reads filters from the URL. Wrap in <Suspense fallback={<ShopViewFallback />}>. */
export function ShopView(props: ShopViewProps) {
  const params = useSearchParams();
  return <ShopViewInner {...props} query={params.toString()} />;
}

/** Server-renderable default view (no filters), so the grid is in the HTML. */
export function ShopViewFallback(props: ShopViewProps) {
  return <ShopViewInner {...props} query="" />;
}

function ShopViewInner({ products, category, emptyHref = '/shop', query }: ShopViewProps & { query: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(new URLSearchParams(query)), [query]);
  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);
  const headerHidden = useUI((s) => s.headerHidden);

  const push = (next: Filters) => {
    const qs = filtersToParams(next).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setShown(PAGE);
  };
  const toggle = (key: ListKey, value: string) => {
    const list = filters[key];
    push({ ...filters, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };
  const clearAll = () => push({ ...parseFilters(new URLSearchParams()), view: filters.view, sort: filters.sort });

  const chips = useMemo(() => {
    const out: { key: ListKey | 'stock' | 'q'; value: string; label: string }[] = [];
    const subLabel = (s: string) =>
      Object.values(categories).flatMap((c) => c.subcategories).find((x) => x.slug === s)?.label ?? s;
    filters.category.forEach((v) => out.push({ key: 'category', value: v, label: categories[v as Category]?.title ?? v }));
    filters.sub.forEach((v) => out.push({ key: 'sub', value: v, label: subLabel(v) }));
    filters.price.forEach((v) => out.push({ key: 'price', value: v, label: priceBands.find((b) => b.value === v)?.label ?? v }));
    const cols = colourFacets(products);
    filters.colour.forEach((v) => out.push({ key: 'colour', value: v, label: cols.find((c) => c.value === v)?.label ?? v }));
    filters.material.forEach((v) => out.push({ key: 'material', value: v, label: materialGroups.find((m) => m.value === v)?.label ?? v }));
    if (filters.inStock) out.push({ key: 'stock', value: 'in', label: 'In stock' });
    if (filters.q) out.push({ key: 'q', value: filters.q, label: `“${filters.q}”` });
    return out;
  }, [filters, products]);

  const removeChip = (c: (typeof chips)[number]) => {
    if (c.key === 'stock') push({ ...filters, inStock: false });
    else if (c.key === 'q') push({ ...filters, q: '' });
    else toggle(c.key, c.value);
  };

  const visible = results.slice(0, shown);
  const large = filters.view === 'large';
  const n = activeCount(filters);

  return (
    <div className="pb-2xl md:pb-3xl">
      {/* Toolbar: sticks under the header, moves up when the header slides away */}
      <div
        className="sticky z-sticky border-b border-obsidian/10 bg-ivory/95 backdrop-blur-md transition-transform duration-[700ms] ease-brand"
        style={{
          top: 'calc(var(--bar-h) - var(--condense))',
          transform: headerHidden ? 'translateY(calc(-1 * (var(--bar-h) - var(--condense))))' : 'translateY(0)',
        }}
      >
        <div className="container-x flex h-16 items-center justify-between gap-s">
          <div className="flex min-w-0 items-center gap-m">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="label inline-flex min-h-11 items-center gap-xs transition-transform duration-fast ease-brand active:scale-95"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal size={18} weight="light" aria-hidden="true" />
              Filter{n > 0 && <span className="tabular">({n})</span>}
            </button>
            <p className="hidden text-body-s text-stone sm:block" aria-live="polite">
              {results.length} {results.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>

          <div className="flex items-center gap-s">
            <label className="relative hidden items-center md:flex">
              <span className="sr-only">Sort by</span>
              <select
                value={filters.sort}
                onChange={(e) => push({ ...filters, sort: e.target.value as SortKey })}
                className="label min-h-11 cursor-pointer appearance-none bg-transparent pr-l outline-offset-2"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <CaretDown size={14} weight="light" aria-hidden="true" className="pointer-events-none absolute right-xs" />
            </label>
            <div className="flex items-center" role="group" aria-label="Grid size">
              {(['large', 'compact'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={filters.view === v}
                  aria-label={v === 'large' ? 'Larger images' : 'More per row'}
                  onClick={() => push({ ...filters, view: v })}
                  className={cn(
                    'inline-flex h-11 w-11 items-center justify-center transition-[transform,opacity] duration-fast ease-brand active:scale-90',
                    filters.view === v ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                  )}
                >
                  <GridIcon cols={v === 'large' ? 2 : 4} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-x">
        {/* Active filters */}
        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.div
              key="chips"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-wrap items-center gap-xs pt-m"
            >
              {chips.map((c) => (
                <button
                  key={`${c.key}-${c.value}`}
                  type="button"
                  onClick={() => removeChip(c)}
                  aria-label={`Remove filter: ${c.label}`}
                  className="inline-flex min-h-11 items-center gap-xs rounded-full border border-obsidian/20 pl-s pr-xs text-body-s transition-transform duration-fast ease-brand hover:border-obsidian active:scale-95 desk:min-h-9"
                >
                  {c.label}
                  <X size={14} weight="light" aria-hidden="true" />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="link-u is-underlined ml-xs min-h-11 text-body-s">
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <h2 className="sr-only">Products</h2>
        {results.length ? (
          <LayoutGroup>
            <motion.ul
              layout
              className={cn(
                'mt-l grid gap-x-s gap-y-l md:gap-x-m md:gap-y-xl',
                large ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4 md:grid-cols-3'
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3, ease: EASE } }}
                    transition={{ duration: 0.7, ease: EASE, delay: Math.min(i % PAGE, 8) * 0.04 }}
                  >
                    <Reveal delay={(i % 4) * 0.07}>
                      <ProductCard
                        product={p}
                        priority={i < 4}
                        sizes={large ? '(min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'}
                      />
                    </Reveal>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        ) : (
          products.length === 0 ? (
          <div className="mx-auto max-w-[44ch] py-2xl text-center">
            <p className="font-display text-d-s">This edit is being put together.</p>
            <p className="mt-xs text-body text-stone">New pieces are on the way. In the meantime, browse everything in the boutique.</p>
            <a href="/shop" className="btn btn-primary mt-l">
              <span className="btn-fill" aria-hidden="true" />
              <span className="btn-roll">
                <span>Shop everything</span>
                <span aria-hidden="true">Shop everything</span>
              </span>
            </a>
          </div>
          ) : (
          <div className="mx-auto max-w-[44ch] py-2xl text-center">
            <p className="font-display text-d-s">No pieces match these filters.</p>
            <p className="mt-xs text-body text-stone">Remove a filter or two to see more of the collection.</p>
            <button type="button" onClick={clearAll} className="btn btn-primary mt-l">
              <span className="btn-fill" aria-hidden="true" />
              <span className="btn-roll">
                <span>Clear filters</span>
                <span aria-hidden="true">Clear filters</span>
              </span>
            </button>
            <a href={emptyHref} className="sr-only">
              Back to all
            </a>
          </div>
          )
        )}

        {/* Load more */}
        {results.length > 0 && (
          <div className="mx-auto mt-2xl flex max-w-[320px] flex-col items-center text-center">
            <p className="text-body-s text-stone" aria-live="polite">
              Showing {visible.length} of {results.length}
            </p>
            <div className="relative mt-s h-px w-full bg-obsidian/15">
              <motion.div
                className="absolute inset-0 origin-left bg-obsidian"
                initial={false}
                animate={{ scaleX: visible.length / results.length }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </div>
            {visible.length < results.length && (
              <button type="button" onClick={() => setShown((s) => s + PAGE)} className="btn btn-outline mt-l">
                <span className="btn-fill" aria-hidden="true" />
                <span className="btn-roll">
                  <span>Load more</span>
                  <span aria-hidden="true">Load more</span>
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <FilterDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        products={products}
        filters={filters}
        resultCount={results.length}
        toggle={toggle}
        setSort={(s) => push({ ...filters, sort: s })}
        setInStock={(v) => push({ ...filters, inStock: v })}
        clearAll={clearAll}
        category={category}
      />
    </div>
  );
}
