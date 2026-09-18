export const PRICE_RANGES = [
  { min: 0,    max: Infinity },
  { min: 0,    max: 200      },
  { min: 200,  max: 500      },
  { min: 500,  max: 1000     },
  { min: 1000, max: Infinity },
];

export const DEFAULT_FILTERS = {
  category:    'all',
  brand:       null,
  priceRange:  0,
  inStockOnly: false,
  sort:        'featured',
};
