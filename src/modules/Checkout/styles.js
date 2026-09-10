export const S = `
  .chk-page { max-width:1160px; margin:0 auto; padding:40px 56px 80px; font-family:'Jost',sans-serif; background:#fff; min-height:100vh; }
  .chk-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,48px); font-weight:300; color:#181820; margin-bottom:4px; }
  .chk-title em { font-style:italic; color:#E8405A; }
  .chk-sub { font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; color:#9898a8; margin-bottom:32px; }
  .chk-body { display:grid; grid-template-columns:1fr 320px; gap:48px; align-items:start; }
  .chk-error { padding:10px 14px; background:rgba(232,64,90,.06); border:1px solid rgba(232,64,90,.25); border-radius:3px; font-size:12px; font-weight:300; color:#E8405A; margin-bottom:16px; }
  @media(max-width:900px) { .chk-page { padding:28px 20px 60px; } .chk-body { grid-template-columns:1fr; } }
`;
