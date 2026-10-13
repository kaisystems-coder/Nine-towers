import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shop/PageHeader';
import { ShopView, ShopViewFallback } from '@/components/shop/ShopView';
import { categories } from '@/data/categories';
import { getCatalog } from '@/lib/products-store';
import type { Category } from '@/data/types';

type Props = { params: { category: string } };

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export function generateMetadata({ params }: Props): Metadata {
  const c = categories[params.category as Category];
  if (!c) return {};
  return {
    title: c.title,
    description: `${c.intro} Order on WhatsApp with islandwide delivery in Trinidad & Tobago.`,
    alternates: { canonical: `/shop/${c.slug}` },
    openGraph: { title: `${c.title} | Nine Towers Collection`, description: c.intro },
  };
}

const italics: Record<Category, string> = {
  jewellery: 'to wear every day.',
  luggage: 'for every departure.',
  handbags: 'to carry with ease.',
  electronics: 'for home and away.',
};

export default async function CategoryPage({ params }: Props) {
  const c = categories[params.category as Category];
  if (!c) notFound();
  const { byCategory } = await getCatalog();
  return (
    <>
      <PageHeader
        title={c.headline}
        italic={italics[c.slug]}
        intro={c.intro}
        image={c.image}
        icon={c.slug}
        crumbs={[{ label: 'Shop', href: '/shop' }, { label: c.title }]}
      />
      <Suspense fallback={<ShopViewFallback products={byCategory(c.slug)} category={c.slug} emptyHref={`/shop/${c.slug}`} />}>
        <ShopView products={byCategory(c.slug)} category={c.slug} emptyHref={`/shop/${c.slug}`} />
      </Suspense>
    </>
  );
}
