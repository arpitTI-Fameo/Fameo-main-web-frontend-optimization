import { useQuery } from '@tanstack/react-query';
import { getAdminLearnersAction, getAdminLearnerAction } from '@/lib/services/admin/learners.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminLearners = (params, opts = {}) => useQuery({
    queryKey: [...adminKeys.all(), 'learners', params ?? {}],
    queryFn: () => getAdminLearnersAction(params),
    ...opts
});

export const useAdminLearner = (id, opts = {}) => useQuery({
    queryKey: [...adminKeys.all(), 'learner', id],
    queryFn: () => getAdminLearnerAction(id),
    enabled: Boolean(id),
    ...opts
});
