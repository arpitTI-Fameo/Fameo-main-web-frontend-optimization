// modules/Main/Products/ProductLanding/ProductBestSelling/icons/index.jsx

export function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1.1 11.2A2 2 0 0 1 15.9 21H8.1a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6.4a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function ArrowIcon({ dir = 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
