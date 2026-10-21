import type { Collection } from './types';

/**
 * Curated edits. A product joins a collection by listing the collection's
 * slug in its `collections` array in data/products.ts.
 */
export const collections: Collection[] = [
  {
    slug: 'new-in',
    title: 'New In',
    kicker: 'Arriving weekly',
    intro: 'The latest pieces to reach the boutique, from butterfly drops to this season’s luggage sets.',
    image: '/media/collection-new-in.jpg',
    plateIcon: 'jewellery',
  },
  {
    slug: 'the-travel-edit',
    title: 'The Travel Edit',
    kicker: 'For every departure',
    intro:
      'Three-piece luggage sets, a crossbody for the airport, and the earbuds and charger that travel with you.',
    image: '/media/collection-travel.jpg',
    plateIcon: 'luggage',
  },
  {
    slug: 'evening',
    title: 'Evening',
    kicker: 'After six',
    intro: 'Top-handle bags, pearls and a little sparkle. Chosen for weddings, fêtes and long dinners.',
    image: '/media/collection-evening.jpg',
    plateIcon: 'handbags',
  },
  {
    slug: 'gifts-under-500',
    title: 'Gifts Under $500',
    kicker: 'Thoughtful, under $500',
    intro: 'Jewellery and handbags under TT$500, chosen to give.',
    image: '/media/collection-gifts.jpg',
    plateIcon: 'jewellery',
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
