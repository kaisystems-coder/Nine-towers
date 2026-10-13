import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { LoginForm } from '@/components/admin/LoginForm';
import { adminConfigured } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const configured = adminConfigured();
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-cream px-gutter py-xl">
      <div className="w-full max-w-[420px] rounded-m bg-ivory p-l shadow-floating sm:p-xl">
        <Link href="/" aria-label="Nine Towers Collection, back to the store" className="mx-auto block w-fit">
          <Logo variant="compact" className="h-12" />
        </Link>
        <h1 className="mt-l text-center font-display text-d-s">Store admin</h1>
        <p className="mt-xs text-center text-body-s text-stone">Add, edit and remove products, prices and stock.</p>
        <div className="mt-l">
          {configured ? (
            <LoginForm next={searchParams.next} />
          ) : (
            <div role="alert" className="rounded-s border border-obsidian/15 bg-cream/50 p-m text-body-s">
              <p className="font-medium">The admin isn’t switched on yet.</p>
              <p className="mt-xs text-stone">
                Set <code className="rounded-xs bg-cream px-[4px]">ADMIN_PASSWORD</code> in <code className="rounded-xs bg-cream px-[4px]">.env.local</code> (and in Vercel’s
                environment variables), then restart the site.
              </p>
            </div>
          )}
        </div>
      </div>
      <Link href="/" className="link-u mt-l text-body-s text-stone">
        Back to the store
      </Link>
    </main>
  );
}
