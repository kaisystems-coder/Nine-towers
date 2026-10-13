'use client';

import { Drawer } from '@/components/ui/Drawer';
import { Check, X } from '@/components/ui/icons';
import { categories, categoryList } from '@/data/categories';
import { colourFacets, materialGroups, priceBands, productMaterials, sortOptions, type SortKey } from '@/lib/catalog';
import type { Filters } from '@/lib/shop-filters';
import type { Category, Product } from '@/data/types';
import { cn } from '@/lib/cn';

type ListKey = 'category' | 'sub' | 'price' | 'colour' | 'material';

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0 border-b border-obsidian/10 py-m">
      <legend className="label float-left mb-s w-full">{title}</legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  );
}

function CheckRow({ checked, onChange, label, count, swatch }: { checked: boolean; onChange: () => void; label: string; count?: number; swatch?: string }) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-center gap-s text-body-s">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border transition-transform duration-fast ease-brand group-active:scale-90 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-obsidian',
          checked ? 'border-obsidian bg-obsidian text-ivory' : 'border-obsidian/30 group-hover:border-obsidian'
        )}
      >
        {checked && <Check size={12} weight="bold" />}
      </span>
      {swatch && <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full ring-1 ring-obsidian/15" style={{ background: swatch }} />}
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="tabular text-caption text-stone">{count}</span>}
    </label>
  );
}

/** Slides in from the left. Changes apply instantly and sync to the URL. */
export function FilterDrawer({
  open,
  onClose,
  products,
  filters,
  resultCount,
  toggle,
  setSort,
  setInStock,
  clearAll,
  category,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  filters: Filters;
  resultCount: number;
  toggle: (key: ListKey, value: string) => void;
  setSort: (s: SortKey) => void;
  setInStock: (v: boolean) => void;
  clearAll: () => void;
  category?: Category;
}) {
  const subs = category
    ? categories[category].subcategories
    : filters.category.length
      ? categoryList.filter((c) => filters.category.includes(c.slug)).flatMap((c) => c.subcategories)
      : [];
  const colours = colourFacets(products);
  const materials = materialGroups.filter((m) => products.some((p) => productMaterials(p).includes(m.value)));
  const countBy = (fn: (p: Product) => boolean) => products.filter(fn).length;

  return (
    <Drawer open={open} onClose={onClose} side="left" label="Filter and sort">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-obsidian/10 px-m">
        <h2 className="font-display text-d-xs">Filter & Sort</h2>
        <button type="button" onClick={onClose} aria-label="Close filters" className="-mr-[10px] inline-flex h-11 w-11 items-center justify-center rounded-full active:scale-90">
          <X size={22} weight="light" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-m" data-lenis-prevent="">
        <Group title="Sort by">
          {sortOptions.map((o) => (
            <label key={o.value} className="group flex min-h-11 cursor-pointer items-center gap-s text-body-s">
              <input type="radio" name="sort" checked={filters.sort === o.value} onChange={() => setSort(o.value)} className="peer sr-only" />
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-obsidian',
                  filters.sort === o.value ? 'border-obsidian' : 'border-obsidian/30 group-hover:border-obsidian'
                )}
              >
                {filters.sort === o.value && <span className="h-2.5 w-2.5 rounded-full bg-obsidian" />}
              </span>
              {o.label}
            </label>
          ))}
        </Group>

        {!category && (
          <Group title="Category">
            {categoryList.map((c) => (
              <CheckRow key={c.slug} label={c.title} checked={filters.category.includes(c.slug)} onChange={() => toggle('category', c.slug)} count={countBy((p) => p.category === c.slug)} />
            ))}
          </Group>
        )}

        {subs.length > 0 && (
          <Group title="Type">
            {subs.filter((s) => products.some((p) => p.subcategory === s.slug)).map((s) => (
              <CheckRow key={s.slug} label={s.label} checked={filters.sub.includes(s.slug)} onChange={() => toggle('sub', s.slug)} count={countBy((p) => p.subcategory === s.slug)} />
            ))}
          </Group>
        )}

        <Group title="Price">
          {priceBands.map((b) => {
            const n = countBy((p) => p.price >= b.min && p.price <= b.max);
            if (!n) return null;
            return <CheckRow key={b.value} label={b.label} checked={filters.price.includes(b.value)} onChange={() => toggle('price', b.value)} count={n} />;
          })}
        </Group>

        {colours.length > 0 && (
          <Group title="Colour">
            <div className="grid grid-cols-2 gap-x-s">
              {colours.map((c) => (
                <CheckRow key={c.value} label={c.label} swatch={c.swatch} checked={filters.colour.includes(c.value)} onChange={() => toggle('colour', c.value)} />
              ))}
            </div>
          </Group>
        )}

        {materials.length > 1 && (
          <Group title="Material">
            {materials.map((m) => (
              <CheckRow key={m.value} label={m.label} checked={filters.material.includes(m.value)} onChange={() => toggle('material', m.value)} count={countBy((p) => productMaterials(p).includes(m.value))} />
            ))}
          </Group>
        )}

        <Group title="Availability">
          <CheckRow label="In stock only" checked={filters.inStock} onChange={() => setInStock(!filters.inStock)} count={countBy((p) => p.inStock)} />
        </Group>
      </div>

      <div className="safe-bottom grid shrink-0 grid-cols-[auto_1fr] gap-s border-t border-obsidian/10 px-m py-s">
        <button type="button" onClick={clearAll} className="btn btn-outline px-m">
          <span className="btn-fill" aria-hidden="true" />
          <span className="btn-roll">
            <span>Clear all</span>
            <span aria-hidden="true">Clear all</span>
          </span>
        </button>
        <button type="button" onClick={onClose} className="btn btn-primary">
          <span className="btn-fill" aria-hidden="true" />
          <span className="btn-roll">
            <span>Show {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}</span>
            <span aria-hidden="true">Show {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}</span>
          </span>
        </button>
      </div>
    </Drawer>
  );
}
