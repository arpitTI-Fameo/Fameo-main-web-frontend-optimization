export const S = `
  .wc-wrap {
    padding: clamp(56px, 9vh, 104px) 24px 0;
    font-family: 'Inter', sans-serif;
  }
  .wc-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    gap: clamp(32px, 5vw, 72px);
    align-items: stretch;
  }

  .wc-title {
    margin: 0;
    max-width: 18ch;
    font-size: clamp(22px, 2.6vw, 30px);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .01em;
    line-height: 1.22;
    color: #1A1A1A;
  }
  .wc-sub {
    margin: 14px 0 0;
    max-width: 44ch;
    font-size: 13px;
    line-height: 1.7;
    color: #8C8C8C;
  }

  .wc-grid {
    list-style: none;
    margin: clamp(28px, 4vh, 44px) 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(22px, 3vw, 34px) clamp(18px, 2.5vw, 30px);
  }
  .wc-item { min-width: 0; }
  .wc-icon {
    display: inline-flex;
    color: #1A1A1A;
    margin-bottom: 10px;
  }
  .wc-item-title {
    margin: 0;
    font-size: 13.5px;
    font-weight: 600;
    color: #1A1A1A;
    line-height: 1.3;
  }
  .wc-item-text {
    margin: 7px 0 0;
    font-size: 12px;
    line-height: 1.6;
    color: #8C8C8C;
  }

  /* The image is absolutely placed so its intrinsic size can't drive the row
     height — the copy column decides how tall this block is. */
  .wc-media {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    background: #F4F4F4;
    min-height: 340px;
  }
  .wc-img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 900px) {
    .wc-inner { grid-template-columns: 1fr; gap: 36px; align-items: center; }
    .wc-title { max-width: none; }
    .wc-media { order: -1; }
  }
  @media (max-width: 520px) {
    .wc-grid { grid-template-columns: 1fr; }
  }
`;
