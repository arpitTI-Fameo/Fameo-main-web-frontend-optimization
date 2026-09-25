export const S = `
  .cti-row {
    display: grid;
    grid-template-columns: clamp(132px, 16vw, 188px) minmax(0, 1fr);
    gap: clamp(18px, 2.4vw, 32px);
    padding: clamp(20px, 3vh, 28px) 0;
    border-bottom: 1px solid var(--ct-line-soft);
    animation: ctiIn .34s cubic-bezier(.22,1,.36,1) both;
  }
  .cti-row:last-child { border-bottom: 0; }
  @keyframes ctiIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  /* ── shot ── */
  .cti-media {
    aspect-ratio: 4 / 3;
    border-radius: 14px;
    overflow: hidden;
    background: var(--ct-tile);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cti-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .6s cubic-bezier(.22,1,.36,1);
  }
  .cti-row:hover .cti-img { transform: scale(1.04); }

  /* Packshots: whole product in frame, white ground multiplied into the tile. */
  .cti-media.is-contain .cti-img {
    box-sizing: border-box;
    padding: 8%;
    object-fit: contain;
    mix-blend-mode: multiply;
  }
  .cti-img-fallback { font-size: 28px; }

  /* ── body ── */
  .cti-body {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .cti-headline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
  .cti-titles { min-width: 0; }

  .cti-brand {
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ct-faint);
  }
  .cti-name {
    margin: 7px 0 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(21px, 2.1vw, 28px);
    font-weight: 400;
    line-height: 1.14;
    color: var(--ct-ink);
    overflow-wrap: anywhere;
  }

  /* ── wishlist + remove ── */
  .cti-tools { flex: none; display: flex; align-items: center; gap: 9px; }

  .cti-wish, .cti-remove {
    appearance: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .2s ease, color .2s ease, transform .2s ease;
  }
  .cti-wish {
    background: var(--ct-tile);
    color: var(--ct-muted);
  }
  .cti-wish:hover { color: var(--ct-soft); transform: scale(1.07); }
  .cti-wish.is-on { background: var(--ct-accent-pale); color: var(--ct-accent-deep); }

  .cti-remove {
    background: var(--ct-tile);
    color: var(--ct-muted);
  }
  .cti-remove:hover { background: var(--ct-danger); color: #FFFFFF; transform: scale(1.07); }

  .cti-wish:focus-visible, .cti-remove:focus-visible {
    outline: 1px solid var(--ct-ink);
    outline-offset: 2px;
  }

  /* ── category ── */
  .cti-category {
    margin: clamp(12px, 2.2vh, 20px) 0 0;
    display: flex;
    align-items: center;
    gap: 11px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ct-faint);
  }
  .cti-chip {
    padding: 5px 13px;
    border-radius: 999px;
    background: var(--ct-tile);
    color: #52525B;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
    line-height: 1.3;
  }

  /* ── stepper + price ── */
  .cti-foot {
    margin-top: auto;
    padding-top: clamp(14px, 2.4vh, 24px);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  /* Matches the detail page's QuantityStepper — one pill, not three buttons. */
  .cti-qty {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: 42px;
    padding: 0 6px;
    border: 1px solid var(--ct-line);
    border-radius: 999px;
    background: #FFFFFF;
  }
  .cti-qbtn {
    appearance: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 0;
    background: none;
    color: var(--ct-soft);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .2s ease, color .2s ease, opacity .2s ease;
  }
  .cti-qbtn:hover:not(:disabled) { background: var(--ct-tile); color: var(--ct-ink); }
  .cti-qbtn:disabled { color: #D4D4D8; cursor: not-allowed; }
  .cti-qbtn:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 1px; }
  .cti-qval {
    min-width: 24px;
    text-align: center;
    font-size: 13.5px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: var(--ct-ink);
  }

  .cti-price { text-align: right; }
  .cti-price-was {
    margin: 0;
    font-size: 12.5px;
    color: var(--ct-faint);
    text-decoration: line-through;
  }
  .cti-price-now {
    margin: 4px 0 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(21px, 2.1vw, 28px);
    font-weight: 500;
    line-height: 1;
    color: var(--ct-ink);
    white-space: nowrap;
  }

  /* ── drawer variant ── */
  .cti-row.is-compact {
    grid-template-columns: 74px minmax(0, 1fr);
    gap: 14px;
    padding: 15px 0;
  }
  .cti-row.is-compact .cti-media { aspect-ratio: 1 / 1; border-radius: 10px; }
  .cti-row.is-compact .cti-name { font-size: 16px; margin-top: 5px; }
  .cti-row.is-compact .cti-brand { font-size: 10px; }
  .cti-row.is-compact .cti-remove { width: 28px; height: 28px; }
  .cti-row.is-compact .cti-foot { padding-top: 11px; }
  .cti-row.is-compact .cti-qty { height: 34px; padding: 0 4px; }
  .cti-row.is-compact .cti-qbtn { width: 26px; height: 26px; }
  .cti-row.is-compact .cti-price-now { font-size: 17px; }

  @media (max-width: 560px) {
    .cti-row { grid-template-columns: 100px minmax(0, 1fr); gap: 14px; }
    .cti-name { font-size: 19px; }
    .cti-category { margin-top: 12px; }
    .cti-foot { flex-direction: column; align-items: flex-start; gap: 12px; }
    .cti-price { text-align: left; }
  }
`;
