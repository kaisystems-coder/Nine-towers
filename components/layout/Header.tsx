'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { AnnouncementBar } from './AnnouncementBar';
import { MegaMenu, type MenuKey } from './MegaMenu';
import { Logo } from '@/components/ui/Logo';
import { Heart, Handbag, List, MagnifyingGlass } from '@/components/ui/icons';
import { mainNav } from '@/config/site';
import { heroHasMedia } from '@/data/media';
import { useCartCount } from '@/lib/cart-store';
import { useWishlist } from '@/lib/wishlist-store';
import { useUI } from '@/lib/ui-store';
import { cn } from '@/lib/cn';

function IconButton({
  label,
  onClick,
  href,
  children,
  className,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = cn(
    'group relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-fast ease-brand active:scale-95',
    className
  );
  if (href)
    return (
      <Link href={href} aria-label={label} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="tabular absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-obsidian px-1 font-sans text-[0.75rem] font-medium leading-none text-ivory ring-2 ring-ivory">
      {n}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const closeTimer = useRef<number>();

  const hydrated = useUI((s) => s.hydrated);
  const cartOpen = useUI((s) => s.cartOpen);
  const openCart = useUI((s) => s.openCart);
  const setSearch = useUI((s) => s.setSearch);
  const setMobileMenu = useUI((s) => s.setMenu);
  const count = useCartCount();
  const wishCount = useWishlist((s) => s.ids.length);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setAtTop(y < 24);
    if (y > 320 && y > prev + 6) setHidden(true);
    else if (y < prev - 6 || y < 320) setHidden(false);
  });

  // Close the mega menu on route change.
  useEffect(() => setMenu(null), [pathname]);

  const open = (key: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 140);
  };

  const transparent = isHome && atTop && !menu;
  const lightText = transparent && heroHasMedia;
  const isHidden = hidden && !menu && !cartOpen;
  const setHeaderHidden = useUI((s) => s.setHeaderHidden);
  useEffect(() => setHeaderHidden(isHidden), [isHidden, setHeaderHidden]);

  // Split navigation around the centred logo (balances both sides at every desktop width).
  const leftNav = mainNav.slice(0, 3);
  const rightNav = mainNav.slice(3);
  const renderNav = (items: readonly (typeof mainNav)[number][], label: string, ulClass: string) => (
    <nav
      aria-label={label}
      className="hidden xl:block"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null);
      }}
    >
      <ul className={cn('flex items-center', ulClass)}>
        {items.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li
              key={item.label}
              onMouseEnter={() => (item.menu ? open(item.menu) : setMenu(null))}
              onFocus={() => (item.menu ? open(item.menu) : setMenu(null))}
            >
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn('link-u label flex h-11 items-center px-[12px] xl:px-s', ((item.menu && menu === item.menu) || active) && 'is-underlined')}
              >
                {item.label}
              </Link>
              {item.menu && <MegaMenu menuKey={item.menu} open={menu === item.menu} onEnter={() => open(item.menu!)} onClose={() => setMenu(null)} />}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <header
      className={cn('site-header fixed inset-x-0 top-0 z-header', lightText ? 'text-ivory' : 'text-obsidian')}
      data-condensed={!atTop}
      data-hidden={isHidden}
      onMouseLeave={scheduleClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && menu) {
          setMenu(null);
        }
      }}
    >
      <AnnouncementBar />

      <div className="relative h-[var(--bar-h)]">
        {/* Solid surface: fades in once scrolled or when a menu is open */}
        <div
          aria-hidden="true"
          className={cn(
            'header-surface absolute inset-0 border-b border-obsidian/10 bg-ivory/90',
            transparent ? 'opacity-0' : 'opacity-100 backdrop-blur-md'
          )}
        />

        <div className="header-inner container-x relative grid h-full grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: desktop nav / mobile menu + search */}
          <div className="flex items-center">
            {renderNav(leftNav, 'Shop', '-ml-s')}
            <div className="-ml-[10px] flex items-center xl:hidden">
              <IconButton label="Open menu" onClick={() => setMobileMenu(true)}>
                <List size={24} weight="light" />
              </IconButton>
              <IconButton label="Search" onClick={() => setSearch(true)}>
                <MagnifyingGlass size={22} weight="light" />
              </IconButton>
            </div>
          </div>

          {/* Centre: logo with clearspace */}
          <Link
            href="/"
            aria-label="Nine Towers Collection, home"
            className="header-logo flex origin-center items-center justify-center px-s"
            onMouseEnter={() => setMenu(null)}
          >
            <Logo variant="compact" label={null} className="h-[38px] md:h-[56px]" />
          </Link>

          {/* Right: utilities */}
          <div className="-mr-[10px] flex items-center justify-end gap-0.5 md:gap-xs">
            {renderNav(rightNav, 'More', 'mr-xs')}
            <div className="contents" onMouseEnter={() => setMenu(null)}>
            <IconButton label="Search" onClick={() => setSearch(true)} className="hidden xl:inline-flex">
              <MagnifyingGlass size={22} weight="light" />
            </IconButton>
            <IconButton
              label={hydrated && wishCount ? `Wishlist, ${wishCount} saved` : 'Wishlist'}
              href="/wishlist"
              className="hidden xs:inline-flex"
            >
              <Heart size={22} weight="light" />
              {hydrated && <CountBadge n={wishCount} />}
            </IconButton>
            <IconButton
              label={hydrated && count ? `Bag, ${count} ${count === 1 ? 'item' : 'items'}` : 'Bag'}
              onClick={() => openCart()}
            >
              <Handbag size={23} weight="light" />
              {hydrated && <CountBadge n={count} />}
            </IconButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
