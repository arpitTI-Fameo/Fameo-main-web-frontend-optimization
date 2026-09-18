export const S = `
  /* One tone darker than the reviews band below it, so the three sections
     under the fold read as a descending ladder rather than one flat block. */
  .ptb-wrap { background: #F4F4F5; }

  .ptb-strip-band { }
  .ptb-separator {
    width: 100%;
    height: 10px;
  }

  .ptb-strip {
    display: flex;
    gap: clamp(18px, 3vw, 40px);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ptb-strip::-webkit-scrollbar { display: none; }

  .ptb-tab {
    appearance: none;
    border: 0;
    background: none;
    font: inherit;
    font-size: 13px;
    color: #71717A;
    padding: 18px 0 15px;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    cursor: pointer;
    transition: color .2s ease, border-color .2s ease;
  }
  .ptb-tab:hover { color: #111118; }
  .ptb-tab.is-on {
    color: #111118;
    font-weight: 500;
    border-bottom-color: #DD8164;
  }
  .ptb-tab:focus-visible { outline: 1px solid #111118; outline-offset: 2px; }

  .ptb-panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(28px, 5vw, 72px);
    padding: clamp(28px, 4.5vh, 48px) 0;
    align-items: start;
  }

  .ptb-body { display: grid; gap: 15px; }
  .ptb-para {
    margin: 0;
    max-width: 52ch;
    font-size: 13.5px;
    line-height: 1.75;
    color: #52525B;
  }

  @media (max-width: 860px) {
    .ptb-panel { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  }
`;
