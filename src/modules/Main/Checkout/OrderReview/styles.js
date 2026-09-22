export const S = `
  .or-sec-title {
    margin: 0 0 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--chk-line);
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    line-height: 1.1;
    color: var(--chk-ink);
  }

  .or-box {
    margin-bottom: 12px;
    padding: 18px 20px;
    border: 1px solid var(--chk-line-soft);
    border-radius: 16px;
    background: var(--chk-band);
  }
  .or-box-label {
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--chk-accent);
  }
  .or-box-val {
    font-size: 13.5px;
    line-height: 1.7;
    color: var(--chk-ink);
  }
  .or-edit {
    display: block;
    margin-top: 10px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    color: var(--chk-muted);
    cursor: pointer;
    transition: color .18s ease;
  }
  .or-edit:hover { color: var(--chk-accent); }

  .or-price-box {
    margin-bottom: 18px;
    padding: 18px 20px;
    border: 1px solid var(--chk-line-soft);
    border-radius: 16px;
    background: #FFFFFF;
  }
  .or-price-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 8px 0;
    border-bottom: 1px solid var(--chk-line-soft);
    font-size: 13px;
    color: var(--chk-muted);
  }
  .or-price-row span:last-child { color: var(--chk-ink); font-weight: 500; }
  .or-price-row.discount span:last-child { color: var(--chk-accent); }

  .or-price-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 14px;
    padding: 13px 0 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--chk-ink);
  }
  .or-price-total span:last-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 500;
    line-height: 1;
  }
  .or-savings {
    margin-top: 8px;
    font-size: 11.5px;
    text-align: right;
    color: var(--chk-ok);
  }

  /* ── pay ── */
  .or-rzp-btn {
    position: relative;
    overflow: hidden;
    width: 100%;
    min-height: 52px;
    padding: 16px;
    border: 0;
    border-radius: 999px;
    background: var(--chk-ink);
    color: #FFFFFF;
    font: inherit;
    font-size: 13.5px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: background .22s ease;
  }
  .or-rzp-btn:hover:not(:disabled) { background: #2B2B33; }
  .or-rzp-btn:disabled { opacity: .5; cursor: not-allowed; }
  .or-rzp-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -60%;
    width: 40%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
    transform: skewX(-18deg);
    animation: orShimmer 2.4s ease infinite;
  }
  @keyframes orShimmer { 0% { left: -60%; } 40%, 100% { left: 120%; } }

  .or-nav { display: flex; gap: 10px; margin-top: 12px; }
  .or-btn-secondary {
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
  .or-btn-secondary:hover { border-color: var(--chk-ink); color: var(--chk-ink); }
  .or-btn-secondary:focus-visible, .or-rzp-btn:focus-visible {
    outline: 1px solid var(--chk-ink);
    outline-offset: 3px;
  }

  .or-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 14px;
    font-size: 11.5px;
    color: var(--chk-faint);
  }

  @media (prefers-reduced-motion: reduce) {
    .or-rzp-btn::before { animation: none; }
  }
`;
