import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CoursesAdmin from "@/modules/Admin/Courses";
import { getAdminCoursesAction } from '@/lib/services/admin/courses.service';
import { cookies } from 'next/headers';

export default async function CoursesPage() {
  const queryClient = new QueryClient();

  const cookieStore = cookies();
  const token = cookieStore.get('fameo_session')?.value || cookieStore.get('fameo_token')?.value;

  if (token) {
    await queryClient.prefetchQuery({
      queryKey: ['admin', 'courses'],
      queryFn: () => getAdminCoursesAction(),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursesAdmin />
    </HydrationBoundary>
  );
}
