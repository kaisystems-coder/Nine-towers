'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Media } from '@/components/ui/Media';
import { ArrowRight, WhatsappLogo, X } from '@/components/ui/icons';
import { categoryList } from '@/data/categories';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { site } from '@/config/site';
import { buildGeneralMessage, whatsappUrl } from '@/lib/whatsapp';
import { useUI } from '@/lib/ui-store';
import { useOverlay } from '@/lib/use-overlay';
import { EASE } from '@/lib/motion';

const primary = [
  { label: 'Home', href: '/' },
  { label: 'New In', href: '/collections/new-in' },
  { label: 'Jewellery', href: '/shop/jewellery' },
  { label: 'Handbags', href: '/shop/handbags' },
  { label: 'Luggage', href: '/shop/luggage' },
  { label: 'Tech', href: '/shop/electronics' },
  { label: 'Shop All', href: '/shop' },
];

const secondary = [
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'The Nine Towers', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Delivery & Returns', href: '/delivery-returns' },
];

/** Full-screen mobile menu: large type, staggered reveal, category imagery. */
export function MobileMenu() {
  const open = useUI((s) => s.menuOpen);
  const setMenu = useUI((s) => s.setMenu);
  const ref = useRef<HTMLDivElement>(null);
  const catalog = useCatalog();
  const collections = catalog.collectionsWithStock();
  const close = () => setMenu(false);
  useOverlay(open, ref, close);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent=""
          className="fixed inset-0 z-modal overflow-y-auto overscroll-contain bg-ivory text-obsidian"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.6, ease: EASE } }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="flex h-[var(--bar-h)] items-center justify-between px-gutter">
            <Logo variant="compact" className="h-[38px]" />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="-mr-[10px] inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-95"
            >
              <X size={24} weight="light" />
            </button>
          </div>

          <nav aria-label="Mobile" className="px-gutter pb-xl pt-m">
            <ul className="flex flex-col">
              {primary.map((l, i) => (
                <li key={l.href} className="overflow-hidden border-b border-obsidian/10">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                  >
                    <Link href={l.href} onClick={close} className="flex items-center justify-between py-s font-display text-[2.25rem] leading-[1.1] tracking-[-0.02em]">
                      {l.label}
                      <ArrowRight size={20} weight="light" />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.div
              className="no-scrollbar -mx-gutter mt-l flex snap-x snap-mandatory gap-s overflow-x-auto px-gutter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            >
              {categoryList.map((c) => (
                <Link key={c.slug} href={`/shop/${c.slug}`} onClick={close} className="w-[42vw] max-w-[220px] shrink-0 snap-start">
                  <div className="relative aspect-portrait overflow-hidden rounded-xs">
                    <Media src={catalog.categoryCover(c.slug)} alt="" sizes="45vw" plate={{ icon: c.slug, seed: c.slug, shot: 1 }} />
                  </div>
                  <p className="label mt-xs">{c.title}</p>
                </Link>
              ))}
            </motion.div>

            <motion.div
              className="mt-l grid grid-cols-2 gap-x-m"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
            >
              <ul>
                {secondary.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close} className="flex min-h-11 items-center text-body text-stone">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul>
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} onClick={close} className="flex min-h-11 items-center text-body text-stone">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.a
              href={whatsappUrl(buildGeneralMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-l w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            >
              <WhatsappLogo size={18} weight="light" />
              Chat on WhatsApp
            </motion.a>
            <p className="mt-s text-center text-body-s text-stone">{site.whatsappDisplay}</p>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
