// modules/Main/Upcoming/UpcomingOverview/index.jsx
// /upcoming — "What's next": every feature in the works, one block each.

import ArrowButton from '@/components/Common/ArrowButton';
import InfoNote from '@/components/Common/InfoNote';
import SectionHeading from '@/components/Common/SectionHeading';

import FeatureCard from '../FeatureCard';
import FeatureSpotlight from '../FeatureSpotlight';
import FeatureStrip from '../FeatureStrip';
import MembershipPanel from '../MembershipPanel';
import PlannedFeature from '../PlannedFeature';
import UpcomingClosing from '../UpcomingClosing';
import UpcomingHero from '../UpcomingHero';
import {
  FIRST_LOOK_ID,
  UPCOMING_FEATURES as FEATURES,
  UPCOMING_NOTE,
  UPCOMING_TOOLS as TOOLS,
} from '../constants';
import { featureEyebrow, featureHref } from '../helpers';

/* The two tool cards, and where each photo sits in its 532 × 238 frame. */
const TOOLS_CROP = {
  products: undefined,
  'talent-hire': 'object-[50%_55%] scale-[1.11] origin-[66%_100%]',
};
const PLANNED_KEYS = ['account', 'support'];

export default function UpcomingOverview() {
  const community = FEATURES.community;

  return (
    <>
      <UpcomingHero />
      <FeatureStrip id={FIRST_LOOK_ID} />

      <FeatureSpotlight
        preload
        className="mt-10.5"
        eyebrow={featureEyebrow(community)}
        headline={community.headline}
        text={community.teaser}
        chips={community.highlights}
        image={community.image}
        note={community.note}
      >
        <div className="mt-3 flex">
          <ArrowButton href={featureHref('community')}>{community.link}</ArrowButton>
        </div>
      </FeatureSpotlight>

      <section className="mt-10.5">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading size="section" title={TOOLS.title} accent={TOOLS.accent} />
          <p className="text-xs leading-[1.75] text-muted-foreground">
            {TOOLS.aside[0]}
            <br />
            {TOOLS.aside[1]}
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 md:gap-6">
          {Object.entries(TOOLS_CROP).map(([key, crop]) => (
            <FeatureCard key={key} featureKey={key} feature={FEATURES[key]} badge={TOOLS.badge} imageClassName={crop} />
          ))}
        </div>
      </section>

      <MembershipPanel featureKey="plans" feature={FEATURES.plans} />

      <div className="mt-9.5 grid gap-8 md:grid-cols-2 md:gap-9">
        {PLANNED_KEYS.map(key => (
          <PlannedFeature key={key} featureKey={key} feature={FEATURES[key]} />
        ))}
      </div>

      <InfoNote className="mt-15 max-w-154">{UPCOMING_NOTE}</InfoNote>
      <UpcomingClosing className="mt-6" />
    </>
  );
}
