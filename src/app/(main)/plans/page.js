import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Plans from '@/modules/Main/Plans';
import { buildMetadata } from '@/lib/seo/metadata';
import { subscriptionKeys } from '@/lib/hooks/main/useSubscription';
import { getPlansServer } from '@/lib/services/main/prefetch.server';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Membership Plans',
  description:
    'Compare Fameo membership tiers and pick the one that matches how you create.',
  path: ROUTES.PLANS,
});

export default async function PlansPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: subscriptionKeys.plans(),
    // Cache only the plans themselves (the shape usePlans returns). On a
    // failure nothing is cached, so the browser fetches them with the session.
    queryFn: async () => {
      const response = await getPlansServer();
      if (!response.code) throw response;
      return response.result;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Plans />
    </HydrationBoundary>
  );
}
