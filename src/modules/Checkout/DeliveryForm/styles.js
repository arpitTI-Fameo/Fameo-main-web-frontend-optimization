export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
  .df-sec-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:#181820; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.08); }
  .df-sec-title-gap { margin-top:28px; }
  .df-g2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
  .df-g3 { display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px; margin-bottom:12px; }
  .df-field { display:flex; flex-direction:column; gap:5px; margin-bottom:12px; }
  .df-field-0 { display:flex; flex-direction:column; gap:5px; }
  .df-label { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; color:#9898a8; }
  .df-inp { padding:11px 13px; border:1.5px solid rgba(0,0,0,0.08); background:#fafafa; font-family:'Jost',sans-serif; font-size:13px; color:#181820; outline:none; transition:border-color .2s; width:100%; border-radius:2px; box-sizing:border-box; }
  .df-inp:focus { border-color:#E8405A; background:#fff; }

  /* ── Field-level errors ── */
  .df-field.has-err .df-inp,
  .df-field-0.has-err .df-inp,
  .df-field.has-err .df-select,
  .df-field-0.has-err .df-select {
    border-color:#E05050; background:#fff7f7;
  }
  .df-field.has-err .df-label,
  .df-field-0.has-err .df-label { color:#C03A3A; }
  .df-err {
    font-family:'Jost',sans-serif; font-size:10.5px; font-weight:300;
    color:#C03A3A; display:flex; align-items:center; gap:4px;
    animation: dfErrIn .26s cubic-bezier(.22,1,.36,1);
  }
  .df-err::before { content:'!'; font-weight:600; font-size:9px;
    width:12px; height:12px; border-radius:50%; background:#E05050; color:#fff;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  @keyframes dfErrIn { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:none; } }

  /* Shake applied by focusFirstError() */
  .df-shake { animation: dfShake .5s cubic-bezier(.36,.07,.19,.97); }
  @keyframes dfShake {
    10%,90% { transform:translateX(-2px); }
    20%,80% { transform:translateX(3px);  }
    30%,50%,70% { transform:translateX(-5px); }
    40%,60% { transform:translateX(5px);  }
  }

  /* ── Error summary banner ── */
  .df-summary {
    border:1px solid rgba(224,80,80,.3); background:#fff5f5;
    border-radius:3px; padding:13px 15px; margin-bottom:20px;
    animation: dfErrIn .3s cubic-bezier(.22,1,.36,1);
  }
  .df-summary-title {
    font-family:'Jost',sans-serif; font-size:9px; font-weight:500;
    letter-spacing:.2em; text-transform:uppercase; color:#C03A3A;
    margin-bottom:9px; display:flex; align-items:center; gap:6px;
  }
  .df-summary-list { display:flex; flex-wrap:wrap; gap:7px; }
  .df-summary-chip {
    font-family:'Jost',sans-serif; font-size:10.5px; font-weight:300;
    color:#8a2b2b; background:#fff; border:1px solid rgba(224,80,80,.28);
    border-radius:2px; padding:4px 9px; cursor:pointer;
    transition:all .18s;
  }
  .df-summary-chip:hover {
    background:#E05050; color:#fff; border-color:#E05050;
  }

  @media (prefers-reduced-motion: reduce) {
    .df-shake, .df-err, .df-summary { animation:none !important; }
  }
  .df-inp::placeholder { color:#9898a8; font-size:12px; }
  .df-select { padding:11px 13px; border:1.5px solid rgba(0,0,0,0.08); background:#fafafa; font-family:'Jost',sans-serif; font-size:13px; color:#181820; outline:none; transition:border-color .2s; width:100%; border-radius:2px; appearance:none; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239898a8' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 13px center; box-sizing:border-box; }
  .df-select:focus { border-color:#E8405A; }

  /* Saved addresses */
  .df-saved-list { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
  .df-saved-title { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; color:#9898a8; margin-bottom:8px; }
  .df-saved-card { display:flex; align-items:flex-start; justify-content:space-between; padding:12px 14px; background:rgba(46,170,104,.04); border:1px solid rgba(46,170,104,.15); border-radius:3px; gap:10px; cursor:pointer; transition:border-color .2s; }
  .df-saved-card:hover { border-color:rgba(46,170,104,.4); }
  .df-saved-card.selected { border-color:#2eaa68; background:rgba(46,170,104,.08); }
  .df-saved-text { font-size:12px; font-weight:300; color:#444450; flex:1; line-height:1.6; }
  .df-saved-name { font-weight:400; color:#181820; }
  .df-saved-use { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.16em; text-transform:uppercase; color:#2eaa68; background:none; border:none; cursor:pointer; white-space:nowrap; padding:0; }
  .df-saved-del { font-size:11px; color:#c0c0d0; background:none; border:none; cursor:pointer; padding:0; margin-left:4px; }
  .df-saved-del:hover { color:#E8405A; }
  .df-or-divider { text-align:center; font-size:10px; color:#9898a8; letter-spacing:.14em; text-transform:uppercase; margin:12px 0 16px; }

  /* Shipping */
  .df-ship-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; }
  .df-ship-opt { display:flex; align-items:center; gap:14px; padding:14px 16px; border:1.5px solid rgba(0,0,0,0.08); border-radius:3px; cursor:pointer; transition:all .2s; background:#fafafa; }
  .df-ship-opt:hover { border-color:#9898a8; }
  .df-ship-opt.sel { border-color:#E8405A; background:#fde8f0; }
  .df-ship-radio { width:16px; height:16px; border-radius:50%; border:1.5px solid rgba(0,0,0,0.08); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:border-color .18s; }
  .df-ship-opt.sel .df-ship-radio { border-color:#E8405A; }
  .df-ship-radio::after { content:''; width:8px; height:8px; border-radius:50%; background:#E8405A; opacity:0; transition:opacity .18s; }
  .df-ship-opt.sel .df-ship-radio::after { opacity:1; }
  .df-ship-info { flex:1; }
  .df-ship-label { font-size:12px; font-weight:400; color:#181820; }
  .df-ship-days  { font-size:10px; font-weight:300; color:#9898a8; margin-top:2px; }
  .df-ship-price { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:400; color:#181820; }
  .df-ship-price.free { color:#2eaa68; font-size:13px; font-family:'Jost',sans-serif; letter-spacing:.1em; }

  /* Nav */
  .df-nav { display:flex; gap:12px; margin-top:24px; }
  .df-btn-primary { font-family:'Jost',sans-serif; font-size:10px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; padding:13px 28px; background:#181820; color:#fff; border:1.5px solid #181820; cursor:pointer; transition:all .25s; display:inline-flex; align-items:center; gap:8px; border-radius:3px; }
  .df-btn-primary:hover { background:#E8405A; border-color:#E8405A; }
  .df-btn-secondary { font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; padding:13px 22px; background:transparent; color:#9898a8; border:1.5px solid rgba(0,0,0,0.08); cursor:pointer; transition:all .25s; border-radius:3px; }
  .df-btn-secondary:hover { border-color:#181820; color:#181820; }
`;
