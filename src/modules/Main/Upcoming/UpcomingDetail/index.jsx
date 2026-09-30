// modules/Main/Upcoming/UpcomingDetail/index.jsx
// /upcoming?source=<key> — one feature: what it is, how creators will use it,
// and what else is on the way.

import { ArrowDown, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

import ArrowButton from '@/components/Common/ArrowButton';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import Eyebrow from '@/components/Common/Eyebrow';
import IconTile from '@/components/Common/IconTile';
import InfoNote from '@/components/Common/InfoNote';
import SectionHeading from '@/components/Common/SectionHeading';

import FeatureSpotlight from '../FeatureSpotlight';
import FeatureStrip from '../FeatureStrip';
import UpcomingClosing from '../UpcomingClosing';
import { FIRST_LOOK_ID, UPCOMING_NOTE } from '../constants';
import { featureEyebrow } from '../helpers';

const USE_CASES_ID = 'use-cases';

export default function UpcomingDetail({ featureKey, feature }) {
  return (
    <>
      <Breadcrumbs
        className="pt-4.5"
        items={[{ label: 'What’s next', href: ROUTES.UPCOMING }, { label: feature.title }]}
      />

      <FeatureSpotlight
        as="h1"
        preload
        className="mt-6"
        eyebrow={featureEyebrow(feature)}
        headline={feature.headline}
        text={feature.description}
        chips={feature.features}
        image={feature.image}
        note={`Expected · ${feature.date}`}
      >
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <ArrowButton variant="primary" icon={ArrowDown} href={`#${USE_CASES_ID}`}>
            How you’ll use it
          </ArrowButton>
          <ArrowButton href={ROUTES.UPCOMING}>Everything that’s coming</ArrowButton>
        </div>
      </FeatureSpotlight>

      <section id={USE_CASES_ID} className="mt-12 scroll-mt-24 border-t pt-10">
        <SectionHeading size="section" eyebrow="Use cases" eyebrowVariant="soft" title="How creators" accent="will use it." />
        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-9">
          {feature.useCases.map((useCase, i) => (
            <li key={useCase.title} className="flex items-start gap-4 border-t pt-6">
              <IconTile className="size-13.5 font-serif text-17 italic">
                {String(i + 1).padStart(2, '0')}
              </IconTile>
              <div>
                <h3 className="text-17 font-medium leading-[1.3] tracking-[-0.02em] text-foreground">
                  {useCase.title}
                </h3>
                <p className="mt-2 text-xs leading-[1.75] text-muted-foreground">{useCase.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <Eyebrow variant="label" className="mb-4">Also on the way</Eyebrow>
        <FeatureStrip id={FIRST_LOOK_ID} exclude={featureKey} />
      </section>

      <InfoNote className="mt-15 max-w-154">{UPCOMING_NOTE}</InfoNote>
      <UpcomingClosing className="mt-6" href={ROUTES.UPCOMING} cta="See everything that’s coming" icon={ArrowRight} />
    </>
  );
}
