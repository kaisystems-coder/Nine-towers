'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Thumb } from './Thumb';
import { ConfirmDialog } from './ConfirmDialog';
import { ArrowLeft, ArrowRight, ArrowUpRight, CaretDown, Plus, Trash, X } from '@/components/ui/icons';
import { deleteProduct, saveProduct, uploadProductImage } from '@/app/admin/actions';
import { productInputSchema, fieldErrors, type ProductInput } from '@/lib/admin-schema';
import { categories, categoryList } from '@/data/categories';
import { collections } from '@/data/collections';
import { slugify } from '@/lib/product-utils';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/types';

const TAGS = [
  { value: 'new', label: 'New' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'limited', label: 'Limited' },
  { value: 'sale', label: 'Sale' },
] as const;

type Draft = Omit<ProductInput, 'price' | 'compareAtPrice' | 'stock' | 'featured' | 'options'> & {
  price: string;
  compareAtPrice: string;
  stock: string;
  featured: string;
  options: { label: string; value: string; swatch?: string; stock: string; image?: string }[];
};

function toDraft(p?: Product): Draft {
  const v = p?.variants?.[0];
  return {
    id: p?.id,
    name: p?.name ?? '',
    itemNo: p?.itemNo ?? '',
    slug: p?.slug ?? '',
    category: p?.category ?? 'jewellery',
    subcategory: p?.subcategory ?? categories[p?.category ?? 'jewellery'].subcategories[0].slug,
    price: p ? String(p.price) : '',
    compareAtPrice: p?.compareAtPrice ? String(p.compareAtPrice) : '',
    description: p?.description ?? '',
    details: p?.details ?? [],
    care: p?.care ?? [],
    images: p?.images ?? [],
    variantType: v?.type ?? 'none',
    options: v?.options.map((o) => ({ label: o.label, value: o.value, swatch: o.swatch, image: o.image, stock: String(o.stock ?? 0) })) ?? [],
    stock: String(p?.stock ?? 0),
    tags: p?.tags ?? [],
    collections: p?.collections ?? [],
    featured: p?.featured !== undefined ? String(p.featured) : '',
    addedAt: p?.addedAt ?? new Date().toISOString().slice(0, 10),
  };
}

function toInput(d: Draft): ProductInput {
  const num = (s: string) => (s.trim() === '' ? undefined : Number(s));
  return {
    ...d,
    price: num(d.price) as number,
    compareAtPrice: num(d.compareAtPrice),
    stock: num(d.stock) ?? 0,
    featured: num(d.featured),
    itemNo: d.itemNo?.trim() || undefined,
    options: d.options.map((o) => ({ ...o, image: o.image || undefined, value: o.value || slugify(o.label), stock: num(o.stock) ?? 0 })),
    details: d.details.map((x) => x.trim()).filter(Boolean),
    care: d.care.map((x) => x.trim()).filter(Boolean),
  } as ProductInput;
}

/** Shrinks a photo to 2000px on the long edge as WebP before upload. */
async function prepareImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.type === 'image/webp' && file.size < 1.5e6) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.86));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' }) : file;
  } catch {
    return file;
  }
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-m border border-obsidian/10 bg-ivory p-m md:p-l">
      <h2 className="font-display text-d-xs">{title}</h2>
      {hint && <p className="mt-[2px] text-caption text-stone">{hint}</p>}
      <div className="mt-m flex min-w-0 flex-col gap-m">{children}</div>
    </section>
  );
}

function Field({ id, label, error, hint, optional, children }: { id: string; label: string; error?: string; hint?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-xs normal-case tracking-normal text-stone">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="field-error">
          {error}
        </p>
      ) : (
        hint && <p className="mt-xs text-caption text-stone">{hint}</p>
      )}
    </div>
  );
}

function Select({ id, value, onChange, children, invalid }: { id: string; value: string; onChange: (v: string) => void; children: React.ReactNode; invalid?: boolean }) {
  return (
    <div className="relative min-w-0">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} className="field min-w-0 cursor-pointer appearance-none pr-xl">
        {children}
      </select>
      <CaretDown size={16} weight="light" aria-hidden="true" className="pointer-events-none absolute right-s top-1/2 -translate-y-1/2" />
    </div>
  );
}

export function ProductEditor({ product, created }: { product?: Product; created?: boolean }) {
  const router = useRouter();
  const isNew = !product;
  const [d, setD] = useState<Draft>(() => toDraft(product));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error'; text: string } | null>(
    created ? { tone: 'ok', text: 'Product added. It’s live in the store.' } : null
  );
  const [saving, startSave] = useTransition();
  const [uploading, setUploading] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [deleting, startDelete] = useTransition();
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((s) => ({ ...s, [k]: v }));
  const err = (k: string) => errors[k];

  const save = () => {
    const input = toInput(d);
    const parsed = productInputSchema.safeParse(input);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setNotice({ tone: 'error', text: 'Check the highlighted fields.' });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setErrors({});
    startSave(async () => {
      const res = await saveProduct(parsed.data);
      if (!res.ok) {
        setErrors(res.fields ?? {});
        setNotice({ tone: 'error', text: res.error });
        return;
      }
      setNotice({ tone: 'ok', text: isNew ? 'Product added. It’s live in the store.' : 'Saved. The store is updated.' });
      if (isNew) router.replace(`/admin/products/${res.id}?created=1`);
      else router.refresh();
    });
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files].slice(0, 12 - d.images.length);
    setUploading((n) => n + list.length);
    for (const f of list) {
      const fd = new FormData();
      fd.append('file', await prepareImage(f));
      fd.append('slug', d.slug || slugify(d.name));
      const res = await uploadProductImage(fd);
      setUploading((n) => n - 1);
      if (res.ok) setD((s) => ({ ...s, images: [...s.images, res.url] }));
      else setNotice({ tone: 'error', text: res.error });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const moveImage = (i: number, dir: -1 | 1) =>
    setD((s) => {
      const imgs = [...s.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return s;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...s, images: imgs };
    });

  const subs = categories[d.category].subcategories;

  return (
    <div className="pb-[120px]">
      <div className="flex flex-wrap items-center justify-between gap-s">
        <Link href="/admin" className="label inline-flex min-h-11 items-center gap-xs text-stone hover:text-obsidian">
          <ArrowLeft size={16} weight="light" aria-hidden="true" /> All products
        </Link>
        {!isNew && (
          <Link href={`/product/${product.slug}`} target="_blank" className="label inline-flex min-h-11 items-center gap-xs hover:underline hover:underline-offset-4">
            View in store <ArrowUpRight size={14} weight="light" aria-hidden="true" />
          </Link>
        )}
      </div>
      <h1 className="mt-s font-display text-d-m">{isNew ? 'Add a product' : d.name || 'Untitled product'}</h1>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="mt-l grid min-w-0 gap-m lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
      >
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-m">
          <Section title="Basics">
            <Field id="name" label="Product name" error={err('name')} hint="Short and in Title Case, e.g. Spire Pendant Necklace.">
              <input
                id="name"
                value={d.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setD((s) => ({ ...s, name, slug: slugTouched ? s.slug : slugify(name) }));
                }}
                aria-invalid={!!err('name')}
                className="field"
              />
            </Field>
            <Field id="slug" label="Web address" error={err('slug')} hint={`ninetowerscollection.com/product/${d.slug || '…'}`}>
              <input
                id="slug"
                value={d.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
                aria-invalid={!!err('slug')}
                className="field"
              />
            </Field>
            <Field id="itemNo" label="Item number" optional error={err('itemNo')} hint="As printed on the supplier photo or card, e.g. 8105. Shown on the product page and in WhatsApp orders.">
              <input id="itemNo" value={d.itemNo ?? ''} onChange={(e) => set('itemNo', e.target.value)} className="field max-w-[240px]" />
            </Field>
            <div className="grid min-w-0 gap-m sm:grid-cols-2">
              <Field id="category" label="Category" error={err('category')}>
                <Select
                  id="category"
                  value={d.category}
                  onChange={(v) => setD((s) => ({ ...s, category: v as Draft['category'], subcategory: categories[v as Draft['category']].subcategories[0].slug }))}
                >
                  {categoryList.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id="subcategory" label="Type" error={err('subcategory')}>
                <Select id="subcategory" value={d.subcategory} onChange={(v) => set('subcategory', v)} invalid={!!err('subcategory')}>
                  {subs.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field id="description" label="Description" error={err('description')} hint="Two or three sentences. Lead with what it is and why it’s good.">
              <textarea id="description" rows={4} value={d.description} onChange={(e) => set('description', e.target.value)} aria-invalid={!!err('description')} className="field resize-y" />
            </Field>
            <Field id="details" label="Details & dimensions" optional error={err('details')} hint="One per line: materials, size, weight, closures.">
              <textarea id="details" rows={4} value={d.details.join('\n')} onChange={(e) => set('details', e.target.value.split('\n'))} className="field resize-y" />
            </Field>
            <Field id="care" label="Care" optional hint="One per line. Leave empty to use the category’s standard care notes.">
              <textarea id="care" rows={3} value={d.care.join('\n')} onChange={(e) => set('care', e.target.value.split('\n'))} className="field resize-y" />
            </Field>
          </Section>

          <Section title="Photos" hint="The first photo is the main one; the second shows on hover. Portrait 4:5 looks best.">
            {d.images.length > 0 && (
              <ul className="grid grid-cols-2 gap-s sm:grid-cols-3 xl:grid-cols-4">
                {d.images.map((src, i) => (
                  <li key={`${src}-${i}`} className="group relative">
                    <Thumb src={src} category={d.category} seed={`${d.slug}-${i}`} className="aspect-product w-full" />
                    <span className="label absolute left-xs top-xs rounded-xs bg-ivory/90 px-xs py-[2px] text-[0.75rem]">{i === 0 ? 'Main' : i === 1 ? 'Hover' : i + 1}</span>
                    <div className="mt-xs flex items-center justify-between">
                      <div className="flex">
                        <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream disabled:opacity-30">
                          <ArrowLeft size={16} weight="light" />
                        </button>
                        <button type="button" onClick={() => moveImage(i, 1)} disabled={i === d.images.length - 1} aria-label={`Move photo ${i + 1} later`} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream disabled:opacity-30">
                          <ArrowRight size={16} weight="light" />
                        </button>
                      </div>
                      <button type="button" onClick={() => set('images', d.images.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-error hover:bg-error/10">
                        <Trash size={16} weight="light" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center gap-s">
              <input ref={fileRef} id="upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={(e) => upload(e.target.files)} />
              <label htmlFor="upload" className="btn btn-outline cursor-pointer">
                <span className="btn-fill" aria-hidden="true" />
                <span className="btn-roll">
                  <span>
                    <Plus size={16} weight="light" aria-hidden="true" /> Upload photos
                  </span>
                  <span aria-hidden="true">
                    <Plus size={16} weight="light" /> Upload photos
                  </span>
                </span>
              </label>
              {uploading > 0 && <p className="text-body-s text-stone" aria-live="polite">Uploading {uploading}…</p>}
            </div>
            <details className="text-body-s">
              <summary className="cursor-pointer text-stone">Add a photo by web address instead</summary>
              <div className="mt-s flex gap-xs">
                <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://… or /products/name/1.jpg" className="field min-w-0 flex-1" aria-label="Photo address" />
                <button
                  type="button"
                  onClick={() => {
                    if (urlInput.trim()) set('images', [...d.images, urlInput.trim()]);
                    setUrlInput('');
                  }}
                  className="label min-h-11 shrink-0 rounded-s border border-obsidian/20 px-s hover:border-obsidian"
                >
                  Add
                </button>
              </div>
            </details>
          </Section>

          <Section title="Stock & options" hint="Set how many you have. Colours or sizes each get their own count; at 0 they show as sold out.">
            <fieldset className="min-w-0">
              <legend className="field-label">Does it come in options?</legend>
              <div className="grid grid-cols-3 gap-xs">
                {(['none', 'colour', 'size'] as const).map((t) => (
                  <label key={t} className={cn('relative flex min-h-11 cursor-pointer items-center justify-center rounded-s border px-xs text-center text-body-s', d.variantType === t ? 'border-obsidian bg-obsidian text-ivory' : 'border-obsidian/25 hover:border-obsidian')}>
                    <input type="radio" name="variantType" checked={d.variantType === t} onChange={() => set('variantType', t)} className="peer sr-only" />
                    <span className="pointer-events-none absolute inset-0 rounded-s peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-obsidian" />
                    {t === 'none' ? 'No options' : t === 'colour' ? 'Colours' : 'Sizes'}
                  </label>
                ))}
              </div>
            </fieldset>

            {d.variantType === 'none' ? (
              <Field id="stock" label="Quantity in stock" error={err('stock')}>
                <input id="stock" type="number" inputMode="numeric" min={0} value={d.stock} onChange={(e) => set('stock', e.target.value)} aria-invalid={!!err('stock')} className="field tabular max-w-[160px]" />
              </Field>
            ) : (
              <div className="min-w-0">
                {err('options') && (
                  <p role="alert" className="field-error mb-s">
                    {err('options')}
                  </p>
                )}
                <ul className="flex flex-col gap-s">
                  {d.options.map((o, i) => (
                    <li key={i} className="grid min-w-0 grid-cols-[1fr_96px_44px] items-end gap-xs sm:grid-cols-[1fr_auto_96px_44px]">
                      <Field id={`opt-${i}`} label={d.variantType === 'colour' ? 'Colour name' : 'Size'} error={err(`options.${i}.label`)}>
                        <input
                          id={`opt-${i}`}
                          value={o.label}
                          onChange={(e) => setD((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, label: e.target.value, value: slugify(e.target.value) } : x)) }))}
                          aria-invalid={!!err(`options.${i}.label`)}
                          className="field"
                        />
                      </Field>
                      {d.variantType === 'colour' && (
                        <div className="col-span-3 row-start-2 flex items-center gap-xs sm:col-span-1 sm:row-start-auto">
                          <label htmlFor={`sw-${i}`} className="sr-only">
                            Swatch colour for {o.label || `option ${i + 1}`}
                          </label>
                          <input
                            id={`sw-${i}`}
                            type="color"
                            value={o.swatch ?? '#C8A45C'}
                            onChange={(e) => setD((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, swatch: e.target.value.toUpperCase() } : x)) }))}
                            className="h-11 w-11 cursor-pointer rounded-full border border-obsidian/20 bg-transparent p-[3px]"
                          />
                          <span className="text-caption text-stone sm:hidden">Swatch</span>
                        </div>
                      )}
                      {d.images.length > 0 && (
                        <div className="col-span-3 row-start-3 flex min-w-0 items-center gap-xs sm:col-span-4 sm:row-start-2">
                          <label htmlFor={`oi-${i}`} className="text-caption text-stone">
                            Photo
                          </label>
                          <div className="relative min-w-0 flex-1">
                            <select
                              id={`oi-${i}`}
                              value={o.image ?? ''}
                              onChange={(e) => setD((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, image: e.target.value || undefined } : x)) }))}
                              className="field min-h-11 min-w-0 cursor-pointer appearance-none py-xs pr-xl text-body-s"
                            >
                              <option value="">Main photo</option>
                              {d.images.map((src, k) => (
                                <option key={src} value={src}>
                                  Photo {k + 1}
                                  {k === 0 ? ' (main)' : ''}
                                </option>
                              ))}
                            </select>
                            <CaretDown size={14} weight="light" aria-hidden="true" className="pointer-events-none absolute right-s top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      )}
                      <Field id={`os-${i}`} label="In stock" error={err(`options.${i}.stock`)}>
                        <input
                          id={`os-${i}`}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={o.stock}
                          onChange={(e) => setD((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, stock: e.target.value } : x)) }))}
                          className="field tabular"
                        />
                      </Field>
                      <button
                        type="button"
                        onClick={() => set('options', d.options.filter((_, j) => j !== i))}
                        aria-label={`Remove ${o.label || `option ${i + 1}`}`}
                        className="inline-flex h-12 w-11 items-center justify-center rounded-s text-error hover:bg-error/10"
                      >
                        <X size={18} weight="light" />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => set('options', [...d.options, { label: '', value: '', swatch: d.variantType === 'colour' ? '#C8A45C' : undefined, stock: '0' }])}
                  className="label mt-s inline-flex min-h-11 items-center gap-xs rounded-s border border-dashed border-obsidian/30 px-s hover:border-obsidian"
                >
                  <Plus size={14} weight="light" aria-hidden="true" /> Add {d.variantType === 'colour' ? 'a colour' : 'a size'}
                </button>
              </div>
            )}
          </Section>
        </div>

        {/* Side column */}
        <div className="flex min-w-0 flex-col gap-m lg:sticky lg:top-[88px]">
          <Section title="Pricing" hint="In Trinidad & Tobago dollars.">
            <Field id="price" label="Price (TT$)" error={err('price')} hint="Enter 0 to show “Price on request”.">
              <input id="price" type="number" inputMode="decimal" min={0} step="0.01" value={d.price} onChange={(e) => set('price', e.target.value)} aria-invalid={!!err('price')} className="field tabular" />
            </Field>
            <Field id="compareAtPrice" label="Was price (TT$)" optional error={err('compareAtPrice')} hint="Fill this in to show the item on sale.">
              <input id="compareAtPrice" type="number" inputMode="decimal" min={0} step="0.01" value={d.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} aria-invalid={!!err('compareAtPrice')} className="field tabular" />
            </Field>
          </Section>

          <Section title="Labels & collections">
            <fieldset className="min-w-0">
              <legend className="field-label">Badges</legend>
              <div className="flex flex-wrap gap-xs">
                {TAGS.map((t) => {
                  const on = d.tags.includes(t.value);
                  return (
                    <label key={t.value} className={cn('relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-s text-body-s', on ? 'border-obsidian bg-obsidian text-ivory' : 'border-obsidian/20 hover:border-obsidian')}>
                      <input type="checkbox" checked={on} onChange={() => set('tags', on ? d.tags.filter((x) => x !== t.value) : [...d.tags, t.value])} className="peer sr-only" />
                      <span className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-obsidian" />
                      {t.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <fieldset className="min-w-0">
              <legend className="field-label">Collections</legend>
              <div className="flex flex-col">
                {collections.map((c) => {
                  const on = d.collections.includes(c.slug);
                  return (
                    <label key={c.slug} className="flex min-h-11 cursor-pointer items-center gap-s text-body-s">
                      <input type="checkbox" checked={on} onChange={() => set('collections', on ? d.collections.filter((x) => x !== c.slug) : [...d.collections, c.slug])} className="h-5 w-5 accent-obsidian" />
                      {c.title}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div className="grid min-w-0 grid-cols-2 gap-s">
              <Field id="featured" label="Featured order" optional error={err('featured')} hint="Lower shows first.">
                <input id="featured" type="number" inputMode="numeric" min={0} value={d.featured} onChange={(e) => set('featured', e.target.value)} className="field tabular" />
              </Field>
              <Field id="addedAt" label="Date added" error={err('addedAt')} hint="Sorts “New”.">
                <input id="addedAt" type="date" value={d.addedAt} onChange={(e) => set('addedAt', e.target.value)} aria-invalid={!!err('addedAt')} className="field" />
              </Field>
            </div>
          </Section>

          {!isNew && (
            <button type="button" onClick={() => setConfirm(true)} className="label inline-flex min-h-11 items-center justify-center gap-xs rounded-s border border-error/30 px-s text-error hover:bg-error/5">
              <Trash size={16} weight="light" aria-hidden="true" /> Delete this product
            </button>
          )}
        </div>

        {/* Save bar */}
        <div className="fixed inset-x-0 bottom-0 z-sticky border-t border-obsidian/10 bg-ivory/95 backdrop-blur-md lg:col-span-2">
          <div className="container-x safe-bottom flex min-h-[72px] flex-wrap items-center justify-between gap-s py-s">
            <p role="status" aria-live="polite" className={cn('text-body-s', notice?.tone === 'error' ? 'text-error' : 'text-obsidian')}>
              {notice?.text ?? (isNew ? 'New products go live as soon as you save.' : 'Changes go live as soon as you save.')}
            </p>
            <div className="flex items-center gap-s">
              <Link href="/admin" className="label inline-flex min-h-11 items-center px-s text-stone hover:text-obsidian">
                Cancel
              </Link>
              <button type="submit" disabled={saving || uploading > 0} className="btn btn-primary">
                <span className="btn-fill" aria-hidden="true" />
                <span className="btn-roll">
                  <span>{saving ? 'Saving…' : isNew ? 'Add product' : 'Save changes'}</span>
                  <span aria-hidden="true">{saving ? 'Saving…' : isNew ? 'Add product' : 'Save changes'}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirm}
        title={`Delete ${product?.name ?? 'this product'}?`}
        body="It disappears from the store straight away, including any shopper’s bag and wishlist. This can’t be undone from here."
        confirmLabel="Delete product"
        busy={deleting}
        onConfirm={() =>
          product &&
          startDelete(async () => {
            const res = await deleteProduct(product.id);
            if (res.ok) router.replace('/admin');
            else {
              setConfirm(false);
              setNotice({ tone: 'error', text: res.error ?? 'Could not delete.' });
            }
          })
        }
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
