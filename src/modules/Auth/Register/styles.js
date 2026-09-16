/* ── CSS ─────────────────────────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,500&family=Schibsted+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.frg, .frg *, .frg *::before, .frg *::after { box-sizing: border-box; margin: 0; padding: 0; }
.frg {
  --canvas:#F2EFE9;
  --card:#FBFAF7;
  --tile:#E8E4DD;
  --ink:#1A1A1A;
  --muted:#8B8781;
  --muted2:#A8A49C;
  --p1:#DD8164;
  --p2:#D45A79;
  --p3:#C96A6B;
  --peach:#FFC98F;
  --grad: linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);
  --grad-btn: linear-gradient(135deg,#FFC98F 12%,#DD8164 52%,#D45A79 92%);
  --tint: rgba(212,90,121,.10);
  --tint-2: rgba(212,90,121,.18);
  --blue:#2757F0;
  --line: rgba(26,26,26,.12);
  --line-soft: rgba(26,26,26,.07);
  --amber:#B07A12;
  --err:#C0392B;
  --green:#0e9f5a; --green-bg:rgba(14,159,90,.08);
  --red:#e03030;   --red-bg:rgba(224,48,48,.08);
  --amber-bg:rgba(176,122,18,.08);
  --ink-2:#5a2f2f; --ink-3:#a5615f; --ink-4:#d0a08f;
  --f-bg:#fff;
  --ease: cubic-bezier(.22,1,.36,1);
  font-family: 'Schibsted Grotesk', sans-serif;
  color: var(--ink);
  min-height: 100svh;
  position: relative; overflow: hidden;
  background:
    radial-gradient(1100px 700px at 12% -10%, rgba(212,90,121,.16), transparent 62%),
    radial-gradient(900px 700px at 92% 108%, rgba(255,201,143,.16), transparent 60%),
    var(--canvas);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 6vh 24px 10vh;
}
.frg::after {
  content:''; position:absolute; inset:0; pointer-events:none; opacity:.55;
  background-image: radial-gradient(rgba(26,26,26,.035) 1px, transparent 1px);
  background-size: 3px 3px;
}

.frg-orbit { position: fixed; z-index: 1; pointer-events: none; width: 360px; height: 360px; opacity: .8; }
.frg-orbit.l { left: -90px; top: 7%; }
.frg-orbit.r { right: -100px; bottom: 5%; }
.frg-orbit circle {
  fill: none; stroke: var(--ink); stroke-width: 1; opacity: .16;
  stroke-dasharray: 5 12; animation: frgSpin 44s linear infinite; transform-origin: 50% 50%;
}
.frg-orbit circle:nth-child(2) { stroke: var(--p2); opacity: .5; stroke-dasharray: 2 26; animation: frgSpin 26s linear infinite reverse; }
@keyframes frgSpin { to { transform: rotate(360deg); } }

/* ════ card ══════════════════════════════════════════════════════ */
.frg-card {
  position: relative; z-index: 2;
  width: min(640px, 94vw);
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--card);
  padding: clamp(24px, 4vw, 42px) clamp(20px, 4vw, 46px) clamp(24px, 3.5vw, 38px);
  box-shadow: 0 40px 110px rgba(26,26,26,.13), 0 4px 14px rgba(26,26,26,.05);
  animation: frgCardIn .8s var(--ease) both;
}
.frg-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background: linear-gradient(90deg, var(--peach), var(--p1) 45%, var(--p2) 80%, transparent);
  border-radius: 20px 20px 0 0;
}
@keyframes frgCardIn { from { opacity:0; transform: translateY(26px) scale(.985); } to { opacity:1; transform:none; } }

/* ════ brand header ══════════════════════════════════════════════ */
.frg-brand { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--line-soft); }
.frg-brand-mark { display: flex; align-items: center; gap: 13px; text-decoration: none; }
.frg-brand-mark img { height: 48px; width: auto; max-width: 240px; display: block; object-fit: contain; }
.frg-brand-word { font-family:'Schibsted Grotesk',sans-serif; font-weight: 700; font-size: 24px; letter-spacing: -.035em; color: var(--ink); position: relative; }
.frg-brand-word .dot { display: inline-block; width: .5em; height: .5em; border-radius: 50%; background: var(--grad); margin-left: .06em; vertical-align: .04em; transform: scale(0); animation: frgDotPop .55s var(--ease) .35s forwards; }
@keyframes frgDotPop { to { transform: scale(1); } }
.frg-brand-rule { width: 1px; height: 22px; flex: none; background: linear-gradient(to bottom, transparent, var(--line), transparent); }
.frg-brand-sub { font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing: .26em; text-transform: uppercase; color: var(--muted); }
.frg-brand-back { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .18em; color: var(--muted); text-decoration: none; white-space: nowrap; transition: color .25s; }
.frg-brand-back:hover { color: var(--ink); }
@media (max-width: 560px) { .frg-brand-rule, .frg-brand-sub { display: none; } }

/* ════ headline / rules / fields ═════════════════════════════════ */
.frg-kicker { font-family:'Space Mono',monospace; font-size: 11px; letter-spacing:.24em; color: var(--muted); margin-bottom: 16px; }
.frg-h1 { font-family:'Fraunces',serif; font-weight: 400; font-size: clamp(32px, 4.4vw, 50px); line-height: 1.05; letter-spacing: -.01em; margin-bottom: 16px; }
.frg-h1 em {
  font-style: italic; font-weight: 500;
  background: linear-gradient(100deg,#E9A063 0%, #DD8164 45%, #D45A79 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
  position: relative; display: inline-block; padding: 0 .06em;
}
.frg-h1 em::before {
  content:''; position:absolute; left:0; right:0; bottom:.1em; height:.34em; z-index:-1;
  background: var(--tint-2); border-radius: 2px; transform: scaleX(0); transform-origin: 0 50%;
  animation: frgHighlight .75s var(--ease) .25s forwards;
}
@keyframes frgHighlight { to { transform: scaleX(1); } }
.frg-sub { font-size: 15px; font-weight: 300; color: var(--muted); line-height: 1.6; max-width: 540px; }

.frg-rule {
  display: flex; align-items: center; gap: 16px; margin: 34px 0 22px;
  font-family:'Space Mono',monospace; font-size: 10.5px; letter-spacing:.22em; color: var(--muted); white-space: nowrap;
}
.frg-rule::after { content:''; flex:1; height:1px; background: linear-gradient(90deg, var(--line), transparent); }

.frg-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 34px; }
.frg-field { margin-bottom: 26px; position: relative; scroll-margin-top: 90px; }
.frg-label { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 600; margin-bottom: 6px; flex-wrap: wrap; }
.frg-label .req { color: var(--p2); }
.frg-label .opt { font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing:.14em; color: var(--muted2); text-transform: uppercase; font-weight: 700; }
/* inline "change mobile / email" control shown once OTP is sent */
.frg-change { margin-left: auto; font-family:'Space Mono',monospace; font-size: 9px; letter-spacing:.14em; text-transform: uppercase; color: var(--p2); background: none; border: none; cursor: pointer; }
.frg-change:hover { text-decoration: underline; text-underline-offset: 3px; }
.frg-input, .frg-select, .frg-area, .frg-select2 {
  width: 100%; background: transparent; border: none; outline: none;
  border-bottom: 1px solid var(--line);
  color: var(--ink); font-family:'Schibsted Grotesk',sans-serif;
  font-size: 17px; font-weight: 400; padding: 12px 2px; transition: border-color .3s; border-radius: 0;
}
.frg-area { resize: vertical; min-height: 74px; line-height: 1.55; }
.frg-input::placeholder, .frg-area::placeholder { color: var(--muted2); font-weight: 300; }
.frg-input.mono { font-family:'Space Mono',monospace; font-size: 15px; letter-spacing: .08em; text-transform: uppercase; }
.frg-uline { position: relative; }
.frg-uline::after {
  content:''; position:absolute; left:0; right:0; bottom:0; height:2px;
  background: var(--grad); transform: scaleX(0); transform-origin: 0 50%; transition: transform .45s var(--ease);
}
.frg-uline:focus-within::after { transform: scaleX(1); }
.frg-uline.err { border-bottom: none; }
.frg-uline.err .frg-input { border-bottom-color: var(--err); }
.frg-uline.err::after { background: var(--err); transform: scaleX(1); }
.frg-uline.ok .frg-input, .frg-uline.ok .frg-select2 { border-bottom-color: var(--green); }
.frg-help { font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 300; }
.frg-help.err  { color: var(--err); font-weight: 400; }
/* success state is green — it used to inherit --p2 (pink), which read as an
   error even when the username was available */
.frg-help.ok   { color: var(--green); font-weight: 400; }
.frg-help.warn { color: var(--amber); font-weight: 400; }

/* align the country-code baseline with the input underline */
.frg-mobile { display: flex; align-items: flex-end; gap: 18px; }
.frg-cc {
  display: flex; align-items: center; gap: 6px; flex: none;
  padding: 12px 2px;
  border-bottom: 1px solid var(--line);
  align-self: flex-end;
}
.frg-cc .iso { font-family:'Space Mono',monospace; font-size: 11px; color: var(--muted); letter-spacing:.08em; }
.frg-cc .frg-select { padding: 0 4px 0 0; }
.frg-select { width: auto; font-weight: 600; font-size: 16px; cursor: pointer; padding-right: 4px; }
.frg-select option, .frg-select2 option { background: var(--card); color: var(--ink); }
.frg-mobile .frg-uline { flex: 1; }

.frg-selwrap { position: relative; }
.frg-selwrap::after {
  content:''; position:absolute; right:6px; top:50%; width:8px; height:8px;
  border-right:1.5px solid var(--muted2); border-bottom:1.5px solid var(--muted2);
  transform: translateY(-70%) rotate(45deg); pointer-events:none;
}
.frg-select2 { padding: 12px 22px 12px 2px; appearance: none; cursor: pointer; }
.frg-select2:disabled { color: var(--muted2); cursor: not-allowed; }

.frg-pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-family:'Space Mono',monospace; font-size: 9px; font-weight: 700; letter-spacing:.16em;
  padding: 4px 11px; border-radius: 20px;
  border: 1px solid rgba(176,122,18,.4); color: var(--amber); background: rgba(176,122,18,.06);
}
.frg-pill .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--amber); animation: frgPulse 1.6s ease-in-out infinite; }
@keyframes frgPulse { 50% { opacity:.35; } }
.frg-pill.ok { border-color: transparent; color: #fff; background: var(--grad); }
.frg-pill.ok .dot { background: #fff; animation: none; }
.frg-pill.err { border-color: rgba(192,57,43,.45); color: var(--err); background: rgba(192,57,43,.06); }
.frg-pill.err .dot { background: var(--err); }

.frg-otp {
  display: inline-flex; align-items: center; gap: 10px;
  font-family:'Space Mono',monospace; font-size: 11.5px; font-weight: 700; letter-spacing:.22em;
  padding: 15px 30px; border-radius: 50px; cursor: pointer;
  color: var(--p2); background: transparent; border: 1.5px solid rgba(212,90,121,.45);
  transition: background .3s, color .3s, border-color .3s, transform .15s var(--ease), box-shadow .3s; margin-top: 4px;
}
.frg-otp:hover:not(:disabled) { background: var(--grad); border-color: transparent; color: #fff; box-shadow: 0 10px 30px rgba(212,90,121,.4); }
.frg-otp:active:not(:disabled) { transform: scale(.97); }
.frg-otp:disabled { opacity: .32; cursor: not-allowed; }
.frg-otp svg { width: 14px; height: 14px; }

.frg-otp-panel { margin-top: 22px; padding: 24px 24px 20px; border: 1px solid rgba(212,90,121,.35); border-radius: 12px; background: var(--tint); animation: frgUp .5s var(--ease) both; }
.frg-otp-panel-title { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .2em; color: var(--muted); margin-bottom: 16px; }
.frg-otp-digits { display: flex; gap: 10px; flex-wrap: wrap; }
.frg-otp-digit {
  width: 48px; height: 56px; text-align: center;
  font-family:'Space Mono',monospace; font-size: 21px; font-weight: 700;
  color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 10px; outline: none;
  transition: border-color .25s, box-shadow .25s; caret-color: var(--p2);
}
.frg-otp-digit:focus { border-color: var(--p2); box-shadow: 0 0 0 4px rgba(212,90,121,.16); }
.frg-otp-digit.filled { border-color: rgba(212,90,121,.5); }
.frg-otp-panel.shake .frg-otp-digit { animation: frgShake .4s var(--ease); border-color: var(--err); }
@keyframes frgShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }
.frg-otp-actions { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 18px; flex-wrap: wrap; }
.frg-verify {
  display: inline-flex; align-items: center; gap: 10px;
  font-family:'Space Mono',monospace; font-size: 10.5px; font-weight: 700; letter-spacing:.2em;
  color: #fff; background: var(--grad); border: none; border-radius: 50px; padding: 13px 28px; cursor: pointer;
  box-shadow: 0 10px 30px rgba(212,90,121,.35); transition: transform .15s var(--ease), box-shadow .3s, opacity .3s;
}
.frg-verify:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 16px 40px rgba(212,90,121,.5); }
.frg-verify:active:not(:disabled) { transform: scale(.96); }
.frg-verify:disabled { opacity: .34; cursor: not-allowed; box-shadow: none; }
.frg-resend { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .16em; background: none; border: none; cursor: pointer; color: var(--p2); padding: 6px 2px; transition: color .25s; }
.frg-resend:hover:not(:disabled) { text-decoration: underline; text-underline-offset: 3px; }
.frg-resend:disabled { color: var(--muted2); cursor: default; }
.frg-otp-status { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .1em; margin-top: 12px; }
.frg-otp-status.verified { color: var(--green); }
.frg-otp-status.error { color: var(--err); }
.frg-otp-status.pending { color: var(--muted); }
.frg-otp-done {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 22px; padding: 16px 24px;
  border: 1px solid rgba(14,159,90,.4); border-radius: 12px; background: var(--green-bg);
  font-family:'Space Mono',monospace; font-size: 10.5px; font-weight: 700; letter-spacing: .18em; color: var(--green);
  animation: frgUp .5s var(--ease) both;
}
.frg-otp-done svg { width: 18px; height: 18px; flex: none; }

.frg-check {
  display: flex; align-items: flex-start; gap: 16px; border: 1px solid var(--line); border-radius: 12px;
  padding: 18px 20px; margin-bottom: 14px; cursor: pointer; background: transparent;
  transition: border-color .3s, background .3s, opacity .3s; scroll-margin-top: 90px;
}
.frg-check:hover { border-color: rgba(212,90,121,.4); background: var(--tint); }
.frg-check.on { border-color: var(--p2); background: var(--tint); }
.frg-check.err { border-color: rgba(192,57,43,.5); background: rgba(192,57,43,.05); }
.frg-check.locked { cursor: default; opacity: .75; }
.frg-check.locked:hover { border-color: var(--line); background: transparent; }
.frg-check.locked.on:hover { border-color: var(--p2); background: var(--tint); }
.frg-check.locked.err:hover { border-color: rgba(192,57,43,.5); background: rgba(192,57,43,.05); }
.frg-box { width: 20px; height: 20px; flex: none; margin-top: 1px; border: 1.5px solid var(--line); border-radius: 5px; background: #fff; display: grid; place-items: center; transition: background .25s, border-color .25s; }
.frg-check.on .frg-box { background: var(--grad); border-color: transparent; animation: frgBoxPop .3s var(--ease); }
.frg-check.err .frg-box { border-color: var(--err); }
@keyframes frgBoxPop { 40% { transform: scale(1.25); } }
.frg-box svg { width: 12px; height: 12px; stroke: #fff; stroke-width: 3; fill: none; opacity: 0; transition: opacity .15s; }
.frg-check.on .frg-box svg { opacity: 1; }
.frg-check p { font-size: 14px; font-weight: 300; line-height: 1.55; color: #3a3833; }
.frg-check .frg-check-note { color: var(--green); font-weight: 500; }
.frg-check .frg-check-err { display: block; margin-top: 6px; font-size: 12px; font-weight: 400; color: var(--err); }
.frg-check a { color: var(--p2); text-decoration: none; }
.frg-check a:hover { text-decoration: underline; text-underline-offset: 3px; }
.frg-consent-err { font-size: 12px; color: var(--err); margin-top: 8px; display: flex; align-items: center; gap: 6px; }

.frg-at { font-family:'Space Mono',monospace; color: var(--muted); font-size: 17px; padding-right: 6px; border-bottom: 1px solid var(--line); display: flex; align-items: center; }
.frg-user-row { display: flex; }
.frg-user-row .frg-uline { flex: 1; }

/* notes */
.frg-note { border-radius: 12px; padding: 12px 16px; font-size: 13px; font-weight: 300; line-height: 1.55; margin: 14px 0; }
.frg-note.soft  { background: var(--tint); border: 1px solid rgba(212,90,121,.18); color: #6b5a52; }
.frg-note.green { background: var(--green-bg); border: 1px solid rgba(14,159,90,.2); color: var(--green); }
.frg-note.amber { background: var(--amber-bg); border: 1px solid rgba(176,122,18,.25); color: var(--amber); }
.frg-note.red   { background: var(--red-bg); border: 1px solid rgba(224,48,48,.2); color: var(--red); }
.frg-note b { font-weight: 600; }
.frg-note a { color: var(--p2); cursor: pointer; text-decoration: none; font-weight: 500; }
.frg-note a:hover { text-decoration: underline; text-underline-offset: 3px; }

/* referral applied card */
.frg-ref-applied {
  display: flex; align-items: center; gap: 13px; margin-top: 12px; padding: 13px 16px;
  border: 1px solid rgba(14,159,90,.35); border-radius: 12px; background: var(--green-bg);
  animation: frgUp .4s var(--ease) both;
}
.frg-ref-applied .frg-ref-ico { width: 30px; height: 30px; border-radius: 8px; background: var(--grad); display: grid; place-items: center; color: #fff; font-size: 14px; flex: none; }
.frg-ref-applied .frg-ref-txt { flex: 1; min-width: 0; }
.frg-ref-applied .frg-ref-ttl { font-size: 13px; font-weight: 600; color: var(--green); }
.frg-ref-applied .frg-ref-sub { font-size: 11.5px; color: #4a6a54; margin-top: 2px; }
.frg-ref-applied .frg-ref-rm { border: none; background: none; color: var(--muted); font-size: 18px; cursor: pointer; line-height: 1; flex: none; }
.frg-ref-applied .frg-ref-rm:hover { color: var(--err); }

/* ════ live-check explainer card (step 05) ═══════════════════════ */
.frg-livecard {
  border: 1px solid rgba(212,90,121,.22); border-radius: 18px; overflow: hidden;
  background: linear-gradient(160deg, rgba(255,201,143,.10), rgba(212,90,121,.06));
  margin-bottom: 16px; scroll-margin-top: 90px;
}
.frg-livecard.err { border-color: rgba(224,48,48,.35); background: var(--red-bg); }
.frg-livecard-hdr { display: flex; align-items: center; gap: 13px; padding: 16px 18px 14px; }
.frg-livecard-ico {
  width: 40px; height: 40px; border-radius: 12px; flex: none; display: grid; place-items: center;
  background: var(--grad); box-shadow: 0 8px 22px rgba(212,90,121,.32);
}
.frg-livecard-ttl { font-family:'Fraunces',serif; font-weight: 500; font-size: 17px; color: var(--ink); line-height: 1.25; }
.frg-livecard-sub { font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 2px; }
.frg-livecard-body { padding: 0 18px 18px; }
.frg-livesteps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.frg-livestep { display: flex; align-items: flex-start; gap: 12px; }
.frg-livestep-n {
  width: 22px; height: 22px; border-radius: 50%; flex: none; display: grid; place-items: center;
  font-family:'Space Mono',monospace; font-size: 9.5px; font-weight: 700;
  color: var(--p2); background: #fff; border: 1px solid rgba(212,90,121,.35); margin-top: 1px;
}
.frg-livestep-txt { font-size: 13.5px; font-weight: 300; color: #4a423e; line-height: 1.5; }
.frg-livestep-txt b { font-weight: 600; color: var(--ink); }
.frg-livereq { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
.frg-livereq span {
  font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase;
  padding: 5px 10px; border-radius: 20px; color: var(--muted);
  background: rgba(255,255,255,.7); border: 1px solid var(--line-soft);
}
.frg-livestart {
  width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 11px;
  font-family:'Space Mono',monospace; font-size: 11.5px; font-weight: 700; letter-spacing: .2em;
  color: #fff; background: var(--grad-btn); border: none; border-radius: 14px; padding: 17px 24px; cursor: pointer;
  box-shadow: 0 14px 36px rgba(212,90,121,.34); transition: transform .18s var(--ease), box-shadow .3s;
}
.frg-livestart:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(212,90,121,.46); }
.frg-livestart:active { transform: scale(.98); }

/* ════ category grid ═════════════════════════════════════════════ */
.frg-catgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; scroll-margin-top: 90px; }
.frg-cat {
  border: 1px solid var(--line); border-radius: 14px; padding: 16px 10px; cursor: pointer; text-align: center; background: transparent;
  transition: border-color .25s, background .25s, transform .2s var(--ease), box-shadow .25s;
}
.frg-cat:hover { transform: translateY(-3px); border-color: rgba(212,90,121,.45); box-shadow: 0 12px 30px rgba(26,26,26,.1); }
.frg-cat:focus-visible { outline: 2px solid var(--p2); outline-offset: 2px; }
.frg-cat.on { border-color: var(--p2); background: var(--tint); box-shadow: 0 14px 34px rgba(212,90,121,.18); }
.frg-catgrid.err .frg-cat { border-color: rgba(192,57,43,.4); }
.frg-cat-ico { font-size: 22px; margin-bottom: 8px; }
.frg-cat-lbl { font-size: 10.5px; font-weight: 500; color: var(--muted); line-height: 1.3; letter-spacing: .01em; }
.frg-cat.on .frg-cat-lbl { color: var(--p2); }
.frg-cat-skel { border: 1px dashed var(--line); border-radius: 14px; padding: 16px 10px; text-align: center; animation: frgPulse2 1.4s ease-in-out infinite; }
@keyframes frgPulse2 { 0%,100% { opacity:.5; } 50% { opacity:1; } }
.frg-cat-skel-ico { width: 24px; height: 24px; border-radius: 50%; background: var(--line); margin: 0 auto 8px; }
.frg-cat-skel-lbl { width: 42px; height: 7px; border-radius: 3px; background: var(--line); margin: 0 auto; }

/* ════ documents ═════════════════════════════════════════════════ */
.frg-docs { display: flex; flex-direction: column; gap: 12px; scroll-margin-top: 90px; }
.frg-doc-slot { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; }
.frg-doc-hdr { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--tint); border-bottom: 1px solid var(--line-soft); }
.frg-doc-lbl { font-family:'Space Mono',monospace; font-size: 9.5px; letter-spacing: .14em; color: var(--p3); text-transform: uppercase; }
.frg-doc-rm { border: none; background: none; color: var(--muted); font-size: 18px; cursor: pointer; line-height: 1; }
.frg-doc-rm:hover { color: var(--err); }
.frg-doc-up { display: flex; align-items: center; gap: 12px; padding: 15px 16px; cursor: pointer; transition: background .2s; }
.frg-doc-up:hover { background: var(--tint); }
.frg-doc-up-txt { font-size: 13.5px; color: var(--p3); flex: 1; }
.frg-doc-up-sub { font-family:'Space Mono',monospace; font-size: 8px; letter-spacing: .1em; color: var(--muted2); }
.frg-doc-file { display: flex; align-items: center; gap: 12px; padding: 13px 16px; }
.frg-doc-fico { width: 30px; height: 30px; border-radius: 7px; background: var(--tint); display: grid; place-items: center; flex: none; }
.frg-doc-fname { font-size: 13px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.frg-doc-fsize { font-family:'Space Mono',monospace; font-size: 9px; color: var(--muted); }
.frg-upload { border: 1.5px dashed rgba(212,90,121,.3); border-radius: 14px; padding: 26px 16px; text-align: center; cursor: pointer; background: var(--tint); transition: border-color .2s; }
.frg-upload:hover { border-color: var(--p2); }
.frg-upload-ttl { font-size: 14px; color: #3a3833; margin-bottom: 4px; }
.frg-upload-sub { font-family:'Space Mono',monospace; font-size: 8px; letter-spacing: .1em; color: var(--muted2); }
.frg-file { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; margin-bottom: 8px; background: #fff; }
.frg-file-name { flex: 1; font-size: 13px; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.frg-file-sz { font-family:'Space Mono',monospace; font-size: 9px; color: var(--muted); }
.frg-file-rm { color: var(--muted); cursor: pointer; font-size: 16px; }
.frg-file-rm:hover { color: var(--err); }

/* ════ selfie result card ════════════════════════════════════════ */
.frg-selfie { display: flex; align-items: flex-start; gap: 16px; background: var(--tint); border: 1px solid rgba(212,90,121,.2); border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; }
.frg-selfie.done  { background: var(--green-bg); border-color: rgba(14,159,90,.3); }
.frg-selfie.error { background: var(--red-bg); border-color: rgba(224,48,48,.28); }
.frg-selfie-img { width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2px solid var(--p2); flex: none; }
.frg-selfie.done .frg-selfie-img  { border-color: var(--green); }
.frg-selfie.error .frg-selfie-img { border-color: var(--err); }
.frg-selfie-info { flex: 1; min-width: 0; }
.frg-selfie-name { font-size: 13px; font-weight: 500; color: #3a3833; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.frg-selfie-row { display: flex; align-items: center; gap: 7px; font-size: 12.5px; }
.frg-selfie-row.analyzing, .frg-selfie-row.uploading { color: var(--amber); }
.frg-selfie-row.done { color: var(--green); font-weight: 500; }
.frg-selfie-row.error { color: var(--err); }
.frg-selfie-live {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
  font-family:'Space Mono',monospace; font-size: 8.5px; font-weight: 700; letter-spacing: .16em;
  padding: 4px 10px; border-radius: 20px; color: #fff; background: var(--grad);
}

/* spinner */
.frg-spin { width: 14px; height: 14px; border: 2px solid rgba(212,90,121,.2); border-top-color: var(--p2); border-radius: 50%; animation: frgSpinc .7s linear infinite; display: inline-block; flex: none; }
.frg-spin.white { border-color: rgba(255,255,255,.25); border-top-color: #fff; }
@keyframes frgSpinc { to { transform: rotate(360deg); } }

/* ════ success ═══════════════════════════════════════════════════ */
.frg-success { text-align: center; padding: 16px 8px 6px; animation: frgUp .6s var(--ease) both; }
.frg-suc-ico { width: 72px; height: 72px; border-radius: 50%; background: var(--green-bg); border: 1px solid rgba(14,159,90,.2); display: grid; place-items: center; margin: 0 auto 20px; box-shadow: 0 0 0 12px rgba(14,159,90,.04); }
.frg-suc-ico svg { width: 30px; height: 30px; }
.frg-suc-tbl { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; max-width: 400px; margin: 24px auto 0; text-align: left; background: #fff; }
.frg-suc-row { display: flex; justify-content: space-between; gap: 14px; padding: 12px 18px; border-bottom: 1px solid var(--line-soft); font-size: 13.5px; }
.frg-suc-row:last-child { border-bottom: none; }
.frg-suc-k { font-family:'Space Mono',monospace; font-size: 9.5px; letter-spacing: .16em; color: var(--muted); }
.frg-suc-v { font-weight: 500; color: var(--ink); text-align: right; overflow-wrap: anywhere; }

/* ════ footer nav ════════════════════════════════════════════════ */
.frg-foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 38px; padding-top: 28px; border-top: 1px solid var(--line-soft); }
.frg-foot-label { font-family:'Space Mono',monospace; font-size: 10.5px; letter-spacing:.22em; color: var(--muted); }
.frg-foot-actions { display: flex; align-items: center; gap: 14px; }
.frg-back { display: inline-flex; align-items: center; gap: 10px; font-family:'Space Mono',monospace; font-size: 11px; font-weight: 700; letter-spacing:.18em; color: var(--muted); background: transparent; cursor: pointer; border: 1px solid var(--line); border-radius: 50px; padding: 16px 28px; transition: color .25s, border-color .25s, transform .15s var(--ease); }
.frg-back:hover:not(:disabled) { color: var(--p2); border-color: rgba(212,90,121,.5); }
.frg-back:active:not(:disabled) { transform: scale(.96); }
.frg-back:disabled { opacity: .4; cursor: not-allowed; }
.frg-continue {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 12px;
  font-family:'Space Mono',monospace; font-size: 12px; font-weight: 700; letter-spacing:.2em;
  color: #fff; background: var(--grad); border: none; border-radius: 50px; padding: 18px 40px; cursor: pointer;
  box-shadow: 0 16px 44px rgba(212,90,121,.4); transition: transform .2s var(--ease), box-shadow .3s, opacity .3s;
}
.frg-continue::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%);
  transform: translateX(-160%); transition: transform .7s var(--ease);
}
.frg-continue:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 26px 70px rgba(212,90,121,.55); }
.frg-continue:hover:not(:disabled)::after { transform: translateX(160%); }
.frg-continue:active:not(:disabled) { transform: scale(.97); }
.frg-continue.soft-disabled { opacity: .58; box-shadow: none; }
.frg-continue:disabled { opacity: .34; cursor: not-allowed; box-shadow: none; }
.frg-continue .arr { transition: transform .3s var(--ease); }
.frg-continue:hover:not(:disabled) .arr { transform: translateX(5px); }

/* ════ step transitions ══════════════════════════════════════════ */
.frg-panel.fwd { animation: frgFwd .5s var(--ease) both; }
.frg-panel.bwd { animation: frgBwd .5s var(--ease) both; }
@keyframes frgFwd { from { opacity:0; transform: translateX(46px); } to { opacity:1; transform:none; } }
@keyframes frgBwd { from { opacity:0; transform: translateX(-46px); } to { opacity:1; transform:none; } }
.frg-stag { animation: frgUp .7s var(--ease) both; }
@keyframes frgUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:none; } }

/* ══════════════════════════════════════════════════════════════════
   CAMERA MODAL — live-detection UI
   ══════════════════════════════════════════════════════════════════ */
.cam-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: radial-gradient(900px 700px at 50% 12%, rgba(90,32,20,.72), rgba(16,7,4,.96));
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 18px;
  animation: camIn .24s ease both;
}
@keyframes camIn { from { opacity: 0; } to { opacity: 1; } }
.cam-modal {
  width: 100%; max-width: 470px; background: var(--card);
  border-radius: 24px; overflow: hidden;
  box-shadow: 0 40px 100px rgba(60,20,10,.6), 0 0 0 1px rgba(255,255,255,.06);
  animation: camModalIn .4s var(--ease) both;
}
@keyframes camModalIn { from { opacity: 0; transform: translateY(22px) scale(.97); } to { opacity: 1; transform: none; } }

/* header + segmented step track */
.cam-hdr { padding: 15px 18px 13px; border-bottom: 1px solid var(--line-soft); }
.cam-hdr-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.cam-hdr-ttl { font-family:'Fraunces',serif; font-weight: 500; font-size: 17px; color: var(--ink); display: flex; align-items: center; gap: 9px; }
.cam-live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--p2); flex: none;
  box-shadow: 0 0 0 0 rgba(212,90,121,.7); animation: camLiveDot 1.9s ease-out infinite;
}
@keyframes camLiveDot {
  0% { box-shadow: 0 0 0 0 rgba(212,90,121,.7); }
  70% { box-shadow: 0 0 0 8px rgba(212,90,121,0); }
  100% { box-shadow: 0 0 0 0 rgba(212,90,121,0); }
}
.cam-close { border: none; background: var(--tint); border-radius: 9px; width: 30px; height: 30px; cursor: pointer; font-size: 13px; color: var(--muted); display: grid; place-items: center; transition: background .15s, color .15s; flex: none; }
.cam-close:hover { background: var(--tint-2); color: var(--ink); }
.cam-track { display: flex; gap: 5px; margin-top: 12px; }
.cam-track-seg { flex: 1; height: 3px; border-radius: 3px; background: var(--line); overflow: hidden; position: relative; }
.cam-track-seg i { position: absolute; inset: 0; width: 0%; background: var(--grad-btn); border-radius: 3px; transition: width .25s linear; display: block; }
.cam-track-lbls { display: flex; gap: 5px; margin-top: 6px; }
.cam-track-lbl {
  flex: 1; text-align: center; font-family:'Space Mono',monospace;
  font-size: 7.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted2);
  transition: color .25s;
}
.cam-track-lbl.on { color: var(--p2); font-weight: 700; }
.cam-track-lbl.done { color: var(--green); }

/* viewfinder */
.cam-vf { position: relative; width: 100%; background: #120705; height: clamp(400px, 60vh, 640px); overflow: hidden; }
@media (min-height: 800px) { .cam-vf { height: clamp(460px, 64vh, 720px); } }
.cam-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.cam-video.mirror { transform: scaleX(-1); }

/* face frame — SVG ring with progress arc */
.cam-frame { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
.cam-frame svg { width: 100%; height: 100%; display: block; }
.cam-frame .vignette { fill: rgba(10,4,2,.52); }
.cam-frame .ring-bg { fill: none; stroke: rgba(255,255,255,.28); stroke-width: 2.5; }
.cam-frame .ring-arc {
  fill: none; stroke: url(#camArc); stroke-width: 4; stroke-linecap: round;
  transition: stroke-dashoffset .22s linear;
}
.cam-frame .ring-glow { fill: none; stroke: rgba(212,90,121,.35); stroke-width: 10; filter: blur(6px); opacity: 0; transition: opacity .35s; }
.cam-frame.active .ring-glow { opacity: 1; }
.cam-frame.blink .ring-glow { stroke: rgba(255,201,143,.6); opacity: 1; }
/* corner ticks */
.cam-frame .tick { fill: none; stroke: rgba(255,255,255,.55); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.cam-frame.active .tick { stroke: var(--peach); }

/* scanning sweep during the open-eye hold */
.cam-sweep {
  position: absolute; left: 0; right: 0; height: 90px; z-index: 4; pointer-events: none;
  background: linear-gradient(to bottom, transparent, rgba(255,201,143,.22) 45%, rgba(212,90,121,.32) 55%, transparent);
  animation: camSweep 2.2s var(--ease) infinite;
}
@keyframes camSweep { 0% { top: -12%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 96%; opacity: 0; } }

/* big countdown ring */
.cam-count-wrap { position: absolute; inset: 0; display: grid; place-items: center; z-index: 6; pointer-events: none; }
.cam-count {
  width: 108px; height: 108px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(16,7,4,.55); border: 2px solid rgba(255,255,255,.25);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
}
.cam-count span {
  font-family:'Fraunces',serif; font-weight: 600; font-size: 54px; line-height: 1; color: #fff;
  text-shadow: 0 4px 22px rgba(0,0,0,.6);
  animation: camCountPop .95s var(--ease) both;
}
@keyframes camCountPop { from { opacity: 0; transform: scale(1.7); } 60% { opacity: 1; } to { opacity: 1; transform: scale(1); } }

/* blink prompt burst */
.cam-blinkburst { position: absolute; inset: 0; display: grid; place-items: center; z-index: 6; pointer-events: none; }
.cam-blinkburst-inner { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.cam-eye {
  width: 78px; height: 50px; display: grid; place-items: center;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,.55));
  animation: camEyeBlink 1.25s ease-in-out infinite;
}
@keyframes camEyeBlink {
  0%, 36%, 54%, 100% { transform: scaleY(1); }
  45% { transform: scaleY(.06); }
}
.cam-blinkword {
  font-family:'Fraunces',serif; font-style: italic; font-weight: 600; font-size: 27px; color: #fff;
  text-shadow: 0 3px 18px rgba(0,0,0,.7); letter-spacing: -.01em;
}
.cam-blink-flash {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  background: radial-gradient(circle at 50% 45%, rgba(255,201,143,.5), transparent 62%); opacity: 0;
  animation: camFlash .4s ease both;
}
@keyframes camFlash { 0% { opacity: 1; } 100% { opacity: 0; } }

/* coach strip at the bottom of the viewfinder */
.cam-coach {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 7;
  padding: 22px 18px 16px;
  background: linear-gradient(to top, rgba(14,6,3,.94) 30%, rgba(14,6,3,0));
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  pointer-events: none;
}
.cam-coach-phase {
  font-family:'Space Mono',monospace; font-size: 8px; font-weight: 700;
  letter-spacing: .3em; text-transform: uppercase; color: #FFCBA0;
}
.cam-coach-msg {
  font-family:'Schibsted Grotesk',sans-serif; font-size: 16px; font-weight: 600;
  color: #fff; text-align: center; line-height: 1.3; text-shadow: 0 2px 14px rgba(0,0,0,.7);
  animation: camCoachIn .32s var(--ease) both;
}
.cam-coach-hint {
  font-family:'Schibsted Grotesk',sans-serif; font-size: 12px; font-weight: 300;
  color: rgba(255,255,255,.68); text-align: center; line-height: 1.45; max-width: 300px;
}
@keyframes camCoachIn { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
.cam-coach-frames {
  display: flex; align-items: center; gap: 6px; margin-top: 3px;
  font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing: .18em; color: rgba(255,255,255,.6);
}
.cam-coach-frames i { width: 5px; height: 5px; border-radius: 50%; background: var(--peach); display: block; animation: frgPulse 1s ease-in-out infinite; }

/* loading + error states */
.cam-loading, .cam-error {
  position: absolute; inset: 0; z-index: 8; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px; padding: 26px; text-align: center;
  background: rgba(14,6,3,.82);
}
.cam-loading-txt { color: rgba(255,255,255,.7); font-size: 12.5px; }
.cam-error-ico { font-size: 30px; }
.cam-error-txt { color: #fff; font-size: 12.5px; line-height: 1.65; max-width: 300px; }
.cam-retry { margin-top: 6px; padding: 10px 22px; border-radius: 10px; border: 1px solid rgba(255,255,255,.3); background: rgba(255,255,255,.1); color: #fff; font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .12em; cursor: pointer; transition: background .15s; }
.cam-retry:hover { background: rgba(255,255,255,.2); }

/* inline (non-blocking) run error */
.cam-runerr {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 12px 18px; background: var(--red-bg); border-top: 1px solid rgba(224,48,48,.22);
  font-size: 12.5px; font-weight: 400; color: var(--red); line-height: 1.5;
  animation: frgUp .3s var(--ease) both;
}
.cam-runerr span:first-child { flex: none; }

/* checklist shown before starting */
.cam-checklist { padding: 14px 18px 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
.cam-checkitem { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 300; color: #57504b; }
.cam-checkitem svg { flex: none; }

.cam-controls { padding: 14px 18px 18px; }
.cam-shutter {
  width: 100%; background: var(--grad-btn); border: none; border-radius: 14px; padding: 16px 0; cursor: pointer;
  color: #fff; font-family:'Space Mono',monospace; font-weight: 700; font-size: 11px; letter-spacing: .2em;
  text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 9px;
  box-shadow: 0 14px 36px rgba(212,90,121,.34); transition: box-shadow .2s, filter .2s, transform .18s var(--ease), opacity .2s;
}
.cam-shutter:hover:not(:disabled) { box-shadow: 0 20px 48px rgba(212,90,121,.5); filter: brightness(1.05); transform: translateY(-1px); }
.cam-shutter:active:not(:disabled) { transform: scale(.985); }
.cam-shutter:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }

/* ════ policy modal ══════════════════════════════════════════════ */
.pm-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(18,8,4,.72); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display: flex; align-items: flex-end; justify-content: center; animation: pmBgIn .25s ease both; }
@keyframes pmBgIn { from { opacity: 0; } to { opacity: 1; } }
@media (min-width: 640px) { .pm-backdrop { align-items: center; padding: 24px; } }
.pm-sheet { position: relative; width: 100%; max-width: 780px; height: 92dvh; max-height: 800px; background: var(--card); border: 1px solid var(--line); border-radius: 20px 20px 0 0; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 -8px 60px rgba(120,50,30,.4), 0 40px 100px rgba(0,0,0,.6); animation: pmSheetIn .32s var(--ease) both; }
@media (min-width: 640px) { .pm-sheet { border-radius: 20px; height: 88dvh; } }
@keyframes pmSheetIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.pm-sheet.pm-closing { animation: pmSheetOut .22s ease forwards; }
.pm-backdrop.pm-closing { animation: pmBgOut .24s ease forwards; }
@keyframes pmSheetOut { to { opacity: 0; transform: translateY(32px); } }
@keyframes pmBgOut { to { opacity: 0; } }
.pm-topline { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--grad); z-index: 2; border-radius: 20px 20px 0 0; }
.pm-handle { width: 36px; height: 4px; border-radius: 2px; background: var(--line); margin: 14px auto 0; flex: none; }
@media (min-width: 640px) { .pm-handle { display: none; } }
.pm-header { display: flex; align-items: center; gap: 12px; padding: 16px 22px 14px; border-bottom: 1px solid var(--line-soft); flex: none; }
.pm-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--tint); border: 1px solid rgba(212,90,121,.25); display: grid; place-items: center; flex: none; font-size: 15px; }
.pm-title-block { flex: 1; min-width: 0; }
.pm-eyebrow { font-family:'Space Mono',monospace; font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: var(--p2); margin-bottom: 2px; display: block; }
.pm-title { font-family:'Fraunces',serif; font-weight: 500; font-size: clamp(15px,2vw,18px); color: var(--ink); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pm-actions { display: flex; align-items: center; gap: 7px; flex: none; }
.pm-action-btn { height: 32px; display: flex; align-items: center; gap: 5px; padding: 0 11px; border-radius: 8px; border: 1px solid var(--line); background: transparent; color: var(--muted); font-family:'Space Mono',monospace; font-size: 9px; letter-spacing: .06em; cursor: pointer; text-decoration: none; white-space: nowrap; transition: border-color .18s, color .18s; }
.pm-action-btn:hover { border-color: rgba(212,90,121,.4); color: var(--p2); }
.pm-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line); background: transparent; display: grid; place-items: center; cursor: pointer; color: var(--muted); transition: border-color .18s, color .18s; flex: none; }
.pm-close:hover { border-color: rgba(212,90,121,.5); color: var(--ink); }
.pm-iframe-wrap { flex: 1; position: relative; overflow: hidden; }
.pm-iframe { width: 100%; height: 100%; border: none; display: block; background: #fff; }
.pm-spinner-ov { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; background: var(--card); z-index: 5; transition: opacity .3s, visibility .3s; }
.pm-spinner-ov.pm-hidden { opacity: 0; visibility: hidden; }
.pm-spin-txt { font-family:'Space Mono',monospace; font-size: 9px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
@media (max-width: 560px) { .pm-header { padding: 13px 14px 11px; } .pm-action-btn span { display: none; } .pm-action-btn { padding: 0 9px; } }

/* ════ responsive / motion ═══════════════════════════════════════ */
@media (max-width: 1360px) { .frg-orbit { display: none; } }
@media (max-width: 720px) { .frg-catgrid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) {
  .frg-row2 { grid-template-columns: 1fr; gap: 0; }
  .frg-foot { flex-direction: column; align-items: stretch; text-align: center; }
  .frg-foot-actions { flex-direction: column-reverse; align-items: stretch; }
  .frg-continue, .frg-back { justify-content: center; }
  .frg-otp-digit { width: 42px; height: 50px; font-size: 18px; }
  .frg-catgrid { grid-template-columns: repeat(3, 1fr); }
  .cam-count { width: 92px; height: 92px; }
  .cam-count span { font-size: 44px; }
  .cam-blinkword { font-size: 23px; }
  .cam-coach-msg { font-size: 15px; }
  .cam-checklist { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .frg-orbit circle, .frg-pill .dot { animation: none; }
  .frg-card, .frg-stag, .frg-panel.fwd, .frg-panel.bwd, .frg-otp-panel, .frg-otp-done { animation: none; }
  .frg-h1 em::before { animation: none; transform: scaleX(1); }
  .frg-brand-word .dot { animation: none; transform: scale(1); }
  .cam-overlay, .cam-modal, .cam-sweep, .cam-eye, .cam-count span,
  .cam-coach-msg, .cam-blink-flash, .cam-live-dot, .cam-coach-frames i { animation: none; }
}
/* ════ custom calendar picker ════════════════════════════════════ */
.frg-cal-wrap { position: relative; width: 100%; }
.frg-cal-input { cursor: pointer; padding-right: 40px; }
.frg-cal-icon { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.frg-cal-icon svg { width: 18px; height: 18px; }
.frg-cal-popover {
  position: absolute; top: calc(100% + 8px); left: 0; z-index: 100;
  background: var(--card); border: 1px solid var(--line); border-radius: 16px;
  padding: 16px; width: 300px;
  box-shadow: 0 14px 40px rgba(26,26,26,.15);
  animation: frgUp .3s var(--ease) both;
}
.frg-cal-header { display: flex; gap: 8px; margin-bottom: 16px; }
.frg-cal-selwrap { position: relative; flex: 1; min-width: 0; }
.frg-cal-selwrap .frg-select-input {
  background: var(--tint); border: 1px solid transparent; border-radius: 8px;
  padding: 6px 20px 6px 12px; font-size: 13px; font-weight: 500; width: 100%;
}
.frg-cal-selwrap .frg-select-input:hover { background: #fff; border-color: var(--line); }
.frg-cal-selwrap .frg-select-icon { right: 4px; }
.frg-cal-selwrap .frg-select-icon svg { width: 14px; height: 14px; }
.frg-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.frg-cal-day-label {
  font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase;
  color: var(--muted); text-align: center; padding-bottom: 8px;
}
.frg-cal-cell {
  background: transparent; border: 1px solid transparent; border-radius: 8px;
  height: 34px; display: grid; place-items: center;
  font-family: 'Schibsted Grotesk', sans-serif; font-size: 14px; color: var(--ink);
  cursor: pointer; transition: background .2s, color .2s, border-color .2s;
}
.frg-cal-cell:hover:not(:disabled):not(.on) { background: var(--tint); border-color: rgba(212,90,121,.3); color: var(--p2); }
.frg-cal-cell.on { background: var(--grad); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(212,90,121,.4); }
.frg-cal-cell:disabled { opacity: .2; cursor: not-allowed; 

}
/* ════ custom select picker ════════════════════════════════════ */
.frg-select-wrap { position: relative; width: 100%; }
.frg-select-wrap.disabled { opacity: .5; pointer-events: none; }
.frg-select-input { width: 100%; cursor: pointer; padding-right: 40px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
.frg-select-icon { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.frg-select-icon svg { width: 16px; height: 16px; }
.frg-select-popover {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 100;
  background: var(--card); border: 1px solid var(--line); border-radius: 12px;
  width: 100%; max-height: 260px; overflow-y: auto;
  box-shadow: 0 14px 40px rgba(26,26,26,.15);
  animation: frgUp .2s var(--ease) both;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.frg-select-popover::-webkit-scrollbar {
  display: none;
}
.frg-select-list { display: flex; flex-direction: column; padding: 8px; }
.frg-select-empty { padding: 12px; text-align: center; color: var(--muted); font-size: 13px; font-weight: 300; }
.frg-select-option {
  background: transparent; border: none; border-radius: 8px;
  padding: 12px 14px; text-align: left;
  font-family: 'Schibsted Grotesk', sans-serif; font-size: 14px; color: var(--ink);
  cursor: pointer; transition: background .2s, color .2s;
}
.frg-select-option:hover:not(.on) { background: var(--tint); color: var(--p2); }
.frg-select-option.on { background: var(--grad); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(212,90,121,.4); }

/* Fix Country Code Dropdown Size */
.frg-cc .frg-select-wrap { width: 85px; }
.frg-cc .frg-select-input { padding-right: 28px; padding-left: 0; background: transparent; border: none; font-size: 16px; font-weight: 600; }
.frg-cc .frg-select-icon { right: 0; }
`;
