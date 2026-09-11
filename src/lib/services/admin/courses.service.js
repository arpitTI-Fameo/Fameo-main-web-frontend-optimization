import { adminFetch } from './core';

export const getAdminCourses = () => adminFetch("/courses/admin/list");

export const getAdminCourse = (id) => adminFetch(`/courses/admin/${id}`);

export const createAdminCourse = (form) => adminFetch("/courses/admin", { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });

export const updateAdminCourse = (id, form) => adminFetch(`/courses/admin/${id}`, { method: 'PUT', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });

export const deleteAdminCourse = (id) => adminFetch(`/courses/admin/${id}`, { method: 'DELETE' });

export const togglePublishAdminCourse = (id) => adminFetch(`/courses/admin/${id}/toggle-publish`, { method: 'PATCH', headers: { "Content-Type": "application/json" } });

// PATCH with an empty body, matching togglePublish. Endpoint confirmed against
// the pre-refactor implementation: api.patch(`/courses/admin/${id}/feature`, {}).
export const toggleFeatureAdminCourse = (id) => adminFetch(`/courses/admin/${id}/feature`, { method: 'PATCH', headers: { "Content-Type": "application/json" } });
