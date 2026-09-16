import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminStatsAction, getAdminActivityAction, getAdminSettingsAction, updateAdminFeatureFlagAction } from '@/lib/services/admin/overview.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminStats = (opts = {}) => useQuery({
    queryKey: adminKeys.stats(),
    queryFn: getAdminStatsAction,
    ...opts
});

export const useAdminActivity = (limit, opts = {}) => useQuery({
    queryKey: adminKeys.activity(limit),
    queryFn: () => getAdminActivityAction(limit),
    ...opts
});

export const useAdminSettings = (opts = {}) => useQuery({
    queryKey: adminKeys.settings(),
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
