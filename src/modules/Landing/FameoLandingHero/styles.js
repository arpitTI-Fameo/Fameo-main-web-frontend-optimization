export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&family=Archivo+Black&display=swap');

.flh, .flh *, .flh *::before, .flh *::after { box-sizing: border-box; margin: 0; padding: 0; }
.flh {
  --ink:#151515; --gold:#E8A33D;
  --ease:cubic-bezier(.22,.8,.24,1);
  font-family:'Archivo',system-ui,sans-serif;
}

/* ── nav (links · logo · actions) ─────────────────────────────── */
.flh .nav{position:absolute;inset:0 0 auto;z-index:100;color:#fff;padding:1.4rem 0;cursor:auto}
.flh .nav-in{width:min(1440px,95vw);margin-inline:auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem}
.flh .nav-left{display:flex;align-items:center;gap:1.9rem;font-size:.95rem;font-weight:500}
.flh .nav-left a{opacity:.92;transition:opacity .25s;color:inherit;text-decoration:none}
.flh .nav-left a:hover{opacity:1;text-decoration:underline;text-underline-offset:5px}
.flh .pill{border:1.5px solid rgba(255,255,255,.85);border-radius:100px;padding:.62rem 1.35rem;display:inline-flex;align-items:center;gap:.5rem;font-weight:500;font-size:.93rem;transition:.3s;background:transparent;color:#fff;cursor:pointer;text-decoration:none}
.flh .pill:hover{background:rgba(255,255,255,.14)}
.flh .pill.solid{background:#fff;color:var(--ink);border-color:#fff;font-weight:600}
.flh .pill.solid:hover{transform:scale(1.04)}
.flh .brand{font-family:'Archivo Black','Archivo',sans-serif;font-size:1.45rem;letter-spacing:.14em;display:flex;align-items:center;gap:.5rem;justify-self:center;color:inherit;text-decoration:none}
.flh .brand .tick{width:22px;height:22px;border-radius:50%;background:var(--gold);display:inline-grid;place-items:center;flex:none}
.flh .brand .tick svg{width:12px;height:12px;stroke:#fff;stroke-width:3.6;fill:none}
.flh .nav-right{display:flex;align-items:center;gap:.7rem;justify-self:end}
.flh .s-ico{width:15px;height:15px;stroke:currentColor;stroke-width:2.2;fill:none}

/* ── hero slideshow ───────────────────────────────────────────── */
.flh .hero{
  position:relative;height:100svh;overflow:hidden;background:#111;cursor:none;
  touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;
}
.flh .slide{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .9s var(--ease)}
.flh .slide.active{opacity:1;pointer-events:auto}
.flh .slide .media{position:absolute;inset:0}
.flh .slide .media .bgimg,
.flh .slide .media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.flh .slide .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.34),rgba(0,0,0,.1) 40%,rgba(0,0,0,.38))}
/* giant staggered headline */
.flh .slide h1{
  position:absolute;left:0;right:0;bottom:4.5rem;z-index:5;color:#fff;
  font-weight:400;letter-spacing:-.03em;line-height:.96;
  font-size:clamp(3.2rem,10.5vw,9.2rem);pointer-events:none;
}
.flh .slide h1 .row{display:block;overflow:hidden;padding:0 3vw}
.flh .slide h1 .row:nth-child(2){text-align:right;padding-right:2.5vw}
.flh .slide h1 .row i{display:block;font-style:normal;transform:translateY(115%)}
.flh .slide.active h1 .row i{animation:flhRise 1s var(--ease) forwards}
.flh .slide.active h1 .row:nth-child(2) i{animation-delay:.14s}
@keyframes flhRise{to{transform:translateY(0)}}
/* creator caption */
.flh .cap{
  position:absolute;right:4vw;top:58%;z-index:5;display:flex;gap:1rem;align-items:center;
  color:#fff;max-width:330px;pointer-events:none;opacity:0;transform:translateY(14px);
}
.flh .slide.active .cap{animation:flhCapIn .8s var(--ease) .45s forwards}
@keyframes flhCapIn{to{opacity:1;transform:none}}
.flh .cap img{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none}
.flh .cap p{font-size:.98rem;font-weight:500;line-height:1.45}
.flh .cap p span{opacity:.95}
/* down arrow */
.flh .down{
  position:absolute;left:3vw;bottom:2.6rem;z-index:6;color:#fff;font-size:3.4rem;line-height:1;
  animation:flhBob 2.6s ease-in-out infinite;pointer-events:auto;cursor:pointer;background:none;border:none;
}
@keyframes flhBob{50%{transform:translateY(9px)}}
/* slide counter */
.flh .count{position:absolute;right:4vw;bottom:2.8rem;z-index:6;color:#fff;font-weight:600;letter-spacing:.22em;font-size:.8rem;opacity:.85}

/* ── star peek ────────────────────────────────────────────────── */
.flh .peek{
  position:fixed;inset:0;z-index:60;
  pointer-events:none;opacity:0;transition:opacity .25s;will-change:clip-path;
  clip-path:polygon(0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0);
}
.flh .peek.show{opacity:1}
.flh .peek .win{position:absolute;inset:0}
.flh .peek .win img,.flh .peek .win video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.flh .peek-arrow{
  position:fixed;z-index:61;width:34px;height:34px;left:0;top:0;color:#fff;
  pointer-events:none;opacity:0;transition:opacity .25s;filter:drop-shadow(0 1px 6px rgba(0,0,0,.5));
}
.flh .peek-arrow.show{opacity:1}
.flh .peek-arrow svg{width:100%;height:100%;stroke:currentColor;stroke-width:2.4;fill:none}
/* click reveal overlay */
.flh .reveal{position:absolute;inset:0;z-index:40;pointer-events:none;visibility:hidden;will-change:clip-path}
.flh .reveal.go{visibility:visible}
.flh .reveal .media{position:absolute;inset:0}
.flh .reveal .media img,.flh .reveal .media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

@media (max-width: 900px){
  .flh .nav-left{display:none}
  .flh .nav-in{grid-template-columns:auto 1fr}
  .flh .nav-right{gap:.5rem}
  .flh .cap{display:none}
  .flh .peek-arrow{width:26px;height:26px}
}
/* no native cursor to hide on touch devices */
@media (pointer: coarse){
  .flh .hero{cursor:auto}
}
@media (prefers-reduced-motion: reduce){
  .flh .down{animation:none}
}
`;

/* ═══════════════════════════════════════════════════════════════════════ */
