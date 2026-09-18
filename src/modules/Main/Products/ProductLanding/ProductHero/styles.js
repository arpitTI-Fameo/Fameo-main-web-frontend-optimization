export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');

  .phero-wrap {
    --ph-ink:#0B0B0F; --ph-muted:#82828E; --ph-line:#D8D8DE;
    --ph-surf:#F1F1F2; --ph-white:#FFFFFF;
    --ph-radius: clamp(20px, 2vw, 30px);
    background: var(--ph-white);
    padding: clamp(80px, 10vh, 160px) clamp(24px, 4vw, 56px);
    font-family: 'Jost', sans-serif;
  }

  .phero-row {
    max-width: 1500px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: clamp(14px, 1.6vw, 26px);
    align-items: stretch;
  }

  /* ── left: heading + chips + feature card ────────────────────────────── */
  .phero-left {
    position: relative; overflow: hidden;
    background: var(--ph-surf);
    border-radius: var(--ph-radius);
    padding: clamp(28px, 4.4vh, 60px) clamp(20px, 2.4vw, 44px) clamp(16px, 1.6vw, 22px);
    display: flex; flex-direction: column;
  }
  /* Faint marble wash, matching the reference's stone panel. */
  .phero-left::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(120% 90% at 18% 8%, rgba(255,255,255,.9) 0%, transparent 55%),
      radial-gradient(90% 70% at 88% 22%, rgba(255,255,255,.65) 0%, transparent 60%);
  }

  .phero-title {
    position: relative; z-index: 1; text-align: center;
    font-size: clamp(26px, 3.1vw, 50px); font-weight: 400;
    color: var(--ph-ink); letter-spacing: -.02em; line-height: 1.2;
    margin: 0 auto; max-width: 15ch;
  }

  .phero-chips {
    position: relative; z-index: 1;
    display: flex; flex-wrap: wrap; justify-content: center;
    gap: clamp(8px, .8vw, 14px);
    margin: clamp(22px, 4vh, 52px) 0 clamp(20px, 3vh, 40px);
  }
  .phero-chip {
    padding: clamp(9px, 1.3vh, 13px) clamp(16px, 1.4vw, 24px);
    border-radius: 999px; cursor: pointer;
    border: 1px solid var(--ph-line); background: transparent;
    font-family: inherit; font-size: clamp(13px, 1.7vh, 16px); font-weight: 400;
    color: var(--ph-muted);
    transition: color .22s, border-color .22s, background .22s;
  }
  .phero-chip:hover { color: var(--ph-ink); border-color: #B4B4BC; }
  .phero-chip.is-on { color: var(--ph-ink); border-color: var(--ph-ink); }
  .phero-chip:focus-visible { outline: 2px solid var(--ph-ink); outline-offset: 2px; }

  /* white card pinned to the bottom of the stone panel */
  .phero-card {
    position: relative; z-index: 1; margin-top: auto;
    background: var(--ph-white); border-radius: clamp(16px, 1.6vw, 24px);
    padding: clamp(12px, 1vw, 16px);
    display: grid; grid-template-columns: 1fr 1fr;
    gap: clamp(12px, 1.2vw, 20px);
    cursor: pointer;
  }
  .phero-card-body {
    padding: clamp(6px, .8vw, 12px);
    display: flex; flex-direction: column; align-items: flex-start;
  }
  .phero-card-tag {
    background: var(--ph-surf); color: var(--ph-ink);
    border-radius: 999px; padding: 7px 16px;
    font-size: clamp(12px, 1.5vh, 14px); font-weight: 400; margin: 0;
  }
  .phero-card-title {
    font-size: clamp(17px, 1.5vw, 23px); font-weight: 500;
    color: var(--ph-ink); letter-spacing: -.01em; line-height: 1.25;
    margin: clamp(12px, 1.8vh, 20px) 0 0;
  }
  .phero-card-desc {
    font-size: clamp(12px, 1.5vh, 13.5px); font-weight: 300;
    color: var(--ph-muted); line-height: 1.55;
    margin: clamp(6px, 1vh, 10px) 0 0;
  }
  .phero-card-go {
    margin: clamp(14px, 2vh, 24px) 0 0;
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    border: 1px solid var(--ph-line); background: transparent;
    color: var(--ph-ink); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: background .24s, color .24s, transform .24s;
  }
  .phero-card:hover .phero-card-go { background: var(--ph-ink); color: #fff; transform: rotate(45deg); }
  .phero-card-go:focus-visible { outline: 2px solid var(--ph-ink); outline-offset: 2px; }
  .phero-card-media {
    position: relative; height: 100%;
    border-radius: clamp(12px, 1.2vw, 18px); overflow: hidden;
    min-height: clamp(150px, 20vh, 220px);
  }
  .phero-card-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .6s cubic-bezier(.22,1,.36,1);
  }
  .phero-card:hover .phero-card-img { transform: scale(1.05); }

  /* ── right: full-bleed feature with a glass panel ─────────────────────── */
  .phero-right {
    position: relative; overflow: hidden;
    border-radius: var(--ph-radius);
    background: var(--ph-surf);
    min-height: clamp(380px, 56vh, 760px);
    height: 100%;
  }
  .phero-right-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .8s cubic-bezier(.22,1,.36,1);
  }
  .phero-right:hover .phero-right-img { transform: scale(1.03); }

  .phero-glass {
    position: absolute; z-index: 1;
    left: clamp(12px, 1.4vw, 22px); right: clamp(12px, 1.4vw, 22px);
    bottom: clamp(12px, 1.4vw, 22px);
    border-radius: clamp(14px, 1.4vw, 22px);
    border: 1px solid rgba(255,255,255,.34);
    background: rgba(28,28,32,.30);
    -webkit-backdrop-filter: blur(16px) saturate(1.3);
    backdrop-filter: blur(16px) saturate(1.3);
    padding: clamp(18px, 2.6vh, 30px) clamp(18px, 1.8vw, 32px);
  }
  .phero-glass-top {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }
  .phero-glass-title {
    font-size: clamp(19px, 1.8vw, 30px); font-weight: 500;
    color: #fff; letter-spacing: -.015em; line-height: 1.2; margin: 0;
  }
  .phero-rating {
    display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
    font-size: clamp(13px, 1.6vh, 15px); color: #fff; margin: 0;
  }
  .phero-stars { display: inline-flex; gap: 2px; color: #fff; line-height: 0; }
  .phero-glass-desc {
    font-size: clamp(13px, 1.7vh, 16px); font-weight: 300;
    color: rgba(255,255,255,.86); line-height: 1.5;
    margin: clamp(8px, 1.2vh, 14px) 0 0; max-width: 42ch;
  }
  .phero-glass-actions {
    display: flex; align-items: center; gap: clamp(8px, .8vw, 14px);
    margin: clamp(16px, 2.4vh, 26px) 0 0;
  }
  .phero-view {
    padding: clamp(11px, 1.6vh, 15px) clamp(20px, 1.8vw, 30px);
    border: 0; border-radius: 999px; cursor: pointer;
    background: #fff; color: var(--ph-ink);
    font-family: inherit; font-size: clamp(13px, 1.7vh, 16px); font-weight: 500;
    transition: transform .26s cubic-bezier(.22,1,.36,1);
  }
  .phero-view:hover { transform: translateY(-2px); }
  .phero-view:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
  .phero-go {
    width: clamp(40px, 3vw, 48px); height: clamp(40px, 3vw, 48px);
    border-radius: 50%; cursor: pointer;
    border: 1px solid rgba(255,255,255,.55); background: transparent; color: #fff;
    display: inline-flex; align-items: center; justify-content: center;
    transition: background .24s, color .24s, transform .24s;
  }
  .phero-go:hover { background: #fff; color: var(--ph-ink); transform: rotate(45deg); }
  .phero-go:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

  @media (max-width: 1024px) {
    .phero-row { grid-template-columns: 1fr; }
    .phero-right { min-height: clamp(320px, 44vh, 460px); }
  }
  @media (max-width: 560px) {
    .phero-wrap { padding: 20px 14px; }
    .phero-card { grid-template-columns: 1fr; }
    .phero-card-media { min-height: 170px; order: -1; }
    .phero-glass-desc { max-width: none; }
  }
`;
