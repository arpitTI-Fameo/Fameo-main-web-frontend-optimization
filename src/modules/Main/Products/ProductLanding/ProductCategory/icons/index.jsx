// modules/Main/Products/ProductLanding/ProductCategory/icons/index.jsx

export function ArrowUpRightIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>); }
export function ArrowRightIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>); }

// Decorative ribbons in the bottom-right of the black panel.
export function HeroWaves() {
  return (
    <svg className="pc-hero-waves" viewBox="0 0 420 400" fill="none" aria-hidden="true" preserveAspectRatio="xMaxYMax slice">
      <g stroke="#ffffff" strokeOpacity=".07" strokeWidth="26" fill="none" strokeLinecap="round">
        <path d="M-20 392C60 330 40 250 120 198s150 10 196-60 30-140 120-180" />
        <path d="M60 420C140 358 120 278 200 226s150 10 196-60 30-140 120-180" />
        <path d="M140 448C220 386 200 306 280 254s150 10 196-60 30-140 120-180" />
      </g>
    </svg>
  );
}
