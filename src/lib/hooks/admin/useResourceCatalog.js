import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
    getAdminResourceStatsAction,
    getAdminResourceCoursesAction,
    toggleAdminResourceCourseAction,
    uploadAdminLessonVideoAction,
} from '@/lib/services/admin/resourceCatalog.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

const resourceCatalogKey = () => [...adminKeys.all(), 'resource-catalog'];

export const useAdminResourceStats = (opts = {}) => useQuery({
    queryKey: [...resourceCatalogKey(), 'stats'],
    queryFn: getAdminResourceStatsAction,
    ...opts
});

export const useAdminResourceCourses = (params, opts = {}) => useQuery({
    queryKey: [...resourceCatalogKey(), 'courses', params ?? {}],
    queryFn: () => getAdminResourceCoursesAction(params),
    ...opts
});

export const useToggleAdminResourceCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: toggleAdminResourceCourseAction,
        invalidate: [resourceCatalogKey()],
        ...opts
    });
    return { ...mutation, togglePublish: mutation.mutateAsync };
};

/** mutateAsync({ id, chapterId, formData }) → { url, public_id }. */
export const useUploadAdminLessonVideoMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, chapterId, formData }) => uploadAdminLessonVideoAction(id, chapterId, formData),
        ...opts
    });
    return { ...mutation, uploadLesson: mutation.mutateAsync };
};
