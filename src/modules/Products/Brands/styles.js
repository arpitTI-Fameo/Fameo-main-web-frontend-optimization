export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --br-rose:#E8405A; --br-ink:#111118;
    --br-muted:#888898; --br-line:#EEEEF2;
    --br-surf:#F7F7FA; --br-white:#ffffff;
  }

  .br-page { background: var(--br-white); }

  /* hero */
  .br-hero {
    padding: 56px 56px 40px;
    border-bottom: 1px solid var(--br-line);
  }
  .br-hero-ey {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 500;
    letter-spacing: .28em; text-transform: uppercase; color: var(--br-rose);
    margin-bottom: 10px; display: flex; align-items: center; gap: 10px;
  }
  .br-hero-ey::before { content: ''; width: 20px; height: 1px; background: var(--br-rose); opacity: .6; }
  .br-hero-title {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(36px,5vw,64px);
    font-weight: 300; color: var(--br-ink); line-height: 1.05;
  }
  .br-hero-title em { font-style: italic; color: var(--br-rose); }
  .br-hero-sub {
    font-size: 13px; font-weight: 300; color: var(--br-muted);
    margin-top: 12px; max-width: 480px; line-height: 1.7;
  }

  /* grid */
  .br-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1px; background: var(--br-line);
    margin: 0;
  }

  /* brand card */
  .br-card {
    background: var(--br-white); position: relative;
    overflow: hidden; cursor: pointer;
    aspect-ratio: 4/3;
    transition: transform .35s cubic-bezier(.22,1,.36,1);
  }
  .br-card:hover { z-index: 1; transform: scale(1.02); }
  .br-card-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    filter: grayscale(.6) brightness(.75);
    transition: filter .4s;
  }
  .br-card:hover .br-card-img { filter: grayscale(0) brightness(.65); }
  .br-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(17,17,24,.8) 0%, transparent 55%);
  }
  .br-card-overlay::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--br-rose);
    transform: scaleX(0); transform-origin: left;
    transition: transform .32s cubic-bezier(.22,1,.36,1);
  }
  .br-card:hover .br-card-overlay::after { transform: scaleX(1); }
  .br-card-info {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 18px 20px;
  }
  .br-card-name {
    font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300;
    letter-spacing: .1em; text-transform: uppercase; color: #fff; line-height: 1;
  }
  .br-card-cta {
    font-family: 'Jost', sans-serif; font-size: 8px; font-weight: 400;
    letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.5);
    margin-top: 4px; display: flex; align-items: center; gap: 6px;
    transition: color .2s;
  }
  .br-card:hover .br-card-cta { color: var(--br-rose); }
  .br-card-arrow {
    width: 16px; height: 1px; background: currentColor; position: relative;
    flex-shrink: 0; transition: width .2s;
  }
  .br-card:hover .br-card-arrow { width: 22px; }
  .br-card-arrow::after {
    content: ''; position: absolute; right: 0; top: -2.5px;
    width: 5px; height: 5px;
    border-top: 1px solid currentColor; border-right: 1px solid currentColor;
    transform: rotate(45deg);
  }

  @media (max-width: 768px) {
    .br-hero { padding: 40px 20px 28px; }
    .br-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;
