'use client';

import { useRef, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import { useOverlay } from '@/lib/use-overlay';
import { cn } from '@/lib/cn';

/** Side sheet with dimmed backdrop. Slides from the left or right. */
export function Drawer({
  open,
  onClose,
  side = 'right',
  label,
  children,
  className,
  initialFocus,
}: {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  label: string;
  children: ReactNode;
  className?: string;
  initialFocus?: RefObject<HTMLElement>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOverlay(open, ref, onClose, initialFocus);
  const from = side === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="drawer" className="fixed inset-0 z-drawer" initial="closed" animate="open" exit="closed">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-obsidian/40"
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            data-lenis-prevent=""
            className={cn(
              'absolute inset-y-0 flex w-full max-w-[480px] flex-col bg-ivory shadow-floating outline-none',
              side === 'right' ? 'right-0' : 'left-0',
              className
            )}
            variants={{ closed: { x: from }, open: { x: '0%' } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
