'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, useMotionValue, type MotionValue } from 'framer-motion';
import { Media } from '@/components/ui/Media';
import { Price } from '@/components/product/Price';
import { useIsDesktop, useReducedMotion } from '@/lib/hooks';
import { pad2 } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/types';

function Piece({ p, i }: { p: Product; i: number }) {
  return (
    <Link href={`/product/${p.slug}`} className="group block" data-cursor="View">
      <div className="relative aspect-portrait overflow-hidden rounded-xs bg-cream">
        <div className="absolute inset-0 transition-transform duration-[1600ms] ease-brand group-hover:scale-[1.05]">
          <Media src={p.images[0]} alt={p.name} sizes="(min-width: 1024px) 28vw, 75vw" plate={{ icon: p.category, seed: p.slug, shot: i % 3 }} />
        </div>
        <span className="tabular absolute left-s top-s font-display text-d-s text-obsidian">{pad2(i + 1)}</span>
      </div>
      <div className="mt-s flex items-start justify-between gap-s">
        <h3 className="label leading-snug">{p.name}</h3>
        <Price price={p.price} compareAt={p.compareAtPrice} className="shrink-0" />
      </div>
    </Link>
  );
}

function Intro({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 id="nine-title" className="font-display text-d-l">
        Nine Pieces,
        <br />
        <span className="display-italic">Nine Towers.</span>
      </h2>
      <p className="mt-m max-w-[34ch] text-body text-stone">
        One piece for each tower in our name. The nine we would choose if we could only keep nine.
      </p>
    </div>
  );
}

/** Tower-shaped progress: a slim column that fills from its base. */
function TowerProgress({ value, current, total }: { value: MotionValue<number>; current: number; total: number }) {
  return (
    <div className="flex items-end gap-s" aria-hidden="true">
      <div className="relative flex h-16 w-[6px] flex-col items-center">
        <span className="h-3 w-px bg-obsidian" />
        <span className="relative w-full flex-1 overflow-hidden bg-obsidian/15">
          <motion.span className="absolute inset-0 origin-bottom bg-obsidian" style={{ scaleY: value }} />
        </span>
      </div>
      <p className="tabular font-display text-d-xs leading-none">
        {pad2(current)}
        <span className="text-stone"> / {pad2(total)}</span>
      </p>
    </div>
  );
}

/**
 * Vertical scroll drives a horizontal pan across the nine pieces, with a
 * sticky 01/09 counter. Phones and reduced motion get a native swipe rail.
 */
export function NinePieces({ products }: { products: Product[] }) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const pinned = desktop && !reduced;
  const n = products.length;

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(1);
  const fill = useMotionValue(1 / n);

  useEffect(() => {
    if (!pinned || !track.current) return;
    const measure = () => track.current && setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pinned) return;
    fill.set(Math.max(1 / n, v));
    const idx = Math.min(n, Math.max(1, Math.round(v * (n - 1)) + 1));
    setCurrent((c) => (c === idx ? c : idx));
  });

  // Mobile rail counter
  const onRailScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const v = max > 0 ? el.scrollLeft / max : 0;
    fill.set(Math.max(1 / n, v));
    const idx = Math.min(n, Math.max(1, Math.round(v * (n - 1)) + 1));
    setCurrent((c) => (c === idx ? c : idx));
  };

  if (pinned)
    return (
      <section ref={section} aria-labelledby="nine-title" className="relative bg-ivory" style={{ height: `calc(100dvh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
          <motion.div ref={track} className="flex w-max items-center gap-l pl-[max(var(--gutter),calc((100vw_-_var(--content-max))_/_2))] pr-[12vw]" style={{ x }}>
            <Intro className="w-[30vw] max-w-[440px] shrink-0 pr-l" />
            {products.map((p, i) => (
              <div key={p.id} className={cn('w-[26vw] max-w-[380px] shrink-0', i % 2 === 1 && 'translate-y-l')}>
                <Piece p={p} i={i} />
              </div>
            ))}
          </motion.div>
          <div className="container-x absolute inset-x-0 bottom-l">
            <TowerProgress value={fill} current={current} total={n} />
          </div>
        </div>
      </section>
    );

  return (
    <section aria-labelledby="nine-title" className="bg-ivory py-2xl">
      <Intro className="container-x" />
      <div
        ref={rail}
        onScroll={onRailScroll}
        role="region"
        aria-label="Nine pieces"
        className="no-scrollbar mt-xl flex snap-x snap-mandatory gap-s overflow-x-auto px-gutter"
        style={{ scrollPaddingInline: 'var(--gutter)' }}
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[74vw] max-w-[340px] shrink-0 snap-start">
            <Piece p={p} i={i} />
          </div>
        ))}
      </div>
      <div className="container-x mt-l">
        <TowerProgress value={fill} current={current} total={n} />
      </div>
    </section>
  );
}
