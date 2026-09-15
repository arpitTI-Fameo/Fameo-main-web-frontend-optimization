import Courses from '@/modules/Main/Resources/Courses';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Courses',
  description:
    'Structured courses for creators, taught by people who have built an audience.',
  path: '/resources/courses',
});

export default function CoursesPage() {
  return <Courses />;
}
