'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Thumb } from './Thumb';
import { ConfirmDialog } from './ConfirmDialog';
import { MagnifyingGlass, Plus, ArrowUpRight } from '@/components/ui/icons';
import { deleteProduct, updateStock } from '@/app/admin/actions';
import { categories, subcategoryLabel } from '@/data/categories';
import { formatPrice, priceLabel } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Category, Product } from '@/data/types';

type StockFilter = 'all' | 'low' | 'out';
const LOW = 3;

function status(p: Product) {
  const n = p.stock ?? 0;
  if (n <= 0) return { label: 'Sold out', cls: 'bg-error/10 text-error' };
  if (n <= LOW || p.variants?.[0]?.options.some((o) => (o.stock ?? 0) === 0)) return { label: n <= LOW ? 'Low stock' : 'Some sold out', cls: 'bg-champagne/25 text-obsidian' };
  return { label: 'In stock', cls: 'bg-obsidian/5 text-stone' };
}

/** Stock editing in place: one number for simple products, one per option otherwise. */
function StockEditor({ p, onSaved, notify }: { p: Product; onSaved: () => void; notify: (m: string) => void }) {
  const options = p.variants?.[0]?.options;
  const initial = options ? Object.fromEntries(options.map((o) => [o.value, o.stock ?? 0])) : { _: p.stock ?? 0 };
  const [values, setValues] = useState<Record<string, number>>(initial);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const dirty = Object.keys(initial).some((k) => initial[k] !== values[k]);

  const save = () =>
    start(async () => {
      const res = await updateStock(p.id, options ? values : values._);
      if (res.ok) {
        notify(`Stock saved for ${p.name}.`);
        setOpen(false);
        onSaved();
      } else notify(res.error ?? 'Could not save stock.');
    });

  const input = (key: string, label: string) => (
    <label key={key} className={cn('flex items-center gap-s', label && 'justify-between')}>
      {label && <span className="text-body-s">{label}</span>}
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={99999}
        value={values[key]}
        onChange={(e) => setValues((v) => ({ ...v, [key]: Math.max(0, Math.floor(Number(e.target.value) || 0)) }))}
        onKeyDown={(e) => e.key === 'Enter' && dirty && save()}
        className="field tabular min-h-11 w-[88px] py-xs text-right"
        aria-label={`Stock for ${p.name}${key === '_' ? '' : `, ${label}`}`}
      />
    </label>
  );

  if (!options)
    return (
      <div className="flex items-center gap-xs">
        {input('_', '')}
        {dirty && (
          <button type="button" onClick={save} disabled={pending} className="label min-h-11 rounded-s bg-obsidian px-s text-ivory disabled:opacity-60">
            {pending ? '…' : 'Save'}
          </button>
        )}
      </div>
    );

  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex min-h-11 flex-col items-start text-left">
        <span className="tabular text-body-s font-medium">{p.stock ?? 0} total</span>
        <span className="text-caption text-stone underline underline-offset-4">{open ? 'Close' : `Edit ${options.length} ${p.variants![0].type === 'colour' ? 'colours' : 'sizes'}`}</span>
      </button>
      {open && (
        <div className="mt-xs flex w-[220px] flex-col gap-xs rounded-s border border-obsidian/15 bg-ivory p-s shadow-elevated">
          {options.map((o) => input(o.value, o.label))}
          <button type="button" onClick={save} disabled={!dirty || pending} className="label mt-xs min-h-11 rounded-s bg-obsidian px-s text-ivory disabled:opacity-40">
            {pending ? 'Saving…' : 'Save stock'}
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductTable({ products, updatedAt, source }: { products: Product[]; updatedAt: string; source: 'blob' | 'file' | 'seed' }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [stock, setStock] = useState<StockFilter>('all');
  const [message, setMessage] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, startDelete] = useTransition();

  const counts = useMemo(
    () => ({
      total: products.length,
      out: products.filter((p) => (p.stock ?? 0) <= 0).length,
      low: products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= LOW).length,
    }),
    [products]
  );

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (stock === 'out' && (p.stock ?? 0) > 0) return false;
      if (stock === 'low' && !((p.stock ?? 0) > 0 && (p.stock ?? 0) <= LOW)) return false;
      if (term && ![p.name, p.itemNo ?? '', p.slug, p.subcategory].join(' ').toLowerCase().includes(term)) return false;
      return true;
    });
  }, [products, q, cat, stock]);

  const notify = (m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage((cur) => (cur === m ? '' : cur)), 4000);
  };

  const confirmDelete = () =>
    toDelete &&
    startDelete(async () => {
      const res = await deleteProduct(toDelete.id);
      notify(res.ok ? `${toDelete.name} was removed from the store.` : res.error ?? 'Could not delete.');
      setToDelete(null);
      router.refresh();
    });

  const chip = (active: boolean) =>
    cn(
      'inline-flex min-h-11 items-center rounded-full border px-s text-body-s transition-transform duration-fast ease-brand active:scale-95 desk:min-h-9',
      active ? 'border-obsidian bg-obsidian text-ivory' : 'border-obsidian/20 hover:border-obsidian'
    );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-m">
        <div>
          <h1 className="font-display text-d-m">Products</h1>
          <p className="mt-xs text-body-s text-stone">
            {counts.total} products · {counts.low} low stock · {counts.out} sold out
            {updatedAt && ` · Last saved ${new Date(updatedAt).toLocaleString('en-TT', { dateStyle: 'medium', timeStyle: 'short' })}`}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <span className="btn-fill" aria-hidden="true" />
          <span className="btn-roll">
            <span>
              <Plus size={16} weight="light" aria-hidden="true" /> Add product
            </span>
            <span aria-hidden="true">
              <Plus size={16} weight="light" /> Add product
            </span>
          </span>
        </Link>
      </div>

      {source === 'seed' && (
        <p className="mt-m rounded-s border border-obsidian/15 bg-cream/50 p-s text-body-s">
          You’re seeing the starter catalogue. Your first save stores the full list so it can be edited from here.
        </p>
      )}

      {/* Filters */}
      <div className="mt-l flex flex-col gap-s lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-[340px]">
          <span className="sr-only">Search products</span>
          <MagnifyingGlass size={18} weight="light" aria-hidden="true" className="pointer-events-none absolute left-s top-1/2 -translate-y-1/2 text-stone" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or item #" className="field pl-xl" />
        </label>
        <div className="flex flex-wrap gap-xs" role="group" aria-label="Filter products">
          {(['all', 'jewellery', 'handbags', 'luggage', 'electronics'] as const).map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}>
              {c === 'all' ? 'All' : categories[c].title}
            </button>
          ))}
          <span className="mx-xs hidden w-px self-stretch bg-obsidian/15 sm:block" aria-hidden="true" />
          {([
            ['all', 'Any stock'],
            ['low', `Low (${counts.low})`],
            ['out', `Sold out (${counts.out})`],
          ] as const).map(([v, label]) => (
            <button key={v} type="button" aria-pressed={stock === v} onClick={() => setStock(v)} className={chip(stock === v)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <p role="status" aria-live="polite" className={cn('mt-m min-h-6 text-body-s', message ? 'text-obsidian' : 'text-transparent')}>
        {message || '·'}
      </p>

      {/* List */}
      {rows.length ? (
        <div className="mt-xs overflow-hidden rounded-m border border-obsidian/10 bg-ivory">
          <table className="w-full border-collapse text-left">
            <thead className="hidden bg-cream/40 md:table-header-group">
              <tr className="label text-stone">
                <th scope="col" className="px-m py-s font-medium">
                  Product
                </th>
                <th scope="col" className="px-s py-s font-medium">
                  Price
                </th>
                <th scope="col" className="px-s py-s font-medium">
                  Stock
                </th>
                <th scope="col" className="px-s py-s font-medium">
                  Status
                </th>
                <th scope="col" className="px-m py-s text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const st = status(p);
                return (
                  <tr key={p.id} className="flex flex-wrap items-center gap-s border-t border-obsidian/10 p-m first:border-t-0 md:table-row md:p-0">
                    <td className="w-full md:w-auto md:px-m md:py-s">
                      <div className="flex items-center gap-s">
                        <Thumb src={p.images[0]} category={p.category} seed={p.slug} className="aspect-product w-12" />
                        <div className="min-w-0">
                          <Link href={`/admin/products/${p.id}`} className="block font-medium leading-snug hover:underline hover:underline-offset-4">
                            {p.name}
                          </Link>
                          <p className="text-caption text-stone">
                            {p.itemNo && <>Item #{p.itemNo} · </>}
                            {categories[p.category].title} · {subcategoryLabel(p.category, p.subcategory)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="md:px-s md:py-s">
                      <span className="price">{priceLabel(p.price)}</span>
                      {p.compareAtPrice && <s className="ml-xs text-caption text-stone">{formatPrice(p.compareAtPrice)}</s>}
                    </td>
                    <td className="md:px-s md:py-s">
                      <StockEditor key={`${p.id}-${p.stock}`} p={p} notify={notify} onSaved={() => router.refresh()} />
                    </td>
                    <td className="md:px-s md:py-s">
                      <span className={cn('label inline-flex rounded-full px-s py-[4px] text-[0.75rem]', st.cls)}>{st.label}</span>
                    </td>
                    <td className="ml-auto md:px-m md:py-s md:text-right">
                      <div className="flex items-center justify-end gap-xs">
                        <Link href={`/product/${p.slug}`} target="_blank" aria-label={`View ${p.name} in the store`} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-stone hover:text-obsidian">
                          <ArrowUpRight size={18} weight="light" />
                        </Link>
                        <Link href={`/admin/products/${p.id}`} className="label inline-flex min-h-11 items-center rounded-s border border-obsidian/20 px-s hover:border-obsidian">
                          Edit
                        </Link>
                        <button type="button" onClick={() => setToDelete(p)} className="label ml-xs inline-flex min-h-11 items-center px-xs text-error hover:underline hover:underline-offset-4">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-xs rounded-m border border-dashed border-obsidian/20 p-xl text-center">
          <p className="font-display text-d-xs">No products match.</p>
          <p className="mt-xs text-body-s text-stone">Clear the search or filters, or add a new product.</p>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete ${toDelete?.name ?? 'this product'}?`}
        body="It disappears from the store straight away, including any shopper’s bag and wishlist. This can’t be undone from here."
        confirmLabel="Delete product"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
