import Articles from '@/modules/Main/Resources/Articles';

import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Articles',
  description:
    'Guides, breakdowns and interviews for the creator economy.',
  path: ROUTES.ARTICLES,
});

export default function ArticlesPage() {
  return <Articles />;
}
