export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --pg-rose:#E8405A; --pg-ink:#111118;
    --pg-muted:#888898; --pg-line:#EEEEF2;
    --pg-surf:#F7F7FA; --pg-white:#ffffff;
  }

  /* ── shell ── */
  .pg-wrap { display: flex; align-items: flex-start; min-height: 60vh; }

  /* ── toolbar ── */
  .pg-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 28px; border-bottom: 1px solid var(--pg-line);
    background: var(--pg-white); gap: 16px; flex-wrap: wrap;
  }
  .pg-toolbar-left {
    display: flex; align-items: center; gap: 16px;
  }
  .pg-toolbar-title {
    font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300;
    color: var(--pg-ink);
  }
  .pg-toolbar-title em { font-style: italic; color: var(--pg-rose); }
  .pg-filter-toggle {
    display: none; /* shown on mobile */
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .18em; text-transform: uppercase;
    padding: 7px 14px; border: 1.5px solid var(--pg-line);
    background: transparent; color: var(--pg-muted); cursor: pointer;
    border-radius: 3px; transition: border-color .2s, color .2s;
  }
  .pg-filter-toggle:hover { border-color: var(--pg-rose); color: var(--pg-rose); }

  /* view mode + result count */
  .pg-toolbar-right { display: flex; align-items: center; gap: 14px; }
  .pg-result-count {
    font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 300;
    letter-spacing: .1em; color: var(--pg-muted);
  }
  .pg-view-btns { display: flex; gap: 3px; }
  .pg-vbtn {
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--pg-line); background: transparent; cursor: pointer;
    color: var(--pg-muted); border-radius: 3px; transition: all .18s;
  }
  .pg-vbtn:hover { border-color: var(--pg-rose); color: var(--pg-rose); }
  .pg-vbtn.on { border-color: var(--pg-ink); color: var(--pg-ink); background: var(--pg-surf); }

  /* ── main area ── */
  .pg-main { flex: 1; min-width: 0; }

  /* active filters chips */
  .pg-chips {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding: 12px 28px; border-bottom: 1px solid var(--pg-line);
  }
  .pg-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid var(--pg-rose); background: #fff5f7;
    font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 400;
    letter-spacing: .08em; color: var(--pg-rose);
  }
  .pg-chip-x {
    background: none; border: none; cursor: pointer;
    color: var(--pg-rose); font-size: 12px; line-height: 1;
    padding: 0; transition: opacity .15s;
  }
  .pg-chip-x:hover { opacity: .6; }

  /* grid */
  .pg-grid {
    display: grid; padding: 24px 28px; gap: 1px;
    background: var(--pg-line);
    grid-template-columns: repeat(3, 1fr);
  }
  .pg-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
  .pg-grid.cols-1 { grid-template-columns: 1fr; background: transparent; gap: 1px; }

  /* empty */
  .pg-empty {
    padding: 80px 28px; text-align: center;
  }
  .pg-empty-title {
    font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300;
    color: var(--pg-ink); margin-bottom: 10px;
  }
  .pg-empty-sub { font-size: 13px; font-weight: 300; color: var(--pg-muted); margin-bottom: 20px; }
  .pg-empty-clear {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .18em; text-transform: uppercase;
    padding: 10px 24px; border: 1.5px solid var(--pg-rose);
    background: transparent; color: var(--pg-rose); cursor: pointer;
    border-radius: 3px; transition: all .2s;
  }
  .pg-empty-clear:hover { background: var(--pg-rose); color: #fff; }

  /* load more */
  .pg-load-more {
    display: flex; justify-content: center; padding: 32px;
    border-top: 1px solid var(--pg-line);
  }
  .pg-load-btn {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .2em; text-transform: uppercase;
    padding: 13px 40px; border: 1.5px solid var(--pg-ink);
    background: transparent; color: var(--pg-ink); cursor: pointer;
    border-radius: 3px; transition: all .22s;
  }
  .pg-load-btn:hover { background: var(--pg-ink); color: #fff; }

  @media (max-width: 900px) {
    .pg-wrap { flex-direction: column; }
    .pg-filter-toggle { display: flex; }
    .pg-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .pg-grid { grid-template-columns: 1fr; }
    .pg-toolbar { padding: 14px 16px; }
    .pg-grid { padding: 16px; }
  }
`;
