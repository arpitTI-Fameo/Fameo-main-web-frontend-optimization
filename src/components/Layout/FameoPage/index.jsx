// components/Layout/FameoPage/index.jsx
// Shell for a Fameo-themed page: opts the page into the theme (`.fameo-theme`)
// and sets the shared content column, clearing the fixed site nav (56px, 62px
// from `sm`). `className` extends the column — e.g. `h-svh overflow-hidden`
// for a one-screen loading skeleton. `fixedScale` renders the page 1:1 at every
// width instead of growing with the viewport (see `.fameo-fixed-scale`).

import { cn } from '@/utils/cn';

export default function FameoPage({ fixedScale = false, className, children }) {
  return (
    <div className={cn('fameo-theme', fixedScale && 'fameo-fixed-scale')}>
      <div
        className={cn(
          'mx-auto max-w-7xl px-6 pt-[calc(56px+var(--spacing)*6)] pb-4 sm:px-4 sm:pt-[calc(62px+var(--spacing)*8)] lg:px-6',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
