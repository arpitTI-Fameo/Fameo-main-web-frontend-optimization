import Landing from '@/modules/Main/Landing';

import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'For Fame & Recognition',
  description:
    'Fameo is an exclusive verified community for creators, influencers, celebrities, athletes and recognised public figures.',
  path: ROUTES.HOME,
});

export default function Home() {
  return <Landing />;
}