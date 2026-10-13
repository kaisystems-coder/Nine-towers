'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AccordionItem } from '@/components/ui/Accordion';
import { Check, Handbag, WhatsappLogo } from '@/components/ui/icons';
import { Price } from '@/components/product/Price';
import { Badge, productBadge } from '@/components/product/Badge';
import { WishlistButton } from '@/components/product/WishlistButton';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { VariantSelector } from './VariantSelector';
import { categories, subcategoryLabel } from '@/data/categories';
import { stockFor } from '@/lib/product-utils';
import { site } from '@/config/site';
import { lineImage, useCart, variantLabelFor, MAX_QTY, type Selections } from '@/lib/cart-store';
import { useRecentlyViewed } from '@/lib/wishlist-store';
import { usePdpView } from '@/lib/pdp-store';
import { useUI } from '@/lib/ui-store';
import { buildBackInStockMessage, buildSingleItemMessage, whatsappUrl } from '@/lib/whatsapp';
import { formatPrice, formatPriceShort, priceLabel } from '@/lib/format';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/types';

type AddState = 'idle' | 'adding' | 'added';

const defaults = (p: Product): Selections =>
  Object.fromEntries((p.variants ?? []).map((v) => [v.type, (v.options.find((o) => o.inStock) ?? v.options[0]).value]));

function AddLabel({ state }: { state: AddState }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={state}
        className="flex items-center justify-center gap-xs"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {state === 'idle' && (
          <>
            <Handbag size={18} weight="light" aria-hidden="true" /> Add to Bag
          </>
        )}
        {state === 'adding' && 'Adding…'}
        {state === 'added' && (
          <>
            <Check size={18} weight="light" aria-hidden="true" /> Added
          </>
        )}
      </motion.span>
    </AnimatePresence>
  );
}

export function ProductInfo({ product: p }: { product: Product }) {
  const [sel, setSel] = useState<Selections>(() => defaults(p));
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<AddState>('idle');
  const [showBar, setShowBar] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);
  const addItem = useCart((s) => s.addItem);
  const openCart = useUI((s) => s.openCart);
  const setStickyBar = useUI((s) => s.setStickyBar);
  const push = useRecentlyViewed((s) => s.push);
  const hydrated = useUI((s) => s.hydrated);
  const setView = usePdpView((s) => s.set);

  const cat = categories[p.category];
  const variantLabel = variantLabelFor(p, sel);
  const available = stockFor(p, sel);
  const selectionInStock = p.inStock && available > 0;
  const maxQty = Math.max(1, Math.min(MAX_QTY, available));

  // Keep the quantity within what's in stock when the selection changes.
  useEffect(() => {
    setQty((q) => Math.min(q, maxQty));
  }, [maxQty]);
  const badge = productBadge(p);

  // Show the photo of the chosen colour in the gallery.
  const selectedImage = lineImage(p, sel);
  useEffect(() => {
    setView(p.slug, selectedImage);
  }, [p.slug, selectedImage, setView]);

  useEffect(() => {
    if (hydrated) push(p.slug);
  }, [hydrated, p.slug, push]);

  // Mobile sticky bar once the main button has scrolled away.
  useEffect(() => {
    const el = addRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    setStickyBar(showBar);
    return () => setStickyBar(false);
  }, [showBar, setStickyBar]);

  const add = () => {
    if (state !== 'idle' || !selectionInStock) return;
    setState('adding');
    window.setTimeout(() => {
      addItem(p.id, sel, qty, available);
      setQty(1);
      setState('added');
      window.setTimeout(() => openCart('bag'), 450);
      window.setTimeout(() => setState('idle'), 1800);
    }, 550);
  };

  const orderNow = whatsappUrl(buildSingleItemMessage({ name: p.name, itemNo: p.itemNo, variantLabel, qty, unitPrice: p.price }, `${site.url}/product/${p.slug}`));
  const backInStock = whatsappUrl(buildBackInStockMessage(p.name, variantLabel, p.itemNo));

  const addButton = (extra?: string) =>
    selectionInStock ? (
      <button type="button" onClick={add} aria-live="polite" className={cn('btn btn-primary', extra)} disabled={state === 'adding'}>
        <span className="btn-fill" aria-hidden="true" />
        <span className="relative block h-[1.4em] overflow-hidden">
          <AddLabel state={state} />
        </span>
      </button>
    ) : (
      <button type="button" disabled className={cn('btn btn-primary', extra)}>
        Sold out
      </button>
    );

  return (
    <div className="flex flex-col">
      <Breadcrumbs
        items={[
          { label: cat.title, href: `/shop/${cat.slug}` },
          { label: subcategoryLabel(p.category, p.subcategory), href: `/shop/${cat.slug}?sub=${p.subcategory}` },
          { label: p.name },
        ]}
      />

      <div className="mt-l flex items-start justify-between gap-s">
        <div>
          {badge && <Badge label={badge.label} tone={badge.tone} className="mb-s ring-1 ring-obsidian/10" />}
          <h1 className="font-display text-d-m">{p.name}</h1>
          {p.itemNo && <p className="label mt-xs text-stone">Item #{p.itemNo}</p>}
        </div>
        <WishlistButton id={p.id} name={p.name} className="relative -mr-[10px] shrink-0" size={22} />
      </div>
      <Price price={p.price} compareAt={p.compareAtPrice} className="mt-s text-body-l" />
      {p.tags.includes('bestseller') && <p className="label mt-xs text-stone">Bestseller</p>}

      <p className="mt-m max-w-[52ch] text-body text-stone">{p.description}</p>

      <div className="mt-l flex flex-col gap-m">
        {(p.variants ?? []).map((v) => (
          <VariantSelector key={v.type} variant={v} value={sel[v.type]} idPrefix={`${p.id}-${v.type}`} onChange={(val) => setSel((s) => ({ ...s, [v.type]: val }))} />
        ))}
        {selectionInStock && (
          <div>
            <p className="label">Quantity</p>
            <QuantityStepper value={qty} onChange={setQty} max={maxQty} className="mt-s" />
            {available <= 3 && (
              <p className="mt-xs text-caption text-stone" aria-live="polite">
                Only {available} left{variantLabel ? ` in ${variantLabel}` : ''}.
              </p>
            )}
          </div>
        )}
      </div>

      <div ref={addRef} className="mt-l flex flex-col gap-xs">
        {addButton('w-full')}
        {selectionInStock ? (
          <a href={orderNow} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full">
            <span className="btn-fill" aria-hidden="true" />
            <span className="btn-roll">
              <span className="flex items-center justify-center gap-xs">
                <WhatsappLogo size={18} weight="light" aria-hidden="true" /> Order Now on WhatsApp
              </span>
              <span className="flex items-center justify-center gap-xs" aria-hidden="true">
                <WhatsappLogo size={18} weight="light" /> Order Now on WhatsApp
              </span>
            </span>
          </a>
        ) : (
          <a href={backInStock} target="_blank" rel="noopener noreferrer" className="link-u is-underlined mx-auto mt-xs min-h-11 text-body-s">
            <WhatsappLogo size={16} weight="light" aria-hidden="true" /> Back in stock? Ask us on WhatsApp
          </a>
        )}
      </div>

      <ul className="mt-m flex flex-col gap-[6px] text-caption text-stone">
        <li>Islandwide delivery. Free over {formatPriceShort(site.freeDeliveryThreshold)}.</li>
        <li>Payment arranged with us on WhatsApp. No card details online.</li>
      </ul>

      <h2 className="sr-only">Product information</h2>
      <div className="mt-xl border-t border-obsidian/15">
        <AccordionItem title="Description" defaultOpen>
          <p>{p.description}</p>
        </AccordionItem>
        <AccordionItem title="Details & Dimensions">
          <ul className="list-disc space-y-[6px] pl-m marker:text-champagne">
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </AccordionItem>
        <AccordionItem title="Care">
          <ul className="list-disc space-y-[6px] pl-m marker:text-champagne">
            {(p.care ?? cat.care).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </AccordionItem>
        <AccordionItem title="Delivery & Returns">
          <p>
            We deliver across Trinidad & Tobago, usually within 1–3 working days of confirming your order on WhatsApp. Delivery is free on orders over {formatPrice(site.freeDeliveryThreshold)}; otherwise the fee is confirmed in the chat. Unworn pieces in their original packaging can be exchanged within 7 days.{' '}
            <Link href="/delivery-returns" className="link-u is-underlined text-obsidian">
              Full policy
            </Link>
          </p>
        </AccordionItem>
      </div>

      {/* Mobile sticky add-to-bag */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            key="sticky"
            className="safe-bottom fixed inset-x-0 bottom-0 z-sticky border-t border-obsidian/10 bg-ivory/95 backdrop-blur-md lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center gap-s px-gutter py-xs">
              <div className="min-w-0 flex-1">
                <p className="label truncate">{p.name}</p>
                <p className="price truncate text-caption text-stone">
                  {priceLabel(p.price)}
                  {variantLabel ? ` · ${variantLabel}` : ''}
                </p>
              </div>
              {addButton('shrink-0 px-m')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
