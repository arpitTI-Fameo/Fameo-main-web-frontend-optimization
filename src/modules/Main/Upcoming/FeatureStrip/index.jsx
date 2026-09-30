// modules/Main/Upcoming/FeatureStrip/index.jsx
// One line of links to every upcoming feature, spread edge to edge.

import Link from 'next/link';

import IconItem from '@/components/Common/IconItem';
import { cn } from '@/utils/cn';

import { UPCOMING_FEATURES } from '../constants';
import { featureHref } from '../helpers';

export default function FeatureStrip({ exclude, id, className }) {
  const features = Object.entries(UPCOMING_FEATURES).filter(([key]) => key !== exclude);
  return (
    <nav id={id} aria-label="Upcoming features" className={cn('scroll-mt-24 border-y pt-7.75 pb-7.5', className)}>
      <ul className="flex flex-wrap justify-between gap-x-8 gap-y-4">
        {features.map(([key, feature]) => (
          <li key={key}>
            <Link
              href={featureHref(key)}
              className="group block rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <IconItem
                icon={feature.icon}
                title={feature.label}
                size="row"
                className="transition-colors group-hover:text-foreground motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
