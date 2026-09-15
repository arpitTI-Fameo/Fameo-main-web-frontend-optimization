import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Plans from '@/modules/Main/Plans';
import { buildMetadata } from '@/lib/seo/metadata';
import { subscriptionKeys } from '@/lib/hooks/main/useSubscription';
import { getPlansAction } from '@/lib/services/main/subscription.api';

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
    queryFn: () => getPlansAction(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Plans />
    </HydrationBoundary>
  );
}
