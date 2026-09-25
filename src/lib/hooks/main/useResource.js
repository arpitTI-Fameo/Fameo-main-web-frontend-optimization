import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getCoursesAction,
  getCourseAction,
  getLearningsAction,
  enrollAction,
  updateProgressAction,
  reviewCourseAction,
  getCourseNotesAction,
  addCourseNoteAction,
  deleteCourseNoteAction,
  getTopicsAction,
  getTopicAction,
  getModuleTopicsAction,
  getPublishedCoursesAction,
  getPublishedCourseAction,
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const resourceKeys = {
  all: () => ['resource'],
  courses: () => [...resourceKeys.all(), 'courses'],
  course: (slug) => [...resourceKeys.courses(), slug],
    learnings: () => [...resourceKeys.all(), 'learnings'],
  notes: (slug, lessonId) => [...resourceKeys.all(), 'notes', slug, lessonId ?? null],
  topics: (params) => [...resourceKeys.all(), 'topics', params ?? {}],
  topic: (slug) => [...resourceKeys.all(), 'topic', slug],
  moduleTopics: (moduleId) => [...resourceKeys.all(), 'topics', 'module', moduleId],
  published: (params) => [...resourceKeys.all(), 'published', params ?? {}],
  publishedCourse: (slug) => [...resourceKeys.all(), 'published', slug],
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
  invalidate: [resourceKeys.learnings()],
  ...opts,
});

/** Throw a failed action envelope; else its result. */
const resultOf = (action) => async (...args) => {
  const response = await action(...args);
  if (!response.code) throw response;
  return response.result;
};

export const useReviewCourseMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(reviewCourseAction),
  invalidate: [resourceKeys.courses(), resourceKeys.learnings()],
  ...opts,
});

export const useCourseNotes = (slug, lessonId, opts = {}) => useQuery({
  queryKey: resourceKeys.notes(slug, lessonId),
  queryFn: () => resultOf(getCourseNotesAction)(slug, lessonId),
  enabled: Boolean(slug),
  ...opts,
});

export const useAddCourseNoteMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(addCourseNoteAction),
  invalidate: [[...resourceKeys.all(), 'notes']],
  ...opts,
});

export const useDeleteCourseNoteMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(deleteCourseNoteAction),
  invalidate: [[...resourceKeys.all(), 'notes']],
  ...opts,
});

export const useTopics = (params, opts = {}) => useQuery({
  queryKey: resourceKeys.topics(params),
  queryFn: () => resultOf(getTopicsAction)(params),
  ...opts,
});

export const useTopic = (slug, opts = {}) => useQuery({
  queryKey: resourceKeys.topic(slug),
  queryFn: () => resultOf(getTopicAction)(slug),
  enabled: Boolean(slug),
  ...opts,
});

export const useModuleTopics = (moduleId, opts = {}) => useQuery({
  queryKey: resourceKeys.moduleTopics(moduleId),
  queryFn: () => resultOf(getModuleTopicsAction)(moduleId),
  enabled: moduleId !== undefined && moduleId !== null,
  ...opts,
});

export const usePublishedCourses = (params, opts = {}) => useQuery({
  queryKey: resourceKeys.published(params),
  queryFn: () => resultOf(getPublishedCoursesAction)(params),
  ...opts,
});

export const usePublishedCourse = (slug, opts = {}) => useQuery({
  queryKey: resourceKeys.publishedCourse(slug),
  queryFn: () => resultOf(getPublishedCourseAction)(slug),
  enabled: Boolean(slug),
  ...opts,
});
