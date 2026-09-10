export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root{
    --sc-p1:#8F2793; --sc-p2:#D53B7E; --sc-p3:#A33A8E;
    --sc-grad:linear-gradient(135deg,#8F2793 0%,#A33A8E 50%,#D53B7E 100%);
    --sc-grad-btn:linear-gradient(135deg,#8F2793 0%,#D53B7E 100%);
    --sc-line:rgba(163,58,142,0.18);
  }

  .sc-root{
    position:relative; overflow:hidden;
    background:#0f0614; color:#fff;
    font-family:'DM Sans',sans-serif;
    min-height:100vh;
  }
  .sc-topline{ position:absolute; top:0; left:0; right:0; height:2px;
    background:var(--sc-grad); z-index:2; pointer-events:none; }
  .sc-glow{ position:absolute; border-radius:50%; pointer-events:none; z-index:0; }
  .sc-glow1{ top:-140px; left:-100px; width:520px; height:520px;
    background:radial-gradient(circle,rgba(143,39,147,0.20) 0%,transparent 65%); }
  .sc-glow2{ top:520px; right:-120px; width:480px; height:480px;
    background:radial-gradient(circle,rgba(213,59,126,0.16) 0%,transparent 65%); }

  .sc-inner{
    position:relative; z-index:1;
    max-width:920px; margin:0 auto;
    padding:clamp(104px,12vw,150px) 22px 96px;
  }

  .sc-eyebrow{
    display:inline-block;
    font-size:10px; letter-spacing:.3em; text-transform:uppercase;
    font-weight:600; color:var(--sc-p2); margin-bottom:14px;
  }

  /* ── Hero ── */
  .sc-hero{ text-align:center; margin-bottom:56px; }
  .sc-h1{
    font-family:'Syne',sans-serif; font-weight:800;
    font-size:clamp(34px,6vw,58px); line-height:1.04;
    letter-spacing:-.02em; margin:0 0 18px;
    background:linear-gradient(180deg,#fff 30%,rgba(255,255,255,0.72) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .sc-lead{
    font-size:clamp(14px,1.6vw,16px); font-weight:300; line-height:1.75;
    color:rgba(255,255,255,0.6); max-width:560px; margin:0 auto;
  }
  .sc-hero-actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:30px; }

  .sc-btn-primary{
    display:inline-flex; align-items:center; gap:9px;
    padding:13px 24px; border-radius:9px; border:none;
    background:var(--sc-grad-btn); color:#fff;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:.02em;
    text-decoration:none; cursor:pointer;
    transition:filter .2s, box-shadow .2s, transform .2s;
  }
  .sc-btn-primary:hover{ filter:brightness(1.08); box-shadow:0 8px 30px rgba(213,59,126,0.4); transform:translateY(-1px); }

  .sc-btn-ghost{
    display:inline-flex; align-items:center; gap:8px;
    padding:13px 22px; border-radius:9px;
    border:1px solid var(--sc-line); background:rgba(255,255,255,0.03);
    color:rgba(255,255,255,0.78);
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    text-decoration:none; cursor:pointer;
    transition:border-color .2s, color .2s, background .2s;
  }
  .sc-btn-ghost:hover{ border-color:rgba(213,59,126,0.45); color:#fff; background:rgba(213,59,126,0.08); }

  /* ── Channels ── */
  .sc-channels{
    display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:64px;
  }
  .sc-channel{
    display:flex; flex-direction:column; align-items:flex-start; gap:8px;
    padding:22px; border-radius:14px;
    border:1px solid var(--sc-line); background:rgba(255,255,255,0.025);
  }
  .sc-channel-icon{
    width:38px; height:38px; border-radius:10px; margin-bottom:4px;
    display:flex; align-items:center; justify-content:center;
    background:rgba(143,39,147,0.16); border:1px solid rgba(163,58,142,0.28);
    color:var(--sc-p2);
  }
  .sc-channel-label{ font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,0.4); font-weight:600; }
  .sc-channel-value{ font-size:14px; font-weight:500; color:#fff; text-decoration:none; word-break:break-word; }
  a.sc-channel-value:hover{ color:var(--sc-p2); }

  /* ── Form ── */
  .sc-form-wrap{ margin-bottom:72px; scroll-margin-top:96px; }
  .sc-form-card{
    position:relative; overflow:hidden;
    border:1px solid rgba(163,58,142,0.2); border-radius:20px;
    background:#100418;
    padding:clamp(26px,4vw,44px);
    box-shadow:0 30px 90px rgba(0,0,0,0.5);
  }
  .sc-card-topline{ position:absolute; top:0; left:0; right:0; height:2px; background:var(--sc-grad); }
  .sc-form-head{ margin-bottom:26px; }
  .sc-h2{
    font-family:'Syne',sans-serif; font-weight:700;
    font-size:clamp(22px,3vw,30px); line-height:1.15; letter-spacing:-.01em;
    margin:0 0 10px; color:#fff;
  }
  .sc-form-sub{ font-size:14px; font-weight:300; color:rgba(255,255,255,0.5); margin:0; line-height:1.6; }

  .sc-form{ display:flex; flex-direction:column; gap:18px; }
  .sc-row{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .sc-field{ display:flex; flex-direction:column; gap:8px; }
  .sc-label{ font-size:12px; font-weight:500; color:rgba(255,255,255,0.62); letter-spacing:.01em; }
  .sc-opt{ color:rgba(255,255,255,0.3); font-weight:400; }

  .sc-field input,
  .sc-field textarea,
  .sc-select select{
    width:100%;
    padding:13px 15px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(163,58,142,0.22);
    border-radius:10px;
    color:#fff; font-size:14px; font-family:'DM Sans',sans-serif;
    outline:none;
    transition:border-color .18s, background .18s, box-shadow .18s;
  }
  .sc-field textarea{ resize:vertical; min-height:130px; line-height:1.6; }
  .sc-field input::placeholder,
  .sc-field textarea::placeholder{ color:rgba(255,255,255,0.28); }
  .sc-field input:focus,
  .sc-field textarea:focus,
  .sc-select select:focus{
    border-color:rgba(213,59,126,0.55);
    background:rgba(255,255,255,0.06);
    box-shadow:0 0 0 3px rgba(213,59,126,0.12);
  }

  .sc-select{ position:relative; }
  .sc-select select{ appearance:none; -webkit-appearance:none; cursor:pointer; padding-right:40px; }
  .sc-select option{ background:#160a1e; color:#fff; }
  .sc-chev{ position:absolute; right:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.45); pointer-events:none; }

  /* honeypot — visually hidden */
  .sc-hp{ position:absolute; left:-9999px; width:1px; height:1px; opacity:0; }

  .sc-error{
    margin:0; font-size:13px; color:#ff9bbf;
    background:rgba(213,59,126,0.1); border:1px solid rgba(213,59,126,0.3);
    padding:11px 14px; border-radius:9px;
  }

  .sc-form-foot{ display:flex; align-items:center; gap:18px; flex-wrap:wrap; margin-top:4px; }
  .sc-submit{
    padding:14px 30px; border:none; border-radius:10px;
    background:var(--sc-grad-btn); color:#fff;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; letter-spacing:.02em;
    cursor:pointer;
    transition:filter .2s, box-shadow .2s, transform .2s;
  }
  .sc-submit:hover:not(:disabled){ filter:brightness(1.08); box-shadow:0 8px 30px rgba(213,59,126,0.4); transform:translateY(-1px); }
  .sc-submit:disabled{ opacity:.6; cursor:wait; }
  .sc-foot-note{ font-size:12.5px; color:rgba(255,255,255,0.42); }
  .sc-foot-note a{ color:var(--sc-p2); text-decoration:none; }
  .sc-foot-note a:hover{ text-decoration:underline; }

  /* success */
  .sc-success{ text-align:center; padding:18px 8px 6px; }
  .sc-success-tick{
    width:58px; height:58px; border-radius:50%; margin:0 auto 18px;
    display:flex; align-items:center; justify-content:center;
    background:rgba(143,39,147,0.15); border:1px solid rgba(213,59,126,0.4);
    color:var(--sc-p2);
  }
  .sc-success h3{ font-family:'Syne',sans-serif; font-size:22px; font-weight:700; margin:0 0 10px; color:#fff; }
  .sc-success p{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.65; max-width:420px; margin:0 auto 22px; }

  /* ── FAQ ── */
  .sc-faq{ margin-bottom:72px; }
  .sc-faq-head{ text-align:center; margin-bottom:30px; }
  .sc-faq-list{ display:flex; flex-direction:column; gap:10px; }
  .sc-faq-item{
    border:1px solid var(--sc-line); border-radius:13px;
    background:rgba(255,255,255,0.025); overflow:hidden;
    transition:border-color .2s, background .2s;
  }
  .sc-faq-item.open{ border-color:rgba(213,59,126,0.35); background:rgba(213,59,126,0.05); }
  .sc-faq-q{
    width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px;
    padding:18px 20px; background:none; border:none; cursor:pointer; text-align:left;
    color:#fff; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500;
  }
  .sc-faq-mark{
    flex-shrink:0; width:28px; height:28px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid var(--sc-line); color:var(--sc-p2);
    transition:transform .25s ease, background .2s;
  }
  .sc-faq-item.open .sc-faq-mark{ transform:rotate(45deg); background:rgba(213,59,126,0.12); }
  .sc-faq-a{ padding:0 20px 20px; }
  .sc-faq-a p{ margin:0; font-size:14px; font-weight:300; line-height:1.75; color:rgba(255,255,255,0.62); max-width:680px; }

  /* ── Closing ── */
  .sc-closing{ text-align:center; border-top:1px solid var(--sc-line); padding-top:52px; }
  .sc-closing p{ font-size:14px; color:rgba(255,255,255,0.55); line-height:1.7; max-width:480px; margin:0 auto 24px; }

  /* ── Responsive ── */
  @media (max-width:680px){
    .sc-channels{ grid-template-columns:1fr; }
    .sc-row{ grid-template-columns:1fr; }
    .sc-form-foot{ flex-direction:column; align-items:stretch; }
    .sc-submit{ width:100%; }
    .sc-foot-note{ text-align:center; }
  }

  @media (prefers-reduced-motion:reduce){
    .sc-btn-primary, .sc-btn-ghost, .sc-submit, .sc-faq-mark{ transition:none; }
  }
`;
