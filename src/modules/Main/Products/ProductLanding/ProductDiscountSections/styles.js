export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');

  .pdl-wrap {
    --pdl-bg:#F4F4F5; --pdl-card:#FFFFFF; --pdl-ink:#0B0B0F;
    --pdl-muted:#54545E; --pdl-black:#08080A; --pdl-radius:28px;
    /* Chrome sitting over the viewport: MainNav is position:fixed and
       ProductsSubNav is sticky at top:0. 108px is this module's own documented
       total for the pair — see the .hero-slider offset in ../../styles.js. */
    --pdl-chrome: 108px;
    background: var(--pdl-bg);
    box-sizing: border-box;
    padding: clamp(30px, 4.4vh, 60px) clamp(24px, 4vw, 56px);
    font-family: 'Jost', sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    /* Subtract the combined height of the main nav and sub nav (128px)
       so the section fits perfectly in the viewport without scrolling past. */
    height: calc(100vh - 128px);
    overflow: hidden;
    scroll-margin-top: var(--pdl-chrome);
  }

  /* Left + right tiles span both rows, so their combined height matches
     banner + gap + centre tile. */
  .pdl-grid {
    max-width: 1440px; width: 100%; margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.3fr 1fr;
    grid-template-rows: minmax(0, auto) minmax(0, 1fr);
    gap: clamp(16px, 2.5vw, 28px);
    flex: 1 1 auto; min-height: 0;
  }
  .pdl-left   { grid-row: 1 / span 2; grid-column: 1; margin-bottom: clamp(12px, 2vh, 24px); }
  .pdl-right  { grid-row: 1 / span 2; grid-column: 3; margin-bottom: clamp(12px, 2vh, 24px); }
  .pdl-banner { grid-row: 1; grid-column: 2; }
  .pdl-mid    { grid-row: 2; grid-column: 2; }

  .pdl-card {
    background: var(--pdl-card);
    border-radius: var(--pdl-radius);
    overflow: hidden;
    display: flex; flex-direction: column;
    min-height: 0;
    transition: box-shadow .35s cubic-bezier(.22,1,.36,1);
  }
  .pdl-card:hover { box-shadow: 0 18px 44px -28px rgba(11,11,15,.35); }

  .pdl-card-content {
    display: flex; flex-direction: column; flex: 0 0 auto;
    padding: clamp(28px, 3.4vh, 40px) clamp(28px, 2.4vw, 40px) 0;
    align-items: flex-start; text-align: left;
  }
  
  .pdl-left .pdl-card-content,
  .pdl-right .pdl-card-content {
    padding: clamp(32px, 4vh, 44px) clamp(32px, 4vw, 44px) 0;
  }

  /* Make the middle tile horizontal */
  .pdl-mid {
    flex-direction: row;
  }
  .pdl-mid .pdl-card-content {
    flex: 1 1 auto;
    padding: clamp(32px, 4vh, 48px) 0 clamp(32px, 4vh, 48px) clamp(40px, 4vw, 56px);
    justify-content: center;
    align-items: flex-start; text-align: left;
  }
  .pdl-mid .pdl-media {
    margin-top: auto; padding-bottom: 0;
    flex: 0 0 50%; height: 80%; /* Constrain height so it's not taller than side images */
    align-items: flex-end; justify-content: flex-end;
  }
  .pdl-mid .pdl-img {
    object-position: right bottom;
  }

  .pdl-count {
    font-size: clamp(14px, 2vh, 16px); font-weight: 500; color: var(--pdl-ink);
    letter-spacing: .01em; margin: 0; flex: 0 0 auto;
  }
  .pdl-title {
    font-size: clamp(25px, min(2.5vw, 4.6vh), 38px); font-weight: 700;
    color: var(--pdl-ink); letter-spacing: -.015em;
    line-height: 1.1; margin: clamp(10px, 1.5vh, 14px) 0 0; flex: 0 0 auto;
  }

  .pdl-link {
    margin-top: clamp(24px, 3.4vh, 32px); padding: 0; border: 0; background: none;
    font-family: inherit; font-size: clamp(15px, 2.1vh, 18px); font-weight: 400;
    flex: 0 0 auto;
    color: var(--pdl-ink); cursor: pointer;
    display: inline-flex; align-items: center; gap: 12px;
    align-self: flex-start;
  }
  .pdl-arrow {
    width: 22px; height: 1.6px; background: currentColor;
    position: relative; flex-shrink: 0;
    transition: width .25s cubic-bezier(.22,1,.36,1);
  }
  .pdl-arrow::after {
    content: ''; position: absolute; right: 0; top: -3.2px;
    width: 8px; height: 8px;
    border-top: 1.6px solid currentColor; border-right: 1.6px solid currentColor;
    transform: rotate(45deg);
  }
  .pdl-link:hover .pdl-arrow,
  .pdl-link:focus-visible .pdl-arrow { width: 32px; }

  .pdl-media {
    flex: 1 1 auto; margin-top: clamp(24px, 3vh, 32px);
    display: flex; align-items: flex-end; justify-content: center;
    min-height: 0;
  }
  .pdl-img {
    width: 100%; height: 100%; max-height: 100%;
    object-fit: contain; object-position: bottom; display: block;
    transition: transform .55s cubic-bezier(.22,1,.36,1);
  }
  .pdl-card:hover .pdl-img { transform: scale(1.045); }

  /* centre promo banner */
  .pdl-banner {
    background: var(--pdl-black);
    border-radius: var(--pdl-radius);
    padding: clamp(32px, 4vh, 48px) 32px clamp(36px, 5vh, 52px);
    text-align: center; min-height: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .pdl-banner-ey {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: clamp(13px, 1.8vh, 15px); font-weight: 500; color: #fff; margin: 0;
  }
  .pdl-banner-ey::before {
    content: ''; width: 10px; height: 10px; border-radius: 50%;
    background: #fff; flex-shrink: 0;
    box-shadow: 0 0 16px 4px rgba(255,255,255,.45);
  }
  .pdl-banner-title {
    font-size: clamp(28px, min(3.8vw, 6vh), 48px); font-weight: 700;
    color: #fff; letter-spacing: -.02em; line-height: 1;
    margin: clamp(10px, 2vh, 16px) 0 0;
  }

  /* Stacked layouts are taller than a viewport by nature, so the tiles go back
     to normal flow and the page scrolls. */
  @media (max-width: 1024px) {
    .pdl-wrap {
      height: auto; overflow: visible; display: block;
      padding: 48px 28px;
    }
    .pdl-img { height: auto; max-height: 360px; }
    .pdl-grid { grid-template-columns: 1fr 1fr; grid-template-rows: none; }
    .pdl-side, .pdl-banner, .pdl-mid { grid-row: auto; grid-column: auto; }
    .pdl-banner { grid-column: 1 / -1; order: -1; }
    .pdl-card { min-height: 380px; }
    
    /* Revert middle tile to vertical on mobile */
    .pdl-mid {
      flex-direction: column;
    }
    .pdl-mid .pdl-card-content {
      padding: clamp(24px, 3.4vh, 36px) clamp(24px, 2.4vw, 36px) 0;
      justify-content: flex-start;
    }
    .pdl-mid .pdl-media {
      margin-top: clamp(16px, 2.6vh, 26px); padding-bottom: clamp(20px, 3.2vh, 34px);
      flex: 1 1 auto; height: auto; width: 100%;
      align-items: flex-end; justify-content: center;
    }
    .pdl-mid .pdl-img {
      object-position: bottom;
    }
  }

  @media (max-width: 640px) {
    .pdl-wrap { padding: 36px 16px; }
    .pdl-grid { grid-template-columns: 1fr; gap: 16px; }
    .pdl-card { padding: 28px 26px 0; min-height: 340px; }
    .pdl-banner { padding: 36px 24px 40px; }
    .pdl-img { max-height: 260px; }
  }
`;
