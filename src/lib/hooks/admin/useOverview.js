import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminStats, getAdminActivity, getAdminSettings, updateAdminFeatureFlag } from '@/lib/services/admin/overview.service';

export const useAdminStats = (opts = {}) => useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
    ...opts
});

export const useAdminActivity = (limit, opts = {}) => useQuery({
    queryKey: ['admin', 'activity', { limit }],
    queryFn: () => getAdminActivity(limit),
    ...opts
});

export const useAdminSettings = (opts = {}) => useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: getAdminSettings,
    ...opts
});

export const useUpdateAdminFeatureFlagMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: updateAdminFeatureFlag,
        ...opts
    });
    return { ...mutation, toggleFlag: mutation.mutateAsync };
};
