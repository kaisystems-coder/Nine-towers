import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Infinite ticker. Content is rendered twice and the track slides by -50%.
 * Pauses on hover and focus; static under reduced motion (see globals.css).
 */
export function Marquee({
  children,
  duration = 40,
  className,
  label,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn('marquee overflow-hidden', className)} aria-label={label} role={label ? 'region' : undefined}>
      <div className="marquee-track flex w-max" style={{ ['--marquee-duration' as string]: `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
