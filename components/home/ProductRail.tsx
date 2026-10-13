'use client';

import Link from 'next/link';
import { ScrollRail } from '@/components/ui/ScrollRail';
import { ProductCard } from '@/components/product/ProductCard';
import { MaskText } from '@/components/motion/MaskText';
import type { Product } from '@/data/types';

/** Section header + draggable rail of product cards. */
export function ProductRail({
  id,
  title,
  intro,
  products,
  viewAll,
  className,
}: {
  id: string;
  title: string;
  intro?: string;
  products: Product[];
  viewAll?: { href: string; label: string };
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={className}>
      <ScrollRail
        label={title}
        trackClassName="gap-s px-gutter md:gap-m lg:px-[max(var(--gutter),calc((100vw_-_var(--content-max))_/_2))]"
        controlsSlot={(controls) => (
          <div className="container-x mb-l flex items-end justify-between gap-m">
            <div>
              <MaskText as="h2" id={id} lines={[title]} className="font-display text-d-m" />
              {intro && <p className="mt-xs max-w-[48ch] text-body text-stone">{intro}</p>}
            </div>
            <div className="flex items-center gap-m">
              {viewAll && (
                <Link href={viewAll.href} className="link-u is-underlined label whitespace-nowrap">
                  {viewAll.label}
                </Link>
              )}
              <div className="hidden md:block">{controls}</div>
            </div>
          </div>
        )}
      >
        {products.map((p) => (
          <div key={p.id} className="w-[68vw] max-w-[340px] shrink-0 snap-start xs:w-[62vw] md:w-[30vw] lg:w-[23vw]">
            <ProductCard product={p} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 66vw" />
          </div>
        ))}
      </ScrollRail>
    </section>
  );
}
