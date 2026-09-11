import { useQuery } from '@tanstack/react-query';
import { getAdminRevenue } from '@/lib/services/admin/revenue.service';

export const useAdminRevenue = (opts = {}) => useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: getAdminRevenue,
    ...opts
});
