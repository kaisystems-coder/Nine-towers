import Link from 'next/link';
import { site } from '@/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { cn } from '@/lib/cn';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = 'dark', className }: { items: Crumb[]; tone?: 'dark' | 'light'; className?: string }) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex flex-wrap items-center gap-x-xs text-caption', tone === 'light' ? 'text-ivory/80' : 'text-stone')}>
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-x-xs">
              {c.href && !last ? (
                <Link href={c.href} className={cn('link-u py-[6px]', tone === 'light' ? 'hover:text-ivory' : 'hover:text-obsidian')}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={tone === 'light' ? 'text-ivory' : 'text-obsidian'}>
                  {c.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${site.url}${c.href}` } : {}),
          })),
        }}
      />
    </nav>
  );
}
