export const S = `
  .prl-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  @media (max-width: 1000px) {
    .prl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 520px) {
    .prl-grid { grid-template-columns: minmax(0, 1fr); }
  }
`;
