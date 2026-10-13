'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOverlay } from '@/lib/use-overlay';
import { EASE } from '@/lib/motion';

/** In-page confirmation for destructive actions (Esc or backdrop cancels). */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  useOverlay(open, ref, onCancel, cancelRef);
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="confirm" className="fixed inset-0 z-modal flex items-center justify-center p-gutter" initial="closed" animate="open" exit="closed">
          <motion.div
            className="absolute inset-0 bg-obsidian/50"
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={onCancel}
            aria-hidden="true"
          />
          <motion.div
            ref={ref}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-body"
            className="relative w-full max-w-[440px] rounded-m bg-ivory p-l shadow-floating"
            variants={{ closed: { opacity: 0, y: 16 }, open: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <h2 id="confirm-title" className="font-display text-d-xs">
              {title}
            </h2>
            <p id="confirm-body" className="mt-s text-body-s text-stone">
              {body}
            </p>
            <div className="mt-l flex flex-col-reverse gap-s sm:flex-row sm:justify-end">
              <button ref={cancelRef} type="button" onClick={onCancel} className="btn btn-outline">
                <span className="btn-fill" aria-hidden="true" />
                <span className="btn-roll">
                  <span>Keep it</span>
                  <span aria-hidden="true">Keep it</span>
                </span>
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="btn min-h-[52px] bg-error text-ivory transition-transform duration-fast ease-brand active:scale-[0.98] disabled:opacity-60"
              >
                {busy ? 'Deleting…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
