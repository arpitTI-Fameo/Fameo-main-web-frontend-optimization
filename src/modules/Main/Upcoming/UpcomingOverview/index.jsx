import Image from 'next/image';
import Link from 'next/link';
import { ROUTES, withQuery } from '@/constants/routes';
import { UPCOMING_FEATURES, UPCOMING_OVERVIEW } from '../constants';
import { ArrowUpRightIcon } from '../icons';
import UpcomingHeader from '../UpcomingHeader';

export default function UpcomingOverview() {
  return (
    <>
      <UpcomingHeader eyebrow={UPCOMING_OVERVIEW.title} intro={UPCOMING_OVERVIEW.description} />

      <ul className="upc-grid">
        {Object.entries(UPCOMING_FEATURES).map(([key, feature]) => (
          <li key={key}>
            <Link href={withQuery(ROUTES.UPCOMING, { source: key })} className="upc-tile">
              <div className="upc-tile-media">
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="upc-tile-date">{feature.date}</span>
              </div>
              <div className="upc-tile-body">
                <h2 className="upc-tile-title">{feature.title}</h2>
                <p className="upc-tile-desc">{feature.description}</p>
                <span className="upc-tile-foot">
                  View use cases
                  <span className="upc-go"><ArrowUpRightIcon /></span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
