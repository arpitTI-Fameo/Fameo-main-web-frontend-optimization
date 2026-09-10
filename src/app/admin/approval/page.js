// // "use client";
// // // app/admin/approvals/page.js

// // import { useState, useEffect } from "react";
// // import { useAuthStore } from "@/store/authStore";

// // const STATUS_TABS = ["pending", "approved", "rejected", "changesRequested"];

// // export default function ApprovalsPage() {
// //   const { user } = useAuthStore();
// //   const accent   = "#C9A96E";
// //   const [tab, setTab]         = useState("pending");
// //   const [items, setItems]     = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [notif, setNotif]     = useState(null);

// //   const fetch_ = async (status) => {
// //     setLoading(true);
// //     try {
// //       const res  = await fetch(`/api/admin/approvals?status=${status}`);
// //       const data = await res.json();
// //       setItems(data.data?.approvals || []);
// //     } catch {
// //       setItems([
// //         { _id: "a1", type: "topic",   title: "Reels Algorithm Deep Dive",      submittedByName: "Kiran M.",  submittedAt: new Date(Date.now()-3600000).toISOString(),  status: "pending" },
// //         { _id: "a2", type: "product", title: "Brand Deal Template Pack",       submittedByName: "Priya S.",  submittedAt: new Date(Date.now()-7200000).toISOString(),  status: "pending" },
// //         { _id: "a3", type: "topic",   title: "Instagram Growth Masterclass",   submittedByName: "Arjun R.",  submittedAt: new Date(Date.now()-10800000).toISOString(), status: "pending" },
// //         { _id: "a4", type: "media",   title: "Creator Studio Setup Guide.pdf", submittedByName: "Nisha K.",  submittedAt: new Date(Date.now()-14400000).toISOString(), status: "pending" },
// //       ]);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetch_(tab); }, [tab]);

// //   const showNotif = (msg, ok = true) => { setNotif({ msg, ok }); setTimeout(() => setNotif(null), 3000); };

// //   const review = async (id, status, notes = "") => {
// //     try {
// //       await fetch(`/api/admin/approvals/${id}`, {
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ status, notes }),
// //       });
// //       setItems(prev => prev.filter(i => i._id !== id));
// //       showNotif(status === "approved" ? "Approved — published live" : status === "rejected" ? "Rejected" : "Changes requested");
// //     } catch { showNotif("Action failed", false); }
// //   };

// //   const TYPE_COLOR = { topic: ["#7ec87e22","#3a7c3a"], product: ["#C9A96E22","#7a5a1a"], media: ["#7eb8d822","#1a4a7a"] };

// //   return (
// //     <div style={S.page}>
// //       {notif && <div style={{ ...S.toast, background: notif.ok ? "#7ec87e" : "#d49090" }}>{notif.msg}</div>}

// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Approvals</h1>
// //           <p style={S.sub}>Review and approve content submitted by module masters.</p>
// //         </div>
// //       </div>

// //       {/* Tabs */}
// //       <div style={S.tabRow}>
// //         {STATUS_TABS.map(t => (
// //           <button key={t} onClick={() => setTab(t)} style={{ ...S.tabBtn, borderBottom: tab===t ? `2px solid ${accent}` : "2px solid transparent", color: tab===t ? "#1a1208" : "#aaa", fontWeight: tab===t ? 500 : 400 }}>
// //             {t.charAt(0).toUpperCase() + t.slice(1).replace(/([A-Z])/g, " $1")}
// //           </button>
// //         ))}
// //       </div>

// //       {loading ? <div style={S.empty}>Loading…</div> :
// //        items.length === 0 ? <div style={S.empty}>No {tab} approvals</div> :
// //        <div style={S.list}>
// //          {items.map(item => {
// //            const [bg, color] = TYPE_COLOR[item.type] || ["#eee","#555"];
// //            return (
// //              <div key={item._id} style={S.card}>
// //                <div style={S.cardLeft}>
// //                  <span style={{ ...S.typePill, background: bg, color }}>{item.type}</span>
// //                  <div>
// //                    <p style={S.cardTitle}>{item.title}</p>
// //                    <p style={S.cardMeta}>Submitted by <strong>{item.submittedByName}</strong> · {timeAgo(item.submittedAt)}</p>
// //                    {item.notes && <p style={S.cardNotes}>Notes: {item.notes}</p>}
// //                  </div>
// //                </div>
// //                {tab === "pending" && (
// //                  <div style={S.cardActions}>
// //                    <button style={S.btnApprove} onClick={() => review(item._id, "approved")}>✓ Approve</button>
// //                    <button style={S.btnChanges} onClick={() => {
// //                      const n = prompt("What changes are needed?");
// //                      if (n) review(item._id, "changesRequested", n);
// //                    }}>Request Changes</button>
// //                    <button style={S.btnReject}  onClick={() => review(item._id, "rejected")}>✕ Reject</button>
// //                  </div>
// //                )}
// //                {tab !== "pending" && (
// //                  <span style={{ ...S.statusBadge, color: tab==="approved"?"#3a7c3a":tab==="rejected"?"#c44":accent }}>
// //                    {tab}
// //                  </span>
// //                )}
// //              </div>
// //            );
// //          })}
// //        </div>
// //       }
// //     </div>
// //   );
// // }

// // function timeAgo(iso) {
// //   const d = Math.floor((Date.now()-new Date(iso))/60000);
// //   if (d<1) return "just now"; if (d<60) return `${d}m ago`;
// //   if (d<1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
// // }

// // const S = {
// //   page:    { padding:"32px 40px", maxWidth:900, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
// //   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500 },
// //   header:  { marginBottom:24 },
// //   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
// //   sub:     { fontSize:13,color:"#aaa" },
// //   tabRow:  { display:"flex",borderBottom:"1px solid #ededea",marginBottom:24 },
// //   tabBtn:  { fontSize:12,padding:"10px 18px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s" },
// //   list:    { display:"flex",flexDirection:"column",gap:12 },
// //   card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16 },
// //   cardLeft:{ display:"flex",alignItems:"flex-start",gap:12,flex:1,minWidth:0 },
// //   typePill:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,fontWeight:600,flexShrink:0,marginTop:2 },
// //   cardTitle:{ fontSize:14,fontWeight:400,color:"#1a1208",marginBottom:3 },
// //   cardMeta: { fontSize:11,color:"#bbb" },
// //   cardNotes:{ fontSize:11,color:"#C9A96E",marginTop:4,fontStyle:"italic" },
// //   cardActions:{ display:"flex",gap:8,flexShrink:0 },
// //   btnApprove:{ fontSize:11,padding:"7px 14px",border:"1.5px solid #7ec87e44",background:"#7ec87e18",color:"#3a7c3a",borderRadius:6,cursor:"pointer",fontWeight:500 },
// //   btnChanges:{ fontSize:11,padding:"7px 14px",border:"1.5px solid #C9A96E44",background:"#C9A96E18",color:"#7a5a1a",borderRadius:6,cursor:"pointer" },
// //   btnReject: { fontSize:11,padding:"7px 14px",border:"1.5px solid #d4909044",background:"#d4909018",color:"#9a3030",borderRadius:6,cursor:"pointer" },
// //   statusBadge:{ fontSize:11,letterSpacing:".06em",fontWeight:500,textTransform:"uppercase",flexShrink:0 },
// //   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// // };
// "use client";
// // app/admin/approvals/page.js

// // import { useState, useEffect } from "react";
// // import { useAdminAuthStore } from "@/store/adminAuthStore"
// // import { api } from "@/services/api";

// // const STATUS_TABS = ["pending", "approved", "rejected", "changesRequested"];

// // export default function ApprovalsPage() {
// //   const { user } = useAdminAuthStore();
// //   const accent   = "#C9A96E";
// //   const [tab, setTab]         = useState("pending");
// //   const [items, setItems]     = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [notif, setNotif]     = useState(null);

// //   const fetch_ = async (status) => {
// //     setLoading(true);
// //     try {
// //       const res  = await fetch(`/api/admin/approvals?status=${status}`);
// //       const data = await res.json();
// //       setItems(data.data?.approvals || []);
// //     } catch {
// //       setItems([
// //         { _id: "a1", type: "topic",   title: "Reels Algorithm Deep Dive",      submittedByName: "Kiran M.",  submittedAt: new Date(Date.now()-3600000).toISOString(),  status: "pending" },
// //         { _id: "a2", type: "product", title: "Brand Deal Template Pack",       submittedByName: "Priya S.",  submittedAt: new Date(Date.now()-7200000).toISOString(),  status: "pending" },
// //         { _id: "a3", type: "topic",   title: "Instagram Growth Masterclass",   submittedByName: "Arjun R.",  submittedAt: new Date(Date.now()-10800000).toISOString(), status: "pending" },
// //         { _id: "a4", type: "media",   title: "Creator Studio Setup Guide.pdf", submittedByName: "Nisha K.",  submittedAt: new Date(Date.now()-14400000).toISOString(), status: "pending" },
// //       ]);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetch_(tab); }, [tab]);

// //   const showNotif = (msg, ok = true) => { setNotif({ msg, ok }); setTimeout(() => setNotif(null), 3000); };

// //   const review = async (id, status, notes = "") => {
// //     try {
// //       await api.patch(`/admin/approvals/${id}`, {
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ status, notes }),
// //       });
// //       setItems(prev => prev.filter(i => i._id !== id));
// //       showNotif(status === "approved" ? "Approved — published live" : status === "rejected" ? "Rejected" : "Changes requested");
// //     } catch { showNotif("Action failed", false); }
// //   };

// //   const TYPE_COLOR = { topic: ["#7ec87e22","#3a7c3a"], product: ["#C9A96E22","#7a5a1a"], media: ["#7eb8d822","#1a4a7a"] };

// //   return (
// //     <div style={S.page}>
// //       {notif && <div style={{ ...S.toast, background: notif.ok ? "#7ec87e" : "#d49090" }}>{notif.msg}</div>}

// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Approvals</h1>
// //           <p style={S.sub}>Review and approve content submitted by module masters.</p>
// //         </div>
// //       </div>

// //       {/* Tabs */}
// //       <div style={S.tabRow}>
// //         {STATUS_TABS.map(t => (
// //           <button key={t} onClick={() => setTab(t)} style={{ ...S.tabBtn, borderBottom: tab===t ? `2px solid ${accent}` : "2px solid transparent", color: tab===t ? "#1a1208" : "#aaa", fontWeight: tab===t ? 500 : 400 }}>
// //             {t.charAt(0).toUpperCase() + t.slice(1).replace(/([A-Z])/g, " $1")}
// //           </button>
// //         ))}
// //       </div>

// //       {loading ? <div style={S.empty}>Loading…</div> :
// //        items.length === 0 ? <div style={S.empty}>No {tab} approvals</div> :
// //        <div style={S.list}>
// //          {items.map(item => {
// //            const [bg, color] = TYPE_COLOR[item.type] || ["#eee","#555"];
// //            return (
// //              <div key={item._id} style={S.card}>
// //                <div style={S.cardLeft}>
// //                  <span style={{ ...S.typePill, background: bg, color }}>{item.type}</span>
// //                  <div>
// //                    <p style={S.cardTitle}>{item.title}</p>
// //                    <p style={S.cardMeta}>Submitted by <strong>{item.submittedByName}</strong> · {timeAgo(item.submittedAt)}</p>
// //                    {item.notes && <p style={S.cardNotes}>Notes: {item.notes}</p>}
// //                  </div>
// //                </div>
// //                {tab === "pending" && (
// //                  <div style={S.cardActions}>
// //                    <button style={S.btnApprove} onClick={() => review(item._id, "approved")}>✓ Approve</button>
// //                    <button style={S.btnChanges} onClick={() => {
// //                      const n = prompt("What changes are needed?");
// //                      if (n) review(item._id, "changesRequested", n);
// //                    }}>Request Changes</button>
// //                    <button style={S.btnReject}  onClick={() => review(item._id, "rejected")}>✕ Reject</button>
// //                  </div>
// //                )}
// //                {tab !== "pending" && (
// //                  <span style={{ ...S.statusBadge, color: tab==="approved"?"#3a7c3a":tab==="rejected"?"#c44":accent }}>
// //                    {tab}
// //                  </span>
// //                )}
// //              </div>
// //            );
// //          })}
// //        </div>
// //       }
// //     </div>
// //   );
// // }

// // function timeAgo(iso) {
// //   const d = Math.floor((Date.now()-new Date(iso))/60000);
// //   if (d<1) return "just now"; if (d<60) return `${d}m ago`;
// //   if (d<1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
// // }

// // const S = {
// //   page:    { padding:"32px 40px", maxWidth:900, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
// //   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500 },
// //   header:  { marginBottom:24 },
// //   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
// //   sub:     { fontSize:13,color:"#aaa" },
// //   tabRow:  { display:"flex",borderBottom:"1px solid #ededea",marginBottom:24 },
// //   tabBtn:  { fontSize:12,padding:"10px 18px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s" },
// //   list:    { display:"flex",flexDirection:"column",gap:12 },
// //   card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16 },
// //   cardLeft:{ display:"flex",alignItems:"flex-start",gap:12,flex:1,minWidth:0 },
// //   typePill:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,fontWeight:600,flexShrink:0,marginTop:2 },
// //   cardTitle:{ fontSize:14,fontWeight:400,color:"#1a1208",marginBottom:3 },
// //   cardMeta: { fontSize:11,color:"#bbb" },
// //   cardNotes:{ fontSize:11,color:"#C9A96E",marginTop:4,fontStyle:"italic" },
// //   cardActions:{ display:"flex",gap:8,flexShrink:0 },
// //   btnApprove:{ fontSize:11,padding:"7px 14px",border:"1.5px solid #7ec87e44",background:"#7ec87e18",color:"#3a7c3a",borderRadius:6,cursor:"pointer",fontWeight:500 },
// //   btnChanges:{ fontSize:11,padding:"7px 14px",border:"1.5px solid #C9A96E44",background:"#C9A96E18",color:"#7a5a1a",borderRadius:6,cursor:"pointer" },
// //   btnReject: { fontSize:11,padding:"7px 14px",border:"1.5px solid #d4909044",background:"#d4909018",color:"#9a3030",borderRadius:6,cursor:"pointer" },
// //   statusBadge:{ fontSize:11,letterSpacing:".06em",fontWeight:500,textTransform:"uppercase",flexShrink:0 },
// //   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// // };

// "use client";
// // app/admin/approval/page.js

// import { useState, useEffect, useCallback } from "react";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";

// const STATUS_TABS = ["pending", "approved", "rejected", "changesRequested"];
// const TYPE_COLOR  = {
//   topic:   ["#7ec87e22", "#3a7c3a"],
//   product: ["#C9A96E22", "#7a5a1a"],
//   media:   ["#7eb8d822", "#1a4a7a"],
// };

// function timeAgo(iso) {
//   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
//   if (d < 1) return "just now";
//   if (d < 60) return `${d}m ago`;
//   if (d < 1440) return `${Math.floor(d / 60)}h ago`;
//   return `${Math.floor(d / 1440)}d ago`;
// }

// export default function ApprovalsPage() {
//   const { user }  = useAdminAuthStore();
//   const accent    = "#C9A96E";
//   const [tab, setTab]         = useState("pending");
//   const [items, setItems]     = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast]     = useState(null);

//   const showToast = (msg, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const loadApprovals = useCallback(async (status) => {
//     setLoading(true);
//     try {
//       const data = await api.get(`/admin/approvals?status=${status}`);
//       setItems(data?.data?.approvals || []);
//     } catch {
//       setItems([
//         { _id: "a1", type: "topic",   title: "Reels Algorithm Deep Dive",      submittedByName: "Kiran M.",  submittedAt: new Date(Date.now()-3600000).toISOString(),   status: "pending" },
//         { _id: "a2", type: "product", title: "Brand Deal Template Pack",       submittedByName: "Priya S.",  submittedAt: new Date(Date.now()-7200000).toISOString(),   status: "pending" },
//         { _id: "a3", type: "topic",   title: "Instagram Growth Masterclass",   submittedByName: "Arjun R.",  submittedAt: new Date(Date.now()-10800000).toISOString(),  status: "pending" },
//         { _id: "a4", type: "media",   title: "Creator Studio Setup Guide.pdf", submittedByName: "Nisha K.",  submittedAt: new Date(Date.now()-14400000).toISOString(),  status: "pending" },
//       ]);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => { loadApprovals(tab); }, [tab, loadApprovals]);

//   // Live — refresh when another admin reviews something
//   useSocket({ "admin:approval_reviewed": () => loadApprovals(tab) });

//   const review = async (id, status, notes = "") => {
//     try {
//       await api.patch(`/admin/approvals/${id}`, { status, notes });
//       setItems(prev => prev.filter(i => i._id !== id));
//       showToast(
//         status === "approved" ? "Approved — published live ◉" :
//         status === "rejected" ? "Rejected" : "Changes requested"
//       );
//     } catch { showToast("Action failed", false); }
//   };

//   return (
//     <div style={S.page}>
//       {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Approvals</h1>
//           <p style={S.sub}>Review and approve content submitted by module masters.</p>
//         </div>
//         <span style={S.liveNote}>◉ Live — auto-refreshes on new submissions</span>
//       </div>

//       {/* Tabs */}
//       <div style={S.tabRow}>
//         {STATUS_TABS.map(t => (
//           <button key={t} onClick={() => setTab(t)} style={{
//             ...S.tabBtn,
//             borderBottom: tab === t ? `2px solid ${accent}` : "2px solid transparent",
//             color:        tab === t ? "#1a1208" : "#aaa",
//             fontWeight:   tab === t ? 500 : 400,
//           }}>
//             {t.charAt(0).toUpperCase() + t.slice(1).replace(/([A-Z])/g, " $1")}
//           </button>
//         ))}
//       </div>

//       {loading ? <div style={S.empty}>Loading…</div> :
//        items.length === 0 ? <div style={S.empty}>No {tab} approvals</div> :
//        <div style={S.list}>
//          {items.map(item => {
//            const [bg, color] = TYPE_COLOR[item.type] || ["#eee", "#555"];
//            return (
//              <div key={item._id} style={S.card}>
//                <div style={S.cardLeft}>
//                  <span style={{ ...S.typePill, background: bg, color }}>{item.type}</span>
//                  <div>
//                    <p style={S.cardTitle}>{item.title}</p>
//                    <p style={S.cardMeta}>
//                      Submitted by <strong>{item.submittedByName}</strong> · {timeAgo(item.submittedAt)}
//                    </p>
//                    {item.notes && <p style={S.cardNotes}>Notes: {item.notes}</p>}
//                  </div>
//                </div>

//                {tab === "pending" && (
//                  <div style={S.cardActions}>
//                    <button style={S.btnApprove} onClick={() => review(item._id, "approved")}>✓ Approve</button>
//                    <button style={S.btnChanges} onClick={() => {
//                      const n = prompt("What changes are needed?");
//                      if (n) review(item._id, "changesRequested", n);
//                    }}>Request Changes</button>
//                    <button style={S.btnReject} onClick={() => review(item._id, "rejected")}>✕ Reject</button>
//                  </div>
//                )}
//                {tab !== "pending" && (
//                  <span style={{
//                    ...S.statusBadge,
//                    color: tab === "approved" ? "#3a7c3a" : tab === "rejected" ? "#c44" : accent,
//                  }}>
//                    {tab}
//                  </span>
//                )}
//              </div>
//            );
//          })}
//        </div>
//       }
//     </div>
//   );
// }

// const S = {
//   page:       { padding: "32px 40px", maxWidth: 900, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
//   toast:      { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
//   header:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
//   heading:    { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
//   sub:        { fontSize: 13, color: "#aaa" },
//   liveNote:   { fontSize: 11, color: "#7ec87e", fontWeight: 500, alignSelf: "center" },
//   tabRow:     { display: "flex", borderBottom: "1px solid #ededea", marginBottom: 24 },
//   tabBtn:     { fontSize: 12, padding: "10px 18px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" },
//   list:       { display: "flex", flexDirection: "column", gap: 12 },
//   card:       { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
//   cardLeft:   { display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 },
//   typePill:   { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, fontWeight: 600, flexShrink: 0, marginTop: 2 },
//   cardTitle:  { fontSize: 14, fontWeight: 400, color: "#1a1208", marginBottom: 3 },
//   cardMeta:   { fontSize: 11, color: "#bbb" },
//   cardNotes:  { fontSize: 11, color: "#C9A96E", marginTop: 4, fontStyle: "italic" },
//   cardActions:{ display: "flex", gap: 8, flexShrink: 0 },
//   btnApprove: { fontSize: 11, padding: "7px 14px", border: "1.5px solid #7ec87e44", background: "#7ec87e18", color: "#3a7c3a", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
//   btnChanges: { fontSize: 11, padding: "7px 14px", border: "1.5px solid #C9A96E44", background: "#C9A96E18", color: "#7a5a1a", borderRadius: 6, cursor: "pointer" },
//   btnReject:  { fontSize: 11, padding: "7px 14px", border: "1.5px solid #d4909044", background: "#d4909018", color: "#9a3030", borderRadius: 6, cursor: "pointer" },
//   statusBadge:{ fontSize: 11, letterSpacing: ".06em", fontWeight: 500, textTransform: "uppercase", flexShrink: 0 },
//   empty:      { textAlign: "center", padding: "60px 0", fontSize: 13, color: "#bbb" },
// };

"use client";
// app/admin/approval/page.js

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

const STATUS_TABS = ["pending", "approved", "rejected", "changesRequested"];
const TYPE_COLOR  = {
  topic:   ["#7ec87e22", "#3a7c3a"],
  product: ["#C9A96E22", "#7a5a1a"],
  media:   ["#7eb8d822", "#1a4a7a"],
};

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now";
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
}

export default function ApprovalsPage() {
  const { user }  = useAdminAuthStore();
  const accent    = "#C9A96E";
  const [tab, setTab]         = useState("pending");
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadApprovals = useCallback(async (status) => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/approvals?status=${status}`);
      setItems(data?.data?.approvals || []);
    } catch {
      setItems([
        { _id: "a1", type: "topic",   title: "Reels Algorithm Deep Dive",      submittedByName: "Kiran M.",  submittedAt: new Date(Date.now()-3600000).toISOString(),   status: "pending" },
        { _id: "a2", type: "product", title: "Brand Deal Template Pack",       submittedByName: "Priya S.",  submittedAt: new Date(Date.now()-7200000).toISOString(),   status: "pending" },
        { _id: "a3", type: "topic",   title: "Instagram Growth Masterclass",   submittedByName: "Arjun R.",  submittedAt: new Date(Date.now()-10800000).toISOString(),  status: "pending" },
        { _id: "a4", type: "media",   title: "Creator Studio Setup Guide.pdf", submittedByName: "Nisha K.",  submittedAt: new Date(Date.now()-14400000).toISOString(),  status: "pending" },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadApprovals(tab); }, [tab, loadApprovals]);

  // Live — refresh when another admin reviews something
  useSocket({ "admin:approval_reviewed": () => loadApprovals(tab) });

  const review = async (id, status, notes = "") => {
    try {
      await api.patch(`/admin/approvals/${id}`, { status, notes });
      setItems(prev => prev.filter(i => i._id !== id));
      showToast(
        status === "approved" ? "Approved — published live ◉" :
        status === "rejected" ? "Rejected" : "Changes requested"
      );
    } catch { showToast("Action failed", false); }
  };

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Approvals</h1>
          <p style={S.sub}>Review and approve content submitted by module masters.</p>
        </div>
        <span style={S.liveNote}>◉ Live — auto-refreshes on new submissions</span>
      </div>

      {/* Tabs */}
      <div style={S.tabRow}>
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            ...S.tabBtn,
            borderBottom: tab === t ? `2px solid ${accent}` : "2px solid transparent",
            color:        tab === t ? "#1a1208" : "#aaa",
            fontWeight:   tab === t ? 500 : 400,
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1).replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>

      {loading ? <div style={S.empty}>Loading…</div> :
       items.length === 0 ? <div style={S.empty}>No {tab} approvals</div> :
       <div style={S.list}>
         {items.map(item => {
           const [bg, color] = TYPE_COLOR[item.type] || ["#eee", "#555"];
           return (
             <div key={item._id} style={S.card}>
               <div style={S.cardLeft}>
                 <span style={{ ...S.typePill, background: bg, color }}>{item.type}</span>
                 <div>
                   <p style={S.cardTitle}>{item.title}</p>
                   <p style={S.cardMeta}>
                     Submitted by <strong>{item.submittedByName}</strong> · {timeAgo(item.submittedAt)}
                   </p>
                   {item.notes && <p style={S.cardNotes}>Notes: {item.notes}</p>}
                 </div>
               </div>

               {tab === "pending" && (
                 <div style={S.cardActions}>
                   <button style={S.btnApprove} onClick={() => review(item._id, "approved")}>✓ Approve</button>
                   <button style={S.btnChanges} onClick={() => {
                     const n = prompt("What changes are needed?");
                     if (n) review(item._id, "changesRequested", n);
                   }}>Request Changes</button>
                   <button style={S.btnReject} onClick={() => review(item._id, "rejected")}>✕ Reject</button>
                 </div>
               )}
               {tab !== "pending" && (
                 <span style={{
                   ...S.statusBadge,
                   color: tab === "approved" ? "#3a7c3a" : tab === "rejected" ? "#c44" : accent,
                 }}>
                   {tab}
                 </span>
               )}
             </div>
           );
         })}
       </div>
      }
    </div>
  );
}

const S = {
  page:       { padding: "32px 40px", maxWidth: 900, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
  toast:      { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
  header:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  heading:    { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
  sub:        { fontSize: 13, color: "#aaa" },
  liveNote:   { fontSize: 11, color: "#7ec87e", fontWeight: 500, alignSelf: "center" },
  tabRow:     { display: "flex", borderBottom: "1px solid #ededea", marginBottom: 24 },
  tabBtn:     { fontSize: 12, padding: "10px 18px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" },
  list:       { display: "flex", flexDirection: "column", gap: 12 },
  card:       { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  cardLeft:   { display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 },
  typePill:   { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, fontWeight: 600, flexShrink: 0, marginTop: 2 },
  cardTitle:  { fontSize: 14, fontWeight: 400, color: "#1a1208", marginBottom: 3 },
  cardMeta:   { fontSize: 11, color: "#bbb" },
  cardNotes:  { fontSize: 11, color: "#C9A96E", marginTop: 4, fontStyle: "italic" },
  cardActions:{ display: "flex", gap: 8, flexShrink: 0 },
  btnApprove: { fontSize: 11, padding: "7px 14px", border: "1.5px solid #7ec87e44", background: "#7ec87e18", color: "#3a7c3a", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  btnChanges: { fontSize: 11, padding: "7px 14px", border: "1.5px solid #C9A96E44", background: "#C9A96E18", color: "#7a5a1a", borderRadius: 6, cursor: "pointer" },
  btnReject:  { fontSize: 11, padding: "7px 14px", border: "1.5px solid #d4909044", background: "#d4909018", color: "#9a3030", borderRadius: 6, cursor: "pointer" },
  statusBadge:{ fontSize: 11, letterSpacing: ".06em", fontWeight: 500, textTransform: "uppercase", flexShrink: 0 },
  empty:      { textAlign: "center", padding: "60px 0", fontSize: 13, color: "#bbb" },
};