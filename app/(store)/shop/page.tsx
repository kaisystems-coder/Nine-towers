import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shop/PageHeader';
import { ShopView, ShopViewFallback } from '@/components/shop/ShopView';
import { getCatalog } from '@/lib/products-store';

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Fashion jewellery, luggage and ladies’ handbags from Nine Towers Collection. Order on WhatsApp with islandwide delivery in Trinidad & Tobago.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  const { all: allProducts } = await getCatalog();
  return (
    <>
      <PageHeader
        title="The Boutique"
        italic="everything, in one place."
        intro="Every piece we carry, from butterfly studs to a three-piece luggage set. Filter by type, colour or price."
        crumbs={[{ label: 'Shop' }]}
        image="/media/shop-hero.jpg"
        icon="jewellery"
      />
      <Suspense fallback={<ShopViewFallback products={allProducts} />}>
        <ShopView products={allProducts} />
      </Suspense>
    </>
  );
}
