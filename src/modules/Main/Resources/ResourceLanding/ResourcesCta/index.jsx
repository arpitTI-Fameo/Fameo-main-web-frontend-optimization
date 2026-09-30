'use client';
// modules/Resources/ResourcesCta/index.jsx

import ArrowButton from '@/components/Common/ArrowButton';
import SectionHeading from '@/components/Common/SectionHeading';

import { SECTION_IDS } from '../constants';

export default function ResourcesCta({ scrollToSection }) {
    return (
    <section className="mb-7 rounded-2xl bg-[radial-gradient(ellipse_at_50%_110%,color-mix(in_oklab,var(--primary)_12%,var(--card)),transparent_75%)] px-5 py-9 text-center">
      <SectionHeading align="center" title="Your fame is a craft." accent="Make it yours." />
      <p className="mt-3 mb-5 text-13 leading-[1.75] text-muted-foreground">
        Keep your curiosity. Build your confidence. Take the next step.
      </p>
      <ArrowButton variant="primary" onClick={() => scrollToSection(SECTION_IDS.courses)}>
        Find your next course
      </ArrowButton>
    </section>
    );
}
