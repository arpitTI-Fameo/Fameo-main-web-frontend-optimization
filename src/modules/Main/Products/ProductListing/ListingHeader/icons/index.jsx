// modules/Main/Products/ProductListing/ListingHeader/icons/index.jsx
// Toolbar icons for the listing header — filter trigger, sort caret and the
// two view-mode glyphs.

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

export function FilterIcon() {
  return (
    <svg {...base}>
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg {...base} width={14} height={14}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function GridViewIcon() {
  return (
    <svg {...base} strokeWidth={1.6}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
    </svg>
  );
}

export function ListViewIcon() {
  return (
    <svg {...base} strokeWidth={1.6}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}
