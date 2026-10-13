'use client';

import { useEffect, useRef, useState } from 'react';
import { Media } from '@/components/ui/Media';
import { ArrowsOut } from '@/components/ui/icons';
import dynamic from 'next/dynamic';

const Lightbox = dynamic(() => import('./Lightbox').then((m) => m.Lightbox), { ssr: false });
import { landMorph } from '@/lib/morph';
import { usePdpView } from '@/lib/pdp-store';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/types';

/**
 * Desktop: a vertical stack of large images that scrolls beside the sticky
 * info panel. Mobile: a swipeable carousel with a progress line and dots.
 * The first image is the landing spot for the card → page shared transition.
 */
export function Gallery({ product: p }: { product: Product }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  // The chosen colour's photo leads the gallery.
  const chosen = usePdpView((s) => (s.slug === p.slug ? s.image : undefined));
  const images = chosen && p.images.includes(chosen) ? [chosen, ...p.images.filter((x) => x !== chosen)] : p.images;
  const n = images.length;
  useEffect(() => {
    rail.current?.scrollTo({ left: 0 });
    setActive(0);
  }, [chosen]);
  const deskMain = useRef<HTMLDivElement>(null);
  const mobileMain = useRef<HTMLDivElement>(null);

  // Receive the card image (shared-element transition) once the route has
  // settled at the top of the page.
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const target = [deskMain.current, mobileMain.current].find((el) => el && el.offsetParent !== null);
        if (target) landMorph(p.slug, target);
      })
    );
    return () => cancelAnimationFrame(raf);
  }, [p.slug]);

  // A render helper, not a component, so frames aren't remounted on every state change.
  const frame = (i: number, sizes: string, priority = false) => (
    <button
      key={i}
      type="button"
      onClick={() => setLightbox(i)}
      aria-label={`Open image ${i + 1} of ${n} full screen`}
      className="group relative block aspect-product w-full overflow-hidden rounded-xs bg-cream"
      data-cursor="View"
    >
      <Media key={images[i]} src={images[i]} alt={i === 0 ? p.name : `${p.name}, view ${i + 1}`} sizes={sizes} priority={priority} plate={{ icon: p.category, seed: p.slug, shot: i }} />
      <span className="absolute bottom-s right-s inline-flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 opacity-0 transition-opacity duration-base ease-brand group-hover:opacity-100 group-focus-visible:opacity-100">
        <ArrowsOut size={18} weight="light" aria-hidden="true" />
      </span>
    </button>
  );

  return (
    <>
      {/* Desktop stack */}
      <div className="hidden flex-col gap-s lg:flex">
        {images.map((_, i) =>
          i === 0 ? (
            <div key={i} ref={deskMain}>
              {frame(0, "(min-width: 1024px) 58vw, 100vw", true)}
            </div>
          ) : (
            frame(i, "(min-width: 1024px) 58vw, 100vw")
          )
        )}
      </div>

      {/* Mobile carousel */}
      <div className="-mx-gutter lg:hidden">
        <div
          ref={rail}
          role="region"
          aria-label={`${p.name} images`}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          onScroll={() => {
            const el = rail.current;
            if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((_, i) => (
            <div key={i} className="w-full shrink-0 snap-center">
              {i === 0 ? (
                <div ref={mobileMain}>
                  {frame(0, "100vw", true)}
                </div>
              ) : (
                frame(i, "100vw")
              )}
            </div>
          ))}
        </div>
        <div className="mt-s flex items-center justify-center gap-xs px-gutter" aria-hidden="true">
          {images.map((_, i) => (
            <span key={i} className={cn('h-[3px] rounded-full bg-obsidian transition-[transform,opacity] duration-base ease-brand', 'w-6', i === active ? 'opacity-100' : 'scale-x-50 opacity-25')} />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Image {active + 1} of {n}
        </p>
      </div>

      <Lightbox product={{ ...p, images }} index={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
