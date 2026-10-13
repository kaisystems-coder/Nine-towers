'use client';

import { create } from 'zustand';

/** The photo for the colour/size chosen on a product page, shared with its gallery. */
export const usePdpView = create<{ slug: string; image?: string; set: (slug: string, image?: string) => void }>()((set) => ({
  slug: '',
  image: undefined,
  set: (slug, image) => set({ slug, image }),
}));
