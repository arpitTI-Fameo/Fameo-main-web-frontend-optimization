export const S = `
  .cal-empty {
    margin: 0;
    padding: clamp(18px, 2.8vh, 28px) 0;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--ct-muted);
  }

  .cal-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 10px;
    max-width: 680px;
  }

  .cal-card {
    appearance: none;
    width: 100%;
    font: inherit;
    text-align: left;
    padding: 15px 18px;
    border-radius: 14px;
    border: 1px solid var(--ct-line);
    background: #FFFFFF;
    display: flex;
    align-items: flex-start;
    gap: 13px;
    cursor: pointer;
    transition: border-color .2s ease, background .2s ease;
  }
  .cal-card:hover:not(.is-on) { border-color: var(--ct-ink); }
  .cal-card.is-on { border-color: var(--ct-accent); background: var(--ct-accent-pale); }
  .cal-card:focus-visible { outline: 1px solid var(--ct-ink); outline-offset: 2px; }

  .cal-mark {
    flex: none;
    margin-top: 2px;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    border: 1px solid var(--ct-line);
    background: #FFFFFF;
    color: #FFFFFF;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background .2s ease, border-color .2s ease;
  }
  .cal-card.is-on .cal-mark { background: var(--ct-accent); border-color: var(--ct-accent); }

  .cal-body { display: grid; gap: 4px; min-width: 0; }
  .cal-name { font-size: 13.5px; font-weight: 500; color: var(--ct-ink); }
  .cal-line { font-size: 13px; line-height: 1.5; color: var(--ct-muted); }
  .cal-phone { font-size: 12.5px; color: var(--ct-faint); }
`;
