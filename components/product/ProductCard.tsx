'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Media } from '@/components/ui/Media';
import { Badge, productBadge } from './Badge';
import { Price } from './Price';
import { QuickAdd } from './QuickAdd';
import { WishlistButton } from './WishlistButton';
import { subcategoryLabel } from '@/data/categories';
import { prefersReducedMotion } from '@/lib/hooks';
import { startMorph } from '@/lib/morph';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/types';

/**
 * Portrait 4:5 image that crossfades to the second shot on hover, Quick Add
 * bar, wishlist heart, one badge, then name and price in restrained type.
 * Clicking hands the image to the product page as a shared element (lib/morph).
 */
export function ProductCard({
  product: p,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  priority = false,
  className,
  showQuickAdd = true,
}: {
  product: Product;
  sizes?: string;
  priority?: boolean;
  className?: string;
  showQuickAdd?: boolean;
}) {
  const router = useRouter();
  const imageRef = useRef<HTMLDivElement>(null);
  const href = `/product/${p.slug}`;
  const badge = productBadge(p);

  const go = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || prefersReducedMotion()) return;
    e.preventDefault();
    if (imageRef.current) startMorph(p.slug, imageRef.current);
    router.push(href);
  };

  return (
    <article className={cn('group relative', className)}>
      <div className="relative aspect-product overflow-hidden rounded-xs bg-cream" data-cursor="View">
        <Link href={href} onClick={go} data-transition="morph" tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <div ref={imageRef} className="absolute inset-0 overflow-hidden rounded-xs bg-cream">
            <div className="absolute inset-0 transition-transform duration-slower ease-brand hover-fine:group-hover:scale-[1.03]">
              <Media
                src={p.images[0]}
                alt={p.name}
                sizes={sizes}
                priority={priority}
                plate={{ icon: p.category, seed: p.slug, shot: 0 }}
              />
            </div>
            {p.images[1] && (
              <div className="absolute inset-0 opacity-0 transition-[opacity,transform] duration-slow ease-brand hover-fine:group-hover:scale-[1.03] hover-fine:group-hover:opacity-100">
                <Media src={p.images[1]} alt="" sizes={sizes} plate={{ icon: p.category, seed: p.slug, shot: 1 }} />
              </div>
            )}
          </div>
        </Link>

        {badge && <Badge label={badge.label} tone={badge.tone} className="absolute left-xs top-xs z-raised" />}
        <WishlistButton id={p.id} name={p.name} className="absolute right-0 top-0 z-raised" />
        {showQuickAdd && <QuickAdd product={p} />}
      </div>

      {/* Stacked on narrow cards so long names and "Price on request" both stay readable */}
      <div className="mt-s flex flex-col gap-[2px] md:flex-row md:items-start md:justify-between md:gap-s">
        <div className="min-w-0">
          <h3 className="label leading-snug">
            <Link href={href} onClick={go} data-transition="morph" data-cursor="View" className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-obsidian">
              <span className="relative">{p.name}</span>
            </Link>
          </h3>
          <p className="mt-[2px] text-caption text-stone">{subcategoryLabel(p.category, p.subcategory)}</p>
        </div>
        <Price price={p.price} compareAt={p.compareAtPrice} className="shrink-0 md:justify-end md:text-right" />
      </div>
    </article>
  );
}
