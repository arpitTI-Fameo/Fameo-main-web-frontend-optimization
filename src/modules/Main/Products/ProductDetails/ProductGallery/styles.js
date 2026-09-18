export const S = `
  .pgl-wrap { min-width: 0; }

  .pgl-stage {
    position: relative;
    background: var(--pdp-tile);
    border-radius: 18px;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pgl-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .8s cubic-bezier(.22,1,.36,1);
  }
  .pgl-stage:hover .pgl-img { transform: scale(1.03); }

  .pgl-empty { width: 100%; height: 100%; background: var(--pdp-line); }

  .pgl-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 2;
    padding: 6px 13px;
    border-radius: 999px;
    background: var(--pdp-accent);
    color: #FFFFFF;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    line-height: 1;
  }

  .pgl-wish {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 2;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 50%;
    background: #FFFFFF;
    color: var(--pdp-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,.08);
    transition: color .2s ease, transform .2s ease;
  }
  .pgl-wish:hover { color: var(--pdp-soft); transform: scale(1.07); }
  .pgl-wish.is-on { color: var(--pdp-accent-deep); }
  .pgl-wish:focus-visible { outline: 1px solid var(--pdp-ink); outline-offset: 2px; }

  @media (max-width: 900px) {
    .pgl-stage { aspect-ratio: 4 / 3; }
  }
`;
