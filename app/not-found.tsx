import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { StoreShell } from '@/components/layout/StoreShell';

export default function NotFound() {
  return (
    <StoreShell>
    <section className="relative flex min-h-[calc(100dvh-var(--header-h))] items-center overflow-hidden bg-cream">
      <div className="container-x grid items-center gap-xl md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="label text-stone">Error 404</p>
          <h1 className="mt-s font-display text-d-xl">
            This page
            <br />
            <span className="display-italic">has moved on.</span>
          </h1>
          <p className="mt-m max-w-[44ch] text-body-l text-stone">The link may be old, or the piece may have sold out and left the collection. Everything else is right where you left it.</p>
          <div className="mt-l flex flex-wrap gap-s">
            <ButtonLink href="/shop">Continue shopping</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Back to home
            </ButtonLink>
          </div>
          <p className="mt-l text-body-s text-stone">
            Looking for something specific?{' '}
            <Link href="/contact" className="link-u is-underlined text-obsidian">
              Ask us
            </Link>
            .
          </p>
        </div>
        <div className="hidden justify-center md:col-span-4 md:col-start-9 md:flex" aria-hidden="true">
          <Logo variant="mark" label={null} className="h-[380px] text-obsidian/15" />
        </div>
      </div>
    </section>
    </StoreShell>
  );
}
