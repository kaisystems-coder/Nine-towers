import { cn } from '@/lib/cn';

/**
 * Nine hairline towers: the brand name, drawn. Stepped Art Deco setbacks and
 * vertical fluting echo the tower in the logo. Each rises from its base on
 * load (CSS, see .intro-tower), the tallest last.
 */
const towers = [
  { x: 8, w: 34, h: 300, spire: 0 },
  { x: 58, w: 46, h: 400, spire: 0 },
  { x: 120, w: 38, h: 340, spire: 26 },
  { x: 174, w: 56, h: 470, spire: 0 },
  { x: 248, w: 64, h: 610, spire: 74 }, // the signature tower
  { x: 330, w: 50, h: 500, spire: 0 },
  { x: 398, w: 40, h: 380, spire: 30 },
  { x: 456, w: 52, h: 440, spire: 0 },
  { x: 526, w: 36, h: 320, spire: 0 },
];
const order = [4, 2, 6, 1, 7, 3, 5, 0, 8]; // rise order: outer first, signature last

const BASE = 720;

function silhouette(x: number, w: number, h: number) {
  const top = BASE - h;
  const i1 = w * 0.14;
  const i2 = w * 0.3;
  const y1 = top + h * 0.1;
  const y2 = top + h * 0.045;
  return `M${x} ${BASE}V${y1}H${x + i1}V${y2}H${x + i2}V${top}H${x + w - i2}V${y2}H${x + w - i1}V${y1}H${x + w}V${BASE}`;
}

export function Skyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 570 720" className={cn('overflow-visible', className)} aria-hidden="true" focusable="false">
      {towers.map((t, idx) => {
        const top = BASE - t.h;
        const flutes = t.w > 44 ? [0.38, 0.5, 0.62] : [0.42, 0.58];
        return (
          <g
            key={idx}
            className="intro-tower"
            style={{ ['--i' as string]: order.indexOf(idx), transformBox: 'fill-box' }}
          >
            <path d={silhouette(t.x, t.w, t.h)} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {flutes.map((f) => (
              <line
                key={f}
                x1={t.x + t.w * f}
                x2={t.x + t.w * f}
                y1={top + t.h * 0.16}
                y2={BASE}
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                opacity="0.45"
              />
            ))}
            {t.spire > 0 && (
              <line
                x1={t.x + t.w / 2}
                x2={t.x + t.w / 2}
                y1={top}
                y2={top - t.spire}
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
