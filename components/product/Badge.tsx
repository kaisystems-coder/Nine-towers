import type { Product } from '@/data/types';
import { cn } from '@/lib/cn';

/** One badge at most, used sparingly: Sold Out › Sale › Limited › New. */
export function productBadge(p: Product): { label: string; tone: 'dark' | 'light' } | null {
  if (!p.inStock) return { label: 'Sold Out', tone: 'light' };
  if (p.tags.includes('sale') || p.compareAtPrice) return { label: 'Sale', tone: 'dark' };
  if (p.tags.includes('limited')) return { label: 'Limited', tone: 'light' };
  if (p.tags.includes('new')) return { label: 'New', tone: 'light' };
  return null;
}

export function Badge({ label, tone = 'light', className }: { label: string; tone?: 'dark' | 'light'; className?: string }) {
  return (
    <span
      className={cn(
        'label inline-flex h-6 items-center rounded-xs px-xs',
        tone === 'dark' ? 'bg-obsidian text-ivory' : 'bg-ivory text-obsidian',
        className
      )}
    >
      {label}
    </span>
  );
}
