export const S = `
  .prv-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(22px, 4vw, 52px);
    padding-top: clamp(26px, 4vh, 38px);
  }
  .prv-sep {
    width: 100%;
    height: 10px;
  }

  @media (max-width: 860px) {
    .prv-grid { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  }
`;
