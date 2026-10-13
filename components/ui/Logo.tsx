import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import type { Category } from '@/data/types';

/**
 * Brand artwork rendered as a CSS mask so it takes the current text colour
 * (obsidian on light grounds, ivory on obsidian) without editing the SVG.
 * Files live in /public/brand.
 */
const ART = {
  full: { src: '/brand/logo.svg', ratio: 2946 / 1992 },
  compact: { src: '/brand/logo-compact.svg', ratio: 2475 / 1752 },
  mark: { src: '/brand/logo-mark.svg', ratio: 249 / 1236 },
  jewellery: { src: '/brand/diamond.svg', ratio: 303 / 348 },
  luggage: { src: '/brand/luggage.svg', ratio: 228 / 348 },
  handbags: { src: '/brand/handbag.svg', ratio: 342 / 348 },
  // No line drawing for tech in the logo: use the tower mark.
  electronics: { src: '/brand/logo-mark.svg', ratio: 249 / 1236 },
} as const;

type ArtKey = keyof typeof ART;

function maskStyle(key: ArtKey): CSSProperties {
  const { src, ratio } = ART[key];
  return {
    aspectRatio: String(ratio),
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };
}

export function Logo({
  variant = 'compact',
  className,
  label = 'Nine Towers Collection',
}: {
  variant?: 'full' | 'compact' | 'mark';
  className?: string;
  label?: string | null;
}) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block shrink-0 bg-current align-middle', className)}
      style={maskStyle(variant)}
    />
  );
}

/** The fashion jewellery / luggage / handbag line drawings from the logo. */
export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  return <span aria-hidden="true" className={cn('inline-block shrink-0 bg-current align-middle', className)} style={maskStyle(category)} />;
}
