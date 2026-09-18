// ─── Page styles (hero, ribbon, bestsellers, marquee, brands, promises, etc.) ─
export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --rose:#DD8164; --rose-light:#FDEFE6; --rose-mid:#F5D3C4; --rose-dark:#D45A79;
    --grad-btn:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%); --accent:#DD8164; --accent-deep:#D45A79;
    --white:#FFFFFF; --surface:#F7F7FA;
    --ink:#111118; --ink-soft:#3a3a44; --ink-muted:#888898;
    --line:#EEEEF2; --line-dark:rgba(17,17,24,0.08);
  }
  html{scroll-behavior:smooth;}
  body{font-family:'Jost',sans-serif;background:var(--white);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased;cursor:none;}

  /* ── LOADER ── */
  #pld{position:fixed;inset:0;z-index:9999;background:#111118;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;transition:opacity .9s,visibility .9s;}
  #pld.hidden{opacity:0;visibility:hidden;pointer-events:none;}
  .l-ornaments{display:flex;gap:14px;align-items:center;opacity:0;transform:translateY(10px);animation:lFadeUp .7s ease .2s forwards;}
  .l-ornaments span{color:var(--rose);font-size:14px;letter-spacing:2px;opacity:.65;}
  .l-ornaments span:nth-child(3){opacity:1;font-size:20px;}
  .l-logo{font-family:'Cormorant Garamond',serif;font-size:clamp(52px,9vw,100px);font-weight:300;letter-spacing:.32em;text-transform:uppercase;color:#fff;opacity:0;transform:scale(.93) translateY(10px);animation:lReveal 1.1s cubic-bezier(.22,1,.36,1) .5s forwards;line-height:1;}
  .l-logo span{background:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .l-rule{width:0;height:1px;background:linear-gradient(90deg,transparent,var(--rose) 40%,var(--rose) 60%,transparent);animation:lRule 1s cubic-bezier(.22,1,.36,1) .85s forwards;margin:4px 0;}
  .l-sub{font-size:10px;font-weight:300;letter-spacing:.42em;text-transform:uppercase;color:rgba(255,255,255,.32);opacity:0;animation:lFadeUp .6s ease 1.1s forwards;}
  .l-prog{width:120px;height:1px;background:rgba(255,255,255,.08);margin-top:12px;position:relative;overflow:hidden;}
  .l-prog::after{content:'';position:absolute;inset:0 auto 0 0;width:0;background:var(--rose);animation:lProgress 1.8s cubic-bezier(.22,1,.36,1) .3s forwards;}
  @keyframes lReveal{to{opacity:1;transform:scale(1) translateY(0);}}
  @keyframes lFadeUp{to{opacity:1;transform:translateY(0);}}
  @keyframes lRule{to{width:160px;}}
  @keyframes lProgress{to{width:100%;}}

  /* ── CURSOR ── */
  .c-dot{width:7px;height:7px;background:var(--rose);border-radius:50%;position:fixed;pointer-events:none;z-index:9998;top:0;left:0;margin:-3.5px 0 0 -3.5px;}
  .c-ring{width:32px;height:32px;border:1px solid rgba(232,64,90,.35);border-radius:50%;position:fixed;pointer-events:none;z-index:9997;top:0;left:0;margin:-16px 0 0 -16px;transition:width .35s,height .35s,border-color .3s,margin .35s;}

  /* ── PAGE FADE ── */
  .page{opacity:0;transition:opacity .7s ease;}
  .page.vis{opacity:1;}

  /* ── HERO SLIDER ── */
  /* Top offset = MainNav(64px) + ProductsSubNav(44px) = 108px */
  .hero-slider{margin-top:108px;position:relative;overflow:hidden;height:clamp(480px,62vh,760px);}
  /* Showcase hero replaces the slider — strip's margin handles nav clearance */
  .showcase-hero{padding-top:0;}
  .hs-track{display:flex;height:100%;transition:transform .9s cubic-bezier(.22,1,.36,1);}
  .hs-slide{flex-shrink:0;width:100%;height:100%;position:relative;overflow:hidden;}
  .hs-img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04);transition:transform 8s linear;}
  .hs-slide.active .hs-img{transform:scale(1);}
  .hs-overlay{position:absolute;inset:0;background:linear-gradient(110deg,rgba(17,17,24,.72) 0%,rgba(17,17,24,.18) 65%,transparent 100%);}
  .hs-content{position:absolute;left:56px;bottom:72px;max-width:560px;}
  .hs-eyebrow{font-size:10px;font-weight:400;letter-spacing:.26em;text-transform:uppercase;color:var(--rose);margin-bottom:14px;opacity:0;transform:translateY(10px);transition:opacity .6s ease .15s,transform .6s ease .15s;}
  .hs-slide.active .hs-eyebrow{opacity:1;transform:translateY(0);}
  .hs-title{font-family:'Cormorant Garamond',serif;font-size:clamp(48px,6vw,88px);font-weight:300;line-height:.95;color:#fff;white-space:pre-line;opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.22,1,.36,1) .25s,transform .8s cubic-bezier(.22,1,.36,1) .25s;}
  .hs-slide.active .hs-title{opacity:1;transform:translateY(0);}
  .hs-sub{font-size:13px;font-weight:300;color:rgba(255,255,255,.62);margin-top:14px;line-height:1.7;opacity:0;transform:translateY(10px);transition:opacity .6s ease .45s,transform .6s ease .45s;}
  .hs-slide.active .hs-sub{opacity:1;transform:translateY(0);}
  .hs-cta{margin-top:28px;display:inline-flex;align-items:center;gap:12px;font-size:10px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;padding:13px 28px;background:var(--rose);border:none;color:#fff;cursor:pointer;border-radius:4px;opacity:0;transform:translateY(10px);transition:opacity .6s ease .55s,transform .6s ease .55s,background .2s;}
  .hs-slide.active .hs-cta{opacity:1;transform:translateY(0);}
  .hs-cta:hover{background:var(--rose-dark);}
  .hs-controls{position:absolute;bottom:32px;right:56px;display:flex;align-items:center;gap:14px;}
  .hs-arrow{width:38px;height:38px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);backdrop-filter:blur(8px);color:rgba(255,255,255,.8);font-size:14px;cursor:pointer;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:all .22s;}
  .hs-arrow:hover{background:var(--rose);border-color:var(--rose);color:#fff;}
  .hs-dots{display:flex;gap:7px;}
  .hs-dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.3);border:none;cursor:pointer;padding:0;transition:background .3s,width .3s,border-radius .3s;}
  .hs-dot.active{background:var(--rose);width:20px;border-radius:2px;}

  /* ── RIBBON ── */
  .ribbon-section{border-top:1px solid var(--line);background:var(--white);}
  .ribbon-header{padding:32px 56px 20px;display:flex;align-items:baseline;justify-content:space-between;}
  .ribbon-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:var(--ink);}
  .ribbon-title em{font-style:italic;color:var(--rose);}
  .ribbon-subtitle{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted);}
  .ribbon-outer{overflow:hidden;}
  .ribbon-track{display:flex;width:max-content;animation:ribbonScroll 55s linear infinite;cursor:grab;will-change:transform;}
  .ribbon-track:active{cursor:grabbing;}
  .ribbon-track.paused{animation-play-state:paused;}
  @keyframes ribbonScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  .r-item{flex-shrink:0;width:clamp(240px,21vw,320px);border-right:1px solid var(--line);display:flex;flex-direction:column;cursor:pointer;}
  .r-img{width:100%;height:clamp(260px,30vw,360px);overflow:hidden;background:var(--surface);position:relative;}
  .r-img-inner{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.22,1,.36,1),filter .4s;will-change:transform;display:block;}
  .r-item:hover .r-img-inner{transform:scale(1.05);filter:brightness(1.04);}
  .r-badge{position:absolute;top:0;left:0;font-size:9px;font-weight:400;letter-spacing:.18em;text-transform:uppercase;padding:5px 13px;background:var(--white);color:var(--ink);border-bottom:1px solid var(--line);border-right:1px solid var(--line);}
  .r-badge.sale{background:var(--rose);color:#fff;border-color:var(--rose);}
  .r-badge.new-b{background:var(--ink);color:#fff;border-color:var(--ink);}
  .r-info{padding:18px 22px 24px;border-top:1px solid var(--line);background:var(--white);flex:1;display:flex;flex-direction:column;transition:background .25s;}
  .r-item:hover .r-info{background:var(--surface);}
  .r-cat{font-size:9px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--rose);margin-bottom:5px;}
  .r-name{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--ink);line-height:1.1;}
  .r-tag{font-size:11px;font-weight:300;color:var(--ink-muted);margin-top:2px;}
  .r-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:14px;border-top:1px solid var(--line);}
  .r-price{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:var(--ink);}
  .r-was{font-size:11px;color:var(--ink-muted);text-decoration:line-through;margin-left:5px;}
  .r-add{font-size:9px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;padding:7px 14px;border:1.5px solid var(--rose);background:transparent;color:var(--rose);cursor:pointer;border-radius:3px;transition:all .2s;}
  .r-add:hover{background:var(--rose);color:#fff;}
  .drag-hint{padding:16px 56px;display:flex;align-items:center;gap:12px;font-size:10px;font-weight:300;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-muted);}
  .drag-arr{width:36px;height:1px;background:var(--ink-muted);position:relative;animation:arrPulse 2.2s ease infinite;}
  .drag-arr::after{content:'';position:absolute;right:-1px;top:-3px;width:6px;height:6px;border-top:1px solid var(--ink-muted);border-right:1px solid var(--ink-muted);transform:rotate(45deg);}
  @keyframes arrPulse{0%,100%{width:36px;opacity:1}50%{width:54px;opacity:.4}}

  /* ── BESTSELLERS ── */
  .bs-section{background:#111118;padding:56px 0;position:relative;overflow:hidden;}
  .bs-section::before{content:'';position:absolute;top:-80px;right:-60px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(232,64,90,.1) 0%,transparent 70%);pointer-events:none;}
  .bs-header{padding:0 56px 36px;display:flex;align-items:flex-end;justify-content:space-between;}
  .bs-eyebrow{font-size:9px;font-weight:400;letter-spacing:.3em;text-transform:uppercase;color:var(--rose);margin-bottom:10px;display:flex;align-items:center;gap:10px;}
  .bs-eyebrow::before{content:'';width:22px;height:1px;background:var(--rose);opacity:.6;}
  .bs-title{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,4vw,52px);font-weight:300;color:#fff;line-height:1.05;}
  .bs-title em{font-style:italic;color:var(--rose);}
  .bs-sub{font-size:11px;font-weight:300;color:rgba(255,255,255,.35);max-width:280px;line-height:1.7;text-align:right;}
  .bs-track-outer{overflow:hidden;}
  .bs-track{display:flex;width:max-content;animation:bsScroll 38s linear infinite;will-change:transform;}
  .bs-track.paused{animation-play-state:paused;}
  @keyframes bsScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  .bs-card{flex-shrink:0;width:clamp(280px,26vw,380px);margin-right:1px;position:relative;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);transition:background .35s,border-color .35s,transform .45s cubic-bezier(.22,1,.36,1);overflow:hidden;}
  .bs-card::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(17,17,24,.72) 100%);z-index:1;pointer-events:none;opacity:0;transition:opacity .35s;}
  .bs-card:hover{background:rgba(255,255,255,.07);border-color:rgba(232,64,90,.35);transform:translateY(-6px);}
  .bs-card:hover::before{opacity:1;}
  .bs-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--rose),transparent);transform:scaleX(0);transition:transform .45s cubic-bezier(.22,1,.36,1);z-index:2;}
  .bs-card:hover::after{transform:scaleX(1);}
  .bs-img{height:clamp(260px,32vw,380px);overflow:hidden;position:relative;}
  .bs-photo{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s cubic-bezier(.22,1,.36,1),filter .4s;filter:brightness(.82) saturate(.9);}
  .bs-card:hover .bs-photo{transform:scale(1.06);filter:brightness(.75) saturate(1);}
  .bs-badge{position:absolute;top:14px;left:14px;font-size:8px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;padding:4px 12px;background:var(--rose);color:#fff;z-index:3;border-radius:3px;}
  .bs-shimmer{position:absolute;bottom:0;left:0;right:0;padding:24px 22px 20px;background:linear-gradient(0deg,rgba(17,17,24,.9) 0%,transparent 100%);z-index:4;transform:translateY(60%);transition:transform .45s cubic-bezier(.22,1,.36,1);display:flex;align-items:center;justify-content:space-between;gap:10px;}
  .bs-card:hover .bs-shimmer{transform:translateY(0);}
  .bs-shimmer-add{font-size:9px;font-weight:400;letter-spacing:.16em;text-transform:uppercase;padding:9px 16px;border:1.5px solid var(--rose);color:var(--rose);background:transparent;cursor:pointer;border-radius:3px;transition:all .2s;white-space:nowrap;}
  .bs-shimmer-add:hover{background:var(--rose);color:#fff;}
  .bs-shimmer-price{font-family:'Cormorant Garamond',serif;font-size:22px;color:#fff;font-weight:400;}
  .bs-info{padding:18px 22px 22px;}
  .bs-cat{font-size:9px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--rose);margin-bottom:5px;}
  .bs-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:#fff;line-height:1.1;}
  .bs-tagline{font-size:11px;font-weight:300;color:rgba(255,255,255,.4);margin-top:3px;}
  .bs-rating{display:flex;align-items:center;gap:6px;margin-top:10px;}
  .bs-stars{color:var(--rose);font-size:10px;letter-spacing:1.5px;}
  .bs-rnum{font-size:11px;font-weight:500;color:#fff;}
  .bs-rcnt{font-size:10px;color:rgba(255,255,255,.3);}
  .bs-footer{display:flex;padding:14px 22px 20px;border-top:1px solid rgba(255,255,255,.07);justify-content:space-between;align-items:center;}
  .bs-price{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;color:#fff;}
  .bs-was{font-size:11px;color:rgba(255,255,255,.28);text-decoration:line-through;margin-left:5px;}
  .bs-stock{font-size:9px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.32);}
  .bs-stock.low{color:#f4806a;}

  /* ── MARQUEE ── */
  .mq{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:15px 0;overflow:hidden;margin:60px 0 0;background:var(--white);}
  .mq-t{display:flex;width:max-content;animation:marquee 30s linear infinite;}
  .mq-i{display:flex;align-items:center;gap:18px;padding:0 36px;font-size:10px;font-weight:300;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-muted);white-space:nowrap;}
  .mq-d{width:3px;height:3px;border-radius:50%;background:var(--rose);flex-shrink:0;}
  @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}

  /* ── BRANDS ── */
  .brands-section{padding:52px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--surface);overflow:hidden;}
  .brands-header{padding:0 56px 26px;}
  .brands-eyebrow{font-size:9px;font-weight:500;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:6px;display:flex;align-items:center;gap:10px;}
  .brands-eyebrow::before{content:'';width:20px;height:1px;background:var(--rose);opacity:.6;}
  .brands-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:var(--ink);}
  .brands-track-outer{overflow:hidden;}
  .brands-track{display:flex;align-items:center;width:max-content;animation:brandsScroll 28s linear infinite;will-change:transform;}
  .brands-track:hover{animation-play-state:paused;}
  @keyframes brandsScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  .brand-item{flex-shrink:0;padding:0 48px;display:flex;align-items:center;justify-content:center;height:72px;border-right:1px solid var(--line);transition:background .22s;}
  .brand-item:hover{background:var(--white);}
  .brand-name{font-family:'Cormorant Garamond',serif;font-size:clamp(17px,2vw,24px);font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);transition:color .2s;white-space:nowrap;}
  .brand-item:hover .brand-name{color:var(--ink);}

  /* ── PROMISES ── */
  .prom{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);opacity:0;background:var(--white);}
  .prom.vis{animation:fadeIn .85s ease forwards;}
  .prom-i{background:var(--white);padding:32px 26px;border-right:1px solid var(--line);transition:background .25s;}
  .prom-i:last-child{border-right:none;}
  .prom-i:hover{background:var(--surface);}
  .prom-ico{font-size:18px;color:var(--rose);display:block;margin-bottom:12px;}
  .prom-ttl{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:400;color:var(--ink);margin-bottom:6px;}
  .prom-desc{font-size:12px;font-weight:300;color:var(--ink-muted);line-height:1.65;}

  /* ── TESTIMONIALS ── */
  .test{padding:68px 56px;opacity:0;background:var(--white);}
  .test.vis{animation:fadeUp .8s ease forwards;}
  .test-hd{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:300;color:var(--ink);margin-bottom:36px;}
  .test-hd em{font-style:italic;background:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .test-g{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);}
  .t-c{background:var(--white);padding:34px;transition:background .22s;}
  .t-c:hover{background:var(--surface);}
  .t-s{color:var(--rose);font-size:11px;letter-spacing:3px;margin-bottom:13px;}
  .t-t{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:300;font-style:italic;line-height:1.7;color:var(--ink-soft);margin-bottom:18px;}
  .t-r{display:flex;align-items:center;gap:10px;padding-top:13px;border-top:1px solid var(--line);}
  .t-av{width:30px;height:30px;border-radius:50%;background:var(--rose-light);border:1px solid var(--rose-mid);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--rose);font-weight:500;}
  .t-n{font-size:12px;font-weight:500;color:var(--ink);}
  .t-h{font-size:10px;color:var(--ink-muted);}

  /* ── CTA ── */
  .cta{background:#111118;padding:clamp(80px, 10vh, 160px) clamp(24px, 4vw, 56px);display:flex;align-items:center;justify-content:space-between;gap:56px;position:relative;overflow:hidden;opacity:0;}
  .cta.vis{animation:fadeIn .9s ease forwards;}
  .cta::before{content:'';position:absolute;right:-60px;top:-80px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(232,64,90,.1) 0%,transparent 70%);}
  .cta-ey{font-size:10px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;background:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px;}
  .cta-ttl{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;line-height:1.1;color:#fff;}
  .cta-sb{font-size:14px;font-weight:300;color:rgba(255,255,255,.38);margin-top:10px;line-height:1.75;}
  .cta-form{display:flex;flex-direction:column;gap:10px;min-width:290px;position:relative;z-index:1;}
  .cta-inp{font-family:'Jost',sans-serif;font-size:12px;padding:13px 15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#fff;outline:none;border-radius:4px;transition:border-color .2s;}
  .cta-inp::placeholder{color:rgba(255,255,255,.28);}
  .cta-inp:focus{border-color:var(--rose);}
  .cta-btn{font-family:'Jost',sans-serif;font-size:10px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;padding:13px;background:var(--grad-btn);border:none;color:#fff;cursor:pointer;border-radius:4px;transition:filter .2s;}
  .cta-btn:hover{filter:brightness(1.06) saturate(1.1);}
  .cta-note{font-size:10px;color:rgba(255,255,255,.25);letter-spacing:.06em;}

  /* ── FOOTER ── */
  footer{border-top:1px solid var(--line);padding:clamp(30px, 4vh, 60px) clamp(24px, 4vw, 56px);display:flex;align-items:center;justify-content:space-between;background:var(--white);}
  footer p{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-muted);}
  .f-l{display:flex;gap:26px;list-style:none;}
  .f-l a{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);text-decoration:none;transition:color .18s;}
  .f-l a:hover{color:var(--rose);}

  @keyframes fadeIn{to{opacity:1;}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

  /* ── RESPONSIVE ── */
  @media(max-width:1100px){
    .ribbon-header,.drag-hint,.bs-header,.brands-header,.test,.cta,footer{padding-left:28px!important;padding-right:28px!important;}
    .prom{grid-template-columns:repeat(2,1fr);}
    .test-g{grid-template-columns:1fr;}
    .cta{flex-direction:column;}
  }
  @media(max-width:640px){
    .hero-slider{margin-top:108px;}
    .hs-content{left:16px;bottom:48px;}
    .hs-controls{right:16px;}
    .prom{grid-template-columns:1fr;}
    .ribbon-header,.drag-hint,.bs-header,.brands-header,.test,.cta,footer{padding-left:16px!important;padding-right:16px!important;}
    footer{flex-direction:column;gap:14px;}
  }
`;
