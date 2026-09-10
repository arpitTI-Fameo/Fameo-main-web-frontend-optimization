/* ─────────────────────────────────────────────────────────────
   STYLES — premium cream ("parchment & gold") theme
───────────────────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#FAF6F0;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}

.rp{
  --bg:#FAF6F0; --bg-soft:#FAF6F0; --card:#FFFDF8;
  --ink:#2A1E14; --dim:rgba(42,30,20,.62); --faint:rgba(42,30,20,.40);
  --gold:#B0894E; --gold-l:#C9A96E;
  --rose:#C24E74;
  --grad:linear-gradient(135deg,#D65B7A 0%,#BE4C86 52%,#8A57A8 100%);
  --line:rgba(42,30,20,.12);
  --shadow:none;
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'DM Sans',-apple-system,sans-serif;
  --ease:cubic-bezier(.22,1,.36,1);
  background:var(--bg);color:var(--ink);font-family:var(--sans);
  overflow-x:hidden;min-height:100vh;position:relative;
}
.rp ::selection{background:rgba(194,78,116,.22)}
.rp-section{max-width:1320px;margin:0 auto;padding:0 48px}
.rp-eyebrow{display:flex;align-items:center;gap:16px;color:var(--gold);font-size:10.5px;letter-spacing:.34em;font-weight:700;text-transform:uppercase;margin-bottom:30px}
.rp-eyebrow::after{content:'';flex:1;height:1px;background:var(--line)}

/* ---------- SPLIT HERO ---------- */
.rp-hero{position:relative;max-width:1440px;margin:0 auto;padding:132px 48px 70px;
  display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center;min-height:120vh}
.rp-kicker{display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.4em;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:24px;
  opacity:0;animation:rpFade 1s var(--ease) .2s forwards}
.rp-kicker::before{content:'';width:34px;height:1.5px;background:var(--gold)}
.rp-h1{font-family:var(--serif);font-weight:500;font-size:clamp(46px,5.4vw,84px);line-height:1.02;letter-spacing:-.01em}
.rp-h1 .line{display:block;overflow:hidden}
.rp-h1 .line span{display:block;transform:translateY(115%);animation:rpRise 1.15s var(--ease) forwards}
.rp-h1 .line:nth-child(2) span{animation-delay:.14s}
.rp-h1 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
@keyframes rpRise{to{transform:translateY(0)}}
@keyframes rpFade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.rp-sub{margin-top:22px;color:var(--dim);font-size:16px;line-height:1.75;max-width:460px;font-weight:400;
  opacity:0;animation:rpFade 1s var(--ease) .65s forwards}
.rp-goal{margin-top:36px;opacity:0;animation:rpFade 1s var(--ease) .9s forwards}
.rp-goal-t{font-size:11.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin-bottom:14px}
.rp-goal-t::before{content:'';display:block;width:34px;height:3px;background:var(--grad);border-radius:2px;margin-bottom:14px}
.rp-goal-list{display:flex;flex-direction:column;gap:9px;max-width:460px}
.rp-goal-item{display:flex;align-items:center;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:13px;
  padding:14px 18px;cursor:pointer;font-size:14px;color:var(--dim);font-weight:500;transition:all .35s var(--ease)}
.rp-goal-item:hover{border-color:rgba(194,78,116,.4);color:var(--ink);transform:translateX(6px)}
.rp-goal-item .box{width:19px;height:19px;border-radius:6px;border:1.5px solid rgba(42,30,20,.25);display:grid;place-items:center;
  transition:all .3s var(--ease);flex-shrink:0;font-size:11px;color:#fff}
.rp-goal-item .box::after{content:'✓';opacity:0;transform:scale(.4);transition:all .3s var(--ease)}
.rp-goal-item.on{color:var(--ink);border-color:rgba(194,78,116,.45)}
.rp-goal-item.on .box{background:var(--grad);border-color:transparent}
.rp-goal-item.on .box::after{opacity:1;transform:scale(1)}
.rp-goal-item .go{margin-left:auto;opacity:0;transform:translateX(-8px);transition:all .3s var(--ease);color:var(--rose);font-size:16px}
.rp-goal-item:hover .go{opacity:1;transform:translateX(0)}

.rp-hero-art{position:relative;height:112vh;min-height:860px;display:flex;gap:16px;overflow:hidden;border-radius:22px;
  opacity:0;animation:rpFade 1.2s var(--ease) .5s forwards}

.rp-mos-col{flex:1;display:flex;flex-direction:column;gap:16px}
.rp-mos-col.up .rp-mos-inner{animation:rpUp 42s linear infinite}
.rp-mos-col.down .rp-mos-inner{animation:rpDown 48s linear infinite}
.rp-mos-inner{display:flex;flex-direction:column;gap:16px}
@keyframes rpUp{to{transform:translateY(-50%)}}
@keyframes rpDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}
.rp-mos-inner img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:16px;display:block;
  filter:saturate(.96);transition:filter .4s,transform .4s var(--ease)}
.rp-mos-inner img:hover{filter:saturate(1.08);transform:scale(1.02)}

/* ---------- MEMBERSHIP PERKS SPLIT ---------- */
.rp-mem{padding-top:120px;display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
.rp-mem h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.8vw,54px);line-height:1.1;letter-spacing:-.01em}
.rp-btns{display:flex;gap:14px;margin-top:34px;flex-wrap:wrap}
.rp-btn{position:relative;display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-size:11.5px;letter-spacing:.18em;font-weight:700;
  text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;transition:all .4s var(--ease);font-family:var(--sans)}
.rp-btn-primary{background:var(--grad);color:#fff}
.rp-btn-primary:hover{transform:translateY(-3px)}
.rp-btn-ghost{background:transparent;color:var(--ink);border:1px solid rgba(42,30,20,.22)}
.rp-btn-ghost:hover{border-color:var(--rose);color:var(--rose);transform:translateY(-3px)}
.rp-btn .arr{transition:transform .35s var(--ease)}
.rp-btn:hover .arr{transform:translateX(5px)}
.rp-perks{display:flex;flex-direction:column;gap:2px}
.rp-perk{display:flex;align-items:center;gap:18px;font-size:15px;color:var(--dim);padding:15px 6px;border-bottom:1px solid var(--line);
  opacity:0;transform:translateX(26px);transition:all .7s var(--ease)}
.rp-perk.shown{opacity:1;transform:none}
.rp-perk:hover{color:var(--ink)}
.rp-perk .pico{width:40px;height:40px;border-radius:12px;background:var(--card);border:1px solid var(--line);display:grid;place-items:center;
  font-size:16px;flex-shrink:0;color:var(--rose);transition:all .35s var(--ease)}
.rp-perk:hover .pico{border-color:rgba(194,78,116,.4);transform:translateY(-2px)}

/* ---------- STATEMENT REVEAL ---------- */
.rp-statement{padding:150px 24px 140px;text-align:center;max-width:1050px;margin:0 auto}
.rp-statement h2{font-family:var(--serif);font-weight:500;font-size:clamp(38px,5.4vw,74px);line-height:1.16;letter-spacing:-.01em}
.rp-w{display:inline-block;opacity:.16;transform:translateY(10px);filter:blur(1.4px);
  transition:opacity .6s ease,transform .6s var(--ease),filter .6s ease;will-change:opacity}
.rp-w.lit{opacity:1;transform:none;filter:blur(0)}
.rp-w.accent{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.rp-statement p{margin-top:26px;color:var(--gold);font-size:12px;letter-spacing:.32em;font-weight:700;text-transform:uppercase}

/* ---------- SHOWCASE CAROUSEL ---------- */
.rp-showcase{position:relative;padding:16px 0 0;overflow:hidden}
.rp-show-track{display:flex;transition:transform .9s var(--ease);will-change:transform}
.rp-slide{flex:0 0 72%;margin:0 14px;position:relative;border-radius:24px;overflow:hidden;aspect-ratio:16/8.2;
  transform:scale(.93);opacity:.4;transition:transform .9s var(--ease),opacity .9s var(--ease);cursor:pointer}
.rp-slide.active{transform:scale(1);opacity:1}
.rp-slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 7s ease}
.rp-slide.active:hover img{transform:scale(1.05)}
.rp-slide::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.82) 4%,transparent 56%),linear-gradient(to right,rgba(30,18,10,.3),transparent 45%)}
.rp-slide-info{position:absolute;left:44px;bottom:38px;z-index:2;max-width:74%}
.rp-slide-cat{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.28em;font-weight:700;color:var(--gold-l);
  background:rgba(30,18,10,.42);backdrop-filter:blur(8px);padding:7px 14px;border-radius:100px;border:1px solid rgba(201,169,110,.35)}
.rp-slide-info h3{font-family:var(--serif);font-weight:500;font-size:clamp(28px,3.4vw,50px);line-height:1.06;margin-top:16px;color:#fff;
  transform:translateY(14px);opacity:0;transition:all .8s var(--ease) .25s}
.rp-slide.active .rp-slide-info h3{transform:none;opacity:1}
.rp-slide-start{display:inline-flex;align-items:center;gap:10px;margin-top:18px;font-size:11px;letter-spacing:.26em;font-weight:700;color:#fff;text-transform:uppercase;
  opacity:0;transform:translateY(10px);transition:all .8s var(--ease) .4s}
.rp-slide.active .rp-slide-start{opacity:1;transform:none}
.rp-slide-start .c{width:34px;height:34px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-size:12px;color:#fff}
.rp-slide-num{position:absolute;top:24px;right:30px;z-index:2;font-family:var(--serif);font-size:20px;color:rgba(255,255,255,.6)}
.rp-show-ctrl{display:flex;align-items:center;justify-content:center;gap:26px;margin-top:34px}
.rp-tbtn{width:46px;height:46px;border-radius:50%;background:var(--card);border:1px solid var(--line);color:var(--ink);font-size:16px;cursor:pointer;
  transition:all .35s var(--ease)}
.rp-tbtn:hover{background:var(--grad);border-color:transparent;color:#fff}
.rp-dots{display:flex;gap:8px}
.rp-dot{width:22px;height:3px;border-radius:2px;background:rgba(42,30,20,.16);border:none;cursor:pointer;padding:0;transition:all .4s var(--ease)}
.rp-dot.active{width:38px;background:var(--rose)}

/* ---------- BROWSE: PILLS + AUTO-LOOP ---------- */
.rp-browse{padding-top:140px}
.rp-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;max-width:980px;margin:0 auto 54px}
.rp-pill{display:inline-flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--line);color:var(--dim);
  font-family:var(--sans);font-size:12.5px;font-weight:600;padding:12px 22px;border-radius:100px;cursor:pointer;transition:all .4s var(--ease)}
.rp-pill .ci{font-size:13px;opacity:.85}
.rp-pill:hover{color:var(--ink);border-color:rgba(42,30,20,.28);transform:translateY(-2px)}
.rp-pill.active{color:#fff;border-color:transparent;background:var(--grad)}
.rp-loop-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.rp-loop-head .lh{display:flex;align-items:baseline;gap:16px}
.rp-loop-head b{font-family:var(--serif);font-weight:500;font-size:24px}
.rp-loop-head .see{color:var(--faint);font-size:12.5px;cursor:pointer;transition:color .3s}
.rp-loop-head .see:hover{color:var(--rose)}
.rp-loop-nav{display:flex;gap:10px}
.rp-loop-outer{position:relative;overflow:hidden}
.rp-loop-outer::before,.rp-loop-outer::after{content:'';position:absolute;top:0;bottom:0;width:70px;z-index:3;pointer-events:none}
.rp-loop-outer::before{left:0;background:linear-gradient(to right,var(--bg),transparent)}
.rp-loop-outer::after{right:0;background:linear-gradient(to left,var(--bg),transparent)}
.rp-loop-row{display:flex;gap:20px;overflow-x:auto;scrollbar-width:none;padding-bottom:6px}
.rp-loop-row::-webkit-scrollbar{display:none}
.rp-tcard{position:relative;flex:0 0 250px;border-radius:16px;overflow:hidden;cursor:pointer;aspect-ratio:3/4.1;
  transition:transform .5s var(--ease)}
.rp-tcard:hover{transform:translateY(-6px)}
.rp-tcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.rp-tcard:hover img{transform:scale(1.08)}
.rp-tcard::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.9) 6%,transparent 60%)}
.rp-tbadge{position:absolute;top:12px;left:12px;z-index:2;font-size:9px;letter-spacing:.16em;font-weight:700;text-transform:uppercase;
  padding:6px 11px;border-radius:100px;backdrop-filter:blur(6px)}
.rp-tinfo{position:absolute;left:18px;right:18px;bottom:16px;z-index:2}
.rp-tinfo .tc{font-size:9px;letter-spacing:.26em;font-weight:700;color:var(--gold-l);text-transform:uppercase}
.rp-tinfo h4{font-family:var(--serif);font-weight:500;font-size:21px;margin-top:6px;line-height:1.14;color:#fff}
.rp-tinfo .tm{margin-top:8px;font-size:10.5px;color:rgba(255,255,255,.6);letter-spacing:.05em}

/* ---------- COMMUNITY FAN ---------- */
.rp-community{padding-top:150px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.rp-community h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
.rp-com-rows{margin-top:40px;display:flex;flex-direction:column;gap:30px}
.rp-com-row{display:flex;gap:20px;align-items:flex-start;opacity:0;transform:translateY(22px);transition:all .8s var(--ease)}
.rp-com-row.shown{opacity:1;transform:none}
.rp-com-row .ico{width:48px;height:48px;border-radius:13px;display:grid;place-items:center;font-size:20px;flex-shrink:0;
  background:var(--card);border:1px solid var(--line);color:var(--rose);transition:all .4s var(--ease)}
.rp-com-row:hover .ico{transform:translateY(-4px) rotate(-6deg);border-color:rgba(194,78,116,.4)}
.rp-com-row h4{font-size:16px;font-weight:700;color:var(--ink)}
.rp-com-row p{color:var(--dim);font-size:14px;line-height:1.7;margin-top:6px;max-width:360px}
.rp-fan{position:relative;height:520px}
.rp-fan-card{position:absolute;left:50%;top:50%;width:62%;aspect-ratio:4/5;border-radius:16px;overflow:hidden;
  background:#fff;padding:10px;
  transform:translate(-50%,-50%) rotate(0deg);transition:transform 1.1s var(--ease);will-change:transform}
.rp-fan-card img{width:100%;height:82%;object-fit:cover;border-radius:9px;display:block}
.rp-fan-card .cap{height:18%;display:flex;align-items:center;gap:8px;padding:0 6px}
.rp-fan-card .cap .dot{width:24px;height:24px;border-radius:50%;background:var(--grad);flex-shrink:0}
.rp-fan-card .cap b{font-size:11px;color:#241a12;font-weight:700}
.rp-fan-card .cap span{font-size:9.5px;color:#9b8f80}
.rp-fan.shown .rp-fan-card:nth-child(1){transform:translate(-88%,-58%) rotate(-13deg)}
.rp-fan.shown .rp-fan-card:nth-child(2){transform:translate(-50%,-46%) rotate(-2deg)}
.rp-fan.shown .rp-fan-card:nth-child(3){transform:translate(-14%,-60%) rotate(11deg)}
.rp-fan-card:hover{z-index:5}
.rp-fan.shown .rp-fan-card:nth-child(1):hover{transform:translate(-88%,-62%) rotate(-10deg) scale(1.04)}
.rp-fan.shown .rp-fan-card:nth-child(2):hover{transform:translate(-50%,-50%) rotate(0deg) scale(1.04)}
.rp-fan.shown .rp-fan-card:nth-child(3):hover{transform:translate(-14%,-64%) rotate(8deg) scale(1.04)}

/* ---------- MEMBERSHIP / PRICING ---------- */
.rp-member{padding-top:150px;display:grid;grid-template-columns:1.2fr 1fr;gap:70px;align-items:center}
.rp-mv{position:relative;height:480px}
.rp-mv-img{position:absolute;inset:0 60px 40px 0;border-radius:20px;overflow:hidden}
.rp-mv-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 8s ease}
.rp-mv:hover .rp-mv-img img{transform:scale(1.06)}
.rp-price{position:absolute;right:0;bottom:0;width:300px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px}
.rp-price-ico{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#f7e3ec,#efe6f7);display:grid;place-items:center;margin:0 auto 14px;font-size:18px;color:var(--rose)}
.rp-price h4{text-align:center;font-size:15px;font-weight:700;line-height:1.4;color:var(--ink)}
.rp-tier{display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:11px;padding:13px 16px;margin-top:10px;
  font-size:13px;font-weight:700;cursor:pointer;color:var(--ink);transition:all .3s var(--ease)}
.rp-tier span{color:var(--dim);font-weight:500;font-size:12px}
.rp-tier:hover,.rp-tier.hot{border-color:var(--rose);background:#fdf4f8;transform:translateX(3px)}
.rp-pc-btn{margin-top:16px;width:100%;border:none;background:var(--grad);color:#fff;font-family:var(--sans);font-weight:700;font-size:12px;
  letter-spacing:.08em;padding:14px;border-radius:11px;cursor:pointer;text-transform:uppercase;transition:all .35s var(--ease)}
.rp-pc-btn:hover{transform:translateY(-2px)}
.rp-mc h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
.rp-mc>p{color:var(--dim);line-height:1.8;margin-top:18px;font-size:15px}
.rp-benefits{margin-top:32px;display:flex;flex-direction:column;gap:14px}
.rp-benefit{display:flex;align-items:center;gap:14px;font-size:14.5px;color:var(--dim);
  opacity:0;transform:translateX(-18px);transition:all .7s var(--ease)}
.rp-benefit.shown{opacity:1;transform:none}
.rp-benefit .chk{width:22px;height:22px;border-radius:50%;background:rgba(194,78,116,.12);border:1px solid rgba(194,78,116,.4);
  display:grid;place-items:center;font-size:10px;color:var(--rose);flex-shrink:0}

/* ---------- FAQ ---------- */
.rp-faq-wrap{padding-top:150px;max-width:860px}
.rp-faq-wrap h2{font-family:var(--serif);font-weight:500;font-size:clamp(32px,3.4vw,48px);margin-bottom:40px}
.rp-faq{border-bottom:1px solid var(--line)}
.rp-faq-q{width:100%;background:none;border:none;color:var(--ink);font-family:var(--sans);font-size:16px;font-weight:600;text-align:left;
  padding:24px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;cursor:pointer;transition:color .3s}
.rp-faq-q:hover{color:var(--rose)}
.rp-faq-q .chev{flex-shrink:0;width:30px;height:30px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;
  font-size:11px;transition:all .5s var(--ease)}
.rp-faq.open .rp-faq-q .chev{transform:rotate(180deg);background:var(--grad);border-color:transparent;color:#fff}
.rp-faq.open .rp-faq-q{color:var(--ink)}
.rp-faq-a{max-height:0;overflow:hidden;transition:max-height .5s var(--ease)}
.rp-faq-a p{color:var(--dim);line-height:1.8;font-size:14.5px;padding-bottom:24px;max-width:680px}

/* ---------- CTA ---------- */
.rp-cta{position:relative;margin-top:140px;padding:120px 24px;text-align:center;overflow:hidden;border-top:1px solid var(--line)}
.rp-cta::before{content:'';position:absolute;left:50%;top:-40%;width:900px;height:600px;transform:translateX(-50%);
  background:radial-gradient(ellipse,rgba(194,78,116,.12),transparent 65%);pointer-events:none}
.rp-cta h2{position:relative;font-family:var(--serif);font-weight:500;font-size:clamp(38px,5vw,68px);line-height:1.1}
.rp-cta h2 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.rp-cta p{position:relative;color:var(--dim);margin-top:20px;font-size:16px}
.rp-cta .rp-btn{margin-top:38px}

/* ---------- REVEAL ---------- */
.rp-reveal{opacity:0;transform:translateY(38px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.rp-reveal.shown{opacity:1;transform:none}

@media(max-width:1024px){
  .rp-hero{grid-template-columns:1fr;padding-top:110px;min-height:auto}
  .rp-hero-art{height:620px;min-height:0;order:-1;margin-top:20px}
  .rp-mem,.rp-community,.rp-member{grid-template-columns:1fr}
  .rp-fan{height:420px}
  .rp-mv{height:420px}
  .rp-slide{flex-basis:86%}
}
@media(max-width:980px){
  .rp-section,.rp-hero{padding-left:22px;padding-right:22px}
}
@media(max-width:600px){
  .rp-slide{flex-basis:90%}
}
@media(prefers-reduced-motion:reduce){
  .rp *,.rp *::before,.rp *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  .rp-h1 .line span{transform:none}
  .rp-kicker,.rp-sub,.rp-goal,.rp-hero-art{opacity:1!important}
  .rp-reveal,.rp-com-row,.rp-benefit,.rp-perk{opacity:1;transform:none}
  .rp-w{opacity:1;transform:none;filter:none}
}
`;
