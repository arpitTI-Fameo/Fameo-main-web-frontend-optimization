import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getModuleMastersAction, inviteModuleMasterAction, updateModuleMasterModulesAction, revokeModuleMasterAction } from '@/lib/services/admin/moduleMasters.service';

export const useAdminModuleMasters = (opts = {}) => useQuery({
    queryKey: ['admin', 'module-masters'],
    queryFn: getModuleMastersAction,
    ...opts
});

export const useInviteModuleMasterMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: inviteModuleMasterAction,
        ...opts
    });
    return { ...mutation, invite: mutation.mutateAsync };
};

export const useUpdateModuleMasterModulesMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, mods }) => updateModuleMasterModulesAction(id, mods),
        ...opts
    });
    return { ...mutation, updateModules: mutation.mutateAsync };
};

export const useRevokeModuleMasterMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: revokeModuleMasterAction,
        ...opts
    });
    return { ...mutation, revoke: mutation.mutateAsync };
};
