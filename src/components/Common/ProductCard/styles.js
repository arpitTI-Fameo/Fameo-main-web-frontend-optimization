export const S = `
  .plc-card {
    --plc-surf:#F4F4F4;
    background: var(--plc-surf);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background .25s ease, transform .25s ease, box-shadow .25s ease;
  }
  .plc-card:hover {
    background: #EFEFEF;
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(0,0,0,.07);
  }
  .plc-card:focus-visible {
    outline: 1px solid #111111;
    outline-offset: 3px;
  }

  /* rating + wishlist */
  .plc-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .plc-rating {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    color: #2B2B2B;
    line-height: 1;
  }
  .plc-wish {
    appearance: none;
    border: 0;
    background: none;
    padding: 2px;
    margin-left: auto;
    color: #9B9B9B;
    display: inline-flex;
    cursor: pointer;
    transition: color .2s ease, transform .2s ease;
  }
  .plc-wish:hover { color: #4A4A4A; transform: scale(1.1); }
  .plc-wish.is-on { color: #E0335B; }

  /* product shot */
  .plc-media {
    /* Ratio rather than flex:1 — the shot area then scales with the column
       and the card stays near-square at every breakpoint. */
    aspect-ratio: 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 26px 18px;
  }
  .plc-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    mix-blend-mode: multiply;
  }

  /* name, price, bag */
  .plc-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .plc-text { min-width: 0; }
  .plc-name {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: #1A1A1A;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .plc-price {
    margin: 5px 0 0;
    font-size: 12.5px;
    color: #6E6E6E;
    line-height: 1.2;
  }

  .plc-bag {
    flex: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 0;
    background: #FFFFFF;
    color: #1A1A1A;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
    transition: background .2s ease, color .2s ease, transform .2s ease;
  }
  .plc-bag:hover { background: #111111; color: #FFFFFF; transform: scale(1.06); }
  .plc-bag:active { transform: scale(.94); }

  @media (max-width: 600px) {
    .plc-media { padding: 10px 18px 16px; }
  }
`;
