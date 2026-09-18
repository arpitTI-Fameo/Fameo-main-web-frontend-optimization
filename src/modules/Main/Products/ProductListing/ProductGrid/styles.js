export const S = `
  .pg-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(28px, 4vh, 44px) 24px 0;
    font-family: 'Inter', sans-serif;
  }

  .pg-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* list view — the card turns horizontal: shot on the left, rating row and
     name/price/bag stacked on the right. Grid placement does the reordering,
     so the card's markup is untouched. */
  .pg-grid.is-list { grid-template-columns: 1fr; gap: 12px; }
  .pg-grid.is-list .plc-card {
    display: grid;
    grid-template-columns: 148px minmax(0, 1fr);
    grid-template-rows: auto auto;
    align-items: center;
    column-gap: 22px;
    row-gap: 12px;
    padding: 16px 20px;
  }
  .pg-grid.is-list .plc-media {
    grid-column: 1;
    grid-row: 1 / span 2;
    aspect-ratio: 1 / 1;
    padding: 0;
  }
  .pg-grid.is-list .plc-top  { grid-column: 2; grid-row: 1; align-self: start; }
  .pg-grid.is-list .plc-foot { grid-column: 2; grid-row: 2; align-self: end; }
  .pg-grid.is-list .plc-card:hover { transform: none; }
  .pg-grid.is-list .plc-name { font-size: 14px; white-space: normal; }

  @media (max-width: 560px) {
    .pg-grid.is-list .plc-card { grid-template-columns: 104px minmax(0, 1fr); column-gap: 16px; }
  }

  .pg-note {
    margin: 0;
    padding: 56px 0;
    text-align: center;
    font-size: 14px;
    color: #8C8C8C;
  }
  .pg-note.is-error { color: #C42D45; }

  .pg-more {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
  .pg-more-btn {
    appearance: none;
    border: 1px solid #E2E2E2;
    background: #FFFFFF;
    color: #1A1A1A;
    border-radius: 999px;
    padding: 11px 28px;
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: background .22s ease, color .22s ease, border-color .22s ease;
  }
  .pg-more-btn:hover { background: #111111; border-color: #111111; color: #FFFFFF; }

  @media (max-width: 900px) {
    .pg-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  }
  @media (max-width: 560px) {
    .pg-grid { grid-template-columns: 1fr; gap: 16px; }
  }
`;
