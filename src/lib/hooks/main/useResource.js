'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { resourceKeys } from '@/lib/services/resource/resource.keys';
import {
  enroll, getCourse, getCourses, getLearnings, getSavedResources, updateProgress,
} from '@/lib/services/resource/resource.client';

export const useCourses = (params = {}, opts = {}) => useQuery({
  queryKey: [...resourceKeys.courses(), params],
  queryFn: () => getCourses(params),
  ...opts,
});

export const useCourse = (slug, opts = {}) => useQuery({
  queryKey: resourceKeys.course(slug),
  queryFn: () => getCourse(slug),
  enabled: Boolean(slug),
  ...opts,
});

export const useLearnings = (opts = {}) => useQuery({
  queryKey: resourceKeys.learnings(),
  queryFn: getLearnings,
  ...opts,
});

export const useSavedResources = (opts = {}) => useQuery({
  queryKey: resourceKeys.saved(),
  queryFn: getSavedResources,
  ...opts,
});

export const useEnrollMutation = (opts = {}) => useApiMutation({
  mutationFn: enroll,
  invalidate: [resourceKeys.learnings()],
  ...opts,
});

export const useUpdateProgressMutation = (opts = {}) => useApiMutation({
  mutationFn: updateProgress,
  ...opts,
});
