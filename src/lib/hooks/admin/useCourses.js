import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminCourses, getAdminCourse, createAdminCourse, updateAdminCourse, deleteAdminCourse, togglePublishAdminCourse, toggleFeatureAdminCourse } from '@/lib/services/admin/courses.service';

export const useAdminCourses = (opts = {}) => useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: getAdminCourses,
    ...opts
});

export const useAdminCourse = (id, opts = {}) => useQuery({
    queryKey: ['admin', 'courses', id],
    queryFn: () => getAdminCourse(id),
    ...opts
});

export const useCreateAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: createAdminCourse,
        ...opts
    });
    return { ...mutation, createCourse: mutation.mutateAsync };
};

export const useUpdateAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, form }) => updateAdminCourse(id, form),
        ...opts
    });
    return { ...mutation, updateCourse: mutation.mutateAsync };
};

export const useDeleteAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteAdminCourse,
        ...opts
    });
    return { ...mutation, deleteCourse: mutation.mutateAsync };
};

export const useTogglePublishAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: togglePublishAdminCourse,
        ...opts
    });
    return { ...mutation, togglePublish: mutation.mutateAsync };
};

export const useToggleFeatureAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: toggleFeatureAdminCourse,
        ...opts
    });
    return { ...mutation, toggleFeature: mutation.mutateAsync };
};
