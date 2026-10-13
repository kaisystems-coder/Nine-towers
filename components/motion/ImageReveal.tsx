'use client';

import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useArmedReveal } from './useArmedReveal';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';

/** Clip-path wipe upward plus a scale settle from 1.15 to 1. */
export function ImageReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { shown } = useArmedReveal(ref, '0px 0px -8% 0px');
  const hiddenClip = direction === 'up' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)';
  return (
    <motion.div
      ref={ref}
      data-reveal=""
      className={cn('relative overflow-hidden', className)}
      initial={false}
      animate={{ clipPath: shown ? 'inset(0% 0% 0% 0%)' : hiddenClip }}
      transition={shown ? { duration: 1.2, ease: EASE, delay } : { duration: 0 }}
    >
      <motion.div
        data-reveal=""
        className="absolute inset-0"
        initial={false}
        animate={{ scale: shown ? 1 : 1.15 }}
        transition={shown ? { duration: 1.6, ease: EASE, delay } : { duration: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
