export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  /* ─────────────────────────────────────────────────────────────
     FAMEO UPCOMING — follows the Products landing (ProductHero)
     Palette:  white #FFFFFF · surf #F1F1F2 · ink #0B0B0F
               muted #82828E · line #D8D8DE
     Type:     Cormorant Garamond (display) · Jost (UI/body)
     ───────────────────────────────────────────────────────────── */

  .upc-page {
    --upc-ink: #0B0B0F;
    --upc-muted: #82828E;
    --upc-line: #D8D8DE;
    --upc-surf: #F1F1F2;
    --upc-white: #FFFFFF;
    --upc-radius: clamp(20px, 2vw, 30px);

    min-height: 100vh;
    margin: 0;
    padding: clamp(96px, 16vh, 180px) clamp(24px, 4vw, 56px) clamp(80px, 10vh, 160px);
    background: var(--upc-white);
    color: var(--upc-ink);
    font-family: 'Jost', sans-serif;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }
  .upc-page *, .upc-page *::before, .upc-page *::after { box-sizing: border-box; }

  /* ── headline block ─────────────────────────────────────────── */
  .upc-head { text-align: center; }

  .upc-eyebrow {
    margin: 0 0 clamp(12px, 1.8vw, 20px);
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 500;
    letter-spacing: .05em;
    color: var(--upc-muted);
  }

  .upc-title {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: .28em;
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 6.4vw, 96px);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -.01em;
    text-transform: uppercase;
    text-align: center;
    color: var(--upc-ink);
  }
  .upc-title em { font-style: italic; font-weight: 300; }
  .upc-title::before,
  .upc-title::after {
    content: '';
    flex: 0 0 clamp(24px, 5vw, 64px);
    height: 1px;
    margin: 0 clamp(4px, 1vw, 16px);
    background: var(--upc-line);
  }

  .upc-tagline {
    margin: clamp(56px, 11vh, 128px) 0 clamp(36px, 7vh, 64px);
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 3.6vw, 48px);
    font-weight: 300;
    font-style: italic;
    line-height: 1;
    color: var(--upc-ink);
  }

  /* ── split panel ────────────────────────────────────────────── */
  .upc-panel {
    max-width: 1500px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(14px, 1.6vw, 26px);
    align-items: stretch;
  }

  /* left: full-bleed image */
  .upc-media {
    position: relative;
    overflow: hidden;
    border-radius: var(--upc-radius);
    background: var(--upc-surf);
    min-height: clamp(380px, 56vh, 760px);
  }
  .upc-media img {
    object-fit: cover;
    transition: transform .8s cubic-bezier(.22,1,.36,1);
  }
  .upc-media:hover img { transform: scale(1.03); }
  .upc-media-label {
    position: absolute;
    z-index: 1;
    top: clamp(12px, 1.4vw, 22px);
    left: clamp(12px, 1.4vw, 22px);
    padding: 7px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.34);
    background: rgba(28,28,32,.30);
    -webkit-backdrop-filter: blur(16px) saturate(1.3);
    backdrop-filter: blur(16px) saturate(1.3);
    font-size: clamp(12px, 1.5vh, 14px);
    font-weight: 400;
    color: #fff;
  }

  /* right: stone panel with chips + white card */
  .upc-info {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: clamp(20px, 3vh, 40px);
    padding: clamp(28px, 4.4vh, 60px) clamp(20px, 2.4vw, 44px) clamp(16px, 1.6vw, 22px);
    border-radius: var(--upc-radius);
    background: var(--upc-surf);
  }
  .upc-info::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(120% 90% at 18% 8%, rgba(255,255,255,.9) 0%, transparent 55%),
      radial-gradient(90% 70% at 88% 22%, rgba(255,255,255,.65) 0%, transparent 60%);
  }
  .upc-info > * { position: relative; z-index: 1; }

  .upc-features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: clamp(8px, .8vw, 14px);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .upc-chip {
    padding: clamp(9px, 1.3vh, 13px) clamp(16px, 1.4vw, 24px);
    border-radius: 999px;
    border: 1px solid var(--upc-line);
    font-size: clamp(13px, 1.7vh, 16px);
    font-weight: 400;
    color: var(--upc-muted);
  }

  .upc-card {
    margin-top: auto;
    padding: clamp(18px, 1.8vw, 28px);
    border-radius: clamp(16px, 1.6vw, 24px);
    background: var(--upc-white);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .upc-card-tag {
    margin: 0;
    padding: 7px 16px;
    border-radius: 999px;
    background: var(--upc-surf);
    font-size: clamp(12px, 1.5vh, 14px);
    font-weight: 400;
    color: var(--upc-ink);
  }
  .upc-card-title {
    margin: clamp(12px, 1.8vh, 20px) 0 0;
    max-width: 30ch;
    font-size: clamp(17px, 1.5vw, 23px);
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -.01em;
    color: var(--upc-ink);
  }

  .upc-cta {
    display: inline-flex;
    align-items: center;
    gap: clamp(8px, .8vw, 14px);
    margin-top: clamp(18px, 2.6vh, 28px);
    text-decoration: none;
    color: var(--upc-ink);
  }
  .upc-cta:focus-visible { outline: 2px solid var(--upc-ink); outline-offset: 3px; border-radius: 999px; }
  .upc-view {
    padding: clamp(11px, 1.6vh, 15px) clamp(20px, 1.8vw, 30px);
    border-radius: 999px;
    background: var(--upc-ink);
    color: #fff;
    font-size: clamp(13px, 1.7vh, 16px);
    font-weight: 500;
    transition: transform .26s cubic-bezier(.22,1,.36,1);
  }
  .upc-go {
    width: clamp(40px, 3vw, 48px);
    height: clamp(40px, 3vw, 48px);
    border-radius: 50%;
    border: 1px solid var(--upc-line);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background .24s, color .24s, transform .24s;
  }
  .upc-cta:hover .upc-view { transform: translateY(-2px); }
  .upc-cta:hover .upc-go { background: var(--upc-ink); color: #fff; transform: rotate(45deg); }

  /* ── overview: intro + feature grid ─────────────────────────── */
  .upc-intro {
    max-width: 52ch;
    margin: calc(-1 * clamp(16px, 4vh, 40px)) auto clamp(36px, 7vh, 64px);
    font-size: clamp(14px, 1.9vh, 17px);
    font-weight: 300;
    line-height: 1.6;
    color: var(--upc-muted);
  }

  .upc-grid {
    max-width: 1500px;
    margin: 0 auto;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(14px, 1.6vw, 26px);
  }
  .upc-tile {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: clamp(10px, .9vw, 14px);
    border-radius: var(--upc-radius);
    background: var(--upc-surf);
    color: var(--upc-ink);
    text-decoration: none;
  }
  .upc-tile:focus-visible { outline: 2px solid var(--upc-ink); outline-offset: 3px; }
  .upc-tile-media {
    position: relative;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    border-radius: clamp(14px, 1.4vw, 22px);
    background: var(--upc-white);
  }
  .upc-tile-media img {
    object-fit: cover;
    transition: transform .6s cubic-bezier(.22,1,.36,1);
  }
  .upc-tile:hover .upc-tile-media img { transform: scale(1.05); }
  .upc-tile-date {
    position: absolute;
    z-index: 1;
    top: 12px;
    left: 12px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.34);
    background: rgba(28,28,32,.30);
    -webkit-backdrop-filter: blur(16px) saturate(1.3);
    backdrop-filter: blur(16px) saturate(1.3);
    font-size: 12px;
    color: #fff;
  }
  .upc-tile-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: clamp(14px, 1.4vw, 20px) clamp(6px, .6vw, 10px) clamp(4px, .4vw, 6px);
  }
  .upc-tile-title {
    margin: 0;
    font-size: clamp(17px, 1.4vw, 21px);
    font-weight: 500;
    letter-spacing: -.01em;
    line-height: 1.25;
  }
  .upc-tile-desc {
    margin: 8px 0 0;
    font-size: clamp(13px, 1.6vh, 14.5px);
    font-weight: 300;
    line-height: 1.55;
    color: var(--upc-muted);
  }
  .upc-tile-foot {
    margin-top: auto;
    padding-top: clamp(16px, 2vh, 22px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: clamp(13px, 1.6vh, 15px);
    font-weight: 500;
  }
  .upc-tile:hover .upc-go { background: var(--upc-ink); color: #fff; transform: rotate(45deg); }

  /* ── detail: back link + use cases ──────────────────────────── */
  .upc-back {
    display: inline-block;
    margin-bottom: clamp(32px, 6vh, 64px);
    padding: 9px 18px;
    border-radius: 999px;
    border: 1px solid var(--upc-line);
    color: var(--upc-muted);
    font-size: 14px;
    text-decoration: none;
    transition: color .22s, border-color .22s;
  }
  .upc-back:hover { color: var(--upc-ink); border-color: var(--upc-ink); }
  .upc-back:focus-visible { outline: 2px solid var(--upc-ink); outline-offset: 2px; }

  .upc-uses {
    max-width: 1500px;
    margin: clamp(64px, 10vh, 120px) auto 0;
  }
  .upc-uses-eyebrow {
    margin: 0 0 8px 4px;
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 500;
    letter-spacing: .05em;
    color: var(--upc-muted);
  }
  .upc-uses-title {
    margin: 0 0 clamp(24px, 4vh, 40px);
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(34px, 4.2vw, 56px);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -.01em;
  }
  .upc-uses-title em { font-style: italic; font-weight: 300; }
  .upc-uses-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(14px, 1.6vw, 26px);
  }
  .upc-use {
    padding: clamp(22px, 2.2vw, 34px);
    border-radius: var(--upc-radius);
    background: var(--upc-surf);
  }
  .upc-use-num {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 3.4vw, 52px);
    font-style: italic;
    font-weight: 300;
    line-height: 1;
    color: var(--upc-muted);
  }
  .upc-use-title {
    margin: clamp(18px, 3vh, 32px) 0 0;
    font-size: clamp(17px, 1.4vw, 21px);
    font-weight: 500;
    letter-spacing: -.01em;
    line-height: 1.25;
  }
  .upc-use-text {
    margin: 8px 0 0;
    font-size: clamp(13px, 1.7vh, 15px);
    font-weight: 300;
    line-height: 1.6;
    color: var(--upc-muted);
  }

  @media (max-width: 1024px) {
    .upc-panel { grid-template-columns: 1fr; }
    .upc-media { min-height: clamp(320px, 44vh, 460px); }
    .upc-grid, .upc-uses-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .upc-grid, .upc-uses-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .upc-page { padding-left: 14px; padding-right: 14px; }
    .upc-title::before, .upc-title::after { display: none; }
  }
`;
