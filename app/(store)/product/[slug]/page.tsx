import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Gallery } from '@/components/pdp/Gallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { RecentlyViewed } from '@/components/pdp/RecentlyViewed';
import { ProductRail } from '@/components/home/ProductRail';
import { JsonLd } from '@/components/seo/JsonLd';
import { getCatalog } from '@/lib/products-store';
import { categories } from '@/data/categories';
import { site } from '@/config/site';
import { hasAsset } from '@/lib/assets';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return (await getCatalog()).all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = (await getCatalog()).getProduct(params.slug);
  if (!p) return {};
  const desc = `${p.description} ${categories[p.category].singular} from Nine Towers Collection, delivered islandwide in Trinidad & Tobago.`;
  const image = hasAsset(p.images[0]) ? p.images[0] : undefined;
  return {
    title: p.name,
    description: desc.slice(0, 300),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} | ${site.name}`, description: p.description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { getProduct, completeTheLook, youMayAlsoLike } = await getCatalog();
  const p = getProduct(params.slug);
  if (!p) notFound();
  const url = `${site.url}/product/${p.slug}`;
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          description: p.description,
          sku: p.itemNo ?? p.id,
          ...(p.itemNo ? { mpn: p.itemNo } : {}),
          category: categories[p.category].title,
          brand: { '@type': 'Brand', name: site.name },
          image: p.images.filter((i) => hasAsset(i)).map((i) => `${site.url}${i}`),
          url,
          ...(p.price > 0 ? { offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'TTD',
            price: p.price.toFixed(2),
            availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: site.name },
          } } : {}),
        }}
      />
      <section className="bg-ivory pb-2xl pt-m md:pt-l">
        <div className="container-x grid gap-l lg:grid-cols-12 lg:gap-xl">
          <div className="lg:col-span-7">
            <Gallery product={p} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--bar-h)_-_var(--condense)_+_var(--space-m))]">
              <ProductInfo product={p} />
            </div>
          </div>
        </div>
      </section>
      <Suspense>
        <ProductRail id="look-title" title="Complete the Look" products={completeTheLook(p, 6)} className="bg-ivory pb-2xl md:pb-3xl" />
        <ProductRail id="like-title" title="You May Also Like" products={youMayAlsoLike(p, 8)} viewAll={{ href: `/shop/${p.category}`, label: `All ${categories[p.category].title.toLowerCase()}` }} className="bg-ivory pb-2xl md:pb-3xl" />
        <RecentlyViewed exclude={p.slug} />
      </Suspense>
    </>
  );
}
