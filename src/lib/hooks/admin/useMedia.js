import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getMedia, uploadMedia, deleteMediaItem } from '@/lib/services/admin/media.service';

export const useAdminMedia = (opts = {}) => useQuery({
    queryKey: ['admin', 'media'],
    queryFn: getMedia,
    ...opts
});

export const useUploadMediaMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: uploadMedia,
        ...opts
    });
    return { ...mutation, upload: mutation.mutateAsync };
};

export const useDeleteMediaMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteMediaItem,
        ...opts
    });
    return { ...mutation, remove: mutation.mutateAsync };
};
