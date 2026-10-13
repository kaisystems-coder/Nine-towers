import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { ButtonLink } from '@/components/ui/Button';
import { ImageReveal } from '@/components/motion/ImageReveal';
import { MaskText } from '@/components/motion/MaskText';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { media } from '@/data/media';
import { getCatalog } from '@/lib/products-store';
import { formatPrice, priceLabel } from '@/lib/format';
import { subcategoryLabel } from '@/data/categories';
import type { Product } from '@/data/types';

const PICKS = ['airliner-3-piece-luggage-set-1720rb', 'ifly-ombre-2-piece-luggage-set-1735mr', 'gusto-camera-bag-gu-1639-bg', 'wiwu-t22-anc-wireless-earbuds'];

/** Editorial split: the image holds still while the story scrolls past it. */
export async function TravelEdit() {
  const { getProduct, byCollection } = await getCatalog();
  const chosen = PICKS.map(getProduct).filter(Boolean) as Product[];
  // Fall back to the collection if any pick has been removed in the admin.
  const picks = [...chosen, ...byCollection('the-travel-edit').filter((p) => !chosen.includes(p))].slice(0, 4);
  return (
    <section aria-labelledby="travel-title" className="bg-cream">
      <div className="container-x grid gap-xl py-2xl md:grid-cols-12 md:gap-m md:py-0">
        {/* Pinned image */}
        <div className="md:col-span-6 md:py-3xl">
          <div className="md:sticky md:top-[calc(var(--bar-h)_-_var(--condense)_+_var(--space-l))]">
            <ImageReveal className="aspect-[4/5] rounded-xs md:aspect-auto md:h-[calc(100dvh_-_var(--bar-h)_+_var(--condense)_-_var(--space-l)_*_2)]">
              <Media
                src={media.travelEdit}
                alt="A Skyline carry-on and weekender packed for a trip to Tobago"
                sizes="(min-width: 768px) 50vw, 100vw"
                plate={{ icon: 'luggage', seed: 'travel-edit', shot: 1, tone: 'ivory' }}
              />
            </ImageReveal>
          </div>
        </div>

        {/* Scrolling story */}
        <div className="md:col-span-5 md:col-start-8 md:py-3xl">
          <div className="flex flex-col gap-xl md:min-h-[140vh] md:justify-between md:gap-2xl">
            <div>
              <Reveal>
                <p className="label text-stone">The Travel Edit</p>
              </Reveal>
              <MaskText
                as="h2"
                id="travel-title"
                lines={['Packed for', { text: 'somewhere warm.', italic: true }]}
                className="mt-s font-display text-d-l"
              />
              <Reveal delay={0.1}>
                <p className="mt-m max-w-[44ch] text-body-l text-stone">
                  A three-piece set for the whole family, a Gusto bag that keeps your passport close, and noise-cancelling earbuds for the flight.
                </p>
              </Reveal>
            </div>

            <RevealGroup as="ul" className="border-t border-obsidian/15">
              {picks.map((p, i) => (
                <RevealItem as="li" key={p.id} index={i} className="border-b border-obsidian/15">
                  <Link href={`/product/${p.slug}`} className="group flex min-h-[64px] items-center justify-between gap-m py-s">
                    <span className="flex flex-col">
                      <span className="font-display text-d-xs transition-transform duration-base ease-brand group-hover:translate-x-1">{p.name}</span>
                      <span className="text-caption text-stone">{subcategoryLabel(p.category, p.subcategory)}</span>
                    </span>
                    <span className="price shrink-0 text-stone">{priceLabel(p.price)}</span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal>
              <p className="max-w-[44ch] text-body text-stone">
                Airliner sets include small, medium and large cases (20″, 24″ and 28″) with 8 spinner 360° wheels and lock security. Islandwide delivery, so it arrives at your door before you leave.
              </p>
              <div className="mt-l">
                <ButtonLink href="/collections/the-travel-edit">Shop The Travel Edit</ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
