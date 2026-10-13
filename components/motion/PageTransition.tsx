'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { EASE } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/hooks';
import { useUI } from '@/lib/ui-store';

type Phase = 'idle' | 'covering' | 'covered';

/**
 * Route transitions: an Obsidian panel rises over the page carrying the tower
 * mark, the route changes underneath, and the panel lifts away.
 * Intercepts same-origin <a> clicks in the capture phase; Next's <Link> sees
 * defaultPrevented and stands down, then we push the route ourselves.
 * Links marked data-transition="none" (or morph) skip the curtain.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const target = useRef<string | null>(null);
  const failsafe = useRef<number>();

  const finish = useCallback(() => {
    window.clearTimeout(failsafe.current);
    setPhase('idle');
    target.current = null;
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.href) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download') || a.dataset.transition === 'none' || a.dataset.transition === 'morph') return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (hash or filters): let Next handle it
      if (prefersReducedMotion()) return;

      e.preventDefault();
      // Close any open layers before covering.
      const ui = useUI.getState();
      ui.closeCart();
      ui.setSearch(false);
      ui.setMenu(false);
      target.current = url.pathname + url.search + url.hash;
      setPhase('covering');
      failsafe.current = window.setTimeout(finish, 3200);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [finish]);

  // Route has changed underneath the curtain: lift it.
  useEffect(() => {
    if (phase === 'covered') {
      finish();
      requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          key="curtain"
          aria-hidden="true"
          className="fixed inset-0 z-curtain flex items-center justify-center bg-obsidian text-champagne"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: EASE } }}
          transition={{ duration: 0.6, ease: EASE }}
          onAnimationComplete={() => {
            if (phase === 'covering' && target.current) {
              setPhase('covered');
              router.push(target.current);
            }
          }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0, transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <Logo variant="mark" label={null} className="h-24 w-auto md:h-32" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
