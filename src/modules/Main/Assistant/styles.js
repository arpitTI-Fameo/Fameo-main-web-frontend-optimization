// modules/Main/Assistant/styles.js
// Local style object for the support widget. Never promoted — every rule here
// is scoped to `.asst-*` and means nothing outside this module.

export const S = `
  .asst-root{
    --asst-p1:#8F2793;
    --asst-p2:#D53B7E;
    --asst-grad:linear-gradient(135deg,#8F2793 0%,#D53B7E 100%);
    --asst-ink:#111118;
    --asst-mute:#8A8A94;
    --asst-line:#ECECF1;
    --asst-surface:#FFFFFF;
    --asst-canvas:#F7F7FA;

    position:fixed;
    right:clamp(16px,3vw,28px);
    bottom:clamp(16px,3vw,28px);
    /* Under the cart drawer (999–1002) on purpose: an open drawer is a modal
       task and a launcher floating over it is a second, competing one. */
    z-index:995;
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    gap:14px;
    font-family:var(--font-geist-sans),system-ui,-apple-system,'Segoe UI',sans-serif;
  }

  /* ── Panel ───────────────────────────────────────────────────────────── */
  .asst-panel{
    width:min(380px,calc(100vw - 32px));
    height:min(600px,calc(100dvh - 150px));
    display:flex;
    flex-direction:column;
    overflow:hidden;
    background:var(--asst-surface);
    border:1px solid var(--asst-line);
    border-radius:18px;
    box-shadow:0 24px 60px rgba(17,17,24,.18),0 2px 8px rgba(17,17,24,.06);
    transform-origin:bottom right;
    animation:asst-in .18s ease-out;
  }
  @keyframes asst-in{
    from{ opacity:0; transform:translateY(10px) scale(.97); }
    to{ opacity:1; transform:none; }
  }

  .asst-head{
    flex:0 0 auto;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    padding:16px 18px;
    border-bottom:1px solid var(--asst-line);
    background:var(--asst-surface);
  }
  .asst-title{
    font-size:17px; font-weight:600; letter-spacing:-.01em;
    color:var(--asst-ink); margin:0;
  }
  .asst-status{
    display:block; margin-top:2px;
    font-size:11px; font-weight:500; color:var(--asst-mute);
  }
  .asst-headbtn{
    flex:0 0 auto;
    width:34px; height:34px;
    display:grid; place-items:center;
    border:0; border-radius:9px; background:transparent;
    color:var(--asst-ink); cursor:pointer;
    transition:background .15s ease;
  }
  .asst-headbtn:hover{ background:var(--asst-canvas); }
  .asst-headbtn svg{ width:20px; height:20px; }

  /* ── Transcript ──────────────────────────────────────────────────────── */
  .asst-log{
    flex:1 1 auto;
    overflow-y:auto; overscroll-behavior:contain;
    padding:18px 16px 8px;
    background:var(--asst-canvas);
    display:flex; flex-direction:column; gap:16px;
  }
  .asst-log::-webkit-scrollbar{ width:6px; }
  .asst-log::-webkit-scrollbar-thumb{ background:#D8D8E0; border-radius:3px; }

  .asst-row{ display:flex; gap:10px; align-items:flex-start; }
  .asst-row.is-user{ justify-content:flex-end; }
  .asst-avatar{ flex:0 0 auto; width:34px; height:34px; border-radius:50%; }

  .asst-bubble{
    max-width:78%;
    padding:11px 14px;
    border-radius:16px;
    font-size:13.5px; line-height:1.55;
    word-break:break-word;
  }
  .asst-row:not(.is-user) .asst-bubble{
    background:var(--asst-surface);
    color:#4A4A55;
    border:1px solid var(--asst-line);
    border-top-left-radius:4px;
    box-shadow:0 1px 2px rgba(17,17,24,.04);
  }
  .asst-row.is-user .asst-bubble{
    background:var(--asst-grad);
    color:#fff;
    border-top-right-radius:4px;
  }
  .asst-who{
    display:block; margin-bottom:5px;
    font-size:13px; font-weight:600; color:var(--asst-ink);
  }
  .asst-who span{ font-weight:400; color:var(--asst-mute); }

  .asst-bubble p{ margin:0 0 8px; }
  .asst-bubble p:last-child{ margin-bottom:0; }
  .asst-bubble ul{ margin:0 0 8px; padding-left:18px; }
  .asst-bubble ul:last-child{ margin-bottom:0; }
  .asst-bubble li{ margin-bottom:5px; }
  .asst-bubble li::marker{ color:var(--asst-p2); }
  .asst-bubble strong{ font-weight:600; color:var(--asst-ink); }
  .asst-cite{
    display:inline-block; margin-left:4px;
    font-size:10.5px; font-weight:500; color:var(--asst-mute);
    vertical-align:1px;
  }

  /* ── Confidence + sources ────────────────────────────────────────────── */
  .asst-meta{ margin-top:10px; padding-top:9px; border-top:1px solid var(--asst-line); }
  .asst-conf{
    display:inline-flex; align-items:center; gap:5px;
    font-size:10px; font-weight:600; letter-spacing:.06em; text-transform:uppercase;
    color:var(--asst-mute);
  }
  .asst-dot{ width:6px; height:6px; border-radius:50%; background:currentColor; }
  .asst-conf.is-high{ color:#1E9E6A; }
  .asst-conf.is-medium{ color:#C98A1E; }
  .asst-conf.is-low{ color:#C24E74; }

  .asst-srctoggle{
    display:inline-flex; align-items:center; gap:4px;
    margin-top:8px; padding:0;
    border:0; background:none; cursor:pointer;
    font-size:11px; font-weight:600; color:var(--asst-p2);
    font-family:inherit;
  }
  .asst-srctoggle svg{ width:13px; height:13px; transition:transform .15s ease; }
  .asst-srctoggle[aria-expanded="true"] svg{ transform:rotate(180deg); }
  .asst-srclist{ margin:7px 0 0; padding:0; list-style:none; }
  .asst-srclist li{
    margin:0 0 4px; padding:5px 8px;
    background:var(--asst-canvas); border-radius:7px;
    font-size:11px; line-height:1.4; color:var(--asst-mute);
  }
  .asst-srclist li:last-child{ margin-bottom:0; }

  /* ── Starter prompts ─────────────────────────────────────────────────── */
  .asst-starters{ display:flex; flex-direction:column; align-items:flex-start; gap:7px; padding-left:44px; }
  .asst-starter{
    max-width:100%;
    padding:8px 13px;
    border:1px solid var(--asst-line); border-radius:14px;
    background:var(--asst-surface); color:var(--asst-p1);
    font-family:inherit; font-size:12.5px; font-weight:500; text-align:left;
    cursor:pointer; transition:border-color .15s ease,color .15s ease;
  }
  .asst-starter:hover{ border-color:var(--asst-p2); color:var(--asst-p2); }

  /* ── Typing ──────────────────────────────────────────────────────────── */
  .asst-typing{
    padding-left:6px;
    font-size:13px; font-style:italic; color:var(--asst-mute);
  }
  .asst-typing i{
    display:inline-block; width:3px; height:3px; margin-left:2px;
    border-radius:50%; background:currentColor; vertical-align:2px;
    animation:asst-blink 1.2s infinite;
  }
  .asst-typing i:nth-child(2){ animation-delay:.2s; }
  .asst-typing i:nth-child(3){ animation-delay:.4s; }
  @keyframes asst-blink{ 0%,60%,100%{ opacity:.25; } 30%{ opacity:1; } }

  /* ── Composer ────────────────────────────────────────────────────────── */
  .asst-form{
    flex:0 0 auto;
    display:flex; align-items:center; gap:10px;
    padding:12px 14px 14px;
    background:var(--asst-surface);
    border-top:1px solid var(--asst-line);
  }
  .asst-input{
    flex:1 1 auto; min-width:0;
    padding:11px 16px;
    border:1px solid var(--asst-line); border-radius:999px;
    background:var(--asst-surface); color:var(--asst-ink);
    font-family:inherit; font-size:13.5px;
    outline:none; transition:border-color .15s ease;
  }
  .asst-input::placeholder{ color:var(--asst-mute); }
  .asst-input:focus{ border-color:var(--asst-p2); }
  .asst-input:disabled{ background:var(--asst-canvas); cursor:not-allowed; }

  .asst-send{
    flex:0 0 auto;
    width:40px; height:40px;
    display:grid; place-items:center;
    border:0; border-radius:50%;
    background:var(--asst-grad); color:#fff;
    cursor:pointer; transition:opacity .15s ease,transform .15s ease;
  }
  .asst-send svg{ width:18px; height:18px; margin-right:1px; }
  .asst-send:hover:not(:disabled){ transform:scale(1.06); }
  .asst-send:disabled{ opacity:.4; cursor:not-allowed; }

  /* ── Launcher ────────────────────────────────────────────────────────── */
  .asst-launcher{
    width:56px; height:56px;
    display:grid; place-items:center;
    border:0; border-radius:50%;
    background:var(--asst-grad); color:#fff;
    cursor:pointer;
    box-shadow:0 10px 26px rgba(213,59,126,.36);
    transition:transform .15s ease;
  }
  .asst-launcher:hover{ transform:scale(1.06); }
  .asst-launcher svg{ width:24px; height:24px; }

  .asst-sr{
    position:absolute; width:1px; height:1px;
    padding:0; margin:-1px; overflow:hidden;
    clip:rect(0,0,0,0); white-space:nowrap; border:0;
  }

  @media (max-width:520px){
    .asst-panel{ height:min(560px,calc(100dvh - 130px)); }
    .asst-starters{ padding-left:0; }
  }

  @media (prefers-reduced-motion:reduce){
    .asst-panel{ animation:none; }
    .asst-typing i{ animation:none; opacity:.6; }
    .asst-launcher:hover,.asst-send:hover:not(:disabled){ transform:none; }
  }
`;
