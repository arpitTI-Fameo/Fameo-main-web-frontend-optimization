export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

  .plh-wrap {
    /* Neutral monochrome palette to match the site theme */
    --plh-band: #F4F4F4;
    --plh-bar: #FFFFFF;
    --plh-line: #EEEEF2;
    --plh-ink: #111118;
    --plh-muted: #71717A;
    --plh-crumb: #A1A1AA;
    --plh-pill: #F4F4F5;
    --plh-pill-ink: #52525B;

    font-family: 'Inter', sans-serif;
  }

  .plh-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── title band ── */
  .plh-band { background: var(--plh-band); }
  .plh-band .plh-inner {
    padding-top: clamp(24px, 3.6vh, 38px);
    padding-bottom: clamp(20px, 3vh, 30px);
  }

  .plh-crumbs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 12.5px;
    line-height: 1;
    color: var(--plh-crumb);
  }
  .plh-crumb-slot { display: inline-flex; align-items: center; }
  .plh-crumb {
    color: inherit;
    text-decoration: none;
    transition: color .2s ease;
  }
  .plh-crumb:hover { color: var(--plh-ink); }
  .plh-crumb.is-current { color: #52525B; }
  .plh-sep { margin: 0 8px; color: #D4D4D8; }

  .plh-head {
    margin-top: clamp(24px, 4vh, 32px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }
  .plh-headline { 
    flex: 1; 
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .plh-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4.4vw, 48px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: .02em;
    text-transform: uppercase;
    color: #1A1A1A;
  }

  .plh-sub {
    margin: 16px 0 0;
    max-width: 560px;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.6;
    color: #4A4A4A;
  }

  .plh-count {
    margin: 24px 0 0;
    flex: none;
    font-size: 12.5px;
    line-height: 1;
    color: var(--plh-muted);
    white-space: nowrap;
  }

  .plh-hero-image {
    flex: 1.2;
    max-width: 600px;
  }
  .plh-hero-image img {
    width: 100%;
    height: auto;
    aspect-ratio: 3.5 / 1;
    display: block;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  }

  /* ── control bar ── */
  .plh-bar {
    background: var(--plh-bar);
  }
  .plh-bar-inner {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .plh-bar-inner > *:not(:last-child) {
    position: relative;
  }
  .plh-bar-inner > *:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 24px;
    background: var(--plh-line);
  }

  .plh-filters {
    appearance: none;
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 999px;
    padding: 11px 22px;
    background: var(--plh-ink);
    color: #FFFFFF;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    transition: background .22s ease, transform .22s ease;
  }
  .plh-filters:hover { background: #000000; }
  .plh-filters:active { transform: scale(.97); }

  .plh-pills {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .plh-pills::-webkit-scrollbar { display: none; }

  .plh-pill {
    appearance: none;
    flex: none;
    border: 0;
    border-radius: 999px;
    padding: 10px 20px;
    background: var(--plh-pill);
    color: var(--plh-pill-ink);
    font: inherit;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition: background .22s ease, color .22s ease;
  }
  .plh-pill:hover { background: #E4E4E7; color: #3F3F46; }
  .plh-pill.is-on { background: var(--plh-ink); color: #FFFFFF; }

  .plh-tools {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-left: auto;
    flex: none;
  }

  .plh-sort {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--plh-muted);
  }
  .plh-sort-label { white-space: nowrap; }
  .plh-select-wrap { position: relative; display: inline-flex; align-items: center; }
  .plh-select {
    appearance: none;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--plh-ink);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    padding: 6px 24px 6px 4px;
    cursor: pointer;
  }
  .plh-chev {
    position: absolute;
    right: 3px;
    display: inline-flex;
    color: var(--plh-muted);
    pointer-events: none;
  }

  .plh-views { display: inline-flex; align-items: center; gap: 6px; }
  .plh-view {
    appearance: none;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid var(--plh-line);
    background: #FFFFFF;
    color: #71717A;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .22s ease, color .22s ease, border-color .22s ease;
  }
  .plh-view:hover { border-color: #D4D4D8; color: var(--plh-ink); }
  .plh-view.is-on {
    background: var(--plh-ink);
    border-color: var(--plh-ink);
    color: #FFFFFF;
  }

  @media (max-width: 1040px) {
    .plh-bar-inner { flex-wrap: wrap; }
    .plh-pills { order: 3; width: 100%; }
  }

  @media (max-width: 680px) {
    .plh-head { flex-direction: column; align-items: flex-start; gap: 24px; }
    .plh-hero-image { width: 100%; max-width: none; }
    .plh-count { margin-top: 16px; }
    .plh-sub { max-width: none; }
    .plh-filters { padding: 10px 18px; }
    .plh-pill { padding: 9px 16px; font-size: 12.5px; }
    .plh-sort-label { display: none; }
    .plh-view { width: 34px; height: 34px; border-radius: 9px; }
  }
`;
