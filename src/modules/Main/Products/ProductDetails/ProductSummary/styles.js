export const S = `
  .pds-wrap { min-width: 0; padding-top: 4px; }

  .pds-chip {
    display: inline-block;
    padding: 5px 11px;
    border-radius: 999px;
    background: var(--pdp-tile, #F4F4F5);
    color: var(--pdp-muted, #71717A);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .05em;
    line-height: 1;
  }

  .pds-title {
    margin: 14px 0 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 3.8vw, 46px);
    font-weight: 400;
    line-height: 1.06;
    letter-spacing: .005em;
    color: var(--pdp-ink, #111118);
  }

  .pds-sub {
    margin: 10px 0 0;
    max-width: 44ch;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--pdp-muted, #71717A);
  }

  /* ── rating ── */
  .pds-rating {
    margin-top: 14px;
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .pds-stars {
    display: inline-flex;
    gap: 2px;
    color: var(--pdp-star, #E8A33D);
    line-height: 0;
  }
  .pds-rating-text { font-size: 12.5px; color: var(--pdp-muted, #71717A); }

  /* ── price ── */
  .pds-price-row {
    margin-top: 18px;
    padding-bottom: 20px;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 12px;
  }
  .pds-sep {
    width: 100%;
    height: 10px;
    margin: 10px 0 24px;
  }
  .pds-mrp {
    font-size: 15px;
    color: var(--pdp-faint, #A1A1AA);
    text-decoration: line-through;
  }
  .pds-save {
    margin-left: auto;
    align-self: center;
    padding: 5px 12px;
    border-radius: 999px;
    background: #FDEFE6;
    color: var(--pdp-accent-deep, #D45A79);
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1;
  }

  /* ── actions ── */
  .pds-actions {
    margin-top: 26px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pds-cart {
    flex: 1;
    min-width: 0;
    height: 48px;
    border: 0;
    border-radius: 999px;
    background: var(--pdp-ink, #111118);
    color: #FFFFFF;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: background .22s ease;
  }
  .pds-cart:hover:not(:disabled) { background: #2B2B33; }
  .pds-cart:disabled { background: #D4D4D8; cursor: not-allowed; }

  .pds-lock {
    flex: none;
    color: var(--pdp-faint, #A1A1AA);
    display: inline-flex;
  }

  /* ── wishlist ── */
  .pds-wish {
    appearance: none;
    margin-top: 16px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 13px;
    color: #52525B;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
    transition: color .2s ease;
  }
  .pds-wish:hover { color: var(--pdp-ink, #111118); }
  .pds-wish.is-on { color: var(--pdp-accent-deep, #D45A79); }

  @media (max-width: 420px) {
    .pds-actions { flex-wrap: wrap; }
    .pds-cart { flex: 1 1 100%; order: 3; }
  }
`;
