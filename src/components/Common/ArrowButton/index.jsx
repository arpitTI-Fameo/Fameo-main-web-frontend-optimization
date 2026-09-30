// components/Common/ArrowButton/index.jsx
// Every "label + arrow" action on the Fameo editorial pages, in one of three
// weights. Pass `href` for navigation (renders next/link), `onClick` otherwise.
//
//   primary — filled rose button     "Explore membership ↗"
//   link    — rose text link         "What's included ↗"
//   subtle  — small muted text link  "View course outline ↗"
//
// Needs a `.fameo-theme` ancestor for its colors.

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: {
    variant: 'default',
    className:
      'h-auto min-h-11.75 gap-3 px-5 py-3.5 text-13 shadow-fameo-rose has-[>svg]:px-5',
  },
  link: {
    variant: 'link',
    className:
      'h-auto min-h-11 gap-2 px-0 py-2.5 text-xs font-normal text-brand-text has-[>svg]:px-0',
  },
  subtle: {
    variant: 'link',
    className:
      'h-auto min-h-8.5 gap-2 px-0 py-2 text-11 font-normal text-muted-foreground has-[>svg]:px-0',
  },
};

export default function ArrowButton({
  href,
  onClick,
  icon: Icon = ArrowUpRight,
  variant = 'link',
  className,
  children,
  ...props
}) {
  const v = VARIANTS[variant];
  const classes = cn(
    v.className,
    'transition-colors duration-200 motion-reduce:transition-none',
    className
  );
  const content = (
    <>
      {children}
      <Icon aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <Button asChild variant={v.variant} className={classes}>
        <Link href={href} onClick={onClick} {...props}>
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button type="button" variant={v.variant} onClick={onClick} className={classes} {...props}>
      {content}
    </Button>
  );
}
