import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MaskText } from '@/components/motion/MaskText';
import { Reveal } from '@/components/motion/Reveal';

/** Simple editorial text page for policies and help content. */
export function TextPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="bg-ivory pb-3xl">
      <header className="bg-cream">
        <div className="container-x pb-xl pt-l md:pb-2xl">
          <Breadcrumbs items={[{ label: title }]} />
          <MaskText as="h1" lines={[title]} className="mt-xl font-display text-d-l" />
          {intro && (
            <Reveal delay={0.1}>
              <p className="mt-m max-w-[56ch] text-body-l text-stone">{intro}</p>
            </Reveal>
          )}
        </div>
      </header>
      <div className="container-x">
        <div className="prose-ntc mx-auto max-w-[68ch] pt-xl md:pt-2xl">
          {children}
          {updated && <p className="mt-xl text-caption text-stone">Last updated {updated}.</p>}
        </div>
      </div>
    </article>
  );
}
