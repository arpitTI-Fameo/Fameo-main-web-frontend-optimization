// modules/Main/Cart/icons/index.jsx
// Inline SVGs for the cart surfaces. All inherit currentColor.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

export function CartIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h2.2l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.6-1.25L22 7H5.2" />
    </svg>
  );
}

export function TruckIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M1.5 6.5h12v9h-12z" />
      <path d="M13.5 10h4l3 3v2.5h-7z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}

export function HomeIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9.8V20h13V9.8" />
    </svg>
  );
}

export function WarehouseIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M2.5 9.5 12 4.5l9.5 5V20h-19z" />
      <path d="M7 20v-6h10v6" />
      <path d="M7 17h10" />
    </svg>
  );
}

export function HeartIcon({ filled = false, size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13l-7.4 7.3Z" />
    </svg>
  );
}

export function TrashIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 6.5h16" />
      <path d="M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
      <path d="M6.5 6.5 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.5" />
      <path d="M10.5 10.5v6M13.5 10.5v6" />
    </svg>
  );
}

export function MinusIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2"><path d="M5 12h14" /></svg>;
}

export function PlusIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>;
}

export function PlusCircleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 8.4v7.2M8.4 12h7.2" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.9"><path d="M14.5 5.5 8 12l6.5 6.5" /></svg>;
}

export function CheckIcon({ size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.4"><path d="m4 12.5 5.5 5.5L20 6.5" /></svg>;
}

export function CloseIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.9"><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
