'use client';
// modules/Resources/MembershipPerks/index.jsx

import ArrowButton from '@/components/Common/ArrowButton';
import IconItem from '@/components/Common/IconItem';
import SectionHeading from '@/components/Common/SectionHeading';
import { ROUTES } from '@/constants/routes';

import { PERKS } from '../constants';

export default function MembershipPerks() {
    return (
    <section className="mb-8 grid items-center gap-5 border-y py-7 sm:mb-10 sm:grid-cols-[1fr_1.35fr] sm:gap-6 md:grid-cols-[.95fr_1.65fr] md:gap-9">
      <div>
        <SectionHeading size="md" title="More than a course." accent="Your creative toolkit." />
        <ArrowButton href={ROUTES.PLANS} className="mt-1.5">Inside your membership</ArrowButton>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-[360px]:grid-cols-1 sm:grid-cols-1 sm:gap-y-3 md:grid-cols-2 md:gap-y-4">
        {PERKS.map(({ icon, label }) => (
          <IconItem key={label} icon={icon} title={label} className="max-sm:items-start max-sm:text-11" />
        ))}
      </div>
    </section>
    );
}
