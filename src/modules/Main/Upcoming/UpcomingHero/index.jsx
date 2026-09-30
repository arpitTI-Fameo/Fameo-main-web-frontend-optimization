// modules/Main/Upcoming/UpcomingHero/index.jsx
// "Good things. Worth the wait." — copy on the left, and on the right two
// polaroids and the Fameo pass over a tilted ellipse.

import { ArrowDown, ArrowUpRight } from 'lucide-react';

import ArrowButton from '@/components/Common/ArrowButton';
import FameoPass from '@/components/Common/FameoPass';
import Polaroid from '@/components/Common/Polaroid';
import Wordmark from '@/components/Common/Wordmark';
import SectionHeading from '@/components/Common/SectionHeading';

import { FIRST_LOOK_ID, UPCOMING_HERO as HERO } from '../constants';

/* The artwork is laid out on a 540 × 350 frame. Positions are % of that frame
   and sizes are cqw (1cqw = 5.4px at full size), so it scales as one piece. */
const CENTER = '-translate-x-1/2 -translate-y-1/2';

function HeroArt() {
  const [craft, idea] = HERO.photos;
  return (
    <div aria-hidden="true" className="@container relative mx-auto aspect-[54/35] w-full max-w-135 select-none">
      <span className={`absolute top-[44%] left-[48.7%] size-[62cqw] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_7%,transparent),transparent)] ${CENTER}`} />
      <span className={`absolute top-[47.4%] left-[52.2%] h-[47cqw] w-[93cqw] -rotate-23 rounded-[50%] border border-input/90 ${CENTER}`} />
      <Polaroid
        src={craft.src}
        caption={craft.caption}
        sizes="240px"
        imageClassName="scale-[1.6] origin-[53%_51%]"
        className={`absolute top-[40.3%] left-[20.9%] w-[29.45cqw] -rotate-13 text-[2.22cqw] ${CENTER}`}
      />
      <Polaroid
        src={idea.src}
        caption={idea.caption}
        icon={ArrowUpRight}
        sizes="200px"
        imageClassName="scale-[1.35] origin-[45%_58%]"
        className={`absolute top-[30.6%] left-[85.2%] w-[29.45cqw] rotate-12 text-[2.22cqw] ${CENTER}`}
      />
      <FameoPass
        title={HERO.pass.title}
        caption={HERO.pass.caption}
        logo={<Wordmark className="text-[2.5em]" />}
        stack="top"
        titleClassName="leading-[1.02]"
        className={`absolute top-[66.3%] left-[47.1%] h-[25.9cqw] w-[42cqw] -rotate-8 px-[2em] pt-[1.6em] pb-[1.8em] text-[1.85cqw] ${CENTER}`}
      />
      <p className="absolute top-[91.6%] left-[51.9%] -translate-x-1/2 text-[2.04cqw] whitespace-nowrap uppercase tracking-[0.22em] text-muted-foreground/80">
        {HERO.artCaption}
      </p>
    </div>
  );
}

export default function UpcomingHero() {
  return (
    <section className="grid items-end gap-12 pt-4.5 pb-10.5 lg:grid-cols-[minmax(0,1fr)_calc(var(--spacing)*135)]">
      <div>
        <SectionHeading
          as="h1"
          size="hero"
          eyebrow={HERO.eyebrow}
          eyebrowVariant="soft"
          title={HERO.title}
          accent={HERO.accent}
        />
        <p className="mt-5 max-w-88.75 text-sm leading-[1.75] text-muted-foreground">{HERO.text}</p>
        <div className="mt-6.5 flex">
          <ArrowButton variant="primary" icon={ArrowDown} href={`#${FIRST_LOOK_ID}`}>
            {HERO.cta}
          </ArrowButton>
        </div>
        <p className="mt-3.75 text-11 text-muted-foreground/80">{HERO.caption}</p>
      </div>
      <HeroArt />
    </section>
  );
}
