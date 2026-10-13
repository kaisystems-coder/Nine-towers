import { site } from '@/config/site';
import { formatPrice, subtotalLabel } from './format';

const lineTitle = (l: MessageLine) =>
  `${l.name}${l.variantLabel ? ` — ${l.variantLabel}` : ''}${l.itemNo ? ` (Item #${l.itemNo})` : ''}`;

const lineQty = (l: MessageLine) =>
  l.unitPrice > 0
    ? `Qty: ${l.qty} × ${formatPrice(l.unitPrice)} = ${formatPrice(l.unitPrice * l.qty)}`
    : `Qty: ${l.qty} · price to confirm`;

export type MessageLine = {
  name: string;
  itemNo?: string;
  variantLabel?: string;
  qty: number;
  unitPrice: number;
};

export type CustomerDetails = {
  name: string;
  phone: string;
  method: 'delivery' | 'pickup';
  area?: string;
  address?: string;
  note?: string;
};

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

/** NTC-7K3QXM style reference, easy to read aloud on a call. */
export function createOrderRef() {
  let id = '';
  const bytes = new Uint8Array(6);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 6; i++) bytes[i] = Math.floor(Math.random() * 256);
  for (const b of bytes) id += REF_ALPHABET[b % REF_ALPHABET.length];
  return `NTC-${id}`;
}

export function buildOrderMessage(lines: MessageLine[], customer: CustomerDetails, ref: string) {
  const subtotal = lines.reduce((s, l) => s + Math.max(0, l.unitPrice) * l.qty, 0);
  const unpriced = lines.filter((l) => l.unitPrice <= 0).length;
  const items = lines.map((l, i) => `${i + 1}. ${lineTitle(l)}\n   ${lineQty(l)}`).join('\n');

  const delivery =
    customer.method === 'pickup'
      ? 'Pickup'
      : `${customer.area ?? ''} — ${customer.address ?? ''}`.trim();

  const parts = [
    `Hello ${site.name}! I'd like to place an order:`,
    '',
    items,
    '',
    `Subtotal: ${subtotalLabel(subtotal, unpriced)}`,
    `Order ref: ${ref}`,
    '',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Delivery: ${delivery}`,
  ];
  if (customer.note?.trim()) parts.push(`Note: ${customer.note.trim()}`);
  return parts.join('\n');
}

/** "Order Now on WhatsApp" from a product page: one item, no form. */
export function buildSingleItemMessage(line: MessageLine, url?: string) {
  const parts = [`Hello ${site.name}! I'd like to order:`, '', `1. ${lineTitle(line)}`, `   ${lineQty(line)}`];
  if (url) parts.push('', url);
  parts.push('', line.unitPrice > 0 ? 'Could you confirm availability and delivery? Thank you.' : 'Could you confirm the price, availability and delivery? Thank you.');
  return parts.join('\n');
}

export function buildBackInStockMessage(name: string, variantLabel?: string, itemNo?: string) {
  const title = `${name}${variantLabel ? ` (${variantLabel})` : ''}${itemNo ? `, Item #${itemNo}` : ''}`;
  return `Hello ${site.name}! Is the ${title} coming back in stock? I'd love to be told when it does.`;
}

export function buildGeneralMessage() {
  return `Hello ${site.name}! I have a question.`;
}

/** wa.me opens the app on phones and WhatsApp Web on desktop. */
export function whatsappUrl(text: string, number: string = site.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
