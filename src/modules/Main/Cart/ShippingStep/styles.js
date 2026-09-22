export const S = `
  .css-wrap { padding-bottom: 12px; }

  .css-address { margin-top: clamp(26px, 4vh, 40px); }

  .css-address-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--ct-line-soft);
  }

  .css-address-title {
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--ct-muted);
  }

  .css-add {
    appearance: none;
    border: 0;
    background: none;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--ct-accent);
    display: inline-flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
    transition: color .2s ease;
  }
  .css-add:hover { color: var(--ct-accent-deep); }
  .css-add:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 3px; }

  .css-pickup {
    margin-top: clamp(26px, 4vh, 40px);
    padding: clamp(20px, 3vh, 28px);
    border-radius: 16px;
    background: var(--ct-band);
    max-width: 680px;
  }
  .css-pickup-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 2.1vw, 26px);
    font-weight: 400;
    line-height: 1.15;
    color: var(--ct-ink);
  }
  .css-pickup-body {
    margin: 9px 0 0;
    font-size: 13.5px;
    line-height: 1.7;
    color: var(--ct-muted);
  }
`;
