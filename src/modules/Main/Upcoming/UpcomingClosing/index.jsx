// modules/Main/Upcoming/UpcomingClosing/index.jsx
// "There's more to your story." — the sign-off, with one way onward
// (by default, back up to the feature strip).

import { ArrowUp } from 'lucide-react';

import ArrowButton from '@/components/Common/ArrowButton';
import SectionHeading from '@/components/Common/SectionHeading';
import { cn } from '@/utils/cn';

import { FIRST_LOOK_ID, UPCOMING_CLOSING as CLOSING } from '../constants';

export default function UpcomingClosing({
  href = `#${FIRST_LOOK_ID}`,
  cta = CLOSING.cta,
  icon = ArrowUp,
  className,
}) {
  return (
    <section
      className={cn(
        'flex flex-col items-start gap-6 border-y pt-8.25 pb-8 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        <SectionHeading size="title" title={CLOSING.title} accent={CLOSING.accent} />
        <p className="mt-3 text-xs leading-[1.75] text-muted-foreground">{CLOSING.text}</p>
      </div>
      <ArrowButton variant="primary" icon={icon} href={href}>
        {cta}
      </ArrowButton>
    </section>
  );
}
