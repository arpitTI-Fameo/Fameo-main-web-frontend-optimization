// 'use client';
// // app/(main)/plans/page.js
// // Full Razorpay payment flow for subscriptions

// import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
// import { useRouter, useSearchParams }    from 'next/navigation';
// import { useAuthStore }                  from '@/store/authStore';
// import { PLANS }                         from '@/constants/membership';
// import { purchasePlan, newCheckoutAttemptId } from '@/services/subscriptionCheckout';
// import { quoteMarketingCoupon }            from '@/services/subscription.service';

// const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// const PRICES = {
//   // pro:     { 1: 799,   3: 2037,  6: 3835  },
//   popular: { 1: 1599,  3: 4077,  6: 7675  },
//   elite:   { 1: 3199,  3: 8157,  6: 15355 },
// };
// const BILLING_IDS = {
//   // pro:     { 1: 3, 3: 2, 6: 1 },
//   popular: { 1: 6, 3: 5, 6: 4 },
//   elite:   { 1: 9, 3: 8, 6: 7 },
// };
// const FROM_LABELS = {
//   '/products':    'the Creator Store',
//   '/community':   'the Community',
//   '/talent-hire': 'Talent Hire',
// };

// const loadRazorpay = () => new Promise(resolve => {
//   if (window.Razorpay) return resolve(true);
//   const s = document.createElement('script');
//   s.src = 'https://checkout.razorpay.com/v1/checkout.js';
//   s.onload  = () => resolve(true);
//   s.onerror = () => resolve(false);
//   document.body.appendChild(s);
// });

// // Money formatter. Backend prices can carry paise (e.g. 2332.2), so show two
// // decimals when they do and none when they don't.
// const inr = (n) => {
//   const v = Number(n) || 0;
//   return v.toLocaleString('en-IN', {
//     minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
//     maximumFractionDigits: 2,
//   });
// };

// const S = `
//   @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

//   /* ─────────────────────────────────────────────────────────────
//      FULL-BLEED EDITORIAL PLANS — PREMIUM ROSE
//      Palette:  ink #1A1A1A · rose #C24E74 · rose-l #D96A8E
//                rose-d #9E3357 · bone #FBF7F4 · mist #9B948E
//                hairline rgba(26,20,22,.09)
//      Gradient: linear-gradient(135deg, rose-l 30%, rose 50%, rose-d 76%)
//      Type:     Fraunces (display / prices) · Schibsted Grotesk (body)
//                Space Mono (eyebrows, codes, labels)
//      Signature: hairline index rules + oversized italic price numerals
//                + the brand rose gradient on every "live" element,
//                culminating in a full-gradient premium middle card
//      ───────────────────────────────────────────────────────────── */

//   .plans-page {
//     --mn-rose:   #C24E74;
//     --mn-rose-l: #D96A8E;
//     --mn-rose-d: #9E3357;
//     --mn-rose-grad: linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);
//     --ink:  #1A1A1A;
//     --mist: #9B948E;
//     --line: rgba(26,20,22,.09);

//     width:100%;
//     min-height:100vh;
//     margin:0;
//     padding:0;
//     font-family:'Schibsted Grotesk',sans-serif;
//     color:var(--ink);
//     background:
//       radial-gradient(120% 80% at 82% -10%, rgba(194,78,116,.07) 0%, transparent 55%),
//       radial-gradient(90% 60% at 8% 4%, rgba(217,106,142,.09) 0%, transparent 50%),
//       linear-gradient(#FBF7F4, #FFFFFF 40%);
//     position:relative;
//     overflow-x:hidden;
//   }
//   /* faint vertical spine down the middle of the page */
//   .plans-page::before {
//     content:'';
//     position:absolute; top:0; bottom:0; left:50%;
//     width:1px;
//     background:linear-gradient(180deg, transparent, rgba(26,20,22,.05) 12%, rgba(26,20,22,.05) 88%, transparent);
//     pointer-events:none;
//     z-index:0;
//   }

//   /* inner rail keeps text readable but the section stretches full width */
//   .plans-head,
//   .duration-tabs,
//   .plans-grid,
//   .plans-footer,
//   .upgrade-notice,
//   .referral-benefit,
//   .msg-error,
//   .msg-success { position:relative; z-index:1; }

//   /* gradient text helper for accented words */
//   .grad-text {
//     background:var(--mn-rose-grad);
//     -webkit-background-clip:text;
//     background-clip:text;
//     color:transparent;
//   }

//   /* ── Header ─────────────────────────────────────────────────── */
//   .plans-head {
//     text-align:center;
//     max-width:900px;
//     margin:0 auto;
//     padding:96px 40px 8px;
//   }
//   .plans-head::before {
//     content:'01 — Membership';
//     display:inline-block;
//     font-family:'Space Mono',monospace;
//     font-size:10px; font-weight:400; letter-spacing:.34em; text-transform:uppercase;
//     color:var(--mn-rose);
//     margin-bottom:24px;
//     padding-bottom:10px;
//     border-bottom:1px solid transparent;
//     border-image:linear-gradient(90deg, transparent, var(--mn-rose-l), var(--mn-rose-d), transparent) 1;
//   }
//   .plans-title {
//     font-family:'Fraunces',serif;
//     font-size:clamp(44px,7vw,86px);
//     font-weight:300;
//     line-height:.98;
//     letter-spacing:-.01em;
//     color:var(--ink);
//   }
//   .plans-title em {
//     font-style:italic; font-weight:400;
//     background:var(--mn-rose-grad);
//     -webkit-background-clip:text;
//     background-clip:text;
//     color:transparent;
//   }
//   .plans-sub {
//     font-family:'Space Mono',monospace;
//     font-size:10px; font-weight:400; letter-spacing:.22em; text-transform:uppercase;
//     color:var(--mist); margin-top:22px;
//   }

//   /* ── Upgrade notice ─────────────────────────────────────────── */
//   .upgrade-notice {
//     max-width:640px;
//     text-align:center;
//     padding:22px 32px;
//     margin:36px auto 0;
//     background:rgba(194,78,116,.045);
//     border:1px solid rgba(194,78,116,.18);
//     border-radius:2px;
//   }
//   .upgrade-notice h3 {
//     font-family:'Fraunces',serif; font-size:23px; font-weight:400;
//     color:var(--ink); margin-bottom:6px;
//   }
//   .upgrade-notice h3 em { font-style:italic; }
//   .upgrade-notice p {
//     font-family:'Space Mono',monospace;
//     font-size:10px; color:var(--mist); font-weight:400;
//     letter-spacing:.14em; text-transform:uppercase;
//   }

//   /* ── Referral benefit banner ────────────────────────────────── */
//   .referral-benefit {
//     max-width:640px;
//     display:flex; align-items:center; gap:16px;
//     padding:18px 24px;
//     margin:36px auto 0;
//     background:rgba(194,78,116,.05);
//     border:1px solid rgba(194,78,116,.22);
//     border-radius:2px;
//     text-align:left;
//   }
//   .rb-tag {
//     flex:none;
//     font-family:'Space Mono',monospace;
//     font-size:8px; letter-spacing:.2em; text-transform:uppercase;
//     color:#fff; padding:6px 10px; border-radius:100px;
//     background:var(--mn-rose-grad);
//   }
//   .rb-body { flex:1; min-width:0; }
//   .rb-title {
//     font-family:'Fraunces',serif; font-size:20px; font-weight:400;
//     color:var(--ink); line-height:1.2;
//   }
//   .rb-title em { font-style:italic; }
//   .rb-meta {
//     font-family:'Space Mono',monospace;
//     font-size:9px; letter-spacing:.14em; text-transform:uppercase;
//     color:var(--mist); margin-top:6px; line-height:1.7;
//   }
//   .rb-note {
//     font-size:11px; color:var(--mist); margin-top:8px;
//     letter-spacing:.02em; line-height:1.5;
//   }

//   .msg-error {
//     max-width:640px; margin:28px auto 0;
//     padding:14px 20px;
//     background:rgba(194,78,116,.06);
//     border:1px solid rgba(194,78,116,.22);
//     border-radius:2px;
//     font-size:13px; color:var(--mn-rose-d); text-align:center; font-weight:400; letter-spacing:.02em;
//   }

//   /* ── Duration selector — hairline index style ───────────────── */
//   .duration-tabs {
//     display:flex; align-items:stretch; justify-content:center; gap:0;
//     margin:52px auto 0;
//     width:max-content; max-width:92%;
//     border:1px solid rgba(26,20,22,.12);
//     border-radius:2px;
//     overflow:hidden;
//     background:rgba(255,255,255,.55);
//     backdrop-filter:blur(6px);
//   }
//   .dur-btn {
//     padding:14px 30px;
//     border:none;
//     border-left:1px solid rgba(26,20,22,.1);
//     background:transparent;
//     color:#6E6862;
//     font-family:'Space Mono',monospace; font-size:10px; font-weight:400;
//     letter-spacing:.18em; text-transform:uppercase;
//     cursor:pointer; transition:color .25s, background .25s;
//     display:flex; align-items:center; gap:9px;
//     white-space:nowrap;
//   }
//   .dur-btn:first-child { border-left:none; }
//   .dur-btn:hover { color:var(--ink); background:rgba(26,20,22,.03); }
//   .dur-btn.active {
//     background:linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);
//     color:#fff;
//   }
//   .dur-badge {
//     font-size:8px; padding:2px 7px; border-radius:10px;
//     background:rgba(194,78,116,.14); color:var(--mn-rose); letter-spacing:.08em;
//   }
//   .dur-btn.active .dur-badge { background:rgba(255,255,255,.22); color:#fff; }

//   /* ── Grid — full bleed, up to 4 across on large screens ─────── */
//   .plans-grid {
//     display:grid;
//     grid-auto-flow:column;
//     grid-auto-columns:minmax(260px, 340px);
//     justify-content:center;
//     gap:0;
//     align-items:stretch;
//     max-width:1500px;
//     margin:64px auto 0;
//     padding:0 clamp(24px,5vw,72px);
//   }
//   .plan-card {
//     padding:40px 32px 34px;
//     position:relative;
//     background:transparent;
//     border-left:1px solid var(--line);
//     transition:background .3s ease, transform .3s ease;
//     display:flex; flex-direction:column;
//   }
//   .plan-card:first-child { border-left:none; }
//   .plan-card:hover { background:rgba(255,255,255,.7); }

//   /* ── Premium cards — full gradient (Popular + Elite) ────────── */
//   .plan-card.premium {
//     border:none;
//     border-radius:4px;
//     z-index:3;
//     overflow:hidden;
//     box-shadow:0 40px 90px -34px rgba(158,51,87,.62);
//   }
//   /* Popular = warm peach→coral→rose */
//   .plan-card.popular {
//     background:linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);
//     transform:translateY(-16px);
//   }
//   .plan-card.popular:hover {
//     background:linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);
//     transform:translateY(-20px);
//   }
//   /* Elite = same family, shifted deeper for hierarchy */
//   .plan-card.elite {
//     background:linear-gradient(135deg, #E89A6B 20%, #D45A79 58%, #9E3357 88%);
//     transform:translateY(-16px);
//   }
//   .plan-card.elite:hover {
//     background:linear-gradient(135deg, #E89A6B 20%, #D45A79 58%, #9E3357 88%);
//     transform:translateY(-20px);
//   }
//   /* subtle sheen so the gradient reads as a crafted surface, not a flat fill */
//   .plan-card.premium::before {
//     content:'';
//     position:absolute; inset:0;
//     background:radial-gradient(120% 90% at 78% -8%, rgba(255,255,255,.22), transparent 55%);
//     pointer-events:none;
//   }
//   /* keep neighbours' left hairline sensible next to a gradient card */
//   .plan-card.premium + .plan-card { border-left:1px solid var(--line); }

//   /* Recolor inner content so it reads on the gradient */
//   .plan-card.premium .plan-icon        { color:#fff !important; }
//   .plan-card.premium .plan-name        { color:#fff; }
//   .plan-card.premium .plan-code        { color:rgba(255,255,255,.62); }
//   .plan-card.premium .plan-price,
//   .plan-card.premium .plan-price sup   { color:#fff; }
//   .plan-card.premium .plan-period      { color:rgba(255,255,255,.72); }
//   .plan-card.premium .plan-price-wrap  { border-bottom-color:rgba(255,255,255,.22); }
//   .plan-card.premium .plan-discount-tag,
//   .plan-card.premium .plan-discount-tag span { color:#fff !important; }
//   .plan-card.premium .plan-feat        { color:rgba(255,255,255,.94); }
//   .plan-card.premium .feat-icon        { color:#fff !important; }
//   .plan-card.premium .feat-no          { color:rgba(255,255,255,.6); }
//   .plan-card.premium .current-tag      { color:#eafff3; }
//   .plan-card.premium .plan-was s       { color:rgba(255,255,255,.6); }
//   .plan-card.premium .plan-was-off     { color:#fff; background:rgba(255,255,255,.2); border-color:rgba(255,255,255,.42); }
//   .plan-card.premium .plan-price-note  { color:rgba(255,255,255,.72); }

//   .popular-badge {
//     position:absolute; top:0; left:0; right:0;
//     height:3px;
//     background:rgba(255,255,255,.6);
//     z-index:1;
//   }
//   .popular-badge::after {
//     content:'Most Chosen';
//     position:absolute; top:14px; right:16px;
//     font-family:'Space Mono',monospace;
//     font-size:8px; font-weight:400; letter-spacing:.22em; text-transform:uppercase;
//     color:rgba(255,255,255,.9);
//   }

//   /* ── Shine save-tag (percentage difference) ─────────────────── */
//   .save-tag {
//     position:absolute; top:16px; left:16px; z-index:2;
//     display:inline-flex; align-items:center; gap:6px;
//     padding:6px 12px 6px 11px;
//     border-radius:100px;
//     font-family:'Space Mono',monospace;
//     font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
//     color:#fff;
//     background:rgba(255,255,255,.18);
//     border:1px solid rgba(255,255,255,.4);
//     backdrop-filter:blur(4px);
//     overflow:hidden;
//     white-space:nowrap;
//   }
//   .save-tag .save-dot { font-size:7px; opacity:.9; }
//   /* the shine — a diagonal white streak sweeping left → right on a loop */
//   .save-tag::after {
//     content:'';
//     position:absolute; top:0; left:-60%;
//     width:45%; height:100%;
//     background:linear-gradient(120deg, transparent, rgba(255,255,255,.75), transparent);
//     transform:skewX(-20deg);
//     animation:save-shine 2.8s ease-in-out infinite;
//   }
//   /* non-premium (light card) variant — coral tag on white */
//   .plan-card:not(.premium) .save-tag {
//     color:var(--mn-rose-d);
//     background:rgba(212,90,121,.1);
//     border-color:rgba(212,90,121,.3);
//   }
//   .plan-card:not(.premium) .save-tag::after {
//     background:linear-gradient(120deg, transparent, rgba(212,90,121,.35), transparent);
//   }
//   @keyframes save-shine {
//     0%   { left:-60%; }
//     55%  { left:130%; }
//     100% { left:130%; }
//   }
//   @media (prefers-reduced-motion: reduce) {
//     .save-tag::after { animation:none; display:none; }
//   }

//   .plan-icon { font-size:22px; margin-bottom:14px; line-height:1; position:relative; z-index:1; }
//   .plan-name {
//     font-family:'Fraunces',serif; font-size:30px; font-weight:400;
//     color:var(--ink); margin-bottom:4px; line-height:1; position:relative; z-index:1;
//   }
//   .plan-code {
//     font-family:'Space Mono',monospace;
//     font-size:8px; font-weight:400; letter-spacing:.26em; text-transform:uppercase;
//     color:#B7B0AA; margin-bottom:26px; position:relative; z-index:1;
//   }

//   .plan-price-wrap {
//     margin-bottom:26px; padding-bottom:26px;
//     border-bottom:1px solid rgba(26,20,22,.08);
//     position:relative; z-index:1;
//   }
//   .plan-price {
//     font-family:'Fraunces',serif;
//     font-size:52px; font-weight:400; font-style:italic;
//     color:var(--ink); line-height:.9; letter-spacing:-.02em;
//   }
//   .plan-price sup {
//     font-size:19px; vertical-align:top; font-style:normal;
//     color:var(--mist); margin-right:2px; top:.35em; position:relative;
//   }
//   .plan-period {
//     font-family:'Space Mono',monospace;
//     font-size:9px; font-weight:400; color:var(--mist);
//     letter-spacing:.16em; text-transform:uppercase; margin-top:12px;
//   }
//   .plan-discount-tag {
//     display:inline-flex; align-items:center; gap:5px;
//     margin-top:10px; font-size:10.5px; font-weight:500; color:var(--mn-rose);
//     letter-spacing:.04em;
//   }

//   /* ── Referral price on a plan card ──────────────────────────── */
//   .plan-was {
//     display:flex; align-items:center; gap:9px; flex-wrap:wrap;
//     margin-top:10px;
//   }
//   .plan-was s {
//     font-family:'Fraunces',serif; font-size:17px; font-style:italic;
//     color:var(--mist); text-decoration-thickness:1px;
//   }
//   .plan-was-off {
//     font-family:'Space Mono',monospace;
//     font-size:8px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
//     color:var(--mn-rose-d);
//     background:rgba(212,90,121,.1);
//     border:1px solid rgba(212,90,121,.3);
//     padding:4px 9px; border-radius:100px; white-space:nowrap;
//   }
//   .plan-price-note {
//     font-size:10px; color:var(--mist); margin-top:9px;
//     line-height:1.5; letter-spacing:.02em;
//   }

//   .plan-features {
//     list-style:none; padding:0; margin:0 0 28px;
//     display:flex; flex-direction:column; gap:11px;
//     flex:1;
//     position:relative; z-index:1;
//   }
//   .plan-feat {
//     display:flex; align-items:flex-start; gap:10px;
//     font-size:12px; font-weight:400; color:#3E3833; line-height:1.55;
//   }
//   .feat-icon { font-size:9px; flex-shrink:0; margin-top:3px; }
//   .feat-no { color:#C6BFB9; }

//   .current-tag {
//     font-family:'Space Mono',monospace;
//     font-size:9px; font-weight:400; letter-spacing:.18em; text-transform:uppercase;
//     color:#2eaa68; margin-bottom:12px; position:relative; z-index:1;
//   }

//   /* ── Buttons ────────────────────────────────────────────────── */
//   .plan-btn {
//     width:100%; padding:15px;
//     border:1px solid; font-family:'Space Mono',monospace;
//     font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase;
//     cursor:pointer; transition:all .3s ease; border-radius:2px;
//     margin-top:auto;
//     position:relative;
//     overflow:hidden;
//     z-index:1;
//   }
//   .btn-primary { background:var(--ink); color:#fff; border-color:var(--ink); }
//   .btn-primary:hover {
//     background:linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);
//     border-color:var(--mn-rose-d);
//     letter-spacing:.26em;
//   }
//   .btn-free { background:transparent; color:#B7B0AA; border-color:rgba(26,20,22,.1); cursor:default; }
//   .btn-active { background:rgba(46,170,104,.08); color:#2eaa68; border-color:rgba(46,170,104,.5); cursor:default; }
//   .btn-disabled { opacity:.5; cursor:not-allowed; }

//   /* Inverted button on the premium card — white on gradient */
//   .plan-card.premium .btn-primary {
//     background:#fff; color:var(--mn-rose-d); border-color:#fff;
//     box-shadow:0 10px 24px -12px rgba(0,0,0,.35);
//   }
//   .plan-card.premium .btn-primary:hover {
//     background:var(--ink); color:#fff; border-color:var(--ink);
//     letter-spacing:.26em;
//   }
//   .plan-card.premium .btn-active {
//     background:rgba(255,255,255,.16); color:#fff; border-color:rgba(255,255,255,.5);
//   }
//   .plan-card.premium .btn-free {
//     background:rgba(255,255,255,.1); color:rgba(255,255,255,.65); border-color:rgba(255,255,255,.3);
//   }

//   .msg-success { padding:16px; background:#e8f8f0; border:1px solid #b0e8cc; border-radius:3px; margin-bottom:20px; }

//   /* ── Checkout modal (campaign coupon) ───────────────────────── */
//   .co-overlay { position:fixed; inset:0; z-index:50; background:rgba(26,20,22,.42); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:24px; animation:co-fade .2s ease; }
//   @keyframes co-fade { from { opacity:0; } to { opacity:1; } }
//   .co-panel { position:relative; width:100%; max-width:440px; background:#fff; border:1px solid var(--line); border-radius:6px; padding:38px 34px 30px; box-shadow:0 50px 100px -30px rgba(158,51,87,.5); animation:co-rise .25s ease; }
//   @keyframes co-rise { from { transform:translateY(14px); opacity:0; } to { transform:none; opacity:1; } }
//   .co-close { position:absolute; top:16px; right:16px; width:30px; height:30px; border-radius:50%; border:1px solid var(--line); background:transparent; color:var(--mist); cursor:pointer; font-size:12px; transition:color .2s, border-color .2s; }
//   .co-close:hover { color:var(--ink); border-color:var(--ink); }
//   .co-eyebrow { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.28em; text-transform:uppercase; color:var(--mn-rose); margin-bottom:10px; }
//   .co-title { font-family:'Fraunces',serif; font-size:27px; font-weight:400; color:var(--ink); line-height:1.05; margin-bottom:24px; }
//   .co-title em { font-style:italic; color:var(--mist); font-size:16px; }
//   .co-rows { border-top:1px solid var(--line); }
//   .co-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(26,20,22,.06); font-size:13px; color:var(--mist); }
//   .co-row span:last-child { color:var(--ink); font-weight:500; }
//   .co-row.co-disc span:last-child { color:#2eaa68; }
//   .co-row.co-total { border-bottom:none; padding-top:16px; }
//   .co-row.co-total span { font-family:'Fraunces',serif; font-style:italic; font-size:22px; color:var(--ink); }
//   .co-row.co-total span:first-child { font-family:'Schibsted Grotesk',sans-serif; font-style:normal; font-size:13px; color:var(--mist); }
//   .co-note { font-size:11px; color:var(--mn-rose-d); margin-top:12px; background:rgba(194,78,116,.06); border:1px solid rgba(194,78,116,.2); padding:9px 12px; border-radius:3px; }
//   .co-coupon { display:flex; gap:8px; margin-top:22px; }
//   .co-input { flex:1; padding:12px 14px; border:1px solid rgba(26,20,22,.16); border-radius:3px; font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink); background:#fff; outline:none; transition:border-color .2s; }
//   .co-input:focus { border-color:var(--mn-rose); }
//   .co-apply { padding:0 20px; border-radius:3px; cursor:pointer; border:1px solid var(--ink); background:var(--ink); color:#fff; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.18em; text-transform:uppercase; transition:opacity .2s; }
//   .co-apply:disabled { opacity:.45; cursor:not-allowed; }
//   .co-remove { margin-top:12px; background:none; border:none; cursor:pointer; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--mn-rose-d); text-decoration:underline; }
//   .co-err { font-size:12px; color:var(--mn-rose-d); margin-top:10px; }
//   .co-pay { width:100%; margin-top:24px; padding:16px; border:none; border-radius:3px; cursor:pointer; background:linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%); color:#fff; font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; transition:letter-spacing .2s, opacity .2s; }
//   .co-pay:hover { letter-spacing:.26em; }
//   .co-pay:disabled { opacity:.55; cursor:not-allowed; letter-spacing:.2em; }
//   .co-secure { text-align:center; margin-top:14px; font-family:'Space Mono',monospace; font-size:8px; letter-spacing:.16em; text-transform:uppercase; color:var(--mist); }

//   /* ── Confirmation ───────────────────────────────────────────── */
//   .conf-wrap {
//     max-width:520px; margin:0 auto; text-align:center;
//     padding:80px 48px;
//   }
//   .conf-icon { font-size:56px; margin-bottom:24px; }
//   .conf-title {
//     font-family:'Fraunces',serif; font-size:clamp(38px,5vw,52px);
//     font-weight:300; color:var(--ink); margin-bottom:8px; line-height:1;
//   }
//   .conf-title em {
//     font-style:italic; font-weight:400;
//     background:var(--mn-rose-grad);
//     -webkit-background-clip:text;
//     background-clip:text;
//     color:transparent;
//   }
//   .conf-sub {
//     font-family:'Space Mono',monospace;
//     font-size:10px; font-weight:400; color:var(--mist);
//     letter-spacing:.2em; text-transform:uppercase; margin-bottom:36px;
//   }
//   .conf-row {
//     display:flex; justify-content:space-between; padding:13px 0;
//     border-bottom:1px solid rgba(26,20,22,.06);
//     font-size:12px; font-weight:400; color:var(--mist);
//   }
//   .conf-row span:last-child { color:var(--ink); font-weight:500; }
//   .conf-countdown { margin-top:28px; font-size:11px; color:var(--mist); font-weight:400; letter-spacing:.06em; }
//   .conf-btn {
//     display:inline-flex; align-items:center; justify-content:center; gap:8px;
//     margin-top:22px; padding:15px 34px;
//     background:var(--ink); color:#fff; font-family:'Space Mono',monospace;
//     font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase;
//     border:none; cursor:pointer; border-radius:2px; text-decoration:none;
//     transition:background .25s, letter-spacing .25s;
//   }
//   .conf-btn:hover {
//     background:linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);
//     letter-spacing:.26em;
//   }

//   /* ── Footer ─────────────────────────────────────────────────── */
//   .plans-footer {
//     text-align:center; margin:80px auto 0; padding:40px 40px 72px;
//     max-width:900px;
//     font-size:11.5px; font-weight:400; color:var(--mist); line-height:2;
//     letter-spacing:.04em;
//     border-top:1px solid rgba(26,20,22,.07);
//   }
//   .plans-footer .foot-mail {
//     background:var(--mn-rose-grad);
//     -webkit-background-clip:text;
//     background-clip:text;
//     color:transparent;
//     font-weight:500;
//   }

//   /* ── Responsive ─────────────────────────────────────────────── */
//   @media(max-width:1100px) {
//     .plans-grid {
//       grid-auto-flow:row;
//       grid-template-columns:repeat(2,minmax(0,300px));
//       grid-auto-columns:auto;
//       justify-content:center;
//       gap:0;
//     }
//     .plan-card:nth-child(odd) { border-left:none; }
//     .plan-card { border-top:1px solid var(--line); }
//     .plan-card:nth-child(1), .plan-card:nth-child(2) { border-top:none; }
//     .plan-card.premium { transform:none; }
//     .plan-card.premium:hover { transform:none; }
//   }
//   @media(max-width:640px) {
//     .plans-page::before { display:none; }
//     .plans-head { padding:72px 24px 8px; }
//     .plans-grid { grid-auto-flow:row; grid-template-columns:1fr; grid-auto-columns:auto; padding:0 24px; margin-top:48px; }
//     .plan-card { border-left:none; border-top:1px solid var(--line); padding:36px 28px; }
//     .plan-card:first-child { border-top:none; }
//     .plan-card.premium + .plan-card,
//     .plan-card.premium { border-left:none; }
//     .plan-card.premium { transform:none; }
//     .duration-tabs { width:92%; }
//     .dur-btn { flex:1; justify-content:center; padding:13px 8px; }
//     .referral-benefit { margin-left:24px; margin-right:24px; flex-direction:column; align-items:flex-start; gap:12px; }
//   }
// `;

// const DURATIONS = [
//   { months: 1, label: '1 Month' },
//   { months: 3, label: '3 Months', badge: '-15%' },
//   { months: 6, label: '6 Months', badge: '-20%' },
// ];

// // Savings vs paying month-to-month, by duration.
// const SAVE_PCT = { 1: 0, 3: 15, 6: 20 };

// function PlansContent() {
//   const router       = useRouter();
//   const searchParams = useSearchParams();
//   const { user, token, updateMembership, logout } = useAuthStore();

//   const isUpgrade = searchParams.get('upgrade') === 'true';
//   const fromPage  = searchParams.get('from') || '';
//   const fromLabel = FROM_LABELS[fromPage] || 'this feature';

//   const [duration,   setDuration]   = useState(1);
//   const [current,    setCurrent]    = useState('free');
//   const [loading,    setLoading]    = useState(null);
//   const [error,      setError]      = useState('');
//   const [confirmed,  setConfirmed]  = useState(null); // { plan, paymentId, amount }
//   const [countdown,  setCountdown]  = useState(5);

//   // Plans now come from the backend (Plan collection). PLANS stays as a
//   // fallback so the page still renders if the API is unreachable.
//   const [plans,      setPlans]      = useState(PLANS);

//   // One idempotency key per checkout ATTEMPT (§4). Reused when the user retries
//   // after dismissing Checkout, so the backend reuses the open order instead of
//   // creating a second one. Cleared on success or when the selection changes.
//   const attemptKey = useRef({ billingId: null, key: null });

//   // Campaign-coupon checkout modal.
//   const [checkoutPlan, setCheckoutPlan] = useState(null); // plan being checked out
//   const [couponInput,  setCouponInput]  = useState('');
//   const [coupon,       setCoupon]       = useState(null);  // applied quote data
//   const [couponBusy,   setCouponBusy]   = useState(false);
//   const [couponError,  setCouponError]  = useState('');

//   // Fetch live plans. The proxy → central /plans now requires auth, so send the
//   // token when present; the static PLANS fallback covers the logged-out view.
//   // We MERGE backend data (prices, features, billing_options) with the static
//   // PLANS design metadata (icon, color, appPlanCode, popular) matched by code,
//   // so the backend drives pricing while YOUR design stays intact.
//   useEffect(() => {
//     if (!token) return;
//     fetch(`${BASE}/api/subscriptions/plans`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(r => (r.status === 401 ? null : r.json()))
//       .then(d => {
//         if (!Array.isArray(d?.data) || !d.data.length) return;
//         const codeOf = (p) =>
//           (p?.plan_code || p?.code || p?.id || '').toString().toLowerCase();
//         const merged = d.data.map((apiPlan) => {
//           const design = (PLANS || []).find((sp) => codeOf(sp) === codeOf(apiPlan)) || {};
//           return {
//             ...design,     // icon, color, appPlanCode, popular, features fallback…
//             ...apiPlan,    // backend: prices, billing_options, real plan_code
//             // keep a stable slug-ish id for the UI, prefer the design slug
//             id: design.id || apiPlan.id,
//             // preserve the NUMERIC backend id for create-order/subscribe
//             backendPlanId: apiPlan.id,
//             // ensure a display name exists
//             name: apiPlan.plan_name || apiPlan.name || design.name,
//             // ensure design-only visuals survive even if apiPlan lacks them
//             icon: apiPlan.icon || design.icon,
//             color: apiPlan.color || design.color,
//             appPlanCode: apiPlan.plan_code || design.appPlanCode,
//             popular: design.popular ?? apiPlan.popular,
//             // keep design features if the API's features aren't a string array
//             features: Array.isArray(apiPlan.features) ? apiPlan.features : design.features,
//             notIncluded: design.notIncluded,
//             discountRate: design.discountRate ?? apiPlan.discountRate,
//             discountLabel: design.discountLabel ?? apiPlan.discountLabel,
//             pricingTiers: apiPlan.pricingTiers || design.pricingTiers,
//           };
//         });
//         // Include static-only plans the backend doesn't return (e.g. Free),
//         // so the free card still shows. Order: free, pro, popular, elite.
//         const mergedCodes = new Set(merged.map((m) => codeOf(m)));
//         const staticOnly = (PLANS || []).filter((sp) => !mergedCodes.has(codeOf(sp)));
//         const ORDER = { free: 0, pro: 1, popular: 2, elite: 3 };
//         const full = [...staticOnly, ...merged].sort(
//           (a, b) => (ORDER[codeOf(a)] ?? 99) - (ORDER[codeOf(b)] ?? 99)
//         );
//         setPlans(full);
//       })
//       .catch(() => {}); // keep hardcoded fallback on failure
//   }, [token]);

//   // Determine the user's current plan for highlighting. We read /current (not
//   // just /membership) because a CANCELLED-but-still-within-access subscription
//   // should still show as the user's current plan until it actually expires.
//   // Read the user's current plan from /current (live from the central store the
//   // app also writes to), so the highlighted "current plan" reflects app changes.
//   const refreshCurrent = useCallback(() => {
//     if (!token) return;
//     fetch(`${BASE}/api/subscriptions/current`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(r => {
//         if (r.status === 401) { logout(); router.push('/login?reason=session_expired'); return null; }
//         return r.json();
//       })
//       .then(d => {
//         if (!d) return;
//         const raw = d?.data;
//         const cur = Array.isArray(raw)
//           ? (raw.find((s) => s?.status === 'active' && !s?.is_cancelled) || raw[0])
//           : raw;
//         if (!cur) return;
//         const code = (cur?.plan?.plan_code || cur?.membershipType || 'free').toLowerCase();
//         const isFree = code === 'free' || cur?.subscription_id === 'free';
//         setCurrent(isFree ? 'free' : code);
//       })
//       .catch(() => {});
//   }, [token]);

//   useEffect(() => { refreshCurrent(); }, [refreshCurrent]);

//   // Option 2 sync: refresh the current plan when the user returns to this tab,
//   // so a plan changed in the app shows here without a manual reload.
//   useEffect(() => {
//     const onFocus = () => { if (document.visibilityState === 'visible') refreshCurrent(); };
//     window.addEventListener('focus', onFocus);
//     document.addEventListener('visibilitychange', onFocus);
//     return () => {
//       window.removeEventListener('focus', onFocus);
//       document.removeEventListener('visibilitychange', onFocus);
//     };
//   }, [refreshCurrent]);

//   // Countdown after confirmation → redirect to cart
//   useEffect(() => {
//     if (!confirmed) return;
//     if (countdown <= 0) {
//       router.push(fromPage || '/cart');
//       return;
//     }
//     const t = setTimeout(() => setCountdown(c => c - 1), 1000);
//     return () => clearTimeout(t);
//   }, [confirmed, countdown]);

//   const campaignEligible = (plan) =>
//     ['popular', 'elite'].includes(planCodeOf(plan));

//   // Card button opens the checkout modal (does NOT pay yet).
//   const openCheckout = (plan) => {
//     if (!token)              { router.push('/login?redirect=/plans'); return; }
//     if (planCodeOf(plan) === 'free') return;
//     if (isCurrentPlan(plan)) return;
//     setError('');
//     setCoupon(null); setCouponInput(''); setCouponError('');
//     attemptKey.current = { identity: null, key: null };
//     setCheckoutPlan(plan);
//   };

//   const closeCheckout = () => {
//     setCheckoutPlan(null);
//     setCoupon(null); setCouponInput(''); setCouponError('');
//   };

//   // Validate + preview the campaign coupon (display only).
//   const applyCoupon = async () => {
//     const plan = checkoutPlan;
//     const code = couponInput.trim();
//     if (!plan || !code) return;
//     const chosen = billingOptionFor(plan) || (plan.billing_options || [])[0];
//     if (!chosen) { setCouponError('No billing option for this plan.'); return; }
//     setCouponBusy(true); setCouponError('');
//     try {
//       const data = await quoteMarketingCoupon({ billing_id: chosen.id, coupon_code: code });
//       if (!data?.valid) { setCoupon(null); setCouponError('Coupon is not valid for this plan.'); return; }
//       setCoupon(data);
//     } catch (err) {
//       setCoupon(null);
//       setCouponError(err?.message || 'Coupon is invalid, paused, expired, or exhausted.');
//     } finally {
//       setCouponBusy(false);
//     }
//   };

//   const removeCoupon = () => { setCoupon(null); setCouponInput(''); setCouponError(''); };

//   // Pay button in the modal. Prices come from the order, never computed here.
//   const handleConfirmPay = async () => {
//     const plan = checkoutPlan;
//     if (!plan || !token) return;

//     const chosen = billingOptionFor(plan) || (plan.billing_options || [])[0];
//     if (!chosen) { setError('This plan has no billing option available. Please refresh and try again.'); return; }

//     // Only send a coupon the API confirmed as valid in the quote.
//     const couponCode = coupon?.valid ? (coupon.coupon_code || couponInput.trim()) : '';

//     // Idempotency identity = billing + coupon; changing either starts a new attempt.
//     const identity = `${chosen.id}:${couponCode}`;
//     if (attemptKey.current.identity !== identity || !attemptKey.current.key) {
//       attemptKey.current = { identity, key: newCheckoutAttemptId() };
//     }

//     setLoading(plan.id); setError('');
//     try {
//       const { order, verification, alreadyCompleted } = await purchasePlan({
//         billing_id:            chosen.id,
//         idempotency_key:       attemptKey.current.key,
//         marketing_coupon_code: couponCode || undefined,
//         user,
//         description:           `${nameOf(plan)} Plan`,
//       });

//       attemptKey.current = { identity: null, key: null };

//       if (alreadyCompleted) {
//         setError('This payment was already completed. Refreshing your subscription…');
//         refreshCurrent(); closeCheckout(); return;
//       }

//       const code = (plan.plan_code || plan.id || '').toString().toLowerCase();
//       setCurrent(code); updateMembership(code); refreshCurrent();

//       // Campaign coupon takes priority over referral in the display.
//       const isCampaign = !!(order?.coupon_code) || order?.discount_source === 'MARKETING';
//       setConfirmed({
//         plan,
//         paymentId: verification?.payment_ref || verification?.subscription_id
//           || order?.subscription_id || order?.razorpay_order_id || '',
//         original:      order?.original_price ?? chosen.price,
//         discountPct:   Number(order?.discount_percent ?? order?.referral_discount_percent) || 0,
//         discountAmt:   Number(order?.discount_amount ?? order?.referral_discount_amount) || 0,
//         discountLabel: isCampaign ? `Coupon ${order?.coupon_code || couponCode}` : 'Referral discount',
//         amount:        order?.payable_price ?? chosen.price,
//         duration:      chosen.duration_months ?? duration,
//       });
//       setCountdown(5);
//       closeCheckout();
//     } catch (err) {
//       if (err?.name === 'SessionExpiredError' || err?.message === 'SESSION_EXPIRED') {
//         logout(); router.push('/login?reason=session_expired&redirect=/plans'); return;
//       }
//       setError(err.message || 'Could not complete the subscription.');
//     } finally {
//       setLoading(null);
//     }
//   };

//   // The billing option for the selected duration — the unit the whole checkout
//   // works in. Its `id` is the billing_id sent to the order endpoint (§3).
//   const billingOptionFor = (plan) =>
//     (plan?.billing_options || []).find(
//       (o) => Number(o.duration_months) === Number(duration)
//     ) || null;

//   // Original (pre-discount) price. Falls back to the static tables only when
//   // the backend hasn't supplied billing options.
//   const getPrice = (plan) => {
//     if (plan.id === 'free' || plan.plan_code === 'FREE') return 0;
//     const opt = billingOptionFor(plan);
//     if (opt?.price != null) return opt.price;
//     const tier = plan.pricingTiers?.find(t => t.months === duration);
//     return tier?.price ?? PRICES[plan.id]?.[duration] ?? plan.price_monthly ?? plan.base_price_monthly;
//   };

//   // What the user actually pays, straight from the API (§3). Never computed.
//   const getPayable = (plan) => {
//     if (plan.id === 'free' || plan.plan_code === 'FREE') return 0;
//     const opt = billingOptionFor(plan);
//     return opt?.payable_price != null ? opt.payable_price : getPrice(plan);
//   };

//   // A plan is "current" when its code matches the user's membership type. The
//   // backend plan may expose its code as `plan_code`, `code`, or (legacy) a slug
//   // `id`. Normalise all of them before comparing to `current`.
//   const planCodeOf = (plan) =>
//     (plan?.plan_code || plan?.code || plan?.membershipType || plan?.id || '')
//       .toString().toLowerCase();
//   // Plan display name across shapes: central API uses `plan_name`, the static
//   // PLANS + web backend use `name`. Fall back to a title-cased code, never blank.
//   const nameOf = (plan) => {
//     const n = plan?.name || plan?.plan_name;
//     if (n) return n;
//     const c = planCodeOf(plan);
//     return c ? c.charAt(0).toUpperCase() + c.slice(1) : 'Plan';
//   };
//   const isCurrentPlan = (plan) =>
//     current && current !== 'free' && planCodeOf(plan) === String(current).toLowerCase();

//   // Referral pricing now arrives ON the billing option itself (§3): the backend
//   // resolves the coupon from the JWT and returns referral_eligible,
//   // referral_discount_percent, referral_discount_amount and payable_price.
//   // Nothing is computed in the browser.
//   const hasReferral = (plan) => {
//     const opt = billingOptionFor(plan);
//     return Boolean(opt?.referral_eligible) && Number(opt?.referral_discount_amount) > 0;
//   };

//   // The coupon the backend linked to this user, for the banner. Read off any
//   // eligible option so the banner shows even when the selected duration isn't.
//   const referralInfo = () => {
//     for (const plan of plans) {
//       for (const opt of plan?.billing_options || []) {
//         if (opt?.referral_eligible && Number(opt?.referral_discount_percent) > 0) {
//           return {
//             code: opt.referral_coupon_code,
//             percent: Number(opt.referral_discount_percent),
//           };
//         }
//       }
//     }
//     return null;
//   };

//   // Does any option at the CURRENT duration carry the benefit? Used to explain
//   // why the banner is showing but the cards aren't discounted.
//   const referralActiveNow = () => plans.some((p) => hasReferral(p));

//   // Features can arrive in several shapes depending on the backend:
//   //   • array of strings → as-is; array of objects → pull a label field;
//   //   • object/map → its values; string → split; missing → static PLANS, then [].
//   const toFeatureArray = (val) => {
//     if (Array.isArray(val)) {
//       return val
//         .map((f) => (typeof f === 'string' ? f : (f?.label || f?.name || f?.title || f?.text || '')))
//         .filter(Boolean);
//     }
//     if (val && typeof val === 'object') {
//       return Object.values(val)
//         .map((f) => (typeof f === 'string' ? f : (f?.label || f?.name || '')))
//         .filter(Boolean);
//     }
//     if (typeof val === 'string') {
//       return val.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
//     }
//     return [];
//   };
//   const staticPlanFor = (plan) =>
//     (PLANS || []).find((p) => planCodeOf(p) === planCodeOf(plan));
//   const featureList = (plan) => {
//     const fromApi = toFeatureArray(plan?.features);
//     if (fromApi.length) return fromApi;
//     return toFeatureArray(staticPlanFor(plan)?.features);
//   };
//   const notIncludedList = (plan) => {
//     const fromApi = toFeatureArray(plan?.notIncluded);
//     if (fromApi.length) return fromApi;
//     return toFeatureArray(staticPlanFor(plan)?.notIncluded);
//   };

//   const getBtnLabel = (plan) => {
//     if (planCodeOf(plan) === 'free') return 'Free Plan';
//     if (isCurrentPlan(plan))         return '✓ Current Plan';
//     if (loading === plan.id)         return 'Opening payment...';
//     // If they already hold a paid plan, other paid plans are an upgrade/switch.
//     if (current && current !== 'free') return `Switch to ${nameOf(plan)}`;
//     return `Get ${nameOf(plan)}`;
//   };

//   const getBtnClass = (plan) => {
//     if (planCodeOf(plan) === 'free') return 'plan-btn btn-free';
//     if (isCurrentPlan(plan))         return 'plan-btn btn-active';
//     return 'plan-btn btn-primary';
//   };

//   // ── Confirmation screen ───────────────────────────────────────────────────
//   if (confirmed) {
//     return (
//       <>
//         <style>{S}</style>
//         <div className="plans-page">
//           <div className="conf-wrap">
//             <div className="conf-icon">🎉</div>
//             <h1 className="conf-title">
//               Welcome to <em>{nameOf(confirmed.plan)}</em>
//             </h1>
//             <p className="conf-sub">Subscription activated successfully</p>

//             <div style={{ textAlign:'left', marginBottom:'8px' }}>
//               <div className="conf-row">
//                 <span>Plan</span>
//                 <span style={{ color: confirmed.plan.color }}>{confirmed.plan.icon} {nameOf(confirmed.plan)}</span>
//               </div>
//               <div className="conf-row">
//                 <span>Duration</span>
//                 <span>{confirmed.duration} month{confirmed.duration > 1 ? 's' : ''}</span>
//               </div>
//               {confirmed.discountAmt > 0 && (
//                 <>
//                   <div className="conf-row">
//                     <span>Original price</span>
//                     <span style={{ textDecoration:'line-through', color:'var(--mist)' }}>
//                       ₹{inr(confirmed.original)}
//                     </span>
//                   </div>
//                   <div className="conf-row">
//                     <span>{confirmed.discountLabel || 'Referral discount'} ({confirmed.discountPct}%)</span>
//                     <span style={{ color:'#2eaa68' }}>−₹{inr(confirmed.discountAmt)}</span>
//                   </div>
//                 </>
//               )}
//               <div className="conf-row">
//                 <span>Amount paid</span>
//                 <span>₹{inr(confirmed.amount)}</span>
//               </div>
//               {confirmed.plan.discountRate > 0 && (
//                 <div className="conf-row">
//                   <span>Product discount</span>
//                   <span style={{ color:'#2eaa68' }}>{confirmed.plan.discountLabel} on all products ✓</span>
//                 </div>
//               )}
//               <div className="conf-row">
//                 <span>Payment ID</span>
//                 <span style={{ fontSize:'10px' }}>{confirmed.paymentId}</span>
//               </div>
//             </div>

//             <p className="conf-countdown">
//               Redirecting to {fromPage ? fromLabel : 'cart'} in {countdown}s...
//             </p>
//             <a href={fromPage || '/cart'} className="conf-btn">
//               Go now →
//             </a>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // ── Main plans grid ───────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{S}</style>
//       <div className="plans-page">
//         <div className="plans-head">
//           <h1 className="plans-title">Choose Your <em>Plan</em></h1>
//           <p className="plans-sub">Same plans as the Fameo app · Synced across devices</p>
//         </div>

//         {isUpgrade && (
//           <div className="upgrade-notice">
//             <h3>Upgrade required to access <em className="grad-text">{fromLabel}</em></h3>
//             <p>Choose Pro, Popular, or Elite to unlock full access</p>
//           </div>
//         )}

//         {/* Referral benefit. Shown whenever the backend reports one on any
//             billing option, even if the selected duration isn't eligible — a
//             banner that vanished on a duration change would read as a lost coupon. */}
//         {(() => {
//           const ref = referralInfo();
//           if (!ref) return null;
//           const activeNow = referralActiveNow();
//           return (
//             <div className="referral-benefit">
//               <span className="rb-tag">Referral</span>
//               <div className="rb-body">
//                 <div className="rb-title">
//                   <em>{ref.percent}% off</em> your first paid plan
//                 </div>
//                 {ref.code && <div className="rb-meta">{ref.code}</div>}
//                 <p className="rb-note">
//                   {activeNow
//                     ? 'Already applied to the eligible plans below.'
//                     : `Your coupon doesn't cover ${duration} month${duration > 1 ? 's' : ''}. Try another duration to use it.`}
//                 </p>
//               </div>
//             </div>
//           );
//         })()}

//         {error && <div className="msg-error">⚠ {error}</div>}

//         {/* Duration selector */}
//         <div className="duration-tabs">
//           {DURATIONS.map(d => (
//             <button
//               key={d.months}
//               className={`dur-btn${duration === d.months ? ' active' : ''}`}
//               onClick={() => setDuration(d.months)}
//             >
//               {d.label}
//               {d.badge && <span className="dur-badge">{d.badge}</span>}
//             </button>
//           ))}
//         </div>

//         <div className="plans-grid">
//           {plans.map((plan) => {
//             const isElite   = plan.id === 'elite';
//             const isPremium = plan.popular || isElite;
//             const savePct   = plan.id !== 'free' ? SAVE_PCT[duration] : 0;
//             const opt       = billingOptionFor(plan);
//             const showRef   = hasReferral(plan);
//             return (
//             <div
//               key={plan.id}
//               className={`plan-card${isPremium ? ' premium' : ''}${plan.popular ? ' popular' : ''}${isElite ? ' elite' : ''}`}
//             >
//               {plan.popular && <div className="popular-badge"></div>}
//               {savePct > 0 && (
//                 <div className="save-tag">
//                   <span className="save-dot">◆</span>Save {savePct}%
//                 </div>
//               )}
//               {isCurrentPlan(plan) && <div className="current-tag">✓ Your current plan</div>}

//               <div className="plan-icon" style={{ color: plan.color }}>{plan.icon}</div>
//               <h2 className="plan-name">{nameOf(plan)}</h2>
//               <p className="plan-code">{plan.appPlanCode}</p>

//               <div className="plan-price-wrap">
//                 <div className="plan-price">
//                   {plan.id !== 'free' && <sup>₹</sup>}
//                   {plan.id === 'free' ? 'Free' : inr(getPayable(plan))}
//                 </div>
//                 <p className="plan-period">
//                   {plan.id === 'free' ? 'forever' : `for ${duration} month${duration > 1 ? 's' : ''}`}
//                 </p>

//                 {showRef && (
//                   <>
//                     <div className="plan-was">
//                       <s>₹{inr(getPrice(plan))}</s>
//                       <span className="plan-was-off">
//                         −{opt.referral_discount_percent}% referral
//                       </span>
//                     </div>
//                     <p className="plan-price-note">
//                       You save ₹{inr(opt.referral_discount_amount)} with your referral
//                     </p>
//                   </>
//                 )}

//                 {plan.discountRate > 0 && (
//                   <div className="plan-discount-tag">
//                     <span style={{ color: plan.color }}>{plan.icon}</span>
//                     {plan.discountLabel} off all products
//                   </div>
//                 )}
//               </div>

//               <ul className="plan-features">
//                 {featureList(plan).map((f, i) => (
//                   <li key={`${f}-${i}`} className="plan-feat">
//                     <span className="feat-icon" style={{ color: plan.color }}>✓</span>
//                     {f}
//                   </li>
//                 ))}
//                 {notIncludedList(plan).map((f, i) => (
//                   <li key={`ni-${f}-${i}`} className="plan-feat feat-no">
//                     <span className="feat-icon" style={{ color:'#c8c8d8' }}>✗</span>
//                     {f}
//                   </li>
//                 ))}
//               </ul>

//               <button
//                 className={getBtnClass(plan)}
//                 onClick={() => openCheckout(plan)}
//                 disabled={planCodeOf(plan) === 'free' || isCurrentPlan(plan) || !!loading}
//               >
//                 {getBtnLabel(plan)}
//               </button>
//             </div>
//             );
//           })}
//         </div>

//         {checkoutPlan && (() => {
//           const plan     = checkoutPlan;
//           const chosen   = billingOptionFor(plan) || (plan.billing_options || [])[0];
//           const original = coupon?.valid ? (coupon.original_price ?? getPrice(plan)) : getPrice(plan);
//           const payable  = coupon?.valid ? coupon.payable_price : getPayable(plan);
//           const refShown = !coupon?.valid && hasReferral(plan);
//           const showBox  = campaignEligible(plan);
//           return (
//             <div className="co-overlay" onClick={closeCheckout}>
//               <div className="co-panel" onClick={(e) => e.stopPropagation()}>
//                 <button className="co-close" onClick={closeCheckout}>✕</button>
//                 <p className="co-eyebrow">Checkout</p>
//                 <h3 className="co-title">
//                   {nameOf(plan)} <em>· {duration} month{duration > 1 ? 's' : ''}</em>
//                 </h3>

//                 <div className="co-rows">
//                   <div className="co-row"><span>Original price</span><span>₹{inr(original)}</span></div>

//                   {coupon?.valid && (
//                     <div className="co-row co-disc">
//                       <span>Coupon {coupon.coupon_code} ({coupon.discount_percent}%)</span>
//                       <span>−₹{inr(coupon.discount_amount)}</span>
//                     </div>
//                   )}
//                   {refShown && (
//                     <div className="co-row co-disc">
//                       <span>Referral discount ({chosen?.referral_discount_percent}%)</span>
//                       <span>−₹{inr(chosen?.referral_discount_amount)}</span>
//                     </div>
//                   )}

//                   <div className="co-row co-total"><span>You pay</span><span>₹{inr(payable)}</span></div>
//                 </div>

//                 {coupon?.valid && coupon.replaces_referral_discount && (
//                   <p className="co-note">Campaign coupon applied. Discounts cannot be combined.</p>
//                 )}

//                 {showBox && !coupon?.valid && (
//                   <div className="co-coupon">
//                     <input
//                       className="co-input"
//                       placeholder="Campaign coupon code"
//                       value={couponInput}
//                       onChange={(e) => setCouponInput(e.target.value)}
//                       onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
//                       disabled={couponBusy}
//                     />
//                     <button className="co-apply" onClick={applyCoupon} disabled={couponBusy || !couponInput.trim()}>
//                       {couponBusy ? '…' : 'Apply'}
//                     </button>
//                   </div>
//                 )}
//                 {showBox && coupon?.valid && (
//                   <button className="co-remove" onClick={removeCoupon}>Remove coupon</button>
//                 )}
//                 {couponError && <p className="co-err">{couponError}</p>}

//                 <button className="co-pay" onClick={handleConfirmPay} disabled={loading === plan.id}>
//                   {loading === plan.id
//                     ? 'Processing…'
//                     : (Number(payable) === 0 ? 'Activate for free' : `Pay ₹${inr(payable)}`)}
//                 </button>
//                 <p className="co-secure">Secured by Razorpay · Cancel anytime</p>
//               </div>
//             </div>
//           );
//         })()}

//         <div className="plans-footer">
//           Plans sync with the Fameo mobile app · Product discounts apply at checkout<br />
//           Payments secured by Razorpay · Cancel anytime<br />
//           <span className="foot-mail">support@fameo.in</span>
//         </div>
//       </div>
//     </>
//   );
// }

// export default function PlansPage() {
//   return (
//     <Suspense fallback={<div style={{ padding:'80px', textAlign:'center', color:'#9B948E' }}>Loading plans...</div>}>
//       <PlansContent />
//     </Suspense>
//   );
// }


'use client';
// app/(main)/plans/page.js
// Full Razorpay payment flow for subscriptions
// Design: PREMIUM EDITORIAL — Fraunces (headings) · Schibsted Grotesk (body)
// · Space Mono (labels) · Poppins (NUMBERS). Rounded cards, gradient icon
// chips, unified rounded duration pills (1 / 3 / 6 / 12 months). Free hidden.
// All backend/payment logic is unchanged.

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams }    from 'next/navigation';
import { useAuthStore }                  from '@/store/authStore';
import { PLANS }                         from '@/constants/membership';
import { purchasePlan, newCheckoutAttemptId } from '@/services/subscriptionCheckout';
import { quoteMarketingCoupon }            from '@/services/subscription.service';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// NOTE: DISPLAY FALLBACKS only, used when the backend hasn't supplied
// billing_options. Real prices + billing_id come from Plan.billing_options.
// For the 12-month tab to price correctly, the backend must return a 12-month
// billing option per plan (see BILLING_IDS).
const PRICES = {
  // pro:     { 1: 799,   3: 2037,  6: 3835,  12: 7195  },
  popular: { 1: 1599,  3: 4077,  6: 7675,  12: 14391 },
  elite:   { 1: 3199,  3: 8157,  6: 15355, 12: 28791 },
};
const BILLING_IDS = {
  // pro:     { 1: 3, 3: 2, 6: 1, 12: ? },
  popular: { 1: 6, 3: 5, 6: 4 /* , 12: ? */ },
  elite:   { 1: 9, 3: 8, 6: 7 /* , 12: ? */ },
};
const FROM_LABELS = {
  '/products':    'the Creator Store',
  '/community':   'the Community',
  '/talent-hire': 'Talent Hire',
};

const loadRazorpay = () => new Promise(resolve => {
  if (window.Razorpay) return resolve(true);
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload  = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

// Money formatter. Backend prices can carry paise (e.g. 2332.2), so show two
// decimals when they do and none when they don't.
const inr = (n) => {
  const v = Number(n) || 0;
  return v.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

const S = `
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

// ── Small inline icons ───────────────────────────────────────────
const IcCheck = ({ s = 11 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IcShield = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const IcRefresh = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
const IcLock = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);
const IcArrow = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

const DURATIONS = [
  { months: 1,  label: '1 Month'   },
  { months: 3,  label: '3 Months',  badge: '-15%' },
  { months: 6,  label: '6 Months',  badge: '-20%' },
  { months: 12, label: '12 Months', badge: '-25%' },
];

// Savings vs paying month-to-month, by duration. DISPLAY ONLY — reconcile with
// the real backend discounts on each billing option.
const SAVE_PCT = { 1: 0, 3: 15, 6: 20, 12: 25 };

function PlansContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, token, updateMembership, logout } = useAuthStore();

  const isUpgrade = searchParams.get('upgrade') === 'true';
  const fromPage  = searchParams.get('from') || '';
  const fromLabel = FROM_LABELS[fromPage] || 'this feature';

  const [duration,   setDuration]   = useState(1);
  const [current,    setCurrent]    = useState('free');
  const [loading,    setLoading]    = useState(null);
  const [error,      setError]      = useState('');
  const [confirmed,  setConfirmed]  = useState(null); // { plan, paymentId, amount }
  const [countdown,  setCountdown]  = useState(5);

  // Plans now come from the backend (Plan collection). PLANS stays as a
  // fallback so the page still renders if the API is unreachable.
  const [plans,      setPlans]      = useState(PLANS);

  // One idempotency key per checkout ATTEMPT (§4). Reused when the user retries
  // after dismissing Checkout, so the backend reuses the open order instead of
  // creating a second one. Cleared on success or when the selection changes.
  const attemptKey = useRef({ billingId: null, key: null });

  // Campaign-coupon checkout modal.
  const [checkoutPlan, setCheckoutPlan] = useState(null); // plan being checked out
  const [couponInput,  setCouponInput]  = useState('');
  const [coupon,       setCoupon]       = useState(null);  // applied quote data
  const [couponBusy,   setCouponBusy]   = useState(false);
  const [couponError,  setCouponError]  = useState('');

  // Fetch live plans. The proxy → central /plans now requires auth, so send the
  // token when present; the static PLANS fallback covers the logged-out view.
  // We MERGE backend data (prices, features, billing_options) with the static
  // PLANS design metadata (icon, color, appPlanCode, popular) matched by code,
  // so the backend drives pricing while YOUR design stays intact.
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/api/subscriptions/plans`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => (r.status === 401 ? null : r.json()))
      .then(d => {
        if (!Array.isArray(d?.data) || !d.data.length) return;
        const codeOf = (p) =>
          (p?.plan_code || p?.code || p?.id || '').toString().toLowerCase();
        const merged = d.data.map((apiPlan) => {
          const design = (PLANS || []).find((sp) => codeOf(sp) === codeOf(apiPlan)) || {};
          return {
            ...design,     // icon, color, appPlanCode, popular, features fallback…
            ...apiPlan,    // backend: prices, billing_options, real plan_code
            // keep a stable slug-ish id for the UI, prefer the design slug
            id: design.id || apiPlan.id,
            // preserve the NUMERIC backend id for create-order/subscribe
            backendPlanId: apiPlan.id,
            // ensure a display name exists
            name: apiPlan.plan_name || apiPlan.name || design.name,
            // ensure design-only visuals survive even if apiPlan lacks them
            icon: apiPlan.icon || design.icon,
            color: apiPlan.color || design.color,
            appPlanCode: apiPlan.plan_code || design.appPlanCode,
            popular: design.popular ?? apiPlan.popular,
            // keep design features if the API's features aren't a string array
            features: Array.isArray(apiPlan.features) ? apiPlan.features : design.features,
            notIncluded: design.notIncluded,
            discountRate: design.discountRate ?? apiPlan.discountRate,
            discountLabel: design.discountLabel ?? apiPlan.discountLabel,
            pricingTiers: apiPlan.pricingTiers || design.pricingTiers,
          };
        });
        // Include static-only plans the backend doesn't return (e.g. Free),
        // so the free card still shows. Order: free, pro, popular, elite.
        const mergedCodes = new Set(merged.map((m) => codeOf(m)));
        const staticOnly = (PLANS || []).filter((sp) => !mergedCodes.has(codeOf(sp)));
        const ORDER = { free: 0, pro: 1, popular: 2, elite: 3 };
        const full = [...staticOnly, ...merged].sort(
          (a, b) => (ORDER[codeOf(a)] ?? 99) - (ORDER[codeOf(b)] ?? 99)
        );
        setPlans(full);
      })
      .catch(() => {}); // keep hardcoded fallback on failure
  }, [token]);

  // Determine the user's current plan for highlighting. We read /current (not
  // just /membership) because a CANCELLED-but-still-within-access subscription
  // should still show as the user's current plan until it actually expires.
  const refreshCurrent = useCallback(() => {
    if (!token) return;
    fetch(`${BASE}/api/subscriptions/current`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.status === 401) { logout(); router.push('/login?reason=session_expired'); return null; }
        return r.json();
      })
      .then(d => {
        if (!d) return;
        const raw = d?.data;
        const cur = Array.isArray(raw)
          ? (raw.find((s) => s?.status === 'active' && !s?.is_cancelled) || raw[0])
          : raw;
        if (!cur) return;
        const code = (cur?.plan?.plan_code || cur?.membershipType || 'free').toLowerCase();
        const isFree = code === 'free' || cur?.subscription_id === 'free';
        setCurrent(isFree ? 'free' : code);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => { refreshCurrent(); }, [refreshCurrent]);

  // Option 2 sync: refresh the current plan when the user returns to this tab,
  // so a plan changed in the app shows here without a manual reload.
  useEffect(() => {
    const onFocus = () => { if (document.visibilityState === 'visible') refreshCurrent(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refreshCurrent]);

  // Countdown after confirmation → redirect to cart
  useEffect(() => {
    if (!confirmed) return;
    if (countdown <= 0) {
      router.push(fromPage || '/cart');
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [confirmed, countdown]);

  const campaignEligible = (plan) =>
    ['popular', 'elite'].includes(planCodeOf(plan));

  // Card button opens the checkout modal (does NOT pay yet).
  const openCheckout = (plan) => {
    if (!token)              { router.push('/login?redirect=/plans'); return; }
    if (planCodeOf(plan) === 'free') return;
    if (isCurrentPlan(plan)) return;
    setError('');
    setCoupon(null); setCouponInput(''); setCouponError('');
    attemptKey.current = { identity: null, key: null };
    setCheckoutPlan(plan);
  };

  const closeCheckout = () => {
    setCheckoutPlan(null);
    setCoupon(null); setCouponInput(''); setCouponError('');
  };

  // Validate + preview the campaign coupon (display only).
  const applyCoupon = async () => {
    const plan = checkoutPlan;
    const code = couponInput.trim();
    if (!plan || !code) return;
    const chosen = billingOptionFor(plan) || (plan.billing_options || [])[0];
    if (!chosen) { setCouponError('No billing option for this plan.'); return; }
    setCouponBusy(true); setCouponError('');
    try {
      const data = await quoteMarketingCoupon({ billing_id: chosen.id, coupon_code: code });
      if (!data?.valid) { setCoupon(null); setCouponError('Coupon is not valid for this plan.'); return; }
      setCoupon(data);
    } catch (err) {
      setCoupon(null);
      setCouponError(err?.message || 'Coupon is invalid, paused, expired, or exhausted.');
    } finally {
      setCouponBusy(false);
    }
  };

  const removeCoupon = () => { setCoupon(null); setCouponInput(''); setCouponError(''); };

  // Pay button in the modal. Prices come from the order, never computed here.
  const handleConfirmPay = async () => {
    const plan = checkoutPlan;
    if (!plan || !token) return;

    const chosen = billingOptionFor(plan) || (plan.billing_options || [])[0];
    if (!chosen) { setError('This plan has no billing option available. Please refresh and try again.'); return; }

    // Only send a coupon the API confirmed as valid in the quote.
    const couponCode = coupon?.valid ? (coupon.coupon_code || couponInput.trim()) : '';

    // Idempotency identity = billing + coupon; changing either starts a new attempt.
    const identity = `${chosen.id}:${couponCode}`;
    if (attemptKey.current.identity !== identity || !attemptKey.current.key) {
      attemptKey.current = { identity, key: newCheckoutAttemptId() };
    }

    setLoading(plan.id); setError('');
    try {
      const { order, verification, alreadyCompleted } = await purchasePlan({
        billing_id:            chosen.id,
        idempotency_key:       attemptKey.current.key,
        marketing_coupon_code: couponCode || undefined,
        user,
        description:           `${nameOf(plan)} Plan`,
      });

      attemptKey.current = { identity: null, key: null };

      if (alreadyCompleted) {
        setError('This payment was already completed. Refreshing your subscription…');
        refreshCurrent(); closeCheckout(); return;
      }

      const code = (plan.plan_code || plan.id || '').toString().toLowerCase();
      setCurrent(code); updateMembership(code); refreshCurrent();

      // Campaign coupon takes priority over referral in the display.
      const isCampaign = !!(order?.coupon_code) || order?.discount_source === 'MARKETING';
      setConfirmed({
        plan,
        paymentId: verification?.payment_ref || verification?.subscription_id
          || order?.subscription_id || order?.razorpay_order_id || '',
        original:      order?.original_price ?? chosen.price,
        discountPct:   Number(order?.discount_percent ?? order?.referral_discount_percent) || 0,
        discountAmt:   Number(order?.discount_amount ?? order?.referral_discount_amount) || 0,
        discountLabel: isCampaign ? `Coupon ${order?.coupon_code || couponCode}` : 'Referral discount',
        amount:        order?.payable_price ?? chosen.price,
        duration:      chosen.duration_months ?? duration,
      });
      setCountdown(5);
      closeCheckout();
    } catch (err) {
      if (err?.name === 'SessionExpiredError' || err?.message === 'SESSION_EXPIRED') {
        logout(); router.push('/login?reason=session_expired&redirect=/plans'); return;
      }
      setError(err.message || 'Could not complete the subscription.');
    } finally {
      setLoading(null);
    }
  };

  // The billing option for the selected duration — the unit the whole checkout
  // works in. Its `id` is the billing_id sent to the order endpoint (§3).
  const billingOptionFor = (plan) =>
    (plan?.billing_options || []).find(
      (o) => Number(o.duration_months) === Number(duration)
    ) || null;

  // Same, but for an arbitrary duration (used by the price-in-tab display).
  const billingOptionForMonths = (plan, months) =>
    (plan?.billing_options || []).find(
      (o) => Number(o.duration_months) === Number(months)
    ) || null;

  // Original (pre-discount) price. Falls back to the static tables only when
  // the backend hasn't supplied billing options.
  const getPrice = (plan) => {
    if (plan.id === 'free' || plan.plan_code === 'FREE') return 0;
    const opt = billingOptionFor(plan);
    if (opt?.price != null) return opt.price;
    const tier = plan.pricingTiers?.find(t => t.months === duration);
    return tier?.price ?? PRICES[plan.id]?.[duration] ?? plan.price_monthly ?? plan.base_price_monthly;
  };

  // What the user actually pays, straight from the API (§3). Never computed.
  const getPayable = (plan) => {
    if (plan.id === 'free' || plan.plan_code === 'FREE') return 0;
    const opt = billingOptionFor(plan);
    return opt?.payable_price != null ? opt.payable_price : getPrice(plan);
  };

  // Representative total shown under each duration tab. Uses the "most chosen"
  // plan (popular) if present, else the first paid plan. Display only.
  const tabPrice = (months) => {
    const paid = plans.filter((p) => planCodeOf(p) !== 'free');
    const lead = paid.find((p) => p.popular) || paid.find((p) => planCodeOf(p) === 'popular') || paid[0];
    if (!lead) return null;
    const opt = billingOptionForMonths(lead, months);
    if (opt?.payable_price != null) return opt.payable_price;
    if (opt?.price != null) return opt.price;
    const tier = lead.pricingTiers?.find((t) => t.months === months);
    if (tier?.price != null) return tier.price;
    const fb = PRICES[lead.id]?.[months];
    return fb != null ? fb : null;
  };

  // A plan is "current" when its code matches the user's membership type. The
  // backend plan may expose its code as `plan_code`, `code`, or (legacy) a slug
  // `id`. Normalise all of them before comparing to `current`.
  const planCodeOf = (plan) =>
    (plan?.plan_code || plan?.code || plan?.membershipType || plan?.id || '')
      .toString().toLowerCase();
  // Plan display name across shapes: central API uses `plan_name`, the static
  // PLANS + web backend use `name`. Fall back to a title-cased code, never blank.
  const nameOf = (plan) => {
    const n = plan?.name || plan?.plan_name;
    if (n) return n;
    const c = planCodeOf(plan);
    return c ? c.charAt(0).toUpperCase() + c.slice(1) : 'Plan';
  };
  const isCurrentPlan = (plan) =>
    current && current !== 'free' && planCodeOf(plan) === String(current).toLowerCase();

  // Referral pricing arrives ON the billing option itself (§3).
  const hasReferral = (plan) => {
    const opt = billingOptionFor(plan);
    return Boolean(opt?.referral_eligible) && Number(opt?.referral_discount_amount) > 0;
  };

  // The coupon the backend linked to this user, for the banner.
  const referralInfo = () => {
    for (const plan of plans) {
      for (const opt of plan?.billing_options || []) {
        if (opt?.referral_eligible && Number(opt?.referral_discount_percent) > 0) {
          return { code: opt.referral_coupon_code, percent: Number(opt.referral_discount_percent) };
        }
      }
    }
    return null;
  };

  const referralActiveNow = () => plans.some((p) => hasReferral(p));

  const toFeatureArray = (val) => {
    if (Array.isArray(val)) {
      return val
        .map((f) => (typeof f === 'string' ? f : (f?.label || f?.name || f?.title || f?.text || '')))
        .filter(Boolean);
    }
    if (val && typeof val === 'object') {
      return Object.values(val)
        .map((f) => (typeof f === 'string' ? f : (f?.label || f?.name || '')))
        .filter(Boolean);
    }
    if (typeof val === 'string') {
      return val.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };
  const staticPlanFor = (plan) =>
    (PLANS || []).find((p) => planCodeOf(p) === planCodeOf(plan));
  const featureList = (plan) => {
    const fromApi = toFeatureArray(plan?.features);
    if (fromApi.length) return fromApi;
    return toFeatureArray(staticPlanFor(plan)?.features);
  };
  const notIncludedList = (plan) => {
    const fromApi = toFeatureArray(plan?.notIncluded);
    if (fromApi.length) return fromApi;
    return toFeatureArray(staticPlanFor(plan)?.notIncluded);
  };

  const getBtnLabel = (plan) => {
    if (planCodeOf(plan) === 'free') return 'Free Plan';
    if (isCurrentPlan(plan))         return '✓ Current Plan';
    if (loading === plan.id)         return 'Opening payment…';
    if (current && current !== 'free') return `Upgrade to ${nameOf(plan)}`;
    return `Continue with ${nameOf(plan)}`;
  };

  const getBtnClass = (plan) => {
    if (planCodeOf(plan) === 'free') return 'plan-btn btn-free';
    if (isCurrentPlan(plan))         return 'plan-btn btn-active';
    return 'plan-btn btn-primary';
  };

  // Plans to render — Free is hidden on the web storefront.
  const visiblePlans = plans.filter((p) => planCodeOf(p) !== 'free');

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (confirmed) {
    return (
      <>
        <style>{S}</style>
        <div className="plans-page">
          <div className="conf-wrap">
            <div className="conf-icon">🎉</div>
            <h1 className="conf-title">
              Welcome to <em>{nameOf(confirmed.plan)}</em>
            </h1>
            <p className="conf-sub">Subscription activated successfully</p>

            <div className="conf-card">
              <div className="conf-row">
                <span>Plan</span>
                <span style={{ color: confirmed.plan.color }}>{confirmed.plan.icon} {nameOf(confirmed.plan)}</span>
              </div>
              <div className="conf-row">
                <span>Duration</span>
                <span>{confirmed.duration} month{confirmed.duration > 1 ? 's' : ''}</span>
              </div>
              {confirmed.discountAmt > 0 && (
                <>
                  <div className="conf-row">
                    <span>Original price</span>
                    <span style={{ textDecoration:'line-through', color:'var(--faint)' }}>
                      ₹{inr(confirmed.original)}
                    </span>
                  </div>
                  <div className="conf-row">
                    <span>{confirmed.discountLabel || 'Referral discount'} ({confirmed.discountPct}%)</span>
                    <span style={{ color:'#2E9E63' }}>−₹{inr(confirmed.discountAmt)}</span>
                  </div>
                </>
              )}
              <div className="conf-row">
                <span>Amount paid</span>
                <span>₹{inr(confirmed.amount)}</span>
              </div>
              {confirmed.plan.discountRate > 0 && (
                <div className="conf-row">
                  <span>Product discount</span>
                  <span style={{ color:'#2E9E63' }}>{confirmed.plan.discountLabel} on all products ✓</span>
                </div>
              )}
              <div className="conf-row">
                <span>Payment ID</span>
                <span style={{ fontSize:'11px' }}>{confirmed.paymentId}</span>
              </div>
            </div>

            <p className="conf-countdown">
              Redirecting to {fromPage ? fromLabel : 'cart'} in {countdown}s…
            </p>
            <a href={fromPage || '/cart'} className="conf-btn">
              Go now <IcArrow />
            </a>
          </div>
        </div>
      </>
    );
  }

  // ── Main plans grid ───────────────────────────────────────────────────────
  return (
    <>
      <style>{S}</style>
      <div className="plans-page">
        <div className="plans-head">
          <span className="plans-eyebrow">Membership</span>
          <h1 className="plans-title">Choose Your <em>Plan</em></h1>
          
        </div>

        {isUpgrade && (
          <div className="upgrade-notice">
            <h3>Upgrade required to access <em>{fromLabel}</em></h3>
            <p>Choose Popular or Elite to unlock full access</p>
          </div>
        )}

        {(() => {
          const ref = referralInfo();
          if (!ref) return null;
          const activeNow = referralActiveNow();
          return (
            <div className="referral-benefit">
              <span className="rb-tag">Referral</span>
              <div className="rb-body">
                <div className="rb-title">
                  <em>{ref.percent}% off</em> your first paid plan
                </div>
                {ref.code && <div className="rb-meta">{ref.code}</div>}
                <p className="rb-note">
                  {activeNow
                    ? 'Already applied to the eligible plans below.'
                    : `Your coupon doesn't cover ${duration} month${duration > 1 ? 's' : ''}. Try another duration to use it.`}
                </p>
              </div>
            </div>
          );
        })()}

        {error && <div className="msg-error">⚠ {error}</div>}

        {/* Duration selector — price shown under each label */}
        <div className="duration-wrap">
          <div className="duration-tabs">
            {DURATIONS.map(d => {
              const p = tabPrice(d.months);
              return (
                <button
                  key={d.months}
                  className={`dur-btn${duration === d.months ? ' active' : ''}`}
                  onClick={() => setDuration(d.months)}
                >
                  {d.badge && <span className="dur-save">{d.badge}</span>}
                  <span className="dur-label">{d.label}</span>
                  <span className="dur-price">{p != null ? `₹${inr(p)}` : '—'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cancel / auto-renew notice */}
        {/* <div className="cancel-notice">
          <IcShield s={15} />
          Cancel anytime · Auto-renews unless cancelled 24h before the term ends
        </div> */}

        <div className="plans-grid">
          {visiblePlans.map((plan) => {
            const isElite   = planCodeOf(plan) === 'elite';
            const isPremium = plan.popular || isElite;
            const opt       = billingOptionFor(plan);
            const showRef   = hasReferral(plan);
            const current_  = isCurrentPlan(plan);
            return (
            <div
              key={plan.id}
              className={`plan-card${isPremium ? ' premium' : ''}${plan.popular ? ' popular' : ''}${isElite ? ' elite' : ''}${current_ ? ' is-current' : ''}`}
            >
              {plan.popular && <div className="most-chosen">Most Chosen</div>}

              <div className="card-head">
                {plan.icon && <div className="plan-chip">{plan.icon}</div>}
                <div className="card-head-txt">
                  <h2 className="plan-name">{nameOf(plan)}</h2>
                  {plan.appPlanCode && <p className="plan-code">{plan.appPlanCode}</p>}
                </div>
              </div>

              {current_ && (
                <div className="current-tag"><IcCheck s={12} /> Your current plan</div>
              )}

              <div className="plan-price-wrap">
                <div className="plan-price">
                  <span className="cur">₹</span>
                  <span className="amt">{inr(getPayable(plan))}</span>
                  <span className="per">/ {duration} mo</span>
                </div>
                <p className="plan-term">
                  Billed once for {duration} month{duration > 1 ? 's' : ''}
                </p>

                {showRef && (
                  <>
                    <div className="plan-was">
                      <s>₹{inr(getPrice(plan))}</s>
                      <span className="plan-was-off">−{opt.referral_discount_percent}% referral</span>
                    </div>
                    <p className="plan-price-note">
                      You save ₹{inr(opt.referral_discount_amount)} with your referral
                    </p>
                  </>
                )}

                {plan.discountRate > 0 && (
                  <div className="plan-discount-tag">
                    <span style={{ color: plan.color }}>{plan.icon}</span>
                    {plan.discountLabel} off all products
                  </div>
                )}
              </div>

              {isPremium && (
                <div className="feat-chip"><IcCheck s={10} /> All features included</div>
              )}

              <ul className="plan-features">
                {featureList(plan).map((f, i) => (
                  <li key={`${f}-${i}`} className="plan-feat">
                    <span className="feat-check"><IcCheck s={11} /></span>
                    {f}
                  </li>
                ))}
                {notIncludedList(plan).map((f, i) => (
                  <li key={`ni-${f}-${i}`} className="plan-feat feat-no">
                    <span className="feat-check">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={getBtnClass(plan)}
                onClick={() => openCheckout(plan)}
                disabled={current_ || !!loading}
              >
                {getBtnLabel(plan)}
                {!current_ && loading !== plan.id && <IcArrow />}
              </button>
            </div>
            );
          })}
        </div>

        {checkoutPlan && (() => {
          const plan     = checkoutPlan;
          const chosen   = billingOptionFor(plan) || (plan.billing_options || [])[0];
          const original = coupon?.valid ? (coupon.original_price ?? getPrice(plan)) : getPrice(plan);
          const payable  = coupon?.valid ? coupon.payable_price : getPayable(plan);
          const refShown = !coupon?.valid && hasReferral(plan);
          const showBox  = campaignEligible(plan);
          return (
            <div className="co-overlay" onClick={closeCheckout}>
              <div className="co-panel" onClick={(e) => e.stopPropagation()}>
                <button className="co-close" onClick={closeCheckout}>✕</button>
                <p className="co-eyebrow">Checkout</p>
                <h3 className="co-title">
                  {nameOf(plan)} <em>· {duration} month{duration > 1 ? 's' : ''}</em>
                </h3>

                <div className="co-rows">
                  <div className="co-row"><span>Original price</span><span>₹{inr(original)}</span></div>

                  {coupon?.valid && (
                    <div className="co-row co-disc">
                      <span>Coupon {coupon.coupon_code} ({coupon.discount_percent}%)</span>
                      <span>−₹{inr(coupon.discount_amount)}</span>
                    </div>
                  )}
                  {refShown && (
                    <div className="co-row co-disc">
                      <span>Referral discount ({chosen?.referral_discount_percent}%)</span>
                      <span>−₹{inr(chosen?.referral_discount_amount)}</span>
                    </div>
                  )}

                  <div className="co-row co-total"><span>You pay</span><span>₹{inr(payable)}</span></div>
                </div>

                {coupon?.valid && coupon.replaces_referral_discount && (
                  <p className="co-note">Campaign coupon applied. Discounts cannot be combined.</p>
                )}

                {showBox && !coupon?.valid && (
                  <div className="co-coupon">
                    <input
                      className="co-input"
                      placeholder="Campaign coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      disabled={couponBusy}
                    />
                    <button className="co-apply" onClick={applyCoupon} disabled={couponBusy || !couponInput.trim()}>
                      {couponBusy ? '…' : 'Apply'}
                    </button>
                  </div>
                )}
                {showBox && coupon?.valid && (
                  <button className="co-remove" onClick={removeCoupon}>Remove coupon</button>
                )}
                {couponError && <p className="co-err">{couponError}</p>}

                <button className="co-pay" onClick={handleConfirmPay} disabled={loading === plan.id}>
                  {loading === plan.id
                    ? 'Processing…'
                    : (Number(payable) === 0 ? 'Activate for free' : `Pay ₹${inr(payable)}`)}
                </button>
                <p className="co-secure"><IcLock s={11} /> Secured by Razorpay · Cancel anytime</p>
              </div>
            </div>
          );
        })()}

        {/* Trust row */}
      
<br></br>
<br></br>
       <br></br>
      </div>
    </>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={<div style={{ padding:'80px', textAlign:'center', color:'#A79E98', fontFamily:'"Space Mono",monospace', letterSpacing:'.2em', textTransform:'uppercase', fontSize:'10px' }}>Loading plans…</div>}>
      <PlansContent />
    </Suspense>
  );
}