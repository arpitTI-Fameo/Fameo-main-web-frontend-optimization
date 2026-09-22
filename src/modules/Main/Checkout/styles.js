// modules/Main/Checkout/styles.js
// Page shell and the token set every checkout section inherits.
//
// Same contract as the cart and the product pages: the tokens are declared on
// the page root and the children read them through var(). Checkout used to run
// its own system — Jost, #181820 ink, an #E8405A pink and 3px corners — which
// made the last step of the funnel look like a different site from the one the
// shopper had just been browsing.

export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');

  .chk-page {
    --chk-ink: #111118;
    --chk-soft: #3A3A44;
    --chk-muted: #71717A;
    --chk-faint: #A1A1AA;
    --chk-line: #E4E4E7;
    --chk-line-soft: #EEEEF2;
    --chk-band: #F9F9FB;
    --chk-tile: #F4F4F5;
    --chk-accent: #DD8164;
    --chk-accent-deep: #D45A79;
    --chk-accent-pale: #FDEFE6;
    --chk-ok: #2EAA68;
    --chk-danger: #C42D45;

    max-width: 100%;
    margin: 0;
    padding: clamp(100px, 12vh, 140px) clamp(24px, 5vw, 80px) clamp(48px, 8vh, 88px);
    background: #FFFFFF;
    color: var(--chk-ink);
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .chk-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4.2vw, 52px);
    font-weight: 400;
    line-height: 1.04;
    letter-spacing: .005em;
    color: var(--chk-ink);
  }
  .chk-title em { font-style: italic; color: var(--chk-accent); }

  .chk-sub {
    margin: 10px 0 clamp(26px, 4vh, 38px);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--chk-faint);
  }

  .chk-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: clamp(28px, 4vw, 56px);
    align-items: start;
  }

  .chk-error {
    margin-bottom: 18px;
    padding: 12px 16px;
    border: 1px solid rgba(196, 45, 69, .22);
    border-radius: 12px;
    background: rgba(196, 45, 69, .05);
    font-size: 13px;
    color: var(--chk-danger);
  }

  @media (max-width: 900px) {
    .chk-page { padding: 24px 16px 60px; }
    .chk-body { grid-template-columns: minmax(0, 1fr); }
  }
`;
