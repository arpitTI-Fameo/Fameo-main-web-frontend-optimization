export const PRICE_RANGES = [
  { label: 'All Prices',        min: 0,    max: Infinity },
  { label: 'Under ₹16,800',    min: 0,    max: 200      },
  { label: '₹16,800 – ₹42,000',min: 200,  max: 500      },
  { label: '₹42,000 – ₹84,000',min: 500,  max: 1000     },
  { label: '₹84,000+',         min: 1000, max: Infinity  },
];

export const SORT_OPTIONS = [
  { value: 'featured',    label: 'Featured'      },
  { value: 'price-asc',   label: 'Price: Low–High'},
  { value: 'price-desc',  label: 'Price: High–Low'},
  { value: 'rating',      label: 'Top Rated'     },
  { value: 'newest',      label: 'Newest'        },
];
