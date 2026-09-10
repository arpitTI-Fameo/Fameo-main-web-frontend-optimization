// // "use client";
// // // app/admin/notifications/page.js
// // import { useState, useEffect } from "react";
// // const MODULES = ["Creator Foundations","Content Creation System","Studio & Team Setup","Platform Growth & Algorithms","Collabs & Community","Monetization & Brand Deals","Creator Operations & Legal","Scaling & Career Growth"];
// // const EMPTY = { title:"", body:"", type:"newContent", audience:"all", moduleId:null };

// // export default function NotificationsPage() {
// //   const [sent, setSent]       = useState([]);
// //   const [form, setForm]       = useState(EMPTY);
// //   const [sending, setSending] = useState(false);
// //   const [notif, setNotif]     = useState(null);

// //   useEffect(() => {
// //     fetch("/api/admin/notifications").then(r=>r.json()).then(d=>setSent(d.data||[]))
// //       .catch(()=>setSent([
// //         { _id:"n1", title:"New module dropped: Scaling & Career Growth", type:"newContent",      audience:"all",             sentAt:new Date(Date.now()-86400000).toISOString(),  openRate:34 },
// //         { _id:"n2", title:"Brand Deal template pack now live",           type:"product",         audience:"moduleFollowers",  sentAt:new Date(Date.now()-172800000).toISOString(), openRate:28 },
// //         { _id:"n3", title:"Platform update: Q&A now available",          type:"platformUpdate",  audience:"all",             sentAt:new Date(Date.now()-259200000).toISOString(), openRate:41 },
// //       ]));
// //   },[]);

// //   const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null),3000); };

// //   const send = async () => {
// //     if (!form.title || !form.body) return alert("Title and body required");
// //     setSending(true);
// //     try {
// //       const res  = await fetch("/api/admin/notifications", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
// //       const data = await res.json();
// //       setSent(prev=>[data.data,...prev]);
// //       setForm(EMPTY);
// //       showNotif("Notification sent to learners ◉");
// //     } catch { showNotif("Send failed"); }
// //     setSending(false);
// //   };

// //   const TYPE_COLOR = { newContent:"#7eb8d8", product:"#C9A96E", platformUpdate:"#b89fd4" };

// //   return (
// //     <div style={S.page}>
// //       {notif && <div style={S.toast}>{notif}</div>}
// //       <div style={S.header}>
// //         <h1 style={S.heading}>Notifications</h1>
// //         <p style={S.sub}>Broadcast messages to all learners or module followers.</p>
// //       </div>

// //       <div style={S.layout}>
// //         {/* Compose */}
// //         <div style={S.compose}>
// //           <h2 style={S.composeTitle}>New Notification</h2>
// //           <label style={S.label}>Title</label>
// //           <input style={S.input} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Notification title…"/>
// //           <label style={{...S.label,marginTop:14}}>Body</label>
// //           <textarea style={S.textarea} value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="Message body…" rows={4}/>
// //           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
// //             <div>
// //               <label style={S.label}>Type</label>
// //               <select style={S.select} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
// //                 <option value="newContent">New Content</option>
// //                 <option value="product">Product</option>
// //                 <option value="platformUpdate">Platform Update</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label style={S.label}>Audience</label>
// //               <select style={S.select} value={form.audience} onChange={e=>setForm(f=>({...f,audience:e.target.value}))}>
// //                 <option value="all">All Learners</option>
// //                 <option value="moduleFollowers">Module Followers</option>
// //                 <option value="activeOnly">Active Only</option>
// //               </select>
// //             </div>
// //           </div>
// //           {form.audience==="moduleFollowers" && (
// //             <div style={{marginTop:12}}>
// //               <label style={S.label}>Module</label>
// //               <select style={S.select} value={form.moduleId||""} onChange={e=>setForm(f=>({...f,moduleId:parseInt(e.target.value)}))}>
// //                 <option value="">Select module…</option>
// //                 {MODULES.map((m,i)=><option key={i} value={i}>{m}</option>)}
// //               </select>
// //             </div>
// //           )}
// //           <button onClick={send} disabled={sending} style={S.sendBtn}>{sending?"Sending…":"◉ Send Notification"}</button>
// //         </div>

// //         {/* History */}
// //         <div style={S.history}>
// //           <h2 style={S.composeTitle}>Sent Notifications</h2>
// //           {sent.length===0 ? <p style={{fontSize:13,color:"#bbb",textAlign:"center",paddingTop:40}}>No notifications sent yet</p> :
// //            sent.map(n=>(
// //              <div key={n._id} style={S.sentCard}>
// //                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
// //                  <span style={{...S.typeDot, background:(TYPE_COLOR[n.type]||"#aaa")+"22", color:TYPE_COLOR[n.type]||"#aaa"}}>{n.type}</span>
// //                  <span style={{fontSize:10,color:"#bbb"}}>{timeAgo(n.sentAt)}</span>
// //                </div>
// //                <p style={S.sentTitle}>{n.title}</p>
// //                <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
// //                  <span style={{fontSize:10,color:"#bbb"}}>{n.audience}</span>
// //                  <span style={{fontSize:11,color:"#7ec87e",fontWeight:500}}>{n.openRate}% opened</span>
// //                </div>
// //              </div>
// //            ))
// //           }
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // function timeAgo(iso){const d=Math.floor((Date.now()-new Date(iso))/60000);if(d<60)return `${d}m ago`;if(d<1440)return `${Math.floor(d/60)}h ago`;return `${Math.floor(d/1440)}d ago`;}
// // const S={
// //   page:{padding:"32px 40px",maxWidth:1100,margin:"0 auto",fontFamily:"'DM Sans',sans-serif"},
// //   toast:{position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,background:"#7ec87e"},
// //   header:{marginBottom:28},
// //   heading:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4},
// //   sub:{fontSize:13,color:"#aaa"},
// //   layout:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24},
// //   compose:{background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"24px"},
// //   composeTitle:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,color:"#1a1208",marginBottom:16},
// //   label:{display:"block",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:6},
// //   input:{width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",fontFamily:"'DM Sans',sans-serif"},
// //   textarea:{width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",resize:"vertical",fontFamily:"'DM Sans',sans-serif"},
// //   select:{width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif"},
// //   sendBtn:{marginTop:16,width:"100%",fontSize:12,letterSpacing:".08em",textTransform:"uppercase",padding:"11px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500},
// //   history:{background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"24px"},
// //   sentCard:{padding:"14px 0",borderBottom:"1px solid #f5f5f2"},
// //   typeDot:{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,fontWeight:600},
// //   sentTitle:{fontSize:13,fontWeight:400,color:"#1a1208"},
// // };

// "use client";
// // app/admin/notifications/page.js

// import { useState, useEffect, useCallback } from "react";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";

// const MODULES = [
//   "Creator Foundations", "Content Creation System", "Studio & Team Setup",
//   "Platform Growth & Algorithms", "Collabs & Community", "Monetization & Brand Deals",
//   "Creator Operations & Legal", "Scaling & Career Growth",
// ];
// const EMPTY = { title: "", body: "", type: "newContent", audience: "all", moduleId: null };
// const TYPE_COLOR = { newContent: "#7eb8d8", product: "#C9A96E", platformUpdate: "#b89fd4" };

// function timeAgo(iso) {
//   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
//   if (d < 60) return `${d}m ago`;
//   if (d < 1440) return `${Math.floor(d / 60)}h ago`;
//   return `${Math.floor(d / 1440)}d ago`;
// }

// export default function NotificationsPage() {
//   const { user }  = useAdminAuthStore();
//   const [sent, setSent]       = useState([]);
//   const [form, setForm]       = useState(EMPTY);
//   const [sending, setSending] = useState(false);
//   const [toast, setToast]     = useState(null);

//   const showToast = (msg, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const loadNotifications = useCallback(async () => {
//     try {
//       const data = await api.get("/admin/notifications");
//       setSent(data?.data?.notifications || data?.data || []);
//     } catch {
//       setSent([
//         { _id: "n1", title: "New module dropped: Scaling & Career Growth", type: "newContent",     audience: "all",            sentAt: new Date(Date.now()-86400000).toISOString(),  openRate: 34 },
//         { _id: "n2", title: "Brand Deal template pack now live",           type: "product",        audience: "moduleFollowers", sentAt: new Date(Date.now()-172800000).toISOString(), openRate: 28 },
//         { _id: "n3", title: "Platform update: Q&A now available",          type: "platformUpdate", audience: "all",            sentAt: new Date(Date.now()-259200000).toISOString(), openRate: 41 },
//       ]);
//     }
//   }, []);

//   useEffect(() => { loadNotifications(); }, [loadNotifications]);

//   // Live — refresh when another admin sends a notification
//   useSocket({ "notification:sent": loadNotifications });

//   const send = async () => {
//     if (!form.title || !form.body) return alert("Title and body required");
//     setSending(true);
//     try {
//       const data = await api.post("/notifications", form);
//       if (data?.data) setSent(prev => [data.data, ...prev]);
//       setForm(EMPTY);
//       showToast("Notification sent to learners ◉");
//     } catch { showToast("Send failed", false); }
//     setSending(false);
//   };

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   return (
//     <div style={S.page}>
//       {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

//       <div style={S.header}>
//         <h1 style={S.heading}>Notifications</h1>
//         <p style={S.sub}>Broadcast messages to all learners or module followers.</p>
//       </div>

//       <div style={S.layout}>
//         {/* Compose */}
//         <div style={S.compose}>
//           <h2 style={S.composeTitle}>New Notification</h2>

//           <label style={S.label}>Title</label>
//           <input style={S.input} value={form.title} onChange={e => set("title", e.target.value)}
//             placeholder="Notification title…" />

//           <label style={{ ...S.label, marginTop: 14 }}>Body</label>
//           <textarea style={S.textarea} value={form.body} onChange={e => set("body", e.target.value)}
//             placeholder="Message body…" rows={4} />

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
//             <div>
//               <label style={S.label}>Type</label>
//               <select style={S.select} value={form.type} onChange={e => set("type", e.target.value)}>
//                 <option value="newContent">New Content</option>
//                 <option value="product">Product</option>
//                 <option value="platformUpdate">Platform Update</option>
//               </select>
//             </div>
//             <div>
//               <label style={S.label}>Audience</label>
//               <select style={S.select} value={form.audience} onChange={e => set("audience", e.target.value)}>
//                 <option value="all">All Learners</option>
//                 <option value="moduleFollowers">Module Followers</option>
//                 <option value="activeOnly">Active Only</option>
//               </select>
//             </div>
//           </div>

//           {form.audience === "moduleFollowers" && (
//             <div style={{ marginTop: 12 }}>
//               <label style={S.label}>Module</label>
//               <select style={S.select} value={form.moduleId || ""} onChange={e => set("moduleId", parseInt(e.target.value))}>
//                 <option value="">Select module…</option>
//                 {MODULES.map((m, i) => <option key={i} value={i}>{m}</option>)}
//               </select>
//             </div>
//           )}

//           <button onClick={send} disabled={sending} style={{ ...S.sendBtn, opacity: sending ? 0.7 : 1 }}>
//             {sending ? "Sending…" : "◉ Send Notification"}
//           </button>
//         </div>

//         {/* History */}
//         <div style={S.history}>
//           <h2 style={S.composeTitle}>Sent Notifications</h2>
//           {sent.length === 0 ? (
//             <p style={{ fontSize: 13, color: "#bbb", textAlign: "center", paddingTop: 40 }}>No notifications sent yet</p>
//           ) : sent.map(n => (
//             <div key={n._id} style={S.sentCard}>
//               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
//                 <span style={{ ...S.typeDot, background: (TYPE_COLOR[n.type] || "#aaa") + "22", color: TYPE_COLOR[n.type] || "#aaa" }}>
//                   {n.type}
//                 </span>
//                 <span style={{ fontSize: 10, color: "#bbb" }}>{timeAgo(n.sentAt)}</span>
//               </div>
//               <p style={S.sentTitle}>{n.title}</p>
//               {n.body && <p style={{ fontSize: 12, color: "#888", marginTop: 4, lineHeight: 1.5 }}>{n.body}</p>}
//               <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
//                 <span style={{ fontSize: 10, color: "#bbb" }}>{n.audience}</span>
//                 {n.openRate != null && (
//                   <span style={{ fontSize: 11, color: "#7ec87e", fontWeight: 500 }}>{n.openRate}% opened</span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const S = {
//   page:        { padding: "32px 40px", maxWidth: 1100, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
//   toast:       { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
//   header:      { marginBottom: 28 },
//   heading:     { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
//   sub:         { fontSize: 13, color: "#aaa" },
//   layout:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
//   compose:     { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "24px" },
//   composeTitle:{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: "#1a1208", marginBottom: 16 },
//   label:       { display: "block", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 },
//   input:       { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", fontFamily: "'DM Sans',sans-serif" },
//   textarea:    { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", resize: "vertical", fontFamily: "'DM Sans',sans-serif" },
//   select:      { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif" },
//   sendBtn:     { marginTop: 16, width: "100%", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", padding: "11px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, transition: "opacity .2s" },
//   history:     { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "24px", overflowY: "auto", maxHeight: 600 },
//   sentCard:    { padding: "14px 0", borderBottom: "1px solid #f5f5f2" },
//   typeDot:     { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 3, fontWeight: 600 },
//   sentTitle:   { fontSize: 13, fontWeight: 400, color: "#1a1208" },
// };

"use client";
// app/admin/notifications/page.js

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

const MODULES = [
  "Creator Foundations", "Content Creation System", "Studio & Team Setup",
  "Platform Growth & Algorithms", "Collabs & Community", "Monetization & Brand Deals",
  "Creator Operations & Legal", "Scaling & Career Growth",
];
const EMPTY = { title: "", body: "", type: "newContent", audience: "all", moduleId: null };
const TYPE_COLOR = { newContent: "#7eb8d8", product: "#C9A96E", platformUpdate: "#b89fd4" };

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
}

export default function NotificationsPage() {
  const { user }  = useAdminAuthStore();
  const [sent, setSent]       = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadNotifications = useCallback(async () => {
    try {
      const data = await api.get("/admin/notifications");
      setSent(data?.data?.notifications || data?.data || []);
    } catch {
      setSent([
        { _id: "n1", title: "New module dropped: Scaling & Career Growth", type: "newContent",     audience: "all",            sentAt: new Date(Date.now()-86400000).toISOString(),  openRate: 34 },
        { _id: "n2", title: "Brand Deal template pack now live",           type: "product",        audience: "moduleFollowers", sentAt: new Date(Date.now()-172800000).toISOString(), openRate: 28 },
        { _id: "n3", title: "Platform update: Q&A now available",          type: "platformUpdate", audience: "all",            sentAt: new Date(Date.now()-259200000).toISOString(), openRate: 41 },
      ]);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  // Live — refresh when another admin sends a notification
  useSocket({ "notification:sent": loadNotifications });

  const send = async () => {
    if (!form.title || !form.body) return alert("Title and body required");
    setSending(true);
    try {
      const data = await api.post("/notifications", form);
      if (data?.data) setSent(prev => [data.data, ...prev]);
      setForm(EMPTY);
      showToast("Notification sent to learners ◉");
    } catch { showToast("Send failed", false); }
    setSending(false);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <div style={S.header}>
        <h1 style={S.heading}>Notifications</h1>
        <p style={S.sub}>Broadcast messages to all learners or module followers.</p>
      </div>

      <div style={S.layout}>
        {/* Compose */}
        <div style={S.compose}>
          <h2 style={S.composeTitle}>New Notification</h2>

          <label style={S.label}>Title</label>
          <input style={S.input} value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="Notification title…" />

          <label style={{ ...S.label, marginTop: 14 }}>Body</label>
          <textarea style={S.textarea} value={form.body} onChange={e => set("body", e.target.value)}
            placeholder="Message body…" rows={4} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
            <div>
              <label style={S.label}>Type</label>
              <select style={S.select} value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="newContent">New Content</option>
                <option value="product">Product</option>
                <option value="platformUpdate">Platform Update</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Audience</label>
              <select style={S.select} value={form.audience} onChange={e => set("audience", e.target.value)}>
                <option value="all">All Learners</option>
                <option value="moduleFollowers">Module Followers</option>
                <option value="activeOnly">Active Only</option>
              </select>
            </div>
          </div>

          {form.audience === "moduleFollowers" && (
            <div style={{ marginTop: 12 }}>
              <label style={S.label}>Module</label>
              <select style={S.select} value={form.moduleId || ""} onChange={e => set("moduleId", parseInt(e.target.value))}>
                <option value="">Select module…</option>
                {MODULES.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
          )}

          <button onClick={send} disabled={sending} style={{ ...S.sendBtn, opacity: sending ? 0.7 : 1 }}>
            {sending ? "Sending…" : "◉ Send Notification"}
          </button>
        </div>

        {/* History */}
        <div style={S.history}>
          <h2 style={S.composeTitle}>Sent Notifications</h2>
          {sent.length === 0 ? (
            <p style={{ fontSize: 13, color: "#bbb", textAlign: "center", paddingTop: 40 }}>No notifications sent yet</p>
          ) : sent.map(n => (
            <div key={n._id} style={S.sentCard}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ ...S.typeDot, background: (TYPE_COLOR[n.type] || "#aaa") + "22", color: TYPE_COLOR[n.type] || "#aaa" }}>
                  {n.type}
                </span>
                <span style={{ fontSize: 10, color: "#bbb" }}>{timeAgo(n.sentAt)}</span>
              </div>
              <p style={S.sentTitle}>{n.title}</p>
              {n.body && <p style={{ fontSize: 12, color: "#888", marginTop: 4, lineHeight: 1.5 }}>{n.body}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10, color: "#bbb" }}>{n.audience}</span>
                {n.openRate != null && (
                  <span style={{ fontSize: 11, color: "#7ec87e", fontWeight: 500 }}>{n.openRate}% opened</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page:        { padding: "32px 40px", maxWidth: 1100, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
  toast:       { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
  header:      { marginBottom: 28 },
  heading:     { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
  sub:         { fontSize: 13, color: "#aaa" },
  layout:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  compose:     { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "24px" },
  composeTitle:{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: "#1a1208", marginBottom: 16 },
  label:       { display: "block", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 },
  input:       { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", fontFamily: "'DM Sans',sans-serif" },
  textarea:    { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", resize: "vertical", fontFamily: "'DM Sans',sans-serif" },
  select:      { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif" },
  sendBtn:     { marginTop: 16, width: "100%", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", padding: "11px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, transition: "opacity .2s" },
  history:     { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "24px", overflowY: "auto", maxHeight: 600 },
  sentCard:    { padding: "14px 0", borderBottom: "1px solid #f5f5f2" },
  typeDot:     { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 3, fontWeight: 600 },
  sentTitle:   { fontSize: 13, fontWeight: 400, color: "#1a1208" },
};