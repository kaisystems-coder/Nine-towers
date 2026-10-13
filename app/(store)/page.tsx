import Link from 'next/link';
import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { CategoryTriptych } from '@/components/home/CategoryTriptych';
import { ProductRail } from '@/components/home/ProductRail';
import { TravelEdit } from '@/components/home/TravelEdit';
import { NinePieces } from '@/components/home/NinePieces';
import { JewellerySpotlight } from '@/components/home/JewellerySpotlight';
import { BrandStatement } from '@/components/home/BrandStatement';
import { ServiceBar } from '@/components/home/ServiceBar';
import { InstagramStrip } from '@/components/home/InstagramStrip';
import { ProductCard } from '@/components/product/ProductCard';
import { MaskText } from '@/components/motion/MaskText';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { getCatalog } from '@/lib/products-store';

/**
 * Each section below the hero sits in its own <Suspense> boundary so React
 * hydrates them as separate, interruptible chunks instead of one long task.
 */
export default async function HomePage() {
  const catalog = await getCatalog();
  const best = catalog.bestSellers(8);
  return (
    <>
      <Hero />
      <Suspense>
        <CategoryTriptych />
      </Suspense>
      <Suspense>
        <ProductRail
          id="new-in-title"
          title="New In"
          intro="This week’s arrivals, from fresh hoops to a carry-on with a laptop pocket."
          products={catalog.newIn(10)}
          viewAll={{ href: '/collections/new-in', label: 'View all' }}
          className="bg-ivory pb-2xl md:pb-3xl"
        />
      </Suspense>
      <Suspense>
        <TravelEdit />
      </Suspense>
      <Suspense>
        <NinePieces products={catalog.getNinePieces()} />
      </Suspense>
      <Suspense>
        <JewellerySpotlight />
      </Suspense>
      <Suspense>
        <BrandStatement />
      </Suspense>
      <Suspense>
        <section aria-labelledby="best-title" className="bg-ivory py-2xl md:py-3xl">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-s">
              <MaskText as="h2" id="best-title" lines={['Our picks']} className="font-display text-d-m" />
              <Link href="/shop" className="link-u is-underlined label">
                Shop everything
              </Link>
            </div>
            <RevealGroup as="ul" className="mt-l grid grid-cols-2 gap-x-s gap-y-l md:mt-xl md:gap-x-m md:gap-y-xl lg:grid-cols-4">
              {best.map((p, i) => (
                <RevealItem as="li" key={p.id} index={i % 4}>
                  <ProductCard product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      </Suspense>
      <Suspense>
        <ServiceBar />
      </Suspense>
      <Suspense>
        <InstagramStrip />
      </Suspense>
    </>
  );
}
