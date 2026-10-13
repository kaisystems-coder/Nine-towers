'use client';

import { create } from 'zustand';

export type CartView = 'bag' | 'checkout' | 'sent';

type UIState = {
  /** Persisted stores have been read from localStorage. */
  hydrated: boolean;
  cartOpen: boolean;
  cartView: CartView;
  searchOpen: boolean;
  menuOpen: boolean;
  /** Last order sent to WhatsApp, kept so the customer can reopen the chat. */
  lastOrder: { ref: string; url: string } | null;
  introDone: boolean;
  /** Mobile sticky add-to-bag bar is showing (lifts the WhatsApp button). */
  stickyBarVisible: boolean;
  setStickyBar: (v: boolean) => void;
  /** Header slid away (scrolling down): sticky bars can move up to the top. */
  headerHidden: boolean;
  setHeaderHidden: (v: boolean) => void;
  setHydrated: () => void;
  openCart: (view?: CartView) => void;
  closeCart: () => void;
  setCartView: (view: CartView) => void;
  setSearch: (open: boolean) => void;
  setMenu: (open: boolean) => void;
  setLastOrder: (o: UIState['lastOrder']) => void;
  setIntroDone: () => void;
};

export const useUI = create<UIState>()((set) => ({
  hydrated: false,
  cartOpen: false,
  cartView: 'bag',
  searchOpen: false,
  menuOpen: false,
  lastOrder: null,
  introDone: false,
  stickyBarVisible: false,
  headerHidden: false,
  setHeaderHidden: (headerHidden) => set({ headerHidden }),
  setStickyBar: (stickyBarVisible) => set({ stickyBarVisible }),
  setHydrated: () => set({ hydrated: true }),
  openCart: (view) => set((s) => ({ cartOpen: true, searchOpen: false, menuOpen: false, cartView: view ?? (s.cartView === 'sent' ? 'sent' : 'bag') })),
  closeCart: () => set({ cartOpen: false }),
  setCartView: (cartView) => set({ cartView }),
  setSearch: (searchOpen) => set({ searchOpen, menuOpen: false }),
  setMenu: (menuOpen) => set({ menuOpen }),
  setLastOrder: (lastOrder) => set({ lastOrder }),
  setIntroDone: () => set({ introDone: true }),
}));

/** True while any full-screen layer is open (used to pause smooth scroll). */
export const useAnyOverlayOpen = () => useUI((s) => s.cartOpen || s.searchOpen || s.menuOpen);
