import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminCoursesAction = async () => {
  return createAdminAction({
    url: adminEndpoints.coursesList(),
    method: 'GET',
  });
};

export const getAdminCourseAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.course(id),
    method: 'GET',
  });
};

export const createAdminCourseAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.coursesCreate(),
    method: 'POST',
    body: form,
  });
};

export const updateAdminCourseAction = async (id, form) => {
  return createAdminAction({
    url: adminEndpoints.course(id),
    method: 'PUT',
    body: form,
  });
};

export const deleteAdminCourseAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.course(id),
    method: 'DELETE',
  });
};

export const togglePublishAdminCourseAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.courseTogglePublish(id),
    method: 'PATCH',
  });
};

// PATCH with an empty body, matching togglePublish. Endpoint confirmed against
// the pre-refactor implementation: api.patch(`/courses/admin/${id}/feature`, {}).
export const toggleFeatureAdminCourseAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.courseFeature(id),
    method: 'PATCH',
  });
};
