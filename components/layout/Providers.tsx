'use client';

import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import { useRecentlyViewed, useWishlist } from '@/lib/wishlist-store';
import { useUI } from '@/lib/ui-store';

/** Reads persisted stores after hydration so server and client HTML match. */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Promise.all([useCart.persist.rehydrate(), useWishlist.persist.rehydrate(), useRecentlyViewed.persist.rehydrate()]).then(() =>
      useUI.getState().setHydrated()
    );
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
