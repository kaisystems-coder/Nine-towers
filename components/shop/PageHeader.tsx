import { Media } from '@/components/ui/Media';
import { Parallax } from '@/components/motion/Parallax';
import { MaskText } from '@/components/motion/MaskText';
import { Reveal } from '@/components/motion/Reveal';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { hasAsset } from '@/lib/assets';
import { cn } from '@/lib/cn';
import type { Category } from '@/data/types';

/**
 * Editorial header for category and collection pages: large title, short
 * intro, and a background image with a slow drift.
 */
export function PageHeader({
  title,
  italic,
  kicker,
  intro,
  image,
  icon,
  crumbs,
}: {
  title: string;
  italic?: string;
  kicker?: string;
  intro: string;
  image?: string;
  icon?: Category;
  crumbs: Crumb[];
}) {
  const photo = hasAsset(image);
  return (
    <header className={cn('relative overflow-hidden', photo ? 'on-dark bg-obsidian text-ivory' : 'bg-cream text-obsidian')}>
      {image && (
        <Parallax amount={60} className="absolute inset-0">
          <Media src={image} alt="" sizes="100vw" priority overlay plate={{ icon, seed: title, shot: 2, tone: 'cream', iconClassName: 'opacity-[0.12]' }} />
        </Parallax>
      )}
      <div className="container-x relative pb-xl pt-l md:pb-2xl md:pt-xl">
        <Breadcrumbs items={crumbs} tone={photo ? 'light' : 'dark'} />
        <div className="mt-xl grid gap-m md:mt-2xl md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            {kicker && (
              <Reveal>
                <p className={cn('label', photo ? 'text-ivory/80' : 'text-stone')}>{kicker}</p>
              </Reveal>
            )}
            <MaskText
              as="h1"
              lines={italic ? [title, { text: italic, italic: true }] : [title]}
              className="mt-s font-display text-d-xl"
            />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.15}>
            <p className={cn('max-w-[42ch] text-body-l', photo ? 'text-ivory/90' : 'text-stone')}>{intro}</p>
          </Reveal>
        </div>
      </div>
    </header>
  );
}
