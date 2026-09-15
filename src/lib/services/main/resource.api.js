
import { createServerAction } from '@/lib/api/action';
// services/resource/resource.client.js
// The resource service: every resource HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useResource.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { resourceEndpoints } from '@/lib/api/endpoints';

export const getCoursesAction = async (params) => {
  return createServerAction({
    url: resourceEndpoints.courses(),
    method: 'GET',
  });
};

export const getCourseAction = async (slug) => {
  return createServerAction({
    url: resourceEndpoints.course(slug),
    method: 'GET',
  });
};

export const getLearningsAction = async () => {
  return createServerAction({
    url: resourceEndpoints.learnings(),
    method: 'GET',
  });
};

export const getSavedResourcesAction = async () => {
  return createServerAction({
    url: resourceEndpoints.saved(),
    method: 'GET',
  });
};

export const enrollAction = async (id) => {
  return createServerAction({
    url: resourceEndpoints.enroll(id),
    method: 'POST',
  });
};

export const updateProgressAction = async ({ id, data }) => {
  return createServerAction({
    url: resourceEndpoints.updateProgress(id),
    method: 'POST',
    body: data,
  });
};
