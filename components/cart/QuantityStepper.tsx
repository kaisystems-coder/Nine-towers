'use client';

import { Minus, Plus } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Quantity',
  size = 'md',
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const btn = cn(
    'inline-flex items-center justify-center transition-transform duration-fast ease-brand active:scale-90 disabled:cursor-not-allowed disabled:opacity-35',
    size === 'sm' ? 'h-11 w-10 desk:h-9 desk:w-9' : 'h-12 w-12'
  );
  return (
    <div role="group" aria-label={label} className={cn('inline-flex items-center rounded-s border border-obsidian/20', className)}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`}>
        <Minus size={14} weight="light" />
      </button>
      <span className="tabular min-w-[2ch] text-center text-body-s font-medium" aria-live="polite" aria-atomic="true">
        <span className="sr-only">{label}: </span>
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}>
        <Plus size={14} weight="light" />
      </button>
    </div>
  );
}
