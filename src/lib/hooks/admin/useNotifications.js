import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getNotificationsAction, sendNotificationAction } from '@/lib/services/admin/notifications.service';

export const useAdminNotifications = (opts = {}) => useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: getNotificationsAction,
    ...opts
});

export const useSendNotificationMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: sendNotificationAction,
        ...opts
    });
    return { ...mutation, sendNotificationAction: mutation.mutateAsync };
};
