// Lists every image/video in /public/media and /public/products so the site
// knows which photos exist. Anything missing renders as a neutral plate.
// Runs automatically before `dev` and `build`. Run `npm run assets` after
// dropping new photos in while the dev server is running.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm']);
const files = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name).toLowerCase()))
      files.push('/' + path.relative(pub, full).split(path.sep).join('/'));
  }
}

walk(path.join(pub, 'media'));
walk(path.join(pub, 'products'));
files.sort();

const out = path.join(root, 'data', 'asset-manifest.json');
const next = JSON.stringify({ files }, null, 2) + '\n';
if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== next) fs.writeFileSync(out, next);
console.log(`[assets] ${files.length} media file(s) found`);
