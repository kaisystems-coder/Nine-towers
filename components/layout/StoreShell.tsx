import { Suspense, type ReactNode } from 'react';
import { CatalogProvider } from '@/components/catalog/CatalogProvider';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { Overlays } from './Overlays';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { PageTransition } from '@/components/motion/PageTransition';
import { Preloader } from '@/components/motion/Preloader';
import { loadProducts } from '@/lib/products-store';

/** Storefront chrome: header, footer, bag, search, motion layers, live catalogue. */
export async function StoreShell({ children }: { children: ReactNode }) {
  const products = await loadProducts();
  return (
    <CatalogProvider products={products}>
      <a
        href="#main"
        className="label fixed left-s top-s z-preloader -translate-y-[200%] rounded-s bg-obsidian px-m py-s text-ivory transition-transform duration-fast ease-brand focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="pt-[var(--header-h)] outline-none">
        {children}
      </main>
      <Suspense>
        <Footer />
      </Suspense>

      {/* Overlays hydrate separately so they don't lengthen the first task */}
      <Overlays />
      <Suspense>
        <FloatingWhatsApp />
      </Suspense>
      <PageTransition />
      <Preloader />
      <SmoothScroll />
      <div className="grain" aria-hidden="true" />
    </CatalogProvider>
  );
}
