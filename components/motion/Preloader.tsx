'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { EASE } from '@/lib/motion';
import { useUI } from '@/lib/ui-store';

/**
 * First visit per session, home page only (decided by the inline script in
 * app/layout.tsx before first paint). The tower mark is drawn upward, a
 * counter runs 000 → 100, and the panel lifts to reveal the hero. ~2.3s.
 * Hidden by CSS for repeat visits and reduced motion; a CSS failsafe clears
 * it after 4s if scripts fail.
 */
export function Preloader() {
  const [active, setActive] = useState(true);
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'));
  const setIntroDone = useUI((s) => s.setIntroDone);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('ntc-preload')) {
      setActive(false);
      setIntroDone();
      return;
    }
    try {
      sessionStorage.setItem('ntc-intro', '1');
    } catch {}
    const controls = animate(count, 100, { duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.15 });
    const t = window.setTimeout(() => {
      setActive(false);
      setIntroDone();
    }, 1950);
    return () => {
      controls.stop();
      window.clearTimeout(t);
    };
  }, [count, setIntroDone]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="preloader"
          role="presentation"
          className="preloader-shell fixed inset-0 z-preloader flex flex-col bg-obsidian text-ivory"
          exit={{ y: '-100%', transition: { duration: 0.9, ease: EASE } }}
        >
          <div className="flex flex-1 items-center justify-center">
            <div className="preloader-mark text-champagne">
              <Logo variant="mark" label={null} className="h-36 md:h-48" />
            </div>
          </div>
          <div className="container-x flex items-end justify-between pb-l">
            <span className="label text-mist">Nine Towers Collection</span>
            <motion.span className="font-display text-d-m leading-none tabular text-ivory" aria-hidden="true">
              {text}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
