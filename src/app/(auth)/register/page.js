import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import FameoRegisterFlow from '@/modules/Auth/Register';
import { getStates, getCategories } from '@/lib/services/register/register.server';
import { registerKeys } from '@/lib/services/register/register.keys';

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
