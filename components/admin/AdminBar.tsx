import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ArrowUpRight } from '@/components/ui/icons';
import { logout } from '@/app/admin/actions';
import { storageMode } from '@/lib/products-store';

/** Top bar for every signed-in admin page. */
export function AdminBar() {
  const mode = storageMode();
  return (
    <header className="sticky top-0 z-header border-b border-obsidian/10 bg-ivory/95 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-s">
        <div className="flex min-w-0 items-center gap-m">
          <Link href="/admin" aria-label="Admin home" className="inline-flex min-h-11 shrink-0 items-center">
            <Logo variant="compact" label={null} className="h-9" />
          </Link>
          <span className="label hidden text-stone sm:inline">Store admin</span>
          <span
            className="hidden rounded-full border border-obsidian/15 px-s py-[4px] text-caption text-stone md:inline"
            title={mode === 'blob' ? 'Changes save to Vercel Blob and go live immediately.' : 'Changes save to data/products.json on this computer.'}
          >
            Saving to {mode === 'blob' ? 'Vercel Blob' : 'this computer'}
          </span>
        </div>
        <nav aria-label="Admin" className="flex items-center gap-xs">
          <Link href="/" target="_blank" className="label inline-flex min-h-11 items-center gap-[6px] px-xs hover:underline hover:underline-offset-4">
            View store <ArrowUpRight size={14} weight="light" aria-hidden="true" />
          </Link>
          <form action={logout}>
            <button type="submit" className="label inline-flex min-h-11 items-center px-xs text-stone hover:text-obsidian">
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
