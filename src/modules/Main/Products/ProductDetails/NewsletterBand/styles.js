export const S = `
  .pnb-band {
    background: #111118;
    color: #FFFFFF;
    padding: clamp(46px, 7vh, 76px) 0;
  }

  .pnb-inner {
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
  }

  .pnb-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.6vw, 42px);
    font-weight: 400;
    line-height: 1.1;
  }

  .pnb-sub {
    margin: 12px 0 0;
    font-size: 13px;
    line-height: 1.65;
    color: rgba(255,255,255,.58);
  }

  .pnb-form {
    margin-top: 26px;
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  .pnb-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .pnb-input {
    flex: 1;
    min-width: 0;
    max-width: 340px;
    height: 46px;
    padding: 0 20px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.18);
    background: transparent;
    color: #FFFFFF;
    font: inherit;
    font-size: 13px;
    transition: border-color .2s ease;
  }
  .pnb-input::placeholder { color: rgba(255,255,255,.4); }
  .pnb-input:focus { outline: none; border-color: #DD8164; }

  .pnb-cta {
    flex: none;
    height: 46px;
    padding: 0 26px;
    border: 0;
    border-radius: 999px;
    background: #FFFFFF;
    color: #111118;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background .22s ease, color .22s ease;
  }
  .pnb-cta:hover:not(:disabled) { background: #DD8164; color: #FFFFFF; }
  .pnb-cta:disabled { background: rgba(255,255,255,.28); color: #FFFFFF; cursor: default; }

  @media (max-width: 520px) {
    .pnb-form { flex-direction: column; align-items: stretch; }
    .pnb-input { max-width: none; }
  }
`;
