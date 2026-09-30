'use client';
// modules/Resources/CommunityFan/index.jsx

import { Asterisk } from 'lucide-react';

import ArrowButton from '@/components/Common/ArrowButton';
import GlassNote from '@/components/Common/GlassNote';
import IconItem from '@/components/Common/IconItem';
import SectionHeading from '@/components/Common/SectionHeading';
import { ROUTES } from '@/constants/routes';

import { COMMUNITY, COMMUNITY_PHOTO } from '../constants';

export default function CommunityFan() {
    return (
    <section className="my-9 grid items-center gap-6 border-y py-9 sm:my-14 sm:grid-cols-2 sm:gap-7 md:gap-11">
      <div>
        <SectionHeading eyebrow="Community" title="Learn something." accent="Find your people." />
        <div className="mt-5 mb-1 space-y-4.5">
          {COMMUNITY.map(({ icon, title, description }) => (
            <IconItem key={title} icon={icon} title={title} description={description} size="md" />
          ))}
        </div>
        <ArrowButton href={ROUTES.COMMUNITY}>Explore Fameo Community</ArrowButton>
      </div>
      <div className="relative h-71.25 sm:h-80.5">
        <img
          src={COMMUNITY_PHOTO.src}
          alt={COMMUNITY_PHOTO.alt}
          loading="lazy"
          draggable="false"
          className="size-full rounded-lg rounded-tl-[calc(var(--spacing)*22.5)] object-cover"
        />
        <GlassNote className="inset-x-4.5 bottom-4.25 justify-between">
          <span>Good company. Fresh perspective.</span>
          <Asterisk aria-hidden="true" className="size-4.5 shrink-0 text-primary" />
        </GlassNote>
      </div>
    </section>
    );
}
