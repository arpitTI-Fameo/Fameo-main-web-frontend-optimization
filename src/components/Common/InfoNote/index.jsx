// components/Common/InfoNote/index.jsx
// A quiet footnote led by an info icon — disclaimers, "subject to change" lines.
// Needs a `.fameo-theme` ancestor for its colors.

import { Info } from 'lucide-react';

import { cn } from '@/utils/cn';

export default function InfoNote({ className, children }) {
  return (
    <p className={cn('flex max-w-150 gap-2.5 text-11 leading-[1.7] text-muted-foreground/85', className)}>
      <Info aria-hidden="true" className="mt-px size-4 shrink-0 stroke-[1.65] text-brand-muted/70" />
      <span>{children}</span>
    </p>
  );
}
