import Articles from '@/modules/Main/Resources/Articles';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Articles',
  description:
    'Guides, breakdowns and interviews for the creator economy.',
  path: '/resources/articles',
});

export default function ArticlesPage() {
  return <Articles />;
}
