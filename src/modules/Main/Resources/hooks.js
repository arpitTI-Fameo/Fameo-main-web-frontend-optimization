'use client';
// modules/Resources/hooks.js

import { useMemo } from 'react';
import { COURSES } from '@/constants/courses';
import { useCourses } from '@/lib/hooks/main/useResource';

import { normalizeCourse } from './ResourceLanding/helpers';

/* The course library: published DB courses override the static seed by slug.
   Falls back to the seed while the request is in flight or when it fails. */
export function useCourseLibrary() {
  const { data } = useCourses({ limit: 100 });
  return useMemo(() => {
    const dbCourses = Array.isArray(data) ? data : data?.data?.courses || [];
    if (!dbCourses.length) return COURSES;
    const dbBySlug = new Map(dbCourses.map(c => [c.slug, c]));
    return [
      ...dbCourses.map(c => normalizeCourse(c)),
      ...COURSES.filter(c => !dbBySlug.has(c.slug)),
    ];
  }, [data]);
}
