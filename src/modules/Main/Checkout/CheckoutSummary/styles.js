export const S = `
  .csum-wrap {
    position: sticky;
    top: 88px;
    padding: 24px 22px;
    border: 1px solid var(--chk-line-soft);
    border-radius: 18px;
    background: var(--chk-band);
  }

  .csum-title {
    margin: 0 0 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--chk-line);
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.1;
    color: var(--chk-ink);
  }

  /* ── line items ── */
  .csum-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid var(--chk-line-soft);
  }
  .csum-img {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    overflow: hidden;
    background: var(--chk-tile);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .csum-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .csum-info { flex: 1; min-width: 0; }
  .csum-name {
    font-size: 12.5px;
    font-weight: 500;
    color: var(--chk-ink);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .csum-qty { margin-top: 3px; font-size: 11.5px; color: var(--chk-faint); }
  .csum-price {
    font-size: 13px;
    font-weight: 500;
    color: var(--chk-ink);
    white-space: nowrap;
  }

  /* ── totals ── */
  .csum-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 9px 0;
    border-bottom: 1px solid var(--chk-line-soft);
    font-size: 13px;
    color: var(--chk-muted);
  }
  .csum-row span:last-child { color: var(--chk-ink); font-weight: 500; }

  .csum-discount-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 9px 0;
    border-bottom: 1px solid var(--chk-line-soft);
    font-size: 13px;
  }
  .csum-discount-label { display: flex; align-items: center; gap: 6px; color: var(--chk-muted); }
  .csum-discount-val { font-weight: 500; color: var(--chk-accent); white-space: nowrap; }

  .csum-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 14px;
    padding: 15px 0 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--chk-ink);
  }
  .csum-total span:last-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 500;
    line-height: 1;
  }
  .csum-total-orig {
    display: flex;
    justify-content: flex-end;
    margin-top: 3px;
    font-size: 11.5px;
    color: var(--chk-faint);
    text-decoration: line-through;
  }

  .csum-free {
    margin-top: 8px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--chk-ok);
  }

  .csum-savings {
    margin-top: 12px;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(46, 170, 104, .07);
    font-size: 12px;
    color: var(--chk-ok);
    text-align: center;
  }

  @media (max-width: 900px) {
    .csum-wrap { position: static; }
  }
`;
