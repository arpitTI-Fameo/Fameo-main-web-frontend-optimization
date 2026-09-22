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
  image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&q=80',

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

export const ProductSortOptions = {
  RELEVANCE: "relevance",
  POPULARITY: "popularity",
  NEW_ARRIVALS: "new-arrivals",
  PRICE_LOW_TO_HIGH: "price-low-to-high",
  PRICE_HIGH_TO_LOW: "price-high-to-low",
  HIGHEST_DISCOUNT: "highest-discount",
  TOP_RATED: "top-rated",
  MOST_REVIEWED: "most-reviewed",
  ALPHABETICAL_A_TO_Z: "alphabetical-a-to-z",
  ALPHABETICAL_Z_TO_A: "alphabetical-z-to-a",
  STOCK_HIGH_TO_LOW: "stock-high-to-low",
  STOCK_LOW_TO_HIGH: "stock-low-to-high",
  OLDEST_FIRST: "oldest-first",
};

export const sortConfig = {
  [ProductSortOptions.RELEVANCE]: { field: "popularityScore", order: "-1" },
  [ProductSortOptions.POPULARITY]: { field: "popularityScore", order: "-1" },
  [ProductSortOptions.NEW_ARRIVALS]: { field: "updatedAt", order: "-1" },
  [ProductSortOptions.PRICE_LOW_TO_HIGH]: { field: "skuPrice.salePrice", order: "1" },
  [ProductSortOptions.PRICE_HIGH_TO_LOW]: { field: "skuPrice.salePrice", order: "-1" },
  [ProductSortOptions.HIGHEST_DISCOUNT]: { field: "discountAmount", order: "-1" },
  [ProductSortOptions.TOP_RATED]: { field: "reviewStats.averageRating", order: "-1" },
  [ProductSortOptions.MOST_REVIEWED]: { field: "reviewStats.reviewCount", order: "-1" },
  [ProductSortOptions.ALPHABETICAL_A_TO_Z]: { field: "skuName", order: "1" },
  [ProductSortOptions.ALPHABETICAL_Z_TO_A]: { field: "skuName", order: "-1" },
  [ProductSortOptions.STOCK_HIGH_TO_LOW]: { field: "stock", order: "-1" },
  [ProductSortOptions.STOCK_LOW_TO_HIGH]: { field: "stock", order: "1" },
  [ProductSortOptions.OLDEST_FIRST]: { field: "createdAt", order: "1" },
};

// Sort choices in the header. Only showing the most common ones in the UI.
export const LISTING_SORT_OPTIONS = [
  { value: ProductSortOptions.RELEVANCE, label: 'Relevance' },
  { value: ProductSortOptions.NEW_ARRIVALS, label: 'New Arrivals' },
  { value: ProductSortOptions.PRICE_LOW_TO_HIGH, label: 'Price: Low–High' },
  { value: ProductSortOptions.PRICE_HIGH_TO_LOW, label: 'Price: High–Low' },
  { value: ProductSortOptions.TOP_RATED, label: 'Top Rated' },
];

export const LISTING_DEFAULT_SORT = ProductSortOptions.RELEVANCE;

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
