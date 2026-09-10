export const CSS = `
.ftrail-section{
  position:relative;min-height:92vh;overflow:hidden;
  background:var(--ivory,#FAF6F0);
  display:flex;align-items:center;justify-content:center;
  cursor:default;
}
/* stable on mobile while the address bar shows/hides — ignored by browsers
   that don't support svh, which keep the 92vh above */
@supports (height: 100svh){
  .ftrail-section{min-height:92svh;}
}

/* ── Fixed centered headline (cluster floats over it) ─────────── */
.ftrail-copy{
  position:relative;z-index:1;text-align:center;
  padding:0 24px;pointer-events:none;
}
.ftrail-h2{
  font-family:'Outfit','DM Sans',sans-serif;
  font-size:clamp(28px,3.4vw,52px);font-weight:500;
  color:var(--ink,#1a0a1e);line-height:1.3;letter-spacing:-.01em;
}
.ftrail-pill{
  display:inline-block;padding:0 22px 4px;
  border:2px solid var(--ink,#1a0a1e);border-radius:60px;
  line-height:1.25;
}

/* ── Cluster anchor — JS moves it toward the cursor ───────────── */
.ftrail-cluster{
  position:absolute;top:0;left:0;z-index:2;
  width:0;height:0;pointer-events:none;
  will-change:transform;
}

/* ── Slot — permanent, never empty, holds stacked image layers ── */
.ftrail-slot{
  position:absolute;overflow:hidden;border-radius:3px;
  transform:translate(-50%,-50%);
  background:#e9e2d8;
  box-shadow:0 10px 28px rgba(21,5,32,.10);
}
.ftrail-layer{
  position:absolute;inset:0;
  will-change:transform,opacity;
}
.ftrail-layer img{width:100%;height:100%;object-fit:cover;display:block;}
/* NEW image: starts at the RIGHT, small → grows while moving LEFT to center.
   The layer below stays full-size until covered, so the F never breaks. */
.ftrail-layer.grow{
  animation:ftrailGrowRL .34s cubic-bezier(.25,.9,.4,1) both;
}
/* OLD image: continues the journey — shrinks while sliding out to the LEFT.
   Together: every image visibly travels right → left, growing then shrinking. */
.ftrail-layer.exit{
  animation:ftrailExitL .38s cubic-bezier(.5,0,.75,.4) both;
}
@keyframes ftrailGrowRL{
  0%   {opacity:0;transform:translateX(42%) scale(.18);}
  16%  {opacity:1;}
  100% {opacity:1;transform:translateX(0) scale(1);}
}
@keyframes ftrailExitL{
  0%   {opacity:1;transform:translateX(0) scale(1);}
  100% {opacity:0;transform:translateX(-48%) scale(.15);}
}

@media(prefers-reduced-motion:reduce){
  .ftrail-layer.grow,.ftrail-layer.exit{animation-duration:.01s;}
}
/* smaller F — global shape scale */
.ftrail-scale{transform:scale(.68);}
@media(max-width:1024px){
  .ftrail-scale{transform:scale(.55);}
}
@media(max-width:600px){
  .ftrail-scale{transform:scale(.42);}
}
`;
