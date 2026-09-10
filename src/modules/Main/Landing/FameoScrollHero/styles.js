export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Fraunces:opsz,wght@9..144,300;9..144,400&display=swap');
 
.tsc-wrap *, .tsc-wrap *::before, .tsc-wrap *::after { box-sizing: border-box; margin: 0; padding: 0; }
.tsc-wrap {
  /* brand rose tokens (matches the navbar + scroll sections palette) */
  --mn-rose:   #C24E74;
  --mn-rose-l: #D96A8E;
  --mn-rose-d: #9E3357;
  --mn-rose-grad: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
}
 
/* ── scroll runway + pinned stage ─────────────────────────────── */
.tsc-runway { position: relative; height: 500vh; background: #F2EFE9; }
.tsc-stage  {
  position: sticky; top: 0; height: 100vh; width: 100%;
  overflow: hidden; background: #F2EFE9;
}
/* Small-viewport unit: stays put while the mobile address bar shows/hides,
   so the pinned stage no longer drifts against the scroll progress.
   Browsers without svh support keep the 100vh above. Desktop is identical. */
@supports (height: 100svh){
  .tsc-stage { height: 100svh; }
}
 
/* ── scattered images ─────────────────────────────────────────── */
.tsc-scatter-img {
  position: absolute; overflow: hidden;
  will-change: transform, opacity;
}
.tsc-scatter-img img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
/* gentle idle float (only at rest — killed once scroll starts via JS opacity) */
@keyframes tscFloat {
  0%, 100% { translate: 0 0; }
  50%       { translate: 0 -8px; }
}
.tsc-scatter-img .tsc-float { animation: tscFloat 6s ease-in-out infinite; width:100%; height:100%; }
 
/* ── headline ─────────────────────────────────────────────────── */
.tsc-headline {
  position: absolute; inset: 0; z-index: 5;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  pointer-events: none;
}
.tsc-line {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(42px, 5.6vw, 92px);
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: #1A1A1A;
  white-space: nowrap;
  will-change: transform, opacity;
}
.tsc-line2 {
  display: flex; align-items: center; justify-content: center;
  width: 100vw;
}
.tsc-line2 .tsc-word { will-change: transform; }
 
/* the seed that grows into the fullscreen image */
.tsc-grow {
  position: relative; overflow: hidden; flex-shrink: 0;
  will-change: width, height;
  margin: 0 0.18em;
  background: #0E0C0A;               /* shows for the instant before load */
}
.tsc-grow img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; display: block;
  transition: opacity .6s ease;
}
/* The whole photo, never cropped. Contain on its own would letterbox, so a
   blurred, darkened copy fills the frame edge to edge behind it. The frame
   still reads full-bleed; the subject is never cut. */
.tsc-grow-fg { object-fit: contain; z-index: 1; }
.tsc-grow-bg {
  object-fit: cover; z-index: 0;
  filter: blur(26px) brightness(.5) saturate(1.15);
  transform: scale(1.12);            /* hides the blur's soft edge */
}
.tsc-grow-shade {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to top, rgba(10,8,6,.55) 0%, transparent 40%),
    linear-gradient(to bottom, rgba(10,8,6,.35) 0%, transparent 30%),
    radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(10,8,6,.35) 100%);
  will-change: opacity;
  z-index: 3;
}
 
/* trailing echo copies — each is a smaller, centered crop of the same
   image; the subject stays centered so the back layers' edges show as
   repeated bands during motion */
.tsc-echo {
  position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  will-change: width, height;
  z-index: 2;
}
.tsc-echo img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: contain; display: block;
}
 
/* ── fullscreen caption ───────────────────────────────────────── */
.tsc-caption {
  position: absolute; inset: 0; z-index: 8;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 400;
  font-size: clamp(26px, 3.4vw, 52px);
  letter-spacing: -0.015em;
  color: #fff; text-align: center; padding: 0 24px;
  will-change: opacity, transform;
}
 
/* ── curator UI layer ─────────────────────────────────────────── */
.tsc-curator { position: absolute; inset: 0; z-index: 9; will-change: opacity; }
.tsc-curator.off { pointer-events: none; }
 
.tsc-cur-name {
  position: absolute; left: 16.5%; top: 50%; transform: translateY(-50%);
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 400; font-size: clamp(15px, 1.15vw, 20px);
  letter-spacing: .01em; color: rgba(255,255,255,.92);
}
.tsc-cur-lines { position: absolute; inset: 0; pointer-events: none; }
.tsc-cur-lines line {
  stroke: rgba(255,255,255,.85); stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
 
.tsc-cur-bio {
  position: absolute; top: 24px; right: 32px;
  width: min(250px, 26vw);
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 400; font-size: 13.5px; line-height: 1.45;
  color: rgba(255,255,255,.95);
}
.tsc-cur-cats {
  position: absolute; right: 15%; top: 43%;
  font-family: 'Fraunces', serif;
  font-weight: 300; font-size: clamp(22px, 1.9vw, 30px);
  line-height: 1.28; color: rgba(255,255,255,.96);
  letter-spacing: .01em;
}
 
/* pagination dots */
.tsc-cur-dots {
  position: absolute; left: 14px; top: 42%;
  display: flex; flex-direction: column; gap: 14px;
}
.tsc-cur-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,255,255,.35);
  border: none; cursor: pointer; padding: 0;
  transition: background .25s, transform .25s;
}
.tsc-cur-dot.on { background: #fff; transform: scale(1.25); }
 
/* prev / next rose button */
.tsc-cur-btn {
  position: absolute; left: 46.5%; top: 47.5%;
  width: 46px; height: 46px; border-radius: 50%;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 18px;
  transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;
  box-shadow: 0 6px 24px rgba(0,0,0,.28);
}
.tsc-cur-btn:hover { transform: scale(1.1); }
 
/* thumbnail strip */
.tsc-cur-thumbs {
  position: absolute; right: 10px; bottom: 10px;
  display: flex; gap: 4px;
}
.tsc-cur-thumb {
  width: 56px; height: 104px; overflow: hidden; position: relative;
  cursor: pointer;
}
.tsc-cur-thumb img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: opacity .7s ease;
}
 
/* ── fixed chrome ─────────────────────────────────────────────── */
.tsc-navbar {
  position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
  z-index: 60; display: flex; align-items: stretch;
  background: #fff; height: 56px;
  box-shadow: 0 8px 32px rgba(20,15,10,.10);
}
.tsc-navbar-brand {
  display: flex; align-items: center; padding: 0 26px 0 24px;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 700; font-size: 24px; letter-spacing: -0.03em;
  color: #1A1A1A; text-decoration: none;
}
.tsc-navbar-login {
  display: flex; align-items: center; padding: 0 22px;
  font-family: 'Space Mono', monospace; font-size: 12px;
  letter-spacing: .08em; color: var(--mn-rose); text-decoration: none;
  transition: opacity .2s;
}
.tsc-navbar-login:hover { opacity: .65; }
.tsc-navbar-signup {
  display: flex; align-items: center; align-self: center;
  margin-right: 8px; padding: 0 26px; height: 44px; border-radius: 3px;
  font-family: 'Space Mono', monospace; font-size: 12px;
  letter-spacing: .08em; color: #fff; text-decoration: none;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  transition: filter .2s;
}
.tsc-navbar-signup:hover { filter: brightness(1.08); }
 
/* ── signed-in pill: identity chip replaces LOGIN, the button keeps the
      SIGN UP slot but carries the next real step for this account ── */
.tsc-navbar-me {
  display: flex; align-items: center; gap: 10px; padding: 0 20px;
  color: #1A1A1A; text-decoration: none; transition: opacity .2s;
}
.tsc-navbar-me:hover { opacity: .65; }
.tsc-navbar-av {
  width: 30px; height: 30px; border-radius: 50%; flex: none; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 52%, var(--mn-rose-d) 100%);
  color: #fff; font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: .01em;
}
.tsc-navbar-av img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tsc-navbar-name {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
  max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
/* holds the pill's width steady while the persisted store is read, so it
   doesn't visibly resize a beat after load */
.tsc-navbar-skel { width: 168px; }
 
.tsc-beta {
  position: fixed; left: 32px; bottom: 30px; z-index: 60;
  font-family: 'Space Mono', monospace; font-size: 11px;
  letter-spacing: .12em; color: #fff;
  mix-blend-mode: difference;
}
.tsc-scroll-cue {
  position: fixed; right: 32px; bottom: 22px; z-index: 60;
  display: flex; align-items: center; gap: 18px;
}
.tsc-scroll-cue span {
  font-family: 'Space Mono', monospace; font-size: 11px;
  letter-spacing: .12em; color: #fff;
  mix-blend-mode: difference;
}
.tsc-scroll-btn {
  width: 52px; height: 52px; border-radius: 50%;
  background: #fff; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(20,15,10,.10);
  transition: transform .25s;
}
.tsc-scroll-btn:hover { transform: translateY(2px); }
@keyframes tscNudge { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(3px);} }
.tsc-scroll-btn svg { animation: tscNudge 1.8s ease-in-out infinite; }
 
/* on dark (fullscreen) phase, flip fixed labels to light */
.tsc-stage.dark ~ .tsc-fixed .tsc-beta,
.tsc-fixed.dark .tsc-beta,
.tsc-fixed.dark .tsc-scroll-cue span { color: rgba(255,255,255,.85); }
 
/* ── responsive ───────────────────────────────────────────────── */
@media (max-width: 860px) {
  .tsc-cur-name  { left: 8%; }
  .tsc-cur-cats  { right: 8%; }
  .tsc-cur-bio   { right: 16px; width: 200px; font-size: 12px; }
  .tsc-cur-btn   { left: auto; right: 18%; }
  .tsc-navbar-brand { font-size: 20px; padding: 0 18px; }
  .tsc-navbar-me   { padding: 0 14px; gap: 8px; }
  .tsc-navbar-name { max-width: 84px; font-size: 13px; }
  .tsc-navbar-av   { width: 26px; height: 26px; font-size: 11px; }
  .tsc-navbar-skel { width: 130px; }
}
@media (prefers-reduced-motion: reduce) {
  .tsc-scatter-img .tsc-float, .tsc-scroll-btn svg { animation: none; }
}
`;
 
/* ═══════════════════════════════════════════════════════════════════════ */
