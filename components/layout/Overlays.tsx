'use client';

import dynamic from 'next/dynamic';

/**
 * Layers that never appear in the first paint load as separate chunks after
 * the page is interactive, keeping their code (and the checkout form's
 * validation libraries) out of every page's initial JavaScript.
 */
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then((m) => m.CartDrawer), { ssr: false });
const SearchOverlay = dynamic(() => import('./SearchOverlay').then((m) => m.SearchOverlay), { ssr: false });
const MobileMenu = dynamic(() => import('./MobileMenu').then((m) => m.MobileMenu), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/motion/CustomCursor').then((m) => m.CustomCursor), { ssr: false });

export function Overlays() {
  return (
    <>
      <CartDrawer />
      <SearchOverlay />
      <MobileMenu />
      <CustomCursor />
    </>
  );
}
