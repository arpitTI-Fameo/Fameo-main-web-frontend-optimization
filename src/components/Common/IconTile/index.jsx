// components/Common/IconTile/index.jsx
// An icon (or a short mark such as "01") in a soft silver rounded square.
//
//   <IconTile icon={UserRound} />
//   <IconTile>01</IconTile>
//
// Needs a `.fameo-theme` ancestor for its colors.

import { cn } from '@/utils/cn';

export default function IconTile({ icon: Icon, className, children }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-12 shrink-0 place-items-center rounded-lg border bg-linear-to-br from-card to-secondary text-brand-muted shadow-fameo-soft',
        className
      )}
    >
      {Icon ? <Icon className="size-4.5 stroke-[1.65]" /> : children}
    </span>
  );
}
