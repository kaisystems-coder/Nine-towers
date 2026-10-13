'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { useReducedMotion } from '@/lib/hooks';

/** The full lockup, rising into place as the footer scrolls in. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['18%', '0%']);
  const clip = useTransform(scrollYProgress, [0, 0.85], ['inset(35% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']);

  return (
    <div ref={ref} className="container-x flex justify-center overflow-hidden pb-xl pt-l">
      {reduced ? (
        <div className="w-[min(100%,760px)] text-ivory">
          <Logo variant="full" className="w-full" />
        </div>
      ) : (
        <motion.div style={{ y, clipPath: clip }} className="w-[min(100%,760px)] text-ivory">
          <Logo variant="full" className="w-full" />
        </motion.div>
      )}
    </div>
  );
}
