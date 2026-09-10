export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.tss * , .tss *::before, .tss *::after { box-sizing: border-box; margin: 0; padding: 0; }
.tss {
  font-family: 'Schibsted Grotesk', sans-serif; color: #1A1A1A;
  /* brand rose tokens (matches the navbar palette) */
  --mn-rose:   #C24E74;
  --mn-rose-l: #D96A8E;
  --mn-rose-d: #9E3357;
  --mn-rose-grad: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
}

/* ════ A. Intro statement + rail ═════════════════════════════════ */
.tss-intro {
  position: relative; background: #F2EFE9;
  padding: 16vh 40px 0;
}
.tss-intro-grid {
  max-width: 1500px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 340px; gap: 64px;
}
.tss-intro-copy {
  position: sticky; top: 12vh; align-self: start;
  font-size: clamp(30px, 3.55vw, 56px);
  font-weight: 500; line-height: 1.28; letter-spacing: -0.02em;
  padding-bottom: 24vh;
  will-change: opacity;
}
/* per-word scroll reveal */
.tss-word-r {
  display: inline-block;
  margin-right: 0.26em;
  will-change: transform, opacity;
}
.tss-intro-box {
  padding: 0 14px 2px;
  border: 1.5px solid #1A1A1A; border-radius: 12px;
  margin-right: 0.3em;
}
.tss-rail { display: flex; flex-direction: column; gap: 56px; padding-bottom: 30vh; }
.tss-card-img {
  position: relative; background: #E8E4DD; overflow: hidden;
  aspect-ratio: 1 / 1;
}
.tss-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tss-card-plus {
  position: absolute; right: 10px; bottom: 10px;
  width: 30px; height: 30px; border-radius: 3px;
  background: #fff; border: none; cursor: pointer;
  font-size: 15px; line-height: 1; color: #1A1A1A;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 10px rgba(20,15,10,.10);
}
.tss-card-save {
  position: absolute; left: 10px; bottom: 10px;
  width: 30px; height: 30px; border-radius: 3px;
  background: var(--mn-rose-grad); display: flex; align-items: center; justify-content: center;
}
.tss-card-title { font-size: 17px; font-weight: 500; margin-top: 12px; }
.tss-card-label {
  font-family: 'Space Mono', monospace; font-size: 10px;
  letter-spacing: .14em; color: #8B8781; margin-top: 4px;
}
/* the shared card mid-flight (rail → grid) */
.tss-flyer {
  position: fixed; z-index: 40;
  background: #E8E4DD; overflow: hidden;
  pointer-events: none;
  box-shadow: 0 24px 64px rgba(20,15,10,.16);
}
.tss-flyer img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

/* ════ B. Collection panel ═══════════════════════════════════════ */
.tss-panel {
  position: relative; z-index: 2;
  background: #fff; margin-top: -18vh;
  padding: 10vh 40px 14vh;
  box-shadow: 0 -20px 60px rgba(20,15,10,.07);
}
.tss-panel-head { text-align: center; margin-bottom: 8vh; }
.tss-panel-kicker { font-size: 14px; font-weight: 500; margin-bottom: 18px; }
.tss-panel-title {
  font-size: clamp(36px, 4.6vw, 66px); font-weight: 500;
  letter-spacing: -0.025em; line-height: 1.05;
}
.tss-panel-sub { font-size: 15px; color: #8B8781; margin-top: 18px; }
.tss-panel-meta {
  display: flex; align-items: center; justify-content: center; gap: 26px;
  margin-top: 16px;
  font-family: 'Space Mono', monospace; font-size: 10px;
  letter-spacing: .14em; color: #8B8781;
}
.tss-panel-meta svg { vertical-align: -2px; margin-right: 6px; }
.tss-grid {
  max-width: 1500px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 72px 24px;
}
/* offset alternating columns, like the reference */
.tss-grid > div:nth-child(4n+2) { transform: translateY(44px); }
.tss-grid > div:nth-child(4n+4) { transform: translateY(24px); }

/* ════ C. Kinetic word bands ═════════════════════════════════════ */
.tss-cur { background: #EFEDE7; position: relative; overflow: hidden; }
.tss-cur-band {
  position: relative; min-height: 104vh;
  display: grid; place-items: center; overflow: hidden;
}
/* diagonal rose-gradient wedge backgrounds via clip-path */
.tss-cur-band.lime::before {
  content: ""; position: absolute; inset: -2px;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  clip-path: polygon(0 16%, 100% 0, 100% 84%, 0 100%);
}
.tss-cur-band.lime.alt::before {
  clip-path: polygon(0 0, 100% 14%, 100% 100%, 0 86%);
}
.tss-cur-w {
  position: relative; z-index: 2;
  font-weight: 500; letter-spacing: -0.03em;
  font-size: clamp(4rem, 11vw, 9.5rem); line-height: 1; color: #141414;
}
/* white type + doodle strokes on the rose wedges for contrast */
.tss-cur-band.lime .tss-cur-w { color: #FFF6F9; }
.tss-cur-band.lime .tss-cur-doodle path,
.tss-cur-band.lime .tss-doodle path { stroke: #FFF6F9; }
/* each letter is its own span — scattered by scroll, converging at center */
.tss-cur-w .cl { display: inline-block; will-change: transform, opacity, filter; }
.tss-cur-doodle {
  position: absolute; z-index: 2; width: 120px; height: 120px;
  pointer-events: none;
  top: calc(50% - 150px); left: calc(50% + 160px);
}
.tss-cur-doodle path {
  fill: none; stroke: #141414; stroke-width: 2.4;
  stroke-linecap: round; stroke-linejoin: round;
}
/* cycling hand-drawn doodles around "reach" — each design draws itself
   in stroke-by-stroke, holds, fades, then the next one appears */
.tss-doodle {
  position: absolute; overflow: visible; pointer-events: none;
  transition: opacity .35s;
}
.tss-doodle path {
  fill: none; stroke: #141414; stroke-width: 2.6;
  stroke-linecap: round; stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: tssDoodleDraw 2.2s cubic-bezier(.45,0,.2,1) forwards;
}
@keyframes tssDoodleDraw {
  0%   { stroke-dashoffset: 1; opacity: 1; }
  32%  { stroke-dashoffset: 0; opacity: 1; }
  80%  { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}

/* ════ D. Zoom + Discover ════════════════════════════════════════ */
.tss-zoom-runway { position: relative; height: 650vh; background: #F2EFE9; }
.tss-zoom-stage {
  position: sticky; top: 0; height: 100svh; overflow: hidden;
  background: #F2EFE9;
}
.tss-zoom-line {
  position: absolute; inset: 0; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(34px, 4.2vw, 68px); font-weight: 500;
  letter-spacing: -0.025em; color: #1A1A1A;
  white-space: nowrap; pointer-events: none;
}
.tss-zoom-line .tss-word { will-change: transform; }
.tss-grow {
  position: relative; overflow: hidden; flex-shrink: 0;
  margin: 0 0.22em; will-change: width, height;
}
.tss-grow img,
.tss-echo img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.tss-grow > img { transition: opacity .7s ease; }
.tss-echo {
  position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden; z-index: 2; will-change: width, height;
}
.tss-grow-shade {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background:
    linear-gradient(to top, rgba(10,8,6,.5) 0%, transparent 38%),
    radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(10,8,6,.3) 100%);
  will-change: opacity;
}

/* Discover UI */
.tss-disc { position: absolute; inset: 0; z-index: 9; will-change: opacity; }
.tss-disc.off { pointer-events: none; }
.tss-disc-label {
  position: absolute; left: 8.5%; top: 50%; transform: translateY(-50%);
  font-size: 15px; color: rgba(255,255,255,.9);
}
.tss-disc-lines line {
  stroke: rgba(255,255,255,.8); stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
/* collection titles — each anchored to center, traveling bottom → top;
   the active one sits sharp and full-size exactly at center */
.tss-disc-items { position: absolute; inset: 0; pointer-events: none; }
.tss-disc-item {
  position: absolute; left: 50%; top: 50%;
  white-space: nowrap; font-weight: 500;
  font-size: clamp(32px, 4.6vw, 64px);
  letter-spacing: -0.03em; color: #fff;
  will-change: transform, opacity;
}
/* background stack — the incoming image wipes DOWN over the previous one,
   scroll-scrubbed (reverses when scrolling back up) */
.tss-disc-bg {
  position: absolute; inset: 0;
  will-change: clip-path, transform;
}
.tss-disc-bg img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.tss-disc-card {
  position: absolute; top: 14px; right: 18px; z-index: 20;
  background: #fff; padding: 10px 20px 10px 12px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 8px 32px rgba(20,15,10,.18);
}
.tss-disc-card img {
  width: 34px; height: 34px; border-radius: 50%; object-fit: cover; display: block;
}
.tss-disc-card-kicker {
  font-family: 'Space Mono', monospace; font-size: 9px;
  letter-spacing: .14em; color: #8B8781;
}
.tss-disc-card-name { font-size: 15px; font-weight: 500; color: #1A1A1A; margin-top: 2px; }
.tss-disc-thumb {
  position: absolute; overflow: hidden; z-index: 20;
  will-change: left, top, opacity;
  box-shadow: 0 10px 34px rgba(10,8,6,.35);
}
.tss-disc-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tss-disc-thumb.on {
  outline: 2px solid rgba(255,255,255,.9);
  outline-offset: 2px;
  transform: scale(1.06);
}

/* ════ E. Outro — giant wordmark with living "O" ═════════════════ */
.tss-outro {
  position: relative; z-index: 3; background: #fff;
  min-height: 100vh; display: flex; flex-direction: column;
  padding: 26px 34px 30px;
  box-shadow: 0 -18px 50px rgba(20,15,10,.08);
}
/* Matches the 100svh already used for .tss-zoom-stage — keeps the outro
   from overshooting the screen on mobile. Desktop is identical. */
@supports (min-height: 100svh){
  .tss-outro { min-height: 100svh; }
}
.tss-outro-top {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
}
.tss-outro-links { display: flex; gap: 26px; }
.tss-outro-links a, .tss-outro-login {
  font-family: 'Space Mono', monospace; font-size: 12px;
  letter-spacing: .1em; color: #1A1A1A; text-decoration: none;
  transition: opacity .2s;
}
.tss-outro-links a:hover, .tss-outro-login:hover { opacity: .55; }
.tss-outro-social { display: flex; gap: 34px; justify-self: center; }
.tss-outro-social a { color: #1A1A1A; display: inline-flex; transition: opacity .2s; }
.tss-outro-social a:hover { opacity: .55; }
.tss-outro-social svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.6; }
.tss-outro-right { display: flex; align-items: center; gap: 22px; justify-self: end; }
.tss-outro-signup {
  font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: .1em;
  color: #fff; text-decoration: none;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  padding: 15px 26px;
  border-radius: 46% 54% 52% 48% / 58% 52% 48% 42%;   /* organic rose blob */
  transition: filter .2s;
}
.tss-outro-signup:hover { filter: brightness(1.08); }

/* ── signed-in variant of the top-right pair. The blob keeps its shape and
      its slot; only the label changes, so the page still closes on a single
      strong action instead of on a dead SIGN UP. ── */
.tss-outro-me {
  display: flex; align-items: center; gap: 9px;
  color: #1A1A1A; text-decoration: none; transition: opacity .2s;
}
.tss-outro-me:hover { opacity: .55; }
.tss-outro-av {
  width: 28px; height: 28px; border-radius: 50%; flex: none; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 52%, var(--mn-rose-d) 100%);
  color: #fff; font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 11px; font-weight: 700;
}
.tss-outro-av img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tss-outro-name {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
  max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
/* keeps the row from resizing once the persisted store is read */
.tss-outro-skel { width: 190px; height: 1px; }

.tss-outro-stage { flex: 1; display: grid; place-items: center; }
.tss-outro-word {
  font-weight: 700; letter-spacing: -0.045em; line-height: 1;
  font-size: clamp(76px, 15vw, 260px); color: #1A1A1A;
  white-space: nowrap; display: flex; align-items: center;
  will-change: transform;
}
/* the living "O" — doodles and photos cycle inside it */
.tss-outro-o {
  position: relative; display: inline-flex;
  width: 0.64em; height: 0.64em; margin-left: 0.035em;
  align-items: center; justify-content: center;
  border-radius: 50%;
}
.tss-outro-o img {
  width: 100%; height: 100%; border-radius: 50%;
  object-fit: cover; display: block;
  animation: tssOPop .55s cubic-bezier(.3,1.45,.4,1);
}
@keyframes tssOPop {
  from { transform: scale(.5); opacity: 0; }
  to   { transform: scale(1);  opacity: 1; }
}
.tss-outro-o svg { width: 116%; height: 116%; overflow: visible; }
.tss-outro-o svg path {
  fill: none; stroke: #141414; stroke-width: 3;
  stroke-linecap: round; stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: tssODraw 1.9s cubic-bezier(.45,0,.2,1) forwards;
}
@keyframes tssODraw {
  0%  { stroke-dashoffset: 1; }
  45% { stroke-dashoffset: 0; }
  100%{ stroke-dashoffset: 0; }
}

/* ════ responsive ════════════════════════════════════════════════ */
@media (max-width: 900px) {
  /* ── A. intro ── */
  .tss-intro { padding: 10vh 18px 0; }
  .tss-intro-grid { grid-template-columns: 1fr; gap: 40px; }
  .tss-intro-copy {
    position: static; padding-bottom: 0;
    font-size: clamp(24px, 6.4vw, 34px); line-height: 1.32;
  }
  .tss-intro-box { padding: 0 9px 1px; border-radius: 9px; }

  /* rail becomes a snapping horizontal carousel with real card widths */
  .tss-rail {
    flex-direction: row;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0 18px 8vh;
    margin: 0 -18px;
    scrollbar-width: none;
  }
  .tss-rail::-webkit-scrollbar { display: none; }
  .tss-rail > div {
    flex: 0 0 68vw;
    max-width: 300px;
    min-width: 0;
    scroll-snap-align: center;
  }
  .tss-rail .tss-card-img { aspect-ratio: 4 / 5; }
  .tss-card-title { font-size: 15px; }

  /* ── B. panel + grid ── */
  .tss-panel { margin-top: 0; padding: 8vh 18px 10vh; }
  .tss-panel-head { margin-bottom: 5vh; }
  .tss-panel-meta { flex-direction: column; gap: 8px; }
  .tss-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 14px; }
  .tss-grid > div:nth-child(4n+2), .tss-grid > div:nth-child(4n+4) { transform: none; }

  /* ── C. kinetic bands ── */
  .tss-cur-band { min-height: 78vh; }
  .tss-cur-doodle { width: 76px; height: 76px; top: calc(50% - 100px); left: calc(50% + 80px); }

  /* ── D. zoom + discover ── */
  .tss-zoom-stage { height: 100svh; }
  .tss-zoom-line {
    font-size: clamp(20px, 6.2vw, 30px);
    padding: 0 12px;
  }
  .tss-grow { margin: 0 0.14em; }
  .tss-disc-label {
    left: 18px; top: 22px; transform: none;
    font-size: 12px; letter-spacing: .12em; opacity: .85;
  }
  .tss-disc-item {
    font-size: clamp(22px, 6.6vw, 32px);
    letter-spacing: -0.02em;
    max-width: 88vw;
    white-space: normal;
    text-align: center;
    line-height: 1.12;
  }
  .tss-disc-card {
    top: auto; bottom: 20px; right: 14px; left: 14px;
    padding: 9px 14px 9px 10px; gap: 10px;
  }
  .tss-disc-card img { width: 30px; height: 30px; }
  .tss-disc-card-name { font-size: 14px; }
  .tss-disc-thumb { display: none; }

  /* ── E. outro ── */
  .tss-outro { padding: 20px 18px 24px; }
  .tss-outro-links { display: none; }
  .tss-outro-top { grid-template-columns: auto 1fr; }
  .tss-outro-social { justify-self: start; gap: 22px; }
  .tss-outro-right { gap: 14px; }
  .tss-outro-name  { max-width: 76px; }
  .tss-outro-skel  { width: 120px; }
}

@media (prefers-reduced-motion: reduce) {
  .tss-intro-copy { position: static; }
  .tss-doodle path { animation: none; stroke-dashoffset: 0; }
  .tss-cur-w .cl { transform: none !important; opacity: 1 !important; filter: none !important; }
  .tss-word-r { opacity: 1 !important; transform: none !important; }
}
`;

/* ── small building blocks ──────────────────────────────────────────────── */
