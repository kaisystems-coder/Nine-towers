import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Theme layer. Every value here reads a CSS variable defined in
 * app/globals.css, which holds the brand values from the
 * Nine Towers Collection Brand Guidelines. Change the brand there, not here.
 */
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '390px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Core palette (Brand Guidelines 01)
        obsidian: rgb('--c-obsidian'),
        cream: rgb('--c-cream'),
        ivory: rgb('--c-ivory'),
        champagne: rgb('--c-champagne'),
        // Derived tones
        stone: rgb('--c-stone'),
        'champagne-deep': rgb('--c-champagne-deep'),
        mist: rgb('--c-mist'),
        'cream-deep': rgb('--c-cream-deep'),
        error: rgb('--c-error'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Lato', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      fontSize: {
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.18em' }],
        caption: ['0.8125rem', { lineHeight: '1.5' }],
        'body-s': ['0.875rem', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.7' }],
        'body-l': ['1.125rem', { lineHeight: '1.7' }],
        price: ['0.9375rem', { lineHeight: '1.4' }],
        'd-xs': ['1.375rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'd-s': ['clamp(1.625rem, 2.4vw, 2.125rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'd-m': ['clamp(2.125rem, 4vw, 3.25rem)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        'd-l': ['clamp(2.5rem, 5.6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'd-xl': ['clamp(3rem, 7.4vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      },
      spacing: {
        // 8-point rhythm (Brand Guidelines 03)
        xs: 'var(--space-xs)',
        s: 'var(--space-s)',
        m: 'var(--space-m)',
        l: 'var(--space-l)',
        xl: 'var(--space-xl)',
        // Section spacing, same 8-point rhythm
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        gutter: 'var(--gutter)',
        header: 'var(--header-h)',
      },
      maxWidth: {
        content: 'var(--content-max)',
        prose: '65ch',
      },
      borderRadius: {
        none: '0',
        xs: 'var(--radius-xs)',
        DEFAULT: 'var(--radius-s)',
        s: 'var(--radius-s)',
        m: 'var(--radius-m)',
        full: '9999px',
      },
      boxShadow: {
        // Tinted, layered elevation: base → elevated → floating
        elevated: 'var(--shadow-elevated)',
        floating: 'var(--shadow-floating)',
        none: 'none',
      },
      transitionTimingFunction: {
        brand: 'var(--ease-brand)',
      },
      transitionDuration: {
        fast: '320ms',
        base: '600ms',
        slow: '900ms',
        slower: '1200ms',
      },
      zIndex: {
        raised: '10',
        sticky: '30',
        header: '40',
        mega: '45',
        fab: '50',
        backdrop: '60',
        drawer: '70',
        modal: '80',
        cursor: '90',
        curtain: '100',
        preloader: '110',
      },
      aspectRatio: {
        product: '4 / 5',
        portrait: '3 / 4',
        tall: '2 / 3',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      // Size controls by pointer type, not width: a landscape phone is 844px wide.
      addVariant('touch', '@media (pointer: coarse)');
      addVariant('desk', '@media (min-width: 640px) and (pointer: fine)');
      addVariant('hover-fine', '@media (hover: hover) and (pointer: fine)');
    }),
  ],
};

export default config;
