import { CategoryIcon, Logo } from './Logo';
import { cn } from '@/lib/cn';
import type { Category } from '@/data/types';

/**
 * Neutral stand-in for photography that hasn't been supplied yet.
 * Warm studio ground, soft light, the category's line drawing from the logo,
 * and a small slug naming the shot so photos are easy to brief and swap.
 * Disappears automatically once the real file is in /public.
 */
export type PlateProps = {
  icon?: Category | 'mark';
  /** 0 = primary shot, 1 = alternate (hover), 2 = detail */
  shot?: number;
  seed?: string;
  label?: string;
  tone?: 'cream' | 'ivory' | 'deep' | 'obsidian';
  className?: string;
  iconClassName?: string;
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}

const TONES = {
  cream: 'bg-cream text-obsidian',
  ivory: 'bg-ivory text-obsidian',
  deep: 'bg-cream-deep text-obsidian',
  obsidian: 'bg-obsidian text-champagne',
} as const;

export function Plate({ icon, shot = 0, seed = 'ntc', label, tone, className, iconClassName }: PlateProps) {
  const h = hash(seed + shot);
  const t = tone ?? (['cream', 'deep', 'cream'] as const)[shot % 3];
  const lx = 25 + (h % 50);
  const ly = 12 + ((h >> 4) % 30);
  const iconSize =
    icon === 'mark' ? 'w-[9%]' : shot === 2 ? 'w-[46%]' : shot === 1 ? 'w-[30%]' : 'w-[22%]';
  const iconPos = shot === 2 ? 'translate-x-[18%] translate-y-[12%]' : '';

  return (
    <div className={cn('absolute inset-0 overflow-hidden', TONES[t], className)} aria-hidden="true">
      {/* Studio light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            t === 'obsidian'
              ? `radial-gradient(120% 80% at ${lx}% ${ly}%, rgb(var(--c-champagne) / 0.16), rgb(var(--c-champagne) / 0) 60%)`
              : `radial-gradient(90% 70% at ${lx}% ${ly}%, rgb(var(--c-ivory) / 0.85), rgb(var(--c-ivory) / 0) 62%), radial-gradient(120% 60% at 50% 120%, rgb(var(--c-cream-deep) / 0.9), rgb(var(--c-cream-deep) / 0) 70%)`,
        }}
      />
      {icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn('relative', iconSize, iconPos)}>
            {icon === 'mark' ? (
              <Logo variant="mark" label={null} className={cn('mx-auto w-full', iconClassName ?? 'opacity-80')} />
            ) : (
              <CategoryIcon category={icon} className={cn('mx-auto w-full', iconClassName ?? 'opacity-75')} />
            )}
            {/* Plinth shadow */}
            {shot !== 2 && (
              <div
                className="absolute -bottom-[18%] left-1/2 h-[10%] w-[120%] -translate-x-1/2 rounded-[50%]"
                style={{ background: 'radial-gradient(closest-side, rgb(var(--c-obsidian) / 0.14), rgb(var(--c-obsidian) / 0))' }}
              />
            )}
          </div>
        </div>
      )}
      {label && (
        <span
          className={cn(
            'label absolute bottom-s left-s',
            t === 'obsidian' ? 'text-mist' : 'text-stone'
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
