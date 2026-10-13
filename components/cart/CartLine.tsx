'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Media } from '@/components/ui/Media';
import { QuantityStepper } from './QuantityStepper';
import { MAX_QTY, lineImage, useCart, type ResolvedLine } from '@/lib/cart-store';
import { formatPrice, priceLabel } from '@/lib/format';
import { stockFor } from '@/lib/product-utils';
import { EASE } from '@/lib/motion';

/** One bag line. Removal collapses its height before it leaves. */
export function CartLine({ line, onNavigate }: { line: ResolvedLine; onNavigate?: () => void }) {
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);
  const p = line.product;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.5, ease: EASE } }}
      transition={{ duration: 0.6, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="flex gap-s border-b border-obsidian/10 py-m">
        <Link
          href={`/product/${p.slug}`}
          onClick={onNavigate}
          className="relative aspect-product w-[84px] shrink-0 overflow-hidden rounded-xs bg-cream"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Media src={lineImage(p, line.selections)} alt="" sizes="84px" plate={{ icon: p.category, seed: p.slug }} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-s">
            <div className="min-w-0">
              <Link href={`/product/${p.slug}`} onClick={onNavigate} className="label block leading-snug hover:underline hover:underline-offset-4">
                {p.name}
              </Link>
              {line.variantLabel && <p className="mt-[2px] text-caption text-stone">{line.variantLabel}</p>}
              {line.qty > 1 && line.unitPrice > 0 && <p className="price mt-[2px] text-caption text-stone">{formatPrice(line.unitPrice)} each</p>}
            </div>
            <p className="price shrink-0 text-right">{priceLabel(line.lineTotal)}</p>
          </div>
          <div className="mt-auto flex items-center justify-between gap-s pt-s">
            <QuantityStepper
              size="sm"
              value={line.qty}
              max={Math.min(MAX_QTY, stockFor(p, line.selections))}
              label={`Quantity of ${p.name}`}
              onChange={(v) => updateQty(line.key, v)}
            />
            <button
              type="button"
              onClick={() => removeItem(line.key)}
              className="link-u min-h-11 text-body-s text-stone hover:text-obsidian"
              aria-label={`Remove ${p.name}${line.variantLabel ? `, ${line.variantLabel}` : ''} from bag`}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
