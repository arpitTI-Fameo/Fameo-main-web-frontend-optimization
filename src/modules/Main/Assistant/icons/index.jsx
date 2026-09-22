// modules/Main/Assistant/icons/index.jsx
// Inline SVG, sized by the caller through CSS. Each is decorative — the
// control around it carries the accessible name — so they are hidden from
// assistive tech rather than being read out as "image".

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

/** The launcher: two overlapping speech bubbles, as in the reference. */
export const ChatIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M15.5 12.5a3 3 0 0 1-3 3H7l-3.5 2.6V7.5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3Z" />
    <path d="M9 17.6v.9a3 3 0 0 0 3 3h5l3.5 2.2V13a3 3 0 0 0-3-3h-.9" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg {...base} strokeWidth={2} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** Header control. Three rules, matching the reference's hamburger. */
export const MenuIcon = (props) => (
  <svg {...base} strokeWidth={2} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

/** Paper plane, filled — it sits on a tinted button and reads better solid. */
export const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <path d="M3.2 11.1 20 3.3c.7-.3 1.4.4 1.1 1.1l-7.8 16.8c-.3.7-1.3.6-1.5-.1l-1.9-6.2a1 1 0 0 0-.7-.7l-6.2-1.9c-.7-.2-.8-1.2 0-1.5Z" />
  </svg>
);

export const ChevronIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/**
 * The bot's avatar.
 *
 * Drawn rather than loaded: it appears beside every answer, so an image file
 * would be a request on every page of the site for a 32px circle.
 */
export const BotAvatar = (props) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" {...props}>
    <defs>
      <linearGradient id="asst-av" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8F2793" />
        <stop offset="100%" stopColor="#D53B7E" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="20" fill="url(#asst-av)" />
    <g stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="15.5" width="16" height="12" rx="4" />
      <path d="M20 11.5v4M16.5 21h.01M23.5 21h.01" />
      <path d="M12 20.5h-1.5M28 20.5h1.5" />
    </g>
  </svg>
);
