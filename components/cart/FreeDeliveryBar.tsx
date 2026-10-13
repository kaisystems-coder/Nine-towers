'use client';

import { motion } from 'framer-motion';
import { site } from '@/config/site';
import { formatPrice } from '@/lib/format';
import { EASE } from '@/lib/motion';

/** Hidden while the bag has items priced on request: the total isn't known yet. */
export function FreeDeliveryBar({ subtotal, unpriced = 0 }: { subtotal: number; unpriced?: number }) {
  if (unpriced > 0) return null;
  const threshold = site.freeDeliveryThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(1, subtotal / threshold);
  return (
    <div>
      <p className="text-body-s" aria-live="polite">
        {remaining > 0 ? (
          <>
            You’re <span className="price">{formatPrice(remaining)}</span> away from free delivery.
          </>
        ) : (
          <>Your order qualifies for free islandwide delivery.</>
        )}
      </p>
      <div
        className="mt-xs h-[2px] w-full overflow-hidden rounded-full bg-obsidian/10"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(subtotal, threshold)}
      >
        <motion.div
          className="h-full origin-left bg-obsidian"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
    </div>
  );
}
