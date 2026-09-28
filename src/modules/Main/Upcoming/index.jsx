import { UPCOMING_FEATURES } from './constants';
import UpcomingOverview from './UpcomingOverview';
import UpcomingDetail from './UpcomingDetail';
import { S } from './styles';

export default function Upcoming({ source }) {
  const feature = Object.hasOwn(UPCOMING_FEATURES, source ?? '') ? UPCOMING_FEATURES[source] : null;

  return (
    <main className="upc-page">
      <style>{S}</style>
      {feature ? <UpcomingDetail feature={feature} /> : <UpcomingOverview />}
    </main>
  );
}
