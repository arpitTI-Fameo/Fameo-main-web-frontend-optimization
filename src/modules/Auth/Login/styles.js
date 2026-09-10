/* ─────────────────────────────────────────────────────────────────────────
   CSS (color palette updated)
───────────────────────────────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,300;1,9..40,400&display=swap');

:root {
  /* ── New warm palette ── */
  --p1: #D45A79;   /* rose */
  --p2: #DD8164;   /* coral */
  --p3: #FFC98F;   /* golden peach */
  --grad: linear-gradient(135deg, #D45A79 0%, #DD8164 50%, #FFC98F 100%);
  --grad-btn: linear-gradient(135deg, #FFC98F 20%, #DD8164 58%, #D45A79 88%);

  --ink: #2d1a12;
  --ink-2: #5a3a2e;
  --ink-3: #a88474;
  --ink-4: #cbb0a4;
  --red: #c0392b;
  --red-bg: rgba(192,57,43,0.08);
  --r-sm: 10px;
  --r: 14px;
  --r-xl: 28px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

/* ── Root ─────────────────────────────────────────────────────────────── */
.lg-root{
  font-family:'DM Sans',sans-serif;
  min-height:100vh;
  position:relative;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:40px 20px;
  background: linear-gradient(145deg, #f0ded6 0%, #f7e6dd 40%, #fcefe7 100%);
}

/* ── Noise ────────────────────────────────────────────────────────────── */
.lg-noise{
  position:fixed;inset:0;pointer-events:none;z-index:1;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  opacity:.55;
}

/* ── Blurred ambient orbs (warm tones) ─────────────────────────────── */
.lg-orb{
  position:fixed;border-radius:50%;filter:blur(110px);
  pointer-events:none;animation:orb-drift ease-in-out infinite;
}
.lg-orb-1{width:700px;height:700px;background:radial-gradient(circle,rgba(212,90,121,0.45) 0%,transparent 65%);top:-260px;left:-200px;animation-duration:30s;}
.lg-orb-2{width:600px;height:600px;background:radial-gradient(circle,rgba(221,129,100,0.40) 0%,transparent 65%);bottom:-160px;right:-160px;animation-duration:24s;animation-delay:-9s;}
.lg-orb-3{width:400px;height:400px;background:radial-gradient(circle,rgba(255,201,143,0.30) 0%,transparent 65%);top:40%;left:55%;animation-duration:20s;animation-delay:-15s;}
.lg-orb-4{width:320px;height:320px;background:radial-gradient(circle,rgba(212,90,121,0.20) 0%,transparent 65%);top:8%;right:12%;animation-duration:26s;animation-delay:-6s;}
.lg-orb-5{width:220px;height:220px;background:radial-gradient(circle,rgba(221,129,100,0.30) 0%,transparent 65%);bottom:18%;left:8%;animation-duration:22s;animation-delay:-11s;}
@keyframes orb-drift{
  0%,100%{transform:translate(0,0) scale(1);}
  25%{transform:translate(30px,-50px) scale(1.06);}
  60%{transform:translate(-30px,28px) scale(0.96);}
  80%{transform:translate(18px,10px) scale(1.02);}
}

/* ── Concentric decorative rings ─────────────────────────────────────── */
.lg-rings-wrap{
  position:fixed;inset:0;pointer-events:none;z-index:2;
  display:flex;align-items:center;justify-content:center;
}
.lg-ring-c{
  position:absolute;border-radius:50%;
  animation:ring-breathe ease-in-out infinite;
}
.lg-ring-c:nth-child(1){width:160px;height:160px;border:1.5px solid rgba(212,90,121,0.28);animation-duration:6s;animation-delay:0s;}
.lg-ring-c:nth-child(2){width:280px;height:280px;border:1px solid rgba(212,90,121,0.18);animation-duration:8s;animation-delay:-1s;}
.lg-ring-c:nth-child(3){width:430px;height:430px;border:1px solid rgba(255,201,143,0.20);animation-duration:11s;animation-delay:-2.5s;}
.lg-ring-c:nth-child(4){width:600px;height:600px;border:1px solid rgba(255,201,143,0.12);animation-duration:14s;animation-delay:-4s;}
.lg-ring-c:nth-child(5){width:790px;height:790px;border:1px solid rgba(221,129,100,0.10);animation-duration:18s;animation-delay:-6s;}
.lg-ring-c:nth-child(6){width:1010px;height:1010px;border:1px solid rgba(221,129,100,0.08);animation-duration:22s;animation-delay:-9s;}
.lg-ring-c:nth-child(7){width:1260px;height:1260px;border:1px solid rgba(255,201,143,0.06);animation-duration:28s;animation-delay:-13s;}
@keyframes ring-breathe{
  0%,100%{transform:scale(1);opacity:1;}
  50%{transform:scale(1.04);opacity:.55;}
}

/* ── Spinning corner arc circles ──────────────────────────────────────── */
.lg-corner{
  position:fixed;border-radius:50%;pointer-events:none;z-index:2;
  animation:corner-spin linear infinite;
}
.lg-corner-tl{width:360px;height:360px;top:-180px;left:-180px;border:1.5px solid transparent;border-top-color:rgba(212,90,121,0.25);border-right-color:rgba(221,129,100,0.15);animation-duration:38s;}
.lg-corner-br{width:460px;height:460px;bottom:-230px;right:-230px;border:1.5px solid transparent;border-bottom-color:rgba(212,90,121,0.20);border-left-color:rgba(255,201,143,0.12);animation-duration:52s;animation-direction:reverse;}
.lg-corner-tr{width:210px;height:210px;top:-60px;right:-60px;border:1px solid transparent;border-top-color:rgba(255,201,143,0.20);border-left-color:rgba(212,90,121,0.12);animation-duration:28s;}
.lg-corner-bl{width:280px;height:280px;bottom:-80px;left:-80px;border:1px solid transparent;border-bottom-color:rgba(255,201,143,0.15);border-right-color:rgba(221,129,100,0.12);animation-duration:44s;animation-direction:reverse;}
.lg-corner::after{content:'';position:absolute;width:5px;height:5px;border-radius:50%;background:rgba(212,90,121,0.7);top:50%;left:0;transform:translate(-50%,-50%);box-shadow:0 0 10px 2px rgba(212,90,121,0.55);}
@keyframes corner-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

/* ── BUBBLES ──────────────────────────────────────────────────────────── */
.lg-bubble{
  position:fixed;
  border-radius:50%;
  pointer-events:none;
  z-index:3;
  animation:bubble-float ease-in-out infinite;
  border:1px solid rgba(255,255,255,0.30);
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255,201,143,0.20) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(212,90,121,0.08) 100%
  );
  backdrop-filter:blur(1px);
}
.lg-bubble::before{
  content:'';
  position:absolute;
  top:12%;left:16%;
  width:28%;height:18%;
  border-radius:50%;
  background:rgba(255,255,255,0.45);
  filter:blur(2px);
  transform:rotate(-30deg);
}
.lg-bubble::after{
  content:'';
  position:absolute;
  bottom:14%;left:30%;
  width:40%;height:10%;
  border-radius:50%;
  background:rgba(255,255,255,0.12);
  filter:blur(3px);
}
@keyframes bubble-float{
  0%   {transform:translateY(0px) translateX(0px) scale(1);   opacity:var(--bop);}
  20%  {transform:translateY(-18px) translateX(6px)  scale(1.02);opacity:var(--bop);}
  45%  {transform:translateY(-8px)  translateX(-10px) scale(0.98);opacity:var(--bop);}
  70%  {transform:translateY(-24px) translateX(4px)  scale(1.03);opacity:var(--bop);}
  100% {transform:translateY(0px) translateX(0px) scale(1);   opacity:var(--bop);}
}

/* ── Sparkle twinkle dots ─────────────────────────────────────────────── */
.lg-sparkle{
  position:fixed;border-radius:50%;pointer-events:none;z-index:2;
  animation:sparkle-twinkle ease-in-out infinite;
}
@keyframes sparkle-twinkle{
  0%,100%{opacity:.12;transform:scale(1);}
  50%{opacity:.95;transform:scale(1.7);}
}

/* ── Floating particles ───────────────────────────────────────────────── */
.lg-particle{
  position:fixed;border-radius:50%;pointer-events:none;
  animation:particle-rise linear infinite;opacity:0;
}
@keyframes particle-rise{
  0%  {transform:translateY(105vh) scale(0.4);opacity:0;}
  8%  {opacity:1;}
  92% {opacity:.7;}
  100%{transform:translateY(-8vh) scale(1.3);opacity:0;}
}

/* ── Card ─────────────────────────────────────────────────────────────── */
.lg-card{
  position:relative;z-index:10;
  width:100%;max-width:430px;
  background:#fffdfa;
  border:1px solid rgba(221,129,100,0.15);
  border-radius:var(--r-xl);
  box-shadow:
    0 0 0 1px rgba(212,90,121,0.07),
    0 40px 90px rgba(80,40,30,0.25),
    0 10px 30px rgba(0,0,0,0.12),
    0 0 140px rgba(212,90,121,0.08);
  overflow:hidden;
  animation:card-rise .75s cubic-bezier(.22,1,.36,1) both;
}
@keyframes card-rise{
  from{opacity:0;transform:translateY(48px) scale(.96);}
  to{opacity:1;transform:translateY(0) scale(1);}
}
.lg-card::before{
  content:'';position:absolute;top:0;left:0;right:0;
  height:3.5px;background:var(--grad);z-index:1;
}
.lg-card::after{
  content:'';position:absolute;inset:0;
  border-radius:var(--r-xl);pointer-events:none;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.9);
}

/* ── Logo section ─────────────────────────────────────────────────────── */
.lg-logo-wrap{
  padding:34px 32px 0;
  display:flex;flex-direction:column;align-items:center;
  animation:fade-down .55s .1s cubic-bezier(.22,1,.36,1) both;
}
@keyframes fade-down{
  from{opacity:0;transform:translateY(-14px);}
  to{opacity:1;transform:translateY(0);}
}
.lg-logo-img-wrap{
  margin-bottom:10px;
  display:flex;align-items:center;justify-content:center;
}
.lg-logo-img{
  width:160px;
  height:auto;
  display:block;
  object-fit:contain;
}
.lg-logo-sub{
  font-size:8.5px;font-weight:600;letter-spacing:.32em;
  text-transform:uppercase;color:var(--ink-4);
  margin-top:2px;
}

.lg-divider{
  height:1px;margin:18px 32px 0;
  background:linear-gradient(90deg,transparent,rgba(221,129,100,0.20),transparent);
}

/* ── Body ─────────────────────────────────────────────────────────────── */
.lg-body{
  padding:22px 32px 26px;
  animation:body-in .45s .18s cubic-bezier(.22,1,.36,1) both;
}
@keyframes body-in{
  from{opacity:0;transform:translateX(14px);}
  to{opacity:1;transform:translateX(0);}
}
.lg-subtitle{
  font-size:12px;font-weight:400;color:var(--ink-4);
  margin-bottom:22px;line-height:1.55;
}

/* ── Fields ───────────────────────────────────────────────────────────── */
.lg-field{margin-bottom:14px;position:relative;}

.lg-label{
  display:block;
  font-size:11px;
  font-weight:700;
  letter-spacing:.06em;
  color:var(--ink-2);
  margin-bottom:7px;
}

.lg-input{
  width:100%;
  background:#faf5f0;
  border:2px solid rgba(212,90,121,0.18);
  border-radius:var(--r-sm);
  padding:12px 15px 12px 42px;
  font-family:'DM Sans',sans-serif;
  font-size:14px;
  font-weight:600;
  color:var(--ink);
  outline:none;
  -webkit-font-smoothing:antialiased;
  transition:border-color .2s, background .2s;
  box-shadow:none;
}
.lg-input:focus{
  border-color:var(--p1);
  background:#fffcf9;
  box-shadow:none;
}
.lg-input::placeholder{
  color:var(--ink-4);
  font-size:12.5px;
  font-weight:300;
}

.lg-field-icon{
  position:absolute;
  left:13px;
  top:calc(50% + 10px);
  transform:translateY(-50%);
  color:var(--ink-4);
  pointer-events:none;
  transition:color .2s;
  display:flex;align-items:center;
}
.lg-field:focus-within .lg-field-icon{color:var(--p1);}

/* ── Notices ──────────────────────────────────────────────────────────── */
.lg-session-msg{
  padding:11px 14px;margin-bottom:14px;
  background:rgba(212,90,121,0.07);
  border:1px solid rgba(212,90,121,0.20);
  border-radius:var(--r-sm);
  color:var(--p2);font-size:12px;font-weight:400;
  text-align:center;line-height:1.5;
}
.lg-error{
  padding:11px 14px;margin-bottom:14px;
  border-radius:var(--r-sm);
  background:var(--red-bg);
  border:1px solid rgba(192,57,43,0.20);
  color:var(--red);font-size:12px;font-weight:400;
}

/* ── Button ───────────────────────────────────────────────────────────── */
.lg-btn{
  width:100%;margin-top:6px;padding:14px;
  border:none;border-radius:var(--r-sm);
  background:var(--grad-btn);color:#fff;
  font-family:'DM Sans',sans-serif;font-size:12px;
  font-weight:700;letter-spacing:.22em;text-transform:uppercase;
  cursor:pointer;transition:all .25s;
  box-shadow:0 6px 22px rgba(216, 132, 153, 0.42);
  display:flex;align-items:center;justify-content:center;gap:9px;
  position:relative;overflow:hidden;
}
.lg-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 55%);
  pointer-events:none;
}
.lg-btn:hover:not(:disabled){
  box-shadow:0 10px 32px rgba(212,90,121,0.58);
  transform:translateY(-1.5px);filter:brightness(1.05);
}
.lg-btn:active:not(:disabled){transform:translateY(0);}
.lg-btn:disabled{
  opacity:.38;cursor:not-allowed;
  background:rgba(221,129,100,0.30);box-shadow:none;transform:none;
}
.lg-spinner{
  width:13px;height:13px;
  border:2px solid rgba(255,255,255,.25);
  border-top-color:#fff;border-radius:50%;
  animation:spin .7s linear infinite;flex-shrink:0;
}
@keyframes spin{to{transform:rotate(360deg);}}

/* ── Footer ───────────────────────────────────────────────────────────── */
.lg-footer{
  border-top:1px solid rgba(221,129,100,0.12);
  padding:13px 32px 20px;background:#faf5f0;
  display:flex;flex-direction:column;align-items:center;gap:9px;
}
.lg-hint{font-size:10.5px;font-weight:400;color:var(--ink-4);text-align:center;line-height:1.5;}
.lg-back{font-size:10.5px;font-weight:400;color:var(--ink-4);text-decoration:none;letter-spacing:.04em;transition:color .2s;}
.lg-back:hover{color:var(--p2);}

@media(max-width:480px){
  .lg-logo-wrap,.lg-body{padding-left:20px;padding-right:20px;}
  .lg-divider{margin-left:20px;margin-right:20px;}
  .lg-footer{padding-left:20px;padding-right:20px;}
}
`;
