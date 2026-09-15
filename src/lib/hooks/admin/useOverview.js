import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminStatsAction, getAdminActivityAction, getAdminSettingsAction, updateAdminFeatureFlagAction } from '@/lib/services/admin/overview.service';

export const useAdminStats = (opts = {}) => useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStatsAction,
    ...opts
});

export const useAdminActivity = (limit, opts = {}) => useQuery({
    queryKey: ['admin', 'activity', { limit }],
    queryFn: () => getAdminActivityAction(limit),
    ...opts
});

export const useAdminSettings = (opts = {}) => useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: getAdminSettingsAction,
    ...opts
});

export const useUpdateAdminFeatureFlagMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: updateAdminFeatureFlagAction,
        ...opts
    });
    return { ...mutation, toggleFlag: mutation.mutateAsync };
};
