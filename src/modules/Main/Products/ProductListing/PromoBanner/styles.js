export const S = `
  .pb-wrap {
    padding: clamp(56px, 9vh, 104px) 24px clamp(40px, 6vh, 72px);
    font-family: 'Inter', sans-serif;
  }
  .pb-inner {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    min-height: clamp(380px, 56vw, 580px);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2A2119;
  }

  .pb-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .pb-veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,.42) 0%, rgba(0,0,0,.24) 45%, rgba(0,0,0,.5) 100%);
  }

  .pb-body {
    position: relative;
    text-align: center;
    padding: clamp(40px, 6vw, 72px) 24px;
    max-width: 640px;
  }
  .pb-title {
    margin: 0;
    font-size: clamp(32px, 5.6vw, 62px);
    font-weight: 700;
    line-height: 1.16;
    text-transform: uppercase;
    color: #FFFFFF;
    text-shadow: 0 2px 18px rgba(0,0,0,.3);
  }
  .pb-sub {
    margin: 18px auto 0;
    max-width: 46ch;
    font-size: 13px;
    line-height: 1.7;
    color: rgba(255,255,255,.88);
  }

  .pb-cta {
    margin-top: 26px;
    appearance: none;
    border: 0;
    background: rgba(255,255,255,.9);
    color: #1A1A1A;
    border-radius: 999px;
    padding: 12px 24px;
    font: inherit;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
    transition: background .22s ease, transform .22s ease;
  }
  .pb-cta:hover { background: #FFFFFF; transform: translateY(-2px); }
  .pb-cta:active { transform: translateY(0); }

  @media (prefers-reduced-motion: reduce) {
    .pb-cta { transition-duration: .01ms; }
  }
`;
