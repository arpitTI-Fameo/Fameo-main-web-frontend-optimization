// components/Common/GlassNote/index.jsx
// Frosted caption card pinned to the bottom of a photo. The parent must be
// `relative`. Needs a `.fameo-theme` ancestor for its colors.

import { cn } from '@/utils/cn';

export default function GlassNote({ className, children }) {
  return (
    <div
      className={cn(
        'absolute inset-x-5 bottom-4 flex items-center gap-3 rounded-md border border-card/90 bg-card/95 px-4 py-3.5 text-xs text-foreground shadow-fameo-soft backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
