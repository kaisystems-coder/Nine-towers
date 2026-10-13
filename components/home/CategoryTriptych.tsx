import Link from 'next/link';
import { categoryList } from '@/data/categories';
import { Media } from '@/components/ui/Media';
import { Parallax } from '@/components/motion/Parallax';
import { MaskText } from '@/components/motion/MaskText';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { hasAsset } from '@/lib/assets';
import { getCatalog } from '@/lib/products-store';
import { cn } from '@/lib/cn';

const verbs = { jewellery: 'Wear it', handbags: 'Carry it', luggage: 'Take it further' } as const;
const order = ['jewellery', 'handbags', 'luggage'] as const;

/** Three tall category tiles, offset like a skyline, each with its own drift. */
export async function CategoryTriptych() {
  const catalog = await getCatalog();
  const cats = order.map((s) => categoryList.find((c) => c.slug === s)!);
  return (
    <section aria-labelledby="triptych-title" className="bg-ivory py-2xl md:py-3xl">
      <div className="container-x">
        <div className="grid gap-m md:grid-cols-12 md:items-end">
          <MaskText
            as="h2"
            lines={['Wear it. Carry it.', { text: 'Take it further.', italic: true }]}
            className="font-display text-d-l md:col-span-7"
          />
          <p className="max-w-[40ch] text-body text-stone md:col-span-4 md:col-start-9">
            Three collections, one point of view: fewer pieces, chosen well, that work with everything you already own.
          </p>
        </div>

        <RevealGroup as="ul" className="mt-xl grid gap-m md:mt-2xl md:grid-cols-3 md:gap-m" stagger={0.12}>
          {cats.map((c, i) => {
            const image = hasAsset(c.image) ? c.image : catalog.categoryCover(c.slug);
            const photo = hasAsset(image);
            return (
              <RevealItem as="li" key={c.slug} index={i} y={40} className={cn(i === 1 && 'md:mt-xl', i === 2 && 'md:mt-[calc(var(--space-xl)/2)]')}>
                <Link href={`/shop/${c.slug}`} className="group block" data-cursor="View">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xs md:aspect-tall">
                    <Parallax amount={36} className="absolute inset-0">
                      {/* Luggage photos are supplier spec sheets: show them whole on white rather than cropped */}
                      <div className={cn('absolute inset-0 transition-transform duration-[1600ms] ease-brand group-hover:scale-[1.06]', c.slug === 'luggage' && 'bg-white')}>
                        <Media src={image} alt={`${c.title} at Nine Towers Collection`} sizes="(min-width: 768px) 33vw, 100vw" className={c.slug === 'luggage' ? 'object-contain' : undefined} overlay plate={{ icon: c.slug, seed: c.slug, shot: 1, tone: 'cream' }} />
                      </div>
                    </Parallax>
                    <div className={cn('absolute inset-x-0 bottom-0 p-m md:p-l', photo ? 'text-ivory' : 'text-obsidian')}>
                      <div className="overflow-hidden">
                        <p className="label transition-transform duration-base ease-brand hover-fine:translate-y-full hover-fine:group-hover:translate-y-0">
                          {verbs[c.slug as keyof typeof verbs]}
                        </p>
                      </div>
                      <h3 className="mt-xs font-display text-d-s transition-transform duration-slow ease-brand hover-fine:translate-y-2 hover-fine:group-hover:translate-y-0">
                        {c.title}
                      </h3>
                      <p className="label mt-s flex items-center gap-xs transition-[transform,opacity] duration-base ease-brand hover-fine:translate-y-2 hover-fine:opacity-0 hover-fine:group-hover:translate-y-0 hover-fine:group-hover:opacity-100">
                        Explore <span aria-hidden="true">→</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
