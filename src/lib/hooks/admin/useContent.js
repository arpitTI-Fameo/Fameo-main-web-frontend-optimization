import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminContent, updateAdminContentStatus, getAdminContentById, createAdminContent, updateAdminContent } from '@/lib/services/admin/content.service';
import { deleteContent } from '@/lib/services/admin/archive.service';

export const useAdminContent = (params, opts = {}) => useQuery({
    queryKey: ['admin', 'content', params.toString()],
    queryFn: () => getAdminContent(params),
    ...opts
});

export const useUpdateContentStatusMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, status }) => updateAdminContentStatus(id, status),
        ...opts
    });
    return { ...mutation, updateStatus: mutation.mutateAsync };
};

export const useDeleteContentMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteContent,
        ...opts
    });
    return { ...mutation, remove: mutation.mutateAsync };
};

export const useAdminContentById = (id, opts = {}) => useQuery({
    queryKey: ['admin', 'content', id],
    queryFn: () => getAdminContentById(id),
    ...opts
});

export const useSaveContentMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, isNew, form }) => isNew ? createAdminContent(form) : updateAdminContent(id, form),
        ...opts
    });
    return { ...mutation, saveContent: mutation.mutateAsync };
};
