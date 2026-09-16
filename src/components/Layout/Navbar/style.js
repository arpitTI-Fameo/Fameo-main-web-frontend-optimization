export const S = `
  :root {
    --mn-ink:      #16130F;
    --mn-ink2:     #3a352d;
    --mn-muted:    #8B8781;

    /* ── warm palette ── */
    --mn-rose-l:   #FFC98F;   /* peach */
    --mn-rose:     #DD8164;   /* coral */
    --mn-rose-d:   #D45A79;   /* rose */

    /* accent used for active underlines, top bar, avatar glow */
    --mn-accent:   #D45A79;
    --mn-accent-d: #C24E74;
    --mn-accent-l: #DD8164;

    --mn-line:     rgba(20,15,10,0.12);
    --mn-surface:  rgba(20,15,10,0.05);
    --mn-ease:     cubic-bezier(.22,1,.36,1);

    /* keep old variable names for compatibility, but reassign values */
    --mn-lime:     var(--mn-accent);
    --mn-lime-d:   var(--mn-accent-d);
  }

  /* ── wrapper: hide on scroll-down ── */
  .mn-wrap {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    padding: 14px 18px 0;
    padding-left: max(18px, env(safe-area-inset-left));
    padding-right: max(18px, env(safe-area-inset-right));
    transition: transform .45s var(--mn-ease);
    transform: translateY(0);
  }
  .mn-wrap.hide { transform: translateY(-140%); }

  /* ── bar: transparent → frosted capsule ── */
  .mn-bar {
    max-width: 1500px; margin: 0 auto;
    height: 62px; padding: 0 12px 0 22px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; border-radius: 4px;
    background: transparent;
    transition:
      height .4s var(--mn-ease),
      background .5s var(--mn-ease),
      box-shadow .5s var(--mn-ease),
      backdrop-filter .5s var(--mn-ease),
      border-radius .5s var(--mn-ease);
  }
  .mn-bar.solid {
    height: 56px;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(22px) saturate(1.7);
    -webkit-backdrop-filter: blur(22px) saturate(1.7);
    box-shadow:
      0 1px 0 rgba(255,255,255,0.6) inset,
      0 10px 40px rgba(20,15,10,0.10);
    border-radius: 6px;
  }

  /* thin accent line that draws across the top when solid */
  .mn-topbar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--mn-accent), transparent);
    transform: scaleX(0); transform-origin: 50% 50%;
    transition: transform .6s var(--mn-ease), opacity .4s;
    opacity: 0; z-index: 1; border-radius: 6px 6px 0 0;
  }
  .mn-bar.solid .mn-topbar { transform: scaleX(1); opacity: 1; }
  .mn-bottomline { display: none; }

  /* ── Logo ── */
  .mn-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; flex-shrink: 0; }
  .mn-logo-img {
    height: 30px; width: auto; display: block; object-fit: contain;
    filter: brightness(0) invert(1);          /* white over dark hero */
    transition: filter .45s var(--mn-ease);
  }
  .mn-logo-img.mn-logo-dark {
    height: 46px; /* Scaled up to counteract padding in the dark logo asset */
  }
  .mn-bar.solid .mn-logo-img,
  .mn-bar.light .mn-logo-img { filter: none; } /* original colors on white */
  .mn-logo-rule {
    width: 1px; height: 22px; flex-shrink: 0;
    background: linear-gradient(to bottom,transparent,rgba(255,255,255,0.35),transparent);
    transition: background .45s var(--mn-ease);
  }
  .mn-bar.solid .mn-logo-rule,
  .mn-bar.light .mn-logo-rule {
    background: linear-gradient(to bottom,transparent,var(--mn-line),transparent);
  }
  .mn-logo-sub {
    font-family: 'Space Mono', monospace;
    font-size: 8px; font-weight: 400; letter-spacing: .28em; text-transform: uppercase;
    color: rgba(255,255,255,0.6); transition: color .45s var(--mn-ease);
    white-space: nowrap;
  }
  .mn-bar.solid .mn-logo-sub,
  .mn-bar.light .mn-logo-sub { color: var(--mn-muted); }

  /* ── Center links with sliding pill hover ── */
  .mn-links { display: flex; align-items: center; gap: 4px; list-style: none; }
  .mn-link {
    font-family: 'Space Mono', monospace;
    font-size: 11px; font-weight: 400; letter-spacing: .1em; text-transform: uppercase;
    padding: 9px 15px; border-radius: 4px;
    color: rgba(255,255,255,0.72); text-decoration: none;
    position: relative; isolation: isolate;
    transition: color .25s var(--mn-ease);
    white-space: nowrap;
  }
  /* the pill that grows behind on hover */
  .mn-link::before {
    content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 4px;
    background: rgba(255,255,255,0.12);
    transform: scale(.7); opacity: 0;
    transition: transform .3s var(--mn-ease), opacity .3s var(--mn-ease);
  }
  .mn-link:hover { color: #fff; }
  .mn-link:hover::before { transform: scale(1); opacity: 1; }
  /* active underline that wipes in */
  .mn-link.active { color: #fff; }
  .mn-link.active::after {
    content: ''; position: absolute; left: 15px; right: 15px; bottom: 4px; height: 1.5px;
    background: var(--mn-accent);
    border-radius: 2px;
    animation: mnUnderline .4s var(--mn-ease);
  }
  @keyframes mnUnderline { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  .mn-bar.solid .mn-link,
  .mn-bar.light .mn-link { color: var(--mn-muted); }
  .mn-bar.solid .mn-link::before,
  .mn-bar.light .mn-link::before { background: var(--mn-surface); }
  .mn-bar.solid .mn-link:hover,
  .mn-bar.light .mn-link:hover { color: var(--mn-ink); }
  .mn-bar.solid .mn-link.active,
  .mn-bar.light .mn-link.active { color: var(--mn-ink); }

  .mn-dot {
    width: 3px; height: 3px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,255,255,0.25); transition: background .45s var(--mn-ease);
  }
  .mn-bar.solid .mn-dot,
  .mn-bar.light .mn-dot { background: var(--mn-line); }

  /* ── Right cluster ── */
  .mn-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .mn-vdiv {
    width: 1px; height: 22px; flex-shrink: 0;
    background: rgba(255,255,255,0.2); transition: background .45s var(--mn-ease);
  }
  .mn-bar.solid .mn-vdiv,
  .mn-bar.light .mn-vdiv { background: var(--mn-line); }

  /* ── Login — outlined, monospace ── */
  .mn-login {
    font-family: 'Space Mono', monospace;
    font-size: 11px; font-weight: 400; letter-spacing: .1em; text-transform: uppercase;
    padding: 9px 18px; background: none;
    border: 1.5px solid rgba(255,255,255,0.32);
    color: rgba(255,255,255,0.85); cursor: pointer; border-radius: 4px;
    transition: border-color .25s, color .25s, background .25s, transform .12s var(--mn-ease);
    text-decoration: none; display: inline-flex; align-items: center; white-space: nowrap;
  }
  .mn-login:hover { border-color: rgba(255,255,255,0.85); color: #fff; background: rgba(255,255,255,0.1); }
  .mn-login:active { transform: scale(.95); }
  .mn-login:focus-visible { outline: 2px solid var(--mn-accent); outline-offset: 3px; }
  .mn-bar.solid .mn-login,
  .mn-bar.light .mn-login { border-color: var(--mn-line); color: var(--mn-ink2); }
  .mn-bar.solid .mn-login:hover,
  .mn-bar.light .mn-login:hover { border-color: var(--mn-ink); color: var(--mn-ink); background: var(--mn-surface); }

  /* ── Register — rose gradient blob ── */
  .mn-register {
    font-family: 'Space Mono', monospace;
    font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: 11px 22px; color: #fff; cursor: pointer;
    background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
    border: none; text-decoration: none;
    display: inline-flex; align-items: center; position: relative; overflow: hidden;
    border-radius: 46% 54% 52% 48% / 58% 52% 48% 42%;   /* organic blob */
    box-shadow: 0 6px 20px rgba(212,90,121,0.45);
    transition: transform .18s var(--mn-ease), box-shadow .25s, border-radius .5s var(--mn-ease);
    white-space: nowrap;
  }
  /* sheen sweep on hover */
  .mn-register::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%);
    transform: translateX(-160%); transition: transform .7s var(--mn-ease);
  }
  .mn-register:hover {
    transform: translateY(-1px) scale(1.03);
    box-shadow: 0 10px 30px rgba(212,90,121,0.65);
    border-radius: 52% 48% 46% 54% / 48% 58% 42% 52%;
  }
  .mn-register:hover::after { transform: translateX(160%); }
  .mn-register:active { transform: scale(.96); }
  .mn-register:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

  /* ── Dropdown (shared with UserMenu) ── */
  .mn-dropdown {
    position: absolute; top: calc(100% + 12px); right: 0;
    width: 252px; background: #fff;
    border: 1px solid var(--mn-line); border-radius: 10px;
    box-shadow: 0 24px 60px rgba(20,15,10,0.18), 0 8px 24px rgba(0,0,0,0.06);
    overflow: hidden; z-index: 1000;
    animation: mnDrop .22s var(--mn-ease);
  }
  @keyframes mnDrop { from { opacity:0; transform:translateY(-8px) scale(.98);} to { opacity:1; transform:translateY(0) scale(1);} }
  .mn-dd-head {
    padding: 15px 18px; background: #F7F5F0;
    border-bottom: 1px solid var(--mn-line);
    display: flex; align-items: flex-start; gap: 11px;
  }
  .mn-dd-av {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--mn-accent);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 15px; font-weight: 700; flex-shrink: 0;
    font-family: 'Schibsted Grotesk', sans-serif; overflow: hidden;
  }
  .mn-dd-av-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
  .mn-dd-name  { font-size:13px; font-weight:600; color:var(--mn-ink); line-height:1.3; font-family:'Schibsted Grotesk',sans-serif; }
  .mn-dd-email { font-size:11px; color:var(--mn-muted); margin-top:2px; font-family:'Space Mono',monospace; letter-spacing:.02em; }
  .mn-dd-items { padding: 6px 0; }
  .mn-dd-item {
    width:100%; display:flex; align-items:center; gap:11px; padding:10px 18px; text-align:left;
    background:transparent; border:none; cursor:pointer;
    font-size:12.5px; font-weight:400; color:var(--mn-ink2);
    text-decoration:none; font-family:'Schibsted Grotesk',sans-serif;
    transition: color .15s, background .15s, padding-left .2s var(--mn-ease);
  }
  .mn-dd-item:hover { color:var(--mn-ink); background:var(--mn-surface); padding-left:22px; }
  .mn-dd-item:focus-visible { outline: 2px solid var(--mn-accent); outline-offset: -2px; }
  .mn-dd-item span { font-size:14px; width:18px; text-align:center; flex-shrink:0; }
  .mn-dd-divider { height:1px; background:var(--mn-line); margin:4px 0; }
  .mn-dd-signout {
    width:100%; display:flex; align-items:center; gap:11px; padding:10px 18px; text-align:left;
    background:transparent; border:none; cursor:pointer;
    font-size:12.5px; font-weight:400; color:#c23a3a; font-family:'Schibsted Grotesk',sans-serif;
    transition: color .15s, background .15s, padding-left .2s var(--mn-ease);
  }
  .mn-dd-signout:hover { color:#9c2020; background:rgba(194,58,58,0.06); padding-left:22px; }
  .mn-dd-signout:focus-visible { outline: 2px solid #c23a3a; outline-offset: -2px; }

  /* ── Hamburger — mobile only, but ALWAYS mounted ── */
  .mn-hbg {
    display: none;                      /* shown from 900px down */
    align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 4px;
    background: none; border: 1.5px solid rgba(255,255,255,0.32);
    cursor: pointer; color: rgba(255,255,255,0.9); flex-shrink: 0;
    transition: border-color .25s, background .25s, color .25s, transform .12s var(--mn-ease);
  }
  .mn-hbg:hover { border-color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.1); color:#fff; }
  .mn-hbg:active { transform: scale(.92); }
  .mn-hbg:focus-visible { outline: 2px solid var(--mn-accent); outline-offset: 3px; }
  .mn-bar.solid .mn-hbg,
  .mn-bar.light .mn-hbg { border-color: var(--mn-line); color: var(--mn-ink); }
  .mn-bar.solid .mn-hbg:hover,
  .mn-bar.light .mn-hbg:hover { border-color: var(--mn-ink); background: var(--mn-surface); }

  /* ── Mobile backdrop + drawer ── */
  .mn-backdrop {
    display: none; position: fixed; inset: 0; z-index: 1001;
    background: rgba(20,15,10,0.5); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  }
  .mn-backdrop.open { display: block; animation: mnFadeIn .25s ease; }
  @keyframes mnFadeIn { from{opacity:0;} to{opacity:1;} }

  .mn-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 1002;
    width: min(330px,88vw); background: #fff;
    border-left: 1px solid var(--mn-line);
    transform: translateX(100%);
    display: flex; flex-direction: column;
    box-shadow: -24px 0 80px rgba(20,15,10,0.16);
    /* hidden while closed so it is not tabbable and adds no scroll width;
       the visibility flip is delayed so the slide-out still animates */
    visibility: hidden;
    transition: transform .4s var(--mn-ease), visibility 0s .4s;
  }
  .mn-drawer.open {
    transform: translateX(0);
    visibility: visible;
    transition: transform .4s var(--mn-ease), visibility 0s;
  }
  .mn-dr-head {
    padding: 0 22px; height: 62px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--mn-line); flex-shrink: 0; position: relative;
  }
  .mn-dr-head::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--mn-accent); }
  .mn-dr-logo-img { height: 28px; width: auto; display: block; object-fit: contain; }
  .mn-dr-logo-img.mn-dr-logo-dark { height: 42px; }
  .mn-dr-close {
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--mn-line); border-radius: 4px; background: none; cursor: pointer;
    color: var(--mn-ink2); transition: border-color .2s, color .2s, background .2s;
  }
  .mn-dr-close:hover { border-color:var(--mn-ink); color:var(--mn-ink); background:var(--mn-surface); }
  .mn-dr-links { flex: 1; overflow-y: auto; padding: 12px 0; -webkit-overflow-scrolling: touch; }
  .mn-dr-link {
    display: flex; align-items: center; gap: 12px; padding: 14px 24px;
    font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 400;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--mn-muted); text-decoration: none; border-left: 2px solid transparent;
    transition: color .18s, border-color .18s, background .18s, padding-left .2s var(--mn-ease);
  }
  .mn-dr-link:hover { color:var(--mn-ink); background:var(--mn-surface); padding-left:28px; }
  .mn-dr-link.active { color:var(--mn-ink); border-left-color:var(--mn-accent); background:var(--mn-surface); }
  .mn-dr-divider { height:1px; background:var(--mn-line); margin:8px 24px; }
  .mn-dr-foot {
    padding: 20px 24px; padding-bottom: max(20px, env(safe-area-inset-bottom));
    border-top: 1px solid var(--mn-line); background: #F7F5F0; flex-shrink: 0;
  }
  .mn-dr-foot-id { display:flex; align-items:center; gap:11px; margin-bottom:14px; }
  .mn-dr-foot-av {
    width:36px; height:36px; border-radius:50%; flex-shrink:0; overflow:hidden;
    display:flex; align-items:center; justify-content:center;
    background: linear-gradient(135deg,var(--mn-rose-l),var(--mn-rose) 52%,var(--mn-rose-d));
    color:#fff; font-size:13px; font-weight:700; font-family:'Schibsted Grotesk',sans-serif;
  }
  .mn-dr-foot-av img { width:100%; height:100%; object-fit:cover; display:block; }
  .mn-dr-foot-name  { font-size:13px; font-weight:600; color:var(--mn-ink); font-family:'Schibsted Grotesk',sans-serif; }
  .mn-dr-foot-email {
    font-size:11px; color:var(--mn-muted); font-family:'Space Mono',monospace;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;
  }
  .mn-dr-signout {
    font-family:'Space Mono',monospace; font-size:10px; font-weight:700;
    letter-spacing:.12em; text-transform:uppercase;
    color:#c23a3a; background:none; border:none; cursor:pointer; padding:0;
  }

  /* ── Responsive ─────────────────────────────────────────────── */
  @media(max-width:1100px) {
    .mn-bar { padding: 0 10px 0 16px; }
    .mn-link { padding: 9px 11px; letter-spacing: .06em; }
  }

  /* below 900px the center links are gone, so the hamburger MUST appear —
     it is the only route to Products / Resources / Community / Plans */
  @media(max-width:900px) {
    .mn-wrap { padding: 10px 12px 0; }
    .mn-links { display: none; }
    .mn-hbg { display: flex; }
    .mn-logo-rule, .mn-logo-sub { display: none; }
  }

  @media(max-width:480px) {
    .mn-bar { height: 56px; padding: 0 8px 0 12px; }
    .mn-bar.solid { height: 52px; }
    .mn-right { gap: 8px; }
    .mn-vdiv { display: none; }
    .mn-logo-img { height: 26px; }
    .mn-login    { padding: 8px 12px; font-size: 10px; letter-spacing: .06em; }
    .mn-register { padding: 9px 15px; font-size: 10px; letter-spacing: .06em; }
    .mn-hbg { width: 40px; height: 40px; }
    .mn-dropdown { width: min(268px, calc(100vw - 24px)); }
  }

  @media(prefers-reduced-motion: reduce) {
    .mn-wrap, .mn-bar, .mn-drawer, .mn-dropdown,
    .mn-link, .mn-login, .mn-register, .mn-hbg { transition: none; animation: none; }
  }
`;