import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import FameoRegisterFlow from '@/modules/Auth/Register';
import { getStates, getCategories } from '@/lib/services/auth/register.server';
import { registerKeys } from '@/lib/hooks/auth/useRegister';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Create Account',
  description:
    'Join Fameo — the verified community for creators and public figures.',
  path: '/register',
});

export default async function RegisterPage() {
  const queryClient = new QueryClient();

  // Prefetch master data on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: registerKeys.states(),
      queryFn: () => getStates(),
    }),
    queryClient.prefetchQuery({
      queryKey: registerKeys.categories(),
      queryFn: () => getCategories(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FameoRegisterFlow />
    </HydrationBoundary>
  );
}
