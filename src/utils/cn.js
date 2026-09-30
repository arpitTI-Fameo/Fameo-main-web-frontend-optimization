// src/utils/cn.js
import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Numeric type tokens registered in src/app/fameo-theme.css (`text-13` …).
// tailwind-merge only recognises t-shirt names as font sizes; without this it
// reads `text-13` as a color and drops it next to `text-brand-text`. Keep this
// list in sync with the `--text-*` tokens there.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['10', '11', '13', '17', '22', '25', '27', '30', '34'],
    },
  },
});

/**
 * Join conditional class names; a later Tailwind utility overrides an earlier
 * one that sets the same property. `cn('px-4', isTight && 'px-2')` → `px-2`.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
