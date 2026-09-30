// components/Common/SectionHeading/index.jsx
// The two-line editorial heading: a plain first line, then a rose serif-italic
// accent line, optionally under an Eyebrow.
//
//   <SectionHeading eyebrow="Membership" title="One membership." accent="Room to grow." />
//   <SectionHeading as="h1" size="display" title="Creator" accent="Knowledge" accentSuffix=" Hub." />
//   <SectionHeading as="h1" size="xl" eyebrow="Growth" title="Platform Growth" accent="& Algorithms" />
//   <SectionHeading size="feature" eyebrow="Fameo Community" eyebrowVariant="dot" title="Good people." accent="Your kind of circle." />
//
// Needs a `.fameo-theme` ancestor for its colors.

import Eyebrow from '@/components/Common/Eyebrow';
import { cn } from '@/utils/cn';

const SIZES = {
  display: 'text-[clamp(43px,5.8vw,calc(var(--spacing)*16.5))] leading-[1.04] tracking-[-0.042em]',
  // Page titles longer than display copy (a course name split in two), sized
  // so each half fits one line of a half-width hero column.
  xl: 'text-[clamp(32px,4.4vw,calc(var(--spacing)*13))] leading-[1.06] tracking-[-0.04em]',
  lg: 'text-30 leading-[1.18] tracking-[-0.034em] sm:text-34',
  md: 'text-25 leading-[1.18] tracking-[-0.04em]',
  // The /upcoming type scale, drawn at full width: 74 / 40 / 32.5 / 29 / 21px.
  hero: 'text-[clamp(43px,5.2vw,calc(var(--spacing)*18.5))] leading-[1.03] tracking-[-0.04em]',
  feature: 'text-[calc(var(--spacing)*8.5)] leading-[1.15] tracking-[-0.03em] sm:text-[calc(var(--spacing)*10)]',
  title: 'text-[calc(var(--spacing)*7)] leading-[1.12] tracking-[-0.045em] sm:text-[calc(var(--spacing)*8.125)]',
  section: 'text-[calc(var(--spacing)*7.25)] leading-[1.12] tracking-[-0.05em]',
  sm: 'text-[calc(var(--spacing)*5.25)] leading-[1.14] tracking-[-0.027em]',
};

const EYEBROW_GAP = { display: 'mt-5', hero: 'mt-6', feature: 'mt-4.75' };

export default function SectionHeading({
  as: Tag = 'h2',
  eyebrow,
  eyebrowVariant,
  eyebrowClassName,
  title,
  accent,
  accentSuffix,
  size = 'lg',
  align = 'start',
  className,
  headingClassName,
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && <Eyebrow variant={eyebrowVariant} align={align} className={eyebrowClassName}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          'font-medium text-foreground',
          SIZES[size],
          eyebrow && (EYEBROW_GAP[size] ?? 'mt-3.5'),
          headingClassName
        )}
      >
        {title}
        {accent && (
          <>
            <br />
            <em className="font-serif font-normal text-primary">{accent}</em>
            {accentSuffix}
          </>
        )}
      </Tag>
    </div>
  );
}
