import type { Category, CategoryInfo } from './types';

/**
 * Store categories. Subcategories with no products are hidden from menus and
 * filters automatically, so the extra ones are here ready for future stock.
 * Menu and tile photos come from the products themselves.
 */
export const categories: Record<Category, CategoryInfo> = {
  jewellery: {
    slug: 'jewellery',
    title: 'Jewellery',
    singular: 'Jewellery',
    headline: 'Jewellery',
    intro:
      'Pendants, hoops, studs and charm bracelets in gold and silver tones, with crystal, pearl and enamel details.',
    image: '/media/category-jewellery.jpg',
    subcategories: [
      { slug: 'necklaces', label: 'Necklaces' },
      { slug: 'earrings', label: 'Earrings' },
      { slug: 'bracelets', label: 'Bracelets' },
      { slug: 'rings', label: 'Rings' },
    ],
    care: [
      'Put jewellery on last, after perfume, lotion and hair products.',
      'Remove before swimming, showering or exercising.',
      'Wipe with a soft dry cloth after wearing.',
      'Store pieces separately to prevent scratches.',
    ],
  },
  luggage: {
    slug: 'luggage',
    title: 'Luggage',
    singular: 'Luggage',
    headline: 'Luggage',
    intro: 'Two- and three-piece luggage sets from Airliner and iFly with 360° wheels, plus trolley bags.',
    image: '/media/category-luggage.jpg',
    subcategories: [
      { slug: 'sets', label: 'Luggage Sets' },
      { slug: 'backpacks', label: 'Trolley Bags' },
      { slug: 'carry-on', label: 'Carry-On' },
      { slug: 'check-in', label: 'Check-In' },
      { slug: 'travel-bags', label: 'Travel Bags' },
    ],
    care: [
      'Wipe the shell with a damp cloth and mild soap; avoid abrasive cleaners.',
      'Clean wheels after travel to keep them turning smoothly.',
      'Store empty, upright and out of direct sunlight.',
      'Set the TSA lock combination before first use.',
    ],
  },
  handbags: {
    slug: 'handbags',
    title: 'Handbags',
    singular: 'Handbag',
    headline: 'Handbags',
    intro: 'Top-handle bags, crossbodies, shoulder bags and totes from Gusto, Arena Milano and Wellington Polo Club.',
    image: '/media/category-handbags.jpg',
    subcategories: [
      { slug: 'top-handle', label: 'Top Handle' },
      { slug: 'crossbody', label: 'Crossbody' },
      { slug: 'shoulder-bags', label: 'Shoulder Bags' },
      { slug: 'totes', label: 'Totes' },
      { slug: 'clutches', label: 'Clutches' },
    ],
    care: [
      'Stuff with tissue when not in use to keep the shape.',
      'Keep away from direct heat, rain and prolonged sunlight.',
      'Wipe with a soft, slightly damp cloth; do not soak.',
      'Store in a dust bag or pillowcase.',
    ],
  },
  electronics: {
    slug: 'electronics',
    title: 'Tech',
    singular: 'Tech',
    headline: 'Tech',
    intro: 'Security cameras, a dash cam, noise-cancelling earbuds, fast chargers and a power bank, chosen for home, car and travel.',
    image: '/media/category-tech.jpg',
    subcategories: [
      { slug: 'cameras', label: 'Security Cameras' },
      { slug: 'audio', label: 'Earbuds & Audio' },
      { slug: 'chargers', label: 'Chargers' },
      { slug: 'power-banks', label: 'Power Banks' },
      { slug: 'dash-cams', label: 'Dash Cams' },
    ],
    care: [
      'Read the instructions in the box before first use.',
      'Keep indoor devices away from water and direct heat.',
      'Use the cable and adapter supplied, or a certified equivalent.',
      'Keep the box and receipt in case you need to return a faulty item.',
    ],
  },
};

export const categoryList = [categories.jewellery, categories.handbags, categories.luggage, categories.electronics];

export function subcategoryLabel(category: Category, slug: string) {
  return categories[category]?.subcategories.find((s) => s.slug === slug)?.label ?? slug;
}
