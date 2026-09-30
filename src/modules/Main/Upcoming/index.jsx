// modules/Main/Upcoming/index.jsx
// /upcoming and /upcoming?source=<key>. Drawn at full width (~1446px), so the
// page renders 1:1 rather than growing with the viewport like other Fameo pages.

import FameoPage from '@/components/Layout/FameoPage';

import UpcomingDetail from './UpcomingDetail';
import UpcomingOverview from './UpcomingOverview';
import { UPCOMING_FEATURES } from './constants';

export default function Upcoming({ source }) {
  const key = Object.hasOwn(UPCOMING_FEATURES, source ?? '') ? source : null;

  return (
    <main>
      <FameoPage fixedScale className="max-w-6xl pb-10 lg:px-8">
        {key ? <UpcomingDetail featureKey={key} feature={UPCOMING_FEATURES[key]} /> : <UpcomingOverview />}
      </FameoPage>
    </main>
  );
}
