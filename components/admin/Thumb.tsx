/* eslint-disable @next/next/no-img-element */
import { hasAsset } from '@/lib/assets';
import { Plate } from '@/components/ui/Plate';
import { cn } from '@/lib/cn';
import type { Category } from '@/data/types';

/** Small product photo for admin lists; a plate when no photo exists yet. */
export function Thumb({ src, category, seed, className }: { src?: string; category: Category; seed: string; className?: string }) {
  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-xs bg-cream', className)}>
      {hasAsset(src) ? (
        <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Plate icon={category} seed={seed} />
      )}
    </div>
  );
}
