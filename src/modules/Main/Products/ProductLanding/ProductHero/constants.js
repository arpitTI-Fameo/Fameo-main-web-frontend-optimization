// modules/Main/Products/ProductLanding/ProductHero/constants.js
// Hero copy + the four tabs. Scoped to this section only.
// Each tab drives both panels: the white card on the left and the feature on
// the right, so switching a chip swaps the whole hero.

export const HERO_TITLE = 'Elevate Your Setup with Elegant Simplicity Creator Gear';

export const HERO_TABS = [
  {
    id: 'popular',
    label: 'Popular',
    card: {
      title: 'Aperture Prime Kit',
      desc: 'Experience high-end glass, expert detailing, and enduring design in every piece.',
      img: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=700&q=80',
      slug: 'lenses',
    },
    feature: {
      title: 'Modern Loft Camera Set',
      desc: 'Built with quality, designed for longevity and styled to impress.',
      rating: '4.8',
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
      slug: 'cameras',
    },
  },
  {
    id: 'exclusive',
    label: 'Exclusive',
    card: {
      title: 'Studio Glow Panel',
      desc: 'Soft, even output with a colour engine tuned for skin tones on camera.',
      img: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=700&q=80',
      slug: 'lighting',
    },
    feature: {
      title: 'Softbox Signature Rig',
      desc: 'A full three-point setup that packs down into a single case.',
      rating: '4.9',
      img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
      slug: 'lighting',
    },
  },
  {
    id: 'hot-picks',
    label: 'Hot Picks',
    card: {
      title: 'Broadcast Mic Arm',
      desc: 'Studio-grade capture with a boom that stays exactly where you leave it.',
      img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=700&q=80',
      slug: 'audio',
    },
    feature: {
      title: 'Podcast Booth Bundle',
      desc: 'Two mics, two arms and the interface that ties the room together.',
      rating: '4.7',
      img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&q=80',
      slug: 'audio',
    },
  },
  {
    id: 'limited',
    label: 'Limited Edition',
    card: {
      title: 'Carbon Travel Tripod',
      desc: 'Machined joints and a carbon spine that shrugs off a full day on location.',
      img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=700&q=80',
      slug: 'bags-tripods',
    },
    feature: {
      title: 'Field Kit — Numbered Run',
      desc: 'A limited run built for creators who shoot away from the studio.',
      rating: '5.0',
      img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80',
      slug: 'bags-tripods',
    },
  },
];

export const HERO_CTA = 'View Product';
