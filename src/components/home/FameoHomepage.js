'use client';
// components/home/FameoHomepage.js
//
// The home page is a thin composition layer: four self-contained sections,
// each of which owns its own markup, styles and scroll behaviour.
//
//   <FameoLandingHero />     slideshow hero with the star cursor peek + reveal
//   <FameoScrollHero />      pinned scroll-jacked curator stage
//   <FameoScrollSections />  intro rail → collection panel → kinetic bands →
//                            zoom/discover → outro
//   <ImageTrailF />          F-shaped image cluster that follows the cursor
//
// The only thing this file contributes of its own is the global CSS block
// below. Everything else lives in the section components.

import React from 'react';
import ImageTrailF          from '@/components/ui/ImageTrailF';
import FameoLandingHero     from '@/components/ui/FameoLandingHero';
import FameoScrollHero      from '@/components/ui/FameoScrollHero';
import FameoScrollSections  from '@/components/ui/FameoScrollSections';

/* ─── Global CSS ──────────────────────────────────────────────────────────────
   Careful before touching this block — it is not scoped to the home page.

   • The @import loads Syne / DM Sans / Outfit. ImageTrailF's headline asks for
     'Outfit','DM Sans' and has no @import of its own, so removing this line
     silently drops it to a fallback face.
   • The :root tokens are read by other components. ImageTrailF uses
     var(--ivory) and var(--ink); they carry hardcoded fallbacks, so deleting
     these would not break the page, but it would change those colours.
   • The reset and the body font apply site-wide for as long as the home page
     is mounted. They belong in globals.css — moving them is a change that has
     to be checked on every route, so they stay here for now.

   Colour tokens (purple-pink system):
     --p1 #8F2793 deep violet · --p2 #D53B7E vivid pink · --p3 #A33A8E mid purple
     --bg-dark #150520 near-black purple · --bg-mid #1E0832 dark indigo
     --ivory #FAF6F0 warm off-white · --sand #D4C9B8 warm sand
   ─────────────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --p1:#8F2793; --p2:#D53B7E; --p3:#A33A8E;
  --grad:linear-gradient(135deg,#8F2793 0%,#A33A8E 50%,#D53B7E 100%);
  --grad-h:linear-gradient(135deg,#fd267a 0%,#ff2358 60%,#eb0052 100%);
  --bg-dark:#150520;
  --bg-mid:#1E0832;
  --bg-deep:#0E0118;
  --ivory:#FAF6F0;
  --cream:#F0E8DF;
  --sand:#D4C9B8;
  --ink:#1a0a1e;
  --ink2:#3d1a45;
  --muted:#7a507e;
  --muted2:#b090b8;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:var(--ivory);}
`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FameoHomepage() {
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