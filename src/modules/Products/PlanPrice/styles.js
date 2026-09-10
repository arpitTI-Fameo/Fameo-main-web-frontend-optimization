export const S = `
  .pp-wrap { display: flex; flex-direction: column; gap: 3px; }
  .pp-row  { display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap; }
  .pp-now  {
    font-family: 'Cormorant Garamond', serif;
    font-size: inherit; font-weight: 400; color: #111118; line-height: 1;
  }
  .pp-was {
    font-size: 11px; font-weight: 300; color: #888898;
    text-decoration: line-through;
  }
  .pp-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-family: 'Jost', sans-serif;
    font-size: 8px; font-weight: 500; letter-spacing: .14em;
    text-transform: uppercase; padding: 2px 7px;
    border-radius: 2px; white-space: nowrap;
    border: 1px solid currentColor;
  }
  .pp-save {
    font-family: 'Jost', sans-serif;
    font-size: 10px; font-weight: 300; color: #2eaa68;
  }
  .pp-upsell {
    font-family: 'Jost', sans-serif;
    font-size: 10px; font-weight: 300; color: #888898; line-height: 1.4;
  }
  .pp-upsell b { font-weight: 500; color: #111118; }

  /* Large variant for the product detail overlay */
  .pp-wrap.lg .pp-now  { font-size: 1em; }
  .pp-wrap.lg .pp-was  { font-size: 14px; }
  .pp-wrap.lg .pp-badge{ font-size: 9px; padding: 3px 9px; }
  .pp-wrap.lg .pp-save { font-size: 12px; }
`;
