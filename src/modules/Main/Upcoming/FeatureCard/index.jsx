// modules/Main/Upcoming/FeatureCard/index.jsx
// A feature in the "For the things you haven't made yet" pair: photo with an
// "In the making" badge, label, two-line heading, copy and a link.

import Image from 'next/image';

import { Badge } from '@/components/ui/shadcn/badge';
import ArrowButton from '@/components/Common/ArrowButton';
import SectionHeading from '@/components/Common/SectionHeading';
import { cn } from '@/utils/cn';

import { featureHref } from '../helpers';

export default function FeatureCard({ featureKey, feature, badge, imageClassName }) {
  const Icon = feature.icon;
  return (
    <article>
      <div className="relative h-59.5 overflow-hidden rounded-lg bg-secondary">
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className={cn('object-cover', imageClassName)}
        />
        <Badge
          variant="secondary"
          className="absolute top-3.5 left-3.5 h-8 gap-2 rounded-full bg-card/95 px-3.5 text-11 font-normal text-secondary-foreground [&>svg]:size-3.75 [&>svg]:stroke-[1.65] [&>svg]:text-brand-muted"
        >
          <Icon aria-hidden="true" />
          {badge}
        </Badge>
      </div>
      <SectionHeading
        size="md"
        eyebrow={feature.title}
        eyebrowVariant="label"
        title={feature.headline[0]}
        accent={feature.headline[1]}
        className="mt-5"
        headingClassName="mt-3 tracking-[-0.022em]"
      />
      <p className="mt-2.25 max-w-88 text-13 leading-[1.75] text-muted-foreground">{feature.teaser}</p>
      <div className="mt-1.5 flex">
        <ArrowButton href={featureHref(featureKey)}>{feature.link}</ArrowButton>
      </div>
    </article>
  );
}
