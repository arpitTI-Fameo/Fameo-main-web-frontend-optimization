// modules/Main/Products/ProductDetails/styles.js
// Page shell only — the token set every section inherits, the two-column top
// block and the section rhythm. Each child owns its own styles.js.
//
// Palette and type are lifted from ProductListing/ListingHeader so the detail
// page reads as the same store: Cormorant Garamond for display headings, Inter
// for everything else, near-black ink on white with a #F9F9FB band.

export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

  .pdp {
    --pdp-ink: #111118;
    --pdp-soft: #3A3A44;
    --pdp-muted: #71717A;
    --pdp-faint: #A1A1AA;
    --pdp-line: #EEEEF2;
    --pdp-band: #F9F9FB;
    --pdp-tile: #F4F4F5;
    --pdp-accent: #DD8164;
    --pdp-accent-deep: #D45A79;
    --pdp-star: #E8A33D;

    background: #FFFFFF;
    color: var(--pdp-ink);
    font-family: 'Inter', sans-serif;
    /* Clears the fixed MainNav above this route. */
    padding-top: 64px;
    min-height: 70vh;
  }

  .pdp-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── gallery + summary ── */
  .pdp-top {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: clamp(28px, 5vw, 64px);
    padding: clamp(18px, 2.6vh, 28px) 0 clamp(40px, 6vh, 64px);
    align-items: start;
  }

  /* ── section band under the fold ── */
  .pdp-band { background: var(--pdp-band); }
  .pdp-section { padding: clamp(40px, 6vh, 68px) 0; }

  .pdp-section-title {
    margin: 0 0 clamp(20px, 3vh, 30px);
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: 400;
    line-height: 1.08;
    color: var(--pdp-ink);
  }

  @media (max-width: 900px) {
    .pdp-top { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  }
  @media (max-width: 600px) {
    .pdp-inner { padding: 0 16px; }
  }
`;
