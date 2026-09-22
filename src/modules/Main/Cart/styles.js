// modules/Main/Cart/styles.js
// Page shell and the token set every cart surface inherits.
//
// The palette and type are the Products theme, so the cart reads as the same
// store as /products and the detail page: Cormorant Garamond at weight 400 for
// display headings, Inter for everything else, near-black ink on white, rose as
// the single accent, and #F9F9FB for a banded section.
//
// There is no global theme file by design — Products declares its tokens on the
// page root and its children read them through var(). This block is the cart's
// copy of that contract; change a value here and every child follows.

export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');

  .ct-page {
    --ct-ink: #111118;
    --ct-soft: #3A3A44;
    --ct-muted: #71717A;
    --ct-faint: #A1A1AA;
    --ct-line: #E4E4E7;
    --ct-line-soft: #EEEEF2;
    --ct-band: #F9F9FB;
    --ct-tile: #F4F4F5;
    --ct-surface: #FFFFFF;
    --ct-accent: #DD8164;
    --ct-accent-deep: #D45A79;
    --ct-accent-pale: #FDEFE6;
    --ct-star: #E8A33D;
    --ct-ok: #2EAA68;
    --ct-danger: #C42D45;

    background: #FFFFFF;
    color: var(--ct-ink);
    font-family: 'Inter', sans-serif;
    /* clears the fixed MainNav above this route */
    padding: 64px 0 0;
    min-height: 70vh;
  }

  .ct-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── breadcrumbs ── */
  .ct-crumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: clamp(16px, 2.4vh, 24px) 0 0;
    font-size: 12.5px;
    line-height: 1;
    color: var(--ct-faint);
  }
  .ct-crumb {
    color: inherit;
    text-decoration: none;
    transition: color .2s ease;
  }
  .ct-crumb:hover { color: var(--ct-ink); }
  .ct-crumb-sep { color: #D4D4D8; }
  .ct-crumb-current { color: #52525B; }

  /* ── masthead: title on the left, step tabs on the right ── */
  .ct-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: clamp(20px, 4vw, 48px);
    align-items: end;
    padding: clamp(18px, 2.8vh, 28px) 0 clamp(18px, 2.6vh, 26px);
    border-bottom: 1px solid var(--ct-line-soft);
  }

  .ct-eyebrow {
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--ct-accent);
  }

  .ct-title {
    margin: 12px 0 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(34px, 4.4vw, 54px);
    font-weight: 400;
    line-height: 1.04;
    letter-spacing: .005em;
    color: var(--ct-ink);
  }

  .ct-sub {
    margin: 12px 0 0;
    max-width: 56ch;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--ct-muted);
  }

  /* ── body: content + summary rail ── */
  .ct-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 0;
    align-items: start;
    padding-bottom: clamp(48px, 8vh, 96px);
  }
  .ct-main { min-width: 0; padding: clamp(20px, 3vh, 32px) clamp(20px, 3vw, 48px) 0 0; }
  .ct-rail {
    min-width: 0;
    padding: clamp(20px, 3vh, 32px) 0 0 clamp(20px, 3vw, 44px);
    border-left: 1px solid var(--ct-line-soft);
    align-self: stretch;
  }

  /* ── empty state ── */
  .ct-empty {
    text-align: center;
    padding: clamp(50px, 9vh, 96px) 0;
  }
  .ct-empty-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 3.2vw, 38px);
    font-weight: 400;
    line-height: 1.1;
    color: var(--ct-ink);
  }
  .ct-empty-body {
    margin: 10px 0 26px;
    font-size: 13.5px;
    color: var(--ct-muted);
  }
  .ct-empty-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 30px;
    border-radius: 999px;
    background: var(--ct-ink);
    color: #FFFFFF;
    font-size: 13.5px;
    font-weight: 500;
    text-decoration: none;
    transition: background .22s ease;
  }
  .ct-empty-cta:hover { background: #2B2B33; }

  @media (max-width: 1000px) {
    .ct-head { grid-template-columns: minmax(0, 1fr); align-items: start; }
    .ct-body { grid-template-columns: minmax(0, 1fr); }
    .ct-main { padding-right: 0; }
    .ct-rail {
      padding: clamp(22px, 3.4vh, 34px) 0 0;
      border-left: 0;
      border-top: 1px solid var(--ct-line-soft);
      margin-top: 28px;
    }
  }
  @media (max-width: 600px) {
    .ct-inner { padding: 0 16px; }
  }
`;
