'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { Media } from '@/components/ui/Media';
import { ArrowLeft, ArrowRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@/components/ui/icons';
import { useOverlay } from '@/lib/use-overlay';
import { EASE } from '@/lib/motion';
import type { Product } from '@/data/types';

const MAX = 3;

/** Fullscreen zoom: pinch, wheel or double-tap to zoom, drag to pan, arrows to move. */
export function Lightbox({ product, index, onClose }: { product: Product; index: number | null; onClose: () => void }) {
  const open = index !== null;
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(index ?? 0);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [zoomed, setZoomed] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  useOverlay(open, ref, onClose);

  useEffect(() => {
    if (index !== null) setI(index);
  }, [index]);

  const setZoom = (s: number, instant = false) => {
    const next = Math.min(MAX, Math.max(1, s));
    setZoomed(next > 1.01);
    if (instant) scale.set(next);
    else animate(scale, next, { duration: 0.5, ease: EASE });
    if (next <= 1.01) {
      animate(x, 0, { duration: 0.5, ease: EASE });
      animate(y, 0, { duration: 0.5, ease: EASE });
    }
  };

  const go = (dir: 1 | -1) => {
    setZoom(1, true);
    x.set(0);
    y.set(0);
    setI((v) => (v + dir + product.images.length) % product.images.length);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const bounds = () => {
    const el = stage.current;
    if (!el) return { x: 0, y: 0 };
    const s = scale.get();
    return { x: (el.clientWidth * (s - 1)) / 2, y: (el.clientHeight * (s - 1)) / 2 };
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name}, image ${i + 1} of ${product.images.length}`}
          className="fixed inset-0 z-modal flex flex-col bg-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.5, ease: EASE }}
          data-lenis-prevent=""
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between px-gutter">
            <p className="tabular label">
              {i + 1} / {product.images.length}
            </p>
            <div className="flex items-center gap-xs">
              <button type="button" onClick={() => setZoom(zoomed ? 1 : 2)} aria-label={zoomed ? 'Zoom out' : 'Zoom in'} className="inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-90">
                {zoomed ? <MagnifyingGlassMinus size={22} weight="light" /> : <MagnifyingGlassPlus size={22} weight="light" />}
              </button>
              <button type="button" onClick={onClose} aria-label="Close" className="-mr-[10px] inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-90">
                <X size={24} weight="light" />
              </button>
            </div>
          </div>

          <div
            ref={stage}
            className="relative flex-1 touch-none overflow-hidden"
            onWheel={(e) => setZoom(scale.get() * (e.deltaY < 0 ? 1.15 : 0.87), true)}
            onDoubleClick={() => setZoom(zoomed ? 1 : 2.2)}
            onPointerDown={(e) => {
              pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              if (pointers.current.size === 2) {
                const [a, b] = [...pointers.current.values()];
                pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: scale.get() };
              }
            }}
            onPointerMove={(e) => {
              if (!pointers.current.has(e.pointerId)) return;
              pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              if (pinch.current && pointers.current.size === 2) {
                const [a, b] = [...pointers.current.values()];
                setZoom((pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.dist, true);
              }
            }}
            onPointerUp={(e) => {
              pointers.current.delete(e.pointerId);
              if (pointers.current.size < 2) pinch.current = null;
            }}
            onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={i}
                className="absolute inset-0 mx-auto max-w-[min(100%,calc((100dvh-160px)*0.8))]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <motion.div
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  style={{ scale, x, y }}
                  drag={zoomed}
                  dragMomentum
                  onDrag={() => {
                    const b = bounds();
                    x.set(Math.max(-b.x, Math.min(b.x, x.get())));
                    y.set(Math.max(-b.y, Math.min(b.y, y.get())));
                  }}
                  onPanEnd={(_, info) => {
                    if (zoomed || Math.abs(info.offset.x) < 60) return;
                    go(info.offset.x < 0 ? 1 : -1);
                  }}
                >
                  <Media src={product.images[i]} alt={`${product.name}, view ${i + 1}`} sizes="100vw" className="object-contain" plate={{ icon: product.category, seed: product.slug, shot: i, tone: 'cream' }} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex h-[88px] shrink-0 items-center justify-center gap-m">
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-obsidian/20 hover:border-obsidian active:scale-90">
              <ArrowLeft size={18} weight="light" />
            </button>
            <p className="text-caption text-stone">Pinch, scroll or double-tap to zoom</p>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-obsidian/20 hover:border-obsidian active:scale-90">
              <ArrowRight size={18} weight="light" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
