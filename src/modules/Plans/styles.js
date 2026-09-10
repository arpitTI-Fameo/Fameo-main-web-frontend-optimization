export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400;1,9..144,500&family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap');

  /* ─────────────────────────────────────────────────────────────
     FAMEO PLANS — PREMIUM EDITORIAL (rose)
     Palette:  ink #1A1616 · sub #6E6862 · faint #A79E98
               rose #C24E74 · rose-d #9E3357 · rose-dd #7E2545
               bone #FBF7F4 · card #FFFFFF · line rgba(26,20,22,.08)
     Brand grad:  #FFC98F 20% → #DD8164 58% → #D45A79 88%
     Elite grad:  #E89A6B 18% → #D45A79 56% → #9E3357 90%
     Type:     Fraunces (headings) · Schibsted Grotesk (body) ·
               Space Mono (labels/codes) · Poppins (NUMBERS)
     Signature: gradient icon-chip drives each card's whole accent
     ───────────────────────────────────────────────────────────── */

  .plans-page {
    --ink:  #1A1616;
    --sub:  #6E6862;
    --faint:#A79E98;
    --line: rgba(26,20,22,.08);
    --hair: rgba(26,20,22,.06);
    --card: #FFFFFF;

    --brand-grad: linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);
    --elite-grad: linear-gradient(135deg, #E89A6B 18%, #D45A79 56%, #9E3357 90%);
    --rose:   #C24E74;
    --rose-d: #9E3357;

    /* dedicated numeral face — clean geometric sans, matches the reference */
    --num: 'Poppins','Schibsted Grotesk',system-ui,sans-serif;

    width:100%;
    min-height:100vh;
    margin:0;
    padding:0 0 8px;
    font-family:'Schibsted Grotesk',system-ui,-apple-system,sans-serif;
    color:var(--ink);
    background:
      radial-gradient(90% 55% at 84% -8%, rgba(212,90,121,.09) 0%, transparent 58%),
      radial-gradient(70% 50% at 6% 0%,  rgba(255,201,143,.12) 0%, transparent 55%),
      linear-gradient(#FBF7F4, #FFFFFF 46%);
    position:relative;
    overflow-x:hidden;
    -webkit-font-smoothing:antialiased;
  }
  /* faint vertical spine — an editorial signature carried over */
  .plans-page::before {
    content:''; position:absolute; top:0; bottom:0; left:50%; width:1px;
    background:linear-gradient(180deg, transparent, rgba(26,20,22,.05) 14%, rgba(26,20,22,.05) 86%, transparent);
    pointer-events:none; z-index:0;
  }

  .plans-head,
  .duration-wrap,
  .cancel-notice,
  .plans-grid,
  .trust-row,
  .plans-footer,
  .upgrade-notice,
  .referral-benefit,
  .msg-error { position:relative; z-index:1; }

  /* ── Header ─────────────────────────────────────────────────── */
  .plans-head { text-align:center; max-width:780px; margin:0 auto; padding:88px 32px 0; }
  .plans-eyebrow {
    display:inline-block;
    font-family:'Space Mono',monospace;
    font-size:10px; font-weight:400; letter-spacing:.34em; text-transform:uppercase;
    color:var(--rose); margin-bottom:22px; padding-bottom:10px;
    border-bottom:1px solid transparent;
    border-image:linear-gradient(90deg, transparent, #DD8164, #9E3357, transparent) 1;
  }
  .plans-title {
    font-family:'Fraunces',serif;
    font-size:clamp(46px,7.2vw,88px);
    font-weight:300; line-height:.96; letter-spacing:-.015em; color:var(--ink);
  }
  .plans-title em {
    font-style:italic; font-weight:400;
    background:var(--brand-grad);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .plans-sub {
    font-family:'Space Mono',monospace;
    font-size:10px; font-weight:400; letter-spacing:.22em; text-transform:uppercase;
    color:var(--faint); margin-top:22px;
  }

  /* ── Upgrade notice ─────────────────────────────────────────── */
  .upgrade-notice {
    max-width:600px; text-align:center; padding:20px 28px; margin:34px auto 0;
    background:rgba(194,78,116,.045); border:1px solid rgba(194,78,116,.18); border-radius:3px;
  }
  .upgrade-notice h3 { font-family:'Fraunces',serif; font-size:22px; font-weight:400; color:var(--ink); margin:0 0 6px; }
  .upgrade-notice p  { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--faint); margin:0; }
  .upgrade-notice em { font-style:italic; background:var(--brand-grad); -webkit-background-clip:text; background-clip:text; color:transparent; }

  /* ── Referral benefit banner ────────────────────────────────── */
  .referral-benefit {
    max-width:600px; display:flex; align-items:center; gap:16px;
    padding:18px 22px; margin:30px auto 0;
    background:rgba(194,78,116,.05); border:1px solid rgba(194,78,116,.2); border-radius:3px; text-align:left;
  }
  .rb-tag { flex:none; font-family:'Space Mono',monospace; font-size:8px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#fff; padding:7px 11px; border-radius:100px; background:var(--brand-grad); }
  .rb-body { flex:1; min-width:0; }
  .rb-title { font-family:'Fraunces',serif; font-size:19px; font-weight:400; color:var(--ink); line-height:1.25; }
  .rb-title em { font-style:italic; }
  .rb-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--faint); margin-top:5px; }
  .rb-note { font-size:12px; color:var(--sub); margin-top:6px; line-height:1.5; }

  .msg-error {
    max-width:600px; margin:26px auto 0; padding:14px 20px;
    background:rgba(194,78,116,.06); border:1px solid rgba(194,78,116,.22); border-radius:3px;
    font-size:13px; color:var(--rose-d); text-align:center; font-weight:500;
  }

  /* ── Duration selector — unified rounded pills, same radius ──── */
  .duration-wrap { display:flex; justify-content:center; margin:46px auto 0; padding:0 24px; }
  .duration-tabs {
    display:inline-flex; align-items:stretch; gap:8px;
    padding:8px; border:1px solid rgba(26,20,22,.10); border-radius:22px;
    background:rgba(255,255,255,.72); backdrop-filter:blur(8px);
    box-shadow:0 24px 60px -44px rgba(26,20,22,.55);
  }
  .dur-btn {
    position:relative; min-width:132px; padding:15px 26px;
    border:1.5px solid transparent; border-radius:16px; /* SAME radius on every tab */
    background:transparent; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:7px;
    transition:background .25s ease, color .25s ease, border-color .25s ease, box-shadow .25s ease, transform .2s ease;
  }
  .dur-label { font-family:'Space Mono',monospace; font-size:10px; font-weight:400; letter-spacing:.18em; text-transform:uppercase; color:var(--sub); transition:color .25s ease; }
  .dur-price { font-family:var(--num); font-style:normal; font-size:20px; font-weight:500; color:var(--ink); line-height:1; letter-spacing:-.01em; transition:color .25s ease; }
  /* hover on an inactive tab → accent border colour + soft tint */
  .dur-btn:hover:not(.active) { border-color:var(--rose); background:rgba(194,78,116,.05); transform:translateY(-1px); }
  /* selected tab → gradient fill, matching radius, coloured lift */
  .dur-btn.active { background:var(--brand-grad); border-color:transparent; box-shadow:0 14px 30px -12px var(--rose); }
  .dur-btn.active .dur-label, .dur-btn.active .dur-price { color:#fff; }
  .dur-save { position:absolute; top:8px; right:12px; font-family:'Space Mono',monospace; font-size:8px; font-weight:700; letter-spacing:.08em; color:var(--rose); }
  .dur-btn.active .dur-save { color:rgba(255,255,255,.92); }

  /* ── Cancel / auto-renew notice ─────────────────────────────── */
  .cancel-notice {
    display:flex; align-items:center; justify-content:center; gap:9px;
    max-width:640px; margin:22px auto 0; padding:0 24px;
    font-family:'Space Mono',monospace; font-size:9.5px; letter-spacing:.1em; text-transform:uppercase;
    color:var(--faint); text-align:center;
  }
  .cancel-notice svg { flex:none; color:var(--rose); }

  /* ── Grid ───────────────────────────────────────────────────── */
  .plans-grid {
    display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 400px));
    justify-content:center; gap:28px; max-width:1160px; margin:52px auto 0;
    padding:8px clamp(24px,5vw,48px) 0; align-items:stretch;
  }

  .plan-card {
    /* default accent (e.g. pro) — rose family */
    --accent:#C24E74; --accent-d:#9E3357;
    --accent-grad:var(--brand-grad);
    --accent-tint:rgba(194,78,116,.08);
    --accent-tint-b:rgba(194,78,116,.22);
    --accent-soft:rgba(194,78,116,.13);

    position:relative; display:flex; flex-direction:column;
    background:var(--card); border:1.5px solid var(--line); border-radius:32px;
    padding:36px 32px 32px; overflow:hidden;
    box-shadow:0 34px 80px -52px rgba(26,20,22,.4);
    transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
  }
  /* whisper-thin gradient hairline at the very top of every card */
  .plan-card::after {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:var(--accent-grad); opacity:.9;
  }
  /* hover → the card's own accent colour on the border + coloured lift */
  .plan-card:hover { transform:translateY(-5px); box-shadow:0 48px 100px -50px rgba(26,20,22,.5); border-color:var(--accent); }
  .plan-card.popular { --accent:#C24E74; --accent-d:#9E3357; --accent-grad:var(--brand-grad); --accent-tint:rgba(194,78,116,.08); --accent-tint-b:rgba(194,78,116,.24); --accent-soft:rgba(194,78,116,.13); }
  .plan-card.elite   { --accent:#9E3357; --accent-d:#7E2545; --accent-grad:var(--elite-grad); --accent-tint:rgba(158,51,87,.08); --accent-tint-b:rgba(158,51,87,.24); --accent-soft:rgba(158,51,87,.14); }
  .plan-card.premium { border-color:var(--accent-tint-b); }
  .plan-card.is-current { box-shadow:0 0 0 1.5px var(--accent) inset, 0 34px 80px -52px rgba(26,20,22,.4); }

  /* MOST CHOSEN ribbon */
  .most-chosen {
    position:absolute; top:20px; right:24px;
    font-family:'Space Mono',monospace; font-size:8px; font-weight:700; letter-spacing:.2em; text-transform:uppercase;
    color:#fff; padding:6px 12px; border-radius:100px; background:var(--accent-grad);
    box-shadow:0 10px 22px -10px rgba(158,51,87,.7);
  }

  .card-head { display:flex; align-items:center; gap:16px; margin-bottom:26px; }
  .plan-chip {
    flex:none; width:54px; height:54px; border-radius:14px; display:grid; place-items:center;
    font-size:24px; line-height:1; color:#fff; background:var(--accent-grad);
    box-shadow:0 16px 30px -12px var(--accent);
  }
  .plan-chip::after { content:''; position:absolute; }
  .card-head-txt { min-width:0; }
  .plan-name { font-family:'Fraunces',serif; font-size:27px; font-weight:400; color:var(--ink); line-height:1.05; letter-spacing:-.01em; }
  .plan-code { font-family:'Space Mono',monospace; font-size:8px; font-weight:400; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); margin-top:5px; }

  .plan-price-wrap { padding-bottom:24px; margin-bottom:24px; border-bottom:1px solid var(--hair); }
  .plan-price { display:flex; align-items:baseline; gap:3px; color:var(--ink); }
  .plan-price .cur { font-family:var(--num); font-size:24px; font-weight:600; font-style:normal; align-self:flex-start; margin-top:8px; color:var(--faint); }
  .plan-price .amt { font-family:var(--num); font-style:normal; font-size:54px; font-weight:500; letter-spacing:-.03em; line-height:.95; }
  .plan-price .per { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-left:8px; align-self:flex-end; margin-bottom:8px; }
  .plan-term { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--faint); margin-top:14px; }

  .plan-was { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:12px; }
  .plan-was s { font-family:var(--num); font-style:normal; font-size:17px; font-weight:500; color:var(--faint); text-decoration-thickness:1px; }
  .plan-was-off {
    font-family:'Space Mono',monospace; font-size:8px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    color:var(--accent-d); background:var(--accent-tint); border:1px solid var(--accent-tint-b);
    padding:4px 9px; border-radius:100px; white-space:nowrap;
  }
  .plan-price-note { font-size:11px; color:var(--sub); margin-top:9px; line-height:1.4; }

  /* "All features included" chip */
  .feat-chip {
    display:inline-flex; align-items:center; gap:8px; align-self:flex-start;
    padding:8px 14px; border-radius:100px; margin-bottom:22px;
    font-family:'Space Mono',monospace; font-size:9px; font-weight:400; letter-spacing:.14em; text-transform:uppercase;
    color:var(--accent-d); background:var(--accent-tint); border:1px solid var(--accent-tint-b);
  }
  .feat-chip svg { color:var(--accent); }

  .plan-features { list-style:none; padding:0; margin:0 0 28px; display:flex; flex-direction:column; gap:13px; flex:1; }
  .plan-feat { display:flex; align-items:flex-start; gap:12px; font-size:13.5px; font-weight:400; color:#3A3430; line-height:1.45; }
  .feat-check {
    flex:none; width:20px; height:20px; border-radius:50%; margin-top:1px; display:grid; place-items:center;
    background:var(--accent-grad); color:#fff; box-shadow:0 6px 14px -7px var(--accent);
  }
  .plan-feat.feat-no { color:var(--faint); }
  .plan-feat.feat-no .feat-check { background:#EFEBE8; color:#BDB4AD; box-shadow:none; }

  .current-tag { display:inline-flex; align-items:center; gap:7px; align-self:flex-start; font-family:'Space Mono',monospace; font-size:9px; font-weight:400; letter-spacing:.16em; text-transform:uppercase; color:#2E9E63; margin-bottom:16px; }
  .plan-discount-tag { display:inline-flex; align-items:center; gap:6px; margin-top:12px; font-size:12px; font-weight:500; color:var(--accent-d); }

  /* ── Buttons ────────────────────────────────────────────────── */
  .plan-btn {
    width:100%; padding:16px; border-radius:4px; cursor:pointer;
    font-family:'Space Mono',monospace; font-size:10px; font-weight:400; letter-spacing:.2em; text-transform:uppercase;
    display:inline-flex; align-items:center; justify-content:center; gap:10px;
    border:1px solid transparent; margin-top:auto;
    transition:transform .25s ease, box-shadow .25s ease, background .25s ease, color .25s ease, border-color .25s ease, letter-spacing .25s ease;
  }
  .plan-btn svg { transition:transform .25s ease; }
  .plan-btn:hover:not(:disabled) svg { transform:translateX(4px); }
  /* Filled (default premium + popular): gradient → solid deep accent on hover */
  .btn-primary { background:var(--accent-grad); color:#fff; box-shadow:0 18px 34px -16px var(--accent); }
  .btn-primary:hover:not(:disabled) {
    background:var(--accent-d);              /* clear colour change */
    transform:translateY(-2px); letter-spacing:.24em;
    box-shadow:0 24px 46px -16px var(--accent);
  }
  /* Outline (ELITE card): transparent → gradient fill on hover */
  .plan-card.elite .btn-primary { background:#fff; color:var(--accent-d); border-color:var(--accent-tint-b); box-shadow:none; }
  .plan-card.elite .btn-primary:hover:not(:disabled) {
    background:var(--accent-grad); color:#fff; border-color:transparent;
    letter-spacing:.24em; box-shadow:0 20px 40px -16px var(--accent);
  }
  .btn-free { background:#F4F0ED; color:var(--faint); cursor:default; }
  .btn-active { background:rgba(46,158,99,.08); color:#2E9E63; border-color:rgba(46,158,99,.4); cursor:default; }
  .btn-primary:disabled { opacity:.6; cursor:not-allowed; }

  /* ── Trust row ──────────────────────────────────────────────── */
  .trust-row {
    display:flex; flex-wrap:wrap; justify-content:center; align-items:stretch; gap:0;
    max-width:860px; margin:60px auto 0; padding:24px clamp(20px,4vw,36px);
    background:#fff; border:1px solid var(--line); border-radius:8px;
    box-shadow:0 34px 80px -56px rgba(26,20,22,.5);
  }
  .trust-item { flex:1 1 220px; display:flex; align-items:center; gap:15px; padding:8px 22px; border-left:1px solid var(--hair); }
  .trust-item:first-child { border-left:none; }
  .trust-ic { flex:none; width:44px; height:44px; border-radius:12px; display:grid; place-items:center; color:var(--rose); background:rgba(194,78,116,.09); }
  .trust-txt b { display:block; font-family:'Fraunces',serif; font-size:17px; font-weight:400; color:var(--ink); line-height:1.1; }
  .trust-txt span { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); }

  /* ── Footer ─────────────────────────────────────────────────── */
  .plans-footer { text-align:center; margin:36px auto 44px; padding:0 24px; }
  .plans-footer a { font-family:'Space Mono',monospace; color:var(--sub); font-size:10px; letter-spacing:.14em; text-transform:uppercase; text-decoration:none; transition:color .2s; }
  .plans-footer a:hover { color:var(--ink); }
  .plans-footer .dot { color:var(--faint); margin:0 14px; }

  /* ── Checkout modal ─────────────────────────────────────────── */
  .co-overlay { position:fixed; inset:0; z-index:50; background:rgba(26,20,22,.44); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; padding:24px; animation:co-fade .2s ease; }
  @keyframes co-fade { from { opacity:0; } to { opacity:1; } }
  .co-panel { position:relative; width:100%; max-width:440px; background:#fff; border:1px solid var(--line); border-radius:8px; padding:38px 34px 30px; box-shadow:0 60px 120px -30px rgba(158,51,87,.5); animation:co-rise .26s ease; }
  @keyframes co-rise { from { transform:translateY(16px); opacity:0; } to { transform:none; opacity:1; } }
  .co-close { position:absolute; top:18px; right:18px; width:32px; height:32px; border-radius:50%; border:1px solid var(--line); background:#fff; color:var(--faint); cursor:pointer; font-size:13px; display:grid; place-items:center; transition:color .2s, border-color .2s; }
  .co-close:hover { color:var(--ink); border-color:var(--ink); }
  .co-eyebrow { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.28em; text-transform:uppercase; color:var(--rose); margin-bottom:10px; }
  .co-title { font-family:'Fraunces',serif; font-size:27px; font-weight:400; color:var(--ink); line-height:1.1; margin-bottom:24px; }
  .co-title em { font-style:italic; color:var(--faint); font-size:16px; }
  .co-rows { border-top:1px solid var(--line); }
  .co-row { display:flex; justify-content:space-between; align-items:center; padding:13px 0; border-bottom:1px solid var(--hair); font-size:13px; color:var(--sub); }
  .co-row span:last-child { font-family:var(--num); color:var(--ink); font-weight:600; }
  .co-row.co-disc span:last-child { color:#2E9E63; }
  .co-row.co-total { border-bottom:none; padding-top:16px; }
  .co-row.co-total span { font-family:var(--num); font-style:normal; font-size:22px; font-weight:700; color:var(--ink); }
  .co-row.co-total span:first-child { font-family:'Schibsted Grotesk',sans-serif; font-style:normal; font-weight:500; font-size:13px; color:var(--sub); }
  .co-note { font-size:11px; color:var(--rose-d); margin-top:12px; background:rgba(194,78,116,.06); border:1px solid rgba(194,78,116,.2); padding:10px 12px; border-radius:4px; }
  .co-coupon { display:flex; gap:8px; margin-top:22px; }
  .co-input { flex:1; padding:13px 15px; border:1px solid rgba(26,20,22,.16); border-radius:4px; font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink); background:#fff; outline:none; transition:border-color .2s; }
  .co-input:focus { border-color:var(--rose); }
  .co-apply { padding:0 20px; border-radius:4px; cursor:pointer; border:1px solid var(--ink); background:var(--ink); color:#fff; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.18em; text-transform:uppercase; transition:opacity .2s; }
  .co-apply:disabled { opacity:.45; cursor:not-allowed; }
  .co-remove { margin-top:12px; background:none; border:none; cursor:pointer; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--rose-d); text-decoration:underline; }
  .co-err { font-size:12px; color:var(--rose-d); margin-top:10px; }
  .co-pay { width:100%; margin-top:24px; padding:16px; border:none; border-radius:4px; cursor:pointer; background:var(--brand-grad); color:#fff; font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; box-shadow:0 18px 34px -16px rgba(212,90,121,.8); transition:letter-spacing .2s, transform .2s, background .2s, opacity .2s; }
  .co-pay:hover:not(:disabled) { background:var(--rose-d); letter-spacing:.26em; transform:translateY(-2px); }
  .co-pay:disabled { opacity:.55; cursor:not-allowed; }
  .co-secure { display:flex; align-items:center; justify-content:center; gap:7px; margin-top:14px; font-family:'Space Mono',monospace; font-size:8px; letter-spacing:.14em; text-transform:uppercase; color:var(--faint); }

  /* ── Confirmation ───────────────────────────────────────────── */
  .conf-wrap { max-width:520px; margin:0 auto; text-align:center; padding:80px 40px; }
  .conf-icon { width:84px; height:84px; margin:0 auto 24px; border-radius:20px; display:grid; place-items:center; font-size:40px; background:var(--brand-grad); box-shadow:0 26px 54px -18px rgba(212,90,121,.7); }
  .conf-title { font-family:'Fraunces',serif; font-size:clamp(36px,5vw,52px); font-weight:300; color:var(--ink); margin-bottom:8px; line-height:1; }
  .conf-title em { font-style:italic; font-weight:400; background:var(--brand-grad); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .conf-sub { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--faint); margin-bottom:34px; }
  .conf-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:8px 24px; box-shadow:0 34px 80px -56px rgba(26,20,22,.5); text-align:left; }
  .conf-row { display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid var(--hair); font-size:13px; color:var(--sub); }
  .conf-row:last-child { border-bottom:none; }
  .conf-row span:last-child { color:var(--ink); font-weight:500; }
  .conf-countdown { margin-top:28px; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--faint); }
  .conf-btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; margin-top:20px; padding:15px 34px; background:var(--brand-grad); color:#fff; font-family:'Space Mono',monospace; font-size:9px; font-weight:400; letter-spacing:.2em; text-transform:uppercase; border:none; cursor:pointer; border-radius:4px; text-decoration:none; box-shadow:0 18px 34px -16px rgba(212,90,121,.8); transition:transform .2s, background .2s, letter-spacing .2s; }
  .conf-btn:hover { background:var(--rose-d); transform:translateY(-2px); letter-spacing:.26em; }

  /* ── Responsive ─────────────────────────────────────────────── */
  @media(max-width:900px) {
    .plans-page::before { display:none; }
    .duration-tabs { flex-wrap:wrap; justify-content:center; }
    .dur-btn { min-width:112px; }
    .trust-item { border-left:none; flex:1 1 100%; justify-content:flex-start; padding:12px 8px; border-top:1px solid var(--hair); }
    .trust-item:first-child { border-top:none; }
  }
  @media(max-width:640px) {
    .plans-head { padding:64px 22px 0; }
    .plans-grid { grid-template-columns:1fr; padding:8px 22px 0; margin-top:38px; }
    .plan-card { padding:30px 26px 28px; }
    .dur-btn { flex:1 1 42%; min-width:0; }
    .plan-price .amt { font-size:48px; }
  }
`;