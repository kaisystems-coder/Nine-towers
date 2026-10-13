'use client';

import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from './icons';
import { EASE } from '@/lib/motion';

export function AccordionItem({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-obsidian/15">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[60px] w-full items-center justify-between gap-m text-left"
        >
          <span className="label">{title}</span>
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden="true">
            <Plus size={16} weight="light" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-m text-body-s text-stone">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
