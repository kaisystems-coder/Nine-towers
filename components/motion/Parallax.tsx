'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/cn';

/**
 * Scroll-linked vertical drift. The inner layer is oversized by `amount`
 * on both edges so no gap ever shows. Off for reduced motion.
 */
export function Parallax({
  children,
  amount = 48,
  className,
  innerClassName,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={cn('overflow-hidden', className ?? 'relative')}>
      <motion.div
        className={cn('absolute inset-x-0', innerClassName)}
        style={{ top: -amount, bottom: -amount, y: reduced ? 0 : y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
