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
    width: 100%;
    max-width: 1100px;
    margin: clamp(22px, 3.5vh, 44px) auto 0;
    outline: none;
    touch-action: pan-y;
    -webkit-user-select: none; user-select: none;
  }
  .bsp-stage:focus-visible { outline: 1px solid rgba(0,0,0,.2); outline-offset: 12px; border-radius: 12px; }

  /* The gallery.
     Flexbox lays the five cards out from their own widths plus the gap, so the
     fan is never positioned by hand. That is what drifted before: the cards were
     absolutely positioned and each one carried a hand-measured translateX, which
     does not follow a width change — so every breakpoint needed its own set of
     offsets and they ended up disagreeing with the widths they were derived from.
     Here a card only declares its size and its own rotation; where it lands is
     the flex line's job.

     perspective on this element is what turns the children's rotateY into depth
     rather than a flat squash. */
  .bsp-rail {
    position: relative;
    width: 100%;
    height: 550px;
    perspective: 1200px;
    transform-style: preserve-3d;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    animation: bsp-fade .5s cubic-bezier(0.25, 0.8, 0.25, 1) both;
  }

  /* base card — every position below overrides the size and the transform */
  .bsp-card {
    position: relative;
    flex-shrink: 0;
    width: 170px;
    height: 340px;
    border-radius: 26px;
    overflow: hidden;
    background: #F1F1F2;
    box-shadow:
      0 12px 36px rgba(0, 0, 0, 0.09),
      0 4px 12px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    opacity: 1;
    transform-style: preserve-3d;
    transition:
      transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
      width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
      height 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
      opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    will-change: transform;
  }

  /* The five cards also sit on a vertical arc: the inner pair is the high
     point (-28px), the outer pair sits a little below it (+8px) and the centre
     card drops clearly under both (+38px).

     translateY goes LAST in each transform, after scale(). Transform functions
     compose left to right, so a trailing translateY is applied in the card's
     own already-scaled frame — an outer card's 8px is really 8 x 0.90. Moving
     it to the front of the list would change the offset. Keep the order.

     CARD 1 — LEFT OUTER. No rotateZ: rotateY alone gives the 3D angle while the
     card itself stays vertically straight; a rotateZ on top of it is what made
     the fan look like it was toppling over. transform-origin pins the rotation
     to the edge facing the centre, so the card swings away from the middle
     rather than through it. */
  .bsp-card[data-d="2"][data-side="l"] {
    z-index: 1;
    width: 185px;
    height: 340px;
    transform-origin: right center;
    transform: translateX(20px) rotateY(44deg) translateZ(-40px) scale(0.90) translateY(8px);
  }
  .bsp-card[data-d="2"][data-side="l"]:hover {
    transform: translateX(20px) rotateY(44deg) translateZ(-20px) scale(0.92) translateY(-2px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.13);
  }

  /* CARD 2 — LEFT INNER. Medium 3D angle, and the top of the arc. */
  .bsp-card[data-d="1"][data-side="l"] {
    z-index: 2;
    width: 210px;
    height: 375px;
    transform-origin: right center;
    transform: rotateY(32deg) translateZ(-20px) scale(0.95) translateY(-28px);
  }
  .bsp-card[data-d="1"][data-side="l"]:hover {
    transform: rotateY(32deg) translateZ(0px) scale(0.97) translateY(-38px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.13);
  }

  /* CARD 3 — CENTRE. Completely flat and front-facing, and the lowest of
     the five so the flanks read as rising away from it. */
  .bsp-card[data-d="0"] {
    z-index: 5;
    width: 260px;
    height: 420px;
    transform-origin: center center;
    transform: rotateY(0deg) rotateZ(0deg) translateZ(45px) scale(1) translateY(38px);
    box-shadow:
      0 16px 45px rgba(0, 0, 0, 0.12),
      0 6px 16px rgba(0, 0, 0, 0.05);
  }
  .bsp-card[data-d="0"]:hover {
    transform: rotateY(0deg) rotateZ(0deg) translateZ(60px) scale(1.03) translateY(26px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
  }

  /* CARD 4 — RIGHT INNER. Mirror of card 2. */
  .bsp-card[data-d="1"][data-side="r"] {
    z-index: 2;
    width: 210px;
    height: 375px;
    transform-origin: left center;
    transform: rotateY(-32deg) translateZ(-20px) scale(0.95) translateY(-28px);
  }
  .bsp-card[data-d="1"][data-side="r"]:hover {
    transform: rotateY(-32deg) translateZ(0px) scale(0.97) translateY(-38px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.13);
  }

  /* CARD 5 — RIGHT OUTER. Mirror of card 1. */
  .bsp-card[data-d="2"][data-side="r"] {
    z-index: 1;
    width: 185px;
    height: 340px;
    transform-origin: left center;
    transform: translateX(-20px) rotateY(-44deg) translateZ(-40px) scale(0.90) translateY(8px);
  }
  .bsp-card[data-d="2"][data-side="r"]:hover {
    transform: translateX(-20px) rotateY(-44deg) translateZ(-20px) scale(0.92) translateY(-2px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.13);
  }

  /* the card crossing the seam jumps instead of flying across the strip */
  .bsp-card[data-wrap="1"] { transition: none; opacity: 0; }

  .bsp-img {
    width: 80%; height: 60%; object-fit: contain; display: block;
    margin: 15% auto 0;
    -webkit-user-drag: none;
  }
  .bsp-shade {
    position: absolute; inset: 0; pointer-events: none;
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
    color: #111111;
  }
  .bsp-price {
    margin: 5px 0 0;
    display: flex; align-items: baseline; gap: 7px;
    font-size: 15px; font-weight: 600; color: #111111;
    animation: bsp-rise .45s var(--bsp-ease) both;
  }
  .bsp-card.is-on .bsp-meta { padding-right: 52px; }
  .bsp-was { font-size: 10px; font-weight: 400; color: #777777; }
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

  /* Responsive.

     Two things differ from the reference here, both deliberate.

     1. Specificity. The reference can override sizes with a bare .card rule,
        because .card and .card-1 are equally specific and source order decides.
        Ours keys off [data-d]/[data-side], which outranks a plain .bsp-card —
        the flank sizes have to be restated through the same selectors or the
        override silently loses.

     2. The sizes are a ceiling, not a constant. The reference's fixed pixel
        widths do not actually fit the row they sit in: five cards need 798px
        but only ~797px is free at 886px wide and less below that, and three
        cards need 396px against 382px at 430px wide. The reference gets away
        with it because body sets overflow-x:hidden, so the outer cards are
        quietly clipped instead of wrapping. min() keeps the reference's exact
        numbers at the top of each range — 145/170 at 1000px, 120/140 at 500px —
        and scales them down in proportion below, so nothing is ever cut off.
        Aspect ratios are the reference's: 2.069 for a flank, 2.0 for the
        centre card. */
  @media (max-width: 1000px) {
    .bsp-rail { gap: 12px; height: 480px; }
    .bsp-card { border-radius: 20px; }
    .bsp-card[data-d="2"][data-side="l"],
    .bsp-card[data-d="1"][data-side="l"],
    .bsp-card[data-d="1"][data-side="r"],
    .bsp-card[data-d="2"][data-side="r"] {
      width: min(185px, 18.5vw);
      height: min(330px, 33vw);
    }
    .bsp-card[data-d="0"] {
      width: min(210px, 21vw);
      height: min(370px, 37vw);
    }
  }

  /* 760px, not the reference's 750px, because BEST_SELLING_NARROW_BP switches
     the strip from five cards to three at 760 — a 10px window where the two
     disagreed would size three cards off the five-card rule. The reference also
     turns the row into a horizontal scroller at this breakpoint; that exists to
     keep five cards reachable on a phone, which does not apply once we are down
     to three, so the row stays centred. Three cards at these sizes fit every
     width this block covers (down to 501px), so no min() is needed. */
  @media (max-width: 760px) {
    .bsp-rail { gap: 10px; height: 420px; }
    .bsp-card { border-radius: 18px; }
    .bsp-card[data-d="1"][data-side="l"],
    .bsp-card[data-d="1"][data-side="r"] { width: 160px; height: 290px; }
    .bsp-card[data-d="0"] { width: 185px; height: 330px; }
  }

  @media (max-width: 500px) {
    .bsp-rail { gap: 8px; height: min(400px, 84vw); }
    .bsp-card { border-radius: 14px; }
    .bsp-card[data-d="1"][data-side="l"],
    .bsp-card[data-d="1"][data-side="r"] {
      width: min(150px, 30vw);
      height: min(270px, 54vw);
    }
    .bsp-card[data-d="0"] {
      width: min(180px, 36vw);
      height: min(320px, 64vw);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bsp-card, .bsp-rail, .bsp-price, .bsp-bag { transition-duration: .01ms; animation-duration: .01ms; }
  }
`;
