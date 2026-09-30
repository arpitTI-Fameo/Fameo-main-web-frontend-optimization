// components/Common/Eyebrow/index.jsx
// Small uppercase kicker above a heading, in one of four looks:
//
//   default — rose rule, brand text        "— MEMBERSHIP"
//   soft    — rose rule, quieter text      "— THE NEXT CHAPTER OF FAMEO"
//   dot     — rose dot, quieter text       "• FAMEO COMMUNITY · COMING SOON"
//   label   — no marker, lightly tracked   "FAMEO CREATOR STORE"
//
// Needs a `.fameo-theme` ancestor for its colors.

import { cn } from '@/utils/cn';

const VARIANTS = {
  default: 'gap-2.5 font-medium tracking-[0.18em] text-brand-text before:h-px before:w-5.5 before:bg-primary',
  soft: 'gap-2.5 font-medium tracking-[0.16em] text-brand-muted before:h-px before:w-5.5 before:bg-primary',
  dot: 'gap-2 font-medium tracking-[0.09em] text-brand-muted before:size-1.5 before:rounded-full before:bg-primary',
  label: 'font-normal tracking-[0.04em] text-brand-muted/90 before:hidden',
};

export default function Eyebrow({ variant = 'default', align = 'start', className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center text-11 uppercase before:shrink-0 before:content-['']",
        VARIANTS[variant],
        align === 'center' && 'justify-center',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
