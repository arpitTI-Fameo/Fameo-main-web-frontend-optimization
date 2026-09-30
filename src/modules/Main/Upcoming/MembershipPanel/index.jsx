// modules/Main/Upcoming/MembershipPanel/index.jsx
// The membership teaser: the Fameo pass over two outlines, beside its story.

import { Card } from '@/components/ui/shadcn/card';
import ArrowButton from '@/components/Common/ArrowButton';
import FameoPass from '@/components/Common/FameoPass';
import SectionHeading from '@/components/Common/SectionHeading';

import { featureHref, featureEyebrow } from '../helpers';

const CENTER = '-translate-x-1/2 -translate-y-1/2';

export default function MembershipPanel({ featureKey, feature }) {
  return (
    <Card className="mt-8.5 grid min-h-69 items-center gap-8 overflow-hidden rounded-2xl bg-linear-to-r from-secondary via-muted to-card px-6 py-8 shadow-none sm:px-12 lg:grid-cols-[1fr_1.3fr] lg:gap-12 lg:py-0">
      <div aria-hidden="true" className="relative h-60 lg:h-full">
        <span className={`absolute top-[36%] left-[40%] h-31 w-80 -rotate-8 rounded-[50%] border border-input/80 ${CENTER}`} />
        <span className={`absolute top-[67%] left-[52%] h-30 w-83 -rotate-10 rounded-[50%] border border-input/80 ${CENTER}`} />
        <FameoPass
          icon={feature.icon}
          title={feature.pass.title}
          caption={feature.pass.caption}
          className={`absolute top-1/2 left-[51%] h-39 w-62 -rotate-7 px-4 py-5 text-11 ${CENTER}`}
        />
      </div>
      <div>
        <SectionHeading
          size="title"
          eyebrow={featureEyebrow(feature)}
          eyebrowVariant="dot"
          title={feature.headline[0]}
          accent={feature.headline[1]}
        />
        <p className="mt-3.5 max-w-88 text-13 leading-[1.75] text-muted-foreground">{feature.teaser}</p>
        <div className="mt-2 flex">
          <ArrowButton href={featureHref(featureKey)}>{feature.link}</ArrowButton>
        </div>
      </div>
    </Card>
  );
}
