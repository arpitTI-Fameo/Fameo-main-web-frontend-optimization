import Landing from '@/modules/Main/Landing';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'For Fame & Recognition',
  description:
    'Fameo is an exclusive verified community for creators, influencers, celebrities, athletes and recognised public figures.',
  path: '/',
});

export default function Home() {
  return <Landing />;
}