import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-cream px-gutter py-xl">
      <div className="w-full max-w-[420px] rounded-m bg-ivory p-l shadow-floating sm:p-xl">
        <Link href="/" aria-label="Nine Towers Collection, back to the store" className="mx-auto block w-fit">
          <Logo variant="compact" className="h-12" />
        </Link>
        <h1 className="mt-l text-center font-display text-d-s">Store admin</h1>
        <p className="mt-xs text-center text-body-s text-stone">Add, edit and remove products, prices and stock.</p>
        <div className="mt-l">
          <LoginForm next={searchParams.next} />
        </div>
      </div>
      <Link href="/" className="link-u mt-l text-body-s text-stone">
        Back to the store
      </Link>
    </main>
  );
}
