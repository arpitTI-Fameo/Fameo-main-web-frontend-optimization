/* The open eye the live-selfie camera blinks during the liveness prompt. */
export const EyeGlyph = ({ size = 78, stroke = '#FFFFFF' }) => (
  <svg viewBox="0 0 78 50" fill="none" aria-hidden="true" width={size} height={size * 50 / 78}>
    <path d="M3 25C12 10 24.5 3 39 3s27 7 36 22c-9 15-21.5 22-36 22S12 40 3 25z"
      stroke={stroke} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="39" cy="25" r="10" fill={stroke} />
  </svg>
);

/* Lucide shapes split out so parts can animate on their own. Every stroke has
   pathLength={1}, so `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` draws it. */
const STROKE = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

/* lucide `fingerprint-pattern` */
const FINGERPRINT_PATHS = [
  'M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4', 'M14 13.12c0 2.38 0 6.38-1 8.88', 'M17.29 21.02c.12-.6.43-2.3.5-3.02',
  'M2 12a10 10 0 0 1 18-6', 'M2 16h.01', 'M21.8 16c.2-2 .131-5.354 0-6', 'M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2',
  'M8.65 22c.21-.66.45-1.32.57-2', 'M9 6.8a6 6 0 0 1 9 5.2v2',
];
export const FingerprintIcon = ({ className, pathClassName }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} strokeWidth="1.65" {...STROKE}>
    {FINGERPRINT_PATHS.map((d) => <path key={d} d={d} pathLength={1} className={pathClassName} />)}
  </svg>
);

/* lucide `lock-keyhole`, with the shackle as its own path */
export const PadlockIcon = ({ className, shackleClassName }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} strokeWidth="1.65" {...STROKE}>
    <circle cx="12" cy="16" r="1" />
    <rect x="3" y="10" width="18" height="12" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" className={shackleClassName} />
  </svg>
);

/* A small tick that draws itself in. */
export const TickIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" aria-hidden="true" className={className} strokeWidth="2" {...STROKE}>
    <path d="M2.6 6.3l2.3 2.3 4.6-4.8" pathLength={1} className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[frgDraw_.35s_ease_.12s_forwards]" />
  </svg>
);
