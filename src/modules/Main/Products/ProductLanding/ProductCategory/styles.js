export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');

  .pc-wrap {
    --pc-black:#08080A; --pc-ink:#0B0B0F; --pc-page:#FFFFFF;
    --pc-h: clamp(480px, 66vh, 800px);
    --pc-radius: clamp(18px, 1.6vw, 28px);
    background: var(--pc-page);
    padding: 0;
    font-family: 'Jost', sans-serif;
    /* The rail runs off the right edge by design — clip it here so the page
       itself never gains a horizontal scrollbar. */
    overflow: hidden;
    height: calc(100vh - 128px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  /* Provide horizontal padding for the heading to match the layout edge */
  .pc-head-padding {
    padding: 0 clamp(24px, 4vw, 56px);
  }

  .pc-row {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 37%) minmax(0, 1fr);
    gap: clamp(14px, 1.8vw, 28px);
    align-items: stretch;
  }

  /* ── black panel: flush to the left edge, rounded on the right ───────── */
  .pc-hero {
    position: relative; overflow: hidden;
    height: var(--pc-h);
    background: var(--pc-black);
    border-radius: 0 clamp(26px, 3vw, 44px) clamp(26px, 3vw, 44px) 0;
    padding: clamp(30px, 5vh, 72px) clamp(28px, 3.4vw, 60px);
    display: flex; flex-direction: column; justify-content: center;
  }
  .pc-hero-waves {
    position: absolute; right: -6%; bottom: -8%;
    width: 78%; height: auto; pointer-events: none;
  }
  .pc-hero-title {
    position: relative; z-index: 1;
    font-size: clamp(30px, min(3.6vw, 6.4vh), 62px); font-weight: 700;
    color: #fff; letter-spacing: -.025em; line-height: 1.08;
    margin: 0; max-width: 12ch;
  }
  .pc-hero-sub {
    position: relative; z-index: 1;
    font-size: clamp(14px, 2vh, 18px); font-weight: 400;
    color: rgba(255,255,255,.72); line-height: 1.6;
    margin: clamp(14px, 2.6vh, 28px) 0 0; max-width: 34ch;
  }
  .pc-hero-cta {
    position: relative; z-index: 1; align-self: flex-start;
    margin: clamp(20px, 4vh, 44px) 0 0;
    padding: clamp(13px, 1.9vh, 19px) clamp(28px, 2.6vw, 42px);
    border: 0; border-radius: 999px; cursor: pointer;
    background: #fff; color: var(--pc-ink);
    font-family: inherit; font-size: clamp(14px, 1.9vh, 17px); font-weight: 500;
    transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s;
  }
  .pc-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -14px rgba(0,0,0,.5); }
  .pc-hero-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

  /* ── rail ────────────────────────────────────────────────────────────── */
  .pc-rail-shell { position: relative; min-width: 0; height: var(--pc-h); }
  .pc-rail {
    display: flex; gap: clamp(14px, 1.6vw, 26px);
    height: 100%; padding-right: 56px;
    overflow-x: auto; overflow-y: hidden;
    scroll-snap-type: x mandatory; scroll-behavior: smooth;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .pc-rail::-webkit-scrollbar { display: none; }

  .pc-card {
    position: relative; flex: 0 0 clamp(230px, 23vw, 420px);
    height: 100%; scroll-snap-align: start; cursor: pointer;
  }
  .pc-card-frame {
    position: absolute; inset: 0;
    border-radius: var(--pc-radius); overflow: hidden;
    background: #EFEFF1;
  }
  /* The active card's top-right corner is bitten out so the open button sits
     in a clean gap rather than on top of the photo.

     A single radial-gradient can only cut a plain disc, and the two points
     where that disc meets the card's edges come out as sharp spikes. The notch
     is drawn as an SVG tile instead, so those junctions carry a real fillet and
     the edge flows into the cutout.

     The tile is a fixed 128x128 square pinned to the top-right corner; two flat
     layers fill the rest of the card and the three union together (mask layers
     composite with 'add' by default, so no mask-composite support is needed).

     Tile geometry, in tile coordinates — all of it follows from .pc-card-open
     below, so move the button and these move with it:
       notch centre (102, 26)  = the button's centre, which sits 26px in from
                                 the card's top and right edges
       notch radius 40         = the button's 30px radius + a 10px gap
       fillet radius 26        = the flare where the notch meets each edge
     The arc endpoints are the tangent points between those three circles, and
     every one of them is a whole number here: a fillet radius equal to the
     button's 26px inset puts each fillet centre square-on from the notch
     centre — (36, 26) and (102, 92) — so the tangents land on (62, 26) and
     (102, 66). Change the inset or the radius and these stop being integers;
     recompute them rather than rounding. */
  .pc-card.is-active .pc-card-frame {
    --pc-notch-tile: 128px;
    /* 1px of overlap between the layers — abutting them exactly leaves a
       hairline seam where the two alpha edges antialias against each other. */
    --pc-notch-fill: calc(100% - var(--pc-notch-tile) + 1px);

    -webkit-mask-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cpath d='M0 0L36 0A26 26 0 0 1 62 26A40 40 0 0 0 102 66A26 26 0 0 1 128 92L128 128L0 128Z' fill='%23000'/%3E%3C/svg%3E"),
      linear-gradient(#000, #000),
      linear-gradient(#000, #000);
    -webkit-mask-size:
      var(--pc-notch-tile) var(--pc-notch-tile),
      var(--pc-notch-fill) 100%,
      100% var(--pc-notch-fill);
    -webkit-mask-position: top right, top left, bottom left;
    -webkit-mask-repeat: no-repeat;

    mask-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cpath d='M0 0L36 0A26 26 0 0 1 62 26A40 40 0 0 0 102 66A26 26 0 0 1 128 92L128 128L0 128Z' fill='%23000'/%3E%3C/svg%3E"),
      linear-gradient(#000, #000),
      linear-gradient(#000, #000);
    mask-size:
      var(--pc-notch-tile) var(--pc-notch-tile),
      var(--pc-notch-fill) 100%,
      100% var(--pc-notch-fill);
    mask-position: top right, top left, bottom left;
    mask-repeat: no-repeat;
  }
  .pc-card-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .6s cubic-bezier(.22,1,.36,1);
  }
  .pc-card:hover .pc-card-img { transform: scale(1.05); }

  .pc-card-open {
    position: absolute; top: -4px; right: -4px; z-index: 2;
    width: 60px; height: 60px; border-radius: 50%; border: 0;
    background: var(--pc-black); color: #fff; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: transform .3s cubic-bezier(.22,1,.36,1);
  }
  .pc-card-open:hover { transform: rotate(45deg); }
  .pc-card-open:focus-visible { outline: 2px solid var(--pc-black); outline-offset: 3px; }

  .pc-card-info {
    position: absolute; z-index: 2;
    left: clamp(12px, 1.2vw, 20px); right: clamp(12px, 1.2vw, 20px);
    bottom: clamp(12px, 1.4vh, 20px);
    background: #fff; border-radius: clamp(14px, 1.2vw, 20px);
    padding: clamp(16px, 2.2vh, 26px) clamp(16px, 1.6vw, 28px);
    text-align: center;
  }
  .pc-card-meta {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-size: clamp(13px, 1.7vh, 16px); font-weight: 400;
    color: var(--pc-ink); margin: 0;
  }
  .pc-dash {
    width: clamp(34px, 3vw, 54px); height: 1px; flex-shrink: 0;
    background: repeating-linear-gradient(to right, var(--pc-ink) 0 6px, transparent 6px 10px);
  }
  .pc-card-title {
    font-size: clamp(18px, min(1.7vw, 2.8vh), 26px); font-weight: 700;
    color: var(--pc-ink); letter-spacing: -.015em; line-height: 1.2;
    margin: clamp(4px, .8vh, 8px) 0 0;
  }

  .pc-next {
    position: absolute; z-index: 3; top: 50%; right: 14px;
    transform: translateY(-50%);
    width: 58px; height: 58px; border-radius: 50%; border: 0;
    background: #fff; color: var(--pc-ink); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    box-shadow: 0 14px 34px -12px rgba(11,11,15,.4);
    transition: transform .28s cubic-bezier(.22,1,.36,1);
  }
  .pc-next:hover { transform: translateY(-50%) scale(1.07); }
  .pc-next:focus-visible { outline: 2px solid var(--pc-ink); outline-offset: 3px; }

  @media (max-width: 1024px) {
    .pc-wrap { 
      --pc-h: clamp(380px, 52vh, 560px); 
      padding: 44px 0;
      height: auto;
      display: block;
    }
    .pc-row { grid-template-columns: 1fr; gap: 20px; width: auto; }
    .pc-hero {
      border-radius: var(--pc-radius);
      margin: 0 20px; height: auto;
      padding: 40px 28px 44px;
    }
    .pc-hero-title { max-width: none; }
    .pc-rail { padding-left: 20px; }
  }

  @media (max-width: 640px) {
    .pc-wrap { --pc-h: 400px; padding: 32px 0; }
    .pc-hero { margin: 0 16px; padding: 30px 22px 34px; }
    .pc-rail { padding-left: 16px; padding-right: 16px; }
    .pc-card { flex: 0 0 76vw; }
    .pc-next { right: 10px; width: 48px; height: 48px; }
  }
`;
