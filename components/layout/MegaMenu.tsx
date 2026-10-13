'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { categories } from '@/data/categories';
import { useCatalog } from '@/components/catalog/CatalogProvider';
import type { Catalog } from '@/lib/catalog';
import { Media } from '@/components/ui/Media';
import { ArrowRight } from '@/components/ui/icons';
import { EASE } from '@/lib/motion';
import type { Category } from '@/data/types';

export type MenuKey = Category | 'collections';

function menuContent(key: MenuKey, catalog: Catalog) {
  if (key === 'collections') {
    const cols = catalog.collectionsWithStock();
    return {
      title: 'Collections',
      allHref: '/collections',
      allLabel: 'All collections',
      links: cols.map((c) => ({ label: c.title, href: `/collections/${c.slug}` })),
      tiles: cols.slice(0, 2).map((c) => ({ label: c.title, href: `/collections/${c.slug}`, image: c.cover, icon: c.plateIcon })),
    };
  }
  const cat = categories[key];
  const subs = catalog.subcategoriesWithStock(key);
  return {
    title: cat.title,
    allHref: `/shop/${cat.slug}`,
    allLabel: `Shop all ${cat.title.toLowerCase()}`,
    links: subs.map((s) => ({ label: s.label, href: `/shop/${cat.slug}?sub=${s.slug}` })),
    tiles: subs.slice(0, 2).map((s) => ({ label: s.label, href: `/shop/${cat.slug}?sub=${s.slug}`, image: s.cover, icon: cat.slug })),
  };
}

/**
 * Desktop mega menu. Rendered inside its nav item so Tab moves from the
 * category link straight into its panel; positioned to span the viewport.
 */
export function MegaMenu({
  menuKey,
  open,
  onEnter,
  onClose,
}: {
  menuKey: MenuKey;
  open: boolean;
  onEnter: () => void;
  onClose: () => void;
}) {
  const c = menuContent(menuKey, useCatalog());
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={menuKey}
          className="mega-panel absolute left-1/2 top-full z-mega w-screen"
          style={{ x: '-50%' }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE } }}
          transition={{ duration: 0.5, ease: EASE }}
          onMouseEnter={onEnter}
        >
          <div className="border-b border-obsidian/10 bg-ivory text-obsidian shadow-floating">
            <div className="container-x grid grid-cols-12 gap-l py-xl">
              <div className="col-span-4 flex flex-col">
                <motion.p
                  className="font-display text-d-s"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                >
                  {c.title}
                </motion.p>
                <ul className="mt-m flex flex-col">
                  {c.links.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.05 }}
                    >
                      <Link href={l.href} onClick={onClose} className="link-u py-xs text-body-l">
                        {l.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  className="mt-auto pt-l"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                >
                  <Link href={c.allHref} onClick={onClose} className="link-u is-underlined label">
                    {c.allLabel}
                    <ArrowRight size={14} weight="light" />
                  </Link>
                </motion.div>
              </div>
              <div className="col-span-8 grid grid-cols-2 gap-m">
                {c.tiles.map((t, i) => (
                  <motion.div
                    key={t.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.12 + i * 0.08 }}
                  >
                    <Link href={t.href} onClick={onClose} className="group block" data-cursor="View">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xs">
                        <div className="absolute inset-0 transition-transform duration-slower ease-brand group-hover:scale-[1.04]">
                          <Media src={t.image} alt="" sizes="30vw" plate={{ icon: t.icon as Category, seed: t.href, shot: i + 1 }} />
                        </div>
                      </div>
                      <p className="mt-s flex items-center justify-between">
                        <span className="label">{t.label}</span>
                        <ArrowRight
                          size={16}
                          weight="light"
                          className="-translate-x-1 opacity-0 transition-[transform,opacity] duration-base ease-brand group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
