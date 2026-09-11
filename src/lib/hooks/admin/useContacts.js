import { useQuery } from '@tanstack/react-query';
import { getAdminContacts } from '@/lib/services/admin/contacts.service';

export const useAdminContacts = (search, roleFilter, opts = {}) => useQuery({
    queryKey: ['admin', 'contacts', { search, roleFilter }],
    queryFn: () => getAdminContacts(search, roleFilter),
    ...opts
});
