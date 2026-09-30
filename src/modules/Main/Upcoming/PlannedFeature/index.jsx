// modules/Main/Upcoming/PlannedFeature/index.jsx
// A quieter feature teaser: icon tile beside a label, two plain lines, copy
// and a link. Used for the "Planned" pair on the overview.

import ArrowButton from '@/components/Common/ArrowButton';
import IconTile from '@/components/Common/IconTile';
import SectionHeading from '@/components/Common/SectionHeading';

import { featureEyebrow, featureHref } from '../helpers';

export default function PlannedFeature({ featureKey, feature }) {
  return (
    <article className="flex items-start gap-4 border-t pt-6">
      <IconTile icon={feature.icon} className="size-13.5" />
      <div>
        <SectionHeading
          as="h3"
          size="sm"
          eyebrow={featureEyebrow(feature)}
          eyebrowVariant="label"
          eyebrowClassName="tracking-normal"
          title={<>{feature.headline[0]}<br />{feature.headline[1]}</>}
          headingClassName="mt-2.5"
        />
        <p className="mt-2.5 max-w-72 text-xs leading-[1.75] text-muted-foreground">{feature.teaser}</p>
        <div className="mt-1.5 flex">
          <ArrowButton href={featureHref(featureKey)} className="text-11">{feature.link}</ArrowButton>
        </div>
      </div>
    </article>
  );
}
