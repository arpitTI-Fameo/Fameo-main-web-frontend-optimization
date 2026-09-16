import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverviewAction, getAnalyticsTopicsAction } from '@/lib/services/admin/analytics.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAnalyticsOverview = (opts = {}) => useQuery({
    queryKey: adminKeys.analyticsOverview(),
    queryFn: getAnalyticsOverviewAction,
    ...opts
});

export const useAnalyticsTopics = (opts = {}) => useQuery({
    queryKey: adminKeys.analyticsTopics(),
    queryFn: getAnalyticsTopicsAction,
    ...opts
});
