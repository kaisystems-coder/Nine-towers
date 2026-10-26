import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { site } from '@/config/site';
import { brand } from '@/config/theme';
import { Providers } from '@/components/layout/Providers';
import { JsonLd } from '@/components/seo/JsonLd';

/* Display: Libre Bodoni (Brand Guidelines 02 — Bodoni-style serif). A Bodoni
   drawn with sturdier hairlines than Bodoni Moda, so headings stay readable at
   every size. Self-hosted variable font (wght 400–700, Latin) so Next can
   size-adjust the fallback and the swap causes no layout shift. */
const display = localFont({
  src: [
    { path: './fonts/libre-bodoni.woff2', weight: '400 700', style: 'normal' },
    { path: './fonts/libre-bodoni-italic.woff2', weight: '400 700', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-display',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'serif'],
});

/* Utility: Lato 2.0 with a true Medium weight for prices (Brand Guidelines 06) */
const sans = localFont({
  src: [
    { path: './fonts/lato-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/lato-normal-italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/lato-medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/lato-bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Jewellery, Luggage & Handbags in Trinidad & Tobago`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: site.name,
    description: site.description,
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description },
  alternates: { canonical: '/' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: brand.ivory,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Runs before first paint: marks JS as available and decides whether the
 * first-visit preloader plays (home page, desktop, once per session, motion
 * allowed). Phones skip it so the hero paints immediately.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(location.pathname==='/'&&!sessionStorage.getItem('ntc-intro')&&matchMedia('(min-width: 1024px) and (pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('ntc-preload')}}catch(e){}})();`;

/** Shared by the storefront (app/(store)) and the admin (app/admin). */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-TT" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: site.name,
            url: site.url,
            logo: `${site.url}/brand/logo.svg`,
            areaServed: 'TT',
            sameAs: [site.socials.instagram, site.socials.facebook, site.socials.tiktok],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'sales',
              telephone: `+${site.whatsappNumber}`,
              availableLanguage: ['English'],
            },
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
