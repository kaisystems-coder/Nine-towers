/**
 * ONE SOURCE OF TRUTH for store details.
 * Change the WhatsApp number, delivery threshold, socials and copy here.
 * Values marked TODO are placeholders waiting for the real details.
 */
export const site = {
  name: 'Nine Towers Collection',
  shortName: 'Nine Towers',
  tagline: 'Fashion jewellery, ladies’ handbags, luggage and tech, curated in Trinidad & Tobago.',
  description:
    'Nine Towers Collection is an online boutique in Trinidad & Tobago for fashion jewellery, ladies’ handbags, luggage and tech. Order on WhatsApp, with islandwide delivery.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ninetowerscollection.com', // TODO: confirm live domain
  locale: 'en_TT',
  country: 'Trinidad & Tobago',

  /** WhatsApp number in international format, digits only (1 868 + 7 digits). */
  whatsappNumber: '18682595393',
  whatsappDisplay: '+1 (868) 259-5393',

  currency: 'TTD',

  /** Orders at or above this subtotal (TTD) ship free. */
  freeDeliveryThreshold: 1000,

  socials: {
    instagram: 'https://www.instagram.com/ninetowerscollection', // TODO: confirm handle
    instagramHandle: '@ninetowerscollection', // TODO
    facebook: 'https://www.facebook.com/ninetowerscollection', // TODO
    tiktok: 'https://www.tiktok.com/@ninetowerscollection', // TODO
  },

  announcements: [
    'Islandwide delivery across Trinidad & Tobago',
    'Order via WhatsApp, payment arranged in chat',
    'New arrivals weekly',
  ],

  /** Delivery areas offered at checkout. */
  deliveryAreas: [
    'Port of Spain',
    'Diego Martin',
    'San Juan–Laventille',
    'Tunapuna–Piarco',
    'Arima',
    'Sangre Grande',
    'Chaguanas',
    'Couva–Tabaquite–Talparo',
    'San Fernando',
    'Princes Town',
    'Penal–Debe',
    'Siparia',
    'Point Fortin',
    'Mayaro–Rio Claro',
    'Tobago',
  ],

  /** Shown on the checkout form when the customer chooses pickup. */
  pickupNote: 'We’ll share the pickup point and a time on WhatsApp.',

  popularSearches: ['Butterfly', 'Pearl', 'Heart', 'Charm bracelet', 'Luggage set', 'Camera'],
} as const;

export type Site = typeof site;

/** Primary navigation. Mega-menu content is built from data/categories.ts. */
export const mainNav = [
  { label: 'Home', href: '/', menu: null },
  { label: 'Jewellery', href: '/shop/jewellery', menu: 'jewellery' },
  { label: 'Handbags', href: '/shop/handbags', menu: 'handbags' },
  { label: 'Luggage', href: '/shop/luggage', menu: 'luggage' },
  { label: 'Tech', href: '/shop/electronics', menu: 'electronics' },
  { label: 'Collections', href: '/collections', menu: 'collections' },
] as const;

export const footerNav = {
  Shop: [
    { label: 'Home', href: '/' },
    { label: 'New In', href: '/collections/new-in' },
    { label: 'Jewellery', href: '/shop/jewellery' },
    { label: 'Luggage', href: '/shop/luggage' },
    { label: 'Handbags', href: '/shop/handbags' },
    { label: 'Tech', href: '/shop/electronics' },
  ],
  Help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Delivery & Returns', href: '/delivery-returns' },
    { label: 'Contact', href: '/contact' },
    { label: 'Your Bag', href: '/cart' },
    { label: 'Wishlist', href: '/wishlist' },
  ],
  About: [
    { label: 'The Nine Towers', href: '/about' },
    { label: 'The Travel Edit', href: '/collections/the-travel-edit' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
} as const;
