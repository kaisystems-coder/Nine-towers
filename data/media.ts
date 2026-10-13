import { hasAsset } from '@/lib/assets';

/**
 * Editorial photography slots. Drop a file at the path shown and it replaces
 * the neutral plate automatically (restart dev or run `npm run assets`).
 * Recommended sizes are in brackets.
 */
export const media = {
  heroVideo: '/media/hero.mp4', // [1920×1080, muted, under 8MB]
  heroPoster: '/media/hero-poster.jpg', // [2400×1600] also used if there is no video
  travelEdit: '/media/travel-edit.jpg', // [1600×2000 portrait]
  statement: '/media/statement.jpg', // [2400×1200]
  aboutHero: '/media/about-hero.jpg', // [2400×1400]
  aboutDetail: '/media/about-detail.jpg', // [1600×2000]
  spotlight: [
    '/media/spotlight-1.jpg', // [1200×1500]
    '/media/spotlight-2.jpg', // [1200×1200]
    '/media/spotlight-3.jpg', // [1200×1600]
    '/media/spotlight-4.jpg', // [1200×1200]
    '/media/spotlight-5.jpg', // [1200×1500]
  ],
  instagram: [1, 2, 3, 4, 5, 6].map((n) => `/media/instagram-${n}.jpg`), // [1080×1080]
} as const;

/** The hero has photography, so the header sits in ivory over a dark scrim. */
export const heroHasMedia = hasAsset(media.heroVideo) || hasAsset(media.heroPoster);
