import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Media } from '@/components/ui/Media';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { MaskText } from '@/components/motion/MaskText';
import { ImageReveal } from '@/components/motion/ImageReveal';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { Skyline } from '@/components/home/Skyline';
import { media } from '@/data/media';

export const metadata: Metadata = {
  title: 'The Nine Towers',
  description: 'The story behind Nine Towers Collection: fashion jewellery, luggage and ladies’ handbags, chosen with care in Trinidad & Tobago.',
  alternates: { canonical: '/about' },
};

const principles = [
  { title: 'Chosen, not stocked', text: 'We bring in fewer pieces and choose each one ourselves. If we wouldn’t wear it or carry it, it doesn’t make the shelf.' },
  { title: 'Made to last a season, and the next', text: 'Stainless steel jewellery, luggage with lock security, bags with solid hardware. Details that keep a piece looking new.' },
  { title: 'A person on the other end', text: 'Every order is confirmed by us on WhatsApp. Ask about a colour, a size or a gift message and you’ll get a real answer.' },
];

export default function AboutPage() {
  return (
    <>
      <header className="relative overflow-hidden bg-cream">
        <div className="container-x relative pb-2xl pt-l md:pb-3xl">
          <Breadcrumbs items={[{ label: 'The Nine Towers' }]} />
          <div className="mt-xl grid gap-l md:mt-2xl md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <MaskText as="h1" lines={['The Nine', { text: 'Towers.', italic: true }]} className="font-display text-d-xl" />
              <Reveal delay={0.15}>
                <p className="mt-m max-w-[46ch] text-body-l text-stone">
                  A small boutique in Trinidad & Tobago for fashion jewellery, luggage and ladies’ handbags. Our name is a skyline: nine towers, each one standing for a piece worth keeping.
                </p>
              </Reveal>
            </div>
            <div className="hidden md:col-span-4 md:col-start-9 md:block" aria-hidden="true">
              <Skyline className="ml-auto h-[320px] text-obsidian/70" />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-ivory py-2xl md:py-3xl">
        <div className="container-x grid gap-xl md:grid-cols-12 md:items-center md:gap-m">
          <ImageReveal className="aspect-[4/5] rounded-xs md:col-span-6">
            <Media src={media.aboutDetail} alt="Pieces from the Nine Towers Collection laid out in warm daylight" sizes="(min-width: 768px) 50vw, 100vw" plate={{ icon: 'handbags', seed: 'about', shot: 1 }} />
          </ImageReveal>
          <div className="md:col-span-5 md:col-start-8">
            <MaskText as="h2" lines={['Fewer pieces,', { text: 'chosen with care.', italic: true }]} className="font-display text-d-l" />
            <Reveal delay={0.1}>
              <p className="mt-m text-body text-stone">
                Nine Towers began with a simple frustration: the things we carry every day, our bags, our luggage, the jewellery we reach for first, were either beautiful and out of reach, or easy to buy and quick to fade.
              </p>
              <p className="mt-s text-body text-stone">
                So we built a shorter list. Jewellery that holds its shine, structured bags in colours that go with everything, luggage sets for the whole family, and a few pieces of tech worth having. Each one chosen by hand and delivered across both islands.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-label="What we stand for" className="on-dark bg-obsidian py-2xl text-ivory md:py-3xl">
        <RevealGroup as="ul" className="container-x grid gap-xl md:grid-cols-3 md:gap-l" stagger={0.1}>
          {principles.map((p) => (
            <RevealItem as="li" key={p.title} className="border-t border-ivory/20 pt-m">
              <h3 className="font-display text-d-xs">{p.title}</h3>
              <p className="mt-s text-body text-mist">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="relative overflow-hidden bg-cream">
        <Parallax amount={50} className="absolute inset-0">
          <Media src={media.aboutHero} alt="" sizes="100vw" plate={{ seed: 'about-wide', shot: 2, tone: 'cream' }} />
        </Parallax>
        <div className="container-x relative flex flex-col items-center py-2xl text-center md:py-3xl">
          <Logo variant="full" className="w-[min(70%,320px)]" />
          <Reveal>
            <p className="mx-auto mt-l max-w-[40ch] text-body-l text-stone">Curated. Timeless. Delivered across Trinidad & Tobago.</p>
            <div className="mt-l">
              <ButtonLink href="/shop">Shop the boutique</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
