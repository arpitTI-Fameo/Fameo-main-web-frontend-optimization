// components/Common/CourseCard/index.jsx
// Library tile for one course: cover photo with its category badge, the title,
// an optional meta line and a "View course outline" link.
//
//   <CourseCard course={c} href={ROUTES.COURSE(c.slug)} meta="Beginner · 12 lessons" />
//   <CourseCard course={c} onOpen={openCourse} onPrefetch={prefetchCourse} />
//
// `href` renders links; otherwise `onOpen(course)` runs from buttons.
// Needs a `.fameo-theme` ancestor for its colors.

import Link from 'next/link';

import { Badge } from '@/components/ui/shadcn/badge';
import ArrowButton from '@/components/Common/ArrowButton';
import { cn } from '@/utils/cn';

const COVER =
  'group relative block h-33.75 w-full overflow-hidden rounded-lg bg-secondary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 max-[360px]:h-45 sm:h-41.25';

export default function CourseCard({ course, href, onOpen, onPrefetch, meta, className }) {
  const open = href ? undefined : () => onOpen?.(course);
  const label = `Open ${course.title}`;
  const cover = (
    <>
      <img
        src={course.thumbnail || course.heroThumb}
        alt=""
        loading="lazy"
        draggable="false"
        className="size-full object-cover transition-transform duration-400 group-hover:scale-[1.04] motion-reduce:transition-none"
      />
      <Badge
        variant="secondary"
        className="absolute top-2.75 left-2.75 rounded-full bg-card/95 px-2.5 py-1.5 text-10 font-normal text-secondary-foreground"
      >
        {course.category}
      </Badge>
    </>
  );

  return (
    <article
      className={cn('min-w-0', className)}
      onMouseEnter={onPrefetch ? () => onPrefetch(course) : undefined}
    >
      {href ? (
        <Link href={href} aria-label={label} className={COVER}>
          {cover}
        </Link>
      ) : (
        <button type="button" onClick={open} aria-label={label} className={COVER}>
          {cover}
        </button>
      )}
      {meta && <p className="mt-3 text-11 text-muted-foreground">{meta}</p>}
      <h3
        className={cn(
          'mb-0.5 text-base font-medium leading-[1.3] tracking-[-0.03em] sm:text-17',
          meta ? 'mt-1' : 'mt-3'
        )}
      >
        {course.title}
      </h3>
      <ArrowButton variant="subtle" href={href} onClick={open}>
        View course outline
      </ArrowButton>
    </article>
  );
}
