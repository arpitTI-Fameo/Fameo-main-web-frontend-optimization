// modules/Main/Products/ProductListing/constants.js
// Copy and section data for the listing page. The page component owns these
// and hands them to each section as props — the sections stay presentational.

import { PRODUCT_CATEGORIES } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';

// 'All' is deliberately the first entry of the canonical category list.
// Derive it rather than spelling the literal a second time.
export const [LISTING_ALL_CATEGORY] = PRODUCT_CATEGORIES;

export const LISTING_HEADER = {
  title: 'Our Products',
  subtitle:
    'experience the perfect blend of luxury, quality, and design in every piece.',
};

// Breadcrumb above the title. The last entry is the current page, so it
// carries no href.
export const LISTING_BREADCRUMBS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Shop' },
];

// Cards rendered before the "Load more" button appears.
export const LISTING_PAGE_SIZE = 9;

// Layout of the grid below the header — set from the header's view toggle.
export const LISTING_VIEWS = {
  GRID: 'grid',
  LIST: 'list',
};

// Sort choices in the header. Each value is handled by sortProducts() in
// ./helpers — keep the two in step.
export const LISTING_SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'        },
  { value: 'price-asc',  label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'rating',     label: 'Top Rated'       },
  { value: 'name-asc',   label: 'Name: A–Z'       },
];

export const [{ value: LISTING_DEFAULT_SORT }] = LISTING_SORT_OPTIONS;

export const WHY_CHOOSE = {
  title: 'Why creators choose Fameo',
  subtitle:
    'experience the perfect blend of luxury, quality, and design in every piece.',
  image:
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1000&q=80',
  imageAlt: 'A creator workspace with studio gear laid out on a desk',
  features: [
    {
      id: 'delivery',
      icon: 'truck',
      title: 'Fast & Reliable Delivery',
      text: 'Get your gear delivered quickly and safely, right to your doorstep.',
    },
    {
      id: 'shopping',
      icon: 'bag',
      title: 'Easy Shopping',
      text: 'Browse, compare and check out in a few taps — no friction anywhere.',
    },
    {
      id: 'quality',
      icon: 'shield',
      title: 'Gear You Can Trust',
      text: 'Every item is sourced from brands creators already rely on daily.',
    },
    {
      id: 'returns',
      icon: 'refresh',
      title: 'Simple Returns',
      text: 'Changed your mind? Send it back within 30 days, no questions asked.',
    },
  ],
};

export const PROMO_BANNER = {
  image:
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1600&q=80',
  titleTop: 'Gear that speaks',
  titleBottom: 'Simplicity',
  subtitle:
    'Minimal, functional and beautifully built — the perfect finish to your creator setup.',
  ctaLabel: 'Shop Now',
};
