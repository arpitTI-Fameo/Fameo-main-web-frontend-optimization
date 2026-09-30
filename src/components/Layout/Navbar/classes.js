// components/Layout/Navbar/classes.js
// Class fragments shared by MainNav and UserMenu. Fonts use the `family-name:`
// hint so tailwind-merge doesn't read them as a weight and drop them next to
// `font-normal` / `font-bold`.

import { cn } from '@/utils/cn';

export const MONO = "font-[family-name:'Space_Mono',monospace]";
export const GROTESK = "font-[family-name:'Schibsted_Grotesk',sans-serif]";
export const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D45A79]';

// Floating capsules. Every cluster keeps the same box in both states so only
// paint changes: CLEAR at rest over the hero, SOLID (dark glass) once scrolled.
export const PILL = cn(
  'rounded-full border',
  '[transition:background-color_.45s_var(--ease),border-color_.45s_var(--ease),box-shadow_.45s_var(--ease),backdrop-filter_.45s_var(--ease),translate_.5s_var(--ease),scale_.12s_var(--ease)] motion-reduce:transition-none'
);
export const PILL_SOLID = 'border-white/8 bg-[rgba(20,16,17,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-[14px] backdrop-saturate-[1.4]';
export const PILL_CLEAR = 'border-transparent bg-transparent shadow-[inset_0_1px_0_transparent,0_10px_30px_-12px_transparent] backdrop-blur-[0px] backdrop-saturate-100';
