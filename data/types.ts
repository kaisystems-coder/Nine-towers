export type Category = 'jewellery' | 'luggage' | 'handbags' | 'electronics';
export type Tag = 'new' | 'bestseller' | 'limited' | 'sale';

export type VariantOption = {
  label: string;
  value: string;
  /** Hex for colour swatches (product data, not UI theme). */
  swatch?: string;
  /** Derived from `stock` when stock is set (stock > 0). */
  inStock: boolean;
  /** Units on hand for this colour/size. */
  stock?: number;
  /** Photo of this option (one of the product's images); shown when it's selected. */
  image?: string;
};

export type Variant = {
  type: 'colour' | 'size';
  options: VariantOption[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Supplier item number, as printed on the product photo or card. */
  itemNo?: string;
  category: Category;
  /** necklaces, earrings, rings, bracelets / carry-on, check-in, sets, travel-bags / totes, crossbody, clutches, shoulder-bags */
  subcategory: string;
  /** TTD. 0 means "Price on request" (confirmed on WhatsApp). */
  price: number;
  /** Shows sale styling when set */
  compareAtPrice?: number;
  description: string;
  /** Materials, dimensions */
  details: string[];
  /** Optional product-specific care notes. Falls back to the category's care notes. */
  care?: string[];
  /** Min 3. First = primary, second = hover swap. Paths under /public. */
  images: string[];
  variants?: Variant[];
  tags: Tag[];
  collections: string[];
  /** Derived: any units available. Products with variants count their options. */
  inStock: boolean;
  /** Units on hand (products without variants). */
  stock?: number;
  /** Sort weight for "Featured". Lower shows first. */
  featured?: number;
  /** ISO date the piece arrived, for "New" sorting. */
  addedAt: string;
};

export type Collection = {
  slug: string;
  title: string;
  kicker: string;
  intro: string;
  image: string;
  /** Which category's line drawing to use until photography arrives. */
  plateIcon: Category;
};

export type CategoryInfo = {
  slug: Category;
  title: string;
  singular: string;
  headline: string;
  intro: string;
  image: string;
  subcategories: { slug: string; label: string }[];
  care: string[];
};
