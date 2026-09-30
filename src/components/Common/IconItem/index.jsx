// components/Common/IconItem/index.jsx
// An icon beside a short label, or beside a title + description.
//
//   <IconItem icon={Check} title="Course library" size="xs" />
//   <IconItem icon={Sparkles} title="Stay inspired" description="…" size="md" />
//   <IconItem icon={Users} title="Community" size="row" />   (a strip of links)
//
// Needs a `.fameo-theme` ancestor for its colors.

import { cn } from '@/utils/cn';

const SIZES = {
  row: { root: 'gap-2 text-11', icon: 'size-4 stroke-[1.65] text-brand-muted/75' },
  xs: { root: 'gap-1.5 text-11', icon: 'size-3.25 text-primary' },
  sm: { root: 'gap-2.5 text-xs', icon: 'size-4.25 text-brand-text/85' },
  md: { root: 'gap-3 text-xs', icon: 'mt-0.5 size-4.5 text-brand-text/85' },
};

export default function IconItem({ icon: Icon, title, description, size = 'sm', className }) {
  const s = SIZES[size];

  return (
    <div
      className={cn(
        'flex leading-normal text-muted-foreground',
        description ? 'items-start' : 'items-center',
        s.root,
        className
      )}
    >
      <Icon aria-hidden="true" className={cn('shrink-0', s.icon)} />
      {description ? (
        <div>
          <p className="text-13 font-medium text-foreground">{title}</p>
          <p className="mt-1 leading-[1.75]">{description}</p>
        </div>
      ) : (
        <span>{title}</span>
      )}
    </div>
  );
}
