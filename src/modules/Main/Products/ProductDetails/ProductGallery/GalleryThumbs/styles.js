export const S = `
  /* Four to a row whatever the count: two shots stay thumbnail-sized instead
     of stretching to half the stage, and a sixth wraps rather than overflows. */
  .pgt-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
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
  .pgt-strip.is-contain .pgt-img {
    box-sizing: border-box;
    padding: 10%;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  @media (max-width: 600px) {
    .pgt-strip { gap: 8px; }
  }
`;
