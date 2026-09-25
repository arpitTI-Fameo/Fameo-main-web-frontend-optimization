import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';

/** params: { search?, page?, limit? (≤ 100) } */
export const getAdminLearnersAction = async (params) => {
  return createAdminAction({
    url: adminEndpoints.learners(),
    method: 'GET',
    params,
  });
};

/** A learner with their enrollments. */
export const getAdminLearnerAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.learner(id),
    method: 'GET',
  });
};
