'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { Variant } from '@/data/types';

/** Colour swatches with a ring that slides to the selection; size pills. */
export function VariantSelector({
  variant,
  value,
  onChange,
  idPrefix,
}: {
  variant: Variant;
  value?: string;
  onChange: (v: string) => void;
  idPrefix: string;
}) {
  const selected = variant.options.find((o) => o.value === value);
  const legend = variant.type === 'colour' ? 'Colour' : 'Size';

  return (
    <fieldset className="min-w-0">
      <legend className="label flex w-full items-baseline gap-xs">
        {legend}
        <span className="normal-case tracking-normal text-stone">
          {selected ? `${selected.label}${selected.inStock ? '' : ' (sold out)'}` : 'Choose one'}
        </span>
      </legend>
      <div className="mt-s flex flex-wrap gap-xs" role="radiogroup" aria-label={legend}>
        {variant.options.map((o) => {
          const on = o.value === value;
          if (variant.type === 'colour')
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={`${o.label}${o.inStock ? '' : ', sold out'}`}
                onClick={() => onChange(o.value)}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-fast ease-brand active:scale-90"
              >
                {on && (
                  <motion.span
                    layoutId={`${idPrefix}-ring`}
                    className="absolute inset-0 rounded-full ring-1 ring-obsidian"
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                )}
                <span
                  className={cn('relative h-8 w-8 rounded-full ring-1 ring-inset ring-obsidian/15', !o.inStock && 'opacity-40')}
                  style={{ background: o.swatch }}
                />
                {!o.inStock && <span aria-hidden="true" className="absolute h-px w-9 rotate-45 bg-obsidian/60" />}
              </button>
            );
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`Size ${o.label}${o.inStock ? '' : ', sold out'}`}
              onClick={() => onChange(o.value)}
              className={cn(
                'relative inline-flex h-11 min-w-[52px] items-center justify-center rounded-s px-s text-body-s transition-transform duration-fast ease-brand active:scale-95',
                !o.inStock && 'text-stone line-through'
              )}
            >
              {on ? (
                <motion.span layoutId={`${idPrefix}-pill`} className="absolute inset-0 rounded-s bg-obsidian" transition={{ duration: 0.5, ease: EASE }} />
              ) : (
                <span className="absolute inset-0 rounded-s border border-obsidian/20" />
              )}
              <span className={cn('relative', on && 'text-ivory')}>{o.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
