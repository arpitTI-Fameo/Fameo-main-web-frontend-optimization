export const S = `
  .cts-wrap {
    display: flex;
    gap: clamp(14px, 2vw, 28px);
    align-self: end;
  }

  .cts-tab {
    appearance: none;
    background: none;
    font: inherit;
    text-align: left;
    padding: 13px 4px 0;
    border: 0;
    /* the rule above each tab is the progress indicator */
    border-top: 2px solid var(--ct-line);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    color: var(--ct-faint);
    transition: color .22s ease, border-color .22s ease, opacity .22s ease;
  }
  .cts-tab:hover:not(:disabled):not(.is-on) { color: var(--ct-muted); }
  .cts-tab:disabled { cursor: not-allowed; opacity: .55; }
  .cts-tab:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 3px; }

  .cts-tab.is-on {
    border-top-color: var(--ct-accent);
    color: var(--ct-ink);
  }

  .cts-icon { flex: none; display: inline-flex; }

  .cts-text { display: grid; gap: 3px; min-width: 0; }

  .cts-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(17px, 1.7vw, 22px);
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
  }
  .cts-tab.is-on .cts-label { color: var(--ct-ink); }

  .cts-hint {
    font-size: 12px;
    line-height: 1.35;
    color: var(--ct-faint);
    white-space: nowrap;
  }
  .cts-tab.is-on .cts-hint { color: var(--ct-muted); }

  @media (max-width: 1000px) {
    .cts-wrap { align-self: start; }
  }
  @media (max-width: 620px) {
    .cts-wrap { width: 100%; }
    .cts-tab { flex: 1; min-width: 0; }
    .cts-hint { display: none; }
    .cts-label { font-size: 16px; }
  }
`;
