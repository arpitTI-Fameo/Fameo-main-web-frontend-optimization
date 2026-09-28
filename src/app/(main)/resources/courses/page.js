import Courses from '@/modules/Main/Resources/Courses';

import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Courses',
  description:
    'Structured courses for creators, taught by people who have built an audience.',
  path: ROUTES.COURSES,
});

export default function CoursesPage() {
  return <Courses />;
}
