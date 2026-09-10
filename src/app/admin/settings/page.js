// "use client";
// // app/admin/settings/page.js
// import { useState, useEffect } from "react";
// import { useAuthStore } from "@/store/authStore";
// import { useRouter } from "next/navigation";

// const FLAG_META = {
//   progressTracking:        { label:"Progress Tracking",         desc:"Learners can mark topics complete and track completion %" },
//   moduleFollowing:         { label:"Module Following",           desc:"Learners can follow specific modules to get notifications" },
//   qaComments:              { label:"Q&A Comments",              desc:"Show Q&A section at the bottom of every topic article" },
//   shopAndCTAs:             { label:"Shop & Product CTAs",       desc:"Show product call-to-action cards linked in topic articles" },
//   contentApprovalWorkflow: { label:"Approval Workflow",         desc:"Module masters must submit for review before publishing" },
//   moduleGlossary:          { label:"Module Glossary",           desc:"Show glossary of terms on each module page" },
//   liveSessionScheduling:   { label:"Live Session Scheduling",   desc:"Module masters can schedule and broadcast live sessions" },
//   learnerRegistration:     { label:"Learner Registration",      desc:"New learners can register on the platform" },
// };

// export default function SettingsPage() {
//   const { user } = useAuthStore();
//   const router   = useRouter();
//   const [flags, setFlags]       = useState({});
//   const [integrations, setInteg]= useState({});
//   const [loading, setLoading]   = useState(true);
//   const [saving, setSaving]     = useState({});
//   const [notif, setNotif]       = useState(null);

//   useEffect(() => {
//     if (user && user.role !== "superAdmin") { router.push("/admin"); return; }
//     fetch("/api/admin/settings").then(r=>r.json())
//       .then(d=>{ setFlags(d.data?.features||{}); setInteg(d.data?.integrations||{}); })
//       .catch(()=>{
//         setFlags({ progressTracking:true,moduleFollowing:true,qaComments:true,shopAndCTAs:true,contentApprovalWorkflow:true,moduleGlossary:false,liveSessionScheduling:false,learnerRegistration:true });
//         setInteg({ razorpay:{connected:true,keyId:"rzp_live_xxx"},cloudflareR2:{connected:true,bucketName:"fameo-media"},sendgrid:{connected:false,apiKey:""},firebase:{connected:true} });
//       })
//       .finally(()=>setLoading(false));
//   },[user,router]);

//   if (user?.role !== "superAdmin") return null;

//   const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null),3000); };

//   const toggleFlag = async (key) => {
//     const next = { ...flags, [key]:!flags[key] };
//     setFlags(next);
//     setSaving(s=>({...s,[key]:true}));
//     try {
//       await fetch("/api/admin/settings/features", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({[key]:next[key]}) });
//       showNotif(`${FLAG_META[key]?.label} ${next[key]?"enabled":"disabled"} — live instantly`);
//     } catch { showNotif("Save failed"); }
//     setSaving(s=>({...s,[key]:false}));
//   };

//   const INTEG_LABELS = { razorpay:"Razorpay Payments", cloudflareR2:"Cloudflare R2 Storage", sendgrid:"SendGrid Email", firebase:"Firebase Auth" };

//   return (
//     <div style={S.page}>
//       {notif && <div style={S.toast}>{notif}</div>}
//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Platform Settings</h1>
//           <p style={S.sub}>Feature flags and integrations. Changes go live immediately to all learners.</p>
//         </div>
//         <span style={S.saOnly}>◈ Super Admin Only</span>
//       </div>

//       {loading ? <div style={S.empty}>Loading…</div> : <>
//         {/* Feature Flags */}
//         <div style={S.section}>
//           <h2 style={S.sectionTitle}>Feature Flags</h2>
//           <p style={S.sectionSub}>Toggle any flag — learners on active sessions see the change within ~1 second.</p>
//           <div style={S.flagsGrid}>
//             {Object.entries(FLAG_META).map(([key, meta])=>(
//               <div key={key} style={S.flagRow}>
//                 <div style={{flex:1}}>
//                   <p style={S.flagLabel}>{meta.label}</p>
//                   <p style={S.flagDesc}>{meta.desc}</p>
//                 </div>
//                 <div style={S.toggleWrap}>
//                   {saving[key] && <span style={S.savingDot}>…</span>}
//                   <button onClick={()=>toggleFlag(key)} style={{...S.toggle, background:flags[key]?"#C9A96E":"#e0e0dc"}}>
//                     <span style={{...S.toggleThumb, transform:flags[key]?"translateX(18px)":"translateX(2px)"}}/>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Integrations */}
//         <div style={S.section}>
//           <h2 style={S.sectionTitle}>Integrations</h2>
//           <div style={S.integGrid}>
//             {Object.entries(INTEG_LABELS).map(([key,label])=>{
//               const cfg = integrations[key]||{};
//               return (
//                 <div key={key} style={S.integCard}>
//                   <div style={S.integTop}>
//                     <span style={S.integLabel}>{label}</span>
//                     <span style={{...S.integStatus, color:cfg.connected?"#3a7c3a":"#d49090", background:cfg.connected?"#7ec87e18":"#d4909018"}}>
//                       {cfg.connected?"Connected":"Not connected"}
//                     </span>
//                   </div>
//                   {cfg.keyId && <p style={S.integDetail}>Key: {cfg.keyId.slice(0,12)}…</p>}
//                   {cfg.bucketName && <p style={S.integDetail}>Bucket: {cfg.bucketName}</p>}
//                   <button style={S.integBtn}>{cfg.connected?"Reconfigure":"Connect"}</button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </>}
//     </div>
//   );
// }

// const S = {
//   page:    { padding:"32px 40px",maxWidth:1000,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
//   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,background:"#7ec87e",maxWidth:340 },
//   header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32 },
//   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
//   sub:     { fontSize:13,color:"#aaa" },
//   saOnly:  { fontSize:10,letterSpacing:".1em",textTransform:"uppercase",padding:"5px 12px",background:"#C9A96E18",color:"#C9A96E",border:"1px solid #C9A96E44",borderRadius:4,fontWeight:500,flexShrink:0 },
//   section: { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"24px",marginBottom:20 },
//   sectionTitle:{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:400,color:"#1a1208",marginBottom:4 },
//   sectionSub:{ fontSize:12,color:"#aaa",marginBottom:20 },
//   flagsGrid:{ display:"flex",flexDirection:"column",gap:0 },
//   flagRow: { display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,padding:"14px 0",borderBottom:"1px solid #f5f5f2" },
//   flagLabel:{ fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:2 },
//   flagDesc: { fontSize:11,color:"#bbb" },
//   toggleWrap:{ display:"flex",alignItems:"center",gap:8,flexShrink:0 },
//   savingDot:{ fontSize:11,color:"#bbb" },
//   toggle:  { width:38,height:22,borderRadius:11,border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0 },
//   toggleThumb:{ position:"absolute",top:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"transform .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)" },
//   integGrid:{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 },
//   integCard:{ border:"1.5px solid #ededea",borderRadius:8,padding:"16px" },
//   integTop:{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 },
//   integLabel:{ fontSize:13,fontWeight:500,color:"#1a1208" },
//   integStatus:{ fontSize:9,letterSpacing:".08em",textTransform:"uppercase",padding:"3px 8px",borderRadius:3,fontWeight:600 },
//   integDetail:{ fontSize:11,color:"#aaa",marginBottom:4,fontFamily:"monospace" },
//   integBtn:{ fontSize:10,letterSpacing:".06em",textTransform:"uppercase",padding:"6px 14px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",cursor:"pointer",marginTop:8,color:"#555" },
//   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// };

"use client";
// app/admin/settings/page.js
import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore"
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

const FLAG_META = {
  progressTracking:        { label:"Progress Tracking",         desc:"Learners can mark topics complete and track completion %" },
  moduleFollowing:         { label:"Module Following",           desc:"Learners can follow specific modules to get notifications" },
  qaComments:              { label:"Q&A Comments",              desc:"Show Q&A section at the bottom of every topic article" },
  shopAndCTAs:             { label:"Shop & Product CTAs",       desc:"Show product call-to-action cards linked in topic articles" },
  contentApprovalWorkflow: { label:"Approval Workflow",         desc:"Module masters must submit for review before publishing" },
  moduleGlossary:          { label:"Module Glossary",           desc:"Show glossary of terms on each module page" },
  liveSessionScheduling:   { label:"Live Session Scheduling",   desc:"Module masters can schedule and broadcast live sessions" },
  learnerRegistration:     { label:"Learner Registration",      desc:"New learners can register on the platform" },
};

export default function SettingsPage() {
  const { user } = useAdminAuthStore();
  const router   = useRouter();
  const [flags, setFlags]       = useState({});
  const [integrations, setInteg]= useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState({});
  const [notif, setNotif]       = useState(null);

  useEffect(() => {
    if (user && user.role !== "superAdmin") { router.push("/admin"); return; }
    api.get("/admin/settings")
      .then(d=>{ setFlags(d.data?.features||{}); setInteg(d.data?.integrations||{}); })
      .catch(()=>{
        setFlags({ progressTracking:true,moduleFollowing:true,qaComments:true,shopAndCTAs:true,contentApprovalWorkflow:true,moduleGlossary:false,liveSessionScheduling:false,learnerRegistration:true });
        setInteg({ razorpay:{connected:true,keyId:"rzp_live_xxx"},cloudflareR2:{connected:true,bucketName:"fameo-media"},sendgrid:{connected:false,apiKey:""},firebase:{connected:true} });
      })
      .finally(()=>setLoading(false));
  },[user,router]);

  if (user?.role !== "superAdmin") return null;

  const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null),3000); };

  const toggleFlag = async (key) => {
    const next = { ...flags, [key]:!flags[key] };
    setFlags(next);
    setSaving(s=>({...s,[key]:true}));
    try {
      await api.patch("/admin/settings/features", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({[key]:next[key]}) });
      showNotif(`${FLAG_META[key]?.label} ${next[key]?"enabled":"disabled"} — live instantly`);
    } catch { showNotif("Save failed"); }
    setSaving(s=>({...s,[key]:false}));
  };

  const INTEG_LABELS = { razorpay:"Razorpay Payments", cloudflareR2:"Cloudflare R2 Storage", sendgrid:"SendGrid Email", firebase:"Firebase Auth" };

  return (
    <div style={S.page}>
      {notif && <div style={S.toast}>{notif}</div>}
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Platform Settings</h1>
          <p style={S.sub}>Feature flags and integrations. Changes go live immediately to all learners.</p>
        </div>
        <span style={S.saOnly}>◈ Super Admin Only</span>
      </div>

      {loading ? <div style={S.empty}>Loading…</div> : <>
        {/* Feature Flags */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Feature Flags</h2>
          <p style={S.sectionSub}>Toggle any flag — learners on active sessions see the change within ~1 second.</p>
          <div style={S.flagsGrid}>
            {Object.entries(FLAG_META).map(([key, meta])=>(
              <div key={key} style={S.flagRow}>
                <div style={{flex:1}}>
                  <p style={S.flagLabel}>{meta.label}</p>
                  <p style={S.flagDesc}>{meta.desc}</p>
                </div>
                <div style={S.toggleWrap}>
                  {saving[key] && <span style={S.savingDot}>…</span>}
                  <button onClick={()=>toggleFlag(key)} style={{...S.toggle, background:flags[key]?"#C9A96E":"#e0e0dc"}}>
                    <span style={{...S.toggleThumb, transform:flags[key]?"translateX(18px)":"translateX(2px)"}}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Integrations</h2>
          <div style={S.integGrid}>
            {Object.entries(INTEG_LABELS).map(([key,label])=>{
              const cfg = integrations[key]||{};
              return (
                <div key={key} style={S.integCard}>
                  <div style={S.integTop}>
                    <span style={S.integLabel}>{label}</span>
                    <span style={{...S.integStatus, color:cfg.connected?"#3a7c3a":"#d49090", background:cfg.connected?"#7ec87e18":"#d4909018"}}>
                      {cfg.connected?"Connected":"Not connected"}
                    </span>
                  </div>
                  {cfg.keyId && <p style={S.integDetail}>Key: {cfg.keyId.slice(0,12)}…</p>}
                  {cfg.bucketName && <p style={S.integDetail}>Bucket: {cfg.bucketName}</p>}
                  <button style={S.integBtn}>{cfg.connected?"Reconfigure":"Connect"}</button>
                </div>
              );
            })}
          </div>
        </div>
      </>}
    </div>
  );
}

const S = {
  page:    { padding:"32px 40px",maxWidth:1000,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
  toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,background:"#7ec87e",maxWidth:340 },
  header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32 },
  heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
  sub:     { fontSize:13,color:"#aaa" },
  saOnly:  { fontSize:10,letterSpacing:".1em",textTransform:"uppercase",padding:"5px 12px",background:"#C9A96E18",color:"#C9A96E",border:"1px solid #C9A96E44",borderRadius:4,fontWeight:500,flexShrink:0 },
  section: { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"24px",marginBottom:20 },
  sectionTitle:{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:400,color:"#1a1208",marginBottom:4 },
  sectionSub:{ fontSize:12,color:"#aaa",marginBottom:20 },
  flagsGrid:{ display:"flex",flexDirection:"column",gap:0 },
  flagRow: { display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,padding:"14px 0",borderBottom:"1px solid #f5f5f2" },
  flagLabel:{ fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:2 },
  flagDesc: { fontSize:11,color:"#bbb" },
  toggleWrap:{ display:"flex",alignItems:"center",gap:8,flexShrink:0 },
  savingDot:{ fontSize:11,color:"#bbb" },
  toggle:  { width:38,height:22,borderRadius:11,border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0 },
  toggleThumb:{ position:"absolute",top:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"transform .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)" },
  integGrid:{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 },
  integCard:{ border:"1.5px solid #ededea",borderRadius:8,padding:"16px" },
  integTop:{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 },
  integLabel:{ fontSize:13,fontWeight:500,color:"#1a1208" },
  integStatus:{ fontSize:9,letterSpacing:".08em",textTransform:"uppercase",padding:"3px 8px",borderRadius:3,fontWeight:600 },
  integDetail:{ fontSize:11,color:"#aaa",marginBottom:4,fontFamily:"monospace" },
  integBtn:{ fontSize:10,letterSpacing:".06em",textTransform:"uppercase",padding:"6px 14px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",cursor:"pointer",marginTop:8,color:"#555" },
  empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
};