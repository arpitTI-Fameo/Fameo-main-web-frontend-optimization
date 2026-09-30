'use client';
// modules/Resources/MembershipPricing/index.jsx

import { Badge as BadgeIcon, Check } from 'lucide-react';

import AppLogo from '@/components/Common/AppLogo';
import ArrowButton from '@/components/Common/ArrowButton';
import FameoPass from '@/components/Common/FameoPass';
import IconItem from '@/components/Common/IconItem';
import SectionHeading from '@/components/Common/SectionHeading';
import { ROUTES } from '@/constants/routes';

import { MEMBERSHIP_POINTS, SECTION_IDS } from '../constants';

export default function MembershipPricing() {
    return (
    <section
      id={SECTION_IDS.membership}
      className="mb-12 grid scroll-mt-24 items-center gap-6 sm:grid-cols-2 sm:gap-7 md:gap-12"
    >
      {/* Membership pass artwork */}
      <div
        aria-hidden="true"
        className="relative flex min-h-63.75 items-center justify-center overflow-hidden rounded-xl border bg-linear-130 from-secondary via-card to-border px-5.5 py-8 sm:min-h-76.75 md:px-7.5 md:py-10"
      >
        <span className="absolute h-27.5 w-90 -rotate-[26deg] rounded-[50%] border border-input/80" />
        <span className="absolute h-47.5 w-122.5 rotate-[35deg] rounded-[50%] border border-input/80" />
        <FameoPass
          className="relative z-[1] h-43.5 w-72.5 max-w-full -rotate-7 p-5.5"
          logo={<AppLogo className="-my-3.5 -ml-6 h-14 w-auto self-start" draggable="false" />}
          kicker="The creator membership"
          title="Keep becoming."
          footer={
            <div className="flex items-center justify-between text-10 tracking-[0.1em]">
              <span>LEARN · CREATE · CONNECT</span>
              <BadgeIcon className="size-5.75 text-brand-text" />
            </div>
          }
        />
      </div>

      <div>
        <SectionHeading eyebrow="Membership" title="One membership." accent="Room to grow." />
        <p className="mt-3.5 text-13 leading-[1.75] text-muted-foreground">
          Bring your learning together. Courses, playbooks and practical resources for the
          creator you&rsquo;re becoming.
        </p>
        <ul className="mt-4 mb-5 flex flex-wrap gap-x-3.5 gap-y-2.5">
          {MEMBERSHIP_POINTS.map(point => (
            <li key={point}>
              <IconItem icon={Check} title={point} size="xs" />
            </li>
          ))}
        </ul>
        <ArrowButton variant="primary" href={ROUTES.PLANS}>Explore membership</ArrowButton>
      </div>
    </section>
    );
}
