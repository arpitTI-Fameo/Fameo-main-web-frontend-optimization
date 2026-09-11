import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverview, getAnalyticsTopics } from '@/lib/services/admin/analytics.service';

export const useAnalyticsOverview = (opts = {}) => useQuery({
    queryKey: ['admin', 'analytics', 'overview'],
    queryFn: getAnalyticsOverview,
    ...opts
});

export const useAnalyticsTopics = (opts = {}) => useQuery({
    queryKey: ['admin', 'analytics', 'topics'],
    queryFn: getAnalyticsTopics,
    ...opts
});
