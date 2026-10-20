'use client';

import { useRef, type ElementType } from 'react';
import { motion } from 'framer-motion';
import { useArmedReveal } from './useArmedReveal';
import { DUR, EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Line = string | { text: string; italic?: boolean };

/**
 * Line-by-line headline reveal: each line slides up from behind an
 * overflow mask. Pass lines explicitly so breaks are art-directed.
 */
export function MaskText({
  lines,
  as: Tag = 'h2',
  className,
  lineClassName,
  delay = 0,
  id,
}: {
  id?: string;
  lines: Line[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { shown } = useArmedReveal(ref);
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => {
        const l = typeof line === 'string' ? { text: line } : line;
        return (
          <span key={i} className={cn('block overflow-hidden pb-[0.22em] -mb-[0.22em]', lineClassName)}>
            <motion.span
              data-reveal=""
              className={cn('block', l.italic && 'display-italic')}
              initial={false}
              animate={shown ? { y: '0%' } : { y: '110%' }}
              transition={shown ? { duration: DUR.slow, ease: EASE, delay: delay + i * 0.1 } : { duration: 0 }}
            >
              {l.text}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
