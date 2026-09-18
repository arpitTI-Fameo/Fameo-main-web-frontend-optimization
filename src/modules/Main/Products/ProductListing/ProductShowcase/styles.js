/* ── styles ────────────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Archivo:wght@300;400;500&family=Space+Mono:wght@400&display=swap');

.ps-root {
  --paper: #f2eee7;
  --ink: #1c1a17;
  --stone: #877f72;
  --line: rgba(28,26,23,.14);
  --gold: #c98a1b;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Archivo', system-ui, sans-serif;
  font-weight: 300;
  padding: 0;
  min-height: auto;
  box-sizing: border-box;
}
.ps-root *, .ps-root *::before, .ps-root *::after { box-sizing: inherit; }

/* hero copy */
.ps-hero { max-width: 60rem; margin: 0 auto 3rem; text-align: center; }
.ps-hero-eyebrow, .ps-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: .68rem; letter-spacing: .22em; text-transform: lowercase;
  color: var(--stone); margin: 0 0 1rem;
}
.ps-hero-title {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 300; font-size: clamp(2.2rem, 6vw, 4.2rem);
  line-height: 1.05; letter-spacing: -0.015em; margin: 0 0 1.25rem;
  text-transform: lowercase;
}
.ps-hero-intro { max-width: 34rem; margin: 0 auto; color: var(--stone); font-size: .98rem; line-height: 1.7; }

/* the scene */
.ps-scene { max-width: 100%; margin: 0 auto; }
.ps-scene-frame {
  position: relative; width: 100%;
  height: 100vh;
  overflow: hidden; border-radius: 0; background: #101014;
}
/* one layer per scene, stacked; only the scene on the clock is opaque */
.ps-layer { position: absolute; inset: 0; opacity: 0; transition: opacity 1.1s ease; }
.ps-layer.is-on { opacity: 1; }
.ps-layer video, .ps-layer img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
}
.ps-scene-caption {
  font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .14em;
  color: var(--stone); text-align: center; margin: .9rem 0 0;
}

/* viewfinder corner frame */
.ps-frame { position: absolute; inset: 12px; pointer-events: none; }
.ps-frame::before, .ps-frame::after {
  content: ''; position: absolute; width: 20px; height: 20px;
  border: 1px solid rgba(242,238,231,.75);
}
.ps-frame::before { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.ps-frame::after  { bottom: 0; right: 0; border-left: 0; border-top: 0; }

/* the maikasui "+" */
.ps-plus {
  position: absolute; transform: translate(-50%, -50%);
  width: 32px; height: 32px; border-radius: 50%; border: none;
  display: grid; place-items: center; cursor: pointer;
  background: rgba(242,238,231,.92); color: var(--ink);
  font-family: 'Space Mono', monospace; font-size: 1.05rem; line-height: 1;
  transition: transform .35s ease, background .35s ease, color .35s ease;
  animation: ps-breathe 3.6s ease-in-out infinite;
  z-index: 2;
}
@keyframes ps-breathe {
  0%, 100% { box-shadow: 0 0 0 0 rgba(242,238,231,.45); }
  50%      { box-shadow: 0 0 0 10px rgba(242,238,231,0); }
}
.ps-plus:hover, .ps-plus:focus-visible {
  transform: translate(-50%, -50%) scale(1.15);
  background: var(--gold); color: #fff;
}
.ps-plus::after {
  content: attr(data-tip); position: absolute; left: 50%; top: calc(100% + 10px);
  transform: translateX(-50%); white-space: nowrap;
  font-family: 'Space Mono', monospace; font-size: .6rem; letter-spacing: .08em;
  background: var(--ink); color: var(--paper); padding: .3rem .55rem; border-radius: 2px;
  opacity: 0; pointer-events: none; transition: opacity .3s ease;
}
.ps-plus:hover::after, .ps-plus:focus-visible::after { opacity: 1; }
.ps-plus:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

/* ── the day strip ─────────────────────────────────────────────── */
/* A ruler of one whole day: midnight at the left edge, midnight again at the
   right. Everything in here reads one custom property, --ps-play, which is
   the playhead as a percentage of the width. */
.ps-strip {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 3;
  padding: 0 clamp(14px, 2.6vw, 30px) 12px;
  background: linear-gradient(to top, rgba(16,16,20,.30), transparent 72%);
  user-select: none; -webkit-user-select: none;
  --ps-ink: rgba(28,26,23,.75);
  --ps-chip-bg: rgba(28,26,23,.72);
  --ps-chip-fg: var(--paper);
}
/* dark footage flips the strip: a light chip and light ticks */
.ps-strip[data-chip="paper"] {
  --ps-ink: rgba(242,238,231,.88);
  --ps-chip-bg: rgba(242,238,231,.88);
  --ps-chip-fg: var(--ink);
}
.ps-strip-row { display: flex; align-items: flex-end; gap: .75rem; }
.ps-ruler { position: relative; flex: 1; min-width: 0; }

/* the clock chip rides the playhead: offset by the playhead percentage of the
   track, pulled back by the same percentage of its own width — so it centres
   mid-day and tucks flush against either edge without ever overflowing */
.ps-clock {
  position: relative; display: inline-flex; align-items: center;
  left: var(--ps-play, 50%);
  transform: translateX(calc(var(--ps-play, 50%) * -1));
  margin: 0 0 .55rem; padding: .5rem .8rem;
  font-family: 'Space Mono', monospace; font-size: .72rem; letter-spacing: .1em;
  white-space: nowrap;
  background: var(--ps-chip-bg); color: var(--ps-chip-fg);
  backdrop-filter: blur(3px);
  transition: left .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1),
              background .8s ease, color .8s ease;
}

.ps-ruler-track { position: relative; height: 34px; cursor: ew-resize; touch-action: none; }
.ps-ruler-track:focus-visible { outline: 2px solid var(--ps-ink); outline-offset: 4px; }

/* the mask is what makes this a scale rather than a progress bar — ticks are
   only legible near the playhead and dissolve toward the far hours */
.ps-ruler-ticks {
  position: absolute; inset: 0;
  -webkit-mask-image: radial-gradient(34% 130% at var(--ps-play, 50%) 100%, #000 0%, rgba(0,0,0,.5) 44%, transparent 84%);
          mask-image: radial-gradient(34% 130% at var(--ps-play, 50%) 100%, #000 0%, rgba(0,0,0,.5) 44%, transparent 84%);
}
.ps-tick { position: absolute; bottom: 0; width: 1px; height: 7px; background: var(--ps-ink); }
.ps-tick.is-hour  { height: 13px; }
.ps-tick.is-major { height: 21px; }
.ps-head {
  position: absolute; bottom: 0; left: var(--ps-play, 50%);
  width: 1px; height: 30px; background: var(--ps-ink);
  transition: left .6s cubic-bezier(.2,.7,.2,1);
}

/* the glide is for the clock ticking over and for "now" snapping back. Under
   a finger it would just feel like lag, so a drag pins everything to the
   pointer. */
.ps-strip.is-dragging .ps-clock,
.ps-strip.is-dragging .ps-head { transition: none; }

.ps-strip-controls { display: flex; align-items: center; gap: .5rem; padding-bottom: 2px; }
.ps-playpause {
  width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(242,238,231,.5);
  background: rgba(16,16,20,.55); color: rgba(242,238,231,.9);
  font-size: .6rem; cursor: pointer; backdrop-filter: blur(2px);
}
.ps-playpause:hover { background: rgba(16,16,20,.85); }
.ps-now {
  font-family: 'Space Mono', monospace; font-size: .7rem; letter-spacing: .1em;
  padding: .5rem .85rem; border: none; cursor: pointer;
  background: var(--ps-chip-bg); color: var(--ps-chip-fg);
  backdrop-filter: blur(3px);
  transition: background .8s ease, color .8s ease, opacity .3s ease;
}
/* at the current time there is nowhere to go back to — the chip stays as a
   label, dimmed, rather than disappearing and shifting the row */
.ps-now:disabled { background: none; color: var(--ps-ink); opacity: .75; cursor: default; }
.ps-playpause:focus-visible, .ps-now:focus-visible { outline: 2px solid var(--ps-ink); outline-offset: 3px; }

/* index list */
.ps-index { max-width: 68rem; margin: 3.5rem auto 0; }
.ps-index-head {
  font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .18em;
  color: var(--stone); margin: 0 0 .5rem;
}
.ps-index-row {
  display: grid; grid-template-columns: 3rem minmax(0,1.3fr) minmax(0,1fr) auto;
  align-items: baseline; gap: 1rem; width: 100%;
  padding: 1.1rem .25rem; border: none; border-top: 1px solid var(--line);
  background: none; text-align: left; cursor: pointer; color: var(--ink);
}
.ps-index-row:last-of-type { border-bottom: 1px solid var(--line); }
.ps-index-num { font-family: 'Space Mono', monospace; font-size: .68rem; color: var(--stone); }
.ps-index-name {
  font-family: 'Fraunces', Georgia, serif; font-weight: 300;
  font-size: clamp(1.05rem, 2.2vw, 1.45rem); text-transform: lowercase;
  transition: font-style .01s;
}
.ps-index-row:hover .ps-index-name { font-style: italic; color: var(--gold); }
.ps-index-size { font-family: 'Space Mono', monospace; font-size: .64rem; letter-spacing: .05em; color: var(--stone); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ps-index-price { font-family: 'Space Mono', monospace; font-size: .82rem; white-space: nowrap; }
.ps-index-price em { font-style: normal; color: var(--gold); margin-left: .6rem; }
.ps-index-row:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.ps-loading { text-align: center; font-family: 'Space Mono', monospace; color: var(--stone); padding: 4rem 0; }
.ps-foot { max-width: 68rem; margin: 4rem auto 0; padding-top: 1.5rem; }
.ps-foot p { font-family: 'Space Mono', monospace; font-size: .62rem; letter-spacing: .1em; color: var(--stone); text-align: center; }

/* overlay */
.ps-overlay { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 1rem; }
.ps-scrim { position: absolute; inset: 0; background: rgba(28,26,23,.55); border: none; cursor: pointer; backdrop-filter: blur(3px); }
.ps-sheet {
  position: relative; background: var(--paper); width: min(62rem, 100%);
  max-height: 92vh; overflow-y: auto; border-radius: 3px;
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  animation: ps-rise .45s cubic-bezier(.2,.7,.2,1);
}
@keyframes ps-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
.ps-close {
  position: absolute; top: .75rem; right: .9rem; z-index: 2;
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--paper); color: var(--ink);
  font-size: 1.2rem; cursor: pointer;
}
.ps-close:hover { background: var(--ink); color: var(--paper); }

.ps-sheet-media { position: relative; min-height: 22rem; background: #16161b; }
.ps-sheet-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ps-sheet-fallback { position: absolute; inset: 0; display: grid; place-items: center;
  background: radial-gradient(120% 90% at 30% 20%, #3a3a46, #16161b 72%); }
.ps-glyph { font-family: 'Fraunces', Georgia, serif; font-size: 6rem; font-style: italic; color: rgba(242,238,231,.14); }

.ps-sheet-body { padding: clamp(1.75rem, 4vw, 3rem); }
.ps-sheet-title {
  font-family: 'Fraunces', Georgia, serif; font-weight: 300;
  font-size: clamp(1.6rem, 3vw, 2.3rem); line-height: 1.12;
  margin: 0 0 .4rem; text-transform: lowercase;
}
.ps-size { font-family: 'Space Mono', monospace; font-size: .68rem; color: var(--stone); letter-spacing: .06em; margin: 0 0 1rem; }
.ps-desc { color: var(--stone); font-size: .95rem; line-height: 1.8; margin: 1rem 0 1.5rem; }
.ps-features { list-style: none; margin: 0 0 2rem; padding: 0; display: grid; gap: .55rem; }
.ps-features li { font-size: .88rem; line-height: 1.5; }
.ps-dot { color: var(--gold); margin-right: .35rem; }

.ps-pricing { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--line); padding-top: 1.25rem; flex-wrap: wrap; }
.ps-price { font-family: 'Fraunces', Georgia, serif; font-size: 1.8rem; margin: 0; }
.ps-strike { font-family: 'Space Mono', monospace; font-size: .8rem; color: var(--stone); text-decoration: line-through; margin: .15rem 0 0; }
.ps-plan-note { font-family: 'Space Mono', monospace; font-size: .62rem; letter-spacing: .12em; color: var(--gold); margin: 0; text-transform: lowercase; }

.ps-actions { margin-top: 1.5rem; display: flex; align-items: center; gap: 1rem; }
.ps-cta {
  font-family: 'Space Mono', monospace; font-size: .78rem; letter-spacing: .14em;
  background: var(--ink); color: var(--paper); border: 1px solid var(--ink);
  padding: .85rem 2rem; cursor: pointer; border-radius: 2px;
  transition: background .3s ease, color .3s ease;
}
.ps-cta:hover:not(:disabled) { background: transparent; color: var(--ink); }
.ps-cta:disabled { opacity: .45; cursor: not-allowed; }
.ps-stock { font-family: 'Space Mono', monospace; font-size: .65rem; color: var(--gold); letter-spacing: .1em; }

/* responsive */
@media (max-width: 760px) {
  .ps-sheet { grid-template-columns: 1fr; }
  .ps-sheet-media { min-height: 15rem; position: relative; }
  .ps-index-row { grid-template-columns: 2rem minmax(0,1fr) auto; }
  .ps-index-size { display: none; }
  .ps-plus { width: 26px; height: 26px; font-size: .9rem; }
  .ps-clock { font-size: .64rem; padding: .42rem .6rem; letter-spacing: .06em; }
  .ps-now { font-size: .64rem; padding: .42rem .6rem; }
  .ps-ruler-track { height: 26px; }
  .ps-head { height: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .ps-root *, .ps-root *::before, .ps-root *::after { animation: none !important; transition: none !important; }
  /* the crossfade is the motion here, so scenes cut rather than dissolve */
  .ps-layer { transition: none; }
}
`;
