export const S = `
  .prs-wrap {
    display: grid;
    grid-template-columns: minmax(0, 200px) minmax(0, 1fr);
    gap: clamp(24px, 5vw, 64px);
    align-items: center;
    padding-bottom: clamp(26px, 4vh, 40px);
  }

  .prs-avg {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(44px, 6vw, 64px);
    font-weight: 400;
    line-height: 1;
    color: #111118;
  }
  .prs-stars {
    display: inline-flex;
    gap: 2px;
    margin-top: 10px;
    color: #E8A33D;
    line-height: 0;
  }
  .prs-count {
    display: block;
    margin-top: 8px;
    font-size: 12.5px;
    color: #71717A;
  }

  .prs-bars {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
    max-width: 460px;
  }
  .prs-bar-row {
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr) 38px;
    align-items: center;
    gap: 12px;
  }
  .prs-bar-star {
    font-size: 11.5px;
    color: #A1A1AA;
    text-align: right;
  }
  .prs-track {
    height: 5px;
    border-radius: 999px;
    background: #EEEEF2;
    overflow: hidden;
  }
  .prs-fill {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: #E8A33D;
    transition: width .6s cubic-bezier(.22,1,.36,1);
  }
  .prs-pct {
    font-size: 11.5px;
    color: #71717A;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 720px) {
    .prs-wrap { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  }
`;
