import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Skyline } from './Skyline';
import { media, heroHasMedia } from '@/data/media';
import { hasAsset, BLUR_DATA_URL } from '@/lib/assets';
import { cn } from '@/lib/cn';

/**
 * Full-viewport hero. With photography: video (or poster) settling from 1.1
 * to 1 under a scrim, ivory type. Without: the nine-tower skyline on cream.
 * Headline lines rise from behind a mask (CSS, so it can never get stuck).
 */
export function Hero() {
  const video = hasAsset(media.heroVideo);
  const poster = hasAsset(media.heroPoster) ? media.heroPoster : undefined;
  const dark = heroHasMedia;

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        'relative -mt-[var(--header-h)] flex min-h-[100dvh] flex-col overflow-hidden',
        dark ? 'on-dark bg-obsidian text-ivory' : 'bg-cream text-obsidian'
      )}
    >
      {/* Media */}
      <div className="intro-settle absolute inset-0">
        {video ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden="true"
          >
            <source src={media.heroVideo} type="video/mp4" />
          </video>
        ) : poster ? (
          <Image src={poster} alt="" fill priority sizes="100vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 78% 30%, rgb(var(--c-ivory) / 0.7), rgb(var(--c-ivory) / 0) 70%), radial-gradient(60% 50% at 10% 100%, rgb(var(--c-cream-deep) / 0.85), rgb(var(--c-cream-deep) / 0) 70%)',
            }}
          />
        )}
        {dark && (
          <>
            <div className="absolute inset-0 bg-cream/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-obsidian/20 to-obsidian/30" />
          </>
        )}
      </div>

      {/* Skyline, desktop (no-photo state) */}
      {!dark && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[var(--header-h)] hidden md:block">
          <div className="container-x relative h-full">
            <Skyline className="absolute bottom-0 right-gutter h-[78%] text-obsidian/80 lg:right-[calc(var(--gutter)+4%)]" />
          </div>
        </div>
      )}

      {/* Copy */}
      <div className="container-x relative flex flex-1 flex-col pt-[var(--header-h)] md:justify-end md:pt-[calc(var(--header-h)+40px)]">
        {/* Skyline, mobile: in flow, standing on a horizon line above the copy */}
        {!dark && (
          <div className="pointer-events-none relative min-h-[180px] flex-1 md:hidden" aria-hidden="true">
            <Skyline className="absolute bottom-0 right-0 h-[88%] max-h-[340px] text-obsidian/80" />
            <div className="intro-fade absolute -inset-x-gutter bottom-0 h-px bg-obsidian/25" style={{ ['--d' as string]: '0.2s' }} />
          </div>
        )}
        <div className="max-w-[720px] pb-xl pt-l md:pb-2xl md:pt-0">
          <p className="intro-fade label" style={{ ['--d' as string]: '0.05s' }}>
            Fashion Jewellery <span aria-hidden="true">·</span> Luggage <span aria-hidden="true">·</span> Ladies’ Handbags
          </p>
          <h1 id="hero-title" className="mt-s font-display text-d-xl md:mt-m">
            <span className="intro-line" style={{ ['--i' as string]: 0 }}>
              <span>The art</span>
            </span>
            <span className="intro-line" style={{ ['--i' as string]: 1 }}>
              <span className="display-italic">of arriving.</span>
            </span>
          </h1>
          <p
            className={cn('mt-m max-w-[44ch] text-body md:text-body-l', dark ? 'text-ivory/90' : 'text-stone')}
          >
            Fashion jewellery, luggage and handbags, chosen with care in Trinidad & Tobago. Order in a WhatsApp message, delivered islandwide.
          </p>
          <div className="intro-fade mt-l flex flex-col gap-s sm:flex-row sm:flex-wrap sm:items-center" style={{ ['--d' as string]: '0.6s' }}>
            <MagneticButton className="w-full sm:w-auto">
              <ButtonLink href="/collections/new-in" variant={dark ? 'ghost-light' : 'primary'} className="w-full sm:w-auto">
                Shop New In
              </ButtonLink>
            </MagneticButton>
            <ButtonLink href="/collections" variant={dark ? 'ghost-light' : 'outline'} className="w-full sm:w-auto">
              Explore Collections
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="intro-fade absolute bottom-xl right-gutter hidden flex-col items-center gap-s md:flex"
        style={{ ['--d' as string]: '0.9s' }}
        aria-hidden="true"
      >
        <span className="label [writing-mode:vertical-rl]">Scroll</span>
        <span className={cn('relative block h-16 w-px overflow-hidden', dark ? 'bg-ivory/30' : 'bg-obsidian/20')}>
          <span className={cn('scroll-cue absolute inset-x-0 top-0 h-1/2', dark ? 'bg-ivory' : 'bg-obsidian')} />
        </span>
      </div>
    </section>
  );
}
