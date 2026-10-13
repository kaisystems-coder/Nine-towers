import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Store admin', template: '%s | Nine Towers admin' },
  robots: { index: false, follow: false },
};

/** The admin has its own plain shell: no storefront header, motion or chat button. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-ivory text-obsidian">{children}</div>;
}
