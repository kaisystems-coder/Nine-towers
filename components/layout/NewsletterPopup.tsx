'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { Media } from '@/components/ui/Media';
import { X } from '@/components/ui/icons';
import { site } from '@/config/site';
import { useUI } from '@/lib/ui-store';
import { useOverlay } from '@/lib/use-overlay';
import { EASE } from '@/lib/motion';

const KEY = 'ntc-welcome-offer';

/** Welcome offer: after 20s or on exit intent, once per visitor. */
export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const close = () => setOpen(false);
  useOverlay(open, ref, close);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!localStorage.getItem(KEY);
    } catch {
      seen = true; // storage blocked: don't nag on every page
    }
    if (seen) return;

    const show = () => {
      const ui = useUI.getState();
      if (ui.cartOpen || ui.searchOpen || ui.menuOpen || !ui.introDone) return false;
      if (window.location.pathname === '/cart') return false;
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {}
      setOpen(true);
      cleanup();
      return true;
    };

    const start = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - start >= site.newsletterPopupDelayMs) show();
    }, 1000);
    const onOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget && Date.now() - start > 5000) show();
    };
    document.addEventListener('mouseout', onOut);
    function cleanup() {
      window.clearInterval(timer);
      document.removeEventListener('mouseout', onOut);
    }
    return cleanup;
  }, []);

  useEffect(() => close(), [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="welcome" className="fixed inset-0 z-modal flex items-end justify-center sm:items-center sm:p-l" initial="closed" animate="open" exit="closed">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-obsidian/50"
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={close}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            className="relative grid w-full max-w-[820px] overflow-hidden rounded-t-m bg-ivory shadow-floating sm:grid-cols-[5fr_6fr] sm:rounded-m"
            variants={{ closed: { opacity: 0, y: 48 }, open: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="relative hidden min-h-[420px] sm:block">
              <Media src="/media/welcome.jpg" alt="" sizes="360px" plate={{ icon: 'jewellery', seed: 'welcome', shot: 1, tone: 'cream' }} />
            </div>
            <div className="safe-bottom p-l sm:p-xl">
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-xs top-xs inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-90"
              >
                <X size={20} weight="light" />
              </button>
              <p className="label text-stone">A welcome from Nine Towers</p>
              <h2 id="welcome-title" className="mt-s font-display text-d-m">
                10% off your
                <br />
                <span className="display-italic">first order.</span>
              </h2>
              <p className="mt-s text-body text-stone">
                Join the list for new arrivals and private previews. Your code arrives by email; mention it on WhatsApp when you order.
              </p>
              <NewsletterForm tone="light" source="Welcome popup" className="mt-m" />
              <button type="button" onClick={close} className="link-u mt-m min-h-11 text-body-s text-stone">
                No thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
