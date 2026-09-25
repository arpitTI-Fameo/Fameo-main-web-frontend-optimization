
import { createServerAction } from '@/lib/api/action';
// services/resource/resource.client.js
// The resource service: every resource HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useResource.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import {
  resourceEndpoints,
  topicEndpoints,
  publishedCourseEndpoints,
} from '@/lib/api/endpoints';

export const getCoursesAction = async (params) => {
  return createServerAction({
    url: resourceEndpoints.courses(),
    method: 'GET',
    // category, search, sortBy, page, limit → query string
    ...(params ? { body: params } : {}),
  });
};

export const getCourseAction = async (slug) => {
  return createServerAction({
    url: resourceEndpoints.course(slug),
    method: 'GET',
  });
};

/** The signed-in learner's enrolled courses (with progress). */
export const getLearningsAction = async () =>
  createServerAction({ url: resourceEndpoints.myCourses(), method: 'GET' });

export const enrollAction = async (slug) =>
  createServerAction({ url: resourceEndpoints.enroll(slug), method: 'POST' });

/** updateProgressAction({ id: courseSlug, data: { lessonId } }). */
export const updateProgressAction = async ({ id, data }) =>
  createServerAction({ url: resourceEndpoints.updateProgress(id), method: 'PATCH', body: data });

/** reviewCourseAction({ slug, data: { rating: 1–5, review? } }). */
export const reviewCourseAction = async ({ slug, data }) =>
  createServerAction({ url: resourceEndpoints.review(slug), method: 'POST', body: data });

export const getCourseNotesAction = async (slug, lessonId) =>
  createServerAction({
    url: resourceEndpoints.notes(slug),
    method: 'GET',
    ...(lessonId ? { body: { lessonId } } : {}),
  });

/** addCourseNoteAction({ slug, data: { lessonId, text } }). */
export const addCourseNoteAction = async ({ slug, data }) =>
  createServerAction({ url: resourceEndpoints.notes(slug), method: 'POST', body: data });

export const deleteCourseNoteAction = async (noteId) =>
  createServerAction({ url: resourceEndpoints.note(noteId), method: 'DELETE' });

// ── Learner Hub topics (public) ─────────────────────────────────────────────
export const getTopicsAction = async (params) =>
  createServerAction({ url: topicEndpoints.list(), method: 'GET', ...(params ? { body: params } : {}) });

export const getTopicAction = async (slug) =>
  createServerAction({ url: topicEndpoints.bySlug(slug), method: 'GET' });

export const getModuleTopicsAction = async (moduleId) =>
  createServerAction({ url: topicEndpoints.byModule(moduleId), method: 'GET' });

// ── Published course catalogue (content/courses, public) ────────────────────
export const getPublishedCoursesAction = async (params) =>
  createServerAction({
    url: publishedCourseEndpoints.list(),
    method: 'GET',
    ...(params ? { body: params } : {}),
  });

export const getPublishedCourseAction = async (slug) =>
  createServerAction({ url: publishedCourseEndpoints.bySlug(slug), method: 'GET' });
