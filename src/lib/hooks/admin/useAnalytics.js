import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverviewAction, getAnalyticsTopicsAction } from '@/lib/services/admin/analytics.service';

export const useAnalyticsOverview = (opts = {}) => useQuery({
    queryKey: ['admin', 'analytics', 'overview'],
    queryFn: getAnalyticsOverviewAction,
    ...opts
});

export const useAnalyticsTopics = (opts = {}) => useQuery({
    queryKey: ['admin', 'analytics', 'topics'],
    queryFn: getAnalyticsTopicsAction,
    ...opts
});
