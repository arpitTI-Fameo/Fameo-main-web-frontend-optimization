export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  /* ── Full size (cart page) ── */
  .ci-row {
    display: grid;
    grid-template-columns: 88px 1fr auto;
    gap: 20px; align-items: center;
    padding: 22px 0;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    animation: ciIn .35s ease both;
  }
  /* ── Compact size (drawer) ── */
  .ci-row.compact {
    grid-template-columns: 64px 1fr auto;
    gap: 14px;
    padding: 16px 0;
  }

  @keyframes ciIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  /* image */
  .ci-img {
    width: 88px; height: 88px;
    background: #f4f4f6;
    border: 1px solid rgba(0,0,0,0.08);
    overflow: hidden; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ci-row.compact .ci-img { width: 64px; height: 64px; }
  .ci-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ci-img-placeholder { font-size: 32px; }
  .ci-row.compact .ci-img-placeholder { font-size: 24px; }

  /* info */
  .ci-cat  {
    font-size: 9px; font-weight: 300; letter-spacing: .2em;
    text-transform: uppercase; color: #E8405A; margin-bottom: 3px;
  }
  .ci-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 500;
    text-transform: uppercase; color: #181820; line-height: 1.15;
  }
  .ci-row.compact .ci-name { font-size: 14px; }
  .ci-tagline {
    font-size: 11px; font-weight: 300; color: #9898a8; margin-top: 2px;
  }
  .ci-row.compact .ci-tagline { display: none; }
  .ci-price-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .ci-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #181820;
  }
  .ci-row.compact .ci-price { font-size: 16px; }
  .ci-orig {
    font-size: 11px; color: #9898a8; text-decoration: line-through;
  }

  /* controls */
  .ci-controls {
    display: flex; flex-direction: column;
    align-items: flex-end; gap: 10px;
  }
  .ci-qty { display: flex; align-items: center; }
  .ci-qbtn {
    width: 32px; height: 34px;
    border: 1px solid rgba(0,0,0,0.08);
    background: #f4f4f6; font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #181820; transition: background .18s;
  }
  .ci-row.compact .ci-qbtn { width: 26px; height: 28px; font-size: 13px; }
  .ci-qbtn:hover { background: #e8e8f0; }
  .ci-qval {
    width: 36px; height: 34px;
    border-top: 1px solid rgba(0,0,0,0.08);
    border-bottom: 1px solid rgba(0,0,0,0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #181820;
  }
  .ci-row.compact .ci-qval { width: 28px; height: 28px; font-size: 13px; }
  .ci-subtotal {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400; color: #181820;
  }
  .ci-row.compact .ci-subtotal { font-size: 15px; }
  .ci-remove {
    font-size: 9px; font-weight: 300; letter-spacing: .14em;
    text-transform: uppercase; color: #9898a8;
    background: none; border: none; cursor: pointer;
    transition: color .18s; padding: 0;
  }
  .ci-remove:hover { color: #e05050; }
`;
