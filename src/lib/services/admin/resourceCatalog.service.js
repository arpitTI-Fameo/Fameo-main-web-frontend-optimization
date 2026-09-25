// Admin view of the learner resource catalogue (static courses + DB overrides).
import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';

export const getAdminResourceStatsAction = async () => {
  return createAdminAction({ url: adminEndpoints.resourceStats(), method: 'GET' });
};

/** params: { status?: 'published' | 'draft' | 'all' } */
export const getAdminResourceCoursesAction = async (params) => {
  return createAdminAction({ url: adminEndpoints.resourceCourses(), method: 'GET', params });
};

export const toggleAdminResourceCourseAction = async (slug) => {
  return createAdminAction({ url: adminEndpoints.resourceTogglePublish(slug), method: 'PATCH' });
};

/** FormData with the video in the `video` field. */
export const uploadAdminLessonVideoAction = async (id, chapterId, formData) => {
  return createAdminAction({
    url: adminEndpoints.resourceLessonUpload(id, chapterId),
    method: 'POST',
    body: formData,
  });
};
