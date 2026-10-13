import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { getCatalog } from '@/lib/products-store';
import { categoryList } from '@/data/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { all: allProducts, collectionsWithStock } = await getCatalog();
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly') => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page('/', 1, 'daily'),
    page('/shop', 0.9, 'daily'),
    ...categoryList.map((c) => page(`/shop/${c.slug}`, 0.9, 'daily')),
    page('/collections', 0.7),
    ...collectionsWithStock().map((c) => page(`/collections/${c.slug}`, 0.8)),
    ...allProducts.map((p) => page(`/product/${p.slug}`, 0.8)),
    page('/about', 0.5, 'monthly'),
    page('/contact', 0.5, 'monthly'),
    page('/faq', 0.5, 'monthly'),
    page('/delivery-returns', 0.4, 'monthly'),
    page('/privacy', 0.2, 'monthly'),
    page('/terms', 0.2, 'monthly'),
  ];
}
