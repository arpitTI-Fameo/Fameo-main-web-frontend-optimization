// components/Common/Wordmark/index.jsx
// "* fameo" — the rose asterisk and lowercase name used on Fameo cards and
// artwork (the site nav keeps AppLogo). Sized by font-size: `text-xl` etc.
// Needs a `.fameo-theme` ancestor for its colors.

import { Asterisk } from 'lucide-react';

import { cn } from '@/utils/cn';

export default function Wordmark({ className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[0.2em] font-semibold tracking-[-0.045em] text-foreground',
        className,
        // After className: tailwind-merge drops a leading-* that precedes a text size.
        'leading-none'
      )}
    >
      <Asterisk aria-hidden="true" className="size-[0.62em] shrink-0 translate-y-[0.12em] stroke-[3.25] text-primary" />
      fameo
    </span>
  );
}
