'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePointerFine, useReducedMotion } from '@/lib/hooks';
import { EASE } from '@/lib/motion';

/**
 * A small dot that follows the pointer and opens into a labelled disc over
 * anything marked data-cursor="View" | "Drag". Desktop pointers only; the
 * native cursor stays visible.
 */
export function CustomCursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-cursor]');
      setLabel(el ? el.getAttribute('data-cursor') : null);
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-cursor"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* `relative` anchors the fills: once the scale settles Framer writes transform: none,
          which stops this box being their containing block */}
      <motion.div
        className="relative -ml-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-full"
        initial={false}
        animate={{ scale: label ? 1 : 0.1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-champagne"
          initial={false}
          animate={{ opacity: label ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-obsidian"
          initial={false}
          animate={{ opacity: label ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="label relative text-ivory"
          initial={false}
          animate={{ opacity: label ? 1 : 0 }}
          transition={{ duration: 0.3, delay: label ? 0.12 : 0 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
