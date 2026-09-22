export const S = `
  .oc-wrap {
    text-align: center;
    padding: clamp(44px, 8vh, 76px) 0;
    animation: ocIn .6s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes ocIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

  .oc-icon { font-size: 54px; margin-bottom: 16px; }

  .oc-title {
    margin: 0 0 8px;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4.2vw, 52px);
    font-weight: 400;
    line-height: 1.04;
    color: var(--chk-ink);
  }
  .oc-title em { font-style: italic; color: var(--chk-accent); }

  .oc-sub {
    margin: 0 0 8px;
    font-size: 13.5px;
    line-height: 1.75;
    color: var(--chk-muted);
  }
  .oc-id {
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: .08em;
    color: var(--chk-accent);
  }

  .oc-breakdown {
    display: inline-block;
    text-align: left;
    margin: 0 auto 26px;
    min-width: 300px;
    padding: 18px 24px;
    border: 1px solid var(--chk-line-soft);
    border-radius: 16px;
    background: var(--chk-band);
  }
  .oc-brow {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    padding: 7px 0;
    border-bottom: 1px solid var(--chk-line-soft);
    font-size: 13px;
    color: var(--chk-muted);
  }
  .oc-brow span:last-child { color: var(--chk-ink); font-weight: 500; }
  .oc-brow.discount span:last-child { color: var(--chk-accent); }
  .oc-brow.total {
    padding-top: 11px;
    border-bottom: 0;
    font-weight: 500;
    color: var(--chk-ink);
  }
  .oc-brow.total span:last-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    line-height: 1;
  }

  .oc-savings-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 24px;
    padding: 9px 18px;
    border-radius: 999px;
    background: rgba(46, 170, 104, .08);
    font-size: 12px;
    color: var(--chk-ok);
  }

  .oc-ctas {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 30px;
  }
  .oc-btn-primary {
    appearance: none;
    font: inherit;
    font-size: 13.5px;
    font-weight: 500;
    min-height: 48px;
    padding: 14px 30px;
    border: 1px solid var(--chk-ink);
    border-radius: 999px;
    background: var(--chk-ink);
    color: #FFFFFF;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    cursor: pointer;
    transition: background .22s ease, border-color .22s ease;
  }
  .oc-btn-primary:hover { background: #2B2B33; border-color: #2B2B33; }
  .oc-btn-secondary {
    appearance: none;
    font: inherit;
    font-size: 13.5px;
    font-weight: 500;
    min-height: 48px;
    padding: 14px 26px;
    border: 1px solid var(--chk-line);
    border-radius: 999px;
    background: transparent;
    color: var(--chk-soft);
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    transition: border-color .22s ease, color .22s ease;
  }
  .oc-btn-secondary:hover { border-color: var(--chk-ink); color: var(--chk-ink); }

  .oc-delivery {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 22px;
    border: 1px solid var(--chk-line-soft);
    border-radius: 999px;
    background: var(--chk-band);
    font-size: 12.5px;
    color: var(--chk-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .oc-wrap { animation: none; }
  }
`;
