export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

  .cd-backdrop {
    position: fixed;
    inset: 0;
    z-index: 900;
    background: rgba(17, 17, 24, .38);
    opacity: 0;
    visibility: hidden;
    transition: opacity .32s ease, visibility .32s ease;
  }
  .cd-backdrop.is-open { opacity: 1; visibility: visible; }

  .cd-panel {
    /* The drawer mounts from the app layout, outside the .ct-page that declares
       the cart tokens, so it carries its own copy of the same values. */
    --ct-ink: #111118;
    --ct-soft: #3A3A44;
    --ct-muted: #71717A;
    --ct-faint: #A1A1AA;
    --ct-line: #E4E4E7;
    --ct-line-soft: #EEEEF2;
    --ct-band: #F9F9FB;
    --ct-tile: #F4F4F5;
    --ct-surface: #FFFFFF;
    --ct-accent: #DD8164;
    --ct-accent-deep: #D45A79;
    --ct-accent-pale: #FDEFE6;
    --ct-star: #E8A33D;
    --ct-ok: #2EAA68;
    --ct-danger: #C42D45;

    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 901;
    width: min(420px, 100vw);
    background: #FFFFFF;
    color: var(--ct-ink);
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform .38s cubic-bezier(.22,1,.36,1);
    box-shadow: -18px 0 50px rgba(17,17,24,.12);
  }
  .cd-panel.is-open { transform: none; }

  /* ── header ── */
  .cd-head {
    flex: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 24px 16px;
    border-bottom: 1px solid var(--ct-line-soft);
  }
  .cd-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: 27px;
    font-weight: 400;
    line-height: 1.08;
    color: var(--ct-ink);
  }
  .cd-count {
    margin: 5px 0 0;
    font-size: 12px;
    letter-spacing: .04em;
    color: var(--ct-muted);
  }
  .cd-close {
    appearance: none;
    flex: none;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 50%;
    background: var(--ct-tile);
    color: var(--ct-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .2s ease, color .2s ease;
  }
  .cd-close:hover { background: var(--ct-ink); color: #FFFFFF; }
  .cd-close:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 2px; }

  /* ── items ── */
  .cd-items {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 2px 24px 12px;
  }

  /* ── empty ── */
  .cd-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; text-align: center; }
  .cd-empty-title { margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; color: var(--ct-ink); }
  .cd-empty-body { margin: 9px 0 22px; font-size: 13px; color: var(--ct-muted); }
  .cd-empty-cta {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    border-radius: 999px;
    background: var(--ct-ink);
    color: #FFFFFF;
    font-size: 13.5px;
    font-weight: 500;
    text-decoration: none;
    transition: background .22s ease;
  }
  .cd-empty-cta:hover { background: #2B2B33; }

  /* ── footer ── */
  .cd-foot {
    flex: none;
    padding: 16px 24px 24px;
    border-top: 1px solid var(--ct-line-soft);
    background: #FFFFFF;
  }

  .cd-ship-bar {
    height: 4px;
    border-radius: 999px;
    background: var(--ct-tile);
    overflow: hidden;
  }
  .cd-ship-fill {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: var(--ct-accent);
    transition: width .5s cubic-bezier(.22,1,.36,1);
  }
  .cd-ship {
    margin: 9px 0 13px;
    font-size: 12px;
    color: var(--ct-muted);
  }
  .cd-ship.is-free { margin-top: 0; color: var(--ct-ok); font-weight: 500; }

  .cd-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 5px 0;
  }
  .cd-row-label { font-size: 13px; color: var(--ct-muted); }
  .cd-row-value { font-size: 13.5px; font-weight: 500; color: var(--ct-ink); white-space: nowrap; }

  .cd-cta {
    margin-top: 15px;
    width: 100%;
    min-height: 48px;
    border-radius: 999px;
    background: var(--ct-ink);
    color: #FFFFFF;
    font-size: 13.5px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-decoration: none;
    transition: background .22s ease;
  }
  .cd-cta:hover { background: #2B2B33; }

  @media (prefers-reduced-motion: reduce) {
    .cd-panel, .cd-backdrop, .cd-ship-fill { transition-duration: .01ms; }
  }
`;
