export const S = `
  .df-sec-title {
    margin: 0 0 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--chk-line);
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    line-height: 1.1;
    color: var(--chk-ink);
  }
  .df-sec-title-gap { margin-top: 30px; }

  .df-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .df-g3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .df-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .df-field-0 { display: flex; flex-direction: column; gap: 6px; }

  .df-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .06em;
    color: var(--chk-muted);
  }

  .df-inp, .df-select {
    width: 100%;
    box-sizing: border-box;
    min-height: 44px;
    padding: 11px 15px;
    border: 1px solid var(--chk-line);
    border-radius: 10px;
    background: #FFFFFF;
    font: inherit;
    font-size: 13.5px;
    color: var(--chk-ink);
    outline: none;
    transition: border-color .2s ease;
  }
  .df-inp:focus, .df-select:focus { border-color: var(--chk-ink); }
  .df-inp::placeholder { color: var(--chk-faint); }

  .df-select {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2371717A' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
  }

  /* ── field-level errors ── */
  .df-field.has-err .df-inp,
  .df-field-0.has-err .df-inp,
  .df-field.has-err .df-select,
  .df-field-0.has-err .df-select {
    border-color: var(--chk-danger);
    background: rgba(196, 45, 69, .03);
  }
  .df-field.has-err .df-label,
  .df-field-0.has-err .df-label { color: var(--chk-danger); }

  .df-err {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--chk-danger);
    animation: dfErrIn .26s cubic-bezier(.22,1,.36,1);
  }
  .df-err::before {
    content: '!';
    flex-shrink: 0;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: var(--chk-danger);
    color: #FFFFFF;
    font-size: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @keyframes dfErrIn { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: none; } }

  /* shake applied by focusFirstError() */
  .df-shake { animation: dfShake .5s cubic-bezier(.36,.07,.19,.97); }
  @keyframes dfShake {
    10%,90% { transform: translateX(-2px); }
    20%,80% { transform: translateX(3px); }
    30%,50%,70% { transform: translateX(-5px); }
    40%,60% { transform: translateX(5px); }
  }

  /* ── error summary ── */
  .df-summary {
    margin-bottom: 20px;
    padding: 14px 16px;
    border: 1px solid rgba(196, 45, 69, .22);
    border-radius: 12px;
    background: rgba(196, 45, 69, .04);
    animation: dfErrIn .3s cubic-bezier(.22,1,.36,1);
  }
  .df-summary-title {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 10px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--chk-danger);
  }
  .df-summary-list { display: flex; flex-wrap: wrap; gap: 7px; }
  .df-summary-chip {
    padding: 5px 12px;
    border: 1px solid rgba(196, 45, 69, .25);
    border-radius: 999px;
    background: #FFFFFF;
    font: inherit;
    font-size: 11.5px;
    color: var(--chk-danger);
    cursor: pointer;
    transition: background .18s ease, color .18s ease, border-color .18s ease;
  }
  .df-summary-chip:hover {
    background: var(--chk-danger);
    border-color: var(--chk-danger);
    color: #FFFFFF;
  }

  /* ── saved addresses ── */
  .df-saved-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .df-saved-title {
    margin-bottom: 10px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--chk-muted);
  }
  .df-saved-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--chk-line);
    border-radius: 14px;
    background: #FFFFFF;
    cursor: pointer;
    transition: border-color .2s ease, background .2s ease;
  }
  .df-saved-card:hover { border-color: var(--chk-ink); }
  .df-saved-card.selected { border-color: var(--chk-accent); background: var(--chk-accent-pale); }
  .df-saved-text { flex: 1; font-size: 13px; line-height: 1.6; color: var(--chk-muted); }
  .df-saved-name { font-weight: 500; color: var(--chk-ink); }
  .df-saved-use {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--chk-accent);
    white-space: nowrap;
    cursor: pointer;
  }
  .df-saved-del {
    margin-left: 4px;
    padding: 0;
    border: 0;
    background: none;
    font-size: 12px;
    color: var(--chk-faint);
    cursor: pointer;
    transition: color .18s ease;
  }
  .df-saved-del:hover { color: var(--chk-danger); }

  .df-or-divider {
    margin: 14px 0 18px;
    text-align: center;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--chk-faint);
  }

  /* ── shipping options ── */
  .df-ship-opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; }
  .df-ship-opt {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 15px 18px;
    border: 1px solid var(--chk-line);
    border-radius: 14px;
    background: #FFFFFF;
    cursor: pointer;
    transition: border-color .2s ease, background .2s ease;
  }
  .df-ship-opt:hover:not(.sel) { border-color: var(--chk-ink); }
  .df-ship-opt.sel { border-color: var(--chk-accent); background: var(--chk-accent-pale); }

  .df-ship-radio {
    flex-shrink: 0;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 1px solid var(--chk-line);
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .18s ease;
  }
  .df-ship-opt.sel .df-ship-radio { border-color: var(--chk-accent); }
  .df-ship-radio::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--chk-accent);
    opacity: 0;
    transition: opacity .18s ease;
  }
  .df-ship-opt.sel .df-ship-radio::after { opacity: 1; }

  .df-ship-info { flex: 1; }
  .df-ship-label { font-size: 13.5px; font-weight: 500; color: var(--chk-ink); }
  .df-ship-days { margin-top: 3px; font-size: 12px; color: var(--chk-muted); }
  .df-ship-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px;
    font-weight: 500;
    line-height: 1;
    color: var(--chk-ink);
  }
  .df-ship-price.free {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--chk-ok);
  }

  /* ── nav ── */
  .df-nav { display: flex; gap: 10px; margin-top: 26px; }
  .df-btn-primary {
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
    transition: background .22s ease, border-color .22s ease;
  }
  .df-btn-primary:hover { background: #2B2B33; border-color: #2B2B33; }
  .df-btn-secondary {
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
  .df-btn-secondary:hover { border-color: var(--chk-ink); color: var(--chk-ink); }
  .df-btn-primary:focus-visible, .df-btn-secondary:focus-visible {
    outline: 1px solid var(--chk-ink);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    .df-g2, .df-g3 { grid-template-columns: minmax(0, 1fr); }
  }
  @media (prefers-reduced-motion: reduce) {
    .df-shake, .df-err, .df-summary { animation: none !important; }
  }
`;
