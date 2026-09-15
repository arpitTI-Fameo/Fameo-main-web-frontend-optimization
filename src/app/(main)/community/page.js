import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CommunityLayout from '@/modules/Main/Community';
import { communityKeys } from '@/lib/hooks/main/useCommunity';
import { getSpacesAction } from '@/lib/services/main/community.api';

export const metadata = { title: 'Community — Fameo' };

export default async function CommunityPage({ searchParams }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: communityKeys.spaces(),
    queryFn: () => getSpacesAction(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityLayout initialPage="home" searchParams={searchParams} />
    </HydrationBoundary>
  );
}
