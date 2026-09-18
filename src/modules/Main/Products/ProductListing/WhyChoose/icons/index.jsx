// modules/Main/Products/ProductListing/WhyChoose/icons/index.jsx
// Feature icons, keyed by the `icon` field on each WHY_CHOOSE entry.

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

function Truck() {
  return (
    <svg {...base}>
      <path d="M3 16V6.5A1.5 1.5 0 0 1 4.5 5H14v11" />
      <path d="M14 9h3.6a2 2 0 0 1 1.7.95L21 12.6V16" />
      <circle cx="7.5" cy="17.5" r="1.9" />
      <circle cx="17" cy="17.5" r="1.9" />
      <path d="M9.4 17.5h5.7M3 16h1.6M19 16h2" />
    </svg>
  );
}

function Bag() {
  return (
    <svg {...base}>
      <path d="M5 8h14l-1.1 11.2A2 2 0 0 1 15.9 21H8.1a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6.4a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

function Shield() {
  return (
    <svg {...base}>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  );
}

function Refresh() {
  return (
    <svg {...base}>
      <path d="M20 11a8 8 0 0 0-13.6-4.6L4 8.7" />
      <path d="M4 5v4h4" />
      <path d="M4 13a8 8 0 0 0 13.6 4.6L20 15.3" />
      <path d="M20 19v-4h-4" />
    </svg>
  );
}

const ICONS = { truck: Truck, bag: Bag, shield: Shield, refresh: Refresh };

export default function FeatureIcon({ name }) {
  const Glyph = ICONS[name] || Bag;
  return <Glyph />;
}
