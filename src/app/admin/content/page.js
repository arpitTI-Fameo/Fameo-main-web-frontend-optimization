import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ContentOS from "@/modules/Admin/ContentOS";
import { getAdminContentAction } from '@/lib/services/admin/content.service';
import { cookies } from 'next/headers';

export default async function ContentPage() {
  const queryClient = new QueryClient();

  const cookieStore = cookies();
  const token = cookieStore.get('fameo_session')?.value || cookieStore.get('fameo_token')?.value;

  if (token) {
    // Initial fetch usually has page 1
    const params = new URLSearchParams({ page: 1, limit: 10 });
    await queryClient.prefetchQuery({
      queryKey: ['admin', 'content', params.toString()],
      queryFn: () => getAdminContentAction(params),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentOS />
    </HydrationBoundary>
  );
}
