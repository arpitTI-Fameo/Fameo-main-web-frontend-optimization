import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ContentOS from "@/modules/Admin/ContentOS";
import { getAdminContentServer } from '@/lib/services/admin/admin.server';
import { hasSession } from '@/lib/auth/session';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export default async function ContentPage() {
  const queryClient = new QueryClient();

  // `cookies()` returns a Promise in Next 16 — the previous synchronous
  // `cookies().get(...)` threw `cookieStore.get is not a function` on EVERY
  // render of this page. hasSession() awaits it, and keeps the cookie names in
  // lib/auth/session.js rather than duplicating them here.
  if (await hasSession()) {
    // Initial fetch usually has page 1
    const params = new URLSearchParams({ page: 1, limit: 10 });
    await queryClient.prefetchQuery({
      queryKey: adminKeys.contentList(params.toString()),
      queryFn: () => getAdminContentServer(params),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentOS />
    </HydrationBoundary>
  );
}
