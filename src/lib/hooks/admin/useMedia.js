import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getMediaAction, uploadMediaAction, deleteMediaItemAction } from '@/lib/services/admin/media.service';

export const useAdminMedia = (opts = {}) => useQuery({
    queryKey: ['admin', 'media'],
    queryFn: getMediaAction,
    ...opts
});

export const useUploadMediaMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: uploadMediaAction,
        ...opts
    });
    return { ...mutation, upload: mutation.mutateAsync };
};

export const useDeleteMediaMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteMediaItemAction,
        ...opts
    });
    return { ...mutation, remove: mutation.mutateAsync };
};
