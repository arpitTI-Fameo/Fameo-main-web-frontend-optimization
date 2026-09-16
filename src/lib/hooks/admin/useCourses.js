import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminCoursesAction, getAdminCourseAction, createAdminCourseAction, updateAdminCourseAction, deleteAdminCourseAction, togglePublishAdminCourseAction, toggleFeatureAdminCourseAction } from '@/lib/services/admin/courses.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminCourses = (opts = {}) => useQuery({
    queryKey: adminKeys.courses(),
    queryFn: getAdminCoursesAction,
    ...opts
});

export const useAdminCourse = (id, opts = {}) => useQuery({
    queryKey: adminKeys.course(id),
    queryFn: () => getAdminCourseAction(id),
    ...opts
});

export const useCreateAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: createAdminCourseAction,
        ...opts
    });
    return { ...mutation, createCourse: mutation.mutateAsync };
};

export const useUpdateAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, form }) => updateAdminCourseAction(id, form),
        ...opts
    });
    return { ...mutation, updateCourse: mutation.mutateAsync };
};

export const useDeleteAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteAdminCourseAction,
        ...opts
    });
    return { ...mutation, deleteCourse: mutation.mutateAsync };
};

export const useTogglePublishAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: togglePublishAdminCourseAction,
        ...opts
    });
    return { ...mutation, togglePublish: mutation.mutateAsync };
};

export const useToggleFeatureAdminCourseMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: toggleFeatureAdminCourseAction,
        ...opts
    });
    return { ...mutation, toggleFeature: mutation.mutateAsync };
};
