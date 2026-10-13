'use client';

import { Heart } from '@/components/ui/icons';
import { useWishlist } from '@/lib/wishlist-store';
import { useUI } from '@/lib/ui-store';
import { cn } from '@/lib/cn';

/** Heart that fills when saved. Stored in localStorage. */
export function WishlistButton({ id, name, className, size = 20 }: { id: string; name: string; className?: string; size?: number }) {
  const hydrated = useUI((s) => s.hydrated);
  const saved = useWishlist((s) => s.ids.includes(id)) && hydrated;
  const toggle = useWishlist((s) => s.toggle);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full text-obsidian transition-transform duration-fast ease-brand active:scale-90',
        className ?? 'relative'
      )}
    >
      <Heart size={size} weight="light" aria-hidden="true" />
      {/* CSS only: dozens of these render per page, so no JS animation runtime */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-fast ease-brand',
          saved ? 'heart-pop opacity-100' : 'scale-50 opacity-0'
        )}
      >
        <Heart size={size} weight="fill" />
      </span>
    </button>
  );
}
