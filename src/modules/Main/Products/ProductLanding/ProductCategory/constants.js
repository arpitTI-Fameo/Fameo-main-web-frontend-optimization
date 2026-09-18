// modules/Main/Products/ProductLanding/ProductCategory/constants.js
// Copy + slides for the inspiration rail. Scoped to this section only.

export const CATEGORY_HERO = {
  title: 'Unique Gear Inspirations',
  subtitle:
    "Field-tested and beautifully built, this gear is the perfect blend of comfort and control",
  cta: 'Get Started',
};

// Rail cards. `slug` feeds ROUTES.CATEGORY() on click.
export const CATEGORY_SLIDES = [
  { n: '01', room: 'Studio',   title: 'Creator Desk',     slug: 'accessories', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80' },
  { n: '02', room: 'Lighting', title: 'Soft Glow Setup',  slug: 'lighting',    img: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=800&q=80' },
  { n: '03', room: 'Cameras',  title: 'Run & Gun',        slug: 'cameras',     img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
  { n: '04', room: 'Audio',    title: 'Podcast Booth',    slug: 'audio',       img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80' },
  { n: '05', room: 'Lenses',   title: 'Prime Collection', slug: 'lenses',      img: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80' },
];
