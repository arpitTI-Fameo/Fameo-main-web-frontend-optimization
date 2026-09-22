export const S = `
  .cdm-heading {
    margin: 0 0 clamp(14px, 2.4vh, 22px);
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 2.6vw, 32px);
    font-weight: 400;
    line-height: 1.12;
    color: var(--ct-ink);
  }

  .cdm-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(10px, 1.4vw, 16px);
    max-width: 580px;
  }

  /* Same pill idiom as the detail page's VariantPicker. */
  .cdm-opt {
    appearance: none;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    min-height: 52px;
    padding: 13px 20px;
    border-radius: 999px;
    border: 1px solid var(--ct-line);
    background: #FFFFFF;
    color: var(--ct-soft);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: background .22s ease, color .22s ease, border-color .22s ease;
  }
  .cdm-opt:hover:not(.is-on) { border-color: var(--ct-ink); }
  .cdm-opt.is-on {
    background: var(--ct-ink);
    border-color: var(--ct-ink);
    color: #FFFFFF;
  }
  .cdm-opt:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 3px; }

  .cdm-icon { display: inline-flex; }

  @media (max-width: 560px) {
    .cdm-row { grid-template-columns: minmax(0, 1fr); }
  }
`;
