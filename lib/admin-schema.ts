import { z } from 'zod';
import { categories } from '@/data/categories';
import { collections } from '@/data/collections';

const optionSchema = z.object({
  label: z.string().trim().min(1, 'Give each option a name.').max(40),
  value: z.string().trim().min(1).max(60),
  swatch: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Swatch must be a colour like #C8A45C.')
    .optional(),
  stock: z.coerce.number().int('Stock must be a whole number.').min(0, 'Stock can’t be negative.').max(9999),
  image: z.string().max(600).optional(),
});

/** What the admin editor sends. Checked in the browser and again on the server. */
export const productInputSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(2, 'Enter a product name.').max(80, 'Keep the name under 80 characters.'),
    slug: z
      .string()
      .trim()
      .min(2, 'Enter a web address name.')
      .max(80)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes only.'),
    itemNo: z.string().trim().max(40, 'Keep the item number under 40 characters.').optional(),
    category: z.enum(['jewellery', 'luggage', 'handbags', 'electronics']),
    subcategory: z.string().min(1, 'Choose a type.'),
    price: z.coerce.number({ invalid_type_error: 'Enter a price, or 0 for “Price on request”.' }).min(0, 'Price can’t be negative.').max(1_000_000),
    compareAtPrice: z.coerce.number().positive().max(1_000_000).optional(),
    description: z.string().trim().min(10, 'Write at least a sentence.').max(1200),
    details: z.array(z.string().trim().min(1).max(200)).max(20),
    care: z.array(z.string().trim().min(1).max(200)).max(12),
    images: z.array(z.string().trim().min(1).max(600)).max(12, 'Up to 12 photos per product.'),
    variantType: z.enum(['none', 'colour', 'size']),
    options: z.array(optionSchema).max(24),
    stock: z.coerce.number().int('Stock must be a whole number.').min(0, 'Stock can’t be negative.').max(99999),
    tags: z.array(z.enum(['new', 'bestseller', 'limited', 'sale'])),
    collections: z.array(z.string()),
    featured: z.coerce.number().int().min(0).max(999).optional(),
    addedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date like 2026-10-05.'),
  })
  .superRefine((v, ctx) => {
    if (!categories[v.category].subcategories.some((s) => s.slug === v.subcategory))
      ctx.addIssue({ path: ['subcategory'], code: 'custom', message: 'Choose a type for this category.' });
    if (v.compareAtPrice !== undefined && v.price <= 0)
      ctx.addIssue({ path: ['compareAtPrice'], code: 'custom', message: 'Set a price before adding a “was” price.' });
    else if (v.compareAtPrice !== undefined && v.compareAtPrice <= v.price)
      ctx.addIssue({ path: ['compareAtPrice'], code: 'custom', message: 'The “was” price must be higher than the price.' });
    if (v.variantType !== 'none' && v.options.length === 0)
      ctx.addIssue({ path: ['options'], code: 'custom', message: `Add at least one ${v.variantType}, or choose “No options”.` });
    const seen = new Set<string>();
    v.options.forEach((o, i) => {
      if (seen.has(o.value)) ctx.addIssue({ path: ['options', i, 'label'], code: 'custom', message: 'Each option needs a different name.' });
      seen.add(o.value);
    });
    const known = new Set(collections.map((c) => c.slug));
    if (v.collections.some((c) => !known.has(c))) ctx.addIssue({ path: ['collections'], code: 'custom', message: 'Unknown collection.' });
  });

export type ProductInput = z.infer<typeof productInputSchema>;

/** First error message per field path, for showing next to inputs. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
