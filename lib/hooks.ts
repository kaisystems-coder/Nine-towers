'use client';

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const subscribers = new Map<string, (cb: () => void) => () => void>();

function subscribeMedia(query: string) {
  let sub = subscribers.get(query);
  if (!sub) {
    sub = (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    };
    subscribers.set(query, sub);
  }
  return sub;
}

/**
 * Media query hook that is SSR-safe: the server snapshot is always `false`,
 * so hydration matches, then the real value applies before paint.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const usePointerFine = () => useMediaQuery('(hover: hover) and (pointer: fine)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/** Synchronous check for use inside effects and handlers. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useIsoLayoutEffect(() => setMounted(true), []);
  return mounted;
}
