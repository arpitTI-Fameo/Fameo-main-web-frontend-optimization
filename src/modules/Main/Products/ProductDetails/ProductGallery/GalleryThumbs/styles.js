export const S = `
  .pgt-strip {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: 12px;
    margin-top: 12px;
  }

  .pgt-thumb {
    appearance: none;
    padding: 0;
    background: #F4F4F5;
    border: 1px solid transparent;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    transition: border-color .22s ease, transform .22s ease;
  }
  .pgt-thumb:hover { transform: translateY(-2px); }
  .pgt-thumb.is-active { border-color: #111118; }
  .pgt-thumb:focus-visible { outline: 1px solid #111118; outline-offset: 2px; }

  .pgt-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 600px) {
    .pgt-strip { gap: 8px; }
  }
`;
