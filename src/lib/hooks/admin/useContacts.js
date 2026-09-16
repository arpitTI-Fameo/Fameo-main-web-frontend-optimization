import { useQuery } from '@tanstack/react-query';
import { getAdminContacts } from '@/lib/services/admin/contacts.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminContacts = (search, roleFilter, opts = {}) => useQuery({
    queryKey: adminKeys.contacts(search, roleFilter),
    queryFn: () => getAdminContacts(search, roleFilter),
    ...opts
});
