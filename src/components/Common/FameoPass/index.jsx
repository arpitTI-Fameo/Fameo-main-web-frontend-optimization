// components/Common/FameoPass/index.jsx
// The silver membership-card artwork: logo (and an optional icon) on top, a
// serif line in the middle (or, with `stack="top"`, straight under the logo),
// a small uppercase caption or a custom footer at the bottom. Size, padding
// and tilt come from `className`.
//
//   <FameoPass title="Keep becoming." caption="The creator membership" icon={Badge}
//              className="h-39 w-62 -rotate-7 p-5" />
//
// Everything inside is sized in em off the card's font-size (10px by default),
// so `text-[1.85cqw]` scales the whole card inside a container.
// Decorative: render it inside an `aria-hidden` wrapper.
// Needs a `.fameo-theme` ancestor for its colors.

import Wordmark from '@/components/Common/Wordmark';
import { cn } from '@/utils/cn';

export default function FameoPass({
  logo = <Wordmark className="text-[2em]" />,
  icon: Icon,
  kicker,
  title,
  caption,
  footer,
  stack = 'spread',
  className,
  titleClassName,
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-lg border border-input bg-silver-sheen text-10 text-secondary-foreground shadow-[0_18px_27px_rgb(85_66_103/0.13)]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {logo}
        {Icon && <Icon aria-hidden="true" className="size-[1.4em] shrink-0 stroke-[1.65] text-brand-text" />}
      </div>
      <div className={cn(stack === 'top' && 'mt-[0.9em] flex-1')}>
        {kicker && <small className="block text-[1em] uppercase tracking-[0.2em]">{kicker}</small>}
        <strong className={cn('block font-serif text-[2.2em] font-normal', kicker && 'mt-1.5', titleClassName)}>
          {title}
        </strong>
      </div>
      {footer ?? (caption && <small className="block text-[0.9em] uppercase tracking-[0.2em]">{caption}</small>)}
    </div>
  );
}
