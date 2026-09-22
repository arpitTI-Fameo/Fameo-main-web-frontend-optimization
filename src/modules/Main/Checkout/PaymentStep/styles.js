export const S = `
  .ps-sec-title {
    margin: 0 0 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--chk-line);
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    line-height: 1.1;
    color: var(--chk-ink);
  }

  .ps-note {
    margin-bottom: 20px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--chk-muted);
  }

  /* ── gateway panel ── */
  .ps-rzp-panel {
    margin-bottom: 16px;
    padding: 20px;
    border: 1px solid var(--chk-accent);
    border-radius: 16px;
    background: var(--chk-accent-pale);
  }
  .ps-rzp-head { display: flex; align-items: center; gap: 11px; margin-bottom: 12px; }
  .ps-rzp-icon { font-size: 20px; }
  .ps-rzp-label { font-size: 13.5px; font-weight: 500; color: var(--chk-ink); }
  .ps-rzp-sub { margin-top: 3px; font-size: 11.5px; color: var(--chk-muted); }
  .ps-rzp-desc {
    margin-bottom: 14px;
    font-size: 13px;
    line-height: 1.75;
    color: var(--chk-soft);
  }
  .ps-rzp-tags { display: flex; gap: 7px; flex-wrap: wrap; }
  .ps-rzp-tag {
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid rgba(17,17,24,.10);
    background: #FFFFFF;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--chk-muted);
  }

  /* ── amount box ── */
  .ps-amount-box {
    margin-bottom: 16px;
    padding: 18px 20px;
    border: 1px solid var(--chk-line-soft);
    border-radius: 16px;
    background: var(--chk-band);
  }
  .ps-amount-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 7px 0;
    border-bottom: 1px solid var(--chk-line-soft);
    font-size: 13px;
    color: var(--chk-muted);
  }
  .ps-amount-row span:last-child { color: var(--chk-ink); font-weight: 500; }
  .ps-amount-row.discount span:last-child { color: var(--chk-accent); }
  .ps-amount-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 14px;
    padding: 12px 0 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--chk-ink);
  }
  .ps-amount-total span:last-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 500;
    line-height: 1;
  }
  .ps-savings {
    margin-top: 6px;
    font-size: 11.5px;
    text-align: right;
    color: var(--chk-ok);
  }

  /* ── nav ── */
  .ps-nav { display: flex; gap: 10px; margin-top: 26px; }
  .ps-btn-primary {
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
    cursor: pointer;
    transition: background .22s ease, border-color .22s ease, opacity .22s ease;
  }
  .ps-btn-primary:hover:not(:disabled) { background: #2B2B33; border-color: #2B2B33; }
  .ps-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
  .ps-btn-secondary {
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
    cursor: pointer;
    transition: border-color .22s ease, color .22s ease;
  }
  .ps-btn-secondary:hover { border-color: var(--chk-ink); color: var(--chk-ink); }
  .ps-btn-primary:focus-visible, .ps-btn-secondary:focus-visible {
    outline: 1px solid var(--chk-ink);
    outline-offset: 3px;
  }

  .ps-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 14px;
    font-size: 11.5px;
    color: var(--chk-faint);
  }
`;
