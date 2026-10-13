const ttd = new Intl.NumberFormat('en-TT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1250 → "TT$1,250.00" */
export function formatPrice(value: number) {
  return `TT$${ttd.format(value)}`;
}

/** Compact form for chips and filters: 1250 → "TT$1,250" */
export function formatPriceShort(value: number) {
  return `TT$${Math.round(value).toLocaleString('en-TT')}`;
}

export const PRICE_ON_REQUEST = 'Price on request';

/** Product prices of 0 mean "Price on request" (confirmed on WhatsApp). */
export function priceLabel(value: number) {
  return value > 0 ? formatPrice(value) : PRICE_ON_REQUEST;
}

/** Bag subtotal wording when some or all items have no price yet. */
export function subtotalLabel(total: number, unpriced: number) {
  if (!unpriced) return formatPrice(total);
  if (total <= 0) return 'To be confirmed';
  return `${formatPrice(total)} + ${unpriced} to confirm`;
}

export function pad2(n: number) {
  return String(n).padStart(2, '0');
}
