// // "use client";
// // // app/admin/archive/page.js

// // import { useState, useEffect } from "react";
// // import { useAuthStore } from "@/store/authStore";

// // export default function ArchivePage() {
// //   const { user } = useAuthStore();
// //   const isSuperAdmin = user?.role === "superAdmin";
// //   const [items, setItems]   = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [notif, setNotif]   = useState(null);

// //   useEffect(() => {
// //     fetch("/api/admin/archive")
// //       .then(r => r.json())
// //       .then(d => setItems(d.data || []))
// //       .catch(() => setItems([
// //         { _id:"t1", title:"Old Algorithm Guide 2022", moduleId:3, level:"b", readTime:"6 min",  updatedAt:new Date(Date.now()-2592000000).toISOString(), createdBy:"Admin" },
// //         { _id:"t2", title:"Outdated Brand Rate Guide", moduleId:5, level:"i", readTime:"8 min",  updatedAt:new Date(Date.now()-5184000000).toISOString(), createdBy:"Priya S." },
// //         { _id:"t3", title:"Deprecated Studio Setup v1", moduleId:2, level:"b", readTime:"10 min", updatedAt:new Date(Date.now()-7776000000).toISOString(), createdBy:"Kiran M." },
// //       ]))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const showNotif = (msg, ok=true) => { setNotif({msg,ok}); setTimeout(()=>setNotif(null),3000); };

// //   const restore = async (id) => {
// //     try {
// //       await fetch(`/api/admin/archive/${id}/restore`, { method:"PATCH" });
// //       setItems(prev => prev.filter(i => i._id !== id));
// //       showNotif("Topic restored and published live ◉");
// //     } catch { showNotif("Restore failed", false); }
// //   };

// //   const permanentDelete = async (id) => {
// //     if (!confirm("Permanently delete? This cannot be undone and removes all version history.")) return;
// //     try {
// //       await fetch(`/api/admin/content/${id}`, { method:"DELETE" });
// //       setItems(prev => prev.filter(i => i._id !== id));
// //       showNotif("Permanently deleted");
// //     } catch { showNotif("Delete failed", false); }
// //   };

// //   const MODULES = ["Creator Foundations","Content Creation System","Studio & Team Setup","Platform Growth & Algorithms","Collabs & Community","Monetization & Brand Deals","Creator Operations & Legal","Scaling & Career Growth"];

// //   return (
// //     <div style={S.page}>
// //       {notif && <div style={{...S.toast,background:notif.ok?"#7ec87e":"#d49090"}}>{notif.msg}</div>}
// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Archive</h1>
// //           <p style={S.sub}>Archived topics. Restore to publish, or permanently delete.</p>
// //         </div>
// //       </div>

// //       {loading ? <div style={S.empty}>Loading…</div> :
// //        items.length === 0 ? <div style={S.empty}>Archive is empty</div> :
// //        <div style={S.list}>
// //          {items.map(item => (
// //            <div key={item._id} style={S.card}>
// //              <div style={S.cardLeft}>
// //                <div style={S.archiveDot} />
// //                <div>
// //                  <p style={S.cardTitle}>{item.title}</p>
// //                  <p style={S.cardMeta}>{MODULES[item.moduleId] || `Module ${item.moduleId}`} · {item.level==="b"?"Beginner":"Intermediate"} · {item.readTime}</p>
// //                  <p style={S.cardMeta}>Archived {timeAgo(item.updatedAt)} · by {item.createdBy}</p>
// //                </div>
// //              </div>
// //              <div style={S.cardActions}>
// //                <button style={S.restoreBtn} onClick={() => restore(item._id)}>↺ Restore</button>
// //                {isSuperAdmin && (
// //                  <button style={S.deleteBtn} onClick={() => permanentDelete(item._id)}>✕ Delete forever</button>
// //                )}
// //              </div>
// //            </div>
// //          ))}
// //        </div>
// //       }
// //     </div>
// //   );
// // }

// // function timeAgo(iso) {
// //   const d = Math.floor((Date.now()-new Date(iso))/86400000);
// //   if (d===0) return "today"; if (d===1) return "yesterday"; return `${d} days ago`;
// // }

// // const S = {
// //   page:    { padding:"32px 40px",maxWidth:900,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
// //   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500 },
// //   header:  { marginBottom:24 },
// //   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
// //   sub:     { fontSize:13,color:"#aaa" },
// //   list:    { display:"flex",flexDirection:"column",gap:10 },
// //   card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16 },
// //   cardLeft:{ display:"flex",alignItems:"flex-start",gap:12,flex:1,minWidth:0 },
// //   archiveDot:{ width:8,height:8,borderRadius:"50%",background:"#ddd",flexShrink:0,marginTop:5 },
// //   cardTitle:{ fontSize:13,fontWeight:400,color:"#555",marginBottom:3 },
// //   cardMeta: { fontSize:11,color:"#bbb",marginTop:1 },
// //   cardActions:{ display:"flex",gap:8,flexShrink:0 },
// //   restoreBtn:{ fontSize:11,padding:"7px 14px",border:"1.5px solid #7ec87e44",background:"#7ec87e18",color:"#3a7c3a",borderRadius:6,cursor:"pointer",fontWeight:500 },
// //   deleteBtn: { fontSize:11,padding:"7px 14px",border:"1.5px solid #d4909044",background:"#d4909018",color:"#9a3030",borderRadius:6,cursor:"pointer" },
// //   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// // };

// "use client";
// // app/admin/archive/page.js

// import { useState, useEffect, useCallback } from "react";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";

// const MODULES = [
//   "Creator Foundations", "Content Creation System", "Studio & Team Setup",
//   "Platform Growth & Algorithms", "Collabs & Community", "Monetization & Brand Deals",
//   "Creator Operations & Legal", "Scaling & Career Growth",
// ];

// function timeAgo(iso) {
//   const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
//   if (d === 0) return "today";
//   if (d === 1) return "yesterday";
//   return `${d} days ago`;
// }

// export default function ArchivePage() {
//   const { user }    = useAdminAuthStore();
//   const isSuperAdmin = user?.role === "superAdmin";
//   const [items, setItems]     = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast]     = useState(null);

//   const showToast = (msg, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const loadArchive = useCallback(async () => {
//     try {
//       const data = await api.get("/admin/archive");
//       setItems(data?.data?.topics || data?.data || []);
//     } catch {
//       setItems([
//         { _id: "t1", title: "Old Algorithm Guide 2022",   moduleId: 3, level: "b", readTime: "6 min",  updatedAt: new Date(Date.now()-2592000000).toISOString(), createdByName: "Admin"    },
//         { _id: "t2", title: "Outdated Brand Rate Guide",  moduleId: 5, level: "i", readTime: "8 min",  updatedAt: new Date(Date.now()-5184000000).toISOString(), createdByName: "Priya S." },
//         { _id: "t3", title: "Deprecated Studio Setup v1", moduleId: 2, level: "b", readTime: "10 min", updatedAt: new Date(Date.now()-7776000000).toISOString(), createdByName: "Kiran M." },
//       ]);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => { loadArchive(); }, [loadArchive]);

//   // Live — when a topic is archived from Content OS, refresh list
//   useSocket({ "topic:archived": loadArchive });

//   const restore = async (id) => {
//     try {
//       await api.patch(`/admin/archive/${id}/restore`, {});
//       setItems(prev => prev.filter(i => i._id !== id));
//       showToast("Topic restored and published live ◉");
//     } catch { showToast("Restore failed", false); }
//   };

//   const permanentDelete = async (id) => {
//     if (!confirm("Permanently delete? This cannot be undone and removes all version history.")) return;
//     try {
//       await api.delete(`/admin/content/${id}`);
//       setItems(prev => prev.filter(i => i._id !== id));
//       showToast("Permanently deleted");
//     } catch { showToast("Delete failed", false); }
//   };

//   return (
//     <div style={S.page}>
//       {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Archive</h1>
//           <p style={S.sub}>Archived topics. Restore to publish live, or permanently delete.</p>
//         </div>
//         <span style={S.count}>{items.length} archived</span>
//       </div>

//       {loading ? <div style={S.empty}>Loading…</div> :
//        items.length === 0 ? <div style={S.empty}>Archive is empty</div> :
//        <div style={S.list}>
//          {items.map(item => (
//            <div key={item._id} style={S.card}>
//              <div style={S.cardLeft}>
//                <div style={S.archiveDot} />
//                <div>
//                  <p style={S.cardTitle}>{item.title}</p>
//                  <p style={S.cardMeta}>
//                    {MODULES[item.moduleId] || `Module ${item.moduleId}`} ·{" "}
//                    {item.level === "b" ? "Beginner" : "Intermediate"} · {item.readTime}
//                  </p>
//                  <p style={S.cardMeta}>
//                    Archived {timeAgo(item.updatedAt)} · by {item.createdByName || item.createdBy || "—"}
//                  </p>
//                </div>
//              </div>
//              <div style={S.cardActions}>
//                <button style={S.restoreBtn} onClick={() => restore(item._id)}>↺ Restore</button>
//                {isSuperAdmin && (
//                  <button style={S.deleteBtn} onClick={() => permanentDelete(item._id)}>✕ Delete forever</button>
//                )}
//              </div>
//            </div>
//          ))}
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
//   count:      { fontSize: 11, color: "#bbb", alignSelf: "center" },
//   list:       { display: "flex", flexDirection: "column", gap: 10 },
//   card:       { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
//   cardLeft:   { display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 },
//   archiveDot: { width: 8, height: 8, borderRadius: "50%", background: "#ddd", flexShrink: 0, marginTop: 5 },
//   cardTitle:  { fontSize: 13, fontWeight: 400, color: "#555", marginBottom: 3 },
//   cardMeta:   { fontSize: 11, color: "#bbb", marginTop: 1 },
//   cardActions:{ display: "flex", gap: 8, flexShrink: 0 },
//   restoreBtn: { fontSize: 11, padding: "7px 14px", border: "1.5px solid #7ec87e44", background: "#7ec87e18", color: "#3a7c3a", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
//   deleteBtn:  { fontSize: 11, padding: "7px 14px", border: "1.5px solid #d4909044", background: "#d4909018", color: "#9a3030", borderRadius: 6, cursor: "pointer" },
//   empty:      { textAlign: "center", padding: "60px 0", fontSize: 13, color: "#bbb" },
// };

"use client";
// app/admin/archive/page.js

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

const MODULES = [
  "Creator Foundations", "Content Creation System", "Studio & Team Setup",
  "Platform Growth & Algorithms", "Collabs & Community", "Monetization & Brand Deals",
  "Creator Operations & Legal", "Scaling & Career Growth",
];

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}

export default function ArchivePage() {
  const { user }    = useAdminAuthStore();
  const isSuperAdmin = user?.role === "superAdmin";
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadArchive = useCallback(async () => {
    try {
      const data = await api.get("/admin/archive");
      setItems(data?.data?.topics || data?.data || []);
    } catch {
      setItems([
        { _id: "t1", title: "Old Algorithm Guide 2022",   moduleId: 3, level: "b", readTime: "6 min",  updatedAt: new Date(Date.now()-2592000000).toISOString(), createdByName: "Admin"    },
        { _id: "t2", title: "Outdated Brand Rate Guide",  moduleId: 5, level: "i", readTime: "8 min",  updatedAt: new Date(Date.now()-5184000000).toISOString(), createdByName: "Priya S." },
        { _id: "t3", title: "Deprecated Studio Setup v1", moduleId: 2, level: "b", readTime: "10 min", updatedAt: new Date(Date.now()-7776000000).toISOString(), createdByName: "Kiran M." },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadArchive(); }, [loadArchive]);

  // Live — when a topic is archived from Content OS, refresh list
  useSocket({ "topic:archived": loadArchive });

  const restore = async (id) => {
    try {
      await api.patch(`/admin/archive/${id}/restore`, {});
      setItems(prev => prev.filter(i => i._id !== id));
      showToast("Topic restored and published live ◉");
    } catch { showToast("Restore failed", false); }
  };

  const permanentDelete = async (id) => {
    if (!confirm("Permanently delete? This cannot be undone and removes all version history.")) return;
    try {
      await api.delete(`/admin/content/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      showToast("Permanently deleted");
    } catch { showToast("Delete failed", false); }
  };

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Archive</h1>
          <p style={S.sub}>Archived topics. Restore to publish live, or permanently delete.</p>
        </div>
        <span style={S.count}>{items.length} archived</span>
      </div>

      {loading ? <div style={S.empty}>Loading…</div> :
       items.length === 0 ? <div style={S.empty}>Archive is empty</div> :
       <div style={S.list}>
         {items.map(item => (
           <div key={item._id} style={S.card}>
             <div style={S.cardLeft}>
               <div style={S.archiveDot} />
               <div>
                 <p style={S.cardTitle}>{item.title}</p>
                 <p style={S.cardMeta}>
                   {MODULES[item.moduleId] || `Module ${item.moduleId}`} ·{" "}
                   {item.level === "b" ? "Beginner" : "Intermediate"} · {item.readTime}
                 </p>
                 <p style={S.cardMeta}>
                   Archived {timeAgo(item.updatedAt)} · by {item.createdByName || item.createdBy || "—"}
                 </p>
               </div>
             </div>
             <div style={S.cardActions}>
               <button style={S.restoreBtn} onClick={() => restore(item._id)}>↺ Restore</button>
               {isSuperAdmin && (
                 <button style={S.deleteBtn} onClick={() => permanentDelete(item._id)}>✕ Delete forever</button>
               )}
             </div>
           </div>
         ))}
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
  count:      { fontSize: 11, color: "#bbb", alignSelf: "center" },
  list:       { display: "flex", flexDirection: "column", gap: 10 },
  card:       { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  cardLeft:   { display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 },
  archiveDot: { width: 8, height: 8, borderRadius: "50%", background: "#ddd", flexShrink: 0, marginTop: 5 },
  cardTitle:  { fontSize: 13, fontWeight: 400, color: "#555", marginBottom: 3 },
  cardMeta:   { fontSize: 11, color: "#bbb", marginTop: 1 },
  cardActions:{ display: "flex", gap: 8, flexShrink: 0 },
  restoreBtn: { fontSize: 11, padding: "7px 14px", border: "1.5px solid #7ec87e44", background: "#7ec87e18", color: "#3a7c3a", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  deleteBtn:  { fontSize: 11, padding: "7px 14px", border: "1.5px solid #d4909044", background: "#d4909018", color: "#9a3030", borderRadius: 6, cursor: "pointer" },
  empty:      { textAlign: "center", padding: "60px 0", fontSize: 13, color: "#bbb" },
};