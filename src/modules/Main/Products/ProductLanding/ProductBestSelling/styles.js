export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .bsp-wrap {
    --bsp-bg:#FFFFFF;
    --bsp-ink:#111111;
    --bsp-mute:#A6A6A6;
    /* Centre-card size. Every other card is a fraction of these. */
    --bsp-cw:clamp(132px, 14.5vw, 200px);
    --bsp-ch:clamp(236px, 25vw, 344px);
    --bsp-ease:cubic-bezier(.22,.61,.36,1);
    background: var(--bsp-bg);
    padding: clamp(56px, 7vh, 104px) clamp(24px, 5vw, 76px) clamp(40px, 5vh, 68px);
    font-family: 'Inter', sans-serif;
    color: var(--bsp-ink);
  }

  /* header */
  .bsp-head { max-width: 1280px; margin: 0 auto; }
  .bsp-title {
    margin: 0;
    font-size: clamp(15px, 1.4vw, 19px);
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #2B2B2B;
  }
  .bsp-tabs {
    margin-top: 9px;
    display: flex; flex-wrap: wrap; align-items: center;
    font-size: 13.5px;
  }
  .bsp-tabcell { display: inline-flex; align-items: center; }
  .bsp-sep { color: #CFCFCF; margin: 0 7px; }
  .bsp-tab {
    appearance: none; border: 0; background: none; padding: 1px 0;
    font: inherit; color: var(--bsp-mute); cursor: pointer;
    transition: color .25s var(--bsp-ease);
  }
  .bsp-tab:hover { color: #6B6B6B; }
  .bsp-tab.is-on { color: var(--bsp-ink); }

  /* stage */
  .bsp-stage {
    position: relative;
    height: calc(var(--bsp-ch) * 1.4);
    margin: clamp(22px, 3.5vh, 44px) auto 0;
    max-width: 1280px;
    outline: none;
    touch-action: pan-y;
    -webkit-user-select: none; user-select: none;
  }
  .bsp-stage:focus-visible { outline: 1px solid rgba(0,0,0,.2); outline-offset: 12px; border-radius: 12px; }
  .bsp-rail {
    position: absolute; inset: 0;
    animation: bsp-fade .5s var(--bsp-ease) both;
  }
  @keyframes bsp-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  /* card — plain rounded rectangle, full-bleed photo, never dimmed */
  .bsp-card {
    position: absolute; top: 50%; left: 50%;
    width: var(--w); height: var(--h);
    margin: calc(var(--h) / -2) 0 0 calc(var(--w) / -2);
    border-radius: clamp(16px, 2.4vw, 26px);
    overflow: hidden;
    background: #EDEDED;
    cursor: pointer;
    opacity: 1;
    transform: translateX(var(--tx)) translateY(var(--ty)) rotate(var(--rot));
    transition:
      transform .62s var(--bsp-ease),
      width .62s var(--bsp-ease),
      height .62s var(--bsp-ease),
      margin .62s var(--bsp-ease),
      opacity .4s var(--bsp-ease),
      box-shadow .45s var(--bsp-ease);
  }

  /* Fan geometry — coverflow style.
     Centre card: straight, largest, pushed slightly down (front).
     ±1 cards: tilted outward ~10deg, scaled to 0.9, tucked behind centre.
     ±2 cards: tilted outward ~14deg, scaled to 0.8, furthest behind.
     All cards share a common vertical centre; the centre card drops
     down to sit in front of its neighbours. */
  .bsp-card[data-d="0"] {
    --w: var(--bsp-cw);
    --h: var(--bsp-ch);
    --tx: 0px;
    --ty: calc(var(--bsp-ch) * .12);
    --rot: 0deg;
    z-index: 5;
    box-shadow: 0 18px 44px rgba(0,0,0,.16);
  }
  .bsp-card[data-d="1"] {
    --w: calc(var(--bsp-cw) * .88);
    --h: calc(var(--bsp-ch) * .95);
    --ty: 0px;
    z-index: 4;
    box-shadow: 0 10px 26px rgba(0,0,0,.08);
  }
  .bsp-card[data-d="1"][data-side="l"] { --tx: calc(var(--bsp-cw) * -1.05); --rot: 10deg; }
  .bsp-card[data-d="1"][data-side="r"] { --tx: calc(var(--bsp-cw) *  1.05); --rot: -10deg; }
  .bsp-card[data-d="2"] {
    --w: calc(var(--bsp-cw) * .78);
    --h: calc(var(--bsp-ch) * .85);
    --ty: calc(var(--bsp-ch) * .02);
    z-index: 3;
    box-shadow: 0 8px 20px rgba(0,0,0,.05);
  }
  .bsp-card[data-d="2"][data-side="l"] { --tx: calc(var(--bsp-cw) * -1.88); --rot: 14deg; }
  .bsp-card[data-d="2"][data-side="r"] { --tx: calc(var(--bsp-cw) *  1.88); --rot: -14deg; }

  /* the card crossing the seam jumps instead of flying across the strip */
  .bsp-card[data-wrap="1"] { transition: none; opacity: 0; }

  /* affordance only — no geometry change, so the fan never breaks */
  .bsp-card:not(.is-on):hover { box-shadow: 0 16px 32px rgba(0,0,0,.13); }

  .bsp-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    -webkit-user-drag: none;
  }
  .bsp-shade {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.14) 17%, rgba(0,0,0,0) 34%);
  }

  /* label block — visible on every card, bottom-left */
  .bsp-meta {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 0 14px 13px;
    text-align: left;
    pointer-events: none;
  }
  .bsp-name {
    margin: 0;
    font-size: 9px; font-weight: 500;
    letter-spacing: .06em; text-transform: uppercase;
    overflow-wrap: break-word;
    color: #FFFFFF;
    text-shadow: 0 1px 6px rgba(0,0,0,.5);
  }
  .bsp-price {
    margin: 5px 0 0;
    display: flex; align-items: baseline; gap: 7px;
    font-size: 15px; font-weight: 600; color: #FFFFFF;
    text-shadow: 0 1px 6px rgba(0,0,0,.5);
    animation: bsp-rise .45s var(--bsp-ease) both;
  }
  .bsp-card.is-on .bsp-meta { padding-right: 52px; }
  .bsp-was { font-size: 10px; font-weight: 400; color: rgba(255,255,255,.6); }
  @keyframes bsp-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

  /* bag button — bottom-right of the centre card, level with the price */
  .bsp-bag {
    position: absolute; right: 12px; bottom: 12px;
    width: 30px; height: 30px; border-radius: 50%;
    border: 0; background: rgba(255,255,255,.94); color: #111111;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer;
    animation: bsp-rise .45s var(--bsp-ease) both;
    transition: background .2s var(--bsp-ease), transform .2s var(--bsp-ease);
  }
  .bsp-bag:hover { background: #FFFFFF; transform: scale(1.08); }

  /* arrows */
  .bsp-nav {
    display: flex; justify-content: center; align-items: center; gap: 10px;
    margin-top: clamp(16px, 2.5vh, 30px);
  }
  .bsp-arrow {
    width: 42px; height: 42px; border-radius: 50%;
    border: 0; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    background: #F2F2F2; color: #C4C4C4;
    transition: background .25s var(--bsp-ease), color .25s var(--bsp-ease), transform .25s var(--bsp-ease);
  }
  .bsp-arrow:hover { background: #E8E8E8; color: #8A8A8A; }
  .bsp-arrow.is-next { background: #141414; color: #FFFFFF; }
  .bsp-arrow.is-next:hover { background: #000000; transform: scale(1.06); }
  .bsp-arrow:active { transform: scale(.94); }

  @media (max-width: 760px) {
    .bsp-card { border-radius: 14px; }
    .bsp-card[data-d="0"] { --ty: calc(var(--bsp-ch) * .1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .bsp-card, .bsp-rail, .bsp-price, .bsp-bag { transition-duration: .01ms; animation-duration: .01ms; }
  }
`;
