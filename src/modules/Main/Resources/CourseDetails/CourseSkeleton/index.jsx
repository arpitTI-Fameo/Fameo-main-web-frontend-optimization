// modules/Resources/CourseDetail/CourseSkeleton/index.jsx
// One screen of the course overview while the course loads. It is built from
// the same shell, components and `S` classes as the loaded page, so every
// placeholder sits where its content will land: nothing jumps on swap-in.

import { ArrowDown, ArrowRight } from 'lucide-react';

import { Skeleton } from '@/components/ui/shadcn/skeleton';
import ArrowButton from '@/components/Common/ArrowButton';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import GlassNote from '@/components/Common/GlassNote';
import SectionHeading from '@/components/Common/SectionHeading';
import FameoPage from '@/components/Layout/FameoPage';
import { cn } from '@/utils/cn';

import { courseCrumbs } from '../helpers';
import { S } from '../styles';

/* Exactly one line box of the surrounding type (`1lh`), so a stack of these
   is as tall as the text it stands in for. Pass `flex` to make it a block. */
function Line({ className }) {
  return (
    <span className={cn('inline-flex h-[1lh] w-full items-center align-top', className)}>
      <Skeleton className="h-[0.62em] w-full rounded-full" />
    </span>
  );
}

/* The real button, label kept for its width, painted over by a placeholder. */
function GhostButton({ variant, icon, label }) {
  return (
    <ArrowButton
      variant={variant}
      icon={icon}
      tabIndex={-1}
      className="relative bg-transparent text-transparent shadow-none hover:bg-transparent"
    >
      {label}
      <Skeleton
        className={cn(
          'absolute',
          variant === 'primary' ? 'inset-0' : 'inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full'
        )}
      />
    </ArrowButton>
  );
}

/* Close to "3 lessons", "3 chapters", "96 min", "Intermediate", so the row
   wraps where the real one does. */
const FACT_WIDTHS = ['w-13', 'w-15', 'w-10', 'w-18'];
const LEARN_ITEMS = 6;

export default function CourseSkeleton() {
  return (
    <FameoPage className="h-svh overflow-hidden">
      <p role="status" className="sr-only">Loading course…</p>

      <div inert aria-hidden="true">
        <Breadcrumbs items={courseCrumbs(<Line className="w-40" />)} />

        <section className={S.hero}>
          <div>
            <SectionHeading
              as="div"
              size="xl"
              eyebrow={<Line className="w-24" />}
              title={<Line className="w-4/5" />}
              accent={<Line className="w-3/5" />}
            />
            <div className={S.lead}>
              <Line className="flex" />
              <Line className="flex w-11/12" />
              <Line className="flex w-2/3" />
            </div>
            <div className={S.facts}>
              {FACT_WIDTHS.map((w, i) => (
                // IconItem's box: its text-xs line height, not leading-normal
                // (tailwind-merge drops that one in IconItem).
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  <Skeleton className="size-4.25 shrink-0 rounded-full" />
                  <Line className={w} />
                </div>
              ))}
            </div>
            <div className={S.actions}>
              <GhostButton variant="primary" icon={ArrowRight} label="Start learning" />
              <GhostButton variant="link" icon={ArrowDown} label="View curriculum" />
            </div>
          </div>

          {/* Muted under a secondary pulse; on S.photo's own secondary it would not show. */}
          <div className={cn(S.photo, 'bg-muted')}>
            <Skeleton className="absolute inset-0 rounded-none" />
            <GlassNote>
              <Skeleton className="size-4.5 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Line className="flex w-3/5 text-xs" />
                <Line className="mt-0.5 flex w-2/5 text-11" />
              </div>
            </GlassNote>
          </div>
        </section>

        {/* The top of "What you'll learn", for screens tall enough to reach it. */}
        <section className={S.learn}>
          <SectionHeading
            as="div"
            eyebrow={<Line className="w-28" />}
            title={<Line className="w-1/2" />}
            accent={<Line className="w-2/5" />}
          />
          <div className={S.learnList}>
            {Array.from({ length: LEARN_ITEMS }, (_, i) => (
              <div key={i} className={S.learnItem}>
                <Skeleton className={cn(S.learnIcon, 'bg-secondary')} />
                <div className="flex-1">
                  <Line className="flex" />
                  <Line className={cn('flex', i % 2 ? 'w-1/2' : 'w-3/4')} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </FameoPage>
  );
}
