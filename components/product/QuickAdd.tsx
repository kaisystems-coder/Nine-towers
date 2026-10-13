'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, X } from '@/components/ui/icons';
import { useCart } from '@/lib/cart-store';
import { stockFor } from '@/lib/product-utils';
import { useUI } from '@/lib/ui-store';
import { buildBackInStockMessage, whatsappUrl } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/types';

/**
 * "Quick Add" bar that slides up from the bottom of the image on hover/focus.
 * Single variant group: options inline. On touch screens a small "+" opens it.
 */
export function QuickAdd({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const openCart = useUI((s) => s.openCart);
  const groups = product.variants ?? [];
  const group = groups.length === 1 ? groups[0] : null;

  const add = (value?: string) => {
    const sel = group && value ? { [group.type]: value } : {};
    addItem(product.id, sel, 1, stockFor(product, sel));
    setExpanded(false);
    openCart('bag');
  };

  let body: React.ReactNode;
  if (!product.inStock) {
    body = (
      <a
        href={whatsappUrl(buildBackInStockMessage(product.name, undefined, product.itemNo))}
        target="_blank"
        rel="noopener noreferrer"
        className="label flex min-h-11 w-full items-center justify-center text-center hover:underline"
      >
        Back in stock? Ask us on WhatsApp
      </a>
    );
  } else if (groups.length > 1) {
    body = (
      <Link href={`/product/${product.slug}`} className="label flex min-h-11 w-full items-center justify-center">
        Choose options
      </Link>
    );
  } else if (group) {
    body = (
      <div className="flex flex-col items-center gap-xs py-xs">
        <p className="label text-stone">Quick add {group.type === 'size' ? '· Size' : ''}</p>
        <div className="flex flex-wrap justify-center gap-xs">
          {group.options.map((o) => (
            <button
              key={o.value}
              type="button"
              disabled={!o.inStock}
              onClick={(e) => {
                e.preventDefault();
                add(o.value);
              }}
              aria-label={`Add ${product.name}, ${o.label}, to bag${o.inStock ? '' : ' (sold out)'}`}
              className={cn(
                'inline-flex min-h-9 min-w-9 items-center justify-center gap-[6px] rounded-full border border-obsidian/20 px-s text-body-s transition-transform duration-fast ease-brand hover:border-obsidian active:scale-95 disabled:cursor-not-allowed disabled:text-stone disabled:line-through disabled:hover:border-obsidian/20 touch:min-h-11'
              )}
            >
              {o.swatch && <span aria-hidden="true" className="h-3 w-3 rounded-full ring-1 ring-obsidian/15" style={{ background: o.swatch }} />}
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    body = (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          add();
        }}
        className="label flex min-h-11 w-full items-center justify-center gap-xs"
      >
        <Plus size={14} weight="light" aria-hidden="true" /> Quick Add
      </button>
    );
  }

  const direct = product.inStock && !groups.length;

  return (
    <>
      <div
        data-cursor=""
        className={cn(
          'absolute inset-x-xs bottom-xs z-raised translate-y-[calc(100%+12px)] rounded-xs bg-ivory/95 px-xs text-obsidian shadow-elevated backdrop-blur-sm transition-transform duration-base ease-brand',
          'focus-within:translate-y-0 hover-fine:group-hover:translate-y-0',
          expanded && 'translate-y-0'
        )}
      >
        {body}
      </div>
      {/* Touch: small "+" */}
      <button
        type="button"
        aria-label={expanded ? 'Close quick add' : direct ? `Add ${product.name} to bag` : `Quick add ${product.name}`}
        aria-expanded={direct ? undefined : expanded}
        onClick={(e) => {
          e.preventDefault();
          if (direct) add();
          else setExpanded((v) => !v);
        }}
        className={cn(
          'absolute bottom-xs right-xs z-raised inline-flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-obsidian shadow-elevated transition-transform duration-fast ease-brand active:scale-90 hover-fine:hidden',
          expanded && 'opacity-0 pointer-events-none',
          !product.inStock && 'hidden'
        )}
      >
        {expanded ? <X size={18} weight="light" /> : <Plus size={18} weight="light" />}
      </button>
      {expanded && (
        <button
          type="button"
          aria-label="Close quick add"
          onClick={(e) => {
            e.preventDefault();
            setExpanded(false);
          }}
          className="absolute right-xs top-xs z-raised inline-flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-obsidian hover-fine:hidden"
        >
          <X size={18} weight="light" />
        </button>
      )}
    </>
  );
}
