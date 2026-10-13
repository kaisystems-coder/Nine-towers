import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shop/PageHeader';
import { ShopView, ShopViewFallback } from '@/components/shop/ShopView';
import { collections, getCollection } from '@/data/collections';
import { getCatalog } from '@/lib/products-store';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getCollection(params.slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.intro,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: `${c.title} | Nine Towers Collection`, description: c.intro },
  };
}

export default async function CollectionPage({ params }: Props) {
  const c = getCollection(params.slug);
  if (!c) notFound();
  const { byCollection } = await getCatalog();
  return (
    <>
      <PageHeader
        title={c.title}
        kicker={c.kicker}
        intro={c.intro}
        image={c.image}
        icon={c.plateIcon}
        crumbs={[{ label: 'Collections', href: '/collections' }, { label: c.title }]}
      />
      <Suspense fallback={<ShopViewFallback products={byCollection(c.slug)} emptyHref={`/collections/${c.slug}`} />}>
        <ShopView products={byCollection(c.slug)} emptyHref={`/collections/${c.slug}`} />
      </Suspense>
    </>
  );
}
