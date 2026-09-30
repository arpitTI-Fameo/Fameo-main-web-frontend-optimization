'use client';
// modules/Resources/CourseLanding/Courses/index.jsx
// The course library at /resources/courses: every course, filterable by topic.

import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { COURSE_CATEGORIES } from '@/constants/courses';
import { ROUTES } from '@/constants/routes';

import { Card } from '@/components/ui/shadcn/card';
import ArrowButton from '@/components/Common/ArrowButton';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import ChipGroup from '@/components/Common/ChipGroup';
import CourseCard from '@/components/Common/CourseCard';
import SectionHeading from '@/components/Common/SectionHeading';
import FameoPage from '@/components/Layout/FameoPage';

import { useCourseLibrary } from '../../hooks';

const CATEGORY_ITEMS = COURSE_CATEGORIES.map(cat => ({ value: cat, label: cat }));

const lessonCount = (course) =>
  (course.chapters || []).reduce((n, ch) => n + (ch.lessons?.length || 0), 0);

/* "Beginner · 12 lessons · 107 min" — parts the course actually has. */
const courseMeta = (course) => {
  const n = lessonCount(course);
  return [course.level, n && `${n} lesson${n === 1 ? '' : 's'}`, course.duration]
    .filter(Boolean)
    .join(' · ');
};

export default function Courses() {
  const courses = useCourseLibrary();
  const [activeCat, setActiveCat] = useState('All');

  const list = activeCat === 'All' ? courses : courses.filter(c => c.category === activeCat);
  const start = courses.find(c => c.tag === 'Mandatory') || courses[0];

  const stats = useMemo(() => [
    { label: 'Courses', value: courses.length },
    { label: 'Lessons', value: courses.reduce((n, c) => n + lessonCount(c), 0) },
    { label: 'Topics', value: new Set(courses.map(c => c.category)).size },
  ], [courses]);

  return (
    <FameoPage>
      <Breadcrumbs items={[{ label: 'Learning centre', href: ROUTES.RESOURCES }, { label: 'Courses' }]} />

      <header className="grid gap-6 pt-6 pb-8 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-11 md:pb-10">
        <SectionHeading
          as="h1"
          size="display"
          eyebrow="The course library"
          title="Every course,"
          accent="in one library."
        />
        <div>
          <p className="max-w-95 text-sm leading-[1.75] text-muted-foreground">
            Structured courses for creators, taught by people who have built an audience.
            Start anywhere and learn at your own pace.
          </p>
          <dl className="mt-6 flex gap-8">
            {stats.map(({ label, value }) => (
              <div key={label} className="flex flex-col-reverse gap-1.5">
                <dt className="text-11 uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
                <dd className="font-serif text-30 leading-none text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="border-t pt-6">
        <ChipGroup
          size="sm"
          aria-label="Course topics"
          className="mb-5"
          items={CATEGORY_ITEMS}
          value={activeCat}
          onValueChange={(cat) => { if (cat) setActiveCat(cat); }}
        />
        <p aria-live="polite" className="mb-4 text-xs text-muted-foreground">
          {list.length} {list.length === 1 ? 'course' : 'courses'}
          {activeCat === 'All' ? ' · The full library' : ` · ${activeCat}`}
        </p>

        {list.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 max-[360px]:grid-cols-1 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8">
            {list.map(c => (
              <CourseCard key={c.id || c.slug} course={c} href={ROUTES.COURSE(c.slug)} meta={courseMeta(c)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-lg border border-dashed px-6 py-12 text-center">
            <p className="text-13 text-muted-foreground">No {activeCat} courses yet.</p>
            <ArrowButton icon={ArrowRight} onClick={() => setActiveCat('All')}>
              Browse the full library
            </ArrowButton>
          </div>
        )}
      </section>

      {start && (
        <Card className="mt-12 mb-6 grid gap-6 rounded-xl bg-silver-sheen p-6 shadow-none sm:grid-cols-[1fr_auto] sm:items-center md:mt-16 md:p-9">
          <div>
            <SectionHeading
              size="md"
              eyebrow="Not sure where to start?"
              title="Begin with"
              accent="the foundations."
            />
            <p className="mt-3 max-w-110 text-13 leading-[1.75] text-muted-foreground">
              {start.title} is the course every creator takes first. It sets up everything the
              rest of the library builds on.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <ArrowButton variant="primary" href={ROUTES.COURSE(start.slug)}>
              Start {start.title}
            </ArrowButton>
            <ArrowButton href={ROUTES.RESOURCES}>Learning centre</ArrowButton>
          </div>
        </Card>
      )}
    </FameoPage>
  );
}
