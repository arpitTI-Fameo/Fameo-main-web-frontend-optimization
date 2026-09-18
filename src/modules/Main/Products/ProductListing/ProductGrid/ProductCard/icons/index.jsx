// modules/Main/Products/ProductListing/ProductCard/icons/index.jsx

export function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5B301" aria-hidden="true">
      <path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95L12 2.6Z" />
    </svg>
  );
}

export function HeartIcon({ filled = false }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13l-7.4 7.3Z" />
    </svg>
  );
}

export function BagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1.1 11.2A2 2 0 0 1 15.9 21H8.1a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6.4a3 3 0 0 1 6 0V8" />
    </svg>
  );
}
