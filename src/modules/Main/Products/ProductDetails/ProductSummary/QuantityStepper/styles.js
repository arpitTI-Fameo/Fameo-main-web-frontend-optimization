export const S = `
  .pqs-wrap {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: 48px;
    padding: 0 6px;
    border: 1px solid #E4E4E7;
    border-radius: 999px;
    background: #FFFFFF;
  }

  .pqs-btn {
    appearance: none;
    border: 0;
    background: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #3A3A44;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .22s ease;
  }
  .pqs-btn:hover:not(:disabled) { background: var(--pdp-tile, #F4F4F5); color: var(--pdp-ink, #111118); }
  .pqs-btn:disabled { color: #D4D4D8; cursor: not-allowed; }
  .pqs-btn:focus-visible { outline: 1px solid var(--pdp-ink, #111118); outline-offset: 1px; }

  .pqs-value {
    min-width: 26px;
    text-align: center;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--pdp-ink, #111118);
    font-variant-numeric: tabular-nums;
  }
`;
