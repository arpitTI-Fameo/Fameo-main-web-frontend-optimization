export const S = `
  .pvp-axis { margin-top: 20px; }

  .pvp-label {
    display: block;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .04em;
    color: #71717A;
  }

  .pvp-row { display: flex; flex-wrap: wrap; gap: 9px; }
  .pvp-row.is-swatch { gap: 11px; }

  /* colour discs */
  .pvp-swatch {
    appearance: none;
    padding: 2px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid transparent;
    background: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color .2s ease, transform .2s ease;
  }
  .pvp-swatch:hover { transform: scale(1.06); }
  .pvp-swatch.is-on { border-color: #111118; }
  .pvp-swatch:focus-visible { outline: 1px solid #111118; outline-offset: 2px; }
  .pvp-dot {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(17,17,24,.10);
  }

  /* labelled pills */
  .pvp-pill {
    appearance: none;
    font: inherit;
    font-size: 12.5px;
    line-height: 1;
    padding: 10px 17px;
    border-radius: 999px;
    border: 1px solid #E4E4E7;
    background: #FFFFFF;
    color: #3A3A44;
    cursor: pointer;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
  }
  .pvp-pill:hover { border-color: #111118; }
  .pvp-pill.is-on {
    background: #111118;
    border-color: #111118;
    color: #FFFFFF;
  }
  .pvp-pill:focus-visible { outline: 1px solid #111118; outline-offset: 2px; }
`;
