/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

.cx{
  --bg:#FAF6F0; --bg-soft:#FFFDF8; --card:#FFFFFF;
  --text:#211f1c; --text-dim:rgba(33,31,28,.62); --text-faint:rgba(33,31,28,.40);
  --pink:#ec4899; --gold:#B0894E; --mint:#1fae93;
  --grad:linear-gradient(135deg,#ec4899,#d946ef 55%,#8b5cf6);
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'Inter',-apple-system,sans-serif;
  --ease:cubic-bezier(.22,1,.36,1);
  --line:rgba(33,31,28,.12);
  /* paper surface (lesson) */
  --paper:#fdfcfa; --pcard:#ffffff;
  --ink:#211f1c; --body:#45413b; --ink-dim:#8a847a; --ink-faint:#b5aea2;
  --pline:rgba(33,31,28,.1);
}
.cx *,.cx *::before,.cx *::after{margin:0;padding:0;box-sizing:border-box}
.cx{font-family:var(--sans);overflow-x:hidden;-webkit-font-smoothing:antialiased;min-height:100vh}
.cx ::selection{background:rgba(236,72,153,.2)}
.cx.is-course{background:var(--bg)!important;color:var(--text);display:block;min-height:100vh}
.cx.is-lesson{background:#eee8db!important;color:var(--ink);display:block}
body.cx-open{background:#FAF6F0!important}
body.cx-open.cx-lesson-open{background:#eee8db!important}

/* hide the site's fixed nav — this route ships its own.
   IMPORTANT: never use a bare 'header' selector — the hero is a <header>, so a
   global 'body.cx-open header{display:none}' collapses the hero. Target only
   the site nav explicitly. */
body.cx-open nav[data-site-nav],
body.cx-open [data-header]{display:none!important}
body.cx-open main,body.cx-open .page-wrapper{padding-top:0!important;margin-top:0!important}

/* ---------- READING PROGRESS ---------- */
.cx-progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:120}
.cx-progress b{display:block;height:100%;background:var(--grad);transition:width .15s linear}

/* ---------- NAV ---------- */
.cx-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;
  padding:22px 48px;transition:all .5s var(--ease)}
.cx-nav.scrolled{top:2px;padding:14px 48px;background:rgba(250,246,240,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}
.cx-nav-left{display:flex;align-items:center;gap:28px}
.cx-logo{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.18em;font-size:14px;cursor:pointer;color:var(--text);background:none;border:none;font-family:var(--sans)}
.cx-logo-mark{width:30px;height:30px;border-radius:9px;background:var(--grad);display:grid;place-items:center;font-family:var(--serif);font-size:19px;font-weight:600;color:#fff;transition:transform .4s var(--ease)}
.cx-logo:hover .cx-logo-mark{transform:rotate(-8deg) scale(1.08)}
.cx-crumb{display:flex;align-items:center;gap:10px;color:var(--text-dim);font-size:12px;letter-spacing:.12em;transition:color .3s;background:none;border:none;cursor:pointer;font-family:var(--sans)}
.cx-crumb:hover{color:var(--text)}
.cx-crumb .back{width:30px;height:30px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;transition:all .35s var(--ease)}
.cx-crumb:hover .back{border-color:rgba(33,31,28,.4);transform:translateX(-3px)}
.cx-avatar{width:36px;height:36px;border-radius:50%;background:var(--grad);padding:2px;flex-shrink:0}
.cx-avatar-in{width:100%;height:100%;border-radius:50%;background:#e8e2d8;background-size:cover;background-position:center}

/* ══════════════════════════════════════════
   COURSE OVERVIEW — HERO
   Photo lives on the RIGHT, dissolves into cream
   toward the left and bottom so the type stays readable.
══════════════════════════════════════════ */
.cx-hero{position:relative;display:block;height:62vh;min-height:520px;width:100%;flex:none;overflow:hidden;background:linear-gradient(135deg,#efe7f3,#f6eef5 55%,#f3e9ef)}
/* Two stacked scrims: horizontal (protects the headline)
   then vertical (blends the photo into the page below). */
 .cx-hero-bg{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:center right;display:block;
  filter:saturate(.94) contrast(1.02) brightness(1.06);
  animation:cxKen 20s ease-out forwards alternate infinite}

@keyframes cxKen{from{transform:scale(1)}to{transform:scale(1.07)}}

.cx-hero-veil{position:absolute;inset:0;pointer-events:none;background:
  linear-gradient(to bottom,rgba(250,246,240,.30) 0%,rgba(250,246,240,.05) 34%,rgba(250,246,240,.34) 76%,var(--bg) 100%),
  linear-gradient(to right,var(--bg) 0%,rgba(250,246,240,.96) 22%,rgba(250,246,240,.62) 44%,rgba(250,246,240,.30) 64%,rgba(250,246,240,.16) 100%)}

.cx-hero-content{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:0 48px 60px;max-width:1000px}


.cx-chips{display:flex;align-items:center;gap:14px;flex-wrap:wrap;opacity:0;animation:cxFadeUp 1s var(--ease) .2s forwards}
.cx-chip{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.28em;font-weight:700;color:#177f6c;
  background:rgba(255,255,255,.72);backdrop-filter:blur(8px);padding:8px 16px;border-radius:100px;border:1px solid rgba(31,174,147,.4);text-transform:uppercase}
.cx-chip::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--mint);animation:cxPulse 2.2s infinite}
@keyframes cxPulse{0%,100%{opacity:1}50%{opacity:.35}}
.cx-hero h1{font-family:var(--serif);font-weight:500;font-size:clamp(40px,5.4vw,72px);line-height:1.04;margin-top:20px;color:var(--text)}
.cx-hero h1 .line{display:block;overflow:hidden}
.cx-hero h1 .line span{display:block;transform:translateY(115%);animation:cxRise 1.15s var(--ease) .35s forwards}
@keyframes cxRise{to{transform:translateY(0)}}
@keyframes cxFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.cx-promise{margin-top:22px;color:var(--text-dim);font-size:16px;font-weight:400;line-height:1.75;max-width:540px;
  opacity:0;animation:cxFadeUp 1s var(--ease) .8s forwards}
.cx-hero-actions{margin-top:36px;display:flex;align-items:center;gap:26px;flex-wrap:wrap;opacity:0;animation:cxFadeUp 1s var(--ease) 1.05s forwards}
.cx-btn{display:inline-flex;align-items:center;gap:10px;padding:16px 36px;border-radius:100px;font-size:12px;letter-spacing:.2em;font-weight:600;
  cursor:pointer;border:none;transition:all .4s var(--ease);font-family:var(--sans)}
.cx-btn-primary{background:var(--grad);color:#fff;box-shadow:0 10px 28px rgba(236,72,153,.28)}
.cx-btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(236,72,153,.36)}
.cx-btn:active{transform:translateY(-1px) scale(.98)}
.cx-btn .arr{transition:transform .35s var(--ease)}
.cx-btn:hover .arr{transform:translateX(5px)}
.cx-scroll{position:absolute;bottom:34px;right:48px;z-index:3;color:var(--text-faint);font-size:10px;letter-spacing:.35em;
  display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:cxFadeUp 1s var(--ease) 1.4s forwards}
.cx-scroll .wheel{width:1px;height:34px;background:linear-gradient(to bottom,rgba(33,31,28,.45),transparent);animation:cxDrip 1.8s ease-in-out infinite}
@keyframes cxDrip{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}

.cx-section{max-width:1180px;margin:0 auto;padding:0 48px}
.cx-sec-label{display:flex;align-items:center;gap:18px;color:var(--text-faint);font-size:10.5px;letter-spacing:.4em;font-weight:600;margin-bottom:34px}
.cx-sec-label::after{content:'';flex:1;height:1px;background:var(--line)}

.cx-about{padding-top:110px;display:grid;grid-template-columns:1fr 1.25fr;gap:70px;align-items:start}
.cx-about-copy p{font-family:var(--serif);font-size:26px;font-weight:400;line-height:1.5;color:var(--text)}
.cx-about-copy p em{font-style:italic;color:var(--gold)}
.cx-about-copy .note{margin-top:26px;font-family:var(--sans);font-size:13.5px;color:var(--text-dim);font-weight:400;line-height:1.8}
.cx-learn-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.cx-learn{display:flex;gap:14px;align-items:flex-start;background:var(--bg-soft);border:1px solid var(--line);border-radius:14px;padding:20px;
  font-size:13.5px;color:var(--text-dim);line-height:1.6;box-shadow:0 2px 12px rgba(74,48,20,.05);
  opacity:0;transform:translateY(22px);transition:all .7s var(--ease)}
.cx-learn.shown{opacity:1;transform:none}
.cx-learn:hover{border-color:rgba(33,31,28,.28);color:var(--text);background:var(--card);box-shadow:0 10px 26px rgba(74,48,20,.09)}
.cx-learn .chk{width:22px;height:22px;border-radius:50%;background:rgba(31,174,147,.1);border:1px solid rgba(31,174,147,.35);
  display:grid;place-items:center;font-size:10px;color:var(--mint);flex-shrink:0;margin-top:1px}

.cx-curr{padding-top:130px}
.cx-curr-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:44px;flex-wrap:wrap}
.cx-curr-head h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.8vw,54px);line-height:1.1}
.cx-curr-head .cm{color:var(--text-faint);font-size:11px;letter-spacing:.3em;font-weight:600}
.cx-grp{display:flex;align-items:center;gap:16px;margin:40px 0 6px;font-size:10px;letter-spacing:.32em;font-weight:700;color:var(--gold);text-transform:uppercase}
.cx-grp .n{font-family:var(--serif);font-size:16px;color:var(--text-faint);font-weight:500;letter-spacing:.02em}
.cx-grp::after{content:'';flex:1;height:1px;background:var(--line)}
.cx-lesson{position:relative;display:grid;grid-template-columns:200px 1fr auto;gap:30px;align-items:center;
  padding:20px 18px;border-top:1px solid var(--line);cursor:pointer;border-radius:16px;text-align:left;width:100%;background:none;font-family:var(--sans);color:inherit;
  border-left:none;border-right:none;border-bottom:none;
  opacity:0;transform:translateY(30px);transition:opacity .8s var(--ease),transform .8s var(--ease),background .45s var(--ease)}
.cx-lesson.shown{opacity:1;transform:none}
.cx-lesson.last{border-bottom:1px solid var(--line)}
.cx-lesson:hover{background:var(--bg-soft)}
.cx-lesson:active{background:#f3efe7}
.cx-lthumb{position:relative;width:200px;aspect-ratio:16/10;border-radius:12px;overflow:hidden;background:#e8e2d8}
.cx-lthumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s var(--ease)}
.cx-lesson:hover .cx-lthumb img{transform:scale(1.06)}
.cx-lthumb::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,15,.55),transparent 60%)}
.cx-lthumb .lnum{position:absolute;left:10px;bottom:6px;z-index:2;font-family:var(--serif);font-size:22px;color:#fff}
.cx-lesson .lk{font-size:9px;letter-spacing:.3em;font-weight:700;color:var(--gold);text-transform:uppercase}
.cx-lesson h3{font-family:var(--sans);font-weight:600;font-size:16.5px;line-height:1.4;margin-top:8px;transition:color .3s;max-width:640px;color:var(--text-dim)}
.cx-lesson:hover h3{color:var(--text)}
.cx-topics{margin-top:9px;display:flex;flex-wrap:wrap;gap:6px}
.cx-topic{font-size:9.5px;letter-spacing:.06em;color:var(--text-dim);background:var(--card);border:1px solid var(--line);
  padding:4px 11px;border-radius:100px;transition:all .3s}
.cx-lesson:hover .cx-topic{border-color:rgba(33,31,28,.25);color:var(--text)}
.cx-lright{display:flex;flex-direction:column;align-items:flex-end;gap:16px}
.cx-lright .dur{font-size:9.5px;letter-spacing:.22em;color:var(--text-faint);font-weight:600;white-space:nowrap}
.cx-lright .play{width:44px;height:44px;border-radius:50%;border:1px solid rgba(33,31,28,.25);display:grid;place-items:center;
  font-size:11px;transition:all .45s var(--ease)}
.cx-lesson:hover .play{background:var(--text);color:#FAF6F0;border-color:transparent;transform:scale(1.08)}
.cx-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px;background:var(--grad);
  transform:scaleY(0);transform-origin:top;transition:transform .5s var(--ease)}
.cx-lesson:hover .cx-bar{transform:scaleY(1)}

.cx-quote{padding:150px 24px 20px;text-align:center;max-width:860px;margin:0 auto;position:relative}
.cx-quote::before{content:'';position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);
  width:700px;height:380px;background:radial-gradient(ellipse,rgba(236,72,153,.08),transparent 65%);pointer-events:none}
.cx-quote p{position:relative;font-family:var(--serif);font-style:italic;font-weight:400;font-size:clamp(26px,3.2vw,40px);line-height:1.4}
.cx-quote .who{margin-top:24px;font-size:10.5px;letter-spacing:.34em;color:var(--text-faint);font-weight:700}

.cx-next-wrap{padding-top:130px}
.cx-next-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.cx-ncard{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;aspect-ratio:16/10;display:block;text-decoration:none;color:#fff;
  box-shadow:0 8px 24px rgba(74,48,20,.1);
  opacity:0;transform:translateY(28px);transition:opacity .8s var(--ease),transform .8s var(--ease),box-shadow .5s var(--ease)}
.cx-ncard.shown{opacity:1;transform:none}
.cx-ncard:hover{box-shadow:0 22px 50px rgba(74,48,20,.22)}
.cx-ncard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.cx-ncard:hover img{transform:scale(1.07)}
.cx-ncard::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,15,.94) 12%,rgba(13,13,15,.4) 45%,transparent 70%)}
.cx-ninfo{position:absolute;left:20px;right:20px;bottom:16px;z-index:2;text-align:left}
.cx-ninfo .nc{font-size:9px;letter-spacing:.3em;font-weight:700;color:#f5c66a;text-transform:uppercase}
.cx-ninfo h4{font-family:var(--serif);font-weight:500;font-size:22px;margin-top:6px;line-height:1.15;color:#fff}
.cx-ninfo .go{position:absolute;right:0;bottom:2px;font-size:15px;color:#fff;opacity:0;transform:translateX(-8px);transition:all .4s var(--ease)}
.cx-ncard:hover .go{opacity:1;transform:none}

.cx-sticky{position:fixed;left:50%;bottom:26px;transform:translate(-50%,120px);z-index:90;
  display:flex;align-items:center;gap:22px;background:rgba(255,253,248,.86);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  border:1px solid var(--line);border-radius:100px;padding:10px 12px 10px 26px;
  box-shadow:0 18px 50px rgba(74,48,20,.18);transition:transform .7s var(--ease)}
.cx-sticky.on{transform:translate(-50%,0)}
.cx-sticky .t{font-size:12px;font-weight:600;letter-spacing:.04em;color:var(--text)}
.cx-sticky .m{font-size:10px;color:var(--text-faint);letter-spacing:.2em;font-weight:600}
.cx-sticky .cx-btn{padding:12px 26px}

.cx-reveal{opacity:0;transform:translateY(40px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.cx-reveal.shown{opacity:1;transform:translateY(0)}

/* ══════════════════════════════════════════
   LESSON — paper sheet
══════════════════════════════════════════ */
.is-lesson .cx-nav,.is-lesson .cx-nav.scrolled{background:rgba(13,13,15,.94);border-bottom:1px solid rgba(255,255,255,.06)}
.is-lesson .cx-logo{color:#f5f2ee}
.is-lesson .cx-crumb{color:rgba(245,242,238,.6)}
.is-lesson .cx-crumb:hover{color:#f5f2ee}
.is-lesson .cx-crumb .back{border-color:rgba(245,242,238,.09)}
.is-lesson .cx-crumb:hover .back{border-color:rgba(245,242,238,.4)}

.cx-sheet{max-width:1400px;margin:118px auto 0;background:var(--paper);border-radius:26px;
  border:1px solid rgba(33,31,28,.06);box-shadow:0 30px 90px rgba(33,31,28,.13)}
.cx-page{padding:64px 56px 40px;display:grid;grid-template-columns:170px minmax(0,680px) 250px;gap:60px;justify-content:center}
@media(min-width:1640px){
  .cx-sheet{max-width:1520px}
  .cx-page{grid-template-columns:200px minmax(0,750px) 270px;gap:78px}
  .cx-article p{font-size:17.5px}
}

.cx-toc{position:sticky;top:110px;align-self:start;font-size:12px}
.cx-toc .tl{color:var(--ink-faint);letter-spacing:.34em;font-size:9.5px;font-weight:700;margin-bottom:20px}
.cx-toc a{position:relative;display:flex;align-items:baseline;gap:13px;color:var(--ink-dim);text-decoration:none;
  padding:10px 0 10px 20px;margin-left:2px;border-left:1.5px solid rgba(33,31,28,.12);
  font-size:12.5px;line-height:1.45;transition:color .35s var(--ease)}
.cx-toc a i{font-family:var(--serif);font-style:italic;font-size:13.5px;color:var(--ink-faint);flex-shrink:0;transition:color .35s}
.cx-toc a:hover{color:var(--ink)}
.cx-toc a.on{color:var(--ink);font-weight:600}
.cx-toc a.on::before{content:'';position:absolute;left:-1.5px;top:22%;bottom:22%;width:3px;border-radius:3px;
  background:var(--grad);box-shadow:0 0 8px rgba(236,72,153,.3)}
.cx-toc a.on i{background:linear-gradient(135deg,#ec4899,#8b5cf6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

.cx-article{padding-bottom:40px}
.cx-kicker{font-size:10px;letter-spacing:.36em;font-weight:700;text-transform:uppercase;
  opacity:0;animation:cxFadeUp .9s var(--ease) .15s forwards}
.cx-kicker span{color:var(--ink-faint)}
.cx-article h1{font-family:var(--serif);font-weight:500;font-size:clamp(34px,4.6vw,56px);line-height:1.12;margin-top:18px;color:var(--ink);
  opacity:0;animation:cxFadeUp 1s var(--ease) .3s forwards}
.cx-standfirst{margin-top:24px;font-family:var(--serif);font-style:italic;font-size:21px;line-height:1.55;color:var(--ink-dim);font-weight:400;
  white-space:pre-line;opacity:0;animation:cxFadeUp 1s var(--ease) .5s forwards}
.cx-meta-row{display:flex;align-items:center;gap:16px;margin-top:28px;padding-bottom:34px;border-bottom:1px solid var(--pline);
  flex-wrap:wrap;opacity:0;animation:cxFadeUp 1s var(--ease) .65s forwards}
.cx-meta-row .m{font-size:10px;letter-spacing:.26em;color:var(--ink-faint);font-weight:600;text-transform:uppercase}
.cx-meta-row .sep{width:3px;height:3px;border-radius:50%;background:var(--ink-faint)}

.cx-sect{margin-top:64px;scroll-margin-top:120px}
.cx-sect h2{position:relative;font-family:var(--serif);font-weight:500;font-size:31px;line-height:1.2;margin-bottom:22px;color:var(--ink)}
.cx-sect h2::before{content:attr(data-n);position:absolute;left:-58px;top:4px;font-style:italic;font-weight:400;font-size:19px;color:var(--ink-faint);opacity:.7}
.cx-article p{font-size:16.5px;font-weight:400;line-height:1.95;color:var(--body);margin-bottom:22px}
.cx-figure{margin:34px 0;border-radius:16px;overflow:hidden;position:relative;clear:right;box-shadow:0 12px 34px rgba(33,31,28,.12)}
.cx-figure img{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
.cx-figure figcaption{position:absolute;left:0;right:0;bottom:0;padding:30px 20px 12px;font-size:10.5px;letter-spacing:.14em;color:rgba(255,255,255,.75);
  background:linear-gradient(to top,rgba(13,13,15,.6),transparent);text-transform:uppercase}

.cx-dropcap::first-letter{font-family:var(--serif);font-size:64px;line-height:.85;float:left;padding:6px 12px 0 0;
  background:linear-gradient(135deg,#ec4899,#8b5cf6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

.cx-keypts{margin:38px 0 10px;background:var(--pcard);border:1px solid rgba(33,31,28,.08);border-left:2px solid #1fae93;
  border-radius:16px;padding:28px 30px;box-shadow:0 6px 22px rgba(33,31,28,.06)}
.cx-keypts .kh{display:flex;align-items:center;gap:12px;font-size:11px;letter-spacing:.3em;font-weight:700;color:#1fae93;margin-bottom:18px}
.cx-keypts .kh::before{content:'✦';font-size:12px}
.cx-keypts .kp{display:flex;gap:14px;padding:11px 0;font-size:14.5px;color:var(--body);font-weight:400;line-height:1.75;border-top:1px solid rgba(33,31,28,.06)}
.cx-keypts .kp:first-of-type{border-top:none}
.cx-keypts .kp::before{content:'';width:5px;height:5px;border-radius:50%;background:#1fae93;opacity:.75;flex-shrink:0;margin-top:10px}

.cx-pull{margin:52px -60px 52px -30px;padding:26px 0;border-top:1px solid var(--pline);border-bottom:1px solid var(--pline);
  font-family:var(--serif);font-style:italic;font-weight:400;font-size:29px;line-height:1.45;color:var(--ink);text-align:center}

@media(min-width:1240px){
  /* Right gutter is reserved for section margin notes — figures and
     key-points stay inside the text column (no right bleed) so their
     right edge lines up with the body text and never covers the note. */
  .cx-figure{margin-right:0}
  .cx-keypts{margin-right:0}
}
@media(max-width:1239px){
  .cx-pull{margin-left:0;margin-right:0}
}

.cx-rv{opacity:0;transform:translateY(26px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.cx-rv.shown{opacity:1;transform:none}

.cx-lesson-nav{margin-top:80px;padding-top:38px;border-top:1px solid var(--pline);display:flex;justify-content:space-between;align-items:center;gap:16px}
.cx-lnav{display:inline-flex;align-items:center;gap:12px;font-size:11px;letter-spacing:.26em;font-weight:700;
  padding:15px 30px;border-radius:100px;transition:all .4s var(--ease);border:none;cursor:pointer;font-family:var(--sans)}
.cx-lnav.prev{color:var(--ink-faint);border:1px solid var(--pline);background:none}
.cx-lnav.prev:disabled{pointer-events:none;opacity:.55}
.cx-lnav.prev:hover:not(:disabled){color:var(--ink);border-color:rgba(33,31,28,.28)}
.cx-lnav.next{color:#fff;background:var(--grad);box-shadow:0 8px 22px rgba(236,72,153,.22)}
.cx-lnav.next:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 12px 30px rgba(236,72,153,.3)}
.cx-lnav.next:disabled{opacity:.35;pointer-events:none}
.cx-lnav .a{transition:transform .35s var(--ease)}
.cx-lnav.next:hover .a{transform:translateX(5px)}

.cx-upnext{margin-top:56px}
.cx-upnext .ul{font-size:10px;letter-spacing:.36em;color:var(--ink-faint);font-weight:700;margin-bottom:16px}
.cx-up-card{display:grid;grid-template-columns:150px 1fr auto;gap:24px;align-items:center;background:var(--pcard);
  border:1px solid rgba(33,31,28,.08);border-radius:16px;padding:16px;cursor:pointer;text-align:left;width:100%;font-family:var(--sans);
  box-shadow:0 6px 22px rgba(33,31,28,.06);transition:all .45s var(--ease)}
.cx-up-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(33,31,28,.12)}
.cx-up-card .ut{width:150px;aspect-ratio:16/10;border-radius:10px;overflow:hidden}
.cx-up-card .ut img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
.cx-up-card:hover .ut img{transform:scale(1.06)}
.cx-up-card .uk{font-size:9px;letter-spacing:.3em;font-weight:700;text-transform:uppercase}
.cx-up-card h4{font-size:15.5px;font-weight:600;color:var(--ink);margin-top:7px;line-height:1.45}
.cx-up-card .ua{color:var(--ink-dim);font-size:16px;padding-right:12px;transition:all .35s var(--ease)}
.cx-up-card:hover .ua{color:var(--ink);transform:translateX(5px)}

/* ---------- FOOTER ---------- */
.cx-footer{margin-top:140px;border-top:1px solid var(--line);padding:44px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:18px;
  color:var(--text-faint);font-size:12px;background:linear-gradient(to bottom,#FAF6F0,#F3EDE3)}
.is-lesson .cx-footer{margin-top:90px;background:linear-gradient(to bottom,#eee8db,#e6dfd0);border-top:1px solid rgba(33,31,28,.1);color:var(--ink-dim)}
.cx-footer .links{display:flex;gap:28px}
.cx-footer a{color:inherit;text-decoration:none;opacity:.75;transition:opacity .3s}
.cx-footer a:hover{opacity:1}
.cx-footer .brand{color:var(--ink);font-weight:700}
.cx-footer .love{color:var(--pink)}

.cx a:focus-visible,.cx button:focus-visible{outline:2px solid rgba(236,72,153,.7);outline-offset:3px;border-radius:6px}

/* ---------- STATES ---------- */
.cx-state{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
  background:#FAF6F0;color:#211f1c;font-family:'Inter',sans-serif;text-align:center;padding:24px}
.cx-state p{font-size:15px;color:rgba(33,31,28,.62)}
.cx-state button{font-size:11px;letter-spacing:.24em;text-transform:uppercase;font-weight:700;color:#ec4899;
  background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif}

@media(max-width:1024px){
  .cx-about{grid-template-columns:1fr}
  .cx-lesson{grid-template-columns:1fr;padding:20px 14px}
  .cx-lthumb{width:100%}
  .cx-lright{flex-direction:row;align-items:center;justify-content:flex-start}
  .cx-next-grid{grid-template-columns:1fr}
  .cx-nav,.cx-nav.scrolled{padding:16px 22px}
  .cx-section{padding:0 22px}
  .cx-hero-content{padding:0 22px 60px}
  .cx-hero-veil{background:
    linear-gradient(to bottom,rgba(250,246,240,.25) 0%,rgba(250,246,240,.1) 22%,rgba(250,246,240,.86) 62%,var(--bg) 98%)}
  .cx-learn-grid{grid-template-columns:1fr}
  .cx-scroll{display:none}
}
@media(max-width:960px){
  .cx-sheet{margin-top:92px;border-radius:0;box-shadow:none;border:none}
  .cx-page{grid-template-columns:minmax(0,1fr);padding:40px 22px 0}
  .cx-sect h2::before{display:none}
  .cx-toc{display:none}
  .cx-up-card{grid-template-columns:110px 1fr auto}
  .cx-sticky{left:16px;right:16px;transform:translateY(120px)}
  .cx-sticky.on{transform:translateY(0)}
}
@media(prefers-reduced-motion:reduce){
  .cx *,.cx *::before,.cx *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  .cx-hero h1 .line span{transform:none}
  .cx-chips,.cx-promise,.cx-hero-actions,.cx-scroll,.cx-kicker,.cx-article h1,.cx-standfirst,.cx-meta-row{opacity:1}
  .cx-reveal,.cx-learn,.cx-lesson,.cx-ncard,.cx-rv{opacity:1;transform:none}
}

/* ── Section margin notes (right-gutter asides) ─────────────────────── */
.cx-sect{position:relative}
.cx-notes{position:absolute; top:3px; left:calc(100% + 56px); width:238px}
/* Noted sections must keep the right gutter clear for the note — cancel the
   -120px image/keypoints bleed that would otherwise overlap it (≥1240px). */
.cx-sect.has-note .cx-figure,
.cx-sect.has-note .cx-keypts{margin-right:0}
.cx-note{border-top:2px solid var(--note-accent,#D45A79); padding-top:15px}
.cx-note + .cx-note{margin-top:30px}
.cx-note .cx-note-label{
  font-size:11px; letter-spacing:.24em; font-weight:700; text-transform:uppercase;
  color:var(--note-accent,#D45A79); margin:0 0 12px;
}
.cx-note p{
  margin:0; font-size:14px; line-height:1.72; color:var(--ink-dim);
  font-family:var(--sans,inherit); font-weight:400;
}
.cx-note i,.cx-note em{font-style:italic}
.cx-note b,.cx-note strong{font-weight:600;color:var(--ink)}
@media(min-width:1640px){ .cx-notes{left:calc(100% + 74px); width:250px} }
/* On narrow layouts the gutter is gone — drop the notes inline under the heading. */
@media(max-width:1024px){
  .cx-notes{position:static; width:auto; margin:22px 0 4px}
  .cx-note{
    padding:16px 18px; border-top:none;
    border-left:3px solid var(--note-accent,#D45A79);
    background:var(--pcard,rgba(33,31,28,.03)); border-radius:0 10px 10px 0;
  }
  .cx-note + .cx-note{margin-top:14px}
  .cx-note .cx-note-label{margin-bottom:8px}
}
`;
