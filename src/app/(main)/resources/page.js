import Resources from '@/modules/Main/Resources';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Resources',
  description:
    'Courses, articles and learning paths to help creators grow their craft and their audience.',
  path: '/resources',
});

export default function ResourcesPage() {
  return <Resources />;
}
