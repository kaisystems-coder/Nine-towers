'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks';

const LINE = 'Fewer pieces, chosen with care. Jewellery to wear, bags to carry, luggage to take you further.';
const EMPHASIS = new Set(['care.']);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={EMPHASIS.has(word) ? 'display-italic text-champagne' : undefined}>
      {word}{' '}
    </motion.span>
  );
}

/** One large serif line that resolves word by word as you scroll. */
export function BrandStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = LINE.split(' ');
  return (
    <section aria-label="Our approach" className="on-dark bg-obsidian py-3xl text-ivory md:py-4xl">
      <div className="container-x">
        <p ref={ref} className="mx-auto max-w-[22ch] text-center font-display text-d-l md:max-w-[24ch]">
          <span className="sr-only">{LINE}</span>
          <span aria-hidden="true">
            {words.map((w, i) =>
              reduced ? (
                // Plain spans (new nodes), so no scrubbed inline opacity is left behind.
                <span key={`r${i}`} className={EMPHASIS.has(w) ? 'display-italic text-champagne' : undefined}>
                  {w}{' '}
                </span>
              ) : (
                <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
              )
            )}
          </span>
        </p>
      </div>
    </section>
  );
}
