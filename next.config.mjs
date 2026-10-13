/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // WebP only: AVIF encoding is 2–9s per variant on a cold cache.
    formats: ['image/webp'],
    // Photos uploaded through the admin live in Vercel Blob.
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
    // Admin photo uploads (already resized in the browser).
    serverActions: { bodySizeLimit: '5mb' },
    // Ship the saved catalogue with the server code when it's committed.
    outputFileTracingIncludes: { '/**': ['./data/products.json', './data/uploads/**'] },
  },
};

export default nextConfig;
