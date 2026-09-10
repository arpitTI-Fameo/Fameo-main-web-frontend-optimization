// // "use client";
// // // app/admin/media/page.js

// // import { useState, useEffect, useRef } from "react";

// // const TYPE_ICONS = { video:"▶", image:"◉", pdf:"◇", graphic:"◈" };
// // const TYPE_COLORS = { video:"#7eb8d8", image:"#b89fd4", pdf:"#d49090", graphic:"#C9A96E" };

// // export default function MediaLibrary() {
// //   const [media, setMedia]     = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filter, setFilter]   = useState("all");
// //   const [search, setSearch]   = useState("");
// //   const [uploading, setUploading] = useState(false);
// //   const [notif, setNotif]     = useState(null);
// //   const fileRef = useRef(null);

// //   useEffect(() => {
// //     fetch("/api/admin/media")
// //       .then(r => r.json())
// //       .then(d => setMedia(d.data || []))
// //       .catch(() => setMedia([
// //         { _id:"m1", name:"Creator Setup Guide.mp4",   type:"video",   sizeBytes:52428800, uploadedByRole:"moduleMaster", uploadedAt:new Date(Date.now()-86400000).toISOString(),  url:"#", attachedTopics:["t1","t2"] },
// //         { _id:"m2", name:"Brand Deal Template.pdf",   type:"pdf",     sizeBytes:1048576,  uploadedByRole:"contentManager",uploadedAt:new Date(Date.now()-172800000).toISOString(), url:"#", attachedTopics:["t3"] },
// //         { _id:"m3", name:"Studio Thumbnail.png",      type:"image",   sizeBytes:204800,   uploadedByRole:"moduleMaster", uploadedAt:new Date(Date.now()-259200000).toISOString(), url:"#", attachedTopics:[] },
// //         { _id:"m4", name:"Analytics Dashboard.png",   type:"graphic", sizeBytes:307200,   uploadedByRole:"superAdmin",   uploadedAt:new Date(Date.now()-345600000).toISOString(), url:"#", attachedTopics:["t4"] },
// //       ]))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const showNotif = (msg, ok=true) => { setNotif({msg,ok}); setTimeout(()=>setNotif(null),3000); };

// //   const handleUpload = async (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     setUploading(true);
// //     try {
// //       const form = new FormData();
// //       form.append("file", file);
// //       const res  = await fetch("/api/admin/media/upload", { method:"POST", body:form });
// //       const data = await res.json();
// //       setMedia(prev => [data.data, ...prev]);
// //       showNotif("File uploaded successfully");
// //     } catch { showNotif("Upload failed", false); }
// //     setUploading(false);
// //     e.target.value = "";
// //   };

// //   const deleteMedia = async (id) => {
// //     if (!confirm("Delete this file? It will be removed from all attached topics.")) return;
// //     try {
// //       await fetch(`/api/admin/media/${id}`, { method:"DELETE" });
// //       setMedia(prev => prev.filter(m => m._id !== id));
// //       showNotif("File deleted");
// //     } catch { showNotif("Delete failed", false); }
// //   };

// //   const filtered = media.filter(m => {
// //     if (filter !== "all" && m.type !== filter) return false;
// //     if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
// //     return true;
// //   });

// //   const fmtSize = (b) => b > 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${(b/1024).toFixed(0)} KB`;

// //   return (
// //     <div style={S.page}>
// //       {notif && <div style={{...S.toast, background:notif.ok?"#7ec87e":"#d49090"}}>{notif.msg}</div>}

// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Media Library</h1>
// //           <p style={S.sub}>All uploaded files across all modules. {media.length} files total.</p>
// //         </div>
// //         <div style={S.headerActions}>
// //           <input ref={fileRef} type="file" accept="image/*,video/*,.pdf" style={{display:"none"}} onChange={handleUpload}/>
// //           <button onClick={() => fileRef.current?.click()} disabled={uploading} style={S.uploadBtn}>
// //             {uploading ? "Uploading…" : "+ Upload File"}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filters */}
// //       <div style={S.filters}>
// //         {["all","video","image","pdf","graphic"].map(t => (
// //           <button key={t} onClick={()=>setFilter(t)} style={{...S.filterPill, background:filter===t?"#1a1208":"transparent", color:filter===t?"#F0E8D6":"#777", border:filter===t?"1.5px solid #1a1208":"1.5px solid #e8e8e4"}}>
// //             {t.charAt(0).toUpperCase()+t.slice(1)}
// //           </button>
// //         ))}
// //         <input style={S.search} placeholder="Search files…" value={search} onChange={e=>setSearch(e.target.value)}/>
// //         <span style={S.count}>{filtered.length} files</span>
// //       </div>

// //       {/* Grid */}
// //       {loading ? <div style={S.empty}>Loading…</div> :
// //        filtered.length === 0 ? <div style={S.empty}>No files found</div> :
// //        <div style={S.grid}>
// //          {filtered.map(m => {
// //            const color = TYPE_COLORS[m.type] || "#aaa";
// //            const icon  = TYPE_ICONS[m.type]  || "◎";
// //            return (
// //              <div key={m._id} style={S.card}>
// //                <div style={{...S.cardThumb, background:color+"18", border:`1.5px solid ${color}33`}}>
// //                  <span style={{fontSize:24, color}}>{icon}</span>
// //                </div>
// //                <div style={S.cardBody}>
// //                  <p style={S.cardName} title={m.name}>{m.name}</p>
// //                  <p style={S.cardMeta}>{fmtSize(m.sizeBytes)} · {m.uploadedByRole}</p>
// //                  <p style={S.cardMeta}>{timeAgo(m.uploadedAt)}</p>
// //                  {m.attachedTopics?.length > 0 && (
// //                    <p style={{...S.cardMeta, color:"#C9A96E"}}>{m.attachedTopics.length} topic{m.attachedTopics.length>1?"s":""} attached</p>
// //                  )}
// //                </div>
// //                <div style={S.cardFooter}>
// //                  <span style={{...S.typeBadge, color, background:color+"18"}}>{m.type}</span>
// //                  <button onClick={()=>deleteMedia(m._id)} style={S.deleteBtn}>✕</button>
// //                </div>
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
// //   if (d<60) return `${d}m ago`; if (d<1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
// // }

// // const S = {
// //   page:    { padding:"32px 40px", maxWidth:1200, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
// //   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500 },
// //   header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 },
// //   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
// //   sub:     { fontSize:13,color:"#aaa" },
// //   headerActions:{ display:"flex",gap:10 },
// //   uploadBtn:{ fontSize:11,letterSpacing:".1em",textTransform:"uppercase",padding:"10px 20px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500 },
// //   filters: { display:"flex",gap:8,alignItems:"center",marginBottom:24,flexWrap:"wrap" },
// //   filterPill:{ fontSize:10,letterSpacing:".06em",textTransform:"uppercase",padding:"5px 14px",borderRadius:40,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s" },
// //   search:  { fontSize:12,padding:"7px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",width:180,fontFamily:"'DM Sans',sans-serif",marginLeft:"auto" },
// //   count:   { fontSize:11,color:"#bbb" },
// //   grid:    { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16 },
// //   card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column",transition:"transform .2s,box-shadow .2s" },
// //   cardThumb:{ height:100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 },
// //   cardBody: { padding:"12px 14px",flex:1 },
// //   cardName: { fontSize:12,fontWeight:500,color:"#1a1208",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4 },
// //   cardMeta: { fontSize:10,color:"#bbb",marginTop:1 },
// //   cardFooter:{ padding:"8px 14px",borderTop:"1px solid #f5f5f2",display:"flex",alignItems:"center",justifyContent:"space-between" },
// //   typeBadge:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,fontWeight:600 },
// //   deleteBtn:{ fontSize:11,background:"none",border:"none",color:"#d49090",cursor:"pointer",padding:"2px 4px" },
// //   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// // };

// "use client";
// // app/admin/media-center/page.js

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";

// const TYPE_ICONS  = { video: "▶", image: "◉", pdf: "◇", graphic: "◈" };
// const TYPE_COLORS = { video: "#7eb8d8", image: "#b89fd4", pdf: "#d49090", graphic: "#C9A96E" };

// function timeAgo(iso) {
//   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
//   if (d < 60) return `${d}m ago`;
//   if (d < 1440) return `${Math.floor(d / 60)}h ago`;
//   return `${Math.floor(d / 1440)}d ago`;
// }

// function fmtSize(b) {
//   return b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
// }

// export default function MediaCenter() {
//   const { user }  = useAdminAuthStore();
//   const [media, setMedia]       = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [filter, setFilter]     = useState("all");
//   const [search, setSearch]     = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [toast, setToast]       = useState(null);
//   const fileRef = useRef(null);

//   const showToast = (msg, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const loadMedia = useCallback(async () => {
//     try {
//       const data = await api.get("/admin/media");
//       setMedia(data?.data?.media || data?.data || []);
//     } catch {
//       setMedia([
//         { _id: "m1", name: "Creator Setup Guide.mp4",  type: "video",   sizeBytes: 52428800, uploadedByRole: "moduleMaster",   uploadedAt: new Date(Date.now()-86400000).toISOString(),  url: "#", attachedTopics: ["t1","t2"] },
//         { _id: "m2", name: "Brand Deal Template.pdf",  type: "pdf",     sizeBytes: 1048576,  uploadedByRole: "contentManager", uploadedAt: new Date(Date.now()-172800000).toISOString(), url: "#", attachedTopics: ["t3"] },
//         { _id: "m3", name: "Studio Thumbnail.png",     type: "image",   sizeBytes: 204800,   uploadedByRole: "moduleMaster",   uploadedAt: new Date(Date.now()-259200000).toISOString(), url: "#", attachedTopics: [] },
//         { _id: "m4", name: "Analytics Dashboard.png",  type: "graphic", sizeBytes: 307200,   uploadedByRole: "superAdmin",     uploadedAt: new Date(Date.now()-345600000).toISOString(), url: "#", attachedTopics: ["t4"] },
//       ]);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => { loadMedia(); }, [loadMedia]);

//   // Live — refresh when media is uploaded from another session
//   useSocket({ "media:uploaded": loadMedia, "media:deleted": loadMedia });

//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const form = new FormData();
//       form.append("file", file);
//       const data = await api.upload("/media/upload", form);
//       if (data?.data) setMedia(prev => [data.data, ...prev]);
//       showToast("File uploaded successfully ◉");
//     } catch { showToast("Upload failed", false); }
//     setUploading(false);
//     e.target.value = "";
//   };

//   const deleteMedia = async (id) => {
//     if (!confirm("Delete this file? It will be removed from all attached topics.")) return;
//     try {
//       await api.delete(`/media/${id}`);
//       setMedia(prev => prev.filter(m => m._id !== id));
//       showToast("File deleted");
//     } catch { showToast("Delete failed", false); }
//   };

//   const filtered = media.filter(m => {
//     if (filter !== "all" && m.type !== filter) return false;
//     if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   return (
//     <div style={S.page}>
//       {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Media Center</h1>
//           <p style={S.sub}>All uploaded files across all modules. {media.length} files total.</p>
//         </div>
//         <div style={S.headerActions}>
//           <input ref={fileRef} type="file" accept="image/*,video/*,.pdf" style={{ display: "none" }} onChange={handleUpload} />
//           <button onClick={() => fileRef.current?.click()} disabled={uploading} style={S.uploadBtn}>
//             {uploading ? "Uploading…" : "+ Upload File"}
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div style={S.filters}>
//         {["all", "video", "image", "pdf", "graphic"].map(t => (
//           <button key={t} onClick={() => setFilter(t)} style={{
//             ...S.filterPill,
//             background: filter === t ? "#1a1208" : "transparent",
//             color:      filter === t ? "#F0E8D6" : "#777",
//             border:     filter === t ? "1.5px solid #1a1208" : "1.5px solid #e8e8e4",
//           }}>
//             {t.charAt(0).toUpperCase() + t.slice(1)}
//           </button>
//         ))}
//         <input style={S.search} placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)} />
//         <span style={S.count}>{filtered.length} files</span>
//       </div>

//       {/* Grid */}
//       {loading ? <div style={S.empty}>Loading…</div> :
//        filtered.length === 0 ? <div style={S.empty}>No files found</div> :
//        <div style={S.grid}>
//          {filtered.map(m => {
//            const color = TYPE_COLORS[m.type] || "#aaa";
//            const icon  = TYPE_ICONS[m.type]  || "◎";
//            return (
//              <div key={m._id} style={S.card}>
//                <div style={{ ...S.cardThumb, background: color + "18", border: `1.5px solid ${color}33` }}>
//                  <span style={{ fontSize: 24, color }}>{icon}</span>
//                </div>
//                <div style={S.cardBody}>
//                  <p style={S.cardName} title={m.name}>{m.name}</p>
//                  <p style={S.cardMeta}>{fmtSize(m.sizeBytes || 0)} · {m.uploadedByRole || m.uploadedBy?.role || "—"}</p>
//                  <p style={S.cardMeta}>{timeAgo(m.uploadedAt || m.createdAt)}</p>
//                  {m.attachedTopics?.length > 0 && (
//                    <p style={{ ...S.cardMeta, color: "#C9A96E" }}>
//                      {m.attachedTopics.length} topic{m.attachedTopics.length > 1 ? "s" : ""} attached
//                    </p>
//                  )}
//                </div>
//                <div style={S.cardFooter}>
//                  <span style={{ ...S.typeBadge, color, background: color + "18" }}>{m.type}</span>
//                  <div style={{ display: "flex", gap: 6 }}>
//                    {m.url && m.url !== "#" && (
//                      <a href={m.url} target="_blank" rel="noreferrer" style={S.viewBtn}>↗</a>
//                    )}
//                    <button onClick={() => deleteMedia(m._id)} style={S.deleteBtn}>✕</button>
//                  </div>
//                </div>
//              </div>
//            );
//          })}
//        </div>
//       }
//     </div>
//   );
// }

// const S = {
//   page:         { padding: "32px 40px", maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
//   toast:        { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
//   header:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
//   heading:      { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
//   sub:          { fontSize: 13, color: "#aaa" },
//   headerActions:{ display: "flex", gap: 10 },
//   uploadBtn:    { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
//   filters:      { display: "flex", gap: 8, alignItems: "center", marginBottom: 24, flexWrap: "wrap" },
//   filterPill:   { fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 40, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" },
//   search:       { fontSize: 12, padding: "7px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", width: 180, fontFamily: "'DM Sans',sans-serif", marginLeft: "auto" },
//   count:        { fontSize: 11, color: "#bbb" },
//   grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 },
//   card:         { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" },
//   cardThumb:    { height: 100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
//   cardBody:     { padding: "12px 14px", flex: 1 },
//   cardName:     { fontSize: 12, fontWeight: 500, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 },
//   cardMeta:     { fontSize: 10, color: "#bbb", marginTop: 1 },
//   cardFooter:   { padding: "8px 14px", borderTop: "1px solid #f5f5f2", display: "flex", alignItems: "center", justifyContent: "space-between" },
//   typeBadge:    { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 3, fontWeight: 600 },
//   viewBtn:      { fontSize: 11, background: "none", border: "none", color: "#7eb8d8", cursor: "pointer", textDecoration: "none", padding: "2px 4px" },
//   deleteBtn:    { fontSize: 11, background: "none", border: "none", color: "#d49090", cursor: "pointer", padding: "2px 4px" },
//   empty:        { textAlign: "center", padding: "60px 0", fontSize: 13, color: "#bbb" },
// };

// "use client";
// // app/admin/media/page.js

// import { useState, useEffect, useRef } from "react";

// const TYPE_ICONS = { video:"▶", image:"◉", pdf:"◇", graphic:"◈" };
// const TYPE_COLORS = { video:"#7eb8d8", image:"#b89fd4", pdf:"#d49090", graphic:"#C9A96E" };

// export default function MediaLibrary() {
//   const [media, setMedia]     = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter]   = useState("all");
//   const [search, setSearch]   = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [notif, setNotif]     = useState(null);
//   const fileRef = useRef(null);

//   useEffect(() => {
//     fetch("/api/admin/media")
//       .then(r => r.json())
//       .then(d => setMedia(d.data || []))
//       .catch(() => setMedia([
//         { _id:"m1", name:"Creator Setup Guide.mp4",   type:"video",   sizeBytes:52428800, uploadedByRole:"moduleMaster", uploadedAt:new Date(Date.now()-86400000).toISOString(),  url:"#", attachedTopics:["t1","t2"] },
//         { _id:"m2", name:"Brand Deal Template.pdf",   type:"pdf",     sizeBytes:1048576,  uploadedByRole:"contentManager",uploadedAt:new Date(Date.now()-172800000).toISOString(), url:"#", attachedTopics:["t3"] },
//         { _id:"m3", name:"Studio Thumbnail.png",      type:"image",   sizeBytes:204800,   uploadedByRole:"moduleMaster", uploadedAt:new Date(Date.now()-259200000).toISOString(), url:"#", attachedTopics:[] },
//         { _id:"m4", name:"Analytics Dashboard.png",   type:"graphic", sizeBytes:307200,   uploadedByRole:"superAdmin",   uploadedAt:new Date(Date.now()-345600000).toISOString(), url:"#", attachedTopics:["t4"] },
//       ]))
//       .finally(() => setLoading(false));
//   }, []);

//   const showNotif = (msg, ok=true) => { setNotif({msg,ok}); setTimeout(()=>setNotif(null),3000); };

//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const form = new FormData();
//       form.append("file", file);
//       const res  = await fetch("/api/admin/media/upload", { method:"POST", body:form });
//       const data = await res.json();
//       setMedia(prev => [data.data, ...prev]);
//       showNotif("File uploaded successfully");
//     } catch { showNotif("Upload failed", false); }
//     setUploading(false);
//     e.target.value = "";
//   };

//   const deleteMedia = async (id) => {
//     if (!confirm("Delete this file? It will be removed from all attached topics.")) return;
//     try {
//       await fetch(`/api/admin/media/${id}`, { method:"DELETE" });
//       setMedia(prev => prev.filter(m => m._id !== id));
//       showNotif("File deleted");
//     } catch { showNotif("Delete failed", false); }
//   };

//   const filtered = media.filter(m => {
//     if (filter !== "all" && m.type !== filter) return false;
//     if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   const fmtSize = (b) => b > 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${(b/1024).toFixed(0)} KB`;

//   return (
//     <div style={S.page}>
//       {notif && <div style={{...S.toast, background:notif.ok?"#7ec87e":"#d49090"}}>{notif.msg}</div>}

//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Media Library</h1>
//           <p style={S.sub}>All uploaded files across all modules. {media.length} files total.</p>
//         </div>
//         <div style={S.headerActions}>
//           <input ref={fileRef} type="file" accept="image/*,video/*,.pdf" style={{display:"none"}} onChange={handleUpload}/>
//           <button onClick={() => fileRef.current?.click()} disabled={uploading} style={S.uploadBtn}>
//             {uploading ? "Uploading…" : "+ Upload File"}
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div style={S.filters}>
//         {["all","video","image","pdf","graphic"].map(t => (
//           <button key={t} onClick={()=>setFilter(t)} style={{...S.filterPill, background:filter===t?"#1a1208":"transparent", color:filter===t?"#F0E8D6":"#777", border:filter===t?"1.5px solid #1a1208":"1.5px solid #e8e8e4"}}>
//             {t.charAt(0).toUpperCase()+t.slice(1)}
//           </button>
//         ))}
//         <input style={S.search} placeholder="Search files…" value={search} onChange={e=>setSearch(e.target.value)}/>
//         <span style={S.count}>{filtered.length} files</span>
//       </div>

//       {/* Grid */}
//       {loading ? <div style={S.empty}>Loading…</div> :
//        filtered.length === 0 ? <div style={S.empty}>No files found</div> :
//        <div style={S.grid}>
//          {filtered.map(m => {
//            const color = TYPE_COLORS[m.type] || "#aaa";
//            const icon  = TYPE_ICONS[m.type]  || "◎";
//            return (
//              <div key={m._id} style={S.card}>
//                <div style={{...S.cardThumb, background:color+"18", border:`1.5px solid ${color}33`}}>
//                  <span style={{fontSize:24, color}}>{icon}</span>
//                </div>
//                <div style={S.cardBody}>
//                  <p style={S.cardName} title={m.name}>{m.name}</p>
//                  <p style={S.cardMeta}>{fmtSize(m.sizeBytes)} · {m.uploadedByRole}</p>
//                  <p style={S.cardMeta}>{timeAgo(m.uploadedAt)}</p>
//                  {m.attachedTopics?.length > 0 && (
//                    <p style={{...S.cardMeta, color:"#C9A96E"}}>{m.attachedTopics.length} topic{m.attachedTopics.length>1?"s":""} attached</p>
//                  )}
//                </div>
//                <div style={S.cardFooter}>
//                  <span style={{...S.typeBadge, color, background:color+"18"}}>{m.type}</span>
//                  <button onClick={()=>deleteMedia(m._id)} style={S.deleteBtn}>✕</button>
//                </div>
//              </div>
//            );
//          })}
//        </div>
//       }
//     </div>
//   );
// }

// function timeAgo(iso) {
//   const d = Math.floor((Date.now()-new Date(iso))/60000);
//   if (d<60) return `${d}m ago`; if (d<1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
// }

// const S = {
//   page:    { padding:"32px 40px", maxWidth:1200, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
//   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500 },
//   header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 },
//   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
//   sub:     { fontSize:13,color:"#aaa" },
//   headerActions:{ display:"flex",gap:10 },
//   uploadBtn:{ fontSize:11,letterSpacing:".1em",textTransform:"uppercase",padding:"10px 20px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500 },
//   filters: { display:"flex",gap:8,alignItems:"center",marginBottom:24,flexWrap:"wrap" },
//   filterPill:{ fontSize:10,letterSpacing:".06em",textTransform:"uppercase",padding:"5px 14px",borderRadius:40,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s" },
//   search:  { fontSize:12,padding:"7px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",width:180,fontFamily:"'DM Sans',sans-serif",marginLeft:"auto" },
//   count:   { fontSize:11,color:"#bbb" },
//   grid:    { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16 },
//   card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column",transition:"transform .2s,box-shadow .2s" },
//   cardThumb:{ height:100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 },
//   cardBody: { padding:"12px 14px",flex:1 },
//   cardName: { fontSize:12,fontWeight:500,color:"#1a1208",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4 },
//   cardMeta: { fontSize:10,color:"#bbb",marginTop:1 },
//   cardFooter:{ padding:"8px 14px",borderTop:"1px solid #f5f5f2",display:"flex",alignItems:"center",justifyContent:"space-between" },
//   typeBadge:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,fontWeight:600 },
//   deleteBtn:{ fontSize:11,background:"none",border:"none",color:"#d49090",cursor:"pointer",padding:"2px 4px" },
//   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// };

"use client";
// app/admin/media-center/page.js

import { useState, useEffect, useRef, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

const TYPE_ICONS  = { video: "▶", image: "◉", pdf: "◇", graphic: "◈" };
const TYPE_COLORS = { video: "#7eb8d8", image: "#b89fd4", pdf: "#d49090", graphic: "#C9A96E" };

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
}

function fmtSize(b) {
  return b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
}

export default function MediaCenter() {
  const { user }  = useAdminAuthStore();
  const [media, setMedia]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]       = useState(null);
  const fileRef = useRef(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMedia = useCallback(async () => {
    try {
      const data = await api.get("/admin/media");
      setMedia(data?.data?.media || data?.data || []);
    } catch {
      setMedia([
        { _id: "m1", name: "Creator Setup Guide.mp4",  type: "video",   sizeBytes: 52428800, uploadedByRole: "moduleMaster",   uploadedAt: new Date(Date.now()-86400000).toISOString(),  url: "#", attachedTopics: ["t1","t2"] },
        { _id: "m2", name: "Brand Deal Template.pdf",  type: "pdf",     sizeBytes: 1048576,  uploadedByRole: "contentManager", uploadedAt: new Date(Date.now()-172800000).toISOString(), url: "#", attachedTopics: ["t3"] },
        { _id: "m3", name: "Studio Thumbnail.png",     type: "image",   sizeBytes: 204800,   uploadedByRole: "moduleMaster",   uploadedAt: new Date(Date.now()-259200000).toISOString(), url: "#", attachedTopics: [] },
        { _id: "m4", name: "Analytics Dashboard.png",  type: "graphic", sizeBytes: 307200,   uploadedByRole: "superAdmin",     uploadedAt: new Date(Date.now()-345600000).toISOString(), url: "#", attachedTopics: ["t4"] },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  // Live — refresh when media is uploaded from another session
  useSocket({ "media:uploaded": loadMedia, "media:deleted": loadMedia });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const data = await api.upload("/media/upload", form);
      if (data?.data) setMedia(prev => [data.data, ...prev]);
      showToast("File uploaded successfully ◉");
    } catch (err) { showToast(err.message || "Upload failed", false); }
    setUploading(false);
    e.target.value = "";
  };

  const deleteMedia = async (id) => {
    if (!confirm("Delete this file? It will be removed from all attached topics.")) return;
    try {
      await api.delete(`/media/${id}`);
      setMedia(prev => prev.filter(m => m._id !== id));
      showToast("File deleted");
    } catch { showToast("Delete failed", false); }
  };

  const filtered = media.filter(m => {
    if (filter !== "all" && m.type !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Media Center</h1>
          <p style={S.sub}>All uploaded files across all modules. {media.length} files total.</p>
        </div>
        <div style={S.headerActions}>
          <input ref={fileRef} type="file" accept="image/*,video/*,.pdf" style={{ display: "none" }} onChange={handleUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={S.uploadBtn}>
            {uploading ? "Uploading…" : "+ Upload File"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={S.filters}>
        {["all", "video", "image", "pdf", "graphic"].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            ...S.filterPill,
            background: filter === t ? "#1a1208" : "transparent",
            color:      filter === t ? "#F0E8D6" : "#777",
            border:     filter === t ? "1.5px solid #1a1208" : "1.5px solid #e8e8e4",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <input style={S.search} placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)} />
        <span style={S.count}>{filtered.length} files</span>
      </div>

      {/* Grid */}
      {loading ? <div style={S.empty}>Loading…</div> :
       filtered.length === 0 ? <div style={S.empty}>No files found</div> :
       <div style={S.grid}>
         {filtered.map(m => {
           const color = TYPE_COLORS[m.type] || "#aaa";
           const icon  = TYPE_ICONS[m.type]  || "◎";
           return (
             <div key={m._id} style={S.card}>
               <div style={{ ...S.cardThumb, background: color + "18", border: `1.5px solid ${color}33` }}>
                 <span style={{ fontSize: 24, color }}>{icon}</span>
               </div>
               <div style={S.cardBody}>
                 <p style={S.cardName} title={m.name}>{m.name}</p>
                 <p style={S.cardMeta}>{fmtSize(m.sizeBytes || 0)} · {m.uploadedByRole || m.uploadedBy?.role || "—"}</p>
                 <p style={S.cardMeta}>{timeAgo(m.uploadedAt || m.createdAt)}</p>
                 {m.attachedTopics?.length > 0 && (
                   <p style={{ ...S.cardMeta, color: "#C9A96E" }}>
                     {m.attachedTopics.length} topic{m.attachedTopics.length > 1 ? "s" : ""} attached
                   </p>
                 )}
               </div>
               <div style={S.cardFooter}>
                 <span style={{ ...S.typeBadge, color, background: color + "18" }}>{m.type}</span>
                 <div style={{ display: "flex", gap: 6 }}>
                   {m.url && m.url !== "#" && (
                     <a href={m.url} target="_blank" rel="noreferrer" style={S.viewBtn}>↗</a>
                   )}
                   <button onClick={() => deleteMedia(m._id)} style={S.deleteBtn}>✕</button>
                 </div>
               </div>
             </div>
           );
         })}
       </div>
      }
    </div>
  );
}

const S = {
  page:         { padding: "32px 40px", maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
  toast:        { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
  header:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  heading:      { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
  sub:          { fontSize: 13, color: "#aaa" },
  headerActions:{ display: "flex", gap: 10 },
  uploadBtn:    { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  filters:      { display: "flex", gap: 8, alignItems: "center", marginBottom: 24, flexWrap: "wrap" },
  filterPill:   { fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 40, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" },
  search:       { fontSize: 12, padding: "7px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", width: 180, fontFamily: "'DM Sans',sans-serif", marginLeft: "auto" },
  count:        { fontSize: 11, color: "#bbb" },
  grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 },
  card:         { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" },
  cardThumb:    { height: 100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardBody:     { padding: "12px 14px", flex: 1 },
  cardName:     { fontSize: 12, fontWeight: 500, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 },
  cardMeta:     { fontSize: 10, color: "#bbb", marginTop: 1 },
  cardFooter:   { padding: "8px 14px", borderTop: "1px solid #f5f5f2", display: "flex", alignItems: "center", justifyContent: "space-between" },
  typeBadge:    { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 3, fontWeight: 600 },
  viewBtn:      { fontSize: 11, background: "none", border: "none", color: "#7eb8d8", cursor: "pointer", textDecoration: "none", padding: "2px 4px" },
  deleteBtn:    { fontSize: 11, background: "none", border: "none", color: "#d49090", cursor: "pointer", padding: "2px 4px" },
  empty:        { textAlign: "center", padding: "60px 0", fontSize: 13, color: "#bbb" },
};