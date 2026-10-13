'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight } from './icons';
import { cn } from '@/lib/cn';

/**
 * Horizontal rail built on native scrolling (keyboard, focus, touch swipe and
 * snap all work for free). Mouse users can also drag it, with momentum, under
 * a "Drag" cursor. A hairline under the rail tracks progress.
 */
export function ScrollRail({
  children,
  label,
  className,
  trackClassName,
  showControls = true,
  controlsSlot,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  trackClassName?: string;
  showControls?: boolean;
  /** Renders the prev/next buttons somewhere else (e.g. a section header). */
  controlsSlot?: (controls: ReactNode) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const d = useRef({ active: false, moved: false, startX: 0, startLeft: 0, lastX: 0, lastT: 0, v: 0, raf: 0 });

  const updateProgress = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    progress.set(max > 0 ? Math.min(1, el.scrollLeft / max) : 1);
  }, [progress]);

  useEffect(() => {
    updateProgress();
    window.addEventListener('resize', updateProgress);
    return () => window.removeEventListener('resize', updateProgress);
  }, [updateProgress]);

  const stopMomentum = () => cancelAnimationFrame(d.current.raf);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !ref.current) return;
    stopMomentum();
    Object.assign(d.current, { active: true, moved: false, startX: e.clientX, startLeft: ref.current.scrollLeft, lastX: e.clientX, lastT: performance.now(), v: 0 });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = d.current;
    const el = ref.current;
    if (!s.active || !el) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > 5) {
      s.moved = true;
      el.style.scrollSnapType = 'none';
      el.setPointerCapture(e.pointerId);
    }
    if (!s.moved) return;
    el.scrollLeft = s.startLeft - dx;
    const now = performance.now();
    const dt = Math.max(1, now - s.lastT);
    s.v = (e.clientX - s.lastX) / dt;
    s.lastX = e.clientX;
    s.lastT = now;
  };
  const onPointerUp = () => {
    const s = d.current;
    const el = ref.current;
    if (!s.active || !el) return;
    s.active = false;
    if (!s.moved) return;
    let v = s.v * 16; // px per frame
    const step = () => {
      v *= 0.94;
      el.scrollLeft -= v;
      if (Math.abs(v) > 0.4) s.raf = requestAnimationFrame(step);
      else el.style.scrollSnapType = '';
    };
    s.raf = requestAnimationFrame(step);
  };

  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    stopMomentum();
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const controls = (
    <div className="flex items-center gap-xs">
      <button
        type="button"
        onClick={() => by(-1)}
        aria-label={`Scroll ${label} back`}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-obsidian/20 transition-transform duration-fast ease-brand hover:border-obsidian active:scale-90"
      >
        <ArrowLeft size={18} weight="light" />
      </button>
      <button
        type="button"
        onClick={() => by(1)}
        aria-label={`Scroll ${label} forward`}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-obsidian/20 transition-transform duration-fast ease-brand hover:border-obsidian active:scale-90"
      >
        <ArrowRight size={18} weight="light" />
      </button>
    </div>
  );

  return (
    <div className={className}>
      {controlsSlot?.(controls)}
      <div
        ref={ref}
        role="region"
        aria-label={label}
        data-cursor="Drag"
        className={cn('no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain', trackClassName)}
        style={{ scrollPaddingInline: 'var(--gutter)' }}
        onScroll={updateProgress}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (d.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            d.current.moved = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      <div className="container-x mt-l flex items-center gap-m">
        <div className="relative h-px flex-1 bg-obsidian/15">
          <motion.div className="absolute inset-0 origin-left bg-obsidian" style={{ scaleX: progress }} />
        </div>
        {showControls && !controlsSlot && <div className="hidden md:block">{controls}</div>}
      </div>
    </div>
  );
}
