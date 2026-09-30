'use client';
// modules/Resources/ResourcesHero/index.jsx

import { ArrowDown, Sparkles } from 'lucide-react';

import ArrowButton from '@/components/Common/ArrowButton';
import ChipGroup from '@/components/Common/ChipGroup';
import GlassNote from '@/components/Common/GlassNote';
import SectionHeading from '@/components/Common/SectionHeading';
import { cn } from '@/utils/cn';

import { GOALS, PORTRAITS, SECTION_IDS } from '../constants';

export default function ResourcesHero({ goalCat, pickGoal, scrollToSection }) {
    return (
    <>
      <section className="grid items-center gap-6 pb-7 sm:grid-cols-[1.05fr_1fr] sm:gap-6 md:gap-11 md:pb-9">
        <div>
          <SectionHeading
            as="h1"
            size="display"
            eyebrow="Fameo learning centre"
            title="Creator"
            accent="Knowledge"
            accentSuffix=" Hub."
          />
          <p className="mt-5 max-w-88.75 text-sm leading-[1.75] text-muted-foreground">
            For the craft you love. And the career you&rsquo;re building. Find your next
            step, from first ideas to lasting influence.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <ArrowButton
              variant="primary"
              icon={ArrowDown}
              onClick={() => scrollToSection(SECTION_IDS.courses)}
            >
              Explore the courses
            </ArrowButton>
            <ArrowButton onClick={() => scrollToSection(SECTION_IDS.membership)}>
              What&rsquo;s included
            </ArrowButton>
          </div>
        </div>

        <div className="relative isolate mx-auto w-full max-w-110 px-3.5 pt-3.5 pb-7 sm:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 bottom-2.5 -z-10 rounded-xl rounded-tl-[calc(var(--spacing)*25)] border bg-linear-to-br from-secondary via-border to-muted"
          />
          <div className="grid grid-cols-2 gap-2.5">
            {PORTRAITS.map((src, i) => (
              <div
                key={src}
                className={cn(
                  'group relative h-39.5 overflow-hidden rounded-md md:h-44.5',
                  i === 0 && 'rounded-tl-[calc(var(--spacing)*21.25)]',
                  i % 2 === 1 && 'translate-y-3'
                )}
              >
                <img
                  src={src}
                  alt="Fameo creator"
                  draggable="false"
                  className="size-full object-cover object-[center_28%] transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                />
              </div>
            ))}
          </div>
          <GlassNote className="inset-x-7 bottom-2.5 max-[360px]:inset-x-5 max-[360px]:p-2.5">
            <Sparkles aria-hidden="true" className="size-4.5 shrink-0 text-primary" />
            <div>
              <strong className="block text-xs font-medium">Your ambition. Your own way.</strong>
              <small className="mt-0.5 block text-11 text-muted-foreground">
                A space to learn, create and grow.
              </small>
            </div>
          </GlassNote>
        </div>
      </section>

      <section className="border-t pt-6 pb-7.5">
        <p id="resources-goals" className="mb-3 text-xs font-medium text-secondary-foreground">
          What would you like to work on?
        </p>
        <ChipGroup
          aria-labelledby="resources-goals"
          items={GOALS}
          value={goalCat ?? ''}
          onValueChange={(cat) => pickGoal(cat || goalCat)}
        />
      </section>
    </>
    );
}
