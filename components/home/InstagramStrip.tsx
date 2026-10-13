import { Media } from '@/components/ui/Media';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { InstagramLogo } from '@/components/ui/icons';
import { site } from '@/config/site';
import { media } from '@/data/media';
import { getCatalog } from '@/lib/products-store';
import { sortProducts } from '@/lib/catalog';
import { hasAsset } from '@/lib/assets';
import type { Category } from '@/data/types';

const icons: Category[] = ['jewellery', 'handbags', 'luggage', 'jewellery', 'handbags', 'jewellery'];

/** Shows Instagram photos from /public/media when present, otherwise product photos. */
export async function InstagramStrip() {
  const { all } = await getCatalog();
  const fallback = sortProducts(all.filter((p) => p.category === 'jewellery'), 'featured').map((p) => p.images[0]);
  return (
    <section aria-labelledby="ig-title" className="bg-ivory py-2xl">
      <div className="container-x flex flex-wrap items-end justify-between gap-s">
        <h2 id="ig-title" className="font-display text-d-m">
          Follow along
        </h2>
        <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="link-u is-underlined label">
          <InstagramLogo size={16} weight="light" aria-hidden="true" />
          {site.socials.instagramHandle}
        </a>
      </div>
      <RevealGroup as="ul" className="mt-l grid grid-cols-3 gap-xs px-gutter md:grid-cols-6 md:gap-s" stagger={0.05}>
        {media.instagram.map((src, i) => (
          <RevealItem as="li" key={src} index={i}>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram post ${i + 1} from ${site.socials.instagramHandle}`}
              className="group relative block aspect-square overflow-hidden rounded-xs"
            >
              <div className="absolute inset-0 transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.06]">
                <Media src={hasAsset(src) ? src : fallback[i]} alt="" sizes="(min-width: 768px) 16vw, 33vw" plate={{ icon: icons[i], seed: `ig-${i}`, shot: (i + 1) % 3 }} />
              </div>
              <span className="absolute inset-0 flex items-center justify-center bg-obsidian/40 text-ivory opacity-0 transition-opacity duration-base ease-brand group-hover:opacity-100 group-focus-visible:opacity-100">
                <InstagramLogo size={26} weight="light" aria-hidden="true" />
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
