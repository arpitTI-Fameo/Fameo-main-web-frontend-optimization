'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import useAuthCta from '@/hooks/useAuthCta';   
import { CSS } from './styles';
import IntroToGrid from './IntroToGrid';
import KineticBands from './KineticBands';
import ZoomDiscover from './ZoomDiscover';
import Outro from './Outro';
import { clamp01, lerp, easeInOut, seg } from './utils';

/* ═══════════════════════════════════════════════════════════════════════════
   FAMEO SCROLL SECTIONS — continuation after <FameoScrollHero />
   ─────────────────────────────────────────────────────────────────────────
   Renders five sections replicating the reference sequence:

   A. IntroRail        Big left statement whose words light up one by one
                       as you scroll, sticky beside a rail of cards
                       (vertical on desktop, snapping carousel on mobile).
   B. CollectionPanel  White panel: "Collection" label, big title, meta
                       row, then a 4-column offset product grid with
                       + buttons and bookmark badges.
   C. KineticBands     Diagonal rose-gradient wedges sweep through while
                       giant words "Grow / your / reach" scatter and
                       converge, scroll-linked, with cycling doodles.
   D. ZoomDiscover     "Zoom in with ▢ Fameo" — seed image expands
                       fullscreen with the echo/fan-out effect, then
                       becomes the Discover collection browser. Mobile
                       gets its own geometry, spacing, and runway length.
   E. Outro            Giant FAMEO wordmark with a living "O".

   Usage:
     <FameoScrollHero />
     <FameoScrollSections />
   ═══════════════════════════════════════════════════════════════════════ */

/* ── helpers ────────────────────────────────────────────────────────────── */

/* scroll progress across a runway element (0 at pin start, 1 at pin end) —
   smoothed exactly like the hero: scroll events only set a TARGET, and a
   continuous rAF loop eases the displayed progress toward it (0.14/frame),
   so the zoom seed-grow + echoes, card flight, and word reveal glide
   between scroll ticks instead of stepping with them. */
export default function FameoScrollSections() {
  return (
    <div className="tss">
      <style>{CSS}</style>
      <IntroToGrid />
      <KineticBands />
      <ZoomDiscover />
      <Outro />
    </div>
  );
}
