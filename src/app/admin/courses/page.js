import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CoursesAdmin from "@/modules/Admin/Courses";
import { getAdminCoursesServer } from '@/lib/services/admin/admin.server';
import { hasSession } from '@/lib/auth/session';

export default async function CoursesPage() {
  const queryClient = new QueryClient();

  // `cookies()` returns a Promise in Next 16 — the previous synchronous
  // `cookies().get(...)` threw `cookieStore.get is not a function` on EVERY
  // render of this page. hasSession() awaits it, and keeps the cookie names in
  // lib/auth/session.js rather than duplicating them here.
  if (await hasSession()) {
    await queryClient.prefetchQuery({
      queryKey: ['admin', 'courses'],
      queryFn: () => getAdminCoursesServer(),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursesAdmin />
    </HydrationBoundary>
  );
}
