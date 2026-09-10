// // "use client";

// // import { useState, useEffect, useRef, useCallback } from "react";
// // import { COURSES, COURSE_CATEGORIES } from "@/constants/courses";

// // /* ─────────────────────────────────────────────────────────────
// //    Normalise a DB / static course into the shape the UI expects
// // ───────────────────────────────────────────────────────────── */
// // function normalizeCourse(c) {
// //   return {
// //     ...c,
// //     id:          c.courseId || c._id || c.slug,
// //     description: c.description || c.subtitle || "",
// //     subtitle:    c.subtitle   || "",
// //     category:    c.category   || "Growth",
// //     accent:      c.accent     || "#C9A96E",
// //     thumbnail:   c.thumbnail  || c.heroThumb || "",
// //     heroThumb:   c.heroThumb  || c.thumbnail || "",
// //     tag:         c.tag        || c.level || "",
// //     badge:       c.badge      || "",
// //     stat:        c.stat       || "",
// //     statLabel:   c.statLabel  || "",
// //     level:       c.level      || "",
// //     chapters:    Array.isArray(c.chapters) ? c.chapters : [],
// //   };
// // }

// // /* Editorial helpers ─────────────────────────────────────────── */
// // const PORTRAITS = [
// //   "photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d",
// //   "photo-1534528741775-53994a69daeb", "photo-1500648767791-00dcc994a43e",
// //   "photo-1517841905240-472988babdf9", "photo-1524504388940-b1c1722653e1",
// //   "photo-1506794778202-cad84cf45f1d", "photo-1531123897727-8f129e1688ce",
// //   "photo-1539571696357-5a69c17a67c6", "photo-1544005313-94ddf0286df2",
// // ].map(id => `https://images.unsplash.com/${id}?w=460&q=70&fit=crop`);

// // const FAN = [
// //   { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=70", cap: "shared a collab win" },
// //   { img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=70", cap: "posted a studio setup" },
// //   { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=70", cap: "hit 10× reach" },
// // ];

// // const MEMBER_IMG = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=70";

// // /* Goal → real category from constants/courses.js */
// // const GOALS = [
// //   ["Build strong creator foundations", "Foundations"],
// //   ["Create better content, faster",    "Content"],
// //   ["Set up my studio & workflow",      "Setup"],
// //   ["Grow my audience & reach",         "Growth"],
// //   ["Turn my content into income",      "Monetization"],
// //   ["Scale into a lasting career",      "Scaling"],
// // ];

// // const PILL_ICON = {
// //   All: "✦", Foundations: "◈", Content: "✎", Setup: "⚙",
// //   Growth: "↗", Monetization: "₹", Operations: "⚖", Scaling: "⤢",
// // };

// // const PERKS = [
// //   ["▣", "All 8 courses and original playbooks"],
// //   ["♫", "Audio-ready lessons for learning on the go"],
// //   ["⇩", "Download toolkits, templates & checklists"],
// //   ["▤", "Learn on desktop, tablet, or mobile"],
// //   ["☆", "New resources added every month"],
// //   ["✓", "Verified creator community access"],
// // ];

// // const COMMUNITY = [
// //   ["✦", "Stay Inspired", "Discover trending topics, get quick answers, and find your people among verified creators."],
// //   ["◈", "Stay Connected", "Follow your peers and mentors, exchange perspectives, and share some love."],
// //   ["✎", "Keep Creating", "Explore new ideas for your next piece of content, post your work, and get feedback."],
// // ];

// // const FAQS = [
// //   ["What is the Creator Knowledge Hub?", "It's Fameo's learning centre — 8 in-depth courses plus playbooks, toolkits, and checklists covering everything from creator foundations to monetisation and scaling, built from data across 12,000 Indian creators."],
// //   ["Who are these courses for?", "Verified creators, influencers, and public figures at every stage — whether you're picking your niche or building a team around a decade-long career."],
// //   ["Are the resources free?", "Core foundations are free for every verified Fameo member. Playbooks, masterclasses, and toolkits are part of the Pro and Elite memberships."],
// //   ["How often is new content added?", "New courses, reports, and checklists are added every month — including trend reports like The Creator Economy Report."],
// //   ["Can I learn on mobile?", "Yes. Every course works on desktop, tablet, and mobile, with bite-sized lessons designed for learning between shoots."],
// // ];

// // const STATEMENT_WORDS = [
// //   ["Meet", 0], ["the", 0], ["best", 1], ["courses.", 1],
// //   ["New", 0], ["resources", 0], ["added", 0], ["every", 0], ["month.", 0],
// // ];

// // /* ─────────────────────────────────────────────────────────────
// //    STYLES — premium cream ("parchment & gold") theme
// // ───────────────────────────────────────────────────────────── */
// // const CSS = `
// // @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

// // *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
// // html{scroll-behavior:smooth}
// // body{background:#FAF6F0;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}

// // /* hide fixed nav when course reader is open */
// // body.cr-open header,body.cr-open nav,body.cr-open [data-header]{display:none!important}
// // body.cr-open main,body.cr-open .page-wrapper{padding-top:0!important;margin-top:0!important}

// // .rp{
// //   --bg:#FAF6F0; --bg-soft:#FAF6F0; --card:#FFFDF8;
// //   --ink:#2A1E14; --dim:rgba(42,30,20,.62); --faint:rgba(42,30,20,.40);
// //   --gold:#B0894E; --gold-l:#C9A96E;
// //   --rose:#C24E74;
// //   --grad:linear-gradient(135deg,#D65B7A 0%,#BE4C86 52%,#8A57A8 100%);
// //   --line:rgba(42,30,20,.12);
// //   --shadow:0 24px 60px rgba(74,48,20,.14);
// //   --serif:'Cormorant Garamond',Georgia,serif;
// //   --sans:'DM Sans',-apple-system,sans-serif;
// //   --ease:cubic-bezier(.22,1,.36,1);
// //   background:var(--bg);color:var(--ink);font-family:var(--sans);
// //   overflow-x:hidden;min-height:100vh;position:relative;
// // }
// // .rp ::selection{background:rgba(194,78,116,.22)}
// // .rp-section{max-width:1320px;margin:0 auto;padding:0 48px}
// // .rp-eyebrow{display:flex;align-items:center;gap:16px;color:var(--gold);font-size:10.5px;letter-spacing:.34em;font-weight:700;text-transform:uppercase;margin-bottom:30px}
// // .rp-eyebrow::after{content:'';flex:1;height:1px;background:var(--line)}

// // /* ---------- SPLIT HERO ---------- */
// // .rp-hero{position:relative;max-width:1440px;margin:0 auto;padding:132px 48px 70px;
// //   display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center;min-height:92vh}
// // .rp-kicker{display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.4em;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:24px;
// //   opacity:0;animation:rpFade 1s var(--ease) .2s forwards}
// // .rp-kicker::before{content:'';width:34px;height:1.5px;background:var(--gold)}
// // .rp-h1{font-family:var(--serif);font-weight:500;font-size:clamp(46px,5.4vw,84px);line-height:1.02;letter-spacing:-.01em}
// // .rp-h1 .line{display:block;overflow:hidden}
// // .rp-h1 .line span{display:block;transform:translateY(115%);animation:rpRise 1.15s var(--ease) forwards}
// // .rp-h1 .line:nth-child(2) span{animation-delay:.14s}
// // .rp-h1 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// // @keyframes rpRise{to{transform:translateY(0)}}
// // @keyframes rpFade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
// // .rp-sub{margin-top:22px;color:var(--dim);font-size:16px;line-height:1.75;max-width:460px;font-weight:400;
// //   opacity:0;animation:rpFade 1s var(--ease) .65s forwards}
// // .rp-goal{margin-top:36px;opacity:0;animation:rpFade 1s var(--ease) .9s forwards}
// // .rp-goal-t{font-size:11.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin-bottom:14px}
// // .rp-goal-t::before{content:'';display:block;width:34px;height:3px;background:var(--grad);border-radius:2px;margin-bottom:14px}
// // .rp-goal-list{display:flex;flex-direction:column;gap:9px;max-width:460px}
// // .rp-goal-item{display:flex;align-items:center;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:13px;
// //   padding:14px 18px;cursor:pointer;font-size:14px;color:var(--dim);font-weight:500;transition:all .35s var(--ease);box-shadow:0 1px 0 rgba(74,48,20,.03)}
// // .rp-goal-item:hover{border-color:rgba(194,78,116,.4);color:var(--ink);transform:translateX(6px);box-shadow:0 10px 26px rgba(74,48,20,.09)}
// // .rp-goal-item .box{width:19px;height:19px;border-radius:6px;border:1.5px solid rgba(42,30,20,.25);display:grid;place-items:center;
// //   transition:all .3s var(--ease);flex-shrink:0;font-size:11px;color:#fff}
// // .rp-goal-item .box::after{content:'✓';opacity:0;transform:scale(.4);transition:all .3s var(--ease)}
// // .rp-goal-item.on{color:var(--ink);border-color:rgba(194,78,116,.45)}
// // .rp-goal-item.on .box{background:var(--grad);border-color:transparent}
// // .rp-goal-item.on .box::after{opacity:1;transform:scale(1)}
// // .rp-goal-item .go{margin-left:auto;opacity:0;transform:translateX(-8px);transition:all .3s var(--ease);color:var(--rose);font-size:16px}
// // .rp-goal-item:hover .go{opacity:1;transform:translateX(0)}

// // .rp-hero-art{position:relative;height:80vh;min-height:520px;display:flex;gap:16px;overflow:hidden;border-radius:22px;
// //   opacity:0;animation:rpFade 1.2s var(--ease) .5s forwards}
// // .rp-hero-art::before,.rp-hero-art::after{content:'';position:absolute;left:0;right:0;height:130px;z-index:3;pointer-events:none}
// // .rp-hero-art::before{top:0;background:linear-gradient(to bottom,var(--bg),transparent)}
// // .rp-hero-art::after{bottom:0;background:linear-gradient(to top,var(--bg),transparent)}
// // .rp-mos-col{flex:1;display:flex;flex-direction:column;gap:16px}
// // .rp-mos-col.up .rp-mos-inner{animation:rpUp 42s linear infinite}
// // .rp-mos-col.down .rp-mos-inner{animation:rpDown 48s linear infinite}
// // .rp-mos-inner{display:flex;flex-direction:column;gap:16px}
// // @keyframes rpUp{to{transform:translateY(-50%)}}
// // @keyframes rpDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}
// // .rp-mos-inner img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:16px;display:block;
// //   filter:saturate(.96);box-shadow:0 12px 30px rgba(74,48,20,.12);transition:filter .4s,transform .4s var(--ease)}
// // .rp-mos-inner img:hover{filter:saturate(1.08);transform:scale(1.02)}

// // /* ---------- MEMBERSHIP PERKS SPLIT ---------- */
// // .rp-mem{padding-top:120px;display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
// // .rp-mem h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.8vw,54px);line-height:1.1;letter-spacing:-.01em}
// // .rp-btns{display:flex;gap:14px;margin-top:34px;flex-wrap:wrap}
// // .rp-btn{position:relative;display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-size:11.5px;letter-spacing:.18em;font-weight:700;
// //   text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;transition:all .4s var(--ease);font-family:var(--sans)}
// // .rp-btn-primary{background:var(--grad);color:#fff;box-shadow:0 10px 30px rgba(194,78,116,.32)}
// // .rp-btn-primary:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(194,78,116,.42)}
// // .rp-btn-ghost{background:transparent;color:var(--ink);border:1px solid rgba(42,30,20,.22)}
// // .rp-btn-ghost:hover{border-color:var(--rose);color:var(--rose);transform:translateY(-3px)}
// // .rp-btn .arr{transition:transform .35s var(--ease)}
// // .rp-btn:hover .arr{transform:translateX(5px)}
// // .rp-perks{display:flex;flex-direction:column;gap:2px}
// // .rp-perk{display:flex;align-items:center;gap:18px;font-size:15px;color:var(--dim);padding:15px 6px;border-bottom:1px solid var(--line);
// //   opacity:0;transform:translateX(26px);transition:all .7s var(--ease)}
// // .rp-perk.shown{opacity:1;transform:none}
// // .rp-perk:hover{color:var(--ink)}
// // .rp-perk .pico{width:40px;height:40px;border-radius:12px;background:var(--card);border:1px solid var(--line);display:grid;place-items:center;
// //   font-size:16px;flex-shrink:0;color:var(--rose);transition:all .35s var(--ease)}
// // .rp-perk:hover .pico{border-color:rgba(194,78,116,.4);transform:translateY(-2px);box-shadow:0 8px 20px rgba(194,78,116,.16)}

// // /* ---------- STATEMENT REVEAL ---------- */
// // .rp-statement{padding:150px 24px 140px;text-align:center;max-width:1050px;margin:0 auto}
// // .rp-statement h2{font-family:var(--serif);font-weight:500;font-size:clamp(38px,5.4vw,74px);line-height:1.16;letter-spacing:-.01em}
// // .rp-w{display:inline-block;opacity:.16;transform:translateY(10px);filter:blur(1.4px);
// //   transition:opacity .6s ease,transform .6s var(--ease),filter .6s ease;will-change:opacity}
// // .rp-w.lit{opacity:1;transform:none;filter:blur(0)}
// // .rp-w.accent{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// // .rp-statement p{margin-top:26px;color:var(--gold);font-size:12px;letter-spacing:.32em;font-weight:700;text-transform:uppercase}

// // /* ---------- SHOWCASE CAROUSEL ---------- */
// // .rp-showcase{position:relative;padding:16px 0 0;overflow:hidden}
// // .rp-show-track{display:flex;transition:transform .9s var(--ease);will-change:transform}
// // .rp-slide{flex:0 0 72%;margin:0 14px;position:relative;border-radius:24px;overflow:hidden;aspect-ratio:16/8.2;
// //   transform:scale(.93);opacity:.4;transition:transform .9s var(--ease),opacity .9s var(--ease);cursor:pointer;box-shadow:var(--shadow)}
// // .rp-slide.active{transform:scale(1);opacity:1}
// // .rp-slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 7s ease}
// // .rp-slide.active:hover img{transform:scale(1.05)}
// // .rp-slide::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.82) 4%,transparent 56%),linear-gradient(to right,rgba(30,18,10,.3),transparent 45%)}
// // .rp-slide-info{position:absolute;left:44px;bottom:38px;z-index:2;max-width:74%}
// // .rp-slide-cat{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.28em;font-weight:700;color:var(--gold-l);
// //   background:rgba(30,18,10,.42);backdrop-filter:blur(8px);padding:7px 14px;border-radius:100px;border:1px solid rgba(201,169,110,.35)}
// // .rp-slide-info h3{font-family:var(--serif);font-weight:500;font-size:clamp(28px,3.4vw,50px);line-height:1.06;margin-top:16px;color:#fff;
// //   transform:translateY(14px);opacity:0;transition:all .8s var(--ease) .25s}
// // .rp-slide.active .rp-slide-info h3{transform:none;opacity:1}
// // .rp-slide-start{display:inline-flex;align-items:center;gap:10px;margin-top:18px;font-size:11px;letter-spacing:.26em;font-weight:700;color:#fff;text-transform:uppercase;
// //   opacity:0;transform:translateY(10px);transition:all .8s var(--ease) .4s}
// // .rp-slide.active .rp-slide-start{opacity:1;transform:none}
// // .rp-slide-start .c{width:34px;height:34px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-size:12px;color:#fff}
// // .rp-slide-num{position:absolute;top:24px;right:30px;z-index:2;font-family:var(--serif);font-size:20px;color:rgba(255,255,255,.6)}
// // .rp-show-ctrl{display:flex;align-items:center;justify-content:center;gap:26px;margin-top:34px}
// // .rp-tbtn{width:46px;height:46px;border-radius:50%;background:var(--card);border:1px solid var(--line);color:var(--ink);font-size:16px;cursor:pointer;
// //   transition:all .35s var(--ease)}
// // .rp-tbtn:hover{background:var(--grad);border-color:transparent;color:#fff}
// // .rp-dots{display:flex;gap:8px}
// // .rp-dot{width:22px;height:3px;border-radius:2px;background:rgba(42,30,20,.16);border:none;cursor:pointer;padding:0;transition:all .4s var(--ease)}
// // .rp-dot.active{width:38px;background:var(--rose)}

// // /* ---------- BROWSE: PILLS + AUTO-LOOP ---------- */
// // .rp-browse{padding-top:140px}
// // .rp-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;max-width:980px;margin:0 auto 54px}
// // .rp-pill{display:inline-flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--line);color:var(--dim);
// //   font-family:var(--sans);font-size:12.5px;font-weight:600;padding:12px 22px;border-radius:100px;cursor:pointer;transition:all .4s var(--ease)}
// // .rp-pill .ci{font-size:13px;opacity:.85}
// // .rp-pill:hover{color:var(--ink);border-color:rgba(42,30,20,.28);transform:translateY(-2px)}
// // .rp-pill.active{color:#fff;border-color:transparent;background:var(--grad);box-shadow:0 8px 22px rgba(194,78,116,.28)}
// // .rp-loop-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
// // .rp-loop-head .lh{display:flex;align-items:baseline;gap:16px}
// // .rp-loop-head b{font-family:var(--serif);font-weight:500;font-size:24px}
// // .rp-loop-head .see{color:var(--faint);font-size:12.5px;cursor:pointer;transition:color .3s}
// // .rp-loop-head .see:hover{color:var(--rose)}
// // .rp-loop-nav{display:flex;gap:10px}
// // .rp-loop-outer{position:relative;overflow:hidden}
// // .rp-loop-outer::before,.rp-loop-outer::after{content:'';position:absolute;top:0;bottom:0;width:70px;z-index:3;pointer-events:none}
// // .rp-loop-outer::before{left:0;background:linear-gradient(to right,var(--bg),transparent)}
// // .rp-loop-outer::after{right:0;background:linear-gradient(to left,var(--bg),transparent)}
// // .rp-loop-row{display:flex;gap:20px;overflow-x:auto;scrollbar-width:none;padding-bottom:6px}
// // .rp-loop-row::-webkit-scrollbar{display:none}
// // .rp-tcard{position:relative;flex:0 0 250px;border-radius:16px;overflow:hidden;cursor:pointer;aspect-ratio:3/4.1;
// //   box-shadow:0 8px 24px rgba(74,48,20,.1);transition:transform .5s var(--ease),box-shadow .5s var(--ease)}
// // .rp-tcard:hover{transform:translateY(-6px);box-shadow:0 22px 50px rgba(74,48,20,.2)}
// // .rp-tcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
// // .rp-tcard:hover img{transform:scale(1.08)}
// // .rp-tcard::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.9) 6%,transparent 60%)}
// // .rp-tbadge{position:absolute;top:12px;left:12px;z-index:2;font-size:9px;letter-spacing:.16em;font-weight:700;text-transform:uppercase;
// //   padding:6px 11px;border-radius:100px;backdrop-filter:blur(6px)}
// // .rp-tinfo{position:absolute;left:18px;right:18px;bottom:16px;z-index:2}
// // .rp-tinfo .tc{font-size:9px;letter-spacing:.26em;font-weight:700;color:var(--gold-l);text-transform:uppercase}
// // .rp-tinfo h4{font-family:var(--serif);font-weight:500;font-size:21px;margin-top:6px;line-height:1.14;color:#fff}
// // .rp-tinfo .tm{margin-top:8px;font-size:10.5px;color:rgba(255,255,255,.6);letter-spacing:.05em}

// // /* ---------- COMMUNITY FAN ---------- */
// // .rp-community{padding-top:150px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
// // .rp-community h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
// // .rp-com-rows{margin-top:40px;display:flex;flex-direction:column;gap:30px}
// // .rp-com-row{display:flex;gap:20px;align-items:flex-start;opacity:0;transform:translateY(22px);transition:all .8s var(--ease)}
// // .rp-com-row.shown{opacity:1;transform:none}
// // .rp-com-row .ico{width:48px;height:48px;border-radius:13px;display:grid;place-items:center;font-size:20px;flex-shrink:0;
// //   background:var(--card);border:1px solid var(--line);color:var(--rose);transition:all .4s var(--ease)}
// // .rp-com-row:hover .ico{transform:translateY(-4px) rotate(-6deg);border-color:rgba(194,78,116,.4);box-shadow:0 8px 22px rgba(194,78,116,.2)}
// // .rp-com-row h4{font-size:16px;font-weight:700;color:var(--ink)}
// // .rp-com-row p{color:var(--dim);font-size:14px;line-height:1.7;margin-top:6px;max-width:360px}
// // .rp-fan{position:relative;height:520px}
// // .rp-fan-card{position:absolute;left:50%;top:50%;width:62%;aspect-ratio:4/5;border-radius:16px;overflow:hidden;
// //   background:#fff;padding:10px;box-shadow:0 24px 60px rgba(74,48,20,.28);
// //   transform:translate(-50%,-50%) rotate(0deg);transition:transform 1.1s var(--ease);will-change:transform}
// // .rp-fan-card img{width:100%;height:82%;object-fit:cover;border-radius:9px;display:block}
// // .rp-fan-card .cap{height:18%;display:flex;align-items:center;gap:8px;padding:0 6px}
// // .rp-fan-card .cap .dot{width:24px;height:24px;border-radius:50%;background:var(--grad);flex-shrink:0}
// // .rp-fan-card .cap b{font-size:11px;color:#241a12;font-weight:700}
// // .rp-fan-card .cap span{font-size:9.5px;color:#9b8f80}
// // .rp-fan.shown .rp-fan-card:nth-child(1){transform:translate(-88%,-58%) rotate(-13deg)}
// // .rp-fan.shown .rp-fan-card:nth-child(2){transform:translate(-50%,-46%) rotate(-2deg)}
// // .rp-fan.shown .rp-fan-card:nth-child(3){transform:translate(-14%,-60%) rotate(11deg)}
// // .rp-fan-card:hover{z-index:5}
// // .rp-fan.shown .rp-fan-card:nth-child(1):hover{transform:translate(-88%,-62%) rotate(-10deg) scale(1.04)}
// // .rp-fan.shown .rp-fan-card:nth-child(2):hover{transform:translate(-50%,-50%) rotate(0deg) scale(1.04)}
// // .rp-fan.shown .rp-fan-card:nth-child(3):hover{transform:translate(-14%,-64%) rotate(8deg) scale(1.04)}

// // /* ---------- MEMBERSHIP / PRICING ---------- */
// // .rp-member{padding-top:150px;display:grid;grid-template-columns:1.2fr 1fr;gap:70px;align-items:center}
// // .rp-mv{position:relative;height:480px}
// // .rp-mv-img{position:absolute;inset:0 60px 40px 0;border-radius:20px;overflow:hidden;box-shadow:var(--shadow)}
// // .rp-mv-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 8s ease}
// // .rp-mv:hover .rp-mv-img img{transform:scale(1.06)}
// // .rp-price{position:absolute;right:0;bottom:0;width:300px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;
// //   box-shadow:0 30px 70px rgba(74,48,20,.24)}
// // .rp-price-ico{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#f7e3ec,#efe6f7);display:grid;place-items:center;margin:0 auto 14px;font-size:18px;color:var(--rose)}
// // .rp-price h4{text-align:center;font-size:15px;font-weight:700;line-height:1.4;color:var(--ink)}
// // .rp-tier{display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:11px;padding:13px 16px;margin-top:10px;
// //   font-size:13px;font-weight:700;cursor:pointer;color:var(--ink);transition:all .3s var(--ease)}
// // .rp-tier span{color:var(--dim);font-weight:500;font-size:12px}
// // .rp-tier:hover,.rp-tier.hot{border-color:var(--rose);background:#fdf4f8;transform:translateX(3px)}
// // .rp-pc-btn{margin-top:16px;width:100%;border:none;background:var(--grad);color:#fff;font-family:var(--sans);font-weight:700;font-size:12px;
// //   letter-spacing:.08em;padding:14px;border-radius:11px;cursor:pointer;text-transform:uppercase;transition:all .35s var(--ease)}
// // .rp-pc-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(194,78,116,.4)}
// // .rp-mc h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
// // .rp-mc>p{color:var(--dim);line-height:1.8;margin-top:18px;font-size:15px}
// // .rp-benefits{margin-top:32px;display:flex;flex-direction:column;gap:14px}
// // .rp-benefit{display:flex;align-items:center;gap:14px;font-size:14.5px;color:var(--dim);
// //   opacity:0;transform:translateX(-18px);transition:all .7s var(--ease)}
// // .rp-benefit.shown{opacity:1;transform:none}
// // .rp-benefit .chk{width:22px;height:22px;border-radius:50%;background:rgba(194,78,116,.12);border:1px solid rgba(194,78,116,.4);
// //   display:grid;place-items:center;font-size:10px;color:var(--rose);flex-shrink:0}

// // /* ---------- FAQ ---------- */
// // .rp-faq-wrap{padding-top:150px;max-width:860px}
// // .rp-faq-wrap h2{font-family:var(--serif);font-weight:500;font-size:clamp(32px,3.4vw,48px);margin-bottom:40px}
// // .rp-faq{border-bottom:1px solid var(--line)}
// // .rp-faq-q{width:100%;background:none;border:none;color:var(--ink);font-family:var(--sans);font-size:16px;font-weight:600;text-align:left;
// //   padding:24px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;cursor:pointer;transition:color .3s}
// // .rp-faq-q:hover{color:var(--rose)}
// // .rp-faq-q .chev{flex-shrink:0;width:30px;height:30px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;
// //   font-size:11px;transition:all .5s var(--ease)}
// // .rp-faq.open .rp-faq-q .chev{transform:rotate(180deg);background:var(--grad);border-color:transparent;color:#fff}
// // .rp-faq.open .rp-faq-q{color:var(--ink)}
// // .rp-faq-a{max-height:0;overflow:hidden;transition:max-height .5s var(--ease)}
// // .rp-faq-a p{color:var(--dim);line-height:1.8;font-size:14.5px;padding-bottom:24px;max-width:680px}

// // /* ---------- CTA ---------- */
// // .rp-cta{position:relative;margin-top:140px;padding:120px 24px;text-align:center;overflow:hidden;border-top:1px solid var(--line)}
// // .rp-cta::before{content:'';position:absolute;left:50%;top:-40%;width:900px;height:600px;transform:translateX(-50%);
// //   background:radial-gradient(ellipse,rgba(194,78,116,.12),transparent 65%);pointer-events:none}
// // .rp-cta h2{position:relative;font-family:var(--serif);font-weight:500;font-size:clamp(38px,5vw,68px);line-height:1.1}
// // .rp-cta h2 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// // .rp-cta p{position:relative;color:var(--dim);margin-top:20px;font-size:16px}
// // .rp-cta .rp-btn{margin-top:38px}

// // /* ---------- REVEAL ---------- */
// // .rp-reveal{opacity:0;transform:translateY(38px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
// // .rp-reveal.shown{opacity:1;transform:none}

// // /* ══════════════════════════════════════════
// //    COURSE READER — full screen fixed overlay
// // ══════════════════════════════════════════ */
// // .cr-root{position:fixed;inset:0;z-index:9999;background:#fff;display:flex;flex-direction:column;font-family:'DM Sans',sans-serif;overflow:hidden}
// // .cr-topbar{height:52px;flex-shrink:0;display:flex;align-items:center;padding:0 28px;border-bottom:1px solid #efe7d9;background:#fff;gap:16px}
// // .cr-back{display:flex;align-items:center;gap:6px;font-size:12px;color:#9b8f80;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;padding:0;transition:color .15s;letter-spacing:.02em}
// // .cr-back:hover{color:#2A1E14}
// // .cr-back svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.8}
// // .cr-topbar-title{font-size:13px;color:#2A1E14;font-weight:500;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
// // .cr-topbar-meta{font-size:11px;color:#c3b8a6;flex-shrink:0}
// // .cr-body{flex:1;display:grid;grid-template-columns:264px 1fr;overflow:hidden}
// // .cr-sidebar{border-right:1px solid #efe7d9;overflow-y:auto;padding:28px 0;scrollbar-width:none;background:#fffdf8}
// // .cr-sidebar::-webkit-scrollbar{display:none}
// // .cr-sb-top{padding:0 22px 20px;border-bottom:1px solid #f1eadd;margin-bottom:6px}
// // .cr-sb-course{font-size:14px;font-weight:700;color:#2A1E14;line-height:1.35;margin-bottom:3px}
// // .cr-sb-cat{font-size:10px;color:#c3b8a6;letter-spacing:.05em}
// // .cr-sb-chapter{padding:14px 22px 0}
// // .cr-sb-ch-label{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;display:block;margin-bottom:8px}
// // .cr-sb-lesson{padding:9px 0;border-bottom:1px solid #f4eee2;cursor:pointer;transition:all .12s}
// // .cr-sb-lesson:last-child{border-bottom:none}
// // .cr-sb-lesson:hover .cr-sb-lesson-title{color:#2A1E14}
// // .cr-sb-lesson.on .cr-sb-lesson-title{color:#2A1E14;font-weight:600}
// // .cr-sb-lesson-title{font-size:13px;font-weight:400;color:#6d6152;line-height:1.35;display:block;transition:color .12s}
// // .cr-content{overflow-y:auto;background:#fff;scrollbar-width:thin;scrollbar-color:#e6ddcd transparent}
// // .cr-content::-webkit-scrollbar{width:3px}
// // .cr-content::-webkit-scrollbar-thumb{background:#e6ddcd;border-radius:2px}
// // .cr-inner{max-width:760px;padding:52px 64px 120px;margin:0 auto}
// // .cr-ov-hero{width:100%;border-radius:14px;overflow:hidden;margin-bottom:36px;position:relative;height:380px}
// // .cr-ov-hero img{width:100%;height:100%;object-fit:cover;display:block}
// // .cr-ov-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.85) 0%,rgba(30,18,10,.06) 55%,transparent 100%)}
// // .cr-ov-cnt{position:absolute;bottom:0;left:0;right:0;padding:28px 34px}
// // .cr-ov-tag{display:inline-block;font-size:8px;letter-spacing:.16em;text-transform:uppercase;padding:3px 10px;border-radius:3px;font-weight:600;margin-bottom:10px}
// // .cr-ov-title{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,3.5vw,40px);font-weight:500;color:#fff;line-height:1.1;letter-spacing:-.015em;margin-bottom:7px}
// // .cr-ov-sub{font-size:13px;color:rgba(255,255,255,0.6);font-weight:300}
// // .cr-stats{display:grid;grid-template-columns:repeat(4,1fr);border:1.5px solid #f1eadd;border-radius:10px;overflow:hidden;margin-bottom:26px}
// // .cr-stat{padding:12px 14px;text-align:center;border-right:1px solid #f1eadd}
// // .cr-stat:last-child{border-right:none}
// // .cr-stat-n{display:block;font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:500;color:#2A1E14;line-height:1}
// // .cr-stat-l{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#b3a794;margin-top:3px}
// // .cr-ov-desc{font-size:14px;font-weight:400;line-height:1.85;color:#514637;margin-bottom:24px}
// // .cr-learn-h{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:#2A1E14;margin-bottom:14px}
// // .cr-learn-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:26px}
// // .cr-learn-item{display:flex;gap:7px;align-items:flex-start}
// // .cr-learn-ck{font-size:11px;font-weight:700;flex-shrink:0;margin-top:2px}
// // .cr-learn-text{font-size:12px;color:#615540;line-height:1.5}
// // .cr-start{font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:12px 26px;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-family:'DM Sans',sans-serif;transition:opacity .2s}
// // .cr-start:hover{opacity:.85}
// // .cr-art{max-width:760px;padding:40px 64px 100px;margin:0 auto}
// // .cr-art-ey{display:block;font-size:10px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;margin-bottom:10px}
// // .cr-art-h{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,3.5vw,40px);font-weight:500;color:#2A1E14;line-height:1.1;letter-spacing:-.015em;margin-bottom:12px}
// // .cr-art-meta{display:flex;align-items:center;gap:8px;margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid #f4eee2}
// // .cr-art-mi{font-size:11px;color:#9b8f80}
// // .cr-art-md{width:3px;height:3px;border-radius:50%;background:#ddd2bf;flex-shrink:0}
// // .cr-art-imgwrap{width:100%;border-radius:10px;overflow:hidden;margin-bottom:28px;border:1px solid #f1eadd}
// // .cr-art-img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
// // .cr-art-desc{font-size:15px;font-weight:400;line-height:1.9;color:#514637;margin-bottom:28px;white-space:pre-line}
// // .cr-section{margin-bottom:36px}
// // .cr-section-h{font-size:15px;font-weight:600;color:#2A1E14;line-height:1.35;margin-bottom:12px;letter-spacing:-.01em}
// // .cr-section-img{width:100%;border-radius:8px;overflow:hidden;margin-bottom:16px;border:1px solid #f1eadd}
// // .cr-section-img img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
// // .cr-section-body{font-size:15px;font-weight:400;line-height:1.9;color:#463b2d;white-space:pre-line}
// // .cr-kp{border-radius:10px;padding:18px 22px;margin-top:20px}
// // .cr-kp-h{display:flex;align-items:center;gap:8px;margin-bottom:12px}
// // .cr-kp-icon{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;flex-shrink:0}
// // .cr-kp-title{font-size:11px;font-weight:700;color:#2A1E14;letter-spacing:.04em;border-left:3px solid;padding-left:8px}
// // .cr-kp-item{display:flex;gap:9px;padding:7px 0;border-bottom:1px solid rgba(42,30,20,0.06);align-items:flex-start}
// // .cr-kp-item:last-child{border-bottom:none}
// // .cr-kp-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0;margin-top:9px;opacity:.75}
// // .cr-kp-text{font-size:13px;color:#514637;line-height:1.7}
// // .cr-sect-rule{height:1px;background:#f7f1e6;margin:28px 0}
// // .cr-nav{display:flex;justify-content:space-between;align-items:center;padding:20px 0 28px;border-top:1px solid #f1eadd;margin-bottom:24px}
// // .cr-nav-prev{font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:9px 18px;border:1.5px solid #e9e0d0;border-radius:6px;background:#fff;color:#6d6152;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
// // .cr-nav-prev:hover:not(:disabled){background:#faf5ec}
// // .cr-nav-prev:disabled{opacity:.3;cursor:not-allowed}
// // .cr-nav-next{font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:9px 22px;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-family:'DM Sans',sans-serif;transition:opacity .2s}
// // .cr-nav-next:hover:not(:disabled){opacity:.85}
// // .cr-nav-next:disabled{opacity:.3;cursor:not-allowed}
// // .cr-upnext{cursor:pointer;margin-top:4px}
// // .cr-un-label{display:block;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#b3a794;margin-bottom:8px}
// // .cr-un-card{display:flex;align-items:center;gap:13px;padding:13px 15px;border:1.5px solid;border-radius:10px;transition:background .15s}
// // .cr-un-card:hover{background:#faf5ec}
// // .cr-un-img{width:66px;height:44px;border-radius:5px;object-fit:cover;flex-shrink:0}
// // .cr-un-info{flex:1}
// // .cr-un-eye{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:2px}
// // .cr-un-title{display:block;font-size:13px;font-weight:500;color:#2A1E14}
// // .cr-un-arr{font-size:16px}

// // @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
// // .fu{animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both}
// // @keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
// // .si{animation:slideIn .35s cubic-bezier(.22,1,.36,1) both}

// // @media(max-width:1024px){
// //   .rp-hero{grid-template-columns:1fr;padding-top:110px}
// //   .rp-hero-art{height:400px;order:-1;margin-top:20px}
// //   .rp-mem,.rp-community,.rp-member{grid-template-columns:1fr}
// //   .rp-fan{height:420px}
// //   .rp-mv{height:420px}
// //   .rp-slide{flex-basis:86%}
// //   .cr-body{grid-template-columns:1fr}
// //   .cr-sidebar{display:none}
// //   .cr-art,.cr-inner{padding:28px 20px 60px}
// // }
// // @media(max-width:980px){
// //   .rp-section,.rp-hero{padding-left:22px;padding-right:22px}
// // }
// // @media(max-width:600px){
// //   .rp-slide{flex-basis:90%}
// // }
// // @media(prefers-reduced-motion:reduce){
// //   .rp *,.rp *::before,.rp *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
// //   .rp-h1 .line span{transform:none}
// //   .rp-kicker,.rp-sub,.rp-goal,.rp-hero-art{opacity:1!important}
// //   .rp-reveal,.rp-com-row,.rp-benefit,.rp-perk{opacity:1;transform:none}
// //   .rp-w{opacity:1;transform:none;filter:none}
// // }
// // `;

// // /* ─────────────────────────────────────────────────────────────
// //    MAIN PAGE
// // ───────────────────────────────────────────────────────────── */
// // export default function ResourcesPage() {
// //   const [courses, setCourses]           = useState(COURSES);
// //   const [course, setCourse]             = useState(null);
// //   const [activeLesson, setActiveLesson] = useState(null);
// //   const [activeCat, setActiveCat]       = useState("All");
// //   const [goalCat, setGoalCat]           = useState(null);
// //   const [showIdx, setShowIdx]           = useState(0);
// //   const [openFaq, setOpenFaq]           = useState(0);

// //   const stRef       = useRef(null);
// //   const showTrackRef= useRef(null);
// //   const loopRef     = useRef(null);
// //   const browseRef   = useRef(null);
// //   const showPaused  = useRef(false);
// //   const loopPaused  = useRef(false);

// //   const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// //   /* Live content: published DB courses override the static seed by slug */
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         const res  = await fetch(`${API_BASE}/courses?limit=100`);
// //         const data = await res.json();
// //         const dbCourses = data?.data?.courses || [];
// //         if (!dbCourses.length || cancelled) return;
// //         const dbBySlug = new Map(dbCourses.map(c => [c.slug, c]));
// //         const merged = [
// //           ...dbCourses.map(c => normalizeCourse(c)),
// //           ...COURSES.filter(c => !dbBySlug.has(c.slug)),
// //         ];
// //         setCourses(merged);
// //       } catch { /* API unreachable — keep static fallback */ }
// //     })();
// //     return () => { cancelled = true; };
// //   }, [API_BASE]);

// //   /* hide the fixed nav while the reader is open */
// //   useEffect(() => {
// //     document.body.classList.toggle("cr-open", !!course);
// //     return () => document.body.classList.remove("cr-open");
// //   }, [course]);

// //   /* derived collections */
// //   const showcase = courses.slice(0, 6);
// //   const browseList = (() => {
// //     const list = activeCat === "All" ? courses : courses.filter(c => c.category === activeCat);
// //     return list.length ? list : courses;
// //   })();

// //   const openCourse = async (c) => {
// //     let full = c;
// //     if (!c?.chapters?.length && c?.slug) {
// //       try {
// //         const res  = await fetch(`${API_BASE}/courses/${c.slug}`);
// //         const data = await res.json();
// //         if (data?.data?.course) full = normalizeCourse(data.data.course);
// //       } catch { /* fall through */ }
// //     }
// //     if (!full?.chapters?.length) {
// //       const staticMatch = COURSES.find(s => s.slug === c.slug);
// //       if (staticMatch) full = staticMatch;
// //     }
// //     if (!full?.chapters?.length) return;
// //     setCourse(full);
// //     setActiveLesson(null);
// //     window.scrollTo({ top: 0 });
// //   };
// //   const closeCourse = () => { setCourse(null); setActiveLesson(null); };

// //   const pickGoal = (cat) => {
// //     setGoalCat(cat);
// //     setActiveCat(cat);
// //     setTimeout(() => browseRef.current?.scrollIntoView({ behavior: "smooth" }), 340);
// //   };

// //   /* ── statement scroll reveal ── */
// //   useEffect(() => {
// //     const el = stRef.current;
// //     if (!el) return;
// //     const words = [...el.querySelectorAll(".rp-w")];
// //     const update = () => {
// //       const r = el.getBoundingClientRect();
// //       const start = window.innerHeight * 0.85, end = window.innerHeight * 0.35;
// //       const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
// //       const lit = Math.floor(p * words.length);
// //       words.forEach((w, i) => w.classList.toggle("lit", i < lit || p >= 1));
// //     };
// //     update();
// //     window.addEventListener("scroll", update, { passive: true });
// //     window.addEventListener("resize", update);
// //     return () => {
// //       window.removeEventListener("scroll", update);
// //       window.removeEventListener("resize", update);
// //     };
// //   }, []);

// //   /* ── showcase carousel layout ── */
// //   const layoutShow = useCallback((i) => {
// //     const track = showTrackRef.current;
// //     if (!track || !track.children.length) return;
// //     const first = track.children[0].getBoundingClientRect();
// //     const step = first.width + 28;                 // slide + 14px margin each side
// //     const center = (window.innerWidth - first.width) / 2;
// //     track.style.transform = `translateX(${center - i * step - 14}px)`;
// //   }, []);

// //   useEffect(() => { layoutShow(showIdx); }, [showIdx, courses, layoutShow]);
// //   useEffect(() => {
// //     const onResize = () => layoutShow(showIdx);
// //     window.addEventListener("resize", onResize);
// //     window.addEventListener("load", onResize);
// //     return () => {
// //       window.removeEventListener("resize", onResize);
// //       window.removeEventListener("load", onResize);
// //     };
// //   }, [showIdx, layoutShow]);

// //   useEffect(() => {
// //     const n = Math.min(6, courses.length) || 1;
// //     const t = setInterval(() => {
// //       if (!showPaused.current) setShowIdx(i => (i + 1) % n);
// //     }, 4600);
// //     return () => clearInterval(t);
// //   }, [courses.length]);

// //   const goShow = (i) => {
// //     const n = Math.min(6, courses.length) || 1;
// //     setShowIdx(((i % n) + n) % n);
// //   };

// //   /* ── browse infinite auto-loop ── */
// //   useEffect(() => {
// //     const row = loopRef.current;
// //     if (!row) return;
// //     row.scrollLeft = 0;
// //     let raf, last = 0;
// //     const tick = (t) => {
// //       if (!last) last = t;
// //       const dt = t - last; last = t;
// //       if (!loopPaused.current) {
// //         row.scrollLeft += dt * 0.045;
// //         const w = row.scrollWidth / 3;
// //         if (w > 0 && row.scrollLeft >= w * 2) row.scrollLeft -= w;
// //       }
// //       raf = requestAnimationFrame(tick);
// //     };
// //     raf = requestAnimationFrame(tick);
// //     const enter = () => { loopPaused.current = true; };
// //     const leave = () => { loopPaused.current = false; };
// //     const inEv = ["mouseenter", "touchstart", "pointerdown"];
// //     const outEv = ["mouseleave", "touchend", "pointerup"];
// //     inEv.forEach(e => row.addEventListener(e, enter, { passive: true }));
// //     outEv.forEach(e => row.addEventListener(e, leave, { passive: true }));
// //     return () => {
// //       cancelAnimationFrame(raf);
// //       inEv.forEach(e => row.removeEventListener(e, enter));
// //       outEv.forEach(e => row.removeEventListener(e, leave));
// //     };
// //   }, [activeCat, courses]);

// //   /* ── scroll reveals ── */
// //   useEffect(() => {
// //     const io = new IntersectionObserver((entries) => {
// //       entries.forEach(e => {
// //         if (!e.isIntersecting) return;
// //         const el = e.target;
// //         el.classList.add("shown");
// //         if (el.dataset.stagger) {
// //           el.querySelectorAll("[data-child]").forEach((c, i) =>
// //             setTimeout(() => c.classList.add("shown"), i * 130));
// //         }
// //         io.unobserve(el);
// //       });
// //     }, { threshold: 0.12 });
// //     document.querySelectorAll(".rp-reveal,.rp-fan,[data-stagger]").forEach(el => io.observe(el));
// //     return () => io.disconnect();
// //   }, [courses]);

// //   return (
// //     <>
// //       <style>{CSS}</style>

// //       {/* Full-screen course reader */}
// //       {course && (
// //         <CourseReader
// //           course={course}
// //           activeLesson={activeLesson}
// //           setActiveLesson={setActiveLesson}
// //           onBack={closeCourse}
// //         />
// //       )}

// //       <div className="rp" style={{ visibility: course ? "hidden" : "visible" }}>

// //         {/* ── 1 · SPLIT HERO ── */}
// //         <header className="rp-hero">
// //           <div className="rp-hero-left">
// //             <div className="rp-kicker">Fameo · Learning Center</div>
// //             <h1 className="rp-h1">
// //               <span className="line"><span>Creator</span></span>
// //               <span className="line"><span><em>Knowledge</em> Hub</span></span>
// //             </h1>
// //             <p className="rp-sub">
// //               Level up your creator craft with resources for every stage — from
// //               influencer strategy and brand partnerships to scaling a lasting career.
// //             </p>
// //             <div className="rp-goal">
// //               <div className="rp-goal-t">What do you want to master today?</div>
// //               <div className="rp-goal-list">
// //                 {GOALS.map(([label, cat]) => (
// //                   <div
// //                     key={cat}
// //                     className={`rp-goal-item${goalCat === cat ? " on" : ""}`}
// //                     onClick={() => pickGoal(cat)}
// //                   >
// //                     <div className="box" />
// //                     {label}
// //                     <span className="go">→</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="rp-hero-art">
// //             {[["up", PORTRAITS.slice(0, 5)], ["down", PORTRAITS.slice(5, 10)]].map(([dir, imgs]) => (
// //               <div key={dir} className={`rp-mos-col ${dir}`}>
// //                 <div className="rp-mos-inner">
// //                   {[...imgs, ...imgs].map((u, i) => (
// //                     <img key={`${dir}-${i}`} src={u} alt="Fameo creator" loading="lazy" draggable="false" />
// //                   ))}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </header>

// //         {/* ── 2 · MEMBERSHIP PERKS ── */}
// //         <section className="rp-section rp-mem">
// //           <div>
// //             <h2 className="rp-reveal">What&apos;s in every Fameo membership?</h2>
// //             <div className="rp-btns rp-reveal">
// //               <a className="rp-btn rp-btn-primary" href="/plans">Get Fameo <span className="arr">→</span></a>
// //               <a className="rp-btn rp-btn-ghost" href="/plans">♥ Gift</a>
// //             </div>
// //           </div>
// //           <div className="rp-perks" data-stagger>
// //             {PERKS.map(([ic, label]) => (
// //               <div key={label} className="rp-perk" data-child>
// //                 <div className="pico">{ic}</div>{label}
// //               </div>
// //             ))}
// //           </div>
// //         </section>

// //         {/* ── 3 · STATEMENT REVEAL ── */}
// //         <section className="rp-statement">
// //           <h2 ref={stRef}>
// //             {STATEMENT_WORDS.map(([w, acc], i) => (
// //               <span key={i}>
// //                 <span className={`rp-w${acc ? " accent" : ""}`}>{w}</span>
// //                 {i < STATEMENT_WORDS.length - 1 ? " " : ""}
// //               </span>
// //             ))}
// //           </h2>
// //           <p>New resources added every month</p>
// //         </section>

// //         {/* ── 4 · SHOWCASE CAROUSEL ── */}
// //         <section
// //           className="rp-showcase"
// //           onMouseEnter={() => { showPaused.current = true; }}
// //           onMouseLeave={() => { showPaused.current = false; }}
// //         >
// //           <div className="rp-show-track" ref={showTrackRef}>
// //             {showcase.map((c, i) => (
// //               <div
// //                 key={c.id || i}
// //                 className={`rp-slide${i === showIdx ? " active" : ""}`}
// //                 onClick={() => (i !== showIdx ? goShow(i) : openCourse(c))}
// //               >
// //                 <img src={c.heroThumb || c.thumbnail} alt={c.title} loading="lazy" draggable="false" />
// //                 <div className="rp-slide-num">
// //                   {String(i + 1).padStart(2, "0")} / {String(showcase.length).padStart(2, "0")}
// //                 </div>
// //                 <div className="rp-slide-info">
// //                   <span className="rp-slide-cat">{c.category}</span>
// //                   <h3>{c.title}</h3>
// //                   <span className="rp-slide-start"><span className="c">▶</span>Start Learning</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //           <div className="rp-show-ctrl">
// //             <button className="rp-tbtn" onClick={() => goShow(showIdx - 1)} aria-label="Previous">←</button>
// //             <div className="rp-dots">
// //               {showcase.map((_, i) => (
// //                 <button
// //                   key={i}
// //                   className={`rp-dot${i === showIdx ? " active" : ""}`}
// //                   onClick={() => goShow(i)}
// //                   aria-label={`Slide ${i + 1}`}
// //                 />
// //               ))}
// //             </div>
// //             <button className="rp-tbtn" onClick={() => goShow(showIdx + 1)} aria-label="Next">→</button>
// //           </div>
// //         </section>

// //         {/* ── 5 · BROWSE: PILLS + AUTO-LOOP ── */}
// //         <section className="rp-section rp-browse" ref={browseRef}>
// //           <div className="rp-pills">
// //             {COURSE_CATEGORIES.map(cat => (
// //               <button
// //                 key={cat}
// //                 className={`rp-pill${cat === activeCat ? " active" : ""}`}
// //                 onClick={() => setActiveCat(cat)}
// //               >
// //                 <span className="ci">{PILL_ICON[cat] || "•"}</span>
// //                 {cat}
// //               </button>
// //             ))}
// //           </div>
// //           <div className="rp-loop-head">
// //             <div className="lh">
// //               <b>{activeCat === "All" ? "Popular now" : activeCat}</b>
// //               <span className="see" onClick={() => setActiveCat("All")}>See all</span>
// //             </div>
// //             <div className="rp-loop-nav">
// //               <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: -560, behavior: "smooth" })} aria-label="Scroll left">←</button>
// //               <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: 560, behavior: "smooth" })} aria-label="Scroll right">→</button>
// //             </div>
// //           </div>
// //           <div className="rp-loop-outer">
// //             <div className="rp-loop-row" ref={loopRef}>
// //               {[...browseList, ...browseList, ...browseList].map((c, i) => (
// //                 <div
// //                   key={`${c.id || c.slug}-${i}`}
// //                   className="rp-tcard"
// //                   onClick={() => openCourse(c)}
// //                 >
// //                   <img src={c.thumbnail || c.heroThumb} alt={c.title} loading="lazy" draggable="false" />
// //                   {c.badge && (
// //                     <span className="rp-tbadge" style={{ background: c.accent + "26", color: "#fff", border: `1px solid ${c.accent}55` }}>
// //                       {c.badge}
// //                     </span>
// //                   )}
// //                   <div className="rp-tinfo">
// //                     <div className="tc">{c.category}</div>
// //                     <h4>{c.title}</h4>
// //                     <div className="tm">{[c.stat && `${c.stat} ${c.statLabel}`, c.tag].filter(Boolean).join(" · ").toUpperCase()}</div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── 6 · COMMUNITY FAN ── */}
// //         <section className="rp-section rp-community">
// //           <div>
// //             <div className="rp-eyebrow rp-reveal">Community</div>
// //             <h2 className="rp-reveal">Explore the<br />creator community</h2>
// //             <div className="rp-com-rows" data-stagger>
// //               {COMMUNITY.map(([ic, h, p]) => (
// //                 <div key={h} className="rp-com-row" data-child>
// //                   <div className="ico">{ic}</div>
// //                   <div><h4>{h}</h4><p>{p}</p></div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //           <div className="rp-fan">
// //             {FAN.map((f, i) => (
// //               <div key={i} className="rp-fan-card">
// //                 <img src={f.img} alt="" draggable="false" />
// //                 <div className="cap">
// //                   <div className="dot" />
// //                   <div><b>Fameo Creator</b><br /><span>{f.cap}</span></div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </section>

// //         {/* ── 7 · MEMBERSHIP / PRICING ── */}
// //         <section className="rp-section rp-member">
// //           <div className="rp-mv">
// //             <div className="rp-mv-img"><img src={MEMBER_IMG} alt="" draggable="false" /></div>
// //             <div className="rp-price">
// //               <div className="rp-price-ico">◈</div>
// //               <h4>Get access to the exclusive Fameo membership</h4>
// //               <div className="rp-tier">Basic <span>Free</span></div>
// //               <div className="rp-tier hot">Pro <span>₹499/month</span></div>
// //               <div className="rp-tier">Elite <span>₹999/month</span></div>
// //               <a href="/plans"><button className="rp-pc-btn">Unlock Membership</button></a>
// //             </div>
// //           </div>
// //           <div className="rp-mc">
// //             <div className="rp-eyebrow rp-reveal">Membership</div>
// //             <h2 className="rp-reveal">One membership. Every course. Zero limits.</h2>
// //             <p className="rp-reveal">
// //               Every course, playbook, and toolkit — plus the verified community that holds you accountable.
// //             </p>
// //             <div className="rp-benefits" data-stagger>
// //               {[
// //                 "All 8 courses and original playbooks",
// //                 "Playbooks, toolkits & checklists included",
// //                 "Learn on desktop, tablet, or mobile",
// //                 "New resources added every month",
// //                 "Verified creator community access",
// //               ].map(b => (
// //                 <div key={b} className="rp-benefit" data-child>
// //                   <div className="chk">✓</div>{b}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── 8 · FAQ ── */}
// //         <section className="rp-section rp-faq-wrap">
// //           <div className="rp-eyebrow rp-reveal">Questions</div>
// //           <h2 className="rp-reveal">Frequently asked questions</h2>
// //           <div>
// //             {FAQS.map(([q, a], i) => {
// //               const open = openFaq === i;
// //               return (
// //                 <div key={i} className={`rp-faq${open ? " open" : ""}`}>
// //                   <button className="rp-faq-q" onClick={() => setOpenFaq(open ? -1 : i)}>
// //                     {q}<span className="chev">▼</span>
// //                   </button>
// //                   <div className="rp-faq-a" style={{ maxHeight: open ? "260px" : "0" }}>
// //                     <p>{a}</p>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </section>

// //         {/* ── 9 · CTA ── */}
// //         <section className="rp-cta">
// //           <h2 className="rp-reveal">Your fame is a craft.<br /><em>Master it.</em></h2>
// //           <p className="rp-reveal">Join the verified creator community learning to build careers that last.</p>
// //           <a className="rp-btn rp-btn-primary rp-reveal" href="/plans">Join the community <span className="arr">→</span></a>
// //         </section>

// //       </div>
// //     </>
// //   );
// // }

// // /* ══════════════════════════════════════════
// //    COURSE READER
// // ══════════════════════════════════════════ */
// // function CourseReader({ course, activeLesson, setActiveLesson, onBack }) {
// //   const contentRef = useRef(null);
// //   const allLessons = course.chapters.flatMap(c => c.lessons);

// //   const goLesson = (lesson) => {
// //     setActiveLesson(lesson);
// //     if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   const activeChapter = course.chapters.find(ch => ch.lessons.some(l => l.id === activeLesson?.id));

// //   return (
// //     <div className="cr-root si">
// //       <div className="cr-topbar">
// //         <button className="cr-back" onClick={onBack}>
// //           <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
// //           Learning Center
// //         </button>
// //         <span className="cr-topbar-title">{course.title}</span>
// //         <span className="cr-topbar-meta">{allLessons.length} lessons · {course.level}</span>
// //       </div>

// //       <div className="cr-body">
// //         <aside className="cr-sidebar">
// //           <div className="cr-sb-top">
// //             <div className="cr-sb-course">{course.title}</div>
// //             <div className="cr-sb-cat">{course.category} · {course.level}</div>
// //           </div>
// //           {course.chapters.map(ch => (
// //             <div key={ch.id} className="cr-sb-chapter">
// //               <span className="cr-sb-ch-label" style={{ color: course.accent }}>
// //                 {ch.number} — {ch.title}
// //               </span>
// //               {(ch.lessons || []).map((lesson) => {
// //                 const isOn = activeLesson?.id === lesson.id;
// //                 return (
// //                   <div key={lesson.id}
// //                     className={`cr-sb-lesson${isOn ? " on" : ""}`}
// //                     onClick={() => goLesson(lesson)}>
// //                     <span className="cr-sb-lesson-title">{lesson.title}</span>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           ))}
// //         </aside>

// //         <div className="cr-content" ref={contentRef}>
// //           {!activeLesson ? (
// //             <CourseOverview course={course} allLessons={allLessons} onStart={() => goLesson(allLessons[0])} />
// //           ) : (
// //             <LessonView
// //               key={activeLesson.id}
// //               course={course}
// //               lesson={activeLesson}
// //               chapter={activeChapter}
// //               allLessons={allLessons}
// //               onNav={goLesson}
// //             />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function CourseOverview({ course, allLessons, onStart }) {
// //   return (
// //     <div className="cr-inner fu">
// //       <div className="cr-ov-hero">
// //         <img src={course.heroThumb} alt={course.title} />
// //         <div className="cr-ov-ov" />
// //         <div className="cr-ov-cnt">
// //           <span className="cr-ov-tag" style={{ background: course.accent + "22", color: course.accent, border: `1px solid ${course.accent}44` }}>{course.tag}</span>
// //           <h1 className="cr-ov-title">{course.title}</h1>
// //         </div>
// //       </div>
// //       <div className="cr-stats" />
// //       <p className="cr-ov-desc">{course.description}</p>
// //       <div className="cr-learn-h">What you&apos;ll learn</div>
// //       <div className="cr-learn-grid">
// //         {(course.whatYouLearn || []).map((item, i) => (
// //           <div key={i} className="cr-learn-item">
// //             <span className="cr-learn-ck" style={{ color: course.accent }}>✓</span>
// //             <span className="cr-learn-text">{item}</span>
// //           </div>
// //         ))}
// //       </div>
// //       <button className="cr-start" style={{ background: course.accent, color: "#111" }} onClick={onStart}>
// //         Start Learning →
// //       </button>
// //     </div>
// //   );
// // }

// // function LessonView({ course, lesson, chapter, allLessons, onNav }) {
// //   const idx  = allLessons.findIndex(l => l.id === lesson.id);
// //   const prev = idx > 0 ? allLessons[idx - 1] : null;
// //   const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

// //   return (
// //     <div className="cr-art fu" key={lesson.id}>
// //       <span className="cr-art-ey" style={{ color: course.accent }}>{chapter?.title} · Lesson {lesson.id}</span>
// //       <h1 className="cr-art-h">{lesson.title}</h1>
// //       <div className="cr-art-meta">
// //         <span className="cr-art-md" />
// //         <span className="cr-art-md" />
// //         <span className="cr-art-mi" style={{ color: course.accent }}>{course.category}</span>
// //       </div>

// //       <div className="cr-art-imgwrap">
// //         <img className="cr-art-img" src={lesson.thumb} alt={lesson.title} />
// //       </div>

// //       <p className="cr-art-desc">{lesson.intro}</p>

// //       {lesson.sections?.map((sec, si) => (
// //         <div key={sec.id} className="cr-section">
// //           <h2 className="cr-section-h">{sec.heading}</h2>
// //           {sec.image && (
// //             <div className="cr-section-img">
// //               <img src={sec.image} alt={sec.heading} />
// //             </div>
// //           )}
// //           <div className="cr-section-body">{sec.body}</div>
// //           {sec.keyPoints?.length > 0 && (
// //             <div className="cr-kp" style={{ background: course.accent + "09", border: `1.5px solid ${course.accent}33` }}>
// //               <div className="cr-kp-h">
// //                 <div className="cr-kp-icon" style={{ background: course.accent }}>✦</div>
// //                 <span className="cr-kp-title" style={{ borderColor: course.accent }}>Key Points</span>
// //               </div>
// //               {sec.keyPoints.map((pt, pi) => (
// //                 <div key={pi} className="cr-kp-item">
// //                   <span className="cr-kp-dot" style={{ background: course.accent }} />
// //                   <span className="cr-kp-text">{pt}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //           {si < lesson.sections.length - 1 && <div className="cr-sect-rule" />}
// //         </div>
// //       ))}

// //       <div className="cr-nav">
// //         <button className="cr-nav-prev" disabled={!prev} onClick={() => prev && onNav(prev)}>← Previous</button>
// //         <button className="cr-nav-next" disabled={!next}
// //           style={{ background: next ? course.accent : "#e0e0e0", color: next ? "#111" : "#aaa" }}
// //           onClick={() => next && onNav(next)}>
// //           Next →
// //         </button>
// //       </div>

// //       {next && (
// //         <div className="cr-upnext" onClick={() => onNav(next)}>
// //           <span className="cr-un-label">Up Next</span>
// //           <div className="cr-un-card" style={{ borderColor: course.accent + "44" }}>
// //             <img className="cr-un-img" src={next.thumb} alt={next.title} />
// //             <div className="cr-un-info">
// //               <span className="cr-un-eye" style={{ color: course.accent }}>Lesson {next.id}</span>
// //               <span className="cr-un-title">{next.title}</span>
// //             </div>
// //             <span className="cr-un-arr" style={{ color: course.accent }}>→</span>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { COURSES, COURSE_CATEGORIES } from "@/constants/courses";

// /* ─────────────────────────────────────────────────────────────
//    Normalise a DB / static course into the shape the UI expects
// ───────────────────────────────────────────────────────────── */
// function normalizeCourse(c) {
//   return {
//     ...c,
//     id:          c.courseId || c._id || c.slug,
//     description: c.description || c.subtitle || "",
//     subtitle:    c.subtitle   || "",
//     category:    c.category   || "Growth",
//     accent:      c.accent     || "#C9A96E",
//     thumbnail:   c.thumbnail  || c.heroThumb || "",
//     heroThumb:   c.heroThumb  || c.thumbnail || "",
//     tag:         c.tag        || c.level || "",
//     badge:       c.badge      || "",
//     stat:        c.stat       || "",
//     statLabel:   c.statLabel  || "",
//     level:       c.level      || "",
//     chapters:    Array.isArray(c.chapters) ? c.chapters : [],
//   };
// }

// /* Editorial helpers ─────────────────────────────────────────── */
// const PORTRAITS = [
//   "photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d",
//   "photo-1534528741775-53994a69daeb", "photo-1500648767791-00dcc994a43e",
//   "photo-1517841905240-472988babdf9", "photo-1524504388940-b1c1722653e1",
//   "photo-1506794778202-cad84cf45f1d", "photo-1531123897727-8f129e1688ce",
//   "photo-1539571696357-5a69c17a67c6", "photo-1544005313-94ddf0286df2",
// ].map(id => `https://images.unsplash.com/${id}?w=460&q=70&fit=crop`);

// const FAN = [
//   { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=70", cap: "shared a collab win" },
//   { img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=70", cap: "posted a studio setup" },
//   { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=70", cap: "hit 10× reach" },
// ];

// const MEMBER_IMG = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=70";

// /* Goal → real category from constants/courses.js */
// const GOALS = [
//   ["Build strong creator foundations", "Foundations"],
//   ["Create better content, faster",    "Content"],
//   ["Set up my studio & workflow",      "Setup"],
//   ["Grow my audience & reach",         "Growth"],
//   ["Turn my content into income",      "Monetization"],
//   ["Scale into a lasting career",      "Scaling"],
// ];

// const PILL_ICON = {
//   All: "✦", Foundations: "◈", Content: "✎", Setup: "⚙",
//   Growth: "↗", Monetization: "₹", Operations: "⚖", Scaling: "⤢",
// };

// const PERKS = [
//   ["▣", "All 8 courses and original playbooks"],
//   ["♫", "Audio-ready lessons for learning on the go"],
//   ["⇩", "Download toolkits, templates & checklists"],
//   ["▤", "Learn on desktop, tablet, or mobile"],
//   ["☆", "New resources added every month"],
//   ["✓", "Verified creator community access"],
// ];

// const COMMUNITY = [
//   ["✦", "Stay Inspired", "Discover trending topics, get quick answers, and find your people among verified creators."],
//   ["◈", "Stay Connected", "Follow your peers and mentors, exchange perspectives, and share some love."],
//   ["✎", "Keep Creating", "Explore new ideas for your next piece of content, post your work, and get feedback."],
// ];

// const FAQS = [
//   ["What is the Creator Knowledge Hub?", "It's Fameo's learning centre — 8 in-depth courses plus playbooks, toolkits, and checklists covering everything from creator foundations to monetisation and scaling, built from data across 12,000 Indian creators."],
//   ["Who are these courses for?", "Verified creators, influencers, and public figures at every stage — whether you're picking your niche or building a team around a decade-long career."],
//   ["Are the resources free?", "Core foundations are free for every verified Fameo member. Playbooks, masterclasses, and toolkits are part of the Pro and Elite memberships."],
//   ["How often is new content added?", "New courses, reports, and checklists are added every month — including trend reports like The Creator Economy Report."],
//   ["Can I learn on mobile?", "Yes. Every course works on desktop, tablet, and mobile, with bite-sized lessons designed for learning between shoots."],
// ];

// const STATEMENT_WORDS = [
//   ["Meet", 0], ["the", 0], ["best", 1], ["courses.", 1],
//   ["New", 0], ["resources", 0], ["added", 0], ["every", 0], ["month.", 0],
// ];

// /* ─────────────────────────────────────────────────────────────
//    STYLES — premium cream ("parchment & gold") theme
// ───────────────────────────────────────────────────────────── */
// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
// html{scroll-behavior:smooth}
// body{background:#FAF6F0;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}

// .rp{
//   --bg:#FAF6F0; --bg-soft:#FAF6F0; --card:#FFFDF8;
//   --ink:#2A1E14; --dim:rgba(42,30,20,.62); --faint:rgba(42,30,20,.40);
//   --gold:#B0894E; --gold-l:#C9A96E;
//   --rose:#C24E74;
//   --grad:linear-gradient(135deg,#D65B7A 0%,#BE4C86 52%,#8A57A8 100%);
//   --line:rgba(42,30,20,.12);
//   --shadow:0 24px 60px rgba(74,48,20,.14);
//   --serif:'Cormorant Garamond',Georgia,serif;
//   --sans:'DM Sans',-apple-system,sans-serif;
//   --ease:cubic-bezier(.22,1,.36,1);
//   background:var(--bg);color:var(--ink);font-family:var(--sans);
//   overflow-x:hidden;min-height:100vh;position:relative;
// }
// .rp ::selection{background:rgba(194,78,116,.22)}
// .rp-section{max-width:1320px;margin:0 auto;padding:0 48px}
// .rp-eyebrow{display:flex;align-items:center;gap:16px;color:var(--gold);font-size:10.5px;letter-spacing:.34em;font-weight:700;text-transform:uppercase;margin-bottom:30px}
// .rp-eyebrow::after{content:'';flex:1;height:1px;background:var(--line)}

// /* ---------- SPLIT HERO ---------- */
// .rp-hero{position:relative;max-width:1440px;margin:0 auto;padding:132px 48px 70px;
//   display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center;min-height:92vh}
// .rp-kicker{display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.4em;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:24px;
//   opacity:0;animation:rpFade 1s var(--ease) .2s forwards}
// .rp-kicker::before{content:'';width:34px;height:1.5px;background:var(--gold)}
// .rp-h1{font-family:var(--serif);font-weight:500;font-size:clamp(46px,5.4vw,84px);line-height:1.02;letter-spacing:-.01em}
// .rp-h1 .line{display:block;overflow:hidden}
// .rp-h1 .line span{display:block;transform:translateY(115%);animation:rpRise 1.15s var(--ease) forwards}
// .rp-h1 .line:nth-child(2) span{animation-delay:.14s}
// .rp-h1 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// @keyframes rpRise{to{transform:translateY(0)}}
// @keyframes rpFade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
// .rp-sub{margin-top:22px;color:var(--dim);font-size:16px;line-height:1.75;max-width:460px;font-weight:400;
//   opacity:0;animation:rpFade 1s var(--ease) .65s forwards}
// .rp-goal{margin-top:36px;opacity:0;animation:rpFade 1s var(--ease) .9s forwards}
// .rp-goal-t{font-size:11.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin-bottom:14px}
// .rp-goal-t::before{content:'';display:block;width:34px;height:3px;background:var(--grad);border-radius:2px;margin-bottom:14px}
// .rp-goal-list{display:flex;flex-direction:column;gap:9px;max-width:460px}
// .rp-goal-item{display:flex;align-items:center;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:13px;
//   padding:14px 18px;cursor:pointer;font-size:14px;color:var(--dim);font-weight:500;transition:all .35s var(--ease);box-shadow:0 1px 0 rgba(74,48,20,.03)}
// .rp-goal-item:hover{border-color:rgba(194,78,116,.4);color:var(--ink);transform:translateX(6px);box-shadow:0 10px 26px rgba(74,48,20,.09)}
// .rp-goal-item .box{width:19px;height:19px;border-radius:6px;border:1.5px solid rgba(42,30,20,.25);display:grid;place-items:center;
//   transition:all .3s var(--ease);flex-shrink:0;font-size:11px;color:#fff}
// .rp-goal-item .box::after{content:'✓';opacity:0;transform:scale(.4);transition:all .3s var(--ease)}
// .rp-goal-item.on{color:var(--ink);border-color:rgba(194,78,116,.45)}
// .rp-goal-item.on .box{background:var(--grad);border-color:transparent}
// .rp-goal-item.on .box::after{opacity:1;transform:scale(1)}
// .rp-goal-item .go{margin-left:auto;opacity:0;transform:translateX(-8px);transition:all .3s var(--ease);color:var(--rose);font-size:16px}
// .rp-goal-item:hover .go{opacity:1;transform:translateX(0)}

// .rp-hero-art{position:relative;height:80vh;min-height:520px;display:flex;gap:16px;overflow:hidden;border-radius:22px;
//   opacity:0;animation:rpFade 1.2s var(--ease) .5s forwards}
// .rp-hero-art::before,.rp-hero-art::after{content:'';position:absolute;left:0;right:0;height:130px;z-index:3;pointer-events:none}
// .rp-hero-art::before{top:0;background:linear-gradient(to bottom,var(--bg),transparent)}
// .rp-hero-art::after{bottom:0;background:linear-gradient(to top,var(--bg),transparent)}
// .rp-mos-col{flex:1;display:flex;flex-direction:column;gap:16px}
// .rp-mos-col.up .rp-mos-inner{animation:rpUp 42s linear infinite}
// .rp-mos-col.down .rp-mos-inner{animation:rpDown 48s linear infinite}
// .rp-mos-inner{display:flex;flex-direction:column;gap:16px}
// @keyframes rpUp{to{transform:translateY(-50%)}}
// @keyframes rpDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}
// .rp-mos-inner img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:16px;display:block;
//   filter:saturate(.96);transition:filter .4s,transform .4s var(--ease)}
// .rp-mos-inner img:hover{filter:saturate(1.08);transform:scale(1.02)}

// /* ---------- MEMBERSHIP PERKS SPLIT ---------- */
// .rp-mem{padding-top:120px;display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
// .rp-mem h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.8vw,54px);line-height:1.1;letter-spacing:-.01em}
// .rp-btns{display:flex;gap:14px;margin-top:34px;flex-wrap:wrap}
// .rp-btn{position:relative;display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-size:11.5px;letter-spacing:.18em;font-weight:700;
//   text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;transition:all .4s var(--ease);font-family:var(--sans)}
// .rp-btn-primary{background:var(--grad);color:#fff;box-shadow:0 10px 30px rgba(194,78,116,.32)}
// .rp-btn-primary:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(194,78,116,.42)}
// .rp-btn-ghost{background:transparent;color:var(--ink);border:1px solid rgba(42,30,20,.22)}
// .rp-btn-ghost:hover{border-color:var(--rose);color:var(--rose);transform:translateY(-3px)}
// .rp-btn .arr{transition:transform .35s var(--ease)}
// .rp-btn:hover .arr{transform:translateX(5px)}
// .rp-perks{display:flex;flex-direction:column;gap:2px}
// .rp-perk{display:flex;align-items:center;gap:18px;font-size:15px;color:var(--dim);padding:15px 6px;border-bottom:1px solid var(--line);
//   opacity:0;transform:translateX(26px);transition:all .7s var(--ease)}
// .rp-perk.shown{opacity:1;transform:none}
// .rp-perk:hover{color:var(--ink)}
// .rp-perk .pico{width:40px;height:40px;border-radius:12px;background:var(--card);border:1px solid var(--line);display:grid;place-items:center;
//   font-size:16px;flex-shrink:0;color:var(--rose);transition:all .35s var(--ease)}
// .rp-perk:hover .pico{border-color:rgba(194,78,116,.4);transform:translateY(-2px);box-shadow:0 8px 20px rgba(194,78,116,.16)}

// /* ---------- STATEMENT REVEAL ---------- */
// .rp-statement{padding:150px 24px 140px;text-align:center;max-width:1050px;margin:0 auto}
// .rp-statement h2{font-family:var(--serif);font-weight:500;font-size:clamp(38px,5.4vw,74px);line-height:1.16;letter-spacing:-.01em}
// .rp-w{display:inline-block;opacity:.16;transform:translateY(10px);filter:blur(1.4px);
//   transition:opacity .6s ease,transform .6s var(--ease),filter .6s ease;will-change:opacity}
// .rp-w.lit{opacity:1;transform:none;filter:blur(0)}
// .rp-w.accent{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// .rp-statement p{margin-top:26px;color:var(--gold);font-size:12px;letter-spacing:.32em;font-weight:700;text-transform:uppercase}

// /* ---------- SHOWCASE CAROUSEL ---------- */
// .rp-showcase{position:relative;padding:16px 0 0;overflow:hidden}
// .rp-show-track{display:flex;transition:transform .9s var(--ease);will-change:transform}
// .rp-slide{flex:0 0 72%;margin:0 14px;position:relative;border-radius:24px;overflow:hidden;aspect-ratio:16/8.2;
//   transform:scale(.93);opacity:.4;transition:transform .9s var(--ease),opacity .9s var(--ease);cursor:pointer;box-shadow:var(--shadow)}
// .rp-slide.active{transform:scale(1);opacity:1}
// .rp-slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 7s ease}
// .rp-slide.active:hover img{transform:scale(1.05)}
// .rp-slide::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.82) 4%,transparent 56%),linear-gradient(to right,rgba(30,18,10,.3),transparent 45%)}
// .rp-slide-info{position:absolute;left:44px;bottom:38px;z-index:2;max-width:74%}
// .rp-slide-cat{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.28em;font-weight:700;color:var(--gold-l);
//   background:rgba(30,18,10,.42);backdrop-filter:blur(8px);padding:7px 14px;border-radius:100px;border:1px solid rgba(201,169,110,.35)}
// .rp-slide-info h3{font-family:var(--serif);font-weight:500;font-size:clamp(28px,3.4vw,50px);line-height:1.06;margin-top:16px;color:#fff;
//   transform:translateY(14px);opacity:0;transition:all .8s var(--ease) .25s}
// .rp-slide.active .rp-slide-info h3{transform:none;opacity:1}
// .rp-slide-start{display:inline-flex;align-items:center;gap:10px;margin-top:18px;font-size:11px;letter-spacing:.26em;font-weight:700;color:#fff;text-transform:uppercase;
//   opacity:0;transform:translateY(10px);transition:all .8s var(--ease) .4s}
// .rp-slide.active .rp-slide-start{opacity:1;transform:none}
// .rp-slide-start .c{width:34px;height:34px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-size:12px;color:#fff}
// .rp-slide-num{position:absolute;top:24px;right:30px;z-index:2;font-family:var(--serif);font-size:20px;color:rgba(255,255,255,.6)}
// .rp-show-ctrl{display:flex;align-items:center;justify-content:center;gap:26px;margin-top:34px}
// .rp-tbtn{width:46px;height:46px;border-radius:50%;background:var(--card);border:1px solid var(--line);color:var(--ink);font-size:16px;cursor:pointer;
//   transition:all .35s var(--ease)}
// .rp-tbtn:hover{background:var(--grad);border-color:transparent;color:#fff}
// .rp-dots{display:flex;gap:8px}
// .rp-dot{width:22px;height:3px;border-radius:2px;background:rgba(42,30,20,.16);border:none;cursor:pointer;padding:0;transition:all .4s var(--ease)}
// .rp-dot.active{width:38px;background:var(--rose)}

// /* ---------- BROWSE: PILLS + AUTO-LOOP ---------- */
// .rp-browse{padding-top:140px}
// .rp-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;max-width:980px;margin:0 auto 54px}
// .rp-pill{display:inline-flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--line);color:var(--dim);
//   font-family:var(--sans);font-size:12.5px;font-weight:600;padding:12px 22px;border-radius:100px;cursor:pointer;transition:all .4s var(--ease)}
// .rp-pill .ci{font-size:13px;opacity:.85}
// .rp-pill:hover{color:var(--ink);border-color:rgba(42,30,20,.28);transform:translateY(-2px)}
// .rp-pill.active{color:#fff;border-color:transparent;background:var(--grad);box-shadow:0 8px 22px rgba(194,78,116,.28)}
// .rp-loop-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
// .rp-loop-head .lh{display:flex;align-items:baseline;gap:16px}
// .rp-loop-head b{font-family:var(--serif);font-weight:500;font-size:24px}
// .rp-loop-head .see{color:var(--faint);font-size:12.5px;cursor:pointer;transition:color .3s}
// .rp-loop-head .see:hover{color:var(--rose)}
// .rp-loop-nav{display:flex;gap:10px}
// .rp-loop-outer{position:relative;overflow:hidden}
// .rp-loop-outer::before,.rp-loop-outer::after{content:'';position:absolute;top:0;bottom:0;width:70px;z-index:3;pointer-events:none}
// .rp-loop-outer::before{left:0;background:linear-gradient(to right,var(--bg),transparent)}
// .rp-loop-outer::after{right:0;background:linear-gradient(to left,var(--bg),transparent)}
// .rp-loop-row{display:flex;gap:20px;overflow-x:auto;scrollbar-width:none;padding-bottom:6px}
// .rp-loop-row::-webkit-scrollbar{display:none}
// .rp-tcard{position:relative;flex:0 0 250px;border-radius:16px;overflow:hidden;cursor:pointer;aspect-ratio:3/4.1;
//   box-shadow:0 8px 24px rgba(74,48,20,.1);transition:transform .5s var(--ease),box-shadow .5s var(--ease)}
// .rp-tcard:hover{transform:translateY(-6px);box-shadow:0 22px 50px rgba(74,48,20,.2)}
// .rp-tcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
// .rp-tcard:hover img{transform:scale(1.08)}
// .rp-tcard::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.9) 6%,transparent 60%)}
// .rp-tbadge{position:absolute;top:12px;left:12px;z-index:2;font-size:9px;letter-spacing:.16em;font-weight:700;text-transform:uppercase;
//   padding:6px 11px;border-radius:100px;backdrop-filter:blur(6px)}
// .rp-tinfo{position:absolute;left:18px;right:18px;bottom:16px;z-index:2}
// .rp-tinfo .tc{font-size:9px;letter-spacing:.26em;font-weight:700;color:var(--gold-l);text-transform:uppercase}
// .rp-tinfo h4{font-family:var(--serif);font-weight:500;font-size:21px;margin-top:6px;line-height:1.14;color:#fff}
// .rp-tinfo .tm{margin-top:8px;font-size:10.5px;color:rgba(255,255,255,.6);letter-spacing:.05em}

// /* ---------- COMMUNITY FAN ---------- */
// .rp-community{padding-top:150px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
// .rp-community h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
// .rp-com-rows{margin-top:40px;display:flex;flex-direction:column;gap:30px}
// .rp-com-row{display:flex;gap:20px;align-items:flex-start;opacity:0;transform:translateY(22px);transition:all .8s var(--ease)}
// .rp-com-row.shown{opacity:1;transform:none}
// .rp-com-row .ico{width:48px;height:48px;border-radius:13px;display:grid;place-items:center;font-size:20px;flex-shrink:0;
//   background:var(--card);border:1px solid var(--line);color:var(--rose);transition:all .4s var(--ease)}
// .rp-com-row:hover .ico{transform:translateY(-4px) rotate(-6deg);border-color:rgba(194,78,116,.4);box-shadow:0 8px 22px rgba(194,78,116,.2)}
// .rp-com-row h4{font-size:16px;font-weight:700;color:var(--ink)}
// .rp-com-row p{color:var(--dim);font-size:14px;line-height:1.7;margin-top:6px;max-width:360px}
// .rp-fan{position:relative;height:520px}
// .rp-fan-card{position:absolute;left:50%;top:50%;width:62%;aspect-ratio:4/5;border-radius:16px;overflow:hidden;
//   background:#fff;padding:10px;box-shadow:0 24px 60px rgba(74,48,20,.28);
//   transform:translate(-50%,-50%) rotate(0deg);transition:transform 1.1s var(--ease);will-change:transform}
// .rp-fan-card img{width:100%;height:82%;object-fit:cover;border-radius:9px;display:block}
// .rp-fan-card .cap{height:18%;display:flex;align-items:center;gap:8px;padding:0 6px}
// .rp-fan-card .cap .dot{width:24px;height:24px;border-radius:50%;background:var(--grad);flex-shrink:0}
// .rp-fan-card .cap b{font-size:11px;color:#241a12;font-weight:700}
// .rp-fan-card .cap span{font-size:9.5px;color:#9b8f80}
// .rp-fan.shown .rp-fan-card:nth-child(1){transform:translate(-88%,-58%) rotate(-13deg)}
// .rp-fan.shown .rp-fan-card:nth-child(2){transform:translate(-50%,-46%) rotate(-2deg)}
// .rp-fan.shown .rp-fan-card:nth-child(3){transform:translate(-14%,-60%) rotate(11deg)}
// .rp-fan-card:hover{z-index:5}
// .rp-fan.shown .rp-fan-card:nth-child(1):hover{transform:translate(-88%,-62%) rotate(-10deg) scale(1.04)}
// .rp-fan.shown .rp-fan-card:nth-child(2):hover{transform:translate(-50%,-50%) rotate(0deg) scale(1.04)}
// .rp-fan.shown .rp-fan-card:nth-child(3):hover{transform:translate(-14%,-64%) rotate(8deg) scale(1.04)}

// /* ---------- MEMBERSHIP / PRICING ---------- */
// .rp-member{padding-top:150px;display:grid;grid-template-columns:1.2fr 1fr;gap:70px;align-items:center}
// .rp-mv{position:relative;height:480px}
// .rp-mv-img{position:absolute;inset:0 60px 40px 0;border-radius:20px;overflow:hidden;box-shadow:var(--shadow)}
// .rp-mv-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 8s ease}
// .rp-mv:hover .rp-mv-img img{transform:scale(1.06)}
// .rp-price{position:absolute;right:0;bottom:0;width:300px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;
//   box-shadow:0 30px 70px rgba(74,48,20,.24)}
// .rp-price-ico{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#f7e3ec,#efe6f7);display:grid;place-items:center;margin:0 auto 14px;font-size:18px;color:var(--rose)}
// .rp-price h4{text-align:center;font-size:15px;font-weight:700;line-height:1.4;color:var(--ink)}
// .rp-tier{display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:11px;padding:13px 16px;margin-top:10px;
//   font-size:13px;font-weight:700;cursor:pointer;color:var(--ink);transition:all .3s var(--ease)}
// .rp-tier span{color:var(--dim);font-weight:500;font-size:12px}
// .rp-tier:hover,.rp-tier.hot{border-color:var(--rose);background:#fdf4f8;transform:translateX(3px)}
// .rp-pc-btn{margin-top:16px;width:100%;border:none;background:var(--grad);color:#fff;font-family:var(--sans);font-weight:700;font-size:12px;
//   letter-spacing:.08em;padding:14px;border-radius:11px;cursor:pointer;text-transform:uppercase;transition:all .35s var(--ease)}
// .rp-pc-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(194,78,116,.4)}
// .rp-mc h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
// .rp-mc>p{color:var(--dim);line-height:1.8;margin-top:18px;font-size:15px}
// .rp-benefits{margin-top:32px;display:flex;flex-direction:column;gap:14px}
// .rp-benefit{display:flex;align-items:center;gap:14px;font-size:14.5px;color:var(--dim);
//   opacity:0;transform:translateX(-18px);transition:all .7s var(--ease)}
// .rp-benefit.shown{opacity:1;transform:none}
// .rp-benefit .chk{width:22px;height:22px;border-radius:50%;background:rgba(194,78,116,.12);border:1px solid rgba(194,78,116,.4);
//   display:grid;place-items:center;font-size:10px;color:var(--rose);flex-shrink:0}

// /* ---------- FAQ ---------- */
// .rp-faq-wrap{padding-top:150px;max-width:860px}
// .rp-faq-wrap h2{font-family:var(--serif);font-weight:500;font-size:clamp(32px,3.4vw,48px);margin-bottom:40px}
// .rp-faq{border-bottom:1px solid var(--line)}
// .rp-faq-q{width:100%;background:none;border:none;color:var(--ink);font-family:var(--sans);font-size:16px;font-weight:600;text-align:left;
//   padding:24px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;cursor:pointer;transition:color .3s}
// .rp-faq-q:hover{color:var(--rose)}
// .rp-faq-q .chev{flex-shrink:0;width:30px;height:30px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;
//   font-size:11px;transition:all .5s var(--ease)}
// .rp-faq.open .rp-faq-q .chev{transform:rotate(180deg);background:var(--grad);border-color:transparent;color:#fff}
// .rp-faq.open .rp-faq-q{color:var(--ink)}
// .rp-faq-a{max-height:0;overflow:hidden;transition:max-height .5s var(--ease)}
// .rp-faq-a p{color:var(--dim);line-height:1.8;font-size:14.5px;padding-bottom:24px;max-width:680px}

// /* ---------- CTA ---------- */
// .rp-cta{position:relative;margin-top:140px;padding:120px 24px;text-align:center;overflow:hidden;border-top:1px solid var(--line)}
// .rp-cta::before{content:'';position:absolute;left:50%;top:-40%;width:900px;height:600px;transform:translateX(-50%);
//   background:radial-gradient(ellipse,rgba(194,78,116,.12),transparent 65%);pointer-events:none}
// .rp-cta h2{position:relative;font-family:var(--serif);font-weight:500;font-size:clamp(38px,5vw,68px);line-height:1.1}
// .rp-cta h2 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// .rp-cta p{position:relative;color:var(--dim);margin-top:20px;font-size:16px}
// .rp-cta .rp-btn{margin-top:38px}

// /* ---------- REVEAL ---------- */
// .rp-reveal{opacity:0;transform:translateY(38px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
// .rp-reveal.shown{opacity:1;transform:none}

// @media(max-width:1024px){
//   .rp-hero{grid-template-columns:1fr;padding-top:110px}
//   .rp-hero-art{height:400px;order:-1;margin-top:20px}
//   .rp-mem,.rp-community,.rp-member{grid-template-columns:1fr}
//   .rp-fan{height:420px}
//   .rp-mv{height:420px}
//   .rp-slide{flex-basis:86%}
// }
// @media(max-width:980px){
//   .rp-section,.rp-hero{padding-left:22px;padding-right:22px}
// }
// @media(max-width:600px){
//   .rp-slide{flex-basis:90%}
// }
// @media(prefers-reduced-motion:reduce){
//   .rp *,.rp *::before,.rp *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
//   .rp-h1 .line span{transform:none}
//   .rp-kicker,.rp-sub,.rp-goal,.rp-hero-art{opacity:1!important}
//   .rp-reveal,.rp-com-row,.rp-benefit,.rp-perk{opacity:1;transform:none}
//   .rp-w{opacity:1;transform:none;filter:none}
// }
// `;

// /* ─────────────────────────────────────────────────────────────
//    MAIN PAGE
// ───────────────────────────────────────────────────────────── */
// export default function ResourcesPage() {
//   const router = useRouter();

//   const [courses, setCourses]     = useState(COURSES);
//   const [activeCat, setActiveCat] = useState("All");
//   const [goalCat, setGoalCat]     = useState(null);
//   const [showIdx, setShowIdx]     = useState(0);
//   const [openFaq, setOpenFaq]     = useState(0);

//   const stRef        = useRef(null);
//   const showTrackRef = useRef(null);
//   const loopRef      = useRef(null);
//   const browseRef    = useRef(null);
//   const showPaused   = useRef(false);
//   const loopPaused   = useRef(false);

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//   /* Live content: published DB courses override the static seed by slug */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const res  = await fetch(`${API_BASE}/api/courses?limit=100`);
//         const data = await res.json();
//         const dbCourses = data?.data?.courses || [];
//         if (!dbCourses.length || cancelled) return;
//         const dbBySlug = new Map(dbCourses.map(c => [c.slug, c]));
//         const merged = [
//           ...dbCourses.map(c => normalizeCourse(c)),
//           ...COURSES.filter(c => !dbBySlug.has(c.slug)),
//         ];
//         setCourses(merged);
//       } catch { /* API unreachable — keep static fallback */ }
//     })();
//     return () => { cancelled = true; };
//   }, [API_BASE]);

//   /* derived collections */
//   const showcase = courses.slice(0, 6);
//   const browseList = (() => {
//     const list = activeCat === "All" ? courses : courses.filter(c => c.category === activeCat);
//     return list.length ? list : courses;
//   })();

//   /* Navigate to the dedicated course route (no in-page overlay) */
//   const openCourse = (c) => {
//     if (!c?.slug) return;
//     router.push(`/resources/courses/${c.slug}`);
//   };

//   /* Prefetch on hover so the course page opens instantly */
//   const prefetchCourse = (c) => {
//     if (c?.slug) router.prefetch(`/resources/courses/${c.slug}`);
//   };

//   const pickGoal = (cat) => {
//     setGoalCat(cat);
//     setActiveCat(cat);
//     setTimeout(() => browseRef.current?.scrollIntoView({ behavior: "smooth" }), 340);
//   };

//   /* ── statement scroll reveal ── */
//   useEffect(() => {
//     const el = stRef.current;
//     if (!el) return;
//     const words = [...el.querySelectorAll(".rp-w")];
//     const update = () => {
//       const r = el.getBoundingClientRect();
//       const start = window.innerHeight * 0.85, end = window.innerHeight * 0.35;
//       const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
//       const lit = Math.floor(p * words.length);
//       words.forEach((w, i) => w.classList.toggle("lit", i < lit || p >= 1));
//     };
//     update();
//     window.addEventListener("scroll", update, { passive: true });
//     window.addEventListener("resize", update);
//     return () => {
//       window.removeEventListener("scroll", update);
//       window.removeEventListener("resize", update);
//     };
//   }, []);

//   /* ── showcase carousel layout ── */
//   const layoutShow = useCallback((i) => {
//     const track = showTrackRef.current;
//     if (!track || !track.children.length) return;
//     const first = track.children[0].getBoundingClientRect();
//     const step = first.width + 28;                 // slide + 14px margin each side
//     const center = (window.innerWidth - first.width) / 2;
//     track.style.transform = `translateX(${center - i * step - 14}px)`;
//   }, []);

//   useEffect(() => { layoutShow(showIdx); }, [showIdx, courses, layoutShow]);
//   useEffect(() => {
//     const onResize = () => layoutShow(showIdx);
//     window.addEventListener("resize", onResize);
//     window.addEventListener("load", onResize);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("load", onResize);
//     };
//   }, [showIdx, layoutShow]);

//   useEffect(() => {
//     const n = Math.min(6, courses.length) || 1;
//     const t = setInterval(() => {
//       if (!showPaused.current) setShowIdx(i => (i + 1) % n);
//     }, 4600);
//     return () => clearInterval(t);
//   }, [courses.length]);

//   const goShow = (i) => {
//     const n = Math.min(6, courses.length) || 1;
//     setShowIdx(((i % n) + n) % n);
//   };

//   /* ── browse infinite auto-loop ── */
//   useEffect(() => {
//     const row = loopRef.current;
//     if (!row) return;
//     row.scrollLeft = 0;
//     let raf, last = 0;
//     const tick = (t) => {
//       if (!last) last = t;
//       const dt = t - last; last = t;
//       if (!loopPaused.current) {
//         row.scrollLeft += dt * 0.045;
//         const w = row.scrollWidth / 3;
//         if (w > 0 && row.scrollLeft >= w * 2) row.scrollLeft -= w;
//       }
//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     const enter = () => { loopPaused.current = true; };
//     const leave = () => { loopPaused.current = false; };
//     const inEv = ["mouseenter", "touchstart", "pointerdown"];
//     const outEv = ["mouseleave", "touchend", "pointerup"];
//     inEv.forEach(e => row.addEventListener(e, enter, { passive: true }));
//     outEv.forEach(e => row.addEventListener(e, leave, { passive: true }));
//     return () => {
//       cancelAnimationFrame(raf);
//       inEv.forEach(e => row.removeEventListener(e, enter));
//       outEv.forEach(e => row.removeEventListener(e, leave));
//     };
//   }, [activeCat, courses]);

//   /* ── scroll reveals ── */
//   useEffect(() => {
//     const io = new IntersectionObserver((entries) => {
//       entries.forEach(e => {
//         if (!e.isIntersecting) return;
//         const el = e.target;
//         el.classList.add("shown");
//         if (el.dataset.stagger) {
//           el.querySelectorAll("[data-child]").forEach((c, i) =>
//             setTimeout(() => c.classList.add("shown"), i * 130));
//         }
//         io.unobserve(el);
//       });
//     }, { threshold: 0.12 });
//     document.querySelectorAll(".rp-reveal,.rp-fan,[data-stagger]").forEach(el => io.observe(el));
//     return () => io.disconnect();
//   }, [courses]);

//   return (
//     <>
//       <style>{CSS}</style>

//       <div className="rp">

//         {/* ── 1 · SPLIT HERO ── */}
//         <header className="rp-hero">
//           <div className="rp-hero-left">
//             <div className="rp-kicker">Fameo · Learning Center</div>
//             <h1 className="rp-h1">
//               <span className="line"><span>Creator</span></span>
//               <span className="line"><span><em>Knowledge</em> Hub</span></span>
//             </h1>
//             <p className="rp-sub">
//               Level up your creator craft with resources for every stage — from
//               influencer strategy and brand partnerships to scaling a lasting career.
//             </p>
//             <div className="rp-goal">
//               <div className="rp-goal-t">What do you want to master today?</div>
//               <div className="rp-goal-list">
//                 {GOALS.map(([label, cat]) => (
//                   <div
//                     key={cat}
//                     className={`rp-goal-item${goalCat === cat ? " on" : ""}`}
//                     onClick={() => pickGoal(cat)}
//                   >
//                     <div className="box" />
//                     {label}
//                     <span className="go">→</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="rp-hero-art">
//             {[["up", PORTRAITS.slice(0, 5)], ["down", PORTRAITS.slice(5, 10)]].map(([dir, imgs]) => (
//               <div key={dir} className={`rp-mos-col ${dir}`}>
//                 <div className="rp-mos-inner">
//                   {[...imgs, ...imgs].map((u, i) => (
//                     <img key={`${dir}-${i}`} src={u} alt="Fameo creator" loading="lazy" draggable="false" />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </header>

//         {/* ── 2 · MEMBERSHIP PERKS ── */}
//         <section className="rp-section rp-mem">
//           <div>
//             <h2 className="rp-reveal">What&apos;s in every Fameo membership?</h2>
//             <div className="rp-btns rp-reveal">
//               <a className="rp-btn rp-btn-primary" href="/plans">Get Fameo <span className="arr">→</span></a>
//               <a className="rp-btn rp-btn-ghost" href="/plans">♥ Gift</a>
//             </div>
//           </div>
//           <div className="rp-perks" data-stagger>
//             {PERKS.map(([ic, label]) => (
//               <div key={label} className="rp-perk" data-child>
//                 <div className="pico">{ic}</div>{label}
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── 3 · STATEMENT REVEAL ── */}
//         <section className="rp-statement">
//           <h2 ref={stRef}>
//             {STATEMENT_WORDS.map(([w, acc], i) => (
//               <span key={i}>
//                 <span className={`rp-w${acc ? " accent" : ""}`}>{w}</span>
//                 {i < STATEMENT_WORDS.length - 1 ? " " : ""}
//               </span>
//             ))}
//           </h2>
//           <p>New resources added every month</p>
//         </section>

//         {/* ── 4 · SHOWCASE CAROUSEL ── */}
//         <section
//           className="rp-showcase"
//           onMouseEnter={() => { showPaused.current = true; }}
//           onMouseLeave={() => { showPaused.current = false; }}
//         >
//           <div className="rp-show-track" ref={showTrackRef}>
//             {showcase.map((c, i) => (
//               <div
//                 key={c.id || i}
//                 className={`rp-slide${i === showIdx ? " active" : ""}`}
//                 onMouseEnter={() => prefetchCourse(c)}
//                 onClick={() => (i !== showIdx ? goShow(i) : openCourse(c))}
//               >
//                 <img src={c.heroThumb || c.thumbnail} alt={c.title} loading="lazy" draggable="false" />
//                 <div className="rp-slide-num">
//                   {String(i + 1).padStart(2, "0")} / {String(showcase.length).padStart(2, "0")}
//                 </div>
//                 <div className="rp-slide-info">
//                   <span className="rp-slide-cat">{c.category}</span>
//                   <h3>{c.title}</h3>
//                   <span className="rp-slide-start"><span className="c">▶</span>Start Learning</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="rp-show-ctrl">
//             <button className="rp-tbtn" onClick={() => goShow(showIdx - 1)} aria-label="Previous">←</button>
//             <div className="rp-dots">
//               {showcase.map((_, i) => (
//                 <button
//                   key={i}
//                   className={`rp-dot${i === showIdx ? " active" : ""}`}
//                   onClick={() => goShow(i)}
//                   aria-label={`Slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//             <button className="rp-tbtn" onClick={() => goShow(showIdx + 1)} aria-label="Next">→</button>
//           </div>
//         </section>

//         {/* ── 5 · BROWSE: PILLS + AUTO-LOOP ── */}
//         <section className="rp-section rp-browse" ref={browseRef}>
//           <div className="rp-pills">
//             {COURSE_CATEGORIES.map(cat => (
//               <button
//                 key={cat}
//                 className={`rp-pill${cat === activeCat ? " active" : ""}`}
//                 onClick={() => setActiveCat(cat)}
//               >
//                 <span className="ci">{PILL_ICON[cat] || "•"}</span>
//                 {cat}
//               </button>
//             ))}
//           </div>
//           <div className="rp-loop-head">
//             <div className="lh">
//               <b>{activeCat === "All" ? "Popular now" : activeCat}</b>
//               <span className="see" onClick={() => setActiveCat("All")}>See all</span>
//             </div>
//             <div className="rp-loop-nav">
//               <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: -560, behavior: "smooth" })} aria-label="Scroll left">←</button>
//               <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: 560, behavior: "smooth" })} aria-label="Scroll right">→</button>
//             </div>
//           </div>
//           <div className="rp-loop-outer">
//             <div className="rp-loop-row" ref={loopRef}>
//               {[...browseList, ...browseList, ...browseList].map((c, i) => (
//                 <div
//                   key={`${c.id || c.slug}-${i}`}
//                   className="rp-tcard"
//                   onMouseEnter={() => prefetchCourse(c)}
//                   onClick={() => openCourse(c)}
//                 >
//                   <img src={c.thumbnail || c.heroThumb} alt={c.title} loading="lazy" draggable="false" />
//                   {c.badge && (
//                     <span className="rp-tbadge" style={{ background: c.accent + "26", color: "#fff", border: `1px solid ${c.accent}55` }}>
//                       {c.badge}
//                     </span>
//                   )}
//                   <div className="rp-tinfo">
//                     <div className="tc">{c.category}</div>
//                     <h4>{c.title}</h4>
//                     <div className="tm">{[c.stat && `${c.stat} ${c.statLabel}`, c.tag].filter(Boolean).join(" · ").toUpperCase()}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── 6 · COMMUNITY FAN ── */}
//         <section className="rp-section rp-community">
//           <div>
//             <div className="rp-eyebrow rp-reveal">Community</div>
//             <h2 className="rp-reveal">Explore the<br />creator community</h2>
//             <div className="rp-com-rows" data-stagger>
//               {COMMUNITY.map(([ic, h, p]) => (
//                 <div key={h} className="rp-com-row" data-child>
//                   <div className="ico">{ic}</div>
//                   <div><h4>{h}</h4><p>{p}</p></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="rp-fan">
//             {FAN.map((f, i) => (
//               <div key={i} className="rp-fan-card">
//                 <img src={f.img} alt="" draggable="false" />
//                 <div className="cap">
//                   <div className="dot" />
//                   <div><b>Fameo Creator</b><br /><span>{f.cap}</span></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── 7 · MEMBERSHIP / PRICING ── */}
//         <section className="rp-section rp-member">
//           <div className="rp-mv">
//             <div className="rp-mv-img"><img src={MEMBER_IMG} alt="" draggable="false" /></div>
//             <div className="rp-price">
//               <div className="rp-price-ico">◈</div>
//               <h4>Get access to the exclusive Fameo membership</h4>
//               <div className="rp-tier">Basic <span>Free</span></div>
//               <div className="rp-tier hot">Pro <span>₹499/month</span></div>
//               <div className="rp-tier">Elite <span>₹999/month</span></div>
//               <a href="/plans"><button className="rp-pc-btn">Unlock Membership</button></a>
//             </div>
//           </div>
//           <div className="rp-mc">
//             <div className="rp-eyebrow rp-reveal">Membership</div>
//             <h2 className="rp-reveal">One membership. Every course. Zero limits.</h2>
//             <p className="rp-reveal">
//               Every course, playbook, and toolkit — plus the verified community that holds you accountable.
//             </p>
//             <div className="rp-benefits" data-stagger>
//               {[
//                 "All 8 courses and original playbooks",
//                 "Playbooks, toolkits & checklists included",
//                 "Learn on desktop, tablet, or mobile",
//                 "New resources added every month",
//                 "Verified creator community access",
//               ].map(b => (
//                 <div key={b} className="rp-benefit" data-child>
//                   <div className="chk">✓</div>{b}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── 8 · FAQ ── */}
//         <section className="rp-section rp-faq-wrap">
//           <div className="rp-eyebrow rp-reveal">Questions</div>
//           <h2 className="rp-reveal">Frequently asked questions</h2>
//           <div>
//             {FAQS.map(([q, a], i) => {
//               const open = openFaq === i;
//               return (
//                 <div key={i} className={`rp-faq${open ? " open" : ""}`}>
//                   <button className="rp-faq-q" onClick={() => setOpenFaq(open ? -1 : i)}>
//                     {q}<span className="chev">▼</span>
//                   </button>
//                   <div className="rp-faq-a" style={{ maxHeight: open ? "260px" : "0" }}>
//                     <p>{a}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ── 9 · CTA ── */}
//         <section className="rp-cta">
//           <h2 className="rp-reveal">Your fame is a craft.<br /><em>Master it.</em></h2>
//           <p className="rp-reveal">Join the verified creator community learning to build careers that last.</p>
//           <a className="rp-btn rp-btn-primary rp-reveal" href="/plans">Join the community <span className="arr">→</span></a>
//         </section>

//       </div>
//     </>
//   );
// }

// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { COURSES, COURSE_CATEGORIES } from "@/constants/courses";

// /* ─────────────────────────────────────────────────────────────
//    Normalise a DB / static course into the shape the UI expects
// ───────────────────────────────────────────────────────────── */
// function normalizeCourse(c) {
//   return {
//     ...c,
//     id:          c.courseId || c._id || c.slug,
//     description: c.description || c.subtitle || "",
//     subtitle:    c.subtitle   || "",
//     category:    c.category   || "Growth",
//     accent:      c.accent     || "#C9A96E",
//     thumbnail:   c.thumbnail  || c.heroThumb || "",
//     heroThumb:   c.heroThumb  || c.thumbnail || "",
//     tag:         c.tag        || c.level || "",
//     badge:       c.badge      || "",
//     stat:        c.stat       || "",
//     statLabel:   c.statLabel  || "",
//     level:       c.level      || "",
//     chapters:    Array.isArray(c.chapters) ? c.chapters : [],
//   };
// }

// /* Editorial helpers ─────────────────────────────────────────── */
// const PORTRAITS = [
//   "photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d",
//   "photo-1534528741775-53994a69daeb", "photo-1500648767791-00dcc994a43e",
//   "photo-1517841905240-472988babdf9", "photo-1524504388940-b1c1722653e1",
//   "photo-1506794778202-cad84cf45f1d", "photo-1531123897727-8f129e1688ce",
//   "photo-1539571696357-5a69c17a67c6", "photo-1544005313-94ddf0286df2",
// ].map(id => `https://images.unsplash.com/${id}?w=460&q=70&fit=crop`);

// const FAN = [
//   { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=70", cap: "shared a collab win" },
//   { img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=70", cap: "posted a studio setup" },
//   { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=70", cap: "hit 10× reach" },
// ];

// const MEMBER_IMG = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=70";

// /* Goal → real category from constants/courses.js */
// const GOALS = [
//   ["Build strong creator foundations", "Foundations"],
//   ["Create better content, faster",    "Content"],
//   ["Set up my studio & workflow",      "Setup"],
//   ["Grow my audience & reach",         "Growth"],
//   ["Turn my content into income",      "Monetization"],
//   ["Scale into a lasting career",      "Scaling"],
// ];

// const PILL_ICON = {
//   All: "✦", Foundations: "◈", Content: "✎", Setup: "⚙",
//   Growth: "↗", Monetization: "₹", Operations: "⚖", Scaling: "⤢",
// };

// const PERKS = [
//   ["▣", "All 8 courses and original playbooks"],
//   ["♫", "Audio-ready lessons for learning on the go"],
//   ["⇩", "Download toolkits, templates & checklists"],
//   ["▤", "Learn on desktop, tablet, or mobile"],
//   ["☆", "New resources added every month"],
//   ["✓", "Verified creator community access"],
// ];

// const COMMUNITY = [
//   ["✦", "Stay Inspired", "Discover trending topics, get quick answers, and find your people among verified creators."],
//   ["◈", "Stay Connected", "Follow your peers and mentors, exchange perspectives, and share some love."],
//   ["✎", "Keep Creating", "Explore new ideas for your next piece of content, post your work, and get feedback."],
// ];

// const FAQS = [
//   ["What is the Creator Knowledge Hub?", "It's Fameo's learning centre — 8 in-depth courses plus playbooks, toolkits, and checklists covering everything from creator foundations to monetisation and scaling, built from data across 12,000 Indian creators."],
//   ["Who are these courses for?", "Verified creators, influencers, and public figures at every stage — whether you're picking your niche or building a team around a decade-long career."],
//   ["Are the resources free?", "Core foundations are free for every verified Fameo member. Playbooks, masterclasses, and toolkits are part of the Pro and Elite memberships."],
//   ["How often is new content added?", "New courses, reports, and checklists are added every month — including trend reports like The Creator Economy Report."],
//   ["Can I learn on mobile?", "Yes. Every course works on desktop, tablet, and mobile, with bite-sized lessons designed for learning between shoots."],
// ];

// const STATEMENT_WORDS = [
//   ["Meet", 0], ["the", 0], ["best", 1], ["courses.", 1],
//   ["New", 0], ["resources", 0], ["added", 0], ["every", 0], ["month.", 0],
// ];

// /* ─────────────────────────────────────────────────────────────
//    STYLES — premium cream ("parchment & gold") theme
// ───────────────────────────────────────────────────────────── */
// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
// html{scroll-behavior:smooth}
// body{background:#FAF6F0;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}

// .rp{
//   --bg:#FAF6F0; --bg-soft:#FAF6F0; --card:#FFFDF8;
//   --ink:#2A1E14; --dim:rgba(42,30,20,.62); --faint:rgba(42,30,20,.40);
//   --gold:#B0894E; --gold-l:#C9A96E;
//   --rose:#C24E74;
//   --grad:linear-gradient(135deg,#D65B7A 0%,#BE4C86 52%,#8A57A8 100%);
//   --line:rgba(42,30,20,.12);
//   --shadow:0 24px 60px rgba(74,48,20,.14);
//   --serif:'Cormorant Garamond',Georgia,serif;
//   --sans:'DM Sans',-apple-system,sans-serif;
//   --ease:cubic-bezier(.22,1,.36,1);
//   background:var(--bg);color:var(--ink);font-family:var(--sans);
//   overflow-x:hidden;min-height:100vh;position:relative;
// }
// .rp ::selection{background:rgba(194,78,116,.22)}
// .rp-section{max-width:1320px;margin:0 auto;padding:0 48px}
// .rp-eyebrow{display:flex;align-items:center;gap:16px;color:var(--gold);font-size:10.5px;letter-spacing:.34em;font-weight:700;text-transform:uppercase;margin-bottom:30px}
// .rp-eyebrow::after{content:'';flex:1;height:1px;background:var(--line)}

// /* ---------- SPLIT HERO ---------- */
// .rp-hero{position:relative;max-width:1440px;margin:0 auto;padding:132px 48px 70px;
//   display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center;min-height:104vh}
// .rp-kicker{display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.4em;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:24px;
//   opacity:0;animation:rpFade 1s var(--ease) .2s forwards}
// .rp-kicker::before{content:'';width:34px;height:1.5px;background:var(--gold)}
// .rp-h1{font-family:var(--serif);font-weight:500;font-size:clamp(46px,5.4vw,84px);line-height:1.02;letter-spacing:-.01em}
// .rp-h1 .line{display:block;overflow:hidden}
// .rp-h1 .line span{display:block;transform:translateY(115%);animation:rpRise 1.15s var(--ease) forwards}
// .rp-h1 .line:nth-child(2) span{animation-delay:.14s}
// .rp-h1 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// @keyframes rpRise{to{transform:translateY(0)}}
// @keyframes rpFade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
// .rp-sub{margin-top:22px;color:var(--dim);font-size:16px;line-height:1.75;max-width:460px;font-weight:400;
//   opacity:0;animation:rpFade 1s var(--ease) .65s forwards}
// .rp-goal{margin-top:36px;opacity:0;animation:rpFade 1s var(--ease) .9s forwards}
// .rp-goal-t{font-size:11.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin-bottom:14px}
// .rp-goal-t::before{content:'';display:block;width:34px;height:3px;background:var(--grad);border-radius:2px;margin-bottom:14px}
// .rp-goal-list{display:flex;flex-direction:column;gap:9px;max-width:460px}
// .rp-goal-item{display:flex;align-items:center;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:13px;
//   padding:14px 18px;cursor:pointer;font-size:14px;color:var(--dim);font-weight:500;transition:all .35s var(--ease)}
// .rp-goal-item:hover{border-color:rgba(194,78,116,.4);color:var(--ink);transform:translateX(6px)}
// .rp-goal-item .box{width:19px;height:19px;border-radius:6px;border:1.5px solid rgba(42,30,20,.25);display:grid;place-items:center;
//   transition:all .3s var(--ease);flex-shrink:0;font-size:11px;color:#fff}
// .rp-goal-item .box::after{content:'✓';opacity:0;transform:scale(.4);transition:all .3s var(--ease)}
// .rp-goal-item.on{color:var(--ink);border-color:rgba(194,78,116,.45)}
// .rp-goal-item.on .box{background:var(--grad);border-color:transparent}
// .rp-goal-item.on .box::after{opacity:1;transform:scale(1)}
// .rp-goal-item .go{margin-left:auto;opacity:0;transform:translateX(-8px);transition:all .3s var(--ease);color:var(--rose);font-size:16px}
// .rp-goal-item:hover .go{opacity:1;transform:translateX(0)}

// .rp-hero-art{position:relative;height:96vh;min-height:720px;display:flex;gap:16px;overflow:hidden;border-radius:22px;
//   opacity:0;animation:rpFade 1.2s var(--ease) .5s forwards}
// .rp-hero-art::before,.rp-hero-art::after{content:'';position:absolute;left:0;right:0;height:130px;z-index:3;pointer-events:none}
// .rp-hero-art::before{top:0;background:linear-gradient(to bottom,var(--bg),transparent)}
// .rp-hero-art::after{bottom:0;background:linear-gradient(to top,var(--bg),transparent)}
// .rp-mos-col{flex:1;display:flex;flex-direction:column;gap:16px}
// .rp-mos-col.up .rp-mos-inner{animation:rpUp 42s linear infinite}
// .rp-mos-col.down .rp-mos-inner{animation:rpDown 48s linear infinite}
// .rp-mos-inner{display:flex;flex-direction:column;gap:16px}
// @keyframes rpUp{to{transform:translateY(-50%)}}
// @keyframes rpDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}
// .rp-mos-inner img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:16px;display:block;
//   filter:saturate(.96);transition:filter .4s,transform .4s var(--ease)}
// .rp-mos-inner img:hover{filter:saturate(1.08);transform:scale(1.02)}

// /* ---------- MEMBERSHIP PERKS SPLIT ---------- */
// .rp-mem{padding-top:120px;display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
// .rp-mem h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.8vw,54px);line-height:1.1;letter-spacing:-.01em}
// .rp-btns{display:flex;gap:14px;margin-top:34px;flex-wrap:wrap}
// .rp-btn{position:relative;display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-size:11.5px;letter-spacing:.18em;font-weight:700;
//   text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;transition:all .4s var(--ease);font-family:var(--sans)}
// .rp-btn-primary{background:var(--grad);color:#fff;box-shadow:0 10px 30px rgba(194,78,116,.32)}
// .rp-btn-primary:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(194,78,116,.42)}
// .rp-btn-ghost{background:transparent;color:var(--ink);border:1px solid rgba(42,30,20,.22)}
// .rp-btn-ghost:hover{border-color:var(--rose);color:var(--rose);transform:translateY(-3px)}
// .rp-btn .arr{transition:transform .35s var(--ease)}
// .rp-btn:hover .arr{transform:translateX(5px)}
// .rp-perks{display:flex;flex-direction:column;gap:2px}
// .rp-perk{display:flex;align-items:center;gap:18px;font-size:15px;color:var(--dim);padding:15px 6px;border-bottom:1px solid var(--line);
//   opacity:0;transform:translateX(26px);transition:all .7s var(--ease)}
// .rp-perk.shown{opacity:1;transform:none}
// .rp-perk:hover{color:var(--ink)}
// .rp-perk .pico{width:40px;height:40px;border-radius:12px;background:var(--card);border:1px solid var(--line);display:grid;place-items:center;
//   font-size:16px;flex-shrink:0;color:var(--rose);transition:all .35s var(--ease)}
// .rp-perk:hover .pico{border-color:rgba(194,78,116,.4);transform:translateY(-2px);box-shadow:0 8px 20px rgba(194,78,116,.16)}

// /* ---------- STATEMENT REVEAL ---------- */
// .rp-statement{padding:150px 24px 140px;text-align:center;max-width:1050px;margin:0 auto}
// .rp-statement h2{font-family:var(--serif);font-weight:500;font-size:clamp(38px,5.4vw,74px);line-height:1.16;letter-spacing:-.01em}
// .rp-w{display:inline-block;opacity:.16;transform:translateY(10px);filter:blur(1.4px);
//   transition:opacity .6s ease,transform .6s var(--ease),filter .6s ease;will-change:opacity}
// .rp-w.lit{opacity:1;transform:none;filter:blur(0)}
// .rp-w.accent{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// .rp-statement p{margin-top:26px;color:var(--gold);font-size:12px;letter-spacing:.32em;font-weight:700;text-transform:uppercase}

// /* ---------- SHOWCASE CAROUSEL ---------- */
// .rp-showcase{position:relative;padding:16px 0 0;overflow:hidden}
// .rp-show-track{display:flex;transition:transform .9s var(--ease);will-change:transform}
// .rp-slide{flex:0 0 72%;margin:0 14px;position:relative;border-radius:24px;overflow:hidden;aspect-ratio:16/8.2;
//   transform:scale(.93);opacity:.4;transition:transform .9s var(--ease),opacity .9s var(--ease);cursor:pointer;box-shadow:var(--shadow)}
// .rp-slide.active{transform:scale(1);opacity:1}
// .rp-slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 7s ease}
// .rp-slide.active:hover img{transform:scale(1.05)}
// .rp-slide::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.82) 4%,transparent 56%),linear-gradient(to right,rgba(30,18,10,.3),transparent 45%)}
// .rp-slide-info{position:absolute;left:44px;bottom:38px;z-index:2;max-width:74%}
// .rp-slide-cat{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.28em;font-weight:700;color:var(--gold-l);
//   background:rgba(30,18,10,.42);backdrop-filter:blur(8px);padding:7px 14px;border-radius:100px;border:1px solid rgba(201,169,110,.35)}
// .rp-slide-info h3{font-family:var(--serif);font-weight:500;font-size:clamp(28px,3.4vw,50px);line-height:1.06;margin-top:16px;color:#fff;
//   transform:translateY(14px);opacity:0;transition:all .8s var(--ease) .25s}
// .rp-slide.active .rp-slide-info h3{transform:none;opacity:1}
// .rp-slide-start{display:inline-flex;align-items:center;gap:10px;margin-top:18px;font-size:11px;letter-spacing:.26em;font-weight:700;color:#fff;text-transform:uppercase;
//   opacity:0;transform:translateY(10px);transition:all .8s var(--ease) .4s}
// .rp-slide.active .rp-slide-start{opacity:1;transform:none}
// .rp-slide-start .c{width:34px;height:34px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-size:12px;color:#fff}
// .rp-slide-num{position:absolute;top:24px;right:30px;z-index:2;font-family:var(--serif);font-size:20px;color:rgba(255,255,255,.6)}
// .rp-show-ctrl{display:flex;align-items:center;justify-content:center;gap:26px;margin-top:34px}
// .rp-tbtn{width:46px;height:46px;border-radius:50%;background:var(--card);border:1px solid var(--line);color:var(--ink);font-size:16px;cursor:pointer;
//   transition:all .35s var(--ease)}
// .rp-tbtn:hover{background:var(--grad);border-color:transparent;color:#fff}
// .rp-dots{display:flex;gap:8px}
// .rp-dot{width:22px;height:3px;border-radius:2px;background:rgba(42,30,20,.16);border:none;cursor:pointer;padding:0;transition:all .4s var(--ease)}
// .rp-dot.active{width:38px;background:var(--rose)}

// /* ---------- BROWSE: PILLS + AUTO-LOOP ---------- */
// .rp-browse{padding-top:140px}
// .rp-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;max-width:980px;margin:0 auto 54px}
// .rp-pill{display:inline-flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--line);color:var(--dim);
//   font-family:var(--sans);font-size:12.5px;font-weight:600;padding:12px 22px;border-radius:100px;cursor:pointer;transition:all .4s var(--ease)}
// .rp-pill .ci{font-size:13px;opacity:.85}
// .rp-pill:hover{color:var(--ink);border-color:rgba(42,30,20,.28);transform:translateY(-2px)}
// .rp-pill.active{color:#fff;border-color:transparent;background:var(--grad);box-shadow:0 8px 22px rgba(194,78,116,.28)}
// .rp-loop-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
// .rp-loop-head .lh{display:flex;align-items:baseline;gap:16px}
// .rp-loop-head b{font-family:var(--serif);font-weight:500;font-size:24px}
// .rp-loop-head .see{color:var(--faint);font-size:12.5px;cursor:pointer;transition:color .3s}
// .rp-loop-head .see:hover{color:var(--rose)}
// .rp-loop-nav{display:flex;gap:10px}
// .rp-loop-outer{position:relative;overflow:hidden}
// .rp-loop-outer::before,.rp-loop-outer::after{content:'';position:absolute;top:0;bottom:0;width:70px;z-index:3;pointer-events:none}
// .rp-loop-outer::before{left:0;background:linear-gradient(to right,var(--bg),transparent)}
// .rp-loop-outer::after{right:0;background:linear-gradient(to left,var(--bg),transparent)}
// .rp-loop-row{display:flex;gap:20px;overflow-x:auto;scrollbar-width:none;padding-bottom:6px}
// .rp-loop-row::-webkit-scrollbar{display:none}
// .rp-tcard{position:relative;flex:0 0 250px;border-radius:16px;overflow:hidden;cursor:pointer;aspect-ratio:3/4.1;
//   box-shadow:0 8px 24px rgba(74,48,20,.1);transition:transform .5s var(--ease),box-shadow .5s var(--ease)}
// .rp-tcard:hover{transform:translateY(-6px);box-shadow:0 22px 50px rgba(74,48,20,.2)}
// .rp-tcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
// .rp-tcard:hover img{transform:scale(1.08)}
// .rp-tcard::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.9) 6%,transparent 60%)}
// .rp-tbadge{position:absolute;top:12px;left:12px;z-index:2;font-size:9px;letter-spacing:.16em;font-weight:700;text-transform:uppercase;
//   padding:6px 11px;border-radius:100px;backdrop-filter:blur(6px)}
// .rp-tinfo{position:absolute;left:18px;right:18px;bottom:16px;z-index:2}
// .rp-tinfo .tc{font-size:9px;letter-spacing:.26em;font-weight:700;color:var(--gold-l);text-transform:uppercase}
// .rp-tinfo h4{font-family:var(--serif);font-weight:500;font-size:21px;margin-top:6px;line-height:1.14;color:#fff}
// .rp-tinfo .tm{margin-top:8px;font-size:10.5px;color:rgba(255,255,255,.6);letter-spacing:.05em}

// /* ---------- COMMUNITY FAN ---------- */
// .rp-community{padding-top:150px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
// .rp-community h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
// .rp-com-rows{margin-top:40px;display:flex;flex-direction:column;gap:30px}
// .rp-com-row{display:flex;gap:20px;align-items:flex-start;opacity:0;transform:translateY(22px);transition:all .8s var(--ease)}
// .rp-com-row.shown{opacity:1;transform:none}
// .rp-com-row .ico{width:48px;height:48px;border-radius:13px;display:grid;place-items:center;font-size:20px;flex-shrink:0;
//   background:var(--card);border:1px solid var(--line);color:var(--rose);transition:all .4s var(--ease)}
// .rp-com-row:hover .ico{transform:translateY(-4px) rotate(-6deg);border-color:rgba(194,78,116,.4);box-shadow:0 8px 22px rgba(194,78,116,.2)}
// .rp-com-row h4{font-size:16px;font-weight:700;color:var(--ink)}
// .rp-com-row p{color:var(--dim);font-size:14px;line-height:1.7;margin-top:6px;max-width:360px}
// .rp-fan{position:relative;height:520px}
// .rp-fan-card{position:absolute;left:50%;top:50%;width:62%;aspect-ratio:4/5;border-radius:16px;overflow:hidden;
//   background:#fff;padding:10px;box-shadow:0 24px 60px rgba(74,48,20,.28);
//   transform:translate(-50%,-50%) rotate(0deg);transition:transform 1.1s var(--ease);will-change:transform}
// .rp-fan-card img{width:100%;height:82%;object-fit:cover;border-radius:9px;display:block}
// .rp-fan-card .cap{height:18%;display:flex;align-items:center;gap:8px;padding:0 6px}
// .rp-fan-card .cap .dot{width:24px;height:24px;border-radius:50%;background:var(--grad);flex-shrink:0}
// .rp-fan-card .cap b{font-size:11px;color:#241a12;font-weight:700}
// .rp-fan-card .cap span{font-size:9.5px;color:#9b8f80}
// .rp-fan.shown .rp-fan-card:nth-child(1){transform:translate(-88%,-58%) rotate(-13deg)}
// .rp-fan.shown .rp-fan-card:nth-child(2){transform:translate(-50%,-46%) rotate(-2deg)}
// .rp-fan.shown .rp-fan-card:nth-child(3){transform:translate(-14%,-60%) rotate(11deg)}
// .rp-fan-card:hover{z-index:5}
// .rp-fan.shown .rp-fan-card:nth-child(1):hover{transform:translate(-88%,-62%) rotate(-10deg) scale(1.04)}
// .rp-fan.shown .rp-fan-card:nth-child(2):hover{transform:translate(-50%,-50%) rotate(0deg) scale(1.04)}
// .rp-fan.shown .rp-fan-card:nth-child(3):hover{transform:translate(-14%,-64%) rotate(8deg) scale(1.04)}

// /* ---------- MEMBERSHIP / PRICING ---------- */
// .rp-member{padding-top:150px;display:grid;grid-template-columns:1.2fr 1fr;gap:70px;align-items:center}
// .rp-mv{position:relative;height:480px}
// .rp-mv-img{position:absolute;inset:0 60px 40px 0;border-radius:20px;overflow:hidden;box-shadow:var(--shadow)}
// .rp-mv-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 8s ease}
// .rp-mv:hover .rp-mv-img img{transform:scale(1.06)}
// .rp-price{position:absolute;right:0;bottom:0;width:300px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;
//   box-shadow:0 30px 70px rgba(74,48,20,.24)}
// .rp-price-ico{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#f7e3ec,#efe6f7);display:grid;place-items:center;margin:0 auto 14px;font-size:18px;color:var(--rose)}
// .rp-price h4{text-align:center;font-size:15px;font-weight:700;line-height:1.4;color:var(--ink)}
// .rp-tier{display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:11px;padding:13px 16px;margin-top:10px;
//   font-size:13px;font-weight:700;cursor:pointer;color:var(--ink);transition:all .3s var(--ease)}
// .rp-tier span{color:var(--dim);font-weight:500;font-size:12px}
// .rp-tier:hover,.rp-tier.hot{border-color:var(--rose);background:#fdf4f8;transform:translateX(3px)}
// .rp-pc-btn{margin-top:16px;width:100%;border:none;background:var(--grad);color:#fff;font-family:var(--sans);font-weight:700;font-size:12px;
//   letter-spacing:.08em;padding:14px;border-radius:11px;cursor:pointer;text-transform:uppercase;transition:all .35s var(--ease)}
// .rp-pc-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(194,78,116,.4)}
// .rp-mc h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,3.6vw,52px);line-height:1.1;letter-spacing:-.01em}
// .rp-mc>p{color:var(--dim);line-height:1.8;margin-top:18px;font-size:15px}
// .rp-benefits{margin-top:32px;display:flex;flex-direction:column;gap:14px}
// .rp-benefit{display:flex;align-items:center;gap:14px;font-size:14.5px;color:var(--dim);
//   opacity:0;transform:translateX(-18px);transition:all .7s var(--ease)}
// .rp-benefit.shown{opacity:1;transform:none}
// .rp-benefit .chk{width:22px;height:22px;border-radius:50%;background:rgba(194,78,116,.12);border:1px solid rgba(194,78,116,.4);
//   display:grid;place-items:center;font-size:10px;color:var(--rose);flex-shrink:0}

// /* ---------- FAQ ---------- */
// .rp-faq-wrap{padding-top:150px;max-width:860px}
// .rp-faq-wrap h2{font-family:var(--serif);font-weight:500;font-size:clamp(32px,3.4vw,48px);margin-bottom:40px}
// .rp-faq{border-bottom:1px solid var(--line)}
// .rp-faq-q{width:100%;background:none;border:none;color:var(--ink);font-family:var(--sans);font-size:16px;font-weight:600;text-align:left;
//   padding:24px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;cursor:pointer;transition:color .3s}
// .rp-faq-q:hover{color:var(--rose)}
// .rp-faq-q .chev{flex-shrink:0;width:30px;height:30px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;
//   font-size:11px;transition:all .5s var(--ease)}
// .rp-faq.open .rp-faq-q .chev{transform:rotate(180deg);background:var(--grad);border-color:transparent;color:#fff}
// .rp-faq.open .rp-faq-q{color:var(--ink)}
// .rp-faq-a{max-height:0;overflow:hidden;transition:max-height .5s var(--ease)}
// .rp-faq-a p{color:var(--dim);line-height:1.8;font-size:14.5px;padding-bottom:24px;max-width:680px}

// /* ---------- CTA ---------- */
// .rp-cta{position:relative;margin-top:140px;padding:120px 24px;text-align:center;overflow:hidden;border-top:1px solid var(--line)}
// .rp-cta::before{content:'';position:absolute;left:50%;top:-40%;width:900px;height:600px;transform:translateX(-50%);
//   background:radial-gradient(ellipse,rgba(194,78,116,.12),transparent 65%);pointer-events:none}
// .rp-cta h2{position:relative;font-family:var(--serif);font-weight:500;font-size:clamp(38px,5vw,68px);line-height:1.1}
// .rp-cta h2 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
// .rp-cta p{position:relative;color:var(--dim);margin-top:20px;font-size:16px}
// .rp-cta .rp-btn{margin-top:38px}

// /* ---------- REVEAL ---------- */
// .rp-reveal{opacity:0;transform:translateY(38px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
// .rp-reveal.shown{opacity:1;transform:none}

// @media(max-width:1024px){
//   .rp-hero{grid-template-columns:1fr;padding-top:110px;min-height:auto}
//   .rp-hero-art{height:500px;min-height:0;order:-1;margin-top:20px}
//   .rp-mem,.rp-community,.rp-member{grid-template-columns:1fr}
//   .rp-fan{height:420px}
//   .rp-mv{height:420px}
//   .rp-slide{flex-basis:86%}
// }
// @media(max-width:980px){
//   .rp-section,.rp-hero{padding-left:22px;padding-right:22px}
// }
// @media(max-width:600px){
//   .rp-slide{flex-basis:90%}
// }
// @media(prefers-reduced-motion:reduce){
//   .rp *,.rp *::before,.rp *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
//   .rp-h1 .line span{transform:none}
//   .rp-kicker,.rp-sub,.rp-goal,.rp-hero-art{opacity:1!important}
//   .rp-reveal,.rp-com-row,.rp-benefit,.rp-perk{opacity:1;transform:none}
//   .rp-w{opacity:1;transform:none;filter:none}
// }
// `;

// /* ─────────────────────────────────────────────────────────────
//    MAIN PAGE
// ───────────────────────────────────────────────────────────── */
// export default function ResourcesPage() {
//   const router = useRouter();

//   const [courses, setCourses]     = useState(COURSES);
//   const [activeCat, setActiveCat] = useState("All");
//   const [goalCat, setGoalCat]     = useState(null);
//   const [showIdx, setShowIdx]     = useState(0);
//   const [openFaq, setOpenFaq]     = useState(0);

//   const stRef        = useRef(null);
//   const showTrackRef = useRef(null);
//   const loopRef      = useRef(null);
//   const browseRef    = useRef(null);
//   const showPaused   = useRef(false);
//   const loopPaused   = useRef(false);

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//   /* Live content: published DB courses override the static seed by slug */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const res  = await fetch(`${API_BASE}/api/courses?limit=100`);
//         const data = await res.json();
//         const dbCourses = data?.data?.courses || [];
//         if (!dbCourses.length || cancelled) return;
//         const dbBySlug = new Map(dbCourses.map(c => [c.slug, c]));
//         const merged = [
//           ...dbCourses.map(c => normalizeCourse(c)),
//           ...COURSES.filter(c => !dbBySlug.has(c.slug)),
//         ];
//         setCourses(merged);
//       } catch { /* API unreachable — keep static fallback */ }
//     })();
//     return () => { cancelled = true; };
//   }, [API_BASE]);

//   /* derived collections */
//   const showcase = courses.slice(0, 6);
//   const browseList = (() => {
//     const list = activeCat === "All" ? courses : courses.filter(c => c.category === activeCat);
//     return list.length ? list : courses;
//   })();

//   /* Navigate to the dedicated course route (no in-page overlay) */
//   const openCourse = (c) => {
//     if (!c?.slug) return;
//     router.push(`/resources/courses/${c.slug}`);
//   };

//   /* Prefetch on hover so the course page opens instantly */
//   const prefetchCourse = (c) => {
//     if (c?.slug) router.prefetch(`/resources/courses/${c.slug}`);
//   };

//   const pickGoal = (cat) => {
//     setGoalCat(cat);
//     setActiveCat(cat);
//     setTimeout(() => browseRef.current?.scrollIntoView({ behavior: "smooth" }), 340);
//   };

//   /* ── statement scroll reveal ── */
//   useEffect(() => {
//     const el = stRef.current;
//     if (!el) return;
//     const words = [...el.querySelectorAll(".rp-w")];
//     const update = () => {
//       const r = el.getBoundingClientRect();
//       const start = window.innerHeight * 0.85, end = window.innerHeight * 0.35;
//       const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
//       const lit = Math.floor(p * words.length);
//       words.forEach((w, i) => w.classList.toggle("lit", i < lit || p >= 1));
//     };
//     update();
//     window.addEventListener("scroll", update, { passive: true });
//     window.addEventListener("resize", update);
//     return () => {
//       window.removeEventListener("scroll", update);
//       window.removeEventListener("resize", update);
//     };
//   }, []);

//   /* ── showcase carousel layout ── */
//   const layoutShow = useCallback((i) => {
//     const track = showTrackRef.current;
//     if (!track || !track.children.length) return;
//     const first = track.children[0].getBoundingClientRect();
//     const step = first.width + 28;                 // slide + 14px margin each side
//     const center = (window.innerWidth - first.width) / 2;
//     track.style.transform = `translateX(${center - i * step - 14}px)`;
//   }, []);

//   useEffect(() => { layoutShow(showIdx); }, [showIdx, courses, layoutShow]);
//   useEffect(() => {
//     const onResize = () => layoutShow(showIdx);
//     window.addEventListener("resize", onResize);
//     window.addEventListener("load", onResize);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("load", onResize);
//     };
//   }, [showIdx, layoutShow]);

//   useEffect(() => {
//     const n = Math.min(6, courses.length) || 1;
//     const t = setInterval(() => {
//       if (!showPaused.current) setShowIdx(i => (i + 1) % n);
//     }, 4600);
//     return () => clearInterval(t);
//   }, [courses.length]);

//   const goShow = (i) => {
//     const n = Math.min(6, courses.length) || 1;
//     setShowIdx(((i % n) + n) % n);
//   };

//   /* ── browse infinite auto-loop ── */
//   useEffect(() => {
//     const row = loopRef.current;
//     if (!row) return;
//     row.scrollLeft = 0;
//     let raf, last = 0;
//     const tick = (t) => {
//       if (!last) last = t;
//       const dt = t - last; last = t;
//       if (!loopPaused.current) {
//         row.scrollLeft += dt * 0.045;
//         const w = row.scrollWidth / 3;
//         if (w > 0 && row.scrollLeft >= w * 2) row.scrollLeft -= w;
//       }
//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     const enter = () => { loopPaused.current = true; };
//     const leave = () => { loopPaused.current = false; };
//     const inEv = ["mouseenter", "touchstart", "pointerdown"];
//     const outEv = ["mouseleave", "touchend", "pointerup"];
//     inEv.forEach(e => row.addEventListener(e, enter, { passive: true }));
//     outEv.forEach(e => row.addEventListener(e, leave, { passive: true }));
//     return () => {
//       cancelAnimationFrame(raf);
//       inEv.forEach(e => row.removeEventListener(e, enter));
//       outEv.forEach(e => row.removeEventListener(e, leave));
//     };
//   }, [activeCat, courses]);

//   /* ── scroll reveals ── */
//   useEffect(() => {
//     const io = new IntersectionObserver((entries) => {
//       entries.forEach(e => {
//         if (!e.isIntersecting) return;
//         const el = e.target;
//         el.classList.add("shown");
//         if (el.dataset.stagger) {
//           el.querySelectorAll("[data-child]").forEach((c, i) =>
//             setTimeout(() => c.classList.add("shown"), i * 130));
//         }
//         io.unobserve(el);
//       });
//     }, { threshold: 0.12 });
//     document.querySelectorAll(".rp-reveal,.rp-fan,[data-stagger]").forEach(el => io.observe(el));
//     return () => io.disconnect();
//   }, [courses]);

//   return (
//     <>
//       <style>{CSS}</style>

//       <div className="rp">

//         {/* ── 1 · SPLIT HERO ── */}
//         <header className="rp-hero">
//           <div className="rp-hero-left">
//             <div className="rp-kicker">Fameo · Learning Center</div>
//             <h1 className="rp-h1">
//               <span className="line"><span>Creator</span></span>
//               <span className="line"><span><em>Knowledge</em> Hub</span></span>
//             </h1>
//             <p className="rp-sub">
//               Level up your creator craft with resources for every stage — from
//               influencer strategy and brand partnerships to scaling a lasting career.
//             </p>
//             <div className="rp-goal">
//               <div className="rp-goal-t">What do you want to master today?</div>
//               <div className="rp-goal-list">
//                 {GOALS.map(([label, cat]) => (
//                   <div
//                     key={cat}
//                     className={`rp-goal-item${goalCat === cat ? " on" : ""}`}
//                     onClick={() => pickGoal(cat)}
//                   >
//                     <div className="box" />
//                     {label}
//                     <span className="go">→</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="rp-hero-art">
//             {[["up", PORTRAITS.slice(0, 5)], ["down", PORTRAITS.slice(5, 10)]].map(([dir, imgs]) => (
//               <div key={dir} className={`rp-mos-col ${dir}`}>
//                 <div className="rp-mos-inner">
//                   {[...imgs, ...imgs].map((u, i) => (
//                     <img key={`${dir}-${i}`} src={u} alt="Fameo creator" loading="lazy" draggable="false" />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </header>

//         {/* ── 2 · MEMBERSHIP PERKS ── */}
//         <section className="rp-section rp-mem">
//           <div>
//             <h2 className="rp-reveal">What&apos;s in every Fameo membership?</h2>
//             <div className="rp-btns rp-reveal">
//               <a className="rp-btn rp-btn-primary" href="/plans">Get Fameo <span className="arr">→</span></a>
//               <a className="rp-btn rp-btn-ghost" href="/plans">♥ Gift</a>
//             </div>
//           </div>
//           <div className="rp-perks" data-stagger>
//             {PERKS.map(([ic, label]) => (
//               <div key={label} className="rp-perk" data-child>
//                 <div className="pico">{ic}</div>{label}
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── 3 · STATEMENT REVEAL ── */}
//         <section className="rp-statement">
//           <h2 ref={stRef}>
//             {STATEMENT_WORDS.map(([w, acc], i) => (
//               <span key={i}>
//                 <span className={`rp-w${acc ? " accent" : ""}`}>{w}</span>
//                 {i < STATEMENT_WORDS.length - 1 ? " " : ""}
//               </span>
//             ))}
//           </h2>
//           <p>New resources added every month</p>
//         </section>

//         {/* ── 4 · SHOWCASE CAROUSEL ── */}
//         <section
//           className="rp-showcase"
//           onMouseEnter={() => { showPaused.current = true; }}
//           onMouseLeave={() => { showPaused.current = false; }}
//         >
//           <div className="rp-show-track" ref={showTrackRef}>
//             {showcase.map((c, i) => (
//               <div
//                 key={c.id || i}
//                 className={`rp-slide${i === showIdx ? " active" : ""}`}
//                 onMouseEnter={() => prefetchCourse(c)}
//                 onClick={() => (i !== showIdx ? goShow(i) : openCourse(c))}
//               >
//                 <img src={c.heroThumb || c.thumbnail} alt={c.title} loading="lazy" draggable="false" />
//                 <div className="rp-slide-num">
//                   {String(i + 1).padStart(2, "0")} / {String(showcase.length).padStart(2, "0")}
//                 </div>
//                 <div className="rp-slide-info">
//                   <span className="rp-slide-cat">{c.category}</span>
//                   <h3>{c.title}</h3>
//                   <span className="rp-slide-start"><span className="c">▶</span>Start Learning</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="rp-show-ctrl">
//             <button className="rp-tbtn" onClick={() => goShow(showIdx - 1)} aria-label="Previous">←</button>
//             <div className="rp-dots">
//               {showcase.map((_, i) => (
//                 <button
//                   key={i}
//                   className={`rp-dot${i === showIdx ? " active" : ""}`}
//                   onClick={() => goShow(i)}
//                   aria-label={`Slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//             <button className="rp-tbtn" onClick={() => goShow(showIdx + 1)} aria-label="Next">→</button>
//           </div>
//         </section>

//         {/* ── 5 · BROWSE: PILLS + AUTO-LOOP ── */}
//         <section className="rp-section rp-browse" ref={browseRef}>
//           <div className="rp-pills">
//             {COURSE_CATEGORIES.map(cat => (
//               <button
//                 key={cat}
//                 className={`rp-pill${cat === activeCat ? " active" : ""}`}
//                 onClick={() => setActiveCat(cat)}
//               >
//                 <span className="ci">{PILL_ICON[cat] || "•"}</span>
//                 {cat}
//               </button>
//             ))}
//           </div>
//           <div className="rp-loop-head">
//             <div className="lh">
//               <b>{activeCat === "All" ? "Popular now" : activeCat}</b>
//               <span className="see" onClick={() => setActiveCat("All")}>See all</span>
//             </div>
//             <div className="rp-loop-nav">
//               <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: -560, behavior: "smooth" })} aria-label="Scroll left">←</button>
//               <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: 560, behavior: "smooth" })} aria-label="Scroll right">→</button>
//             </div>
//           </div>
//           <div className="rp-loop-outer">
//             <div className="rp-loop-row" ref={loopRef}>
//               {[...browseList, ...browseList, ...browseList].map((c, i) => (
//                 <div
//                   key={`${c.id || c.slug}-${i}`}
//                   className="rp-tcard"
//                   onMouseEnter={() => prefetchCourse(c)}
//                   onClick={() => openCourse(c)}
//                 >
//                   <img src={c.thumbnail || c.heroThumb} alt={c.title} loading="lazy" draggable="false" />
//                   {c.badge && (
//                     <span className="rp-tbadge" style={{ background: c.accent + "26", color: "#fff", border: `1px solid ${c.accent}55` }}>
//                       {c.badge}
//                     </span>
//                   )}
//                   <div className="rp-tinfo">
//                     <div className="tc">{c.category}</div>
//                     <h4>{c.title}</h4>
//                     <div className="tm">{[c.stat && `${c.stat} ${c.statLabel}`, c.tag].filter(Boolean).join(" · ").toUpperCase()}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── 6 · COMMUNITY FAN ── */}
//         <section className="rp-section rp-community">
//           <div>
//             <div className="rp-eyebrow rp-reveal">Community</div>
//             <h2 className="rp-reveal">Explore the<br />creator community</h2>
//             <div className="rp-com-rows" data-stagger>
//               {COMMUNITY.map(([ic, h, p]) => (
//                 <div key={h} className="rp-com-row" data-child>
//                   <div className="ico">{ic}</div>
//                   <div><h4>{h}</h4><p>{p}</p></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="rp-fan">
//             {FAN.map((f, i) => (
//               <div key={i} className="rp-fan-card">
//                 <img src={f.img} alt="" draggable="false" />
//                 <div className="cap">
//                   <div className="dot" />
//                   <div><b>Fameo Creator</b><br /><span>{f.cap}</span></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── 7 · MEMBERSHIP / PRICING ── */}
//         <section className="rp-section rp-member">
//           <div className="rp-mv">
//             <div className="rp-mv-img"><img src={MEMBER_IMG} alt="" draggable="false" /></div>
//             <div className="rp-price">
//               <div className="rp-price-ico">◈</div>
//               <h4>Get access to the exclusive Fameo membership</h4>
//               <div className="rp-tier">Basic <span>Free</span></div>
//               <div className="rp-tier hot">Pro <span>₹499/month</span></div>
//               <div className="rp-tier">Elite <span>₹999/month</span></div>
//               <a href="/plans"><button className="rp-pc-btn">Unlock Membership</button></a>
//             </div>
//           </div>
//           <div className="rp-mc">
//             <div className="rp-eyebrow rp-reveal">Membership</div>
//             <h2 className="rp-reveal">One membership. Every course. Zero limits.</h2>
//             <p className="rp-reveal">
//               Every course, playbook, and toolkit — plus the verified community that holds you accountable.
//             </p>
//             <div className="rp-benefits" data-stagger>
//               {[
//                 "All 8 courses and original playbooks",
//                 "Playbooks, toolkits & checklists included",
//                 "Learn on desktop, tablet, or mobile",
//                 "New resources added every month",
//                 "Verified creator community access",
//               ].map(b => (
//                 <div key={b} className="rp-benefit" data-child>
//                   <div className="chk">✓</div>{b}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── 8 · FAQ ── */}
//         <section className="rp-section rp-faq-wrap">
//           <div className="rp-eyebrow rp-reveal">Questions</div>
//           <h2 className="rp-reveal">Frequently asked questions</h2>
//           <div>
//             {FAQS.map(([q, a], i) => {
//               const open = openFaq === i;
//               return (
//                 <div key={i} className={`rp-faq${open ? " open" : ""}`}>
//                   <button className="rp-faq-q" onClick={() => setOpenFaq(open ? -1 : i)}>
//                     {q}<span className="chev">▼</span>
//                   </button>
//                   <div className="rp-faq-a" style={{ maxHeight: open ? "260px" : "0" }}>
//                     <p>{a}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ── 9 · CTA ── */}
//         <section className="rp-cta">
//           <h2 className="rp-reveal">Your fame is a craft.<br /><em>Master it.</em></h2>
//           <p className="rp-reveal">Join the verified creator community learning to build careers that last.</p>
//           <a className="rp-btn rp-btn-primary rp-reveal" href="/plans">Join the community <span className="arr">→</span></a>
//         </section>

//       </div>
//     </>
//   );
// }



"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { COURSES, COURSE_CATEGORIES } from "@/constants/courses";

/* ─────────────────────────────────────────────────────────────
   Normalise a DB / static course into the shape the UI expects
───────────────────────────────────────────────────────────── */
function normalizeCourse(c) {
  return {
    ...c,
    id:          c.courseId || c._id || c.slug,
    description: c.description || c.subtitle || "",
    subtitle:    c.subtitle   || "",
    category:    c.category   || "Growth",
    accent:      c.accent     || "#C9A96E",
    thumbnail:   c.thumbnail  || c.heroThumb || "",
    heroThumb:   c.heroThumb  || c.thumbnail || "",
    tag:         c.tag        || c.level || "",
    badge:       c.badge      || "",
    stat:        c.stat       || "",
    statLabel:   c.statLabel  || "",
    level:       c.level      || "",
    chapters:    Array.isArray(c.chapters) ? c.chapters : [],
  };
}

/* Editorial helpers ─────────────────────────────────────────── */
const PORTRAITS = [
  "photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d",
  "photo-1534528741775-53994a69daeb", "photo-1500648767791-00dcc994a43e",
  "photo-1517841905240-472988babdf9", "photo-1524504388940-b1c1722653e1",
  "photo-1506794778202-cad84cf45f1d", "photo-1531123897727-8f129e1688ce",
  "photo-1539571696357-5a69c17a67c6", "photo-1544005313-94ddf0286df2",
].map(id => `https://images.unsplash.com/${id}?w=460&q=70&fit=crop`);

const FAN = [
  { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=70", cap: "shared a collab win" },
  { img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=70", cap: "posted a studio setup" },
  { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=70", cap: "hit 10× reach" },
];

const MEMBER_IMG = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=70";

/* Goal → real category from constants/courses.js */
const GOALS = [
  ["Build strong creator foundations", "Foundations"],
  ["Create better content, faster",    "Content"],
  ["Set up my studio & workflow",      "Setup"],
  ["Grow my audience & reach",         "Growth"],
  ["Turn my content into income",      "Monetization"],
  ["Scale into a lasting career",      "Scaling"],
];

const PILL_ICON = {
  All: "✦", Foundations: "◈", Content: "✎", Setup: "⚙",
  Growth: "↗", Monetization: "₹", Operations: "⚖", Scaling: "⤢",
};

const PERKS = [
  ["▣", "All 8 courses and original playbooks"],
  ["♫", "Audio-ready lessons for learning on the go"],
  ["⇩", "Download toolkits, templates & checklists"],
  ["▤", "Learn on desktop, tablet, or mobile"],
  ["☆", "New resources added every month"],
  ["✓", "Verified creator community access"],
];

const COMMUNITY = [
  ["✦", "Stay Inspired", "Discover trending topics, get quick answers, and find your people among verified creators."],
  ["◈", "Stay Connected", "Follow your peers and mentors, exchange perspectives, and share some love."],
  ["✎", "Keep Creating", "Explore new ideas for your next piece of content, post your work, and get feedback."],
];

const FAQS = [
  ["What is the Creator Knowledge Hub?", "It's Fameo's learning centre — 8 in-depth courses plus playbooks, toolkits, and checklists covering everything from creator foundations to monetisation and scaling, built from data across 12,000 Indian creators."],
  ["Who are these courses for?", "Verified creators, influencers, and public figures at every stage — whether you're picking your niche or building a team around a decade-long career."],
  ["Are the resources free?", "Core foundations are free for every verified Fameo member. Playbooks, masterclasses, and toolkits are part of the Pro and Elite memberships."],
  ["How often is new content added?", "New courses, reports, and checklists are added every month — including trend reports like The Creator Economy Report."],
  ["Can I learn on mobile?", "Yes. Every course works on desktop, tablet, and mobile, with bite-sized lessons designed for learning between shoots."],
];

const STATEMENT_WORDS = [
  ["Meet", 0], ["the", 0], ["best", 1], ["courses.", 1],
  ["New", 0], ["resources", 0], ["added", 0], ["every", 0], ["month.", 0],
];

/* ─────────────────────────────────────────────────────────────
   STYLES — premium cream ("parchment & gold") theme
───────────────────────────────────────────────────────────── */
const CSS = `
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

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function ResourcesPage() {
  const router = useRouter();

  const [courses, setCourses]     = useState(COURSES);
  const [activeCat, setActiveCat] = useState("All");
  const [goalCat, setGoalCat]     = useState(null);
  const [showIdx, setShowIdx]     = useState(0);
  const [openFaq, setOpenFaq]     = useState(0);

  const stRef        = useRef(null);
  const showTrackRef = useRef(null);
  const loopRef      = useRef(null);
  const browseRef    = useRef(null);
  const showPaused   = useRef(false);
  const loopPaused   = useRef(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  /* Live content: published DB courses override the static seed by slug */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/courses?limit=100`);
        const data = await res.json();
        const dbCourses = data?.data?.courses || [];
        if (!dbCourses.length || cancelled) return;
        const dbBySlug = new Map(dbCourses.map(c => [c.slug, c]));
        const merged = [
          ...dbCourses.map(c => normalizeCourse(c)),
          ...COURSES.filter(c => !dbBySlug.has(c.slug)),
        ];
        setCourses(merged);
      } catch { /* API unreachable — keep static fallback */ }
    })();
    return () => { cancelled = true; };
  }, [API_BASE]);

  /* derived collections */
  const showcase = courses.slice(0, 6);
  const browseList = (() => {
    const list = activeCat === "All" ? courses : courses.filter(c => c.category === activeCat);
    return list.length ? list : courses;
  })();

  /* Navigate to the dedicated course route (no in-page overlay) */
  const openCourse = (c) => {
    if (!c?.slug) return;
    router.push(`/resources/courses/${c.slug}`);
  };

  /* Prefetch on hover so the course page opens instantly */
  const prefetchCourse = (c) => {
    if (c?.slug) router.prefetch(`/resources/courses/${c.slug}`);
  };

  const pickGoal = (cat) => {
    setGoalCat(cat);
    setActiveCat(cat);
    setTimeout(() => browseRef.current?.scrollIntoView({ behavior: "smooth" }), 340);
  };

  /* ── statement scroll reveal ── */
  useEffect(() => {
    const el = stRef.current;
    if (!el) return;
    const words = [...el.querySelectorAll(".rp-w")];
    const update = () => {
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85, end = window.innerHeight * 0.35;
      const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
      const lit = Math.floor(p * words.length);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit || p >= 1));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* ── showcase carousel layout ── */
  const layoutShow = useCallback((i) => {
    const track = showTrackRef.current;
    if (!track || !track.children.length) return;
    const first = track.children[0].getBoundingClientRect();
    const step = first.width + 28;                 // slide + 14px margin each side
    const center = (window.innerWidth - first.width) / 2;
    track.style.transform = `translateX(${center - i * step - 14}px)`;
  }, []);

  useEffect(() => { layoutShow(showIdx); }, [showIdx, courses, layoutShow]);
  useEffect(() => {
    const onResize = () => layoutShow(showIdx);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
    };
  }, [showIdx, layoutShow]);

  useEffect(() => {
    const n = Math.min(6, courses.length) || 1;
    const t = setInterval(() => {
      if (!showPaused.current) setShowIdx(i => (i + 1) % n);
    }, 4600);
    return () => clearInterval(t);
  }, [courses.length]);

  const goShow = (i) => {
    const n = Math.min(6, courses.length) || 1;
    setShowIdx(((i % n) + n) % n);
  };

  /* ── browse infinite auto-loop ── */
  useEffect(() => {
    const row = loopRef.current;
    if (!row) return;
    row.scrollLeft = 0;
    let raf, last = 0;
    const tick = (t) => {
      if (!last) last = t;
      const dt = t - last; last = t;
      if (!loopPaused.current) {
        row.scrollLeft += dt * 0.045;
        const w = row.scrollWidth / 3;
        if (w > 0 && row.scrollLeft >= w * 2) row.scrollLeft -= w;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const enter = () => { loopPaused.current = true; };
    const leave = () => { loopPaused.current = false; };
    const inEv = ["mouseenter", "touchstart", "pointerdown"];
    const outEv = ["mouseleave", "touchend", "pointerup"];
    inEv.forEach(e => row.addEventListener(e, enter, { passive: true }));
    outEv.forEach(e => row.addEventListener(e, leave, { passive: true }));
    return () => {
      cancelAnimationFrame(raf);
      inEv.forEach(e => row.removeEventListener(e, enter));
      outEv.forEach(e => row.removeEventListener(e, leave));
    };
  }, [activeCat, courses]);

  /* ── scroll reveals ── */
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("shown");
        if (el.dataset.stagger) {
          el.querySelectorAll("[data-child]").forEach((c, i) =>
            setTimeout(() => c.classList.add("shown"), i * 130));
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".rp-reveal,.rp-fan,[data-stagger]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [courses]);

  return (
    <>
      <style>{CSS}</style>

      <div className="rp">

        {/* ── 1 · SPLIT HERO ── */}
        <header className="rp-hero">
          <div className="rp-hero-left">
            <div className="rp-kicker">Fameo · Learning Center</div>
            <h1 className="rp-h1">
              <span className="line"><span>Creator</span></span>
              <span className="line"><span><em>Knowledge</em> Hub</span></span>
            </h1>
            <p className="rp-sub">
              Level up your creator craft with resources for every stage — from
              influencer strategy and brand partnerships to scaling a lasting career.
            </p>
            <div className="rp-goal">
              <div className="rp-goal-t">What do you want to master today?</div>
              <div className="rp-goal-list">
                {GOALS.map(([label, cat]) => (
                  <div
                    key={cat}
                    className={`rp-goal-item${goalCat === cat ? " on" : ""}`}
                    onClick={() => pickGoal(cat)}
                  >
                    <div className="box" />
                    {label}
                    <span className="go">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rp-hero-art">
            {[["up", PORTRAITS.slice(0, 5)], ["down", PORTRAITS.slice(5, 10)]].map(([dir, imgs]) => (
              <div key={dir} className={`rp-mos-col ${dir}`}>
                <div className="rp-mos-inner">
                  {[...imgs, ...imgs].map((u, i) => (
                    <img key={`${dir}-${i}`} src={u} alt="Fameo creator" loading="lazy" draggable="false" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* ── 2 · MEMBERSHIP PERKS ── */}
        <section className="rp-section rp-mem">
          <div>
            <h2 className="rp-reveal">What&apos;s in every Fameo membership?</h2>
            <div className="rp-btns rp-reveal">
              <a className="rp-btn rp-btn-primary" href="/plans">Get Fameo <span className="arr">→</span></a>
              <a className="rp-btn rp-btn-ghost" href="/plans">♥ Gift</a>
            </div>
          </div>
          <div className="rp-perks" data-stagger>
            {PERKS.map(([ic, label]) => (
              <div key={label} className="rp-perk" data-child>
                <div className="pico">{ic}</div>{label}
              </div>
            ))}
          </div>
        </section>

        {/* ── 3 · STATEMENT REVEAL ── */}
        <section className="rp-statement">
          <h2 ref={stRef}>
            {STATEMENT_WORDS.map(([w, acc], i) => (
              <span key={i}>
                <span className={`rp-w${acc ? " accent" : ""}`}>{w}</span>
                {i < STATEMENT_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          <p>New resources added every month</p>
        </section>

        {/* ── 4 · SHOWCASE CAROUSEL ── */}
        <section
          className="rp-showcase"
          onMouseEnter={() => { showPaused.current = true; }}
          onMouseLeave={() => { showPaused.current = false; }}
        >
          <div className="rp-show-track" ref={showTrackRef}>
            {showcase.map((c, i) => (
              <div
                key={c.id || i}
                className={`rp-slide${i === showIdx ? " active" : ""}`}
                onMouseEnter={() => prefetchCourse(c)}
                onClick={() => (i !== showIdx ? goShow(i) : openCourse(c))}
              >
                <img src={c.heroThumb || c.thumbnail} alt={c.title} loading="lazy" draggable="false" />
                <div className="rp-slide-num">
                  {String(i + 1).padStart(2, "0")} / {String(showcase.length).padStart(2, "0")}
                </div>
                <div className="rp-slide-info">
                  <span className="rp-slide-cat">{c.category}</span>
                  <h3>{c.title}</h3>
                  <span className="rp-slide-start"><span className="c">▶</span>Start Learning</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rp-show-ctrl">
            <button className="rp-tbtn" onClick={() => goShow(showIdx - 1)} aria-label="Previous">←</button>
            <div className="rp-dots">
              {showcase.map((_, i) => (
                <button
                  key={i}
                  className={`rp-dot${i === showIdx ? " active" : ""}`}
                  onClick={() => goShow(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button className="rp-tbtn" onClick={() => goShow(showIdx + 1)} aria-label="Next">→</button>
          </div>
        </section>

        {/* ── 5 · BROWSE: PILLS + AUTO-LOOP ── */}
        <section className="rp-section rp-browse" ref={browseRef}>
          <div className="rp-pills">
            {COURSE_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`rp-pill${cat === activeCat ? " active" : ""}`}
                onClick={() => setActiveCat(cat)}
              >
                <span className="ci">{PILL_ICON[cat] || "•"}</span>
                {cat}
              </button>
            ))}
          </div>
          <div className="rp-loop-head">
            <div className="lh">
              <b>{activeCat === "All" ? "Popular now" : activeCat}</b>
              <span className="see" onClick={() => setActiveCat("All")}>See all</span>
            </div>
            <div className="rp-loop-nav">
              <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: -560, behavior: "smooth" })} aria-label="Scroll left">←</button>
              <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: 560, behavior: "smooth" })} aria-label="Scroll right">→</button>
            </div>
          </div>
          <div className="rp-loop-outer">
            <div className="rp-loop-row" ref={loopRef}>
              {[...browseList, ...browseList, ...browseList].map((c, i) => (
                <div
                  key={`${c.id || c.slug}-${i}`}
                  className="rp-tcard"
                  onMouseEnter={() => prefetchCourse(c)}
                  onClick={() => openCourse(c)}
                >
                  <img src={c.thumbnail || c.heroThumb} alt={c.title} loading="lazy" draggable="false" />
                  {c.badge && (
                    <span className="rp-tbadge" style={{ background: c.accent + "26", color: "#fff", border: `1px solid ${c.accent}55` }}>
                      {c.badge}
                    </span>
                  )}
                  <div className="rp-tinfo">
                    <div className="tc">{c.category}</div>
                    <h4>{c.title}</h4>
                    <div className="tm">{[c.stat && `${c.stat} ${c.statLabel}`, c.tag].filter(Boolean).join(" · ").toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6 · COMMUNITY FAN ── */}
        <section className="rp-section rp-community">
          <div>
            <div className="rp-eyebrow rp-reveal">Community</div>
            <h2 className="rp-reveal">Explore the<br />creator community</h2>
            <div className="rp-com-rows" data-stagger>
              {COMMUNITY.map(([ic, h, p]) => (
                <div key={h} className="rp-com-row" data-child>
                  <div className="ico">{ic}</div>
                  <div><h4>{h}</h4><p>{p}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rp-fan">
            {FAN.map((f, i) => (
              <div key={i} className="rp-fan-card">
                <img src={f.img} alt="" draggable="false" />
                <div className="cap">
                  <div className="dot" />
                  <div><b>Fameo Creator</b><br /><span>{f.cap}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7 · MEMBERSHIP / PRICING ── */}
        <section className="rp-section rp-member">
          <div className="rp-mv">
            <div className="rp-mv-img"><img src={MEMBER_IMG} alt="" draggable="false" /></div>
            <div className="rp-price">
              <div className="rp-price-ico">◈</div>
              <h4>Get access to the exclusive Fameo membership</h4>
              <div className="rp-tier">Basic <span>Free</span></div>
              <div className="rp-tier hot">Pro <span>₹499/month</span></div>
              <div className="rp-tier">Elite <span>₹999/month</span></div>
              <a href="/plans"><button className="rp-pc-btn">Unlock Membership</button></a>
            </div>
          </div>
          <div className="rp-mc">
            <div className="rp-eyebrow rp-reveal">Membership</div>
            <h2 className="rp-reveal">One membership. Every course. Zero limits.</h2>
            <p className="rp-reveal">
              Every course, playbook, and toolkit — plus the verified community that holds you accountable.
            </p>
            <div className="rp-benefits" data-stagger>
              {[
                "All 8 courses and original playbooks",
                "Playbooks, toolkits & checklists included",
                "Learn on desktop, tablet, or mobile",
                "New resources added every month",
                "Verified creator community access",
              ].map(b => (
                <div key={b} className="rp-benefit" data-child>
                  <div className="chk">✓</div>{b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8 · FAQ ── */}
        <section className="rp-section rp-faq-wrap">
          <div className="rp-eyebrow rp-reveal">Questions</div>
          <h2 className="rp-reveal">Frequently asked questions</h2>
          <div>
            {FAQS.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`rp-faq${open ? " open" : ""}`}>
                  <button className="rp-faq-q" onClick={() => setOpenFaq(open ? -1 : i)}>
                    {q}<span className="chev">▼</span>
                  </button>
                  <div className="rp-faq-a" style={{ maxHeight: open ? "260px" : "0" }}>
                    <p>{a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 9 · CTA ── */}
        <section className="rp-cta">
          <h2 className="rp-reveal">Your fame is a craft.<br /><em>Master it.</em></h2>
          <p className="rp-reveal">Join the verified creator community learning to build careers that last.</p>
          <a className="rp-btn rp-btn-primary rp-reveal" href="/plans">Join the community <span className="arr">→</span></a>
        </section>

      </div>
    </>
  );
}