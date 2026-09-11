import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getNotifications, sendNotification } from '@/lib/services/admin/notifications.service';

export const useAdminNotifications = (opts = {}) => useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: getNotifications,
    ...opts
});

export const useSendNotificationMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: sendNotification,
        ...opts
    });
    return { ...mutation, sendNotification: mutation.mutateAsync };
};
