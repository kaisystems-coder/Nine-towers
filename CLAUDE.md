# Nine Towers Collection — how to edit this site

A Next.js 14 storefront for Nine Towers Collection (fashion jewellery, luggage and
ladies' handbags, Trinidad & Tobago). Checkout sends the order as a WhatsApp
message; there are no online payments. Products, prices, stock and photos are
managed in the **admin at `/admin`**; everything else lives in a handful of plain files.

## Run it

- Install once: `npm install`
- Dev server (port **5500**). The folder path has spaces, so on Windows run Next
  through node in PowerShell:
  `node node_modules\next\dist\bin\next dev -p 5500`
  then open http://localhost:5500
- Production check: stop the dev server first, then
  `node scripts/scan-assets.mjs; node node_modules\next\dist\bin\next build`
- Never commit or push unless asked. Vercel deploys automatically from GitHub.

## Change the WhatsApp number, delivery threshold or socials

All in **`config/site.ts`**:
- `whatsappNumber`: digits only, with country code. Live number: `18682595393`
- `whatsappDisplay`: how the number is shown: `+1 (868) 259-5393`
- `freeDeliveryThreshold`: in TTD (drives the progress bar and copy everywhere)
- `socials`, `announcements` (the scrolling top bar), `deliveryAreas`
  (checkout dropdown), `pickupNote`, `popularSearches`

## Admin: add, edit or remove products, prices and stock

Sign in at **`/admin`** (there's no link to it on the store). From there you can add
products, edit names, descriptions, details, prices, sale ("was") prices, badges,
collections, colours/sizes with their own stock counts, upload and reorder photos,
change stock straight from the product list, and delete products. Saves go live
immediately; anything at 0 stock shows as sold out, and 3 or fewer shows "Only N left".

Set-up:
- **Password:** `ADMIN_PASSWORD` in `.env.local` (a random one was generated for local
  use) and in Vercel → Settings → Environment Variables. Optionally set
  `ADMIN_SESSION_SECRET` to a long random string. Sessions last 12 hours; five
  wrong passwords lock that address out for 10 minutes.
- **Where saves go:**
  - Locally: `data/products.json` and photos in `data/uploads/`. Commit both to
    publish local edits.
  - On Vercel: connect a **Blob** store (Vercel → Storage → Create → Blob → connect
    to this project). That adds `BLOB_READ_WRITE_TOKEN`, and the admin then saves
    the catalogue and photos there. Each save keeps a dated copy (last 20) as backups.
    Without Blob, the live admin can sign in but can't save.
- Until the first save, the store shows the starter catalogue in `data/products.ts`.
- If you edit `data/products.json` by hand, restart the server so the store picks it up
  (admin saves refresh everything automatically).

The admin code: `app/admin/` (pages and server actions), `components/admin/`,
`lib/products-store.ts` (storage), `lib/auth.ts` + `middleware.ts` (sign-in),
`lib/admin-schema.ts` (validation).

## Product data reference

The catalogue (70 products) comes from the client's inventory sheet
`All products Oct 12, 2026 - revised.xlsx` (**Inventory** tab: 87 rows, 423 units),
matched to the supplied product photos. It lives in `data/products.ts` until the
admin's first save. Key points:
- **Only the sheet's data is used**: price = *TTD Unit Selling Price*, stock =
  *Quantity*, and descriptions/details are written only from the sheet's
  *Colour (Band, Details)* column (plus brand/size/notes columns). Colour rows of
  one item number are one product with colour options (e.g. 8105 ×6, 52930 ×4).
- 1735MR (2-pc, $698) and 1735RS (3-pc, $1,250) are separate products because
  their prices differ; they share the one catalogue photo.
- Every product has a photo. The last 8 (7929 and 4324-95 earrings, the two
  5000 bracelets, Awei charger, WIWU power bank, LK dash cam, Jortan JT-8292)
  were supplied 2026-10-20 and fitted to 4:5 on their own white ground.
- **`itemNo`** is the sheet's product code (shown on the product page, searchable,
  in every WhatsApp order line). The pearl necklace is listed as **4306** in the
  sheet although its photo card reads 4324-95; the sheet's 4324-95 is a silver
  earring.
- Gifts Under $500 = jewellery and handbags priced under TT$500.
- Categories: Jewellery, Handbags, Luggage (sets and trolley bags) and **Tech**
  (slug `electronics`: cameras, dash cam, earbuds, chargers, power bank). Types
  with no products are hidden from menus and filters.

Each product has: `name`, `itemNo`, `slug`, `category`, `subcategory`, `price`
(TTD, 0 = on request), optional `compareAtPrice`, `description`, `details`, optional
`care`, `images`, one optional set of colour or size `variants` (each option with
`stock`, optional `swatch` and `image`), `tags`, `collections`, `featured` (lower
shows first) and `addedAt`.

The nine pieces on the home page are the slugs in `ninePieces` in `data/products.ts`.

## Swap or add photos

Supplied photos were fitted to the site's 4:5 frame without cropping (studio shots
padded with their own background colour, lifestyle shots with a soft blurred edge)
and saved as `public/products/<slug>/1.jpg …`.

Easiest for new ones: upload them on the product's page in the admin (first = main, second =
hover). They're resized automatically. Alternatively drop files at
**`public/products/<slug>/1.jpg`, `2.jpg`, `3.jpg`** (1 = main, 2 = hover/second shot,
3+ = gallery). Portrait 4:5, at least 1600px tall.

Editorial photos have fixed paths listed in **`data/media.ts`** (hero video and
poster, Travel Edit, jewellery close-ups, Instagram tiles, about page) and in
`data/categories.ts` / `data/collections.ts` (category and collection images).

Until a file exists, a neutral cream "plate" with the brand's line drawing shows
in its place. After adding photos, restart the dev server or run
`node scripts/scan-assets.mjs` so the site notices them. Adding `public/media/hero.mp4`
(or `hero-poster.jpg`) switches the home hero from the skyline drawing to
full-screen video with ivory type.

## Add a collection

Add a block to **`data/collections.ts`** (`slug`, `title`, `kicker`, `intro`,
`image`, `plateIcon`), then add that slug to the `collections` list of each product
that belongs in it. The page appears at `/collections/<slug>` automatically.

## Brand colours, fonts and spacing

From the Nine Towers Brand Guidelines. Change them in ONE place:
**`app/globals.css`** (the `:root` block at the top). `tailwind.config.ts` maps those
variables to class names; nothing else hard-codes a colour.
- Obsidian `#0B0B0B` (type, CTAs), Warm Cream `#DFD7CA` (brand canvas),
  Soft Ivory `#F7F3EC` (cards/sections), Champagne `#B9A47C` (accent only)
- Display font: Libre Bodoni (set in `app/layout.tsx`; swapped from Bodoni Moda
  2026-10-20 because its hairlines were hard to read). Utility font: Lato 2.0,
  self-hosted in `app/fonts/` so prices can use true Lato Medium.
- Spacing: 8 / 16 / 24 / 40 / 64px (`xs s m l xl`) plus 96 / 128 / 160 for sections.
- `config/theme.ts` repeats the hex values for places CSS can't reach (social share
  image, browser theme colour). Keep it in sync with `globals.css`.
- Logo files: `public/brand/` (`logo.svg` full lockup, `logo-compact.svg` header,
  `logo-mark.svg` tower). They are traced vectors of the supplied logo and take
  their colour from the surrounding text colour.

## Forms

Newsletter sign-up and contact form post to Web3Forms. Put the access key in
`.env.local` as `NEXT_PUBLIC_WEB3FORMS_KEY=...` (and in Vercel's environment
variables). Without it, the forms tell visitors to use WhatsApp instead.

## Where things are

- `app/` routes · `components/home|shop|product|pdp|cart|layout|motion|ui`
- `lib/whatsapp.ts` builds the order message · `lib/cart-store.ts` the bag
- `components/motion/` holds the shared animation pieces. Reveals are additive:
  content renders visible and only animates if it starts below the fold, so
  nothing can get stuck invisible. Keep that rule when adding motion.

---

# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `impeccable` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `Design Motion Principles` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `UI/UX Pro Max` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `Review Animations` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `Design Taste Frontend v1` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `design-dna` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `artifact-design` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `framer-motion` skill** before writing any React/Next.js animation, no exceptions.
- **Invoke the relevant GSAP skill before writing any GSAP animation — gsap-core (tweens, easing, stagger), gsap-timeline (sequencing), gsap-scrolltrigger (scroll-driven, pinning, parallax), gsap-plugins (Flip, Draggable, SplitText, etc.), gsap-react (React/Next.js), gsap-frameworks (Vue/Svelte), gsap-utils (helpers), gsap-performance (optimization).
- **Invoke the relevant Three.js skill before writing any Three.js/WebGL code — threejs-fundamentals (scene/camera/renderer), threejs-geometry, threejs-materials, threejs-textures, threejs-lighting, threejs-loaders, threejs-animation, threejs-shaders, threejs-postprocessing, threejs-interaction.
## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in thereference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Deployment Workflow
- All website changes are tested on localhost first. **Never commit or push to GitHub unless the user explicitly says to.**
- The deployment pipeline is: local dev → GitHub commit/push (on user's instruction) → Vercel auto-deploys from GitHub.
- Do not run `git commit`, `git push`, or any GitHub-related command during a normal editing session. Wait for explicit instruction.

## Removed on purpose (2026-10-21, client request)

No store email is shown anywhere, there is no gift wrapping offer and no
"10% off your first order" welcome popup. Don't add these back without the
client asking.
