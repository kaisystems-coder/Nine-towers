'use client';

import { useEffect, useState, type RefObject } from 'react';
import { useInView } from 'framer-motion';
import { prefersReducedMotion, useIsoLayoutEffect } from '@/lib/hooks';

/**
 * Additive reveals. Content renders VISIBLE on the server and on first paint.
 * Only elements that start below the fold are "armed" (set to their hidden
 * state) after mount, and they reveal when scrolled into view. Anything
 * already on screen, reduced-motion visitors, and failed scripts all get
 * fully visible content. A fast fling that carries an element past the
 * viewport without an intersection event also un-arms it.
 */
export function useArmedReveal(ref: RefObject<Element>, margin = '0px 0px -10% 0px') {
  const [armed, setArmed] = useState(false);
  const [passed, setPassed] = useState(false);
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` });

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.95) setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || inView || passed) return;
    const onScroll = () => {
      const el = ref.current;
      if (el && el.getBoundingClientRect().top < window.innerHeight) setPassed(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [armed, inView, passed, ref]);

  return { armed, shown: !armed || inView || passed };
}
