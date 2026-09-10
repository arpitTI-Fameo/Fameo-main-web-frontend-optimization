export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
  .oc-wrap { text-align:center; padding:60px 0; animation:ocIn .6s ease; }
  @keyframes ocIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  .oc-icon { font-size:58px; margin-bottom:16px; }
  .oc-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,48px); font-weight:300; color:#181820; margin-bottom:6px; }
  .oc-title em { font-style:italic; color:#E8405A; }
  .oc-sub { font-family:'Jost',sans-serif; font-size:14px; font-weight:300; color:#9898a8; line-height:1.8; margin-bottom:6px; }
  .oc-id { font-family:'Jost',sans-serif; font-size:13px; font-weight:400; color:#E8405A; letter-spacing:.1em; margin-bottom:16px; }
  .oc-breakdown { display:inline-block; text-align:left; margin:0 auto 28px; border:1px solid rgba(0,0,0,.08); border-radius:3px; padding:16px 24px; min-width:280px; background:#fafafa; }
  .oc-brow { display:flex; justify-content:space-between; gap:40px; padding:5px 0; font-family:'Jost',sans-serif; font-size:12px; font-weight:300; color:#9898a8; border-bottom:1px solid rgba(0,0,0,.06); }
  .oc-brow span:last-child { color:#181820; }
  .oc-brow.discount span:last-child { color:#e8457a; }
  .oc-brow.total { font-weight:400; color:#181820; padding-top:8px; border-bottom:none; }
  .oc-brow.total span:last-child { font-family:'Cormorant Garamond',serif; font-size:22px; }
  .oc-savings-badge { display:inline-flex; align-items:center; gap:6px; margin-bottom:24px; padding:8px 16px; background:rgba(46,170,104,.08); border:1px solid rgba(46,170,104,.2); border-radius:20px; font-family:'Jost',sans-serif; font-size:11px; font-weight:300; color:#2eaa68; }
  .oc-ctas { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:32px; }
  .oc-btn-primary { font-family:'Jost',sans-serif; font-size:10px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; padding:13px 28px; background:#181820; color:#fff; border:1.5px solid #181820; cursor:pointer; transition:all .25s; display:inline-flex; align-items:center; gap:8px; border-radius:3px; text-decoration:none; }
  .oc-btn-primary:hover { background:#E8405A; border-color:#E8405A; }
  .oc-btn-secondary { font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; padding:13px 22px; background:transparent; color:#9898a8; border:1.5px solid rgba(0,0,0,0.08); cursor:pointer; transition:all .25s; border-radius:3px; text-decoration:none; display:inline-flex; align-items:center; }
  .oc-btn-secondary:hover { border-color:#181820; color:#181820; }
  .oc-delivery { display:inline-flex; align-items:center; gap:10px; padding:12px 20px; border:1px solid rgba(0,0,0,.08); border-radius:3px; background:#fafafa; font-family:'Jost',sans-serif; font-size:12px; font-weight:300; color:#9898a8; }
`;
