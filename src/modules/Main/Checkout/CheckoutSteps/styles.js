export const S = `
  .cs-wrap { display:flex; align-items:center; margin-bottom:40px; }
  .cs-step  { display:flex; align-items:center; gap:10px; flex:1; }
  .cs-num {
    width:28px; height:28px; border-radius:50%;
    border:1.5px solid rgba(0,0,0,0.08);
    display:flex; align-items:center; justify-content:center;
    font-family:'Jost',sans-serif; font-size:11px; font-weight:300;
    color:#9898a8; flex-shrink:0; transition:all .3s;
  }
  .cs-step.active .cs-num { background:#181820; color:#fff; border-color:#181820; }
  .cs-step.done   .cs-num { background:#E8405A; color:#fff; border-color:#E8405A; }
  .cs-label {
    font-family:'Jost',sans-serif; font-size:10px; font-weight:300;
    letter-spacing:.16em; text-transform:uppercase; color:#9898a8;
  }
  .cs-step.active .cs-label { color:#181820; font-weight:400; }
  .cs-step.done   .cs-label { color:#E8405A; }
  .cs-line { flex:1; height:1px; background:rgba(0,0,0,0.08); margin:0 10px; }
`;
