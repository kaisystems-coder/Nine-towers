'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Drawer } from '@/components/ui/Drawer';
import { ArrowLeft, Check, WhatsappLogo, X } from '@/components/ui/icons';
import { CartLine } from './CartLine';
import dynamic from 'next/dynamic';

// Validation libraries load only when someone reaches checkout.
const CheckoutForm = dynamic(() => import('./CheckoutForm').then((m) => m.CheckoutForm), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-s bg-cream/50" aria-busy="true" />,
});
import { FreeDeliveryBar } from './FreeDeliveryBar';
import { count, resolveLines, subtotal, unpricedCount, useCart } from '@/lib/cart-store';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { useUI, type CartView } from '@/lib/ui-store';
import { formatPrice, priceLabel, subtotalLabel } from '@/lib/format';
import { categoryList } from '@/data/categories';
import { EASE } from '@/lib/motion';

const titles: Record<CartView, string> = { bag: 'Your Bag', checkout: 'Your Details', sent: 'Order Sent' };

function EmptyBag({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-m py-xl">
      <p className="font-display text-d-s">Your bag is empty.</p>
      <p className="mt-xs text-body text-stone">Start with a category, or see what arrived this week.</p>
      <ul className="mt-l flex flex-col border-t border-obsidian/10">
        {[...categoryList.map((c) => ({ href: `/shop/${c.slug}`, label: c.title })), { href: '/collections/new-in', label: 'New In' }].map((l) => (
          <li key={l.href} className="border-b border-obsidian/10">
            <Link href={l.href} onClick={onClose} className="group flex min-h-[56px] items-center justify-between font-display text-d-xs">
              {l.label}
              <span aria-hidden="true" className="transition-transform duration-base ease-brand group-hover:translate-x-1">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OrderSent({ onClose }: { onClose?: () => void }) {
  const lastOrder = useUI((s) => s.lastOrder);
  const setCartView = useUI((s) => s.setCartView);
  const clear = useCart((s) => s.clear);
  const hasItems = useCart((s) => s.items.length > 0);
  return (
    <div className="flex flex-1 flex-col px-m py-xl">
      <motion.span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-obsidian text-ivory"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Check size={26} weight="light" aria-hidden="true" />
      </motion.span>
      <h3 className="mt-m font-display text-d-s">Order sent: we’ll confirm on WhatsApp.</h3>
      {lastOrder && (
        <p className="mt-s text-body">
          Your reference is <span className="price tracking-[0.06em]">{lastOrder.ref}</span>. Keep it handy if you call or message us.
        </p>
      )}
      <p className="mt-s text-body text-stone">
        We’ll reply to confirm stock, your delivery fee and how you’d like to pay. Your bag is saved here until you clear it, in case WhatsApp didn’t open.
      </p>
      <div className="mt-l flex flex-col gap-xs">
        {lastOrder && (
          <a href={lastOrder.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <span className="btn-fill" aria-hidden="true" />
            <span className="btn-roll">
              <span className="flex items-center justify-center gap-xs">
                <WhatsappLogo size={18} weight="light" aria-hidden="true" /> Open WhatsApp again
              </span>
              <span className="flex items-center justify-center gap-xs" aria-hidden="true">
                <WhatsappLogo size={18} weight="light" /> Open WhatsApp again
              </span>
            </span>
          </a>
        )}
        {hasItems && (
          <button
            type="button"
            onClick={() => {
              clear();
              setCartView('bag');
            }}
            className="btn btn-primary"
          >
            <span className="btn-fill" aria-hidden="true" />
            <span className="btn-roll">
              <span>Clear bag</span>
              <span aria-hidden="true">Clear bag</span>
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setCartView('bag');
            onClose?.();
          }}
          className="link-u mx-auto mt-xs min-h-11 text-body-s text-stone"
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const view = useUI((s) => s.cartView);
  const closeCart = useUI((s) => s.closeCart);
  const setCartView = useUI((s) => s.setCartView);
  const hydrated = useUI((s) => s.hydrated);
  const items = useCart((s) => s.items);
  const note = useCart((s) => s.note);
  const setNote = useCart((s) => s.setNote);

  const catalog = useCatalog();
  const lines = resolveLines(items, catalog.getProductById);
  const total = subtotal(lines);
  const unpriced = unpricedCount(lines);
  const n = count(items);
  const close = () => {
    closeCart();
    if (view === 'checkout') setCartView('bag');
  };

  return (
    <Drawer open={open} onClose={close} label={titles[view]}>
      {/* Header */}
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-s border-b border-obsidian/10 px-m">
        <div className="flex items-center gap-xs">
          {view === 'checkout' && (
            <button
              type="button"
              onClick={() => setCartView('bag')}
              aria-label="Back to bag"
              className="-ml-[10px] inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-90"
            >
              <ArrowLeft size={20} weight="light" />
            </button>
          )}
          <h2 className="font-display text-d-xs">
            {titles[view]}
            {view === 'bag' && hydrated && n > 0 && <span className="price ml-xs align-middle text-stone">({n})</span>}
          </h2>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close bag"
          className="-mr-[10px] inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-90"
        >
          <X size={22} weight="light" />
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view === 'bag' && !lines.length ? 'empty' : view}
          className="flex min-h-0 flex-1 flex-col"
          initial={{ opacity: 0, x: view === 'checkout' ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: view === 'checkout' ? -24 : 24, transition: { duration: 0.25 } }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {view === 'sent' ? (
            <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain" data-lenis-prevent="">
              <OrderSent onClose={close} />
            </div>
          ) : view === 'checkout' && lines.length ? (
            <div className="flex-1 overflow-y-auto overscroll-contain px-m py-m" data-lenis-prevent="">
              <CheckoutForm />
            </div>
          ) : !lines.length ? (
            <EmptyBag onClose={close} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto overscroll-contain px-m" data-lenis-prevent="">
                <div className="pt-m">
                  <FreeDeliveryBar subtotal={total} unpriced={unpriced} />
                </div>
                <ul className="mt-xs">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <CartLine key={l.key} line={l} onNavigate={close} />
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="py-m">
                  <label htmlFor="bag-note" className="field-label">
                    Gift message or note <span className="normal-case tracking-normal text-stone">(optional)</span>
                  </label>
                  <textarea
                    id="bag-note"
                    rows={2}
                    maxLength={500}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a message for the card, or delivery notes"
                    className="field resize-none"
                  />
                </div>
              </div>
              <div className="safe-bottom shrink-0 border-t border-obsidian/10 bg-ivory px-m pb-m pt-s">
                <div className="flex items-baseline justify-between">
                  <span className="label">Subtotal</span>
                  <span className="price text-body-l">{subtotalLabel(total, unpriced)}</span>
                </div>
                <p className="mt-[2px] text-caption text-stone">
                  {unpriced ? 'Prices on request and delivery are confirmed on WhatsApp.' : 'Delivery fees are confirmed on WhatsApp.'}
                </p>
                <button type="button" onClick={() => setCartView('checkout')} className="btn btn-primary mt-s w-full">
                  <span className="btn-fill" aria-hidden="true" />
                  <span className="btn-roll">
                    <span className="flex items-center justify-center gap-xs">
                      <WhatsappLogo size={18} weight="light" aria-hidden="true" /> Checkout via WhatsApp
                    </span>
                    <span className="flex items-center justify-center gap-xs" aria-hidden="true">
                      <WhatsappLogo size={18} weight="light" /> Checkout via WhatsApp
                    </span>
                  </span>
                </button>
                <Link href="/cart" onClick={close} className="link-u mx-auto mt-xs flex min-h-11 w-fit text-body-s text-stone">
                  View full bag
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Drawer>
  );
}
