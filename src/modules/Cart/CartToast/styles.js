export const S = `
  .ctx-wrap {
    position: fixed; z-index: 10000;
    right: 26px; bottom: 26px;
    display: flex; flex-direction: column-reverse; align-items: flex-end;
    pointer-events: none;
    font-family: 'Jost', sans-serif;
    perspective: 1000px;
  }

  .ctx {
    pointer-events: all;
    position: relative;
    width: 340px;
    margin-top: 10px;
    border-radius: 6px;
    overflow: hidden;
    background: rgba(255,255,255,.82);
    -webkit-backdrop-filter: blur(22px) saturate(1.7);
    backdrop-filter: blur(22px) saturate(1.7);
    box-shadow:
      0 1px 0 rgba(255,255,255,.9) inset,
      0 0 0 1px rgba(17,17,24,.07),
      0 12px 24px -8px rgba(17,17,24,.16),
      0 32px 64px -16px rgba(17,17,24,.22);
    transform-origin: bottom right;
    animation: ctxIn .56s cubic-bezier(.16,1,.3,1) both;
  }
  .ctx.leaving { animation: ctxOut .32s cubic-bezier(.55,0,1,.45) forwards; }

  /* Older cards recede behind the newest */
  .ctx[data-depth="1"] { transform: scale(.955) translateY(6px); opacity: .74; }
  .ctx[data-depth="2"] { transform: scale(.91)  translateY(12px); opacity: .48; }

  @keyframes ctxIn {
    0%   { opacity: 0; transform: translateY(26px) scale(.9) rotateX(14deg); }
    100% { opacity: 1; transform: translateY(0)    scale(1)  rotateX(0deg);  }
  }
  @keyframes ctxOut {
    to { opacity: 0; transform: translateX(28px) scale(.94); }
  }

  /* Accent rail down the left edge */
  .ctx-rail { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
  .ctx.success .ctx-rail { background: linear-gradient(180deg,#DD8164,#E8457A); }
  .ctx.warn    .ctx-rail { background: linear-gradient(180deg,#E8A33D,#d18f28); }
  .ctx.error   .ctx-rail { background: linear-gradient(180deg,#E05050,#c03a3a); }

  .ctx-body { display: flex; gap: 13px; padding: 15px 16px 14px 19px; }

  /* Thumbnail with a one-shot shimmer sweep */
  .ctx-thumb {
    position: relative; width: 54px; height: 54px; flex-shrink: 0;
    border-radius: 4px; overflow: hidden;
    background: #F2F2F6;
    box-shadow: 0 0 0 1px rgba(17,17,24,.06), 0 4px 12px rgba(17,17,24,.1);
    animation: ctxThumb .6s cubic-bezier(.34,1.56,.64,1) both .06s;
  }
  @keyframes ctxThumb {
    from { transform: scale(.5) rotate(-10deg); opacity: 0; }
    to   { transform: scale(1)  rotate(0deg);   opacity: 1; }
  }
  .ctx-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ctx-thumb::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(115deg,transparent 30%,rgba(255,255,255,.7) 50%,transparent 70%);
    transform: translateX(-130%);
    animation: ctxShimmer 1.1s cubic-bezier(.4,0,.2,1) .34s;
  }
  @keyframes ctxShimmer { to { transform: translateX(130%); } }

  .ctx-fallback {
    width: 100%; height: 100%; display: flex; align-items: center;
    justify-content: center; font-size: 20px;
    background: linear-gradient(135deg,#FDEFE6,#f7dfd4);
  }

  .ctx-main { flex: 1; min-width: 0; }
  .ctx-head {
    display: flex; align-items: center; gap: 5px;
    font-size: 8.5px; font-weight: 500; letter-spacing: .22em;
    text-transform: uppercase; margin-bottom: 5px;
  }
  .ctx.success .ctx-head { color: #DD8164; }
  .ctx.warn    .ctx-head { color: #C4801F; }
  .ctx.error   .ctx-head { color: #C03A3A; }
  .ctx-head svg { width: 11px; height: 11px; }
  .ctx-head svg path {
    stroke: currentColor; stroke-width: 2.6; fill: none;
    stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 22; stroke-dashoffset: 22;
    animation: ctxDraw .46s cubic-bezier(.65,0,.35,1) .22s forwards;
  }
  @keyframes ctxDraw { to { stroke-dashoffset: 0; } }

  .ctx-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 400; color: #111118;
    line-height: 1.25; margin-bottom: 4px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ctx-meta {
    font-size: 10.5px; font-weight: 300; color: #7a7a88;
    display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
  }
  .ctx-price { color: #111118; font-weight: 400; }
  .ctx-saved {
    color: #2eaa68; font-weight: 400;
    padding: 1px 6px; border-radius: 2px;
    background: rgba(46,170,104,.09);
    font-size: 9.5px; letter-spacing: .04em;
  }

  .ctx-actions { display: flex; gap: 8px; margin-top: 11px; }
  .ctx-btn {
    flex: 1; text-align: center;
    font-family: 'Jost', sans-serif;
    font-size: 9px; font-weight: 400; letter-spacing: .18em;
    text-transform: uppercase; padding: 8px 10px;
    border-radius: 3px; cursor: pointer; text-decoration: none;
    transition: all .22s cubic-bezier(.4,0,.2,1);
  }
  .ctx-btn.ghost {
    color: #3a3a44; background: rgba(17,17,24,.045);
    border: 1px solid rgba(17,17,24,.07);
  }
  .ctx-btn.ghost:hover { background: rgba(17,17,24,.08); color: #111118; }
  .ctx-btn.solid {
    color: #fff; border: 1px solid transparent;
    background: linear-gradient(120deg,#111118,#2a2a36);
    box-shadow: 0 4px 14px rgba(17,17,24,.22);
  }
  .ctx-btn.solid:hover { transform: translateY(-1px); box-shadow: 0 7px 20px rgba(17,17,24,.3); }

  .ctx-close {
    position: absolute; top: 9px; right: 10px;
    width: 20px; height: 20px; border: none; cursor: pointer;
    background: transparent; color: #b0b0be;
    font-size: 13px; line-height: 1; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .ctx-close:hover { background: rgba(17,17,24,.06); color: #111118; }

  /* Hairline countdown rail */
  .ctx-timer {
    position: absolute; left: 0; bottom: 0; height: 1.5px;
    background: linear-gradient(90deg,#DD8164,#E8457A);
    animation: ctxTimer var(--ctx-dur) linear forwards;
  }
  @keyframes ctxTimer { from { width: 100%; } to { width: 0%; } }
  .ctx:hover .ctx-timer { animation-play-state: paused; }

  @media (max-width: 640px) {
    .ctx-wrap { right: 12px; left: 12px; bottom: 12px; align-items: stretch; }
    .ctx { width: auto; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ctx, .ctx-thumb, .ctx-thumb::after, .ctx-head svg path, .ctx-timer {
      animation: none !important;
    }
    .ctx-head svg path { stroke-dashoffset: 0; }
    .ctx-thumb::after { display: none; }
  }
`;
