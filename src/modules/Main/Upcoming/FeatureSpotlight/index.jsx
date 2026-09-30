// modules/Main/Upcoming/FeatureSpotlight/index.jsx
// A photo with a frosted caption beside the feature's story: dot eyebrow,
// two-line heading, copy, chips and whatever actions are passed as children.
// The overview's Community block and every detail page's hero.

import Image from 'next/image';
import { Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/shadcn/badge';
import GlassNote from '@/components/Common/GlassNote';
import SectionHeading from '@/components/Common/SectionHeading';
import { cn } from '@/utils/cn';

export default function FeatureSpotlight({
  as = 'h2',
  eyebrow,
  headline,
  text,
  chips,
  image,
  note,
  preload = false,
  className,
  children,
}) {
  return (
    <section
      className={cn(
        'grid items-center gap-8 lg:grid-cols-[minmax(0,1.128fr)_minmax(0,1fr)] lg:gap-8.5',
        className
      )}
    >
      <div className="relative h-60 overflow-hidden rounded-md rounded-tr-[calc(var(--spacing)*9.5)] bg-secondary sm:h-79">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload={preload}
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover"
        />
        {note && (
          <GlassNote className="inset-x-3.5 bottom-3.5 justify-between py-2.75 text-11">
            <span>{note}</span>
            <Sparkles aria-hidden="true" className="size-4 shrink-0 stroke-[1.65] text-primary" />
          </GlassNote>
        )}
      </div>

      <div>
        <SectionHeading
          as={as}
          size="feature"
          eyebrow={eyebrow}
          eyebrowVariant="dot"
          title={headline[0]}
          accent={headline[1]}
        />
        <p className="mt-3.5 max-w-88 text-13 leading-[1.75] text-muted-foreground">{text}</p>
        {chips?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {chips.map(chip => (
              <li key={chip}>
                <Badge
                  variant="outline"
                  className="h-9 rounded-full bg-card px-2.75 text-11 font-normal text-muted-foreground"
                >
                  {chip}
                </Badge>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  );
}
