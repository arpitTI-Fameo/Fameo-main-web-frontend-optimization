// modules/Main/Products/ProductLanding/ProductBestSelling/constants.js
// Copy + tuning values for the best-selling coverflow. Scoped to this section only.

export const BEST_SELLING_HEADER = {
  title: 'Bestsellers',
};

// Cards fed into the carousel. Anything past this is trimmed.
export const BEST_SELLING_LIMIT = 10;

// Shown when a product row carries no usable image.
export const BEST_SELLING_FALLBACK_IMAGE = '/ProductImages/camera-gimbal.webp';

// First tab — shows every product, so the strip is full on load.
export const BEST_SELLING_ALL_TAB = 'All';

// How many cards flank the centre one. Narrow viewports drop to one.
export const BEST_SELLING_SPAN = 2;
export const BEST_SELLING_SPAN_NARROW = 1;
export const BEST_SELLING_NARROW_BP = 760;

// Horizontal drag distance (px) that counts as a swipe.
export const BEST_SELLING_SWIPE = 56;
