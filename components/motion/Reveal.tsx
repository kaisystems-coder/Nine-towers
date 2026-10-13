'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useArmedReveal } from './useArmedReveal';
import { DUR, EASE, STAGGER } from '@/lib/motion';

type Tag = 'div' | 'section' | 'article' | 'li' | 'ul' | 'span' | 'p' | 'figure' | 'header' | 'footer';

// motion[tag] components are cached by framer-motion, so this is stable across renders.
const m = (tag: Tag) => motion[tag] as typeof motion.div;

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  /** Rise distance in px */
  y?: number;
  id?: string;
};

const variants = (y: number, delay: number) => ({
  hidden: { opacity: 0, y, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE, delay } },
});

/** Fade + 24px rise on viewport entry. Visible at rest. */
export function Reveal({ children, className, as = 'div', delay = 0, y = 24, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { shown } = useArmedReveal(ref);
  const Comp = m(as);
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      data-reveal=""
      className={className}
      initial={false}
      animate={shown ? 'show' : 'hidden'}
      variants={variants(y, delay)}
    >
      {children}
    </Comp>
  );
}

const GroupCtx = createContext<{ shown: boolean; stagger: number; delay: number }>({ shown: true, stagger: STAGGER, delay: 0 });

/** One viewport trigger for a whole list; children stagger from it. */
export function RevealGroup({
  children,
  className,
  as = 'div',
  stagger = STAGGER,
  delay = 0,
}: RevealProps & { stagger?: number }) {
  const ref = useRef<HTMLElement>(null);
  const { shown } = useArmedReveal(ref, '0px 0px -5% 0px');
  const Comp = as as 'div';
  return (
    <GroupCtx.Provider value={{ shown, stagger, delay }}>
      <Comp ref={ref as React.RefObject<HTMLDivElement>} className={className}>
        {children}
      </Comp>
    </GroupCtx.Provider>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
  index = 0,
  y = 24,
}: RevealProps & { index?: number }) {
  const { shown, stagger, delay } = useContext(GroupCtx);
  const Comp = m(as);
  return (
    <Comp
      data-reveal=""
      className={className}
      initial={false}
      animate={shown ? 'show' : 'hidden'}
      variants={variants(y, delay + index * stagger)}
    >
      {children}
    </Comp>
  );
}
