import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getCoursesAction,
  getCourseAction,
  getLearningsAction,
  getSavedResourcesAction,
  enrollAction,
  updateProgressAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const resourceKeys = {
  all: () => ['resource'],
  courses: () => [...resourceKeys.all(), 'courses'],
  course: (slug) => [...resourceKeys.courses(), slug],
  articles: () => [...resourceKeys.all(), 'articles'],
  article: (slug) => [...resourceKeys.articles(), slug],
  learnings: () => [...resourceKeys.all(), 'learnings'],
  saved: () => [...resourceKeys.all(), 'saved'],
};



export const useCourses = (params = {}, opts = {}) => useQuery({

  queryKey: [...resourceKeys.courses(), params],
  queryFn: async () => {
    const response = await getCoursesAction(params);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useCourse = (slug, opts = {}) => useQuery({

  queryKey: resourceKeys.course(slug),
  queryFn: async () => {
    const response = await getCourseAction(slug);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(slug),
  ...opts,
});

export const useLearnings = (opts = {}) => useQuery({

  queryKey: resourceKeys.learnings(),
  queryFn: async () => {
    const response = await getLearningsAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useSavedResources = (opts = {}) => useQuery({

  queryKey: resourceKeys.saved(),
  queryFn: async () => {
    const response = await getSavedResourcesAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useEnrollMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await enrollAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [resourceKeys.learnings()],
  ...opts,
});

export const useUpdateProgressMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await updateProgressAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});
