'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { track } from '@vercel/analytics';
import { CaretDown, WhatsappLogo } from '@/components/ui/icons';
import { site } from '@/config/site';
import { count, resolveLines, subtotal, unpricedCount, useCart } from '@/lib/cart-store';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import { useUI } from '@/lib/ui-store';
import { buildOrderMessage, createOrderRef, whatsappUrl } from '@/lib/whatsapp';
import { formatPrice, priceLabel, subtotalLabel } from '@/lib/format';
import { cn } from '@/lib/cn';

const phoneOk = (v: string) => {
  const d = v.replace(/\D/g, '');
  if (d.length === 7) return true; // local T&T number
  if (d.length === 10 && d.startsWith('868')) return true;
  if (d.length === 11 && d.startsWith('1868')) return true;
  return v.trim().startsWith('+') && d.length >= 10 && d.length <= 15; // overseas
};

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name.').max(80),
    phone: z.string().trim().refine(phoneOk, 'Enter a number we can reach on WhatsApp, for example 868 712 4590.'),
    method: z.enum(['delivery', 'pickup']),
    area: z.string().optional(),
    address: z.string().max(240).optional(),
    note: z.string().max(500, 'Keep the note under 500 characters.').optional(),
  })
  .superRefine((v, ctx) => {
    if (v.method !== 'delivery') return;
    if (!v.area) ctx.addIssue({ path: ['area'], code: 'custom', message: 'Choose your delivery area.' });
    if (!v.address || v.address.trim().length < 6)
      ctx.addIssue({ path: ['address'], code: 'custom', message: 'Enter a street address so we can deliver to you.' });
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;

function Field({ id, label, error, hint, children, optional }: { id: string; label: string; error?: string; hint?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="field-label">
        {label}
        {optional ? <span className="ml-xs normal-case tracking-normal text-stone">(optional)</span> : <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-xs text-caption text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

const isMobileDevice = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export function CheckoutForm() {
  const items = useCart((s) => s.items);
  const note = useCart((s) => s.note);
  const setNote = useCart((s) => s.setNote);
  const setLastOrder = useUI((s) => s.setLastOrder);
  const setCartView = useUI((s) => s.setCartView);
  const catalog = useCatalog();
  const lines = resolveLines(items, catalog.getProductById);
  const total = subtotal(lines);
  const unpriced = unpricedCount(lines);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', phone: '', method: 'delivery', area: '', address: '', note },
    mode: 'onTouched',
  });
  const method = watch('method');

  const onSubmit = (values: CheckoutValues) => {
    const ref = createOrderRef();
    const message = buildOrderMessage(
      lines.map((l) => ({ name: l.product.name, itemNo: l.product.itemNo, variantLabel: l.variantLabel, qty: l.qty, unitPrice: l.unitPrice })),
      values,
      ref
    );
    const url = whatsappUrl(message);
    setNote(values.note ?? '');
    setLastOrder({ ref, url });
    setCartView('sent');
    track('Checkout via WhatsApp', { items: count(items), subtotal: total, method: values.method });
    // Phones: hand off to the WhatsApp app. Desktop: WhatsApp Web in a new tab.
    if (isMobileDevice()) window.location.assign(url);
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  const describedBy = (k: keyof CheckoutValues, hint = false) =>
    errors[k] ? `${k}-error` : hint ? `${k}-hint` : undefined;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex min-w-0 flex-col gap-m">
      <div className="rounded-s bg-cream/60 p-s">
        <p className="label text-stone">Your order</p>
        <ul className="mt-xs flex flex-col gap-[6px] text-body-s">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-s">
              <span className="min-w-0">
                {l.qty} × {l.product.name}
                {l.variantLabel && <span className="text-stone"> · {l.variantLabel}</span>}
              </span>
              <span className="price shrink-0">{priceLabel(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-s flex justify-between border-t border-obsidian/10 pt-s text-body-s font-medium">
          <span>Subtotal</span>
          <span className="price">{subtotalLabel(total, unpriced)}</span>
        </p>
      </div>

      <Field id="name" label="Full name" error={errors.name?.message}>
        <input
          id="name"
          autoComplete="name"
          className="field"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy('name')}
          {...register('name')}
        />
      </Field>

      <Field id="phone" label="Phone (WhatsApp)" error={errors.phone?.message} hint="We’ll confirm your order on this number.">
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="868 712 4590"
          className="field"
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy('phone', true)}
          {...register('phone')}
        />
      </Field>

      <fieldset className="min-w-0">
        <legend className="field-label">Delivery or pickup *</legend>
        <div className="grid grid-cols-2 gap-xs">
          {(['delivery', 'pickup'] as const).map((m) => (
            <label
              key={m}
              className={cn(
                'relative flex min-h-[52px] cursor-pointer items-center justify-center rounded-s border px-s text-body-s transition-transform duration-fast ease-brand active:scale-[0.98]',
                method === m ? 'border-obsidian bg-obsidian text-ivory' : 'border-obsidian/25 hover:border-obsidian'
              )}
            >
              <input type="radio" value={m} className="peer sr-only" {...register('method')} />
              <span className="pointer-events-none absolute inset-0 rounded-s peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-obsidian" />
              {m === 'delivery' ? 'Islandwide delivery' : 'Pickup'}
            </label>
          ))}
        </div>
        {method === 'pickup' && <p className="mt-xs text-caption text-stone">{site.pickupNote}</p>}
      </fieldset>

      {method === 'delivery' && (
        <>
          <Field id="area" label="Delivery area" error={errors.area?.message}>
            <div className="relative min-w-0">
            <select id="area" className="field min-w-0 cursor-pointer appearance-none pr-xl" aria-invalid={!!errors.area} aria-describedby={describedBy('area')} {...register('area')}>
                <option value="">Choose an area</option>
                {site.deliveryAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <CaretDown size={16} weight="light" aria-hidden="true" className="pointer-events-none absolute right-s top-1/2 -translate-y-1/2" />
            </div>
          </Field>
          <Field id="address" label="Street address" error={errors.address?.message}>
            <textarea
              id="address"
              rows={2}
              autoComplete="street-address"
              placeholder="House number, street, community"
              className="field resize-none"
              aria-invalid={!!errors.address}
              aria-describedby={describedBy('address')}
              {...register('address')}
            />
          </Field>
        </>
      )}

      <Field id="note" label="Note or gift message" optional error={errors.note?.message}>
        <textarea id="note" rows={2} className="field resize-none" aria-describedby={describedBy('note')} {...register('note')} />
      </Field>

      <div>
        <button type="submit" disabled={isSubmitting || !lines.length} className="btn btn-primary w-full">
          <span className="btn-fill" aria-hidden="true" />
          <span className="btn-roll">
            <span className="flex items-center justify-center gap-xs">
              <WhatsappLogo size={18} weight="light" aria-hidden="true" /> Send order on WhatsApp
            </span>
            <span className="flex items-center justify-center gap-xs" aria-hidden="true">
              <WhatsappLogo size={18} weight="light" /> Send order on WhatsApp
            </span>
          </span>
        </button>
        <p className="mt-s text-caption text-stone">
          WhatsApp opens with your order written out. Nothing is charged here: we confirm stock, the delivery fee and payment with you in the chat.
        </p>
      </div>
    </form>
  );
}
