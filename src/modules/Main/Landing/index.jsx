'use client';
import React from 'react';
import ImageTrailF from './ImageTrailF';
import FameoLandingHero from './FameoLandingHero';
import FameoScrollHero from './FameoScrollHero';
import FameoScrollSections from './FameoScrollSections';
import { CSS } from './styles';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)' }}>
      <style>{CSS}</style>

      {/* Slideshow hero — star cursor peek + click-to-reveal */}
      <FameoLandingHero />

      {/* Pinned curator stage, then the five-part scroll sequence */}
      <FameoScrollHero />
      <FameoScrollSections />

      {/* Cursor-following F cluster */}
      <ImageTrailF />
    </div>
  );
}