export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@200;300;400;500&display=swap');
  .sb-page { max-width:760px; margin:0 auto; padding:56px 24px 96px; font-family:'Jost',sans-serif; color:#181820; }
  .sb-h { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,42px); font-weight:300; margin-bottom:4px; }
  .sb-h em { font-style:italic; color:#e8457a; }
  .sb-sub { font-size:11px; font-weight:300; letter-spacing:.22em; text-transform:uppercase; color:#9898a8; margin-bottom:36px; }
 
  .sb-label { font-size:14px; font-weight:300; color:#6a6a78; margin:0 0 10px 2px; }
  .sb-card { border:1px solid rgba(0,0,0,.12); border-radius:6px; background:#fff; margin-bottom:30px; overflow:hidden; }
 
  .sb-plan { padding:22px 24px; display:flex; align-items:center; gap:14px; }
  .sb-plan-ico { font-size:26px; line-height:1; }
  .sb-plan-name { font-size:19px; font-weight:500; line-height:1.2; }
  .sb-plan-desc { font-size:13.5px; font-weight:300; color:#6a6a78; margin-top:3px; }
  .sb-badge { margin-left:auto; font-size:9px; font-weight:400; letter-spacing:.16em; text-transform:uppercase; padding:5px 11px; border-radius:20px; white-space:nowrap; }
  .sb-badge.on  { background:#e8f8f0; color:#2eaa68; }
  .sb-badge.off { background:#fdeef3; color:#e8457a; }
 
  .sb-row { display:flex; align-items:center; justify-content:space-between; gap:14px;
            padding:18px 24px; border-top:1px solid rgba(0,0,0,.09);
            font-size:15px; font-weight:400; background:none;
            border-left:none; border-right:none; border-bottom:none;
            width:100%; text-align:left; font-family:'Jost',sans-serif; color:#181820; }
  button.sb-row { cursor:pointer; transition:background .15s; }
  button.sb-row:hover { background:#faf8f9; }
  .sb-row .chev { color:#9898a8; font-size:17px; line-height:1; flex-shrink:0; }
  .sb-row.static { cursor:default; }
 
  .sb-next { padding:22px 24px; }
  .sb-next-t { font-size:16px; font-weight:500; margin-bottom:6px; }
  .sb-next-d { font-size:14.5px; font-weight:300; color:#3a3a44; }
  .sb-pay-line { display:flex; align-items:center; gap:10px; margin-top:12px; flex-wrap:wrap; }
  .sb-brand { font-size:10px; font-weight:500; letter-spacing:.08em; color:#1a1f71; background:#eef1fb; border:1px solid #d8def5; border-radius:3px; padding:3px 7px; }
  .sb-mask { font-size:14px; font-weight:400; letter-spacing:.04em; color:#3a3a44; }
  .sb-muted { font-size:13px; font-weight:300; color:#9898a8; }
 
  .sb-inv-wrap { border-top:1px solid rgba(0,0,0,.09); background:#fbfbfc; }
  .sb-inv { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:15px 24px; border-bottom:1px solid rgba(0,0,0,.05); }
  .sb-inv:last-child { border-bottom:none; }
  .sb-inv-l .d { font-size:14px; font-weight:400; }
  .sb-inv-l .n { font-size:11px; font-weight:300; color:#9898a8; margin-top:2px; letter-spacing:.03em; }
  .sb-inv-r { display:flex; align-items:center; gap:14px; flex-shrink:0; }
  .sb-inv-amt { font-size:14px; font-weight:400; }
  .sb-inv-st { font-size:9px; font-weight:400; letter-spacing:.12em; text-transform:uppercase; padding:3px 8px; border-radius:14px; background:#e8f8f0; color:#2eaa68; }
  .sb-inv-st.bad { background:#fdeef3; color:#e8457a; }
  .sb-inv-btn { font-size:10px; font-weight:400; letter-spacing:.14em; text-transform:uppercase; color:#e8457a; background:none; border:none; cursor:pointer; padding:0; font-family:'Jost',sans-serif; }
  .sb-inv-btn:hover { text-decoration:underline; }
  .sb-inv-empty { padding:22px 24px; font-size:13.5px; font-weight:300; color:#9898a8; }
 
  .sb-cancel { width:100%; padding:18px; border:1px solid rgba(0,0,0,.12); border-radius:6px; background:#fff;
               font-family:'Jost',sans-serif; font-size:15px; font-weight:400; color:#d0304f; cursor:pointer; transition:background .15s; }
  .sb-cancel:hover { background:#fdf3f5; }
  .sb-resume { width:100%; padding:18px; border:1px solid rgba(46,170,104,.4); border-radius:6px; background:#f2fbf6;
               font-family:'Jost',sans-serif; font-size:15px; font-weight:500; color:#1d7f4e; cursor:pointer; transition:background .15s; margin-bottom:14px; }
  .sb-resume:hover { background:#e7f7ee; }
  .sb-autorenew { display:flex; align-items:center; gap:16px; padding:18px 24px; border:1px solid rgba(0,0,0,.12);
                  border-radius:6px; background:#fff; margin-bottom:14px; }
  .sb-autorenew-txt { flex:1; min-width:0; }
  .sb-autorenew-ttl { font-size:15px; font-weight:400; color:#181820; }
  .sb-autorenew-sub { font-size:12.5px; font-weight:300; color:#6a6a78; margin-top:3px; line-height:1.45; }
  .sb-switch { flex:none; width:46px; height:26px; border-radius:20px; border:none; cursor:pointer; padding:0;
               background:#d8d8e0; position:relative; transition:background .2s; }
  .sb-switch.on { background:#2eaa68; }
  .sb-switch-knob { position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%;
                    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.3); transition:transform .2s; }
  .sb-switch.on .sb-switch-knob { transform:translateX(20px); }
 
  .sb-empty { text-align:center; padding:44px 24px; border:1px dashed rgba(0,0,0,.14); border-radius:6px; margin-bottom:30px; }
  .sb-empty p { font-size:14px; font-weight:300; color:#9898a8; margin-bottom:16px; }
 
  .btn { padding:11px 20px; border:1.5px solid; font-family:'Jost',sans-serif; font-size:10px; font-weight:400;
         letter-spacing:.18em; text-transform:uppercase; cursor:pointer; border-radius:3px; background:transparent; transition:all .2s; }
  .btn-dark { background:#181820; color:#fff; border-color:#181820; }
  .btn-dark:hover { background:#e8457a; border-color:#e8457a; }
  .btn-ghost { color:#181820; border-color:rgba(0,0,0,.16); }
  .btn-ghost:hover { border-color:#181820; }
  .btn-danger { color:#e8457a; border-color:rgba(232,69,122,.4); }
  .btn-danger:hover { background:#e8457a; color:#fff; border-color:#e8457a; }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
 
  .modal-bg { position:fixed; inset:0; background:rgba(20,20,28,.55); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
  .modal { background:#fff; border-radius:8px; max-width:440px; width:100%; padding:30px; }
  .modal h3 { font-family:'Cormorant Garamond',serif; font-size:25px; font-weight:400; margin-bottom:8px; }
  .modal p { font-size:13.5px; font-weight:300; color:#6a6a78; line-height:1.65; margin-bottom:22px; }
  .modal-row { display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
 
  .msg-err { padding:12px 16px; background:rgba(232,69,122,.06); border:1px solid rgba(232,69,122,.18); border-radius:4px; font-size:13.5px; color:#e8457a; margin-bottom:20px; }
  .msg-ok  { padding:12px 16px; background:#e8f8f0; border:1px solid #b0e8cc; border-radius:4px; font-size:13.5px; color:#2eaa68; margin-bottom:20px; }
  .loading { text-align:center; padding:60px; color:#9898a8; font-weight:300; }
 
  @media(max-width:520px){
    .sb-inv { flex-direction:column; align-items:flex-start; gap:8px; }
    .sb-inv-r { width:100%; justify-content:space-between; }
  }
`;
