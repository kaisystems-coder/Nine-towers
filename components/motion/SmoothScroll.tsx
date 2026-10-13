'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/lib/hooks';
import { useAnyOverlayOpen } from '@/lib/ui-store';

let lenis: Lenis | null = null;

/** Access the running Lenis instance (null under reduced motion). */
export const getLenis = () => lenis;

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' });
}

/**
 * Lenis drives window scroll, so framer-motion's useScroll keeps working.
 * Disabled for reduced motion. Paused while drawers and overlays are open.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const overlayOpen = useAnyOverlayOpen();

  useEffect(() => {
    // Lenis only smooths wheel scrolling; on touch screens it would just run an idle loop.
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (overlayOpen) lenis.stop();
    else lenis.start();
  }, [overlayOpen]);

  // New route: start at the top (Lenis keeps its own scroll target, so Next's
  // reset alone isn't enough). Skipped on first load so a visitor who starts
  // scrolling before the page finishes loading is never pulled back up.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!window.location.hash) scrollToTop(true);
  }, [pathname]);

  return null;
}
