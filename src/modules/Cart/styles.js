export const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
    :root {
      --white:#fff; --snow:#fafafa; --soft:#f4f4f6;
      --border:rgba(0,0,0,0.08); --ink:#181820;
      --ink-soft:#444450; --ink-muted:#9898a8;
      --pink:#e8457a; --pink-pale:#fde8f0; --pink-deep:#c02060;
      --green:#2eaa68; --red:#e05050;
    }
    .cart-page { max-width:1200px; margin:0 auto; padding:100px 56px 80px; font-family:'Jost',sans-serif; background:#fff; min-height:100vh; }
    .cart-head { padding-bottom:22px; border-bottom:1px solid var(--border); margin-bottom:36px; }
    .cart-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,5vw,58px); font-weight:300; color:var(--ink); }
    .cart-title em { font-style:italic; color:var(--pink); }
    .cart-sub { font-size:10px; font-weight:300; letter-spacing:.22em; text-transform:uppercase; color:var(--ink-muted); margin-top:5px; }
    .cart-body { display:grid; grid-template-columns:1fr 360px; gap:48px; align-items:start; }
    .plan-strip { display:flex; align-items:center; gap:10px; padding:11px 16px; border:1px solid var(--border); background:var(--snow); margin-bottom:28px; border-radius:2px; }
    .plan-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
    .plan-strip-text { font-size:10px; font-weight:300; letter-spacing:.16em; text-transform:uppercase; color:var(--ink-muted); }
    .plan-strip-badge { font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; padding:3px 10px; border:1px solid; }
    .cart-items { display:flex; flex-direction:column; }
    .cart-empty { text-align:center; padding:80px 0; }
    .cart-empty-icon { font-size:52px; margin-bottom:18px; }
    .cart-empty-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:300; color:var(--ink); margin-bottom:8px; }
    .cart-empty-sub { font-size:13px; color:var(--ink-muted); margin-bottom:28px; font-weight:300; }
    .cart-summary { background:#fff; border:1px solid var(--border); padding:28px 24px; position:sticky; top:80px; border-radius:2px; }
    .cart-summary-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:var(--ink); margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid var(--border); }
    .sum-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:12px; font-weight:300; color:var(--ink-muted); }
    .sum-row span:last-child { color:var(--ink); font-size:13px; }
    .sum-discount-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:12px; font-weight:300; }
    .sum-discount-label { display:flex; align-items:center; gap:6px; color:var(--ink-muted); }
    .sum-discount-val { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:400; color:var(--pink); }
    .sum-total { display:flex; justify-content:space-between; align-items:baseline; padding:14px 0 0; font-size:13px; font-weight:400; color:var(--ink); }
    .sum-total span:last-child { font-family:'Cormorant Garamond',serif; font-size:26px; }
    .sum-free { font-size:10px; font-weight:300; letter-spacing:.12em; text-transform:uppercase; color:var(--green); margin:8px 0 0; }
    .upgrade-box { margin-top:14px; padding:14px; background:var(--pink-pale); border:1px solid rgba(232,69,122,.2); border-radius:3px; }
    .upgrade-text { font-size:12px; font-weight:300; color:var(--ink-soft); line-height:1.65; margin-bottom:10px; }
    .upgrade-amt { font-family:'Cormorant Garamond',serif; font-size:20px; color:var(--pink-deep); font-weight:500; }
    .upgrade-btn { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; padding:10px; background:linear-gradient(135deg,var(--pink-deep),var(--pink)); color:#fff; font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; border:none; cursor:pointer; border-radius:2px; text-decoration:none; transition:opacity .2s; }
    .upgrade-btn:hover { opacity:.9; }
    .promo-row { display:flex; margin:18px 0; }
    .promo-inp { flex:1; padding:11px 14px; border:1px solid var(--border); border-right:none; background:var(--snow); font-family:'Jost',sans-serif; font-size:11px; color:var(--ink); outline:none; transition:border-color .2s; }
    .promo-inp:focus { border-color:var(--pink); }
    .promo-inp::placeholder { color:var(--ink-muted); }
    .promo-btn { padding:11px 16px; border:1px solid var(--border); background:var(--ink); color:#fff; font-family:'Jost',sans-serif; font-size:10px; letter-spacing:.16em; text-transform:uppercase; cursor:pointer; transition:background .2s; white-space:nowrap; }
    .promo-btn:hover { background:var(--pink); border-color:var(--pink); }
    .btn-ink { width:100%; padding:15px; margin-bottom:10px; background:var(--ink); color:#fff; font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.22em; text-transform:uppercase; border:1px solid var(--ink); cursor:pointer; transition:all .25s; display:flex; align-items:center; justify-content:center; text-decoration:none; }
    .btn-ink:hover { background:var(--pink); border-color:var(--pink); }
    .btn-line { width:100%; padding:15px; background:transparent; color:var(--ink); font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; border:1px solid var(--border); cursor:pointer; transition:all .25s; display:flex; align-items:center; justify-content:center; text-decoration:none; }
    .btn-line:hover { border-color:var(--ink); }
    .cart-trust { margin-top:16px; display:flex; flex-direction:column; gap:8px; }
    .cart-trust-item { font-size:10px; font-weight:300; color:var(--ink-muted); display:flex; align-items:center; gap:8px; }
    @media(max-width:900px) { .cart-page { padding:90px 20px 60px; } .cart-body { grid-template-columns:1fr; } .cart-summary { position:static; } }
  `;