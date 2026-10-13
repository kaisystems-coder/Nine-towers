import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/shop/PageHeader';
import { Media } from '@/components/ui/Media';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { hasAsset } from '@/lib/assets';
import { getCatalog } from '@/lib/products-store';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated edits from Nine Towers Collection: New In, The Travel Edit, Evening and Gifts Under $500.',
  alternates: { canonical: '/collections' },
};

export default async function CollectionsPage() {
  const { collectionsWithStock } = await getCatalog();
  const cols = collectionsWithStock();
  return (
    <>
      <PageHeader
        title="Collections"
        italic="edited for the occasion."
        intro="Short edits, each one chosen for a moment: a new arrival, a departure, an evening out."
        crumbs={[{ label: 'Collections' }]}
      />
      <section className="bg-ivory py-2xl md:py-3xl">
        <RevealGroup as="ul" className="container-x grid gap-x-m gap-y-xl md:grid-cols-2" stagger={0.1}>
          {cols.map((c, i) => (
            <RevealItem as="li" key={c.slug} index={i} className={cn(i % 2 === 1 && 'md:mt-2xl')}>
              <Link href={`/collections/${c.slug}`} className="group block" data-cursor="View">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xs">
                  <div className="absolute inset-0 transition-transform duration-[1600ms] ease-brand group-hover:scale-[1.05]">
                    <Media src={hasAsset(c.image) ? c.image : c.cover} alt="" sizes="(min-width: 768px) 50vw, 100vw" plate={{ icon: c.plateIcon, seed: c.slug, shot: 1 }} />
                  </div>
                </div>
                <div className="mt-m flex items-end justify-between gap-m">
                  <div>
                    <p className="label text-stone">{c.kicker}</p>
                    <h2 className="mt-xs font-display text-d-m transition-transform duration-base ease-brand group-hover:translate-x-1">{c.title}</h2>
                  </div>
                  <p className="tabular shrink-0 text-body-s text-stone">{c.count} {c.count === 1 ? 'piece' : 'pieces'}</p>
                </div>
                <p className="mt-s max-w-[48ch] text-body text-stone">{c.intro}</p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
