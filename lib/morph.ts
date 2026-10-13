'use client';

import { animate } from 'framer-motion';
import { EASE } from './motion';

/**
 * Shared-element transition from a product card to the product page.
 * The card image is cloned into a fixed layer at its exact screen position;
 * after the route changes, the clone travels and scales into the product
 * page's main image, then fades to reveal the real one. Transform-only.
 */
let pending: { slug: string; rect: DOMRect; ghost: HTMLElement; timer: number } | null = null;

function cleanup() {
  if (!pending) return;
  window.clearTimeout(pending.timer);
  pending.ghost.remove();
  pending = null;
}

export function startMorph(slug: string, source: HTMLElement) {
  cleanup();
  const rect = source.getBoundingClientRect();
  if (!rect.width || rect.bottom < 0 || rect.top > window.innerHeight) return;
  const ghost = source.cloneNode(true) as HTMLElement;
  ghost.setAttribute('aria-hidden', 'true');
  ghost.removeAttribute('id');
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    zIndex: '95',
    pointerEvents: 'none',
    transformOrigin: '0 0',
    overflow: 'hidden',
  });
  document.body.appendChild(ghost);
  // If the product page never claims it (e.g. navigation failed), clear it.
  pending = { slug, rect, ghost, timer: window.setTimeout(cleanup, 4000) };
}

/** Called by the product gallery once its main image is laid out. */
export function landMorph(slug: string, target: HTMLElement) {
  if (!pending || pending.slug !== slug) return;
  const { rect, ghost, timer } = pending;
  window.clearTimeout(timer);
  pending = null;

  const t = target.getBoundingClientRect();
  const dx = t.left - rect.left;
  const dy = t.top - rect.top;
  const sx = t.width / rect.width;
  const sy = t.height / rect.height;
  target.style.opacity = '0';

  animate(ghost, { transform: ['translate(0px, 0px) scale(1, 1)', `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`] }, { duration: 0.9, ease: EASE }).then(
    () => {
      target.style.opacity = '';
      animate(ghost, { opacity: [1, 0] }, { duration: 0.35, ease: EASE }).then(() => ghost.remove());
    }
  );
}
