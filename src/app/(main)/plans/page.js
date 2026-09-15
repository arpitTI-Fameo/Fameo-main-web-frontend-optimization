import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Plans from '@/modules/Main/Plans';
import { buildMetadata } from '@/lib/seo/metadata';
import { subscriptionKeys } from '@/lib/hooks/main/useSubscription';
import { getPlansServer } from '@/lib/services/main/prefetch.server';

export const metadata = buildMetadata({
  title: 'Membership Plans',
  description:
    'Compare Fameo membership tiers and pick the one that matches how you create.',
  path: '/plans',
});

export default async function PlansPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => getPlansServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Plans />
    </HydrationBoundary>
  );
}
