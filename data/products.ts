import type { Product } from './types';

export type { Product } from './types';

/**
 * STARTER CATALOGUE. Products, quantities (stock), descriptions and prices
 * (TTD Unit Selling Price) come from the client's inventory sheet
 * "All products Oct 12, 2026 - revised.xlsx" (Inventory tab, 87 rows, 423 units),
 * matched to the supplied product photos. Items with no photo yet show the
 * category plate until one is added in the admin. Manage products day to day in
 * the admin at /admin; once the admin saves, data/products.json (or Vercel Blob)
 * takes over. Photos live in /public/products/<folder>/1.jpg, 2.jpg …
 */
export const products: Product[] = [
  {
    "id": "ntc-4391",
    "slug": "gem-heart-pendant-necklace-4391",
    "name": "Gem Heart Pendant Necklace",
    "itemNo": "4391",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a gem heart pendant. Item #4391.",
    "details": [
      "Colour: Gold",
      "Detail: Gem heart"
    ],
    "images": [
      "/products/baguette-heart-pendant-necklace-4391/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 2,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4305",
    "slug": "triangle-pendant-necklace-4305",
    "name": "Triangle Pendant Necklace",
    "itemNo": "4305",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a triangle pendant, in key lime green or cream. Item #4305.",
    "details": [
      "Colour: Gold",
      "Detail: Triangle pendant in key lime green or cream"
    ],
    "images": [
      "/products/fan-pendant-necklace-4305/1.jpg",
      "/products/fan-pendant-necklace-4305/2.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "Key Lime Green",
            "value": "key-lime-green",
            "swatch": "#8FBF4D",
            "image": "/products/fan-pendant-necklace-4305/2.jpg",
            "inStock": true,
            "stock": 3
          },
          {
            "label": "Cream",
            "value": "cream",
            "swatch": "#EDE3CC",
            "image": "/products/fan-pendant-necklace-4305/1.jpg",
            "inStock": true,
            "stock": 3
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "featured": 6,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4377-xuping-evil-",
    "slug": "evil-eye-pendant-necklace-4377",
    "name": "Evil Eye Pendant Necklace",
    "itemNo": "4377",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 100,
    "description": "A silver chain with a blue third eye gem. Item #4377.",
    "details": [
      "Colour: Silver",
      "Detail: Blue third eye gem"
    ],
    "images": [
      "/products/xuping-evil-eye-pendant-necklace-4377/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 14,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4377-green-oval-h",
    "slug": "emerald-green-oval-pendant-necklace-4377",
    "name": "Emerald Green Oval Pendant Necklace",
    "itemNo": "4377",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a green emerald in a diamante oval. Item #4377.",
    "details": [
      "Colour: Gold",
      "Detail: Green emerald in diamante oval"
    ],
    "images": [
      "/products/green-oval-halo-pendant-necklace-4377/1.jpg"
    ],
    "tags": [],
    "collections": [
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 9,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4314",
    "slug": "embrace-pendant-necklace-4314",
    "name": "Embrace Pendant Necklace",
    "itemNo": "4314",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with gold people. Item #4314.",
    "details": [
      "Colour: Gold",
      "Detail: Gold people"
    ],
    "images": [
      "/products/self-embrace-pendant-necklace-4314/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 16,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4334",
    "slug": "two-tone-embrace-pendant-necklace-4334",
    "name": "Two-Tone Embrace Pendant Necklace",
    "itemNo": "4334",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with silver and gold people. Item #4334.",
    "details": [
      "Colour: Gold",
      "Detail: Silver and gold people"
    ],
    "images": [
      "/products/two-tone-embrace-pendant-necklace-4334/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 4,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4331",
    "slug": "anchor-pendant-necklace-4331",
    "name": "Anchor Pendant Necklace",
    "itemNo": "4331",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 100,
    "description": "A gold necklace with an anchor set with a blue gem. Item #4331.",
    "details": [
      "Colour: Gold",
      "Detail: Anchor with blue gem"
    ],
    "images": [
      "/products/xuping-anchor-pendant-necklace-4331/1.jpg"
    ],
    "tags": [],
    "collections": [
      "the-travel-edit",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 18,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4383",
    "slug": "clover-pendant-necklace-4383",
    "name": "Clover Pendant Necklace",
    "itemNo": "4383",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a clover pendant, in cream or green. Item #4383.",
    "details": [
      "Colour: Gold",
      "Detail: Clover pendant in cream or green"
    ],
    "images": [
      "/products/four-leaf-clover-pendant-necklace-4383/1.jpg",
      "/products/four-leaf-clover-pendant-necklace-4383/2.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "Cream",
            "value": "cream",
            "swatch": "#EDE3CC",
            "image": "/products/four-leaf-clover-pendant-necklace-4383/1.jpg",
            "inStock": true,
            "stock": 3
          },
          {
            "label": "Green",
            "value": "green",
            "swatch": "#8FBF4D",
            "image": "/products/four-leaf-clover-pendant-necklace-4383/2.jpg",
            "inStock": true,
            "stock": 3
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "new-in",
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "featured": 1,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4311",
    "slug": "pink-stone-circle-necklace-4311",
    "name": "Pink Stone Circle Necklace",
    "itemNo": "4311",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a gold circle set with a pink stone. Item #4311.",
    "details": [
      "Colour: Gold",
      "Detail: Gold circle with pink stone"
    ],
    "images": [
      "/products/pink-stone-circle-necklace-4311/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 20,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-5755",
    "slug": "pearl-flower-pendant-necklace-5755",
    "name": "Pearl Flower Pendant Necklace",
    "itemNo": "5755",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a gem flower and a pearl centre. Item #5755.",
    "details": [
      "Colour: Gold",
      "Detail: Pearl centre gem flower"
    ],
    "images": [
      "/products/pearl-flower-pendant-necklace-5755/1.jpg"
    ],
    "tags": [],
    "collections": [
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 12,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4386",
    "slug": "double-heart-pendant-necklace-4386",
    "name": "Double Heart Pendant Necklace",
    "itemNo": "4386",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a double heart pendant. Item #4386.",
    "details": [
      "Colour: Gold",
      "Detail: Double heart"
    ],
    "images": [
      "/products/pave-heart-pendant-necklace-4386/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 7,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4341",
    "slug": "gold-heart-pendant-necklace-4341",
    "name": "Gold Heart Pendant Necklace",
    "itemNo": "4341",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a gold heart pendant. Item #4341.",
    "details": [
      "Colour: Gold",
      "Detail: Gold heart"
    ],
    "images": [
      "/products/ribbed-heart-pendant-necklace-4341/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 13,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4323",
    "slug": "pastel-flower-pearl-necklace-4323",
    "name": "Pastel Flower Pearl Necklace",
    "itemNo": "4323",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 100,
    "description": "A gold necklace with an iridescent pastel flower and a pearl centre. Item #4323.",
    "details": [
      "Colour: Gold",
      "Detail: Pearl centre iridescent pastel flower"
    ],
    "images": [
      "/products/xuping-pearl-flower-necklace-4323/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 10,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4343",
    "slug": "moon-in-sun-pendant-necklace-4343",
    "name": "Moon in Sun Pendant Necklace",
    "itemNo": "4343",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 100,
    "description": "A gold necklace with a moon in a sun. Item #4343.",
    "details": [
      "Colour: Gold",
      "Detail: Moon in sun"
    ],
    "images": [
      "/products/xuping-sun-face-pendant-necklace-4343/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 5,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4324-11",
    "slug": "pink-flower-fidget-necklace-4324-11",
    "name": "Pink Flower Fidget Necklace",
    "itemNo": "4324-11",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a pink flower fidget pendant. Item #4324-11.",
    "details": [
      "Colour: Gold",
      "Detail: Pink flower fidget"
    ],
    "images": [
      "/products/pink-crystal-flower-necklace-4324-11/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 15,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4324-95",
    "slug": "pearl-pendant-necklace-4306",
    "name": "Pearl Pendant Necklace",
    "itemNo": "4306",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a pearl pendant. Item #4306.",
    "details": [
      "Colour: Gold",
      "Detail: Pearl"
    ],
    "images": [
      "/products/pearl-teardrop-pendant-necklace-4324-95/1.jpg"
    ],
    "tags": [],
    "collections": [
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 3,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4329",
    "slug": "square-gem-necklace-4329",
    "name": "Square Gem Necklace",
    "itemNo": "4329",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 100,
    "description": "A gold necklace with a square gem. Item #4329.",
    "details": [
      "Colour: Gold",
      "Detail: Square gem"
    ],
    "images": [
      "/products/xuping-cushion-solitaire-necklace-4329/1.jpg"
    ],
    "tags": [],
    "collections": [
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 11,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4306",
    "slug": "pink-butterfly-pendant-necklace-4306",
    "name": "Pink Butterfly Pendant Necklace",
    "itemNo": "4306",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a pink butterfly pendant. Item #4306.",
    "details": [
      "Colour: Gold",
      "Detail: Pink butterfly"
    ],
    "images": [
      "/products/pink-butterfly-pendant-necklace-4306/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 8,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-4346",
    "slug": "dolphin-pendant-necklace-4346",
    "name": "Dolphin Pendant Necklace",
    "itemNo": "4346",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 100,
    "description": "A gold necklace with a dolphin pendant. Item #4346.",
    "details": [
      "Colour: Gold",
      "Detail: Dolphin"
    ],
    "images": [
      "/products/xuping-dolphin-pendant-necklace-4346/1.jpg"
    ],
    "tags": [],
    "collections": [
      "the-travel-edit",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 22,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4316",
    "slug": "moon-and-star-necklace-4316",
    "name": "Moon & Star Necklace",
    "itemNo": "4316",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 100,
    "description": "A gold necklace with a moon and star. Item #4316.",
    "details": [
      "Colour: Gold",
      "Detail: Moon and star"
    ],
    "images": [
      "/products/xuping-shooting-star-necklace-4316/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 19,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-4337",
    "slug": "rose-circle-pendant-necklace-4337",
    "name": "Rose Circle Pendant Necklace",
    "itemNo": "4337",
    "category": "jewellery",
    "subcategory": "necklaces",
    "price": 80,
    "description": "A gold necklace with a gold rose on a circle. Item #4337.",
    "details": [
      "Colour: Gold",
      "Detail: Gold rose on circle"
    ],
    "images": [
      "/products/rosebud-circle-pendant-necklace-4337/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 24,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-8105",
    "slug": "butterfly-stud-earrings-8105",
    "name": "Butterfly Stud Earrings",
    "itemNo": "8105",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 40,
    "description": "Gold studs with a butterfly, in six colours: pink, purple, blue, black, white and red. Item #8105.",
    "details": [
      "Colour: Gold stud",
      "Detail: Butterfly in pink, purple, blue, black, white or red"
    ],
    "images": [
      "/products/butterfly-crystal-drop-earrings-8105/1.jpg",
      "/products/butterfly-crystal-drop-earrings-8105/2.jpg",
      "/products/butterfly-crystal-drop-earrings-8105/3.jpg",
      "/products/butterfly-crystal-drop-earrings-8105/4.jpg",
      "/products/butterfly-crystal-drop-earrings-8105/5.jpg",
      "/products/butterfly-crystal-drop-earrings-8105/6.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "White",
            "value": "white",
            "swatch": "#F4F1EA",
            "image": "/products/butterfly-crystal-drop-earrings-8105/1.jpg",
            "inStock": true,
            "stock": 4
          },
          {
            "label": "Pink",
            "value": "pink",
            "swatch": "#F0559A",
            "image": "/products/butterfly-crystal-drop-earrings-8105/2.jpg",
            "inStock": true,
            "stock": 4
          },
          {
            "label": "Purple",
            "value": "purple",
            "swatch": "#9B2A9E",
            "image": "/products/butterfly-crystal-drop-earrings-8105/3.jpg",
            "inStock": true,
            "stock": 4
          },
          {
            "label": "Blue",
            "value": "blue",
            "swatch": "#1F3FBF",
            "image": "/products/butterfly-crystal-drop-earrings-8105/4.jpg",
            "inStock": true,
            "stock": 4
          },
          {
            "label": "Red",
            "value": "red",
            "swatch": "#C8102E",
            "image": "/products/butterfly-crystal-drop-earrings-8105/5.jpg",
            "inStock": true,
            "stock": 4
          },
          {
            "label": "Black",
            "value": "black",
            "swatch": "#1C1B1A",
            "image": "/products/butterfly-crystal-drop-earrings-8105/6.jpg",
            "inStock": true,
            "stock": 4
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "new-in",
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "featured": 1,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-53-01",
    "slug": "two-tone-heart-earrings-53-01",
    "name": "Two-Tone Heart Earrings",
    "itemNo": "53-01",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Gold and silver heart earrings. Item #53-01.",
    "details": [
      "Colour: Gold and silver",
      "Detail: Heart"
    ],
    "images": [
      "/products/two-tone-heart-hoop-earrings-53-01/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 2,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-7922",
    "slug": "triple-clover-earrings-7922",
    "name": "Triple Clover Earrings",
    "itemNo": "7922",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Triple clover earrings in gold or silver. Item #7922.",
    "details": [
      "Colour: Gold or silver",
      "Detail: Triple clover"
    ],
    "images": [
      "/products/crystal-cluster-huggie-earrings-7922/1.jpg",
      "/products/crystal-cluster-huggie-earrings-7922/2.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "Silver",
            "value": "silver",
            "swatch": "#C4C6C7",
            "image": "/products/crystal-cluster-huggie-earrings-7922/1.jpg",
            "inStock": true,
            "stock": 3
          },
          {
            "label": "Gold",
            "value": "gold",
            "swatch": "#C8A45C",
            "image": "/products/crystal-cluster-huggie-earrings-7922/2.jpg",
            "inStock": true,
            "stock": 3
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "featured": 5,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-7927",
    "slug": "geometric-huggie-hoop-earrings-7927",
    "name": "Geometric Huggie Hoop Earrings",
    "itemNo": "7927",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Geometric huggie hoops in silver or gold. Item #7927.",
    "details": [
      "Colour: Silver or gold",
      "Detail: Geometric huggie hoop"
    ],
    "images": [
      "/products/baguette-double-row-huggie-earrings-7927/1.jpg",
      "/products/baguette-double-row-huggie-earrings-7927/2.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "Silver",
            "value": "silver",
            "swatch": "#C4C6C7",
            "image": "/products/baguette-double-row-huggie-earrings-7927/1.jpg",
            "inStock": true,
            "stock": 3
          },
          {
            "label": "Gold",
            "value": "gold",
            "swatch": "#C8A45C",
            "image": "/products/baguette-double-row-huggie-earrings-7927/2.jpg",
            "inStock": true,
            "stock": 3
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "featured": 6,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-7934",
    "slug": "gold-gem-earrings-7934",
    "name": "Gold Gem Earrings",
    "itemNo": "7934",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Gold earrings with a gem. Item #7934.",
    "details": [
      "Colour: Gold",
      "Detail: Gem"
    ],
    "images": [
      "/products/baguette-channel-hoop-earrings-7934/1.jpg"
    ],
    "tags": [],
    "collections": [
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 3,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-7930",
    "slug": "silver-huggie-hoop-earrings-7930",
    "name": "Silver Huggie Hoop Earrings",
    "itemNo": "7930",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Silver huggie hoops. Item #7930.",
    "details": [
      "Colour: Silver",
      "Detail: Huggie hoop"
    ],
    "images": [
      "/products/crystal-dot-chunky-hoop-earrings-7930/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 9,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-11624",
    "slug": "gold-double-hoop-stud-earrings-11624",
    "name": "Gold Double Hoop Stud Earrings",
    "itemNo": "11624",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Gold double hoop studs. Item #11624.",
    "details": [
      "Colour: Gold",
      "Detail: Gold double hoop stud"
    ],
    "images": [
      "/products/pave-double-hoop-earrings-11624/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 4,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-1616",
    "slug": "double-heart-stud-earrings-1616",
    "name": "Double Heart Stud Earrings",
    "itemNo": "1616",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 60,
    "description": "Gold double heart studs. Item #1616.",
    "details": [
      "Colour: Gold",
      "Detail: Double heart stud"
    ],
    "images": [
      "/products/pearly-heart-stud-earrings-1616/1.jpg"
    ],
    "tags": [],
    "collections": [
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 7,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-1614",
    "slug": "black-clover-stud-earrings-1614",
    "name": "Black Clover Stud Earrings",
    "itemNo": "1614",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 60,
    "description": "Gold studs with a black clover. Item #1614.",
    "details": [
      "Colour: Gold",
      "Detail: Black clover stud"
    ],
    "images": [
      "/products/xuping-black-clover-stud-earrings-1614/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 8,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-7923",
    "slug": "four-heart-hoop-earrings-7923",
    "name": "Four Heart Hoop Earrings",
    "itemNo": "7923",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Gold hoops with four hearts. Item #7923.",
    "details": [
      "Colour: Gold",
      "Detail: 4 heart hoop"
    ],
    "images": [
      "/products/heart-pave-huggie-earrings-7923/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 10,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-7924",
    "slug": "silver-heart-hoop-earrings-7924",
    "name": "Silver Heart Hoop Earrings",
    "itemNo": "7924",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Silver heart hoops. Item #7924.",
    "details": [
      "Colour: Silver",
      "Detail: Heart hoop"
    ],
    "images": [
      "/products/silver-heart-pave-huggie-earrings-7924/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 11,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-7928",
    "slug": "single-gem-heart-hoop-earrings-7928",
    "name": "Single Gem Heart Hoop Earrings",
    "itemNo": "7928",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Gold hoops with a single gem heart. Item #7928.",
    "details": [
      "Colour: Gold",
      "Detail: Single gem heart hoop"
    ],
    "images": [
      "/products/heart-and-crystal-huggie-earrings-7928/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 15,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-2733",
    "slug": "bow-drop-hoop-earrings-2733",
    "name": "Bow Drop Hoop Earrings",
    "itemNo": "2733",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 60,
    "description": "Gold drop hoops with a gold bow. Item #2733.",
    "details": [
      "Colour: Gold",
      "Detail: Gold bow drop hoop"
    ],
    "images": [
      "/products/butterfly-charm-drop-hoops-2733/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 13,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-5353a",
    "slug": "half-moon-earrings-5353a",
    "name": "Half Moon Earrings",
    "itemNo": "5353A",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 40,
    "description": "Gold half moon earrings. Item #5353A.",
    "details": [
      "Colour: Gold",
      "Detail: Half moon"
    ],
    "images": [
      "/products/crescent-crystal-screw-back-earrings-5353a/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 12,
    "featured": 14,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-2211",
    "slug": "evil-eye-charm-bracelet-2211",
    "name": "Evil Eye Charm Bracelet",
    "itemNo": "2211",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A gold charm bracelet with an evil eye. Item #2211.",
    "details": [
      "Colour: Gold",
      "Detail: Evil eye"
    ],
    "images": [
      "/products/evil-eye-hamsa-charm-bangle-2211/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 2,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-2218",
    "slug": "pink-butterfly-charm-bracelet-2218",
    "name": "Pink Butterfly Charm Bracelet",
    "itemNo": "2218",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A gold charm bracelet with a pink butterfly. Item #2218.",
    "details": [
      "Colour: Gold",
      "Detail: Pink butterfly"
    ],
    "images": [
      "/products/butterfly-charm-bangle-2218/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 5,
    "featured": 3,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-2214",
    "slug": "mermaid-tail-charm-bracelet-2214",
    "name": "Mermaid Tail Charm Bracelet",
    "itemNo": "2214",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A gold charm bracelet with purple, pink and black charms, including a mermaid tail. Item #2214.",
    "details": [
      "Colour: Gold",
      "Detail: Purple, pink and black charms (mermaid tail)"
    ],
    "images": [
      "/products/mermaid-heart-charm-bangle-2214/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 4,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-5000-pink-crystal",
    "slug": "pink-gem-charm-bracelet-5000",
    "name": "Pink Gem Charm Bracelet",
    "itemNo": "5000",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A silver charm bracelet with a pink gem. One only. Item #5000.",
    "details": [
      "Colour: Silver",
      "Detail: Pink gem"
    ],
    "images": [
      "/products/pink-crystal-drop-charm-bangle-5000/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 1,
    "featured": 1,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-5000-bow-clover-c",
    "slug": "red-bow-charm-bracelet-5000",
    "name": "Red Bow Charm Bracelet",
    "itemNo": "5000",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A silver charm bracelet with a red bow. One only. Item #5000.",
    "details": [
      "Colour: Silver",
      "Detail: Red bow"
    ],
    "images": [
      "/products/bow-and-clover-charm-bangle-5000/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 1,
    "featured": 5,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-5000-pink-flower-",
    "slug": "pink-flower-charm-bracelet-5000",
    "name": "Pink Flower Charm Bracelet",
    "itemNo": "5000",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A silver charm bracelet with a pink and silver flower. One only. Item #5000.",
    "details": [
      "Colour: Silver",
      "Detail: Pink and silver flower"
    ],
    "images": [
      "/products/pink-flower-charm-bangle-5000/1.jpg",
      "/products/pink-flower-charm-bangle-5000/2.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 1,
    "featured": 6,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-5000-cross-teddy-",
    "slug": "cross-charm-bracelet-5000",
    "name": "Cross Charm Bracelet",
    "itemNo": "5000",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A silver charm bracelet with a cross. One only. Item #5000.",
    "details": [
      "Colour: Silver",
      "Detail: Cross"
    ],
    "images": [
      "/products/cross-and-bear-charm-bangle-5000/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 1,
    "featured": 7,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-7929",
    "slug": "silver-gem-hoop-earrings-7929",
    "name": "Silver Gem Hoop Earrings",
    "itemNo": "7929",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Silver gem hoops. Item #7929.",
    "details": [
      "Colour: Silver",
      "Detail: Gem hoop"
    ],
    "images": [],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-4324-95-earrings",
    "slug": "silver-white-hoop-earrings-4324-95",
    "name": "Silver White Hoop Earrings",
    "itemNo": "4324-95",
    "category": "jewellery",
    "subcategory": "earrings",
    "price": 50,
    "description": "Silver hoops in white. Item #4324-95.",
    "details": [
      "Colour: Silver",
      "Detail: White hoop"
    ],
    "images": [],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-5000-heart",
    "slug": "pink-heart-charm-bracelet-5000",
    "name": "Pink Heart Charm Bracelet",
    "itemNo": "5000",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A silver charm bracelet with a pink and silver heart. One only. Item #5000.",
    "details": [
      "Colour: Silver",
      "Detail: Pink and silver heart"
    ],
    "images": [],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 1,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-5000-frame",
    "slug": "framed-flower-charm-bracelet-5000",
    "name": "Framed Flower Charm Bracelet",
    "itemNo": "5000",
    "category": "jewellery",
    "subcategory": "bracelets",
    "price": 200,
    "description": "A silver charm bracelet with a flower in a picture frame. One only. Item #5000.",
    "details": [
      "Colour: Silver",
      "Detail: Flower in picture frame"
    ],
    "images": [],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 1,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-52930",
    "slug": "arena-milano-top-handle-bag-52930",
    "name": "Arena Milano Top-Handle Bag",
    "itemNo": "52930",
    "category": "handbags",
    "subcategory": "top-handle",
    "price": 130,
    "description": "An Arena Milano handbag in brown, pink, black or jujube. Item #52930.",
    "details": [
      "Brand: Arena Milano",
      "Colours: Brown, Pink, Black, Jujube"
    ],
    "images": [
      "/products/arena-milano-top-handle-bag-52930/1.jpg",
      "/products/arena-milano-top-handle-bag-52930/2.jpg",
      "/products/arena-milano-top-handle-bag-52930/3.jpg",
      "/products/arena-milano-top-handle-bag-52930/4.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "Jujube",
            "value": "jujube",
            "swatch": "#A3142B",
            "image": "/products/arena-milano-top-handle-bag-52930/1.jpg",
            "inStock": true,
            "stock": 2
          },
          {
            "label": "Pink",
            "value": "pink",
            "swatch": "#E9A3AE",
            "image": "/products/arena-milano-top-handle-bag-52930/2.jpg",
            "inStock": true,
            "stock": 2
          },
          {
            "label": "Brown",
            "value": "brown",
            "swatch": "#9A5428",
            "image": "/products/arena-milano-top-handle-bag-52930/3.jpg",
            "inStock": true,
            "stock": 2
          },
          {
            "label": "Black",
            "value": "black",
            "swatch": "#1C1B1A",
            "image": "/products/arena-milano-top-handle-bag-52930/4.jpg",
            "inStock": true,
            "stock": 6
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "new-in",
      "evening",
      "gifts-under-500"
    ],
    "inStock": true,
    "featured": 1,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-52932",
    "slug": "arena-milano-chain-handle-bag-52932",
    "name": "Arena Milano Chain-Handle Bag",
    "itemNo": "52932",
    "category": "handbags",
    "subcategory": "top-handle",
    "price": 130,
    "description": "An Arena Milano handbag in brown, black, pink or jujube. Item #52932.",
    "details": [
      "Brand: Arena Milano",
      "Colours: Brown, Black, Pink, Jujube"
    ],
    "images": [
      "/products/chain-handle-flap-bag-52932/1.jpg",
      "/products/chain-handle-flap-bag-52932/2.jpg",
      "/products/chain-handle-flap-bag-52932/3.jpg",
      "/products/chain-handle-flap-bag-52932/4.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "Jujube",
            "value": "jujube",
            "swatch": "#A3142B",
            "image": "/products/chain-handle-flap-bag-52932/1.jpg",
            "inStock": true,
            "stock": 2
          },
          {
            "label": "Pink",
            "value": "pink",
            "swatch": "#E9A3AE",
            "image": "/products/chain-handle-flap-bag-52932/2.jpg",
            "inStock": true,
            "stock": 2
          },
          {
            "label": "Brown",
            "value": "brown",
            "swatch": "#9A5428",
            "image": "/products/chain-handle-flap-bag-52932/3.jpg",
            "inStock": true,
            "stock": 2
          },
          {
            "label": "Black",
            "value": "black",
            "swatch": "#1C1B1A",
            "image": "/products/chain-handle-flap-bag-52932/4.jpg",
            "inStock": true,
            "stock": 6
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "featured": 2,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-gu1659cm",
    "slug": "gusto-quilted-handbag-gu-1659-cm",
    "name": "Gusto Quilted Handbag",
    "itemNo": "STY GU 1659 CM",
    "category": "handbags",
    "subcategory": "shoulder-bags",
    "price": 135,
    "description": "A camel handbag by Gusto. Item #STY GU 1659 CM.",
    "details": [
      "Brand: Gusto",
      "Colour: Camel"
    ],
    "images": [
      "/products/gusto-quilted-shoulder-bag-gu1659cm/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 3,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-gu1639bg",
    "slug": "gusto-camera-bag-gu-1639-bg",
    "name": "Gusto Camera Bag",
    "itemNo": "STY GU 1639 BG",
    "category": "handbags",
    "subcategory": "shoulder-bags",
    "price": 120,
    "description": "A beige handbag by Gusto. Item #STY GU 1639 BG.",
    "details": [
      "Brand: Gusto",
      "Colour: Beige"
    ],
    "images": [
      "/products/gusto-camera-crossbody-bag-gu1639bg/1.jpg"
    ],
    "tags": [],
    "collections": [
      "the-travel-edit",
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 4,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-gu1576bg",
    "slug": "gusto-half-moon-crossbody-bag-gu-1576-bg",
    "name": "Gusto Half-Moon Crossbody Bag",
    "itemNo": "STY GU 1576 BG",
    "category": "handbags",
    "subcategory": "crossbody",
    "price": 150,
    "description": "A beige cross body bag by Gusto. Item #STY GU 1576 BG.",
    "details": [
      "Brand: Gusto",
      "Colour: Beige",
      "Cross body bag"
    ],
    "images": [
      "/products/gusto-half-moon-shoulder-bag-gu1576bg/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 5,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-gusto-chevron-flap-bag",
    "slug": "gusto-chevron-flap-bag-gu-1626-bg",
    "name": "Gusto Chevron Flap Bag",
    "itemNo": "STY GU 1626 BG",
    "category": "handbags",
    "subcategory": "shoulder-bags",
    "price": 135,
    "description": "A beige handbag by Gusto. Item #STY GU 1626 BG.",
    "details": [
      "Brand: Gusto",
      "Colour: Beige"
    ],
    "images": [
      "/products/gusto-chevron-flap-bag/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 6,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-wellington-polo-club-tot",
    "slug": "wellington-polo-club-tote-wpc-27008dbr",
    "name": "Wellington Polo Club Tote",
    "itemNo": "WPC 27008DBR",
    "category": "handbags",
    "subcategory": "totes",
    "price": 250,
    "description": "A dark brown handbag by Wellington Polo Club. Item #WPC 27008DBR.",
    "details": [
      "Brand: Wellington Polo Club",
      "Colour: Dark Brown"
    ],
    "images": [
      "/products/wellington-polo-club-tote/1.jpg"
    ],
    "tags": [],
    "collections": [
      "gifts-under-500"
    ],
    "inStock": true,
    "stock": 6,
    "featured": 7,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-1720rb",
    "slug": "airliner-3-piece-luggage-set-1720rb",
    "name": "Airliner 3-Piece Luggage Set",
    "itemNo": "1720RB / 1720YW / 1720PR",
    "category": "luggage",
    "subcategory": "sets",
    "price": 1250,
    "description": "A 3-piece Airliner luggage set (small, medium, large) with a polypropylene shell, 8 spinner 360° wheels, lock security and 25% expandable extra capacity. In red, yellow or blue. Item #1720RB / 1720YW / 1720PR.",
    "details": [
      "Brand: Airliner",
      "3-piece set: small, medium, large",
      "20\" x 24\" x 28\"",
      "25% expandable extra capacity",
      "8 spinner 360° wheels",
      "Lock security",
      "Polypropylene shell",
      "Item numbers: 1720PR (red), 1720YW (yellow), 1720RB (blue)"
    ],
    "images": [
      "/products/airliner-3-piece-luggage-set-1720/1.jpg",
      "/products/airliner-3-piece-luggage-set-1720/2.jpg",
      "/products/airliner-3-piece-luggage-set-1720/3.jpg"
    ],
    "variants": [
      {
        "type": "colour",
        "options": [
          {
            "label": "Red",
            "value": "red",
            "swatch": "#B3262E",
            "image": "/products/airliner-3-piece-luggage-set-1720/1.jpg",
            "inStock": true,
            "stock": 3
          },
          {
            "label": "Yellow",
            "value": "yellow",
            "swatch": "#E8C21C",
            "image": "/products/airliner-3-piece-luggage-set-1720/2.jpg",
            "inStock": true,
            "stock": 3
          },
          {
            "label": "Blue",
            "value": "blue",
            "swatch": "#1E3FA8",
            "image": "/products/airliner-3-piece-luggage-set-1720/3.jpg",
            "inStock": true,
            "stock": 3
          }
        ]
      }
    ],
    "tags": [],
    "collections": [
      "new-in",
      "the-travel-edit"
    ],
    "inStock": true,
    "featured": 1,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-1718dg",
    "slug": "airliner-3-piece-luggage-set-grey-1718dg",
    "name": "Airliner 3-Piece Luggage Set, Grey",
    "itemNo": "1718DG",
    "category": "luggage",
    "subcategory": "sets",
    "price": 1250,
    "description": "A 3-piece Airliner luggage set (small, medium, large) in grey, with a polypropylene shell, 8 spinner 360° wheels, lock security and 25% expandable extra capacity. Item #1718DG.",
    "details": [
      "Brand: Airliner",
      "Colour: Grey",
      "3-piece set: small, medium, large",
      "20\" x 24\" x 28\"",
      "25% expandable extra capacity",
      "8 spinner 360° wheels",
      "Lock security",
      "Polypropylene shell"
    ],
    "images": [
      "/products/airliner-3-piece-luggage-set-1718/1.jpg"
    ],
    "tags": [],
    "collections": [
      "the-travel-edit"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 2,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-1735mr",
    "slug": "ifly-ombre-2-piece-luggage-set-1735mr",
    "name": "iFly Ombre 2-Piece Luggage Set",
    "itemNo": "1735MR",
    "category": "luggage",
    "subcategory": "sets",
    "price": 698,
    "description": "A 2-piece iFly luggage set in Midnight Berry from the Fibre Tech Ombre Collection: lightweight and durable, with 360° double wheels and a 2\" expansion zipper. Item #1735MR.",
    "details": [
      "Brand: iFly",
      "Colour: Midnight Berry",
      "Collection: Fibre Tech Ombre",
      "2-piece set",
      "Lightweight, durable",
      "360° double wheels",
      "2\" expansion zipper",
      "30\" x 18.5\" x 13\""
    ],
    "images": [
      "/products/ifly-abs-3-piece-luggage-set-1735/1.jpg"
    ],
    "tags": [],
    "collections": [
      "new-in",
      "the-travel-edit"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 3,
    "addedAt": "2026-10-09"
  },
  {
    "id": "ntc-playstation-rolling-scho",
    "slug": "playstation-trolley-bag-psp-2532",
    "name": "PlayStation Trolley Bag",
    "itemNo": "PSP-2532",
    "category": "luggage",
    "subcategory": "backpacks",
    "price": 200,
    "description": "A black PlayStation trolley bag. Item #PSP-2532.",
    "details": [
      "Brand: PlayStation",
      "Colour: Black",
      "Trolley bag"
    ],
    "images": [
      "/products/playstation-rolling-school-backpack/1.jpg",
      "/products/playstation-rolling-school-backpack/2.jpg"
    ],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 12,
    "featured": 4,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-rolling-backpack-and-lun",
    "slug": "airliner-trolley-bag-6629-132jt",
    "name": "Airliner Trolley Bag",
    "itemNo": "6629-132JT",
    "category": "luggage",
    "subcategory": "backpacks",
    "price": 120,
    "description": "A black Airliner trolley bag. Item #6629-132JT.",
    "details": [
      "Brand: Airliner",
      "Colour: Black",
      "Trolley bag"
    ],
    "images": [
      "/products/rolling-backpack-and-lunch-bag-set/1.jpg",
      "/products/rolling-backpack-and-lunch-bag-set/2.jpg"
    ],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 12,
    "featured": 5,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-1735rs",
    "slug": "ifly-spectre-versus-3-piece-luggage-set-1735rs",
    "name": "iFly Spectre Versus 3-Piece Luggage Set",
    "itemNo": "1735RS",
    "category": "luggage",
    "subcategory": "sets",
    "price": 1250,
    "description": "A 3-piece iFly luggage set (small, medium, large) in Rose Gold from the Spectre Versus Collection: lightweight and durable, with 360° double wheels and a 2\" expansion zipper. Also sold as single pieces: Small $299, Medium $399, Large $599. Item #1735RS.",
    "details": [
      "Brand: iFly",
      "Colour: Rose Gold",
      "Collection: Spectre Versus",
      "3-piece set: small, medium, large",
      "Lightweight, durable",
      "360° double wheels",
      "2\" expansion zipper",
      "30\" x 18.5\" x 13\"",
      "Single pieces: Small $299, Medium $399, Large $599"
    ],
    "images": [
      "/products/ifly-abs-3-piece-luggage-set-1735/1.jpg"
    ],
    "tags": [],
    "collections": [
      "the-travel-edit"
    ],
    "inStock": true,
    "stock": 3,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-jt-9682",
    "slug": "jortan-solar-4g-security-camera-jt-9682",
    "name": "Jortan Solar 4G Security Camera",
    "itemNo": "JT-9682",
    "category": "electronics",
    "subcategory": "cameras",
    "price": 1200,
    "description": "A white Jortan outdoor, solar powered intelligent 4G AOV monitoring camera. Item #JT-9682.",
    "details": [
      "Brand: Jortan",
      "Model: 9682",
      "Colour: White",
      "Outdoor",
      "Solar powered",
      "4G AOV monitoring"
    ],
    "images": [
      "/products/jortan-solar-4g-security-camera-jt-9682/1.jpg"
    ],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 3,
    "featured": 1,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-jt-9680",
    "slug": "jortan-gun-ball-linkage-alarm-camera-jt-9680",
    "name": "Jortan Gun Ball Linkage Alarm Camera",
    "itemNo": "JT-9680",
    "category": "electronics",
    "subcategory": "cameras",
    "price": 700,
    "description": "A black Jortan gun ball linkage alarm camera with WiFi monitoring, HD picture, two-way voice and AI toolbox. Item #JT-9680.",
    "details": [
      "Brand: Jortan",
      "Model: 9680",
      "Colour: Black",
      "Gun ball linkage alarm",
      "WiFi monitoring",
      "HD picture",
      "Two-way voice",
      "AI toolbox"
    ],
    "images": [
      "/products/jortan-dual-lens-wifi-camera-jt-9680/1.jpg"
    ],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 3,
    "featured": 2,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-jortan-wifi-indoor-pan-t",
    "slug": "jortan-wifi-indoor-cradle-head-camera",
    "name": "Jortan WiFi Indoor Cradle Head Camera",
    "category": "electronics",
    "subcategory": "cameras",
    "price": 350,
    "description": "A white Jortan indoor, intelligent WiFi cradle head camera.",
    "details": [
      "Brand: Jortan",
      "Colour: White",
      "Indoor",
      "Intelligent WiFi cradle head"
    ],
    "images": [
      "/products/jortan-wifi-indoor-pan-tilt-camera/1.jpg"
    ],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 10,
    "featured": 3,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-dual-lens-wifi-outdoor-c",
    "slug": "gun-ball-linkage-security-camera-8293qj",
    "name": "Gun Ball Linkage Security Camera",
    "itemNo": "8293QJ",
    "category": "electronics",
    "subcategory": "cameras",
    "price": 500,
    "description": "A white gun ball linkage security camera. Item #8293QJ.",
    "details": [
      "Model: 8293QJ",
      "Colour: White",
      "Gun ball linkage"
    ],
    "images": [
      "/products/dual-lens-wifi-outdoor-camera/1.jpg"
    ],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 4,
    "featured": 4,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-c201",
    "slug": "xiaomi-smart-camera-c201",
    "name": "Xiaomi Smart Camera C201",
    "itemNo": "C201",
    "category": "electronics",
    "subcategory": "cameras",
    "price": 650,
    "description": "A white Xiaomi smart camera that works with Google Home and Alexa. Item #C201.",
    "details": [
      "Brand: Xiaomi",
      "Model: C201",
      "Colour: White",
      "Works with Google Home and Alexa"
    ],
    "images": [
      "/products/xiaomi-smart-camera-c201/1.jpg"
    ],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 6,
    "featured": 5,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-t22",
    "slug": "wiwu-t22-anc-wireless-earbuds",
    "name": "WIWU T22 ANC Wireless Earbuds",
    "itemNo": "T22",
    "category": "electronics",
    "subcategory": "audio",
    "price": 400,
    "description": "White WIWU wireless earbuds with ANC and pure bass. Item #T22.",
    "details": [
      "Brand: WIWU",
      "Model: T22",
      "Colour: White",
      "Active noise cancellation (ANC)",
      "Pure bass",
      "HF wireless"
    ],
    "images": [
      "/products/wiwu-t22-anc-earbuds/1.jpg"
    ],
    "tags": [],
    "collections": [
      "the-travel-edit"
    ],
    "inStock": true,
    "stock": 5,
    "featured": 6,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-qihang-30w-usb-c-fast-ch",
    "slug": "qihang-30w-usb-c-fast-charger",
    "name": "Qihang 30W USB-C Fast Charger",
    "category": "electronics",
    "subcategory": "chargers",
    "price": 200,
    "description": "A black Qihang 30W USB-C fast charger.",
    "details": [
      "Brand: Qihang",
      "Colour: Black",
      "30W fast charging",
      "USB-C"
    ],
    "images": [
      "/products/qihang-30w-usb-c-fast-charger/1.jpg"
    ],
    "tags": [],
    "collections": [
      "the-travel-edit"
    ],
    "inStock": true,
    "stock": 12,
    "featured": 7,
    "addedAt": "2026-10-01"
  },
  {
    "id": "ntc-awei",
    "slug": "awei-22-5w-dual-output-fast-charger-kit",
    "name": "Awei 22.5W Dual Output Fast Charger Kit",
    "category": "electronics",
    "subcategory": "chargers",
    "price": 175,
    "description": "A black Awei dual output fast charger kit, 22.5W.",
    "details": [
      "Brand: Awei",
      "Colour: Black",
      "Dual output",
      "22.5W fast charging"
    ],
    "images": [],
    "tags": [],
    "collections": [
      "the-travel-edit"
    ],
    "inStock": true,
    "stock": 11,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-powerbank",
    "slug": "essen-wiwu-10-000-mah-power-bank",
    "name": "Essen WIWU 10,000 mAh Power Bank",
    "category": "electronics",
    "subcategory": "power-banks",
    "price": 250,
    "description": "An Essen WIWU 10,000 mAh power bank in black/white.",
    "details": [
      "Brand: Essen, WIWU",
      "Colour: Black/White",
      "10,000 mAh"
    ],
    "images": [],
    "tags": [],
    "collections": [
      "the-travel-edit"
    ],
    "inStock": true,
    "stock": 9,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-dashcam",
    "slug": "lk-w9-5-channel-wifi-dash-cam",
    "name": "LK W9 5-Channel WiFi Dash Cam",
    "category": "electronics",
    "subcategory": "dash-cams",
    "price": 900,
    "description": "An LK W9 WiFi dash cam with 5 channels.",
    "details": [
      "Model: LK W9",
      "5 channel",
      "WiFi"
    ],
    "images": [],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 12,
    "featured": 50,
    "addedAt": "2026-10-12"
  },
  {
    "id": "ntc-jt-8292",
    "slug": "jortan-gun-ball-linkage-wifi-ip-camera-jt-8292",
    "name": "Jortan Gun Ball Linkage WiFi IP Camera",
    "itemNo": "JT-8292",
    "category": "electronics",
    "subcategory": "cameras",
    "price": 399,
    "description": "A white Jortan gun ball linkage WiFi IP security camera. Item #JT-8292.",
    "details": [
      "Brand: Jortan",
      "Model: 8292",
      "Colour: White",
      "Gun ball linkage",
      "WiFi IP security camera"
    ],
    "images": [],
    "tags": [],
    "collections": [],
    "inStock": true,
    "stock": 10,
    "featured": 50,
    "addedAt": "2026-10-12"
  }
];

/** The nine pieces on the home page, in order. */
export const ninePieces = [
  "clover-pendant-necklace-4383",
  "arena-milano-top-handle-bag-52930",
  "butterfly-stud-earrings-8105",
  "two-tone-embrace-pendant-necklace-4334",
  "evil-eye-charm-bracelet-2211",
  "gusto-quilted-handbag-gu-1659-cm",
  "moon-in-sun-pendant-necklace-4343",
  "gold-double-hoop-stud-earrings-11624",
  "pearl-pendant-necklace-4306"
];
