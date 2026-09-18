export const S = `
  /* ════ E. Outro — giant wordmark with living "O" ═════════════════ */
  .tss-outro {
    position: relative; z-index: 3; background: #fff;
    min-height: 100vh; display: flex; flex-direction: column;
    padding: 26px 34px 30px;
    box-shadow: 0 -18px 50px rgba(20,15,10,.08);
  }
  @supports (min-height: 100svh){
    .tss-outro { min-height: 100svh; }
  }
  .tss-outro-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0 20px;
  }
  .tss-outro-curve {
    display: block;
    width: calc(100% + 68px);
    margin: 0 -34px;
    height: clamp(30px, 6vw, 60px);
    pointer-events: none;
    flex: none;
  }
  .tss-outro-col { display: flex; flex-direction: column; }
  .tss-outro-col-head {
    font-family: 'Syne', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 0.28em;
    text-transform: uppercase; color: #8A8A94;
    margin: 0 0 20px 0;
  }
  .tss-outro-col-links {
    display: flex; flex-direction: column; gap: 8px;
  }
  .tss-outro-col-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #111118; text-decoration: none;
    transition: color 0.2s; display: inline-flex; align-items: center;
  }
  .tss-outro-col-link:hover { color: #8A8A94; }

  .tss-badge {
    font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;
    font-weight: 700; padding: 2px 6px; border-radius: 4px;
    margin-left: 8px;
  }
  .tss-badge.ft-badge-new { background: rgba(213,59,126,0.1); color: #D53B7E; }
  .tss-badge.ft-badge-beta { background: rgba(143,39,147,0.1); color: #A33A8E; }

  .tss-outro-bottom {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; max-width: 1200px; margin: 0 auto;
    padding-top: 20px;
  }
  .tss-outro-legal {
    display: flex; gap: 24px;
  }
  .tss-outro-legal a {
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 0.08em; color: #8A8A94; text-decoration: none;
    transition: color 0.2s;
  }
  .tss-outro-legal a:hover { color: #111118; }

  .tss-outro-social { display: flex; gap: 24px; }
  .tss-outro-social a { color: #8A8A94; display: inline-flex; transition: color 0.2s; }
  .tss-outro-social a:hover { color: #111118; }
  .tss-outro-social svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.6; }

  .tss-outro-skel { width: 190px; height: 1px; }

  .tss-outro-stage { flex: 1; display: grid; place-items: center; }
  .tss-outro-word {
    font-weight: 700; letter-spacing: -0.045em; line-height: 1;
    font-size: clamp(76px, 15vw, 260px); color: #1A1A1A;
    white-space: nowrap; display: flex; align-items: center;
    will-change: transform;
  }
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

  @media (max-width: 900px) {
    .tss-outro { padding: 20px 18px 24px; }
    .tss-outro-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px 20px;
    }
    .tss-outro-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
    .tss-outro-legal {
      flex-wrap: wrap;
      gap: 16px;
    }
    .tss-outro-social { justify-self: start; gap: 22px; }
    .tss-outro-curve {
      width: calc(100% + 36px);
      margin: 0 -18px;
    }
  }
`;
