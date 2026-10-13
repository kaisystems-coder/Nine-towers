import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { ImageReveal } from '@/components/motion/ImageReveal';
import { MaskText } from '@/components/motion/MaskText';
import { Reveal } from '@/components/motion/Reveal';
import { media } from '@/data/media';
import { getCatalog } from '@/lib/products-store';
import { cn } from '@/lib/cn';
import { hasAsset } from '@/lib/assets';
import type { Product } from '@/data/types';

const tiles = [
  { slug: 'pearl-pendant-necklace-4306', aspect: 'aspect-[4/5]', tone: 'deep' },
  { slug: 'double-heart-stud-earrings-1616', aspect: 'aspect-square', tone: 'cream' },
  { slug: 'moon-in-sun-pendant-necklace-4343', aspect: 'aspect-[4/5]', tone: 'deep' },
  { slug: 'black-clover-stud-earrings-1614', aspect: 'aspect-square', tone: 'cream' },
  { slug: 'evil-eye-charm-bracelet-2211', aspect: 'aspect-[4/3]', tone: 'deep' },
] as const;

function Tile({ i, p }: { i: number; p: Product }) {
  const t = tiles[i];
  return (
    <Link href={`/product/${p.slug}`} className="group block" data-cursor="View">
      <ImageReveal className={cn('rounded-xs', t.aspect)} delay={(i % 3) * 0.08}>
        <div className="absolute inset-0 transition-transform duration-[1600ms] ease-brand group-hover:scale-[1.05]">
          <Media
            src={hasAsset(media.spotlight[i]) ? media.spotlight[i] : p.images[0]}
            alt={`${p.name}, close up`}
            sizes="(min-width: 768px) 40vw, 100vw"
            plate={{ icon: 'jewellery', seed: p.slug, shot: 2, tone: t.tone }}
          />
        </div>
      </ImageReveal>
      <p className="mt-xs flex items-center justify-between gap-s">
        <span className="label">{p.name}</span>
        <span aria-hidden="true" className="text-stone transition-transform duration-base ease-brand group-hover:translate-x-1">
          →
        </span>
      </p>
    </Link>
  );
}

/** Macro close-ups in a broken masonry grid; each wipes in on entry. */
export async function JewellerySpotlight() {
  const { getProduct, byCategory } = await getCatalog();
  const jewellery = byCategory('jewellery');
  // Use the chosen pieces; fill any removed in the admin from the jewellery list.
  const chosen = tiles.map((t) => getProduct(t.slug));
  const spare = jewellery.filter((p) => !chosen.includes(p));
  const items = chosen.map((p) => p ?? spare.shift()) as Product[];
  if (items.some((p) => !p)) return null;
  return (
    <section aria-labelledby="spotlight-title" className="bg-ivory py-2xl md:py-3xl">
      <div className="container-x">
        <div className="grid gap-m md:grid-cols-12 md:items-end">
          <MaskText as="h2" id="spotlight-title" lines={['Up close,', { text: 'every detail counts.', italic: true }]} className="font-display text-d-l md:col-span-7" />
          <Reveal className="md:col-span-4 md:col-start-9">
            <p className="max-w-[40ch] text-body text-stone">
              Stainless steel in gold and silver tones, crystal pavé, pearls and glossy enamel. Pieces chosen to wear every day and to give.
            </p>
            <Link href="/shop/jewellery" className="link-u is-underlined label mt-m">
              Shop jewellery
            </Link>
          </Reveal>
        </div>

        <ul className="mt-xl grid grid-cols-1 gap-l md:mt-2xl md:grid-cols-12 md:gap-m">
          <li className="md:col-span-5">
            <Tile i={0} p={items[0]} />
          </li>
          <li className="grid grid-cols-2 gap-s md:col-span-3 md:mt-2xl md:grid-cols-1 md:gap-m">
            <Tile i={1} p={items[1]} />
            <Tile i={3} p={items[3]} />
          </li>
          <li className="md:col-span-4 md:mt-xl">
            <Tile i={2} p={items[2]} />
          </li>
          <li className="md:col-span-7 md:col-start-6">
            <Tile i={4} p={items[4]} />
          </li>
        </ul>
      </div>
    </section>
  );
}
