// // // "use client";
// // // // app/admin/content/page.js — Content OS
// // // // Create / Edit / Publish / Archive topics — changes reflect live on resources page

// // // import { useState, useEffect, useCallback } from "react";
// // // import Link from "next/link";
// // // import { useRouter } from "next/navigation";
// // // import { useAuthStore } from "@/store/authStore";

// // // const STATUS_CONFIG = {
// // //   published: { label: "Published", color: "#7ec87e", bg: "#7ec87e18" },
// // //   draft:     { label: "Draft",     color: "#C9A96E", bg: "#C9A96E18" },
// // //   review:    { label: "In Review", color: "#7eb8d8", bg: "#7eb8d818" },
// // //   archived:  { label: "Archived",  color: "#aaa",    bg: "#aaa18"    },
// // // };

// // // const MODULES = [
// // //   { id: 0, title: "Creator Foundations" },
// // //   { id: 1, title: "Content Creation System" },
// // //   { id: 2, title: "Studio & Team Setup" },
// // //   { id: 3, title: "Platform Growth & Algorithms" },
// // //   { id: 4, title: "Collabs & Community" },
// // //   { id: 5, title: "Monetization & Brand Deals" },
// // //   { id: 6, title: "Creator Operations & Legal" },
// // //   { id: 7, title: "Scaling & Career Growth" },
// // // ];

// // // export default function ContentOS() {
// // //   const { user } = useAuthStore();
// // //   const router   = useRouter();
// // //   const [topics, setTopics]         = useState([]);
// // //   const [loading, setLoading]       = useState(true);
// // //   const [filter, setFilter]         = useState({ status: "all", module: "all", search: "" });
// // //   const [selected, setSelected]     = useState(new Set());
// // //   const [notification, setNotif]    = useState(null);

// // //   const canPublish = ["superAdmin", "contentManager"].includes(user?.role);
// // //   const canDelete  = user?.role === "superAdmin";
// // //   const moduleIds  = user?.role === "moduleMaster" ? (user?.assignedModules || []) : null;

// // //   const fetchTopics = useCallback(async () => {
// // //     try {
// // //       const params = new URLSearchParams();
// // //       if (filter.status !== "all") params.set("status", filter.status);
// // //       if (filter.module !== "all") params.set("moduleId", filter.module);
// // //       if (filter.search) params.set("search", filter.search);
// // //       if (moduleIds) params.set("moduleIds", moduleIds.join(","));
// // //       const res = await fetch(`/api/admin/content?${params}`);
// // //       const data = await res.json();
// // //       setTopics(data.data?.topics || []);
// // //     } catch {
// // //       // Dev fallback
// // //       setTopics([
// // //         { _id: "t1", title: "Creator vs Influencer: The Fundamental Difference", moduleId: 0, status: "published", level: "b", readTime: "8 min", updatedAt: new Date().toISOString(), createdBy: "Admin" },
// // //         { _id: "t2", title: "Choosing a Niche That Compounds", moduleId: 0, status: "published", level: "b", readTime: "12 min", updatedAt: new Date().toISOString(), createdBy: "Admin" },
// // //         { _id: "t3", title: "Instagram Algorithm Decoded", moduleId: 3, status: "draft", level: "i", readTime: "18 min", updatedAt: new Date().toISOString(), createdBy: "Kiran M." },
// // //         { _id: "t4", title: "Brand Deal Rate Card Template", moduleId: 5, status: "review", level: "i", readTime: "10 min", updatedAt: new Date().toISOString(), createdBy: "Priya S." },
// // //         { _id: "t5", title: "YouTube SEO Masterclass", moduleId: 3, status: "draft", level: "i", readTime: "22 min", updatedAt: new Date().toISOString(), createdBy: "Arjun R." },
// // //         { _id: "t6", title: "Old Algorithm Guide 2022", moduleId: 3, status: "archived", level: "b", readTime: "6 min", updatedAt: new Date().toISOString(), createdBy: "Admin" },
// // //       ]);
// // //     }
// // //     setLoading(false);
// // //   }, [filter, moduleIds]);

// // //   useEffect(() => { fetchTopics(); }, [fetchTopics]);

// // //   const showNotif = (msg, type = "success") => {
// // //     setNotif({ msg, type });
// // //     setTimeout(() => setNotif(null), 3000);
// // //   };

// // //   const changeStatus = async (id, status) => {
// // //     try {
// // //       await fetch(`/api/admin/content/${id}/status`, {
// // //         method: "PATCH",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ status }),
// // //       });
// // //       setTopics(ts => ts.map(t => t._id === id ? { ...t, status } : t));
// // //       showNotif(`Topic ${status === "published" ? "published" : status === "archived" ? "archived" : "updated"} — live on Learner Hub`);
// // //     } catch { showNotif("Failed to update", "error"); }
// // //   };

// // //   const bulkAction = async (action) => {
// // //     const ids = [...selected];
// // //     await Promise.all(ids.map(id => changeStatus(id, action)));
// // //     setSelected(new Set());
// // //   };

// // //   const deleteTopic = async (id) => {
// // //     if (!confirm("Permanently delete this topic? This cannot be undone.")) return;
// // //     await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
// // //     setTopics(ts => ts.filter(t => t._id !== id));
// // //     showNotif("Topic deleted");
// // //   };

// // //   const filtered = topics.filter(t => {
// // //     if (filter.status !== "all" && t.status !== filter.status) return false;
// // //     if (filter.module !== "all" && t.moduleId !== parseInt(filter.module)) return false;
// // //     if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
// // //     return true;
// // //   });

// // //   return (
// // //     <div style={S.page}>
// // //       {/* Notification toast */}
// // //       {notification && (
// // //         <div style={{ ...S.toast, background: notification.type === "error" ? "#d49090" : "#7ec87e" }}>
// // //           {notification.msg}
// // //         </div>
// // //       )}

// // //       {/* Header */}
// // //       <div style={S.header}>
// // //         <div>
// // //           <h1 style={S.heading}>Content OS</h1>
// // //           <p style={S.sub}>All topics across all modules. Changes publish live to the Learner Hub.</p>
// // //         </div>
// // //         <Link href="/admin/content/new" style={S.newBtn}>+ New Topic</Link>
// // //       </div>

// // //       {/* Filters */}
// // //       <div style={S.filters}>
// // //         <input
// // //           style={S.search}
// // //           placeholder="Search topics…"
// // //           value={filter.search}
// // //           onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
// // //         />
// // //         <select style={S.select} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
// // //           <option value="all">All Status</option>
// // //           <option value="published">Published</option>
// // //           <option value="draft">Draft</option>
// // //           <option value="review">In Review</option>
// // //           <option value="archived">Archived</option>
// // //         </select>
// // //         <select style={S.select} value={filter.module} onChange={e => setFilter(f => ({ ...f, module: e.target.value }))}>
// // //           <option value="all">All Modules</option>
// // //           {MODULES.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
// // //         </select>
// // //         {selected.size > 0 && (
// // //           <div style={S.bulkBar}>
// // //             <span style={S.bulkCount}>{selected.size} selected</span>
// // //             {canPublish && <button style={S.bulkBtn} onClick={() => bulkAction("published")}>Publish all</button>}
// // //             <button style={{ ...S.bulkBtn, color: "#d49090" }} onClick={() => bulkAction("archived")}>Archive all</button>
// // //             <button style={{ ...S.bulkBtn, color: "#aaa" }} onClick={() => setSelected(new Set())}>Clear</button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Table */}
// // //       <div style={S.table}>
// // //         <div style={S.tableHead}>
// // //           <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(t => t._id)) : new Set())} style={{ marginRight: 4 }} />
// // //           <span style={{ flex: 3 }}>Title</span>
// // //           <span style={{ flex: 1 }}>Module</span>
// // //           <span style={{ flex: 1 }}>Status</span>
// // //           <span style={{ flex: 1 }}>Level</span>
// // //           <span style={{ flex: 1 }}>Updated</span>
// // //           <span style={{ flex: 1 }}>Actions</span>
// // //         </div>

// // //         {loading ? (
// // //           <div style={S.tableEmpty}>Loading…</div>
// // //         ) : filtered.length === 0 ? (
// // //           <div style={S.tableEmpty}>No topics found</div>
// // //         ) : filtered.map(topic => {
// // //           const sc = STATUS_CONFIG[topic.status] || STATUS_CONFIG.draft;
// // //           const mod = MODULES.find(m => m.id === topic.moduleId);
// // //           return (
// // //             <div key={topic._id} style={{ ...S.tableRow, background: selected.has(topic._id) ? "#f0f8f0" : "#fff" }}>
// // //               <input
// // //                 type="checkbox"
// // //                 checked={selected.has(topic._id)}
// // //                 onChange={e => {
// // //                   const next = new Set(selected);
// // //                   e.target.checked ? next.add(topic._id) : next.delete(topic._id);
// // //                   setSelected(next);
// // //                 }}
// // //                 style={{ marginRight: 4 }}
// // //               />
// // //               <div style={{ flex: 3, minWidth: 0 }}>
// // //                 <span style={S.topicTitle}>{topic.title}</span>
// // //                 <span style={S.topicMeta}>by {topic.createdBy} · {topic.readTime}</span>
// // //               </div>
// // //               <span style={{ flex: 1, fontSize: 11, color: "#888" }}>{mod?.title || `Module ${topic.moduleId}`}</span>
// // //               <span style={{ flex: 1 }}>
// // //                 <span style={{ ...S.statusPill, background: sc.bg, color: sc.color }}>{sc.label}</span>
// // //               </span>
// // //               <span style={{ flex: 1, fontSize: 11, color: "#888" }}>{topic.level === "b" ? "Beginner" : "Intermediate"}</span>
// // //               <span style={{ flex: 1, fontSize: 11, color: "#bbb" }}>{timeAgo(topic.updatedAt)}</span>
// // //               <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "wrap" }}>
// // //                 <Link href={`/admin/content/${topic._id}/edit`} style={S.actionBtn}>Edit</Link>
// // //                 {topic.status !== "published" && canPublish && (
// // //                   <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }} onClick={() => changeStatus(topic._id, "published")}>
// // //                     Publish
// // //                   </button>
// // //                 )}
// // //                 {topic.status === "published" && canPublish && (
// // //                   <button style={{ ...S.actionBtn, color: "#888" }} onClick={() => changeStatus(topic._id, "draft")}>
// // //                     Unpublish
// // //                   </button>
// // //                 )}
// // //                 {topic.status !== "archived" && (
// // //                   <button style={{ ...S.actionBtn, color: "#d49090", borderColor: "#d4909044" }} onClick={() => changeStatus(topic._id, "archived")}>
// // //                     Archive
// // //                   </button>
// // //                 )}
// // //                 {canDelete && (
// // //                   <button style={{ ...S.actionBtn, color: "#c00", borderColor: "#c0000044" }} onClick={() => deleteTopic(topic._id)}>
// // //                     Delete
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           );
// // //         })}
// // //       </div>

// // //       <div style={S.tableFooter}>
// // //         Showing {filtered.length} of {topics.length} topics
// // //         {canPublish && <span style={S.liveNote}>◉ Changes publish live to Learner Hub instantly</span>}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function timeAgo(iso) {
// // //   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
// // //   if (d < 1) return "just now";
// // //   if (d < 60) return `${d}m ago`;
// // //   if (d < 1440) return `${Math.floor(d / 60)}h ago`;
// // //   return `${Math.floor(d / 1440)}d ago`;
// // // }

// // // const S = {
// // //   page:        { padding: "32px 40px", maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
// // //   toast:       { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
// // //   header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
// // //   heading:     { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
// // //   sub:         { fontSize: 13, color: "#aaa" },
// // //   newBtn:      { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", background: "#1a1208", color: "#F0E8D6", borderRadius: 6, textDecoration: "none", fontWeight: 500 },
// // //   filters:     { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" },
// // //   search:      { fontSize: 12, padding: "8px 14px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", width: 220, fontFamily: "'DM Sans',sans-serif" },
// // //   select:      { fontSize: 12, padding: "8px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" },
// // //   bulkBar:     { display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#1a1208", borderRadius: 8 },
// // //   bulkCount:   { fontSize: 11, color: "#F0E8D6", fontWeight: 500 },
// // //   bulkBtn:     { fontSize: 11, background: "none", border: "none", color: "#F0E8D6", cursor: "pointer", letterSpacing: ".04em" },
// // //   table:       { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden" },
// // //   tableHead:   { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#fafaf8", borderBottom: "1px solid #ededea", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa" },
// // //   tableRow:    { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f5f5f2", transition: "background .1s" },
// // //   tableEmpty:  { padding: "40px 0", textAlign: "center", fontSize: 13, color: "#bbb" },
// // //   tableFooter: { padding: "12px 16px", fontSize: 11, color: "#bbb", display: "flex", justifyContent: "space-between" },
// // //   topicTitle:  { display: "block", fontSize: 13, fontWeight: 400, color: "#1a1208", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
// // //   topicMeta:   { display: "block", fontSize: 10, color: "#bbb" },
// // //   statusPill:  { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, fontWeight: 600 },
// // //   actionBtn:   { fontSize: 10, padding: "4px 10px", border: "1.5px solid #e8e8e4", borderRadius: 5, background: "#fff", cursor: "pointer", color: "#555", textDecoration: "none", letterSpacing: ".03em" },
// // //   liveNote:    { color: "#7ec87e", fontWeight: 500 },
// // // };
// // "use client";
// // // app/admin/content/page.js
// // // Content OS — every status change pushes via Socket.io to frontend resources page

// // import { useState, useEffect, useCallback } from "react";
// // import Link from "next/link";
// // import { useAdminAuthStore } from "@/store/adminAuthStore";
// // import { api } from "@/services/api";
// // import { useSocket } from "@/hooks/useSocket";

// // const STATUS_CONFIG = {
// //   published: { label:"Published", color:"#7ec87e", bg:"#7ec87e18" },
// //   draft:     { label:"Draft",     color:"#C9A96E", bg:"#C9A96E18" },
// //   review:    { label:"In Review", color:"#7eb8d8", bg:"#7eb8d818" },
// //   archived:  { label:"Archived",  color:"#aaa",    bg:"#aaa22"    },
// // };

// // const MODULES = [
// //   {id:0,title:"Creator Foundations"},{id:1,title:"Content Creation System"},
// //   {id:2,title:"Studio & Team Setup"},{id:3,title:"Platform Growth & Algorithms"},
// //   {id:4,title:"Collabs & Community"},{id:5,title:"Monetization & Brand Deals"},
// //   {id:6,title:"Creator Operations & Legal"},{id:7,title:"Scaling & Career Growth"},
// // ];

// // function timeAgo(iso) {
// //   const d=Math.floor((Date.now()-new Date(iso))/60000);
// //   if(d<1)return"just now";if(d<60)return`${d}m ago`;
// //   if(d<1440)return`${Math.floor(d/60)}h ago`;return`${Math.floor(d/1440)}d ago`;
// // }

// // export default function ContentOS() {
// //   const { user } = useAdminAuthStore();
// //   const [topics, setTopics]   = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filter, setFilter]   = useState({ status:"all", module:"all", search:"" });
// //   const [selected, setSelected] = useState(new Set());
// //   const [toast, setToast]     = useState(null);

// //   const canPublish = ["superAdmin","contentManager"].includes(user?.role);
// //   const canDelete  = user?.role === "superAdmin";
// //   const moduleIds  = user?.role === "moduleMaster" ? (user?.assignedModules || []) : null;

// //   const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

// //   const fetchTopics = useCallback(async () => {
// //     try {
// //       const params = new URLSearchParams();
// //       if (filter.status !== "all") params.set("status", filter.status);
// //       if (filter.module !== "all") params.set("moduleId", filter.module);
// //       if (filter.search) params.set("search", filter.search);
// //       if (moduleIds?.length) params.set("moduleIds", moduleIds.join(","));
// //       const data = await api.get(`/admin/content?${params}`);
// //       setTopics(data?.data?.topics || []);
// //     } catch {
// //       setTopics([
// //         { _id:"t1",title:"Creator vs Influencer",moduleId:0,status:"published",level:"b",readTime:"8 min",updatedAt:new Date().toISOString(),createdByName:"Admin" },
// //         { _id:"t2",title:"Choosing a Niche",     moduleId:0,status:"published",level:"b",readTime:"12 min",updatedAt:new Date().toISOString(),createdByName:"Admin" },
// //         { _id:"t3",title:"Instagram Algorithm",  moduleId:3,status:"draft",    level:"i",readTime:"18 min",updatedAt:new Date().toISOString(),createdByName:"Kiran M." },
// //         { _id:"t4",title:"Brand Deal Rate Card", moduleId:5,status:"review",   level:"i",readTime:"10 min",updatedAt:new Date().toISOString(),createdByName:"Priya S." },
// //       ]);
// //     }
// //     setLoading(false);
// //   }, [filter, moduleIds]);

// //   useEffect(() => { fetchTopics(); }, [fetchTopics]);

// //   // Live: refetch when any topic event arrives from another admin session
// //   useSocket({ "topic:published": fetchTopics, "topic:archived": fetchTopics, "topic:deleted": fetchTopics });

// //   const changeStatus = async (id, status) => {
// //     try {
// //       await api.patch(`/admin/content/${id}/status`, { status });
// //       setTopics(ts => ts.map(t => t._id===id ? {...t,status} : t));
// //       showToast(status==="published" ? "Published — live on Learner Hub ◉" : status==="archived" ? "Archived" : "Updated");
// //     } catch { showToast("Failed", false); }
// //   };

// //   const deleteTopic = async (id) => {
// //     if (!confirm("Permanently delete? Cannot be undone.")) return;
// //     try {
// //       await api.delete(`/admin/content/${id}`);
// //       setTopics(ts => ts.filter(t => t._id !== id));
// //       showToast("Deleted");
// //     } catch { showToast("Delete failed", false); }
// //   };

// //   const bulkAction = async (action) => {
// //     await Promise.all([...selected].map(id => changeStatus(id, action)));
// //     setSelected(new Set());
// //   };

// //   const filtered = topics.filter(t => {
// //     if (filter.status !== "all" && t.status !== filter.status) return false;
// //     if (filter.module !== "all" && t.moduleId !== parseInt(filter.module)) return false;
// //     if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
// //     return true;
// //   });

// //   return (
// //     <div style={S.page}>
// //       {toast && <div style={{...S.toast,background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Content OS</h1>
// //           <p style={S.sub}>All topics across all modules. Status changes reflect live on the Learner Hub via Socket.io.</p>
// //         </div>
// //         <Link href="/admin/content/new" style={S.newBtn}>+ New Topic</Link>
// //       </div>

// //       <div style={S.filters}>
// //         <input style={S.search} placeholder="Search topics…" value={filter.search}
// //           onChange={e=>setFilter(f=>({...f,search:e.target.value}))}/>
// //         <select style={S.select} value={filter.status} onChange={e=>setFilter(f=>({...f,status:e.target.value}))}>
// //           <option value="all">All Status</option>
// //           {["published","draft","review","archived"].map(s=><option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
// //         </select>
// //         <select style={S.select} value={filter.module} onChange={e=>setFilter(f=>({...f,module:e.target.value}))}>
// //           <option value="all">All Modules</option>
// //           {MODULES.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}
// //         </select>
// //         {selected.size > 0 && (
// //           <div style={S.bulkBar}>
// //             <span style={S.bulkCount}>{selected.size} selected</span>
// //             {canPublish && <button style={S.bulkBtn} onClick={()=>bulkAction("published")}>Publish all</button>}
// //             <button style={{...S.bulkBtn,color:"#d49090"}} onClick={()=>bulkAction("archived")}>Archive all</button>
// //             <button style={{...S.bulkBtn,color:"#aaa"}} onClick={()=>setSelected(new Set())}>Clear</button>
// //           </div>
// //         )}
// //       </div>

// //       <div style={S.table}>
// //         <div style={S.thead}>
// //           <input type="checkbox" onChange={e=>setSelected(e.target.checked?new Set(filtered.map(t=>t._id)):new Set())} style={{marginRight:4}}/>
// //           <span style={{flex:3}}>Title</span>
// //           <span style={{flex:1}}>Module</span>
// //           <span style={{flex:1}}>Status</span>
// //           <span style={{flex:1}}>Level</span>
// //           <span style={{flex:1}}>Updated</span>
// //           <span style={{flex:1}}>Actions</span>
// //         </div>

// //         {loading ? <div style={S.tempty}>Loading…</div> :
// //          filtered.length===0 ? <div style={S.tempty}>No topics found</div> :
// //          filtered.map(t => {
// //            const sc  = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
// //            const mod = MODULES.find(m=>m.id===t.moduleId);
// //            return (
// //              <div key={t._id} style={{...S.trow,background:selected.has(t._id)?"#f5fbf5":"#fff"}}>
// //                <input type="checkbox" checked={selected.has(t._id)} style={{marginRight:4}}
// //                  onChange={e=>{const n=new Set(selected);e.target.checked?n.add(t._id):n.delete(t._id);setSelected(n);}}/>
// //                <div style={{flex:3,minWidth:0}}>
// //                  <span style={S.topicTitle}>{t.title}</span>
// //                  <span style={S.topicMeta}>by {t.createdByName||"—"} · {t.readTime}</span>
// //                </div>
// //                <span style={{flex:1,fontSize:11,color:"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mod?.title||`Module ${t.moduleId}`}</span>
// //                <span style={{flex:1}}><span style={{...S.statusPill,background:sc.bg,color:sc.color}}>{sc.label}</span></span>
// //                <span style={{flex:1,fontSize:11,color:"#888"}}>{t.level==="b"?"Beginner":"Intermediate"}</span>
// //                <span style={{flex:1,fontSize:11,color:"#bbb"}}>{timeAgo(t.updatedAt)}</span>
// //                <div style={{flex:1,display:"flex",gap:4,flexWrap:"wrap"}}>
// //                  <Link href={`/admin/content/${t._id}/edit`} style={S.actionBtn}>Edit</Link>
// //                  {t.status!=="published" && canPublish && (
// //                    <button style={{...S.actionBtn,color:"#3a7c3a",borderColor:"#7ec87e44"}} onClick={()=>changeStatus(t._id,"published")}>Publish</button>
// //                  )}
// //                  {t.status==="published" && canPublish && (
// //                    <button style={{...S.actionBtn,color:"#888"}} onClick={()=>changeStatus(t._id,"draft")}>Unpublish</button>
// //                  )}
// //                  {t.status!=="review" && user?.role==="moduleMaster" && t.status==="draft" && (
// //                    <button style={{...S.actionBtn,color:"#7eb8d8",borderColor:"#7eb8d844"}} onClick={()=>changeStatus(t._id,"review")}>Submit</button>
// //                  )}
// //                  {t.status!=="archived" && (
// //                    <button style={{...S.actionBtn,color:"#d49090",borderColor:"#d4909044"}} onClick={()=>changeStatus(t._id,"archived")}>Archive</button>
// //                  )}
// //                  {canDelete && (
// //                    <button style={{...S.actionBtn,color:"#c00",borderColor:"#c0000044"}} onClick={()=>deleteTopic(t._id)}>Delete</button>
// //                  )}
// //                </div>
// //              </div>
// //            );
// //          })
// //         }
// //       </div>

// //       <div style={S.foot}>
// //         <span>Showing {filtered.length} of {topics.length} topics</span>
// //         {canPublish && <span style={{color:"#7ec87e",fontWeight:500}}>◉ Published topics go live on Learner Hub instantly via Socket.io</span>}
// //       </div>
// //     </div>
// //   );
// // }

// // const S = {
// //   page:    { padding:"32px 40px",maxWidth:1200,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
// //   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
// //   header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 },
// //   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
// //   sub:     { fontSize:13,color:"#aaa" },
// //   newBtn:  { fontSize:11,letterSpacing:".1em",textTransform:"uppercase",padding:"10px 20px",background:"#1a1208",color:"#F0E8D6",borderRadius:6,textDecoration:"none",fontWeight:500 },
// //   filters: { display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center" },
// //   search:  { fontSize:12,padding:"8px 14px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",width:220,fontFamily:"'DM Sans',sans-serif" },
// //   select:  { fontSize:12,padding:"8px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif",cursor:"pointer" },
// //   bulkBar: { display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"#1a1208",borderRadius:8 },
// //   bulkCount:{ fontSize:11,color:"#F0E8D6",fontWeight:500 },
// //   bulkBtn: { fontSize:11,background:"none",border:"none",color:"#F0E8D6",cursor:"pointer",letterSpacing:".04em" },
// //   table:   { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
// //   thead:   { display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"#fafaf8",borderBottom:"1px solid #ededea",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa" },
// //   trow:    { display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid #f5f5f2",transition:"background .1s" },
// //   tempty:  { padding:"40px 0",textAlign:"center",fontSize:13,color:"#bbb" },
// //   topicTitle:{ display:"block",fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" },
// //   topicMeta: { display:"block",fontSize:10,color:"#bbb" },
// //   statusPill:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,fontWeight:600 },
// //   actionBtn: { fontSize:10,padding:"4px 10px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",cursor:"pointer",color:"#555",textDecoration:"none",letterSpacing:".03em" },
// //   foot:    { padding:"10px 16px",fontSize:11,color:"#bbb",display:"flex",justifyContent:"space-between",marginTop:4 },
// // };

// "use client";
// // app/admin/content/page.js
// // Permission-aware Content OS — changes reflect LIVE on resources page via Socket.io

// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";

// const STATUS_CONFIG = {
//   published: { label: "Published", color: "#7ec87e", bg: "#7ec87e18" },
//   draft:     { label: "Draft",     color: "#C9A96E", bg: "#C9A96E18" },
//   review:    { label: "In Review", color: "#7eb8d8", bg: "#7eb8d818" },
//   archived:  { label: "Archived",  color: "#aaa",    bg: "#aaa22"    },
// };

// const MODULES = [
//   { id: 0, title: "Creator Foundations" },
//   { id: 1, title: "Content Creation System" },
//   { id: 2, title: "Studio & Team Setup" },
//   { id: 3, title: "Platform Growth & Algorithms" },
//   { id: 4, title: "Collabs & Community" },
//   { id: 5, title: "Monetization & Brand Deals" },
//   { id: 6, title: "Creator Operations & Legal" },
//   { id: 7, title: "Scaling & Career Growth" },
// ];

// function timeAgo(iso) {
//   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
//   if (d < 1) return "just now";
//   if (d < 60) return `${d}m ago`;
//   if (d < 1440) return `${Math.floor(d/60)}h ago`;
//   return `${Math.floor(d/1440)}d ago`;
// }

// export default function ContentOS() {
//   const { user } = useAdminAuthStore();
//   const role = user?.role;

//   // ── Permission flags per role
//   const canCreate   = ["superAdmin","contentManager","moduleMaster"].includes(role);
//   const canEdit     = ["superAdmin","contentManager","moduleMaster"].includes(role);
//   const canPublish  = ["superAdmin","contentManager"].includes(role);
//   const canDelete   = role === "superAdmin";
//   const canArchive  = ["superAdmin","contentManager"].includes(role);
//   const canApprove  = ["superAdmin","contentManager"].includes(role);
//   const isReadOnly  = role === "supportAgent";
//   const isMM        = role === "moduleMaster";

//   // moduleMaster sees only assigned modules
//   const assignedModules = isMM ? (user?.assignedModules || []) : null;

//   const [topics, setTopics]     = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [filter, setFilter]     = useState({ status: "all", module: "all", search: "" });
//   const [selected, setSelected] = useState(new Set());
//   const [toast, setToast]       = useState(null);

//   const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

//   const fetchTopics = useCallback(async () => {
//     try {
//       const params = new URLSearchParams();
//       if (filter.status !== "all") params.set("status", filter.status);
//       if (filter.module !== "all") params.set("moduleId", filter.module);
//       if (filter.search) params.set("search", filter.search);
//       if (assignedModules?.length) params.set("moduleIds", assignedModules.join(","));
//       const data = await api.get(`/admin/content?${params}`);
//       setTopics(data?.data?.topics || []);
//     } catch {
//       setTopics([
//         { _id:"t1", title:"Creator vs Influencer", moduleId:0, status:"published", level:"b", readTime:"8 min",  updatedAt:new Date().toISOString(), createdByName:"Admin"    },
//         { _id:"t2", title:"Choosing a Niche",      moduleId:0, status:"published", level:"b", readTime:"12 min", updatedAt:new Date().toISOString(), createdByName:"Admin"    },
//         { _id:"t3", title:"Instagram Algorithm",   moduleId:3, status:"draft",     level:"i", readTime:"18 min", updatedAt:new Date().toISOString(), createdByName:"Kiran M." },
//         { _id:"t4", title:"Brand Deal Rate Card",  moduleId:5, status:"review",    level:"i", readTime:"10 min", updatedAt:new Date().toISOString(), createdByName:"Priya S." },
//         { _id:"t5", title:"YouTube SEO",           moduleId:3, status:"draft",     level:"i", readTime:"22 min", updatedAt:new Date().toISOString(), createdByName:"Arjun R." },
//         { _id:"t6", title:"Old Algorithm 2022",    moduleId:3, status:"archived",  level:"b", readTime:"6 min",  updatedAt:new Date().toISOString(), createdByName:"Admin"    },
//       ]);
//     }
//     setLoading(false);
//   }, [filter, JSON.stringify(assignedModules)]);

//   useEffect(() => { fetchTopics(); }, [fetchTopics]);

//   // Live sync — when any topic changes status, refetch
//   useSocket({
//     "topic:published": fetchTopics,
//     "topic:archived":  fetchTopics,
//     "topic:deleted":   fetchTopics,
//     "topic:updated":   fetchTopics,
//   });

//   const changeStatus = async (id, status) => {
//     try {
//       await api.patch(`/admin/content/${id}/status`, { status });
//       setTopics(ts => ts.map(t => t._id === id ? { ...t, status } : t));
//       const msg =
//         status === "published" ? "Published live ◉ — visible on Learner Hub instantly" :
//         status === "archived"  ? "Archived — removed from Learner Hub" :
//         status === "review"    ? "Submitted for review" : "Updated";
//       showToast(msg);
//     } catch { showToast("Failed to update", false); }
//   };

//   const deleteTopic = async (id) => {
//     if (!confirm("Permanently delete? Cannot be undone.")) return;
//     try {
//       await api.delete(`/admin/content/${id}`);
//       setTopics(ts => ts.filter(t => t._id !== id));
//       showToast("Deleted");
//     } catch { showToast("Delete failed", false); }
//   };

//   const bulkAction = async (action) => {
//     await Promise.all([...selected].map(id => changeStatus(id, action)));
//     setSelected(new Set());
//     showToast(`Bulk ${action} complete`);
//   };

//   const filtered = topics.filter(t => {
//     if (filter.status !== "all" && t.status !== filter.status) return false;
//     if (filter.module !== "all" && t.moduleId !== parseInt(filter.module)) return false;
//     if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
//     if (assignedModules && !assignedModules.includes(t.moduleId)) return false;
//     return true;
//   });

//   // Available modules for this role
//   const visibleModules = assignedModules
//     ? MODULES.filter(m => assignedModules.includes(m.id))
//     : MODULES;

//   const accent = { superAdmin:"#C9A96E", contentManager:"#b89fd4", moduleMaster:"#7eb8d8", supportAgent:"#7ec87e" }[role] || "#C9A96E";

//   return (
//     <div style={S.page}>
//       {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Content OS</h1>
//           <p style={S.sub}>
//             {isReadOnly ? "Read-only view — browse all published topics to assist learners." :
//              isMM       ? `Your modules: ${visibleModules.map(m=>m.title).join(", ")}` :
//              "All topics across all modules. Publish → live on Learner Hub instantly."}
//           </p>
//         </div>
//         <div style={{ display:"flex", gap:10, alignItems:"center" }}>
//           {canPublish && <span style={S.liveNote}>◉ Publish = instant live update</span>}
//           {canCreate && (
//             <Link href="/admin/content/new" style={{ ...S.newBtn, background: accent, color: "#1a1200" }}>
//               + New Topic
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Role banner for read-only */}
//       {isReadOnly && (
//         <div style={S.readOnlyBanner}>
//           ◎ Support Agent — read-only view. Content editing is not available for your role.
//         </div>
//       )}

//       {/* Filters */}
//       <div style={S.filters}>
//         <input style={S.search} placeholder="Search topics…" value={filter.search}
//           onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
//         <select style={S.select} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
//           <option value="all">All Status</option>
//           {["published","draft","review","archived"].map(s =>
//             <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
//           )}
//         </select>
//         <select style={S.select} value={filter.module} onChange={e => setFilter(f => ({ ...f, module: e.target.value }))}>
//           <option value="all">All Modules</option>
//           {visibleModules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
//         </select>

//         {/* Bulk actions — only for roles that can edit */}
//         {selected.size > 0 && canPublish && (
//           <div style={S.bulkBar}>
//             <span style={S.bulkCount}>{selected.size} selected</span>
//             <button style={S.bulkBtn} onClick={() => bulkAction("published")}>Publish all</button>
//             <button style={{ ...S.bulkBtn, color: "#d49090" }} onClick={() => bulkAction("archived")}>Archive all</button>
//             <button style={{ ...S.bulkBtn, color: "#aaa" }} onClick={() => setSelected(new Set())}>Clear</button>
//           </div>
//         )}
//       </div>

//       {/* Table */}
//       <div style={S.table}>
//         <div style={S.thead}>
//           {!isReadOnly && (
//             <input type="checkbox" style={{ marginRight: 8 }}
//               onChange={e => setSelected(e.target.checked ? new Set(filtered.map(t => t._id)) : new Set())} />
//           )}
//           <span style={{ flex: 3 }}>Title</span>
//           <span style={{ flex: 1 }}>Module</span>
//           <span style={{ flex: 1 }}>Status</span>
//           <span style={{ flex: 1 }}>Level</span>
//           <span style={{ flex: 1 }}>Updated</span>
//           <span style={{ flex: isReadOnly ? 0.5 : 1.5 }}>Actions</span>
//         </div>

//         {loading ? <div style={S.tempty}>Loading…</div> :
//          filtered.length === 0 ? <div style={S.tempty}>No topics found</div> :
//          filtered.map(t => {
//            const sc  = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
//            const mod = MODULES.find(m => m.id === t.moduleId);
//            const isOwn = t.createdByName === user?.name || t.createdById === user?._id;
//            const canEditThis = canEdit && (role !== "moduleMaster" || isOwn || assignedModules?.includes(t.moduleId));

//            return (
//              <div key={t._id} style={{ ...S.trow, background: selected.has(t._id) ? "#f5fbf5" : "#fff" }}>
//                {!isReadOnly && (
//                  <input type="checkbox" checked={selected.has(t._id)} style={{ marginRight: 8 }}
//                    onChange={e => { const n = new Set(selected); e.target.checked ? n.add(t._id) : n.delete(t._id); setSelected(n); }} />
//                )}
//                <div style={{ flex: 3, minWidth: 0 }}>
//                  <span style={S.topicTitle}>{t.title}</span>
//                  <span style={S.topicMeta}>by {t.createdByName || "—"} · {t.readTime}</span>
//                </div>
//                <span style={{ flex: 1, fontSize: 11, color: "#888", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
//                  {mod?.title || `Module ${t.moduleId}`}
//                </span>
//                <span style={{ flex: 1 }}>
//                  <span style={{ ...S.statusPill, background: sc.bg, color: sc.color }}>{sc.label}</span>
//                </span>
//                <span style={{ flex: 1, fontSize: 11, color: "#888" }}>
//                  {t.level === "b" ? "Beginner" : "Intermediate"}
//                </span>
//                <span style={{ flex: 1, fontSize: 11, color: "#bbb" }}>{timeAgo(t.updatedAt)}</span>

//                <div style={{ flex: isReadOnly ? 0.5 : 1.5, display: "flex", gap: 4, flexWrap: "wrap" }}>
//                  {/* Read-only preview for all roles */}
//                  <Link href={`/resources/courses/${t.slug || t._id}`} target="_blank" style={{ ...S.actionBtn, color: "#7eb8d8", borderColor: "#7eb8d844" }}>
//                    Preview
//                  </Link>

//                  {/* Edit — not for supportAgent */}
//                  {canEditThis && (
//                    <Link href={`/admin/content/${t._id}/edit`} style={S.actionBtn}>Edit</Link>
//                  )}

//                  {/* Submit for review — moduleMaster only on drafts */}
//                  {isMM && t.status === "draft" && isOwn && (
//                    <button style={{ ...S.actionBtn, color: "#7eb8d8", borderColor: "#7eb8d844" }}
//                      onClick={() => changeStatus(t._id, "review")}>Submit</button>
//                  )}

//                  {/* Approve — contentManager and superAdmin on review items */}
//                  {canApprove && t.status === "review" && (
//                    <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }}
//                      onClick={() => changeStatus(t._id, "published")}>✓ Approve</button>
//                  )}

//                  {/* Publish — superAdmin + contentManager on non-published */}
//                  {canPublish && t.status !== "published" && t.status !== "review" && (
//                    <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }}
//                      onClick={() => changeStatus(t._id, "published")}>Publish</button>
//                  )}

//                  {/* Unpublish */}
//                  {canPublish && t.status === "published" && (
//                    <button style={{ ...S.actionBtn, color: "#888" }}
//                      onClick={() => changeStatus(t._id, "draft")}>Unpublish</button>
//                  )}

//                  {/* Archive */}
//                  {canArchive && t.status !== "archived" && (
//                    <button style={{ ...S.actionBtn, color: "#d49090", borderColor: "#d4909044" }}
//                      onClick={() => changeStatus(t._id, "archived")}>Archive</button>
//                  )}

//                  {/* Delete — superAdmin only */}
//                  {canDelete && (
//                    <button style={{ ...S.actionBtn, color: "#c00", borderColor: "#c0000044" }}
//                      onClick={() => deleteTopic(t._id)}>Delete</button>
//                  )}
//                </div>
//              </div>
//            );
//          })
//         }
//       </div>

//       <div style={S.foot}>
//         <span>Showing {filtered.length} of {topics.length} topics</span>
//         {canPublish && <span style={{ color: "#7ec87e", fontWeight: 500 }}>◉ Published topics go live on Learner Hub via Socket.io — no refresh needed</span>}
//         {isReadOnly && <span style={{ color: "#aaa" }}>◎ Read-only — contact Content Manager to make changes</span>}
//       </div>
//     </div>
//   );
// }

// const S = {
//   page:          { padding: "32px 40px", maxWidth: 1300, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
//   toast:         { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
//   header:        { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
//   heading:       { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
//   sub:           { fontSize: 13, color: "#aaa", maxWidth: 600 },
//   liveNote:      { fontSize: 11, color: "#7ec87e", fontWeight: 500 },
//   newBtn:        { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", border: "none", borderRadius: 6, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
//   readOnlyBanner:{ background: "#7ec87e18", border: "1px solid #7ec87e44", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#3a7c3a", marginBottom: 16 },
//   filters:       { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" },
//   search:        { fontSize: 12, padding: "8px 14px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", width: 220, fontFamily: "'DM Sans',sans-serif" },
//   select:        { fontSize: 12, padding: "8px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" },
//   bulkBar:       { display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#1a1208", borderRadius: 8 },
//   bulkCount:     { fontSize: 11, color: "#F0E8D6", fontWeight: 500 },
//   bulkBtn:       { fontSize: 11, background: "none", border: "none", color: "#F0E8D6", cursor: "pointer", letterSpacing: ".04em" },
//   table:         { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden" },
//   thead:         { display: "flex", alignItems: "center", padding: "10px 16px", background: "#fafaf8", borderBottom: "1px solid #ededea", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", gap: 8 },
//   trow:          { display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f5f5f2", transition: "background .1s", gap: 8 },
//   tempty:        { padding: "40px 0", textAlign: "center", fontSize: 13, color: "#bbb" },
//   topicTitle:    { display: "block", fontSize: 13, fontWeight: 400, color: "#1a1208", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
//   topicMeta:     { display: "block", fontSize: 10, color: "#bbb" },
//   statusPill:    { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, fontWeight: 600 },
//   actionBtn:     { fontSize: 10, padding: "4px 10px", border: "1.5px solid #e8e8e4", borderRadius: 5, background: "#fff", cursor: "pointer", color: "#555", textDecoration: "none", letterSpacing: ".03em", whiteSpace: "nowrap" },
//   foot:          { padding: "10px 16px", fontSize: 11, color: "#bbb", display: "flex", justifyContent: "space-between", marginTop: 4 },
// };

// // "use client";
// // // app/admin/content/page.js — Content OS
// // // Create / Edit / Publish / Archive topics — changes reflect live on resources page

// // import { useState, useEffect, useCallback } from "react";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import { useAuthStore } from "@/store/authStore";

// // const STATUS_CONFIG = {
// //   published: { label: "Published", color: "#7ec87e", bg: "#7ec87e18" },
// //   draft:     { label: "Draft",     color: "#C9A96E", bg: "#C9A96E18" },
// //   review:    { label: "In Review", color: "#7eb8d8", bg: "#7eb8d818" },
// //   archived:  { label: "Archived",  color: "#aaa",    bg: "#aaa18"    },
// // };

// // const MODULES = [
// //   { id: 0, title: "Creator Foundations" },
// //   { id: 1, title: "Content Creation System" },
// //   { id: 2, title: "Studio & Team Setup" },
// //   { id: 3, title: "Platform Growth & Algorithms" },
// //   { id: 4, title: "Collabs & Community" },
// //   { id: 5, title: "Monetization & Brand Deals" },
// //   { id: 6, title: "Creator Operations & Legal" },
// //   { id: 7, title: "Scaling & Career Growth" },
// // ];

// // export default function ContentOS() {
// //   const { user } = useAuthStore();
// //   const router   = useRouter();
// //   const [topics, setTopics]         = useState([]);
// //   const [loading, setLoading]       = useState(true);
// //   const [filter, setFilter]         = useState({ status: "all", module: "all", search: "" });
// //   const [selected, setSelected]     = useState(new Set());
// //   const [notification, setNotif]    = useState(null);

// //   const canPublish = ["superAdmin", "contentManager"].includes(user?.role);
// //   const canDelete  = user?.role === "superAdmin";
// //   const moduleIds  = user?.role === "moduleMaster" ? (user?.assignedModules || []) : null;

// //   const fetchTopics = useCallback(async () => {
// //     try {
// //       const params = new URLSearchParams();
// //       if (filter.status !== "all") params.set("status", filter.status);
// //       if (filter.module !== "all") params.set("moduleId", filter.module);
// //       if (filter.search) params.set("search", filter.search);
// //       if (moduleIds) params.set("moduleIds", moduleIds.join(","));
// //       const res = await fetch(`/api/admin/content?${params}`);
// //       const data = await res.json();
// //       setTopics(data.data?.topics || []);
// //     } catch {
// //       // Dev fallback
// //       setTopics([
// //         { _id: "t1", title: "Creator vs Influencer: The Fundamental Difference", moduleId: 0, status: "published", level: "b", readTime: "8 min", updatedAt: new Date().toISOString(), createdBy: "Admin" },
// //         { _id: "t2", title: "Choosing a Niche That Compounds", moduleId: 0, status: "published", level: "b", readTime: "12 min", updatedAt: new Date().toISOString(), createdBy: "Admin" },
// //         { _id: "t3", title: "Instagram Algorithm Decoded", moduleId: 3, status: "draft", level: "i", readTime: "18 min", updatedAt: new Date().toISOString(), createdBy: "Kiran M." },
// //         { _id: "t4", title: "Brand Deal Rate Card Template", moduleId: 5, status: "review", level: "i", readTime: "10 min", updatedAt: new Date().toISOString(), createdBy: "Priya S." },
// //         { _id: "t5", title: "YouTube SEO Masterclass", moduleId: 3, status: "draft", level: "i", readTime: "22 min", updatedAt: new Date().toISOString(), createdBy: "Arjun R." },
// //         { _id: "t6", title: "Old Algorithm Guide 2022", moduleId: 3, status: "archived", level: "b", readTime: "6 min", updatedAt: new Date().toISOString(), createdBy: "Admin" },
// //       ]);
// //     }
// //     setLoading(false);
// //   }, [filter, moduleIds]);

// //   useEffect(() => { fetchTopics(); }, [fetchTopics]);

// //   const showNotif = (msg, type = "success") => {
// //     setNotif({ msg, type });
// //     setTimeout(() => setNotif(null), 3000);
// //   };

// //   const changeStatus = async (id, status) => {
// //     try {
// //       await fetch(`/api/admin/content/${id}/status`, {
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ status }),
// //       });
// //       setTopics(ts => ts.map(t => t._id === id ? { ...t, status } : t));
// //       showNotif(`Topic ${status === "published" ? "published" : status === "archived" ? "archived" : "updated"} — live on Learner Hub`);
// //     } catch { showNotif("Failed to update", "error"); }
// //   };

// //   const bulkAction = async (action) => {
// //     const ids = [...selected];
// //     await Promise.all(ids.map(id => changeStatus(id, action)));
// //     setSelected(new Set());
// //   };

// //   const deleteTopic = async (id) => {
// //     if (!confirm("Permanently delete this topic? This cannot be undone.")) return;
// //     await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
// //     setTopics(ts => ts.filter(t => t._id !== id));
// //     showNotif("Topic deleted");
// //   };

// //   const filtered = topics.filter(t => {
// //     if (filter.status !== "all" && t.status !== filter.status) return false;
// //     if (filter.module !== "all" && t.moduleId !== parseInt(filter.module)) return false;
// //     if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
// //     return true;
// //   });

// //   return (
// //     <div style={S.page}>
// //       {/* Notification toast */}
// //       {notification && (
// //         <div style={{ ...S.toast, background: notification.type === "error" ? "#d49090" : "#7ec87e" }}>
// //           {notification.msg}
// //         </div>
// //       )}

// //       {/* Header */}
// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Content OS</h1>
// //           <p style={S.sub}>All topics across all modules. Changes publish live to the Learner Hub.</p>
// //         </div>
// //         <Link href="/admin/content/new" style={S.newBtn}>+ New Topic</Link>
// //       </div>

// //       {/* Filters */}
// //       <div style={S.filters}>
// //         <input
// //           style={S.search}
// //           placeholder="Search topics…"
// //           value={filter.search}
// //           onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
// //         />
// //         <select style={S.select} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
// //           <option value="all">All Status</option>
// //           <option value="published">Published</option>
// //           <option value="draft">Draft</option>
// //           <option value="review">In Review</option>
// //           <option value="archived">Archived</option>
// //         </select>
// //         <select style={S.select} value={filter.module} onChange={e => setFilter(f => ({ ...f, module: e.target.value }))}>
// //           <option value="all">All Modules</option>
// //           {MODULES.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
// //         </select>
// //         {selected.size > 0 && (
// //           <div style={S.bulkBar}>
// //             <span style={S.bulkCount}>{selected.size} selected</span>
// //             {canPublish && <button style={S.bulkBtn} onClick={() => bulkAction("published")}>Publish all</button>}
// //             <button style={{ ...S.bulkBtn, color: "#d49090" }} onClick={() => bulkAction("archived")}>Archive all</button>
// //             <button style={{ ...S.bulkBtn, color: "#aaa" }} onClick={() => setSelected(new Set())}>Clear</button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Table */}
// //       <div style={S.table}>
// //         <div style={S.tableHead}>
// //           <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(t => t._id)) : new Set())} style={{ marginRight: 4 }} />
// //           <span style={{ flex: 3 }}>Title</span>
// //           <span style={{ flex: 1 }}>Module</span>
// //           <span style={{ flex: 1 }}>Status</span>
// //           <span style={{ flex: 1 }}>Level</span>
// //           <span style={{ flex: 1 }}>Updated</span>
// //           <span style={{ flex: 1 }}>Actions</span>
// //         </div>

// //         {loading ? (
// //           <div style={S.tableEmpty}>Loading…</div>
// //         ) : filtered.length === 0 ? (
// //           <div style={S.tableEmpty}>No topics found</div>
// //         ) : filtered.map(topic => {
// //           const sc = STATUS_CONFIG[topic.status] || STATUS_CONFIG.draft;
// //           const mod = MODULES.find(m => m.id === topic.moduleId);
// //           return (
// //             <div key={topic._id} style={{ ...S.tableRow, background: selected.has(topic._id) ? "#f0f8f0" : "#fff" }}>
// //               <input
// //                 type="checkbox"
// //                 checked={selected.has(topic._id)}
// //                 onChange={e => {
// //                   const next = new Set(selected);
// //                   e.target.checked ? next.add(topic._id) : next.delete(topic._id);
// //                   setSelected(next);
// //                 }}
// //                 style={{ marginRight: 4 }}
// //               />
// //               <div style={{ flex: 3, minWidth: 0 }}>
// //                 <span style={S.topicTitle}>{topic.title}</span>
// //                 <span style={S.topicMeta}>by {topic.createdBy} · {topic.readTime}</span>
// //               </div>
// //               <span style={{ flex: 1, fontSize: 11, color: "#888" }}>{mod?.title || `Module ${topic.moduleId}`}</span>
// //               <span style={{ flex: 1 }}>
// //                 <span style={{ ...S.statusPill, background: sc.bg, color: sc.color }}>{sc.label}</span>
// //               </span>
// //               <span style={{ flex: 1, fontSize: 11, color: "#888" }}>{topic.level === "b" ? "Beginner" : "Intermediate"}</span>
// //               <span style={{ flex: 1, fontSize: 11, color: "#bbb" }}>{timeAgo(topic.updatedAt)}</span>
// //               <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "wrap" }}>
// //                 <Link href={`/admin/content/${topic._id}/edit`} style={S.actionBtn}>Edit</Link>
// //                 {topic.status !== "published" && canPublish && (
// //                   <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }} onClick={() => changeStatus(topic._id, "published")}>
// //                     Publish
// //                   </button>
// //                 )}
// //                 {topic.status === "published" && canPublish && (
// //                   <button style={{ ...S.actionBtn, color: "#888" }} onClick={() => changeStatus(topic._id, "draft")}>
// //                     Unpublish
// //                   </button>
// //                 )}
// //                 {topic.status !== "archived" && (
// //                   <button style={{ ...S.actionBtn, color: "#d49090", borderColor: "#d4909044" }} onClick={() => changeStatus(topic._id, "archived")}>
// //                     Archive
// //                   </button>
// //                 )}
// //                 {canDelete && (
// //                   <button style={{ ...S.actionBtn, color: "#c00", borderColor: "#c0000044" }} onClick={() => deleteTopic(topic._id)}>
// //                     Delete
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       <div style={S.tableFooter}>
// //         Showing {filtered.length} of {topics.length} topics
// //         {canPublish && <span style={S.liveNote}>◉ Changes publish live to Learner Hub instantly</span>}
// //       </div>
// //     </div>
// //   );
// // }

// // function timeAgo(iso) {
// //   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
// //   if (d < 1) return "just now";
// //   if (d < 60) return `${d}m ago`;
// //   if (d < 1440) return `${Math.floor(d / 60)}h ago`;
// //   return `${Math.floor(d / 1440)}d ago`;
// // }

// // const S = {
// //   page:        { padding: "32px 40px", maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
// //   toast:       { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
// //   header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
// //   heading:     { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
// //   sub:         { fontSize: 13, color: "#aaa" },
// //   newBtn:      { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", background: "#1a1208", color: "#F0E8D6", borderRadius: 6, textDecoration: "none", fontWeight: 500 },
// //   filters:     { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" },
// //   search:      { fontSize: 12, padding: "8px 14px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", width: 220, fontFamily: "'DM Sans',sans-serif" },
// //   select:      { fontSize: 12, padding: "8px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" },
// //   bulkBar:     { display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#1a1208", borderRadius: 8 },
// //   bulkCount:   { fontSize: 11, color: "#F0E8D6", fontWeight: 500 },
// //   bulkBtn:     { fontSize: 11, background: "none", border: "none", color: "#F0E8D6", cursor: "pointer", letterSpacing: ".04em" },
// //   table:       { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden" },
// //   tableHead:   { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#fafaf8", borderBottom: "1px solid #ededea", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa" },
// //   tableRow:    { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f5f5f2", transition: "background .1s" },
// //   tableEmpty:  { padding: "40px 0", textAlign: "center", fontSize: 13, color: "#bbb" },
// //   tableFooter: { padding: "12px 16px", fontSize: 11, color: "#bbb", display: "flex", justifyContent: "space-between" },
// //   topicTitle:  { display: "block", fontSize: 13, fontWeight: 400, color: "#1a1208", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
// //   topicMeta:   { display: "block", fontSize: 10, color: "#bbb" },
// //   statusPill:  { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, fontWeight: 600 },
// //   actionBtn:   { fontSize: 10, padding: "4px 10px", border: "1.5px solid #e8e8e4", borderRadius: 5, background: "#fff", cursor: "pointer", color: "#555", textDecoration: "none", letterSpacing: ".03em" },
// //   liveNote:    { color: "#7ec87e", fontWeight: 500 },
// // };
// "use client";
// // app/admin/content/page.js
// // Content OS — every status change pushes via Socket.io to frontend resources page

// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";

// const STATUS_CONFIG = {
//   published: { label:"Published", color:"#7ec87e", bg:"#7ec87e18" },
//   draft:     { label:"Draft",     color:"#C9A96E", bg:"#C9A96E18" },
//   review:    { label:"In Review", color:"#7eb8d8", bg:"#7eb8d818" },
//   archived:  { label:"Archived",  color:"#aaa",    bg:"#aaa22"    },
// };

// const MODULES = [
//   {id:0,title:"Creator Foundations"},{id:1,title:"Content Creation System"},
//   {id:2,title:"Studio & Team Setup"},{id:3,title:"Platform Growth & Algorithms"},
//   {id:4,title:"Collabs & Community"},{id:5,title:"Monetization & Brand Deals"},
//   {id:6,title:"Creator Operations & Legal"},{id:7,title:"Scaling & Career Growth"},
// ];

// function timeAgo(iso) {
//   const d=Math.floor((Date.now()-new Date(iso))/60000);
//   if(d<1)return"just now";if(d<60)return`${d}m ago`;
//   if(d<1440)return`${Math.floor(d/60)}h ago`;return`${Math.floor(d/1440)}d ago`;
// }

// export default function ContentOS() {
//   const { user } = useAdminAuthStore();
//   const [topics, setTopics]   = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter]   = useState({ status:"all", module:"all", search:"" });
//   const [selected, setSelected] = useState(new Set());
//   const [toast, setToast]     = useState(null);

//   const canPublish = ["superAdmin","contentManager"].includes(user?.role);
//   const canDelete  = user?.role === "superAdmin";
//   const moduleIds  = user?.role === "moduleMaster" ? (user?.assignedModules || []) : null;

//   const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

//   const fetchTopics = useCallback(async () => {
//     try {
//       const params = new URLSearchParams();
//       if (filter.status !== "all") params.set("status", filter.status);
//       if (filter.module !== "all") params.set("moduleId", filter.module);
//       if (filter.search) params.set("search", filter.search);
//       if (moduleIds?.length) params.set("moduleIds", moduleIds.join(","));
//       const data = await api.get(`/admin/content?${params}`);
//       setTopics(data?.data?.topics || []);
//     } catch {
//       setTopics([
//         { _id:"t1",title:"Creator vs Influencer",moduleId:0,status:"published",level:"b",readTime:"8 min",updatedAt:new Date().toISOString(),createdByName:"Admin" },
//         { _id:"t2",title:"Choosing a Niche",     moduleId:0,status:"published",level:"b",readTime:"12 min",updatedAt:new Date().toISOString(),createdByName:"Admin" },
//         { _id:"t3",title:"Instagram Algorithm",  moduleId:3,status:"draft",    level:"i",readTime:"18 min",updatedAt:new Date().toISOString(),createdByName:"Kiran M." },
//         { _id:"t4",title:"Brand Deal Rate Card", moduleId:5,status:"review",   level:"i",readTime:"10 min",updatedAt:new Date().toISOString(),createdByName:"Priya S." },
//       ]);
//     }
//     setLoading(false);
//   }, [filter, moduleIds]);

//   useEffect(() => { fetchTopics(); }, [fetchTopics]);

//   // Live: refetch when any topic event arrives from another admin session
//   useSocket({ "topic:published": fetchTopics, "topic:archived": fetchTopics, "topic:deleted": fetchTopics });

//   const changeStatus = async (id, status) => {
//     try {
//       await api.patch(`/admin/content/${id}/status`, { status });
//       setTopics(ts => ts.map(t => t._id===id ? {...t,status} : t));
//       showToast(status==="published" ? "Published — live on Learner Hub ◉" : status==="archived" ? "Archived" : "Updated");
//     } catch { showToast("Failed", false); }
//   };

//   const deleteTopic = async (id) => {
//     if (!confirm("Permanently delete? Cannot be undone.")) return;
//     try {
//       await api.delete(`/admin/content/${id}`);
//       setTopics(ts => ts.filter(t => t._id !== id));
//       showToast("Deleted");
//     } catch { showToast("Delete failed", false); }
//   };

//   const bulkAction = async (action) => {
//     await Promise.all([...selected].map(id => changeStatus(id, action)));
//     setSelected(new Set());
//   };

//   const filtered = topics.filter(t => {
//     if (filter.status !== "all" && t.status !== filter.status) return false;
//     if (filter.module !== "all" && t.moduleId !== parseInt(filter.module)) return false;
//     if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
//     return true;
//   });

//   return (
//     <div style={S.page}>
//       {toast && <div style={{...S.toast,background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Content OS</h1>
//           <p style={S.sub}>All topics across all modules. Status changes reflect live on the Learner Hub via Socket.io.</p>
//         </div>
//         <Link href="/admin/content/new" style={S.newBtn}>+ New Topic</Link>
//       </div>

//       <div style={S.filters}>
//         <input style={S.search} placeholder="Search topics…" value={filter.search}
//           onChange={e=>setFilter(f=>({...f,search:e.target.value}))}/>
//         <select style={S.select} value={filter.status} onChange={e=>setFilter(f=>({...f,status:e.target.value}))}>
//           <option value="all">All Status</option>
//           {["published","draft","review","archived"].map(s=><option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
//         </select>
//         <select style={S.select} value={filter.module} onChange={e=>setFilter(f=>({...f,module:e.target.value}))}>
//           <option value="all">All Modules</option>
//           {MODULES.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}
//         </select>
//         {selected.size > 0 && (
//           <div style={S.bulkBar}>
//             <span style={S.bulkCount}>{selected.size} selected</span>
//             {canPublish && <button style={S.bulkBtn} onClick={()=>bulkAction("published")}>Publish all</button>}
//             <button style={{...S.bulkBtn,color:"#d49090"}} onClick={()=>bulkAction("archived")}>Archive all</button>
//             <button style={{...S.bulkBtn,color:"#aaa"}} onClick={()=>setSelected(new Set())}>Clear</button>
//           </div>
//         )}
//       </div>

//       <div style={S.table}>
//         <div style={S.thead}>
//           <input type="checkbox" onChange={e=>setSelected(e.target.checked?new Set(filtered.map(t=>t._id)):new Set())} style={{marginRight:4}}/>
//           <span style={{flex:3}}>Title</span>
//           <span style={{flex:1}}>Module</span>
//           <span style={{flex:1}}>Status</span>
//           <span style={{flex:1}}>Level</span>
//           <span style={{flex:1}}>Updated</span>
//           <span style={{flex:1}}>Actions</span>
//         </div>

//         {loading ? <div style={S.tempty}>Loading…</div> :
//          filtered.length===0 ? <div style={S.tempty}>No topics found</div> :
//          filtered.map(t => {
//            const sc  = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
//            const mod = MODULES.find(m=>m.id===t.moduleId);
//            return (
//              <div key={t._id} style={{...S.trow,background:selected.has(t._id)?"#f5fbf5":"#fff"}}>
//                <input type="checkbox" checked={selected.has(t._id)} style={{marginRight:4}}
//                  onChange={e=>{const n=new Set(selected);e.target.checked?n.add(t._id):n.delete(t._id);setSelected(n);}}/>
//                <div style={{flex:3,minWidth:0}}>
//                  <span style={S.topicTitle}>{t.title}</span>
//                  <span style={S.topicMeta}>by {t.createdByName||"—"} · {t.readTime}</span>
//                </div>
//                <span style={{flex:1,fontSize:11,color:"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mod?.title||`Module ${t.moduleId}`}</span>
//                <span style={{flex:1}}><span style={{...S.statusPill,background:sc.bg,color:sc.color}}>{sc.label}</span></span>
//                <span style={{flex:1,fontSize:11,color:"#888"}}>{t.level==="b"?"Beginner":"Intermediate"}</span>
//                <span style={{flex:1,fontSize:11,color:"#bbb"}}>{timeAgo(t.updatedAt)}</span>
//                <div style={{flex:1,display:"flex",gap:4,flexWrap:"wrap"}}>
//                  <Link href={`/admin/content/${t._id}/edit`} style={S.actionBtn}>Edit</Link>
//                  {t.status!=="published" && canPublish && (
//                    <button style={{...S.actionBtn,color:"#3a7c3a",borderColor:"#7ec87e44"}} onClick={()=>changeStatus(t._id,"published")}>Publish</button>
//                  )}
//                  {t.status==="published" && canPublish && (
//                    <button style={{...S.actionBtn,color:"#888"}} onClick={()=>changeStatus(t._id,"draft")}>Unpublish</button>
//                  )}
//                  {t.status!=="review" && user?.role==="moduleMaster" && t.status==="draft" && (
//                    <button style={{...S.actionBtn,color:"#7eb8d8",borderColor:"#7eb8d844"}} onClick={()=>changeStatus(t._id,"review")}>Submit</button>
//                  )}
//                  {t.status!=="archived" && (
//                    <button style={{...S.actionBtn,color:"#d49090",borderColor:"#d4909044"}} onClick={()=>changeStatus(t._id,"archived")}>Archive</button>
//                  )}
//                  {canDelete && (
//                    <button style={{...S.actionBtn,color:"#c00",borderColor:"#c0000044"}} onClick={()=>deleteTopic(t._id)}>Delete</button>
//                  )}
//                </div>
//              </div>
//            );
//          })
//         }
//       </div>

//       <div style={S.foot}>
//         <span>Showing {filtered.length} of {topics.length} topics</span>
//         {canPublish && <span style={{color:"#7ec87e",fontWeight:500}}>◉ Published topics go live on Learner Hub instantly via Socket.io</span>}
//       </div>
//     </div>
//   );
// }

// const S = {
//   page:    { padding:"32px 40px",maxWidth:1200,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
//   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
//   header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 },
//   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
//   sub:     { fontSize:13,color:"#aaa" },
//   newBtn:  { fontSize:11,letterSpacing:".1em",textTransform:"uppercase",padding:"10px 20px",background:"#1a1208",color:"#F0E8D6",borderRadius:6,textDecoration:"none",fontWeight:500 },
//   filters: { display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center" },
//   search:  { fontSize:12,padding:"8px 14px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",width:220,fontFamily:"'DM Sans',sans-serif" },
//   select:  { fontSize:12,padding:"8px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif",cursor:"pointer" },
//   bulkBar: { display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"#1a1208",borderRadius:8 },
//   bulkCount:{ fontSize:11,color:"#F0E8D6",fontWeight:500 },
//   bulkBtn: { fontSize:11,background:"none",border:"none",color:"#F0E8D6",cursor:"pointer",letterSpacing:".04em" },
//   table:   { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
//   thead:   { display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"#fafaf8",borderBottom:"1px solid #ededea",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa" },
//   trow:    { display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid #f5f5f2",transition:"background .1s" },
//   tempty:  { padding:"40px 0",textAlign:"center",fontSize:13,color:"#bbb" },
//   topicTitle:{ display:"block",fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" },
//   topicMeta: { display:"block",fontSize:10,color:"#bbb" },
//   statusPill:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,fontWeight:600 },
//   actionBtn: { fontSize:10,padding:"4px 10px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",cursor:"pointer",color:"#555",textDecoration:"none",letterSpacing:".03em" },
//   foot:    { padding:"10px 16px",fontSize:11,color:"#bbb",display:"flex",justifyContent:"space-between",marginTop:4 },
// };

"use client";
// app/admin/content/page.js
// Permission-aware Content OS — changes reflect LIVE on resources page via Socket.io

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

const STATUS_CONFIG = {
  published: { label: "Published", color: "#7ec87e", bg: "#7ec87e18" },
  draft:     { label: "Draft",     color: "#C9A96E", bg: "#C9A96E18" },
  review:    { label: "In Review", color: "#7eb8d8", bg: "#7eb8d818" },
  archived:  { label: "Archived",  color: "#aaa",    bg: "#aaa22"    },
};

const MODULES = [
  { id: 0, title: "Creator Foundations" },
  { id: 1, title: "Content Creation System" },
  { id: 2, title: "Studio & Team Setup" },
  { id: 3, title: "Platform Growth & Algorithms" },
  { id: 4, title: "Collabs & Community" },
  { id: 5, title: "Monetization & Brand Deals" },
  { id: 6, title: "Creator Operations & Legal" },
  { id: 7, title: "Scaling & Career Growth" },
];

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now";
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d/60)}h ago`;
  return `${Math.floor(d/1440)}d ago`;
}

export default function ContentOS() {
  const { user } = useAdminAuthStore();
  const role = user?.role;

  // ── Permission flags per role
  const canCreate   = ["superAdmin","contentManager","moduleMaster"].includes(role);
  const canEdit     = ["superAdmin","contentManager","moduleMaster"].includes(role);
  const canPublish  = ["superAdmin","contentManager"].includes(role);
  const canDelete   = role === "superAdmin";
  const canArchive  = ["superAdmin","contentManager"].includes(role);
  const canApprove  = ["superAdmin","contentManager"].includes(role);
  const isReadOnly  = role === "supportAgent";
  const isMM        = role === "moduleMaster";

  // moduleMaster sees only assigned modules
  const assignedModules = isMM ? (user?.assignedModules || []) : null;

  const [topics, setTopics]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState({ status: "all", module: "all", search: "" });
  const [selected, setSelected] = useState(new Set());
  const [toast, setToast]       = useState(null);

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const fetchTopics = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status !== "all") params.set("status", filter.status);
      if (filter.module !== "all") params.set("moduleId", filter.module);
      if (filter.search) params.set("search", filter.search);
      if (assignedModules?.length) params.set("moduleIds", assignedModules.join(","));
      const data = await api.get(`/admin/content?${params}`);
      setTopics(data?.data?.topics || []);
    } catch {
      setTopics([
        { _id:"t1", title:"Creator vs Influencer", moduleId:0, status:"published", level:"b", readTime:"8 min",  updatedAt:new Date().toISOString(), createdByName:"Admin"    },
        { _id:"t2", title:"Choosing a Niche",      moduleId:0, status:"published", level:"b", readTime:"12 min", updatedAt:new Date().toISOString(), createdByName:"Admin"    },
        { _id:"t3", title:"Instagram Algorithm",   moduleId:3, status:"draft",     level:"i", readTime:"18 min", updatedAt:new Date().toISOString(), createdByName:"Kiran M." },
        { _id:"t4", title:"Brand Deal Rate Card",  moduleId:5, status:"review",    level:"i", readTime:"10 min", updatedAt:new Date().toISOString(), createdByName:"Priya S." },
        { _id:"t5", title:"YouTube SEO",           moduleId:3, status:"draft",     level:"i", readTime:"22 min", updatedAt:new Date().toISOString(), createdByName:"Arjun R." },
        { _id:"t6", title:"Old Algorithm 2022",    moduleId:3, status:"archived",  level:"b", readTime:"6 min",  updatedAt:new Date().toISOString(), createdByName:"Admin"    },
      ]);
    }
    setLoading(false);
  }, [filter, JSON.stringify(assignedModules)]);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  // Live sync — when any topic changes status, refetch
  useSocket({
    "topic:published": fetchTopics,
    "topic:archived":  fetchTopics,
    "topic:deleted":   fetchTopics,
    "topic:updated":   fetchTopics,
  });

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/admin/content/${id}/status`, { status });
      setTopics(ts => ts.map(t => t._id === id ? { ...t, status } : t));
      const msg =
        status === "published" ? "Published live ◉ — visible on Learner Hub instantly" :
        status === "archived"  ? "Archived — removed from Learner Hub" :
        status === "review"    ? "Submitted for review" : "Updated";
      showToast(msg);
    } catch { showToast("Failed to update", false); }
  };

  const deleteTopic = async (id) => {
    if (!confirm("Permanently delete? Cannot be undone.")) return;
    try {
      await api.delete(`/admin/content/${id}`);
      setTopics(ts => ts.filter(t => t._id !== id));
      showToast("Deleted");
    } catch { showToast("Delete failed", false); }
  };

  const bulkAction = async (action) => {
    await Promise.all([...selected].map(id => changeStatus(id, action)));
    setSelected(new Set());
    showToast(`Bulk ${action} complete`);
  };

  const filtered = topics.filter(t => {
    if (filter.status !== "all" && t.status !== filter.status) return false;
    if (filter.module !== "all" && t.moduleId !== parseInt(filter.module)) return false;
    if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (assignedModules && !assignedModules.includes(t.moduleId)) return false;
    return true;
  });

  // Available modules for this role
  const visibleModules = assignedModules
    ? MODULES.filter(m => assignedModules.includes(m.id))
    : MODULES;

  const accent = { superAdmin:"#C9A96E", contentManager:"#b89fd4", moduleMaster:"#7eb8d8", supportAgent:"#7ec87e" }[role] || "#C9A96E";

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Content OS</h1>
          <p style={S.sub}>
            {isReadOnly ? "Read-only view — browse all published topics to assist learners." :
             isMM       ? `Your modules: ${visibleModules.map(m=>m.title).join(", ")}` :
             "All topics across all modules. Publish → live on Learner Hub instantly."}
          </p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {canPublish && <span style={S.liveNote}>◉ Publish = instant live update</span>}
          {canCreate && (
            <Link href="/admin/content/new/edit" style={{ ...S.newBtn, background: accent, color: "#1a1200" }}>
              + New Topic
            </Link>
          )}
        </div>
      </div>

      {/* Role banner for read-only */}
      {isReadOnly && (
        <div style={S.readOnlyBanner}>
          ◎ Support Agent — read-only view. Content editing is not available for your role.
        </div>
      )}

      {/* Filters */}
      <div style={S.filters}>
        <input style={S.search} placeholder="Search topics…" value={filter.search}
          onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        <select style={S.select} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="all">All Status</option>
          {["published","draft","review","archived"].map(s =>
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          )}
        </select>
        <select style={S.select} value={filter.module} onChange={e => setFilter(f => ({ ...f, module: e.target.value }))}>
          <option value="all">All Modules</option>
          {visibleModules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>

        {/* Bulk actions — only for roles that can edit */}
        {selected.size > 0 && canPublish && (
          <div style={S.bulkBar}>
            <span style={S.bulkCount}>{selected.size} selected</span>
            <button style={S.bulkBtn} onClick={() => bulkAction("published")}>Publish all</button>
            <button style={{ ...S.bulkBtn, color: "#d49090" }} onClick={() => bulkAction("archived")}>Archive all</button>
            <button style={{ ...S.bulkBtn, color: "#aaa" }} onClick={() => setSelected(new Set())}>Clear</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={S.table}>
        <div style={S.thead}>
          {!isReadOnly && (
            <input type="checkbox" style={{ marginRight: 8 }}
              onChange={e => setSelected(e.target.checked ? new Set(filtered.map(t => t._id)) : new Set())} />
          )}
          <span style={{ flex: 3 }}>Title</span>
          <span style={{ flex: 1 }}>Module</span>
          <span style={{ flex: 1 }}>Status</span>
          <span style={{ flex: 1 }}>Level</span>
          <span style={{ flex: 1 }}>Updated</span>
          <span style={{ flex: isReadOnly ? 0.5 : 1.5 }}>Actions</span>
        </div>

        {loading ? <div style={S.tempty}>Loading…</div> :
         filtered.length === 0 ? <div style={S.tempty}>No topics found</div> :
         filtered.map(t => {
           const sc  = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
           const mod = MODULES.find(m => m.id === t.moduleId);
           const isOwn = t.createdByName === user?.name || t.createdById === user?._id;
           const canEditThis = canEdit && (role !== "moduleMaster" || isOwn || assignedModules?.includes(t.moduleId));

           return (
             <div key={t._id} style={{ ...S.trow, background: selected.has(t._id) ? "#f5fbf5" : "#fff" }}>
               {!isReadOnly && (
                 <input type="checkbox" checked={selected.has(t._id)} style={{ marginRight: 8 }}
                   onChange={e => { const n = new Set(selected); e.target.checked ? n.add(t._id) : n.delete(t._id); setSelected(n); }} />
               )}
               <div style={{ flex: 3, minWidth: 0 }}>
                 <span style={S.topicTitle}>{t.title}</span>
                 <span style={S.topicMeta}>by {t.createdByName || "—"} · {t.readTime}</span>
               </div>
               <span style={{ flex: 1, fontSize: 11, color: "#888", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                 {mod?.title || `Module ${t.moduleId}`}
               </span>
               <span style={{ flex: 1 }}>
                 <span style={{ ...S.statusPill, background: sc.bg, color: sc.color }}>{sc.label}</span>
               </span>
               <span style={{ flex: 1, fontSize: 11, color: "#888" }}>
                 {t.level === "b" ? "Beginner" : "Intermediate"}
               </span>
               <span style={{ flex: 1, fontSize: 11, color: "#bbb" }}>{timeAgo(t.updatedAt)}</span>

               <div style={{ flex: isReadOnly ? 0.5 : 1.5, display: "flex", gap: 4, flexWrap: "wrap" }}>
                 {/* Read-only preview for all roles */}
                 <Link href={`/resources/courses/${t.slug || t._id}`} target="_blank" style={{ ...S.actionBtn, color: "#7eb8d8", borderColor: "#7eb8d844" }}>
                   Preview
                 </Link>

                 {/* Edit — not for supportAgent */}
                 {canEditThis && (
                   <Link href={`/admin/content/${t._id}/edit`} style={S.actionBtn}>Edit</Link>
                 )}

                 {/* Submit for review — moduleMaster only on drafts */}
                 {isMM && t.status === "draft" && isOwn && (
                   <button style={{ ...S.actionBtn, color: "#7eb8d8", borderColor: "#7eb8d844" }}
                     onClick={() => changeStatus(t._id, "review")}>Submit</button>
                 )}

                 {/* Approve — contentManager and superAdmin on review items */}
                 {canApprove && t.status === "review" && (
                   <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }}
                     onClick={() => changeStatus(t._id, "published")}>✓ Approve</button>
                 )}

                 {/* Publish — superAdmin + contentManager on non-published */}
                 {canPublish && t.status !== "published" && t.status !== "review" && (
                   <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }}
                     onClick={() => changeStatus(t._id, "published")}>Publish</button>
                 )}

                 {/* Unpublish */}
                 {canPublish && t.status === "published" && (
                   <button style={{ ...S.actionBtn, color: "#888" }}
                     onClick={() => changeStatus(t._id, "draft")}>Unpublish</button>
                 )}

                 {/* Archive */}
                 {canArchive && t.status !== "archived" && (
                   <button style={{ ...S.actionBtn, color: "#d49090", borderColor: "#d4909044" }}
                     onClick={() => changeStatus(t._id, "archived")}>Archive</button>
                 )}

                 {/* Delete — superAdmin only */}
                 {canDelete && (
                   <button style={{ ...S.actionBtn, color: "#c00", borderColor: "#c0000044" }}
                     onClick={() => deleteTopic(t._id)}>Delete</button>
                 )}
               </div>
             </div>
           );
         })
        }
      </div>

      <div style={S.foot}>
        <span>Showing {filtered.length} of {topics.length} topics</span>
        {canPublish && <span style={{ color: "#7ec87e", fontWeight: 500 }}>◉ Published topics go live on Learner Hub via Socket.io — no refresh needed</span>}
        {isReadOnly && <span style={{ color: "#aaa" }}>◎ Read-only — contact Content Manager to make changes</span>}
      </div>
    </div>
  );
}

const S = {
  page:          { padding: "32px 40px", maxWidth: 1300, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
  toast:         { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
  header:        { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  heading:       { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
  sub:           { fontSize: 13, color: "#aaa", maxWidth: 600 },
  liveNote:      { fontSize: 11, color: "#7ec87e", fontWeight: 500 },
  newBtn:        { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", border: "none", borderRadius: 6, fontWeight: 600, textDecoration: "none", cursor: "pointer" },
  readOnlyBanner:{ background: "#7ec87e18", border: "1px solid #7ec87e44", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#3a7c3a", marginBottom: 16 },
  filters:       { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" },
  search:        { fontSize: 12, padding: "8px 14px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", width: 220, fontFamily: "'DM Sans',sans-serif" },
  select:        { fontSize: 12, padding: "8px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" },
  bulkBar:       { display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#1a1208", borderRadius: 8 },
  bulkCount:     { fontSize: 11, color: "#F0E8D6", fontWeight: 500 },
  bulkBtn:       { fontSize: 11, background: "none", border: "none", color: "#F0E8D6", cursor: "pointer", letterSpacing: ".04em" },
  table:         { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden" },
  thead:         { display: "flex", alignItems: "center", padding: "10px 16px", background: "#fafaf8", borderBottom: "1px solid #ededea", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", gap: 8 },
  trow:          { display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f5f5f2", transition: "background .1s", gap: 8 },
  tempty:        { padding: "40px 0", textAlign: "center", fontSize: 13, color: "#bbb" },
  topicTitle:    { display: "block", fontSize: 13, fontWeight: 400, color: "#1a1208", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  topicMeta:     { display: "block", fontSize: 10, color: "#bbb" },
  statusPill:    { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, fontWeight: 600 },
  actionBtn:     { fontSize: 10, padding: "4px 10px", border: "1.5px solid #e8e8e4", borderRadius: 5, background: "#fff", cursor: "pointer", color: "#555", textDecoration: "none", letterSpacing: ".03em", whiteSpace: "nowrap" },
  foot:          { padding: "10px 16px", fontSize: 11, color: "#bbb", display: "flex", justifyContent: "space-between", marginTop: 4 },
};