import manifest from '@/data/asset-manifest.json';
import { brand } from '@/config/theme';

const available = new Set<string>(manifest.files);

/**
 * True when the photo exists: listed by scripts/scan-assets.mjs, uploaded
 * through the admin (a Supabase Storage https URL), or any other absolute URL.
 */
export function hasAsset(src?: string | null): src is string {
  return !!src && (src.startsWith('http') || available.has(src));
}

const blurSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10"><rect width="8" height="10" fill="${brand.cream}"/></svg>`;

/** Warm cream blur placeholder, used for every photo while it loads. */
export const BLUR_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(blurSvg)}`;
