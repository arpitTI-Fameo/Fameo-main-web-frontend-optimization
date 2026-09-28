import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Hire Talent',
  description:
    'Find and hire verified creators, influencers and public figures on Fameo.',
  path: ROUTES.TALENT_HIRE,
});

export default function TalentHirePage() {
  return (
    <div>
      <h1>Talent Hire</h1>
    </div>
  );
}