'use client';

import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { CartLine } from './CartLine';
import { FreeDeliveryBar } from './FreeDeliveryBar';
import { WhatsappLogo } from '@/components/ui/icons';
import { count, resolveLines, subtotal, unpricedCount, useCart } from '@/lib/cart-store';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { useUI } from '@/lib/ui-store';
import { formatPrice, priceLabel, subtotalLabel } from '@/lib/format';
import { categoryList } from '@/data/categories';

export function CartPageView() {
  const hydrated = useUI((s) => s.hydrated);
  const openCart = useUI((s) => s.openCart);
  const items = useCart((s) => s.items);
  const note = useCart((s) => s.note);
  const setNote = useCart((s) => s.setNote);
  const catalog = useCatalog();
  const lines = resolveLines(items, catalog.getProductById);
  const total = subtotal(lines);
  const unpriced = unpricedCount(lines);

  if (!hydrated) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (!lines.length)
    return (
      <div className="py-xl">
        <p className="font-display text-d-s">Your bag is empty.</p>
        <p className="mt-xs text-body text-stone">Pieces you add will wait here until you’re ready to order on WhatsApp.</p>
        <div className="mt-l flex flex-wrap gap-s">
          {categoryList.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="btn btn-outline">
              <span className="btn-fill" aria-hidden="true" />
              <span className="btn-roll">
                <span>{c.title}</span>
                <span aria-hidden="true">{c.title}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    );

  return (
    <div className="grid gap-xl lg:grid-cols-12 lg:gap-m">
      <div className="lg:col-span-7">
        <ul className="border-t border-obsidian/10">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <CartLine key={l.key} line={l} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <aside className="lg:col-span-4 lg:col-start-9" aria-label="Order summary">
        <div className="rounded-m bg-cream/60 p-m lg:sticky lg:top-[calc(var(--bar-h)_-_var(--condense)_+_var(--space-m))] md:p-l">
          <h2 className="font-display text-d-xs">Summary</h2>
          <div className="mt-m">
            <FreeDeliveryBar subtotal={total} unpriced={unpriced} />
          </div>
          <dl className="mt-m flex flex-col gap-xs border-t border-obsidian/10 pt-m text-body-s">
            <div className="flex justify-between">
              <dt>Items</dt>
              <dd className="tabular">{count(items)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="text-stone">Confirmed on WhatsApp</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-obsidian/10 pt-s">
              <dt className="label">Subtotal</dt>
              <dd className="price text-body-l">{subtotalLabel(total, unpriced)}</dd>
            </div>
          </dl>
          <div className="mt-m">
            <label htmlFor="page-note" className="field-label">
              Gift message or note <span className="normal-case tracking-normal text-stone">(optional)</span>
            </label>
            <textarea id="page-note" rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} className="field resize-none" />
          </div>
          <button type="button" onClick={() => openCart('checkout')} className="btn btn-primary mt-m w-full">
            <span className="btn-fill" aria-hidden="true" />
            <span className="btn-roll">
              <span>
                <WhatsappLogo size={18} weight="light" aria-hidden="true" /> Checkout via WhatsApp
              </span>
              <span aria-hidden="true">
                <WhatsappLogo size={18} weight="light" /> Checkout via WhatsApp
              </span>
            </span>
          </button>
          <p className="mt-s text-caption text-stone">No payment is taken here. We confirm stock, delivery and payment with you on WhatsApp.</p>
        </div>
      </aside>
    </div>
  );
}
