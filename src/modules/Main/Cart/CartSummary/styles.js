export const S = `
  .ctsum-wrap {
    position: sticky;
    top: 88px;
  }

  .ctsum-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: clamp(16px, 2.6vh, 24px);
  }
  .ctsum-back {
    appearance: none;
    border: 0;
    background: none;
    padding: 2px;
    color: var(--ct-muted);
    display: inline-flex;
    cursor: pointer;
    transition: color .2s ease, transform .2s ease;
  }
  .ctsum-back:hover { color: var(--ct-ink); transform: translateX(-2px); }
  .ctsum-back:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 3px; }

  .ctsum-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 2.2vw, 30px);
    font-weight: 400;
    line-height: 1.12;
    color: var(--ct-ink);
  }

  .ctsum-rows { display: grid; gap: 13px; }
  .ctsum-rows-bordered {
    margin-top: 15px;
    padding-top: 17px;
    border-top: 1px solid var(--ct-line-soft);
  }

  .ctsum-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .ctsum-label {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 13px;
    line-height: 1.4;
    color: var(--ct-muted);
  }
  .ctsum-note { font-size: 11.5px; color: var(--ct-faint); }

  .ctsum-value {
    flex: none;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ct-ink);
    white-space: nowrap;
  }
  .ctsum-value.is-free { color: var(--ct-ok); }

  .ctsum-total {
    margin-top: 17px;
    padding-top: 17px;
    border-top: 1px solid var(--ct-line-soft);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
  }
  .ctsum-total-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--ct-ink);
  }
  .ctsum-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 2.6vw, 32px);
    font-weight: 500;
    line-height: 1;
    color: var(--ct-ink);
    white-space: nowrap;
  }

  .ctsum-footnote {
    margin: 12px 0 0;
    font-size: 11.5px;
    line-height: 1.55;
    color: var(--ct-faint);
  }

  .ctsum-cta {
    appearance: none;
    margin-top: clamp(18px, 2.8vh, 26px);
    width: 100%;
    min-height: 48px;
    padding: 14px 22px;
    border: 0;
    border-radius: 999px;
    background: var(--ct-ink);
    color: #FFFFFF;
    font: inherit;
    font-size: 13.5px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: background .22s ease, transform .18s ease;
  }
  .ctsum-cta:hover:not(:disabled) { background: #2B2B33; }
  .ctsum-cta:active:not(:disabled) { transform: scale(.99); }
  .ctsum-cta:disabled {
    background: #D4D4D8;
    color: #FFFFFF;
    cursor: not-allowed;
  }
  .ctsum-cta:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 3px; }

  @media (max-width: 1000px) {
    .ctsum-wrap { position: static; }
  }
`;
