import { formatPrice, PRICE_ON_REQUEST } from '@/lib/format';
import { cn } from '@/lib/cn';

/** Lato Medium, highly legible, never louder than the product. */
export function Price({ price, compareAt, className }: { price: number; compareAt?: number; className?: string }) {
  if (price <= 0)
    return (
      <p className={cn('price flex flex-wrap items-baseline gap-x-xs', className)}>
        <span>{PRICE_ON_REQUEST}</span>
      </p>
    );
  const onSale = compareAt && compareAt > price;
  return (
    <p className={cn('price flex flex-wrap items-baseline gap-x-xs', className)}>
      {onSale && (
        <>
          <span className="sr-only">Sale price</span>
          <span>{formatPrice(price)}</span>
          <span className="sr-only">, was</span>
          <s className="font-normal text-stone">{formatPrice(compareAt)}</s>
        </>
      )}
      {!onSale && <span>{formatPrice(price)}</span>}
    </p>
  );
}
