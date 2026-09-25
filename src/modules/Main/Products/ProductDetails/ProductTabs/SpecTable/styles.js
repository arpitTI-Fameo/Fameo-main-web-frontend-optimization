export const S = `
  .pst-list { margin: 0; display: grid; gap: 0; }

  .pst-row {
    padding: 13px 0;
    border-bottom: 1px solid #E4E4E7;
  }
  .pst-row:first-child { padding-top: 0; }
  .pst-row:last-child { border-bottom: 0; }

  /* Full-width sheet: a grid of cells, every one ruled, so rows line up
     across columns instead of the first cell sitting higher than its peers. */
  .pst-list.is-wide {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
    column-gap: clamp(24px, 4vw, 56px);
  }
  .pst-list.is-wide .pst-row,
  .pst-list.is-wide .pst-row:first-child,
  .pst-list.is-wide .pst-row:last-child {
    padding: 13px 0;
    border-bottom: 1px solid #E4E4E7;
  }

  .pst-label {
    margin: 0 0 5px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .05em;
    color: #DD8164;
  }
  .pst-value {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.45;
    color: #111118;
  }
`;
