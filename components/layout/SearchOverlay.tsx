'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Media } from '@/components/ui/Media';
import { MagnifyingGlass, X } from '@/components/ui/icons';
import { site } from '@/config/site';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { formatPrice, priceLabel } from '@/lib/format';
import { useUI } from '@/lib/ui-store';
import { useOverlay } from '@/lib/use-overlay';
import { EASE } from '@/lib/motion';
import type { Product } from '@/data/types';

function ResultRow({ p, onClose, i }: { p: Product; onClose: () => void; i: number }) {
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: i * 0.035 }}
    >
      <Link href={`/product/${p.slug}`} onClick={onClose} className="group flex items-center gap-s py-xs">
        <div className="relative aspect-product w-16 shrink-0 overflow-hidden rounded-xs">
          <Media src={p.images[0]} alt="" sizes="64px" plate={{ icon: p.category, seed: p.slug }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body group-hover:underline group-hover:underline-offset-4">{p.name}</p>
          <p className="price text-stone">{priceLabel(p.price)}</p>
        </div>
      </Link>
    </motion.li>
  );
}

/** Full-screen search: autofocused input, live results, popular searches. */
export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const setSearch = useUI((s) => s.setSearch);
  const [q, setQ] = useState('');
  const query = useDeferredValue(q);
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const close = () => setSearch(false);
  useOverlay(open, ref, close, input);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  const catalog = useCatalog();
  const results = query.trim() ? catalog.searchProducts(query, 8) : [];
  const suggestions = catalog.newIn(4);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search"
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Search the boutique"
          data-lenis-prevent=""
          className="fixed inset-0 z-modal overflow-y-auto overscroll-contain bg-ivory/95 text-obsidian backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="container-x pb-2xl pt-l md:pt-xl">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="-mr-[10px] inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-95"
              >
                <X size={24} weight="light" />
              </button>
            </div>

            <motion.form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-m max-w-[880px]"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
            >
              <label htmlFor="site-search" className="label text-stone">
                Search jewellery, luggage and handbags
              </label>
              <div className="mt-s flex items-center gap-s border-b border-obsidian pb-s">
                <MagnifyingGlass size={28} weight="light" aria-hidden="true" className="shrink-0" />
                <input
                  ref={input}
                  id="site-search"
                  type="search"
                  autoComplete="off"
                  enterKeyHint="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Try ‘pearl’ or ‘carry-on’"
                  className="min-w-0 flex-1 bg-transparent font-display text-d-s outline-none placeholder:text-stone focus-visible:outline-none"
                />
                {q && (
                  <button type="button" onClick={() => setQ('')} className="label shrink-0 py-xs text-stone hover:text-obsidian">
                    Clear
                  </button>
                )}
              </div>

              <div className="mt-m flex flex-wrap items-center gap-xs">
                <span className="label mr-xs text-stone">Popular</span>
                {site.popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQ(term);
                      input.current?.focus();
                    }}
                    className="min-h-11 rounded-full border border-obsidian/20 px-s text-body-s transition-transform duration-fast ease-brand hover:border-obsidian active:scale-95 desk:min-h-9"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.form>

            <div className="mx-auto mt-xl max-w-[880px]" aria-live="polite">
              {query.trim() ? (
                results.length ? (
                  <>
                    <p className="label text-stone">
                      {results.length} {results.length === 1 ? 'result' : 'results'}
                    </p>
                    <ul className="mt-s grid gap-x-l divide-y divide-obsidian/10 sm:grid-cols-2 sm:divide-y-0">
                      <AnimatePresence mode="popLayout">
                        {results.map((p, i) => (
                          <ResultRow key={p.id} p={p} i={i} onClose={close} />
                        ))}
                      </AnimatePresence>
                    </ul>
                  </>
                ) : (
                  <div>
                    <p className="font-display text-d-xs">Nothing matches ‘{query}’.</p>
                    <p className="mt-xs text-body text-stone">
                      Check the spelling, try a broader word, or browse{' '}
                      <Link href="/shop" onClick={close} className="link-u is-underlined text-obsidian">
                        everything in the boutique
                      </Link>
                      .
                    </p>
                  </div>
                )
              ) : (
                <>
                  <p className="label text-stone">New this week</p>
                  <ul className="mt-s grid gap-x-l sm:grid-cols-2">
                    {suggestions.map((p, i) => (
                      <ResultRow key={p.id} p={p} i={i} onClose={close} />
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
