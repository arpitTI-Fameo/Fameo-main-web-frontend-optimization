// Route: /upcoming?source=<feature>

import Upcoming from '@/modules/Main/Upcoming';

import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Coming Soon',
  path: ROUTES.UPCOMING,
  noIndex: true,
});

export default async function UpcomingPage({ searchParams }) {
  const { source } = await searchParams;
  return <Upcoming source={source} />;
}
