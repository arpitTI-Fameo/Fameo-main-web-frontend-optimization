"use client";
// modules/Resources/CourseDetail/index.jsx
// Course overview + lesson reader for /resources/courses/[courseSlug]

import { useState, useEffect, useMemo, use } from "react";
import { getCourseBySlug } from "@/constants/courses";
import { useCourse } from '@/lib/hooks/main/useResource';
import { ROUTES } from '@/constants/routes';

import ArrowButton from '@/components/Common/ArrowButton';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import SectionHeading from '@/components/Common/SectionHeading';
import FameoPage from '@/components/Layout/FameoPage';

import CourseOverview from './CourseOverview';
import CourseSkeleton from './CourseSkeleton';
import LessonView from './LessonView';
import { courseCrumbs, normalizeCourse } from './helpers';

export default function CourseDetail({ params }) {
  const { courseSlug } = use(params);

  const [lessonId, setLessonId] = useState(null);   // null = overview

  const { data, isLoading } = useCourse(courseSlug);

  const course = useMemo(() => {
    let resolved = null;
    const stat = getCourseBySlug(courseSlug);

    if (data?.data?.course?.chapters?.length) {
      resolved = normalizeCourse(data.data.course, stat || {});
    } else if (stat) {
      resolved = normalizeCourse(stat);
    }
    return resolved;
  }, [courseSlug, data]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [lessonId]);

  const allLessons = useMemo(
    () => (course?.chapters || []).flatMap(ch =>
      (ch.lessons || []).map(l => ({ ...l, chapter: ch }))
    ), [course]
  );

  if (isLoading) return <CourseSkeleton />;

  if (!course || !allLessons.length) {
    return (
      <FameoPage className="flex min-h-svh flex-col">
        <Breadcrumbs items={courseCrumbs("Not found")} />
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <SectionHeading
            as="h1"
            align="center"
            eyebrow="Course not found"
            title="This course isn't"
            accent="published yet."
          />
          <p className="mt-4 max-w-88 text-13 leading-[1.75] text-muted-foreground">
            It may have moved, or it is still being written. The rest of the library is ready
            when you are.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
            <ArrowButton variant="primary" href={ROUTES.COURSES}>Browse all courses</ArrowButton>
            <ArrowButton href={ROUTES.RESOURCES}>Learning centre</ArrowButton>
          </div>
        </div>
      </FameoPage>
    );
  }

  const lesson = lessonId ? allLessons.find(l => l.id === lessonId) : null;

  return lesson ? (
    <LessonView
      course={course}
      lesson={lesson}
      allLessons={allLessons}
      onNav={setLessonId}
      onBackToCourse={() => setLessonId(null)}
    />
  ) : (
    <CourseOverview course={course} allLessons={allLessons} onOpenLesson={setLessonId} />
  );
}
