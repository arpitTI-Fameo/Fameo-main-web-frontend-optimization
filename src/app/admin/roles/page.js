// // "use client";
// // // app/admin/roles/page.js

// // import { useState, useEffect } from "react";
// // import { useAuthStore } from "@/store/authStore";

// // const ALL_ROLES = ["learner","supportAgent","moduleMaster","contentManager","superAdmin"];
// // const ROLE_DESC = {
// //   learner:        "Read topics, track progress, ask questions",
// //   supportAgent:   "View tickets, look up learners, read-only content",
// //   moduleMaster:   "Create/upload in assigned modules, submit for review",
// //   contentManager: "All content across all modules, approve, publish",
// //   superAdmin:     "Full platform access including revenue and settings",
// // };
// // const ROLE_COLOR = {
// //   learner:"#aaa", supportAgent:"#7ec87e", moduleMaster:"#7eb8d8",
// //   contentManager:"#b89fd4", superAdmin:"#C9A96E",
// // };

// // export default function RolesPage() {
// //   const { user } = useAuthStore();
// //   const [users, setUsers]     = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [notif, setNotif]     = useState(null);

// //   useEffect(() => {
// //     fetch("/api/admin/roles/users")
// //       .then(r=>r.json()).then(d=>setUsers(d.data||[]))
// //       .catch(()=>setUsers([
// //         { _id:"u1", name:"Nagi Teja",       email:"nagi@trendlance.in",   role:"superAdmin",     lastSeen:new Date().toISOString() },
// //         { _id:"u2", name:"Kiran Mehta",     email:"kiran@fameo.in",       role:"moduleMaster",   lastSeen:new Date(Date.now()-3600000).toISOString() },
// //         { _id:"u3", name:"Priya Sharma",    email:"priya@fameo.in",       role:"contentManager", lastSeen:new Date(Date.now()-7200000).toISOString() },
// //         { _id:"u4", name:"Ravi Support",    email:"ravi@fameo.in",        role:"supportAgent",   lastSeen:new Date(Date.now()-86400000).toISOString() },
// //         { _id:"u5", name:"Aarav Learner",   email:"aarav@example.com",    role:"learner",        lastSeen:new Date(Date.now()-172800000).toISOString() },
// //       ]))
// //       .finally(()=>setLoading(false));
// //   },[]);

// //   const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null),3000); };

// //   const changeRole = async (uid, role) => {
// //     if (uid === user?._id) return alert("You cannot change your own role.");
// //     try {
// //       await fetch(`/api/admin/roles/${uid}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({role}) });
// //       setUsers(prev=>prev.map(u=>u._id===uid?{...u,role}:u));
// //       showNotif(`Role updated to ${role}`);
// //     } catch { showNotif("Update failed"); }
// //   };

// //   return (
// //     <div style={S.page}>
// //       {notif && <div style={S.toast}>{notif}</div>}
// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Roles & Permissions</h1>
// //           <p style={S.sub}>Assign roles to users. Changes take effect immediately.</p>
// //         </div>
// //       </div>

// //       {/* Role reference */}
// //       <div style={S.roleRef}>
// //         {ALL_ROLES.map(r=>(
// //           <div key={r} style={{...S.roleCard, borderTop:`3px solid ${ROLE_COLOR[r]}`}}>
// //             <span style={{...S.roleName, color:ROLE_COLOR[r]}}>{r}</span>
// //             <span style={S.roleDesc}>{ROLE_DESC[r]}</span>
// //           </div>
// //         ))}
// //       </div>

// //       {loading ? <div style={S.empty}>Loading…</div> :
// //        <div style={S.table}>
// //          <div style={S.thead}><span style={{flex:2}}>User</span><span style={{flex:1}}>Current Role</span><span style={{flex:1}}>Change Role</span></div>
// //          {users.map(u=>(
// //            <div key={u._id} style={S.trow}>
// //              <div style={{flex:2}}>
// //                <p style={S.uName}>{u.name} {u._id===user?._id&&<span style={S.youBadge}>you</span>}</p>
// //                <p style={S.uEmail}>{u.email}</p>
// //              </div>
// //              <span style={{flex:1}}>
// //                <span style={{...S.rolePill, color:ROLE_COLOR[u.role]||"#aaa", background:(ROLE_COLOR[u.role]||"#aaa")+"18"}}>
// //                  {u.role}
// //                </span>
// //              </span>
// //              <div style={{flex:1}}>
// //                {u._id !== user?._id ? (
// //                  <select style={S.select} value={u.role} onChange={e=>changeRole(u._id,e.target.value)}>
// //                    {ALL_ROLES.map(r=><option key={r} value={r}>{r}</option>)}
// //                  </select>
// //                ) : <span style={{fontSize:11,color:"#bbb"}}>—</span>}
// //              </div>
// //            </div>
// //          ))}
// //        </div>
// //       }
// //     </div>
// //   );
// // }

// // const S = {
// //   page:    { padding:"32px 40px",maxWidth:1000,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
// //   toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,background:"#7ec87e" },
// //   header:  { marginBottom:24 },
// //   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
// //   sub:     { fontSize:13,color:"#aaa" },
// //   roleRef: { display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:28 },
// //   roleCard:{ background:"#fff",border:"1.5px solid #ededea",borderRadius:8,padding:"12px 14px" },
// //   roleName:{ display:"block",fontSize:11,fontWeight:500,letterSpacing:".04em",marginBottom:4 },
// //   roleDesc:{ display:"block",fontSize:10,color:"#aaa",lineHeight:1.5 },
// //   table:   { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
// //   thead:   { display:"flex",gap:16,padding:"10px 16px",background:"#fafaf8",borderBottom:"1px solid #ededea",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa" },
// //   trow:    { display:"flex",gap:16,padding:"12px 16px",borderBottom:"1px solid #f5f5f2",alignItems:"center" },
// //   uName:   { fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:1,display:"flex",alignItems:"center",gap:6 },
// //   uEmail:  { fontSize:11,color:"#bbb" },
// //   youBadge:{ fontSize:9,padding:"1px 6px",background:"#C9A96E18",color:"#C9A96E",borderRadius:3,fontWeight:500 },
// //   rolePill:{ fontSize:10,padding:"3px 10px",borderRadius:4,fontWeight:500,letterSpacing:".04em" },
// //   select:  { fontSize:12,padding:"6px 10px",border:"1.5px solid #e8e8e4",borderRadius:6,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif",cursor:"pointer" },
// //   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// // };

// "use client";
// // app/admin/roles/page.js — superAdmin only

// import { useState, useEffect } from "react";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useRouter } from "next/navigation";

// const ALL_ROLES = ["learner","supportAgent","moduleMaster","contentManager","superAdmin"];
// const ROLE_DESC = {
//   learner:        "Read topics, track progress, ask questions",
//   supportAgent:   "View tickets, look up learners, read-only content",
//   moduleMaster:   "Create/upload in assigned modules, submit for review",
//   contentManager: "All content across all modules, approve, publish",
//   superAdmin:     "Full platform access including revenue and settings",
// };
// const ROLE_COLOR = {
//   learner:"#aaa", supportAgent:"#7ec87e", moduleMaster:"#7eb8d8",
//   contentManager:"#b89fd4", superAdmin:"#C9A96E",
// };

// function timeAgo(iso) {
//   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
//   if (d < 60) return `${d}m ago`;
//   if (d < 1440) return `${Math.floor(d/60)}h ago`;
//   if (d < 10080) return `${Math.floor(d/1440)}d ago`;
//   return new Date(iso).toLocaleDateString("en-IN");
// }

// export default function RolesPage() {
//   const { user } = useAdminAuthStore();
//   const router   = useRouter();
//   const [users, setUsers]     = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch]   = useState("");
//   const [toast, setToast]     = useState(null);

//   const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

//   useEffect(() => {
//     if (user && user.role !== "superAdmin") { router.replace("/admin"); return; }
//     api.get("/admin/roles/users")
//       .then(d => setUsers(d?.data?.users || d?.data || []))
//       .catch(() => setUsers([
//         { _id:"u1", name:"Nagi Teja",    email:"superadmin@fameo.in", role:"superAdmin",     lastSeen:new Date().toISOString(),                   assignedModules:[0,1,2,3,4,5,6,7] },
//         { _id:"u2", name:"Kiran Mehta",  email:"mm@fameo.in",         role:"moduleMaster",   lastSeen:new Date(Date.now()-3600000).toISOString(),  assignedModules:[0,1,3] },
//         { _id:"u3", name:"Priya Sharma", email:"cm@fameo.in",         role:"contentManager", lastSeen:new Date(Date.now()-7200000).toISOString(),  assignedModules:[] },
//         { _id:"u4", name:"Ravi Support", email:"support@fameo.in",    role:"supportAgent",   lastSeen:new Date(Date.now()-86400000).toISOString(), assignedModules:[] },
//         { _id:"u5", name:"Aarav Test",   email:"learner@fameo.in",    role:"learner",        lastSeen:new Date(Date.now()-172800000).toISOString(),assignedModules:[] },
//       ]))
//       .finally(() => setLoading(false));
//   }, [user, router]);

//   if (user?.role !== "superAdmin") return null;

//   const changeRole = async (uid, role) => {
//     if (uid === user?._id || uid === user?.id) return alert("You cannot change your own role.");
//     try {
//       await api.patch(`/admin/roles/${uid}`, { role });
//       setUsers(prev => prev.map(u => u._id===uid ? {...u, role} : u));
//       showToast(`Role updated to ${role}`);
//     } catch { showToast("Update failed", false); }
//   };

//   const MODULES = ["Creator Foundations","Content Creation","Studio & Team","Platform Growth","Collabs","Monetization","Operations","Scaling"];

//   const filtered = users.filter(u =>
//     !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
//     u.email.toLowerCase().includes(search.toLowerCase())
//   );

//   const roleGroups = ALL_ROLES.map(role => ({
//     role,
//     users: filtered.filter(u => u.role === role),
//   })).filter(g => g.users.length > 0);

//   return (
//     <div style={S.page}>
//       {toast && <div style={{...S.toast, background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Roles & Permissions</h1>
//           <p style={S.sub}>Manage user roles. Changes take effect immediately on next login.</p>
//         </div>
//         <span style={S.saOnly}>◈ Super Admin Only</span>
//       </div>

//       {/* Role reference */}
//       <div style={S.roleRef}>
//         {ALL_ROLES.map(role => (
//           <div key={role} style={{ ...S.roleCard, borderTop: `3px solid ${ROLE_COLOR[role]}` }}>
//             <span style={{ ...S.roleChip, color: ROLE_COLOR[role] }}>{role}</span>
//             <p style={S.roleDesc}>{ROLE_DESC[role]}</p>
//           </div>
//         ))}
//       </div>

//       {/* Search */}
//       <div style={{ marginBottom: 16 }}>
//         <input style={S.search} placeholder="Search users…" value={search}
//           onChange={e => setSearch(e.target.value)} />
//       </div>

//       {/* Users grouped by role */}
//       {loading ? <div style={S.empty}>Loading…</div> :
//        roleGroups.map(({ role, users: roleUsers }) => (
//          <div key={role} style={S.section}>
//            <div style={S.sectionHeader}>
//              <span style={{ ...S.roleDot, background: ROLE_COLOR[role] }} />
//              <span style={{ ...S.sectionTitle, color: ROLE_COLOR[role] }}>{role}</span>
//              <span style={S.sectionCount}>{roleUsers.length} user{roleUsers.length>1?"s":""}</span>
//            </div>
//            {roleUsers.map(u => (
//              <div key={u._id} style={S.userRow}>
//                <div style={{ ...S.avatar, background: (ROLE_COLOR[u.role]||"#aaa")+"22", color: ROLE_COLOR[u.role]||"#aaa" }}>
//                  {u.name?.charAt(0).toUpperCase()}
//                </div>
//                <div style={S.userInfo}>
//                  <span style={S.userName}>{u.name}</span>
//                  <span style={S.userEmail}>{u.email}</span>
//                  {u.assignedModules?.length > 0 && (
//                    <span style={S.userMeta}>
//                      Modules: {u.assignedModules.map(i => MODULES[i]).join(", ")}
//                    </span>
//                  )}
//                </div>
//                <span style={S.lastSeen}>Last seen {timeAgo(u.lastSeen || u.updatedAt)}</span>

//                {/* Role selector — disabled for self */}
//                <select value={u.role} disabled={u._id===user?._id || u._id===user?.id}
//                  style={{ ...S.roleSelect, borderColor: (ROLE_COLOR[u.role]||"#ddd")+"66", color: ROLE_COLOR[u.role] }}
//                  onChange={e => changeRole(u._id, e.target.value)}>
//                  {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
//                </select>
//              </div>
//            ))}
//          </div>
//        ))
//       }
//     </div>
//   );
// }

// const S = {
//   page:        { padding:"32px 40px", maxWidth:1000, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
//   toast:       { position:"fixed", top:20, right:20, zIndex:999, padding:"12px 20px", borderRadius:8, color:"#fff", fontSize:13, fontWeight:500, boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
//   header:      { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 },
//   heading:     { fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:400, color:"#1a1208", marginBottom:4 },
//   sub:         { fontSize:13, color:"#aaa" },
//   saOnly:      { fontSize:10, letterSpacing:".1em", textTransform:"uppercase", padding:"5px 12px", background:"#C9A96E18", color:"#C9A96E", border:"1px solid #C9A96E44", borderRadius:4, fontWeight:500, alignSelf:"center" },
//   roleRef:     { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:24 },
//   roleCard:    { background:"#fff", border:"1.5px solid #ededea", borderRadius:8, padding:"12px" },
//   roleChip:    { display:"block", fontSize:11, fontWeight:600, letterSpacing:".04em", marginBottom:4 },
//   roleDesc:    { fontSize:10, color:"#aaa", lineHeight:1.5 },
//   search:      { fontSize:12, padding:"8px 14px", border:"1.5px solid #e8e8e4", borderRadius:8, outline:"none", width:280, fontFamily:"'DM Sans',sans-serif" },
//   section:     { background:"#fff", border:"1.5px solid #ededea", borderRadius:10, overflow:"hidden", marginBottom:16 },
//   sectionHeader:{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", borderBottom:"1px solid #f5f5f2", background:"#fafaf8" },
//   roleDot:     { width:8, height:8, borderRadius:"50%", flexShrink:0 },
//   sectionTitle:{ fontSize:12, fontWeight:600, letterSpacing:".04em", flex:1 },
//   sectionCount:{ fontSize:11, color:"#bbb" },
//   userRow:     { display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:"1px solid #f5f5f2" },
//   avatar:      { width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, flexShrink:0 },
//   userInfo:    { flex:1, minWidth:0 },
//   userName:    { display:"block", fontSize:13, fontWeight:400, color:"#1a1208" },
//   userEmail:   { display:"block", fontSize:11, color:"#888" },
//   userMeta:    { display:"block", fontSize:10, color:"#bbb", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
//   lastSeen:    { fontSize:10, color:"#bbb", flexShrink:0 },
//   roleSelect:  { fontSize:11, padding:"5px 10px", border:"1.5px solid", borderRadius:6, background:"transparent", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500 },
//   empty:       { textAlign:"center", padding:"40px 0", fontSize:13, color:"#bbb" },
// };

// "use client";
// // app/admin/roles/page.js
// // Full user & role management — superAdmin only
// // Create users, assign roles, change password, toggle access, delete

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";

// /* ── Role config ── */
// const ROLES = [
//   {
//     key:   "superAdmin",
//     label: "Super Admin",
//     color: "#C9A96E",
//     desc:  "Full platform access — revenue, settings, all content, all users",
//     permissions: ["Everything"],
//   },
//   {
//     key:   "contentManager",
//     label: "Content Manager",
//     color: "#b89fd4",
//     desc:  "All content across all modules — edit, publish, approve, notifications",
//     permissions: ["Content OS","Approvals","Media","Archive","Analytics","Notifications"],
//   },
//   {
//     key:   "moduleMaster",
//     label: "Module Master",
//     color: "#7eb8d8",
//     desc:  "Create & upload in assigned modules only — submit for review",
//     permissions: ["Own Modules","Media Upload","Submit for Review","Own Analytics"],
//   },
//   {
//     key:   "supportAgent",
//     label: "Support Agent",
//     color: "#7ec87e",
//     desc:  "Tickets, FAQ builder, learner lookup, read-only content",
//     permissions: ["Support Tickets","Learner Lookup","FAQ Builder","Read-Only Content"],
//   },
//   {
//     key:   "learner",
//     label: "Learner",
//     color: "#aaa",
//     desc:  "End user — Learner Hub only, read topics, track progress",
//     permissions: ["Learner Hub","Progress Tracking","Q&A"],
//   },
// ];

// const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.key, r]));

// function timeAgo(iso) {
//   if (!iso) return "never";
//   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
//   if (d < 1) return "just now";
//   if (d < 60) return `${d}m ago`;
//   if (d < 1440) return `${Math.floor(d/60)}h ago`;
//   if (d < 10080) return `${Math.floor(d/1440)}d ago`;
//   return new Date(iso).toLocaleDateString("en-IN");
// }

// export default function RolesPage() {
//   const { user } = useAdminAuthStore();
//   const router   = useRouter();

//   // Guard — superAdmin only
//   useEffect(() => {
//     if (user && user.role !== "superAdmin") router.replace("/admin");
//   }, [user]);

//   if (!user || user.role !== "superAdmin") return null;

//   const [users, setUsers]         = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [search, setSearch]       = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [toast, setToast]         = useState(null);
//   const [modal, setModal]         = useState(null); // { type, user }

//   const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

//   const load = useCallback(async () => {
//     try {
//       const data = await api.get("/admin/roles/users");
//       setUsers(data?.data?.users || data?.data || []);
//     } catch {
//       setUsers([
//         { _id:"u1", name:"Nagi Teja",    email:"superadmin@fameo.in", role:"superAdmin",     isActive:true,  lastSeen:new Date().toISOString(),                   assignedModules:[0,1,2,3,4,5,6,7], createdAt:new Date(Date.now()-86400000*30).toISOString() },
//         { _id:"u2", name:"Kiran Mehta",  email:"mm@fameo.in",         role:"moduleMaster",   isActive:true,  lastSeen:new Date(Date.now()-3600000).toISOString(),  assignedModules:[0,1,3], createdAt:new Date(Date.now()-86400000*20).toISOString() },
//         { _id:"u3", name:"Priya Sharma", email:"cm@fameo.in",         role:"contentManager", isActive:true,  lastSeen:new Date(Date.now()-7200000).toISOString(),  assignedModules:[], createdAt:new Date(Date.now()-86400000*15).toISOString() },
//         { _id:"u4", name:"Ravi Support", email:"support@fameo.in",    role:"supportAgent",   isActive:true,  lastSeen:new Date(Date.now()-86400000).toISOString(), assignedModules:[], createdAt:new Date(Date.now()-86400000*10).toISOString() },
//         { _id:"u5", name:"Aarav Test",   email:"learner@fameo.in",    role:"learner",        isActive:false, lastSeen:new Date(Date.now()-172800000).toISOString(),assignedModules:[], createdAt:new Date(Date.now()-86400000*5).toISOString() },
//       ]);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const filtered = users.filter(u => {
//     if (roleFilter !== "all" && u.role !== roleFilter) return false;
//     if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
//         !u.email.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   // ── Actions
//   const changeRole = async (uid, role) => {
//     if (uid === user?._id || uid === user?.id) { showToast("Cannot change your own role", false); return; }
//     try {
//       await api.patch(`/admin/roles/${uid}`, { role });
//       setUsers(prev => prev.map(u => u._id===uid ? {...u, role} : u));
//       showToast(`Role updated to ${ROLE_MAP[role]?.label || role}`);
//     } catch { showToast("Update failed", false); }
//   };

//   const toggleAccess = async (uid, currentlyActive) => {
//     if (uid === user?._id || uid === user?.id) { showToast("Cannot disable your own account", false); return; }
//     try {
//       await api.patch(`/admin/roles/${uid}/access`, { isActive: !currentlyActive });
//       setUsers(prev => prev.map(u => u._id===uid ? {...u, isActive:!currentlyActive} : u));
//       showToast(currentlyActive ? "Access removed — user cannot login" : "Access restored");
//     } catch { showToast("Failed", false); }
//   };

//   const deleteUser = async (uid) => {
//     try {
//       await api.delete(`/admin/roles/${uid}`);
//       setUsers(prev => prev.filter(u => u._id !== uid));
//       setModal(null);
//       showToast("User deleted permanently");
//     } catch { showToast("Delete failed", false); }
//   };

//   const changePassword = async (uid, newPassword) => {
//     try {
//       await api.patch(`/admin/roles/${uid}/password`, { password: newPassword });
//       setModal(null);
//       showToast("Password updated — notify the user");
//     } catch { showToast("Failed", false); }
//   };

//   const createUser = async (data) => {
//     try {
//       const res = await api.post("/admin/roles/create-user", data);
//       setModal(null);
//       load();
//       showToast(`User ${data.name} created — role: ${ROLE_MAP[data.role]?.label}`);
//     } catch (e) { showToast(e.message || "Create failed", false); }
//   };

//   const updateModules = async (uid, modules) => {
//     try {
//       await api.patch(`/admin/module-masters/${uid}/modules`, { moduleIds: modules });
//       setUsers(prev => prev.map(u => u._id===uid ? {...u, assignedModules:modules} : u));
//       showToast("Modules updated");
//     } catch { showToast("Failed", false); }
//   };

//   // Group by role
//   const grouped = ROLES.map(r => ({
//     ...r,
//     users: filtered.filter(u => u.role === r.key),
//   })).filter(g => g.users.length > 0 || roleFilter === "all");

//   const totalActive   = users.filter(u => u.isActive).length;
//   const totalInactive = users.filter(u => !u.isActive).length;

//   return (
//     <div style={S.page}>
//       {toast && <div style={{...S.toast, background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

//       {/* Header */}
//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Roles & Users</h1>
//           <p style={S.sub}>
//             {users.length} users · {totalActive} active · {totalInactive} inactive
//             <span style={{...S.saChip}}>◈ Super Admin Only</span>
//           </p>
//         </div>
//         <button onClick={() => setModal({ type:"create" })} style={S.newBtn}>
//           + Create User
//         </button>
//       </div>

//       {/* Role reference cards */}
//       <div style={S.roleCards}>
//         {ROLES.map(r => (
//           <div key={r.key} style={{...S.roleCard, borderTop:`3px solid ${r.color}`}}>
//             <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
//               <span style={{...S.roleChip, color:r.color}}>{r.label}</span>
//               <span style={{fontSize:11,color:"#bbb",fontWeight:500}}>
//                 {users.filter(u=>u.role===r.key).length} user{users.filter(u=>u.role===r.key).length!==1?"s":""}
//               </span>
//             </div>
//             <p style={S.roleDesc}>{r.desc}</p>
//             <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
//               {r.permissions.map(p => (
//                 <span key={p} style={{...S.permPill, background:r.color+"15", color:r.color}}>{p}</span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Filters */}
//       <div style={S.filters}>
//         <input style={S.search} placeholder="Search by name or email…"
//           value={search} onChange={e => setSearch(e.target.value)}/>
//         <div style={S.roleTabs}>
//           {["all",...ROLES.map(r=>r.key)].map(r => {
//             const rc = ROLE_MAP[r];
//             const count = r==="all" ? users.length : users.filter(u=>u.role===r).length;
//             return (
//               <button key={r} onClick={() => setRoleFilter(r)} style={{
//                 ...S.roleTab,
//                 background:   roleFilter===r ? (rc?.color || "#1a1208") : "transparent",
//                 color:        roleFilter===r ? "#fff" : "#666",
//                 borderColor:  roleFilter===r ? (rc?.color || "#1a1208") : "#e8e8e4",
//               }}>
//                 {rc?.label || "All"} <span style={{opacity:.7}}>({count})</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* User table */}
//       {loading ? <div style={S.empty}>Loading…</div> :
//        filtered.length === 0 ? <div style={S.empty}>No users found</div> :
//        <div style={S.table}>
//          <div style={S.thead}>
//            <span style={{flex:2.5}}>User</span>
//            <span style={{flex:1.5}}>Role</span>
//            <span style={{flex:1.5}}>Modules</span>
//            <span style={{flex:1}}>Status</span>
//            <span style={{flex:1}}>Last Seen</span>
//            <span style={{flex:1}}>Joined</span>
//            <span style={{flex:2}}>Actions</span>
//          </div>

//          {filtered.map(u => {
//            const rc      = ROLE_MAP[u.role] || { color:"#aaa", label:u.role };
//            const isSelf  = u._id === user?._id || u._id === user?.id;
//            const MODULES = ["Creator Foundations","Content Creation","Studio & Team","Platform Growth","Collabs","Monetization","Operations","Scaling"];

//            return (
//              <div key={u._id} style={{...S.trow, opacity: u.isActive ? 1 : 0.55}}>
//                {/* User info */}
//                <div style={{flex:2.5, display:"flex", alignItems:"center", gap:10, minWidth:0}}>
//                  <div style={{
//                    ...S.avatar,
//                    background: rc.color+"22",
//                    color:      rc.color,
//                  }}>
//                    {u.name?.charAt(0).toUpperCase()}
//                  </div>
//                  <div style={{minWidth:0}}>
//                    <span style={S.userName}>{u.name} {isSelf && <span style={{fontSize:9,color:"#bbb"}}>(you)</span>}</span>
//                    <span style={S.userEmail}>{u.email}</span>
//                  </div>
//                </div>

//                {/* Role selector */}
//                <div style={{flex:1.5}}>
//                  <select value={u.role} disabled={isSelf}
//                    style={{
//                      ...S.roleSelect,
//                      borderColor: rc.color+"55",
//                      color:       rc.color,
//                      background:  rc.color+"0d",
//                      cursor:      isSelf ? "not-allowed" : "pointer",
//                    }}
//                    onChange={e => changeRole(u._id, e.target.value)}>
//                    {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
//                  </select>
//                </div>

//                {/* Assigned modules */}
//                <div style={{flex:1.5, minWidth:0}}>
//                  {u.role === "moduleMaster" ? (
//                    <button
//                      onClick={() => setModal({ type:"modules", user:u })}
//                      style={S.modulesBtn}>
//                      {u.assignedModules?.length > 0
//                        ? `${u.assignedModules.length} module${u.assignedModules.length>1?"s":""}`
//                        : "None assigned"}
//                      <span style={{fontSize:10,marginLeft:4}}>✎</span>
//                    </button>
//                  ) : (
//                    <span style={{fontSize:11,color:"#bbb"}}>—</span>
//                  )}
//                </div>

//                {/* Active status */}
//                <div style={{flex:1}}>
//                  <span style={{
//                    ...S.statusPill,
//                    background: u.isActive ? "#7ec87e18" : "#d4909018",
//                    color:      u.isActive ? "#3a7c3a"   : "#9a3030",
//                  }}>
//                    {u.isActive ? "Active" : "Disabled"}
//                  </span>
//                </div>

//                <span style={{flex:1, fontSize:11, color:"#bbb"}}>{timeAgo(u.lastSeen)}</span>
//                <span style={{flex:1, fontSize:11, color:"#bbb"}}>{timeAgo(u.createdAt)}</span>

//                {/* Actions */}
//                <div style={{flex:2, display:"flex", gap:4, flexWrap:"wrap"}}>
//                  {!isSelf && (
//                    <>
//                      <button style={{...S.actionBtn, color:"#7eb8d8", borderColor:"#7eb8d844"}}
//                        onClick={() => setModal({ type:"password", user:u })}>
//                        Password
//                      </button>
//                      <button style={{
//                        ...S.actionBtn,
//                        color:       u.isActive ? "#d49090" : "#7ec87e",
//                        borderColor: u.isActive ? "#d4909044" : "#7ec87e44",
//                      }} onClick={() => setModal({ type:"access", user:u })}>
//                        {u.isActive ? "Disable" : "Enable"}
//                      </button>
//                      <button style={{...S.actionBtn, color:"#c00", borderColor:"#c0000044"}}
//                        onClick={() => setModal({ type:"delete", user:u })}>
//                        Delete
//                      </button>
//                    </>
//                  )}
//                </div>
//              </div>
//            );
//          })}
//        </div>
//       }

//       {/* ── Modals ── */}
//       {modal && (
//         <Modal
//           modal={modal}
//           onClose={() => setModal(null)}
//           onChangePassword={changePassword}
//           onToggleAccess={toggleAccess}
//           onDeleteUser={deleteUser}
//           onCreateUser={createUser}
//           onUpdateModules={updateModules}
//           currentUserId={user?._id || user?.id}
//         />
//       )}
//     </div>
//   );
// }

// /* ── Modal dispatcher ── */
// function Modal({ modal, onClose, onChangePassword, onToggleAccess, onDeleteUser, onCreateUser, onUpdateModules }) {
//   if (modal.type === "create")   return <CreateUserModal   onClose={onClose} onCreate={onCreateUser} />;
//   if (modal.type === "password") return <PasswordModal     onClose={onClose} user={modal.user} onSave={onChangePassword} />;
//   if (modal.type === "access")   return <AccessModal       onClose={onClose} user={modal.user} onConfirm={onToggleAccess} />;
//   if (modal.type === "delete")   return <DeleteModal       onClose={onClose} user={modal.user} onConfirm={onDeleteUser} />;
//   if (modal.type === "modules")  return <ModulesModal      onClose={onClose} user={modal.user} onSave={onUpdateModules} />;
//   return null;
// }

// /* ── Create User Modal ── */
// function CreateUserModal({ onClose, onCreate }) {
//   const [form, setForm]   = useState({ name:"", email:"", password:"", role:"contentManager" });
//   const [saving, setSaving] = useState(false);
//   const [err, setErr]     = useState("");
//   const set = (k,v) => setForm(f => ({...f,[k]:v}));

//   const submit = async () => {
//     if (!form.name.trim())  { setErr("Name required"); return; }
//     if (!form.email.trim()) { setErr("Email required"); return; }
//     if (form.password.length < 8) { setErr("Password must be at least 8 characters"); return; }
//     setSaving(true);
//     setErr("");
//     await onCreate(form);
//     setSaving(false);
//   };

//   return (
//     <div style={M.overlay}>
//       <div style={M.box}>
//         <div style={M.header}>
//           <h3 style={M.title}>Create New User</h3>
//           <button onClick={onClose} style={M.close}>✕</button>
//         </div>

//         <div style={{display:"flex",flexDirection:"column",gap:14}}>
//           <div>
//             <label style={M.label}>Full Name *</label>
//             <input style={M.input} value={form.name}
//               onChange={e => set("name", e.target.value)} placeholder="e.g. Priya Sharma"/>
//           </div>
//           <div>
//             <label style={M.label}>Email Address *</label>
//             <input style={M.input} type="email" value={form.email}
//               onChange={e => set("email", e.target.value)} placeholder="priya@fameo.in"/>
//           </div>
//           <div>
//             <label style={M.label}>Password * <span style={{color:"#bbb",fontWeight:400,textTransform:"none",letterSpacing:0}}>(min 8 chars)</span></label>
//             <input style={M.input} type="password" value={form.password}
//               onChange={e => set("password", e.target.value)} placeholder="Minimum 8 characters"/>
//           </div>
//           <div>
//             <label style={M.label}>Role</label>
//             <select style={M.select} value={form.role} onChange={e => set("role", e.target.value)}>
//               {ROLES.filter(r => r.key !== "learner").map(r => (
//                 <option key={r.key} value={r.key}>{r.label}</option>
//               ))}
//             </select>
//             <p style={{fontSize:11,color:"#bbb",marginTop:6}}>
//               {ROLES.find(r=>r.key===form.role)?.desc}
//             </p>
//           </div>
//           {err && <p style={{fontSize:12,color:"#d49090",margin:0}}>{err}</p>}
//         </div>

//         <div style={M.footer}>
//           <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
//           <button style={{...M.primaryBtn, opacity:saving?0.7:1}} onClick={submit} disabled={saving}>
//             {saving ? "Creating…" : "Create User"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Change Password Modal ── */
// function PasswordModal({ onClose, user, onSave }) {
//   const [pw, setPw]       = useState("");
//   const [confirm, setConf] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [err, setErr]     = useState("");

//   const submit = async () => {
//     if (pw.length < 8) { setErr("Min 8 characters"); return; }
//     if (pw !== confirm) { setErr("Passwords don't match"); return; }
//     setSaving(true);
//     await onSave(user._id, pw);
//     setSaving(false);
//   };

//   return (
//     <div style={M.overlay}>
//       <div style={{...M.box, maxWidth:400}}>
//         <div style={M.header}>
//           <h3 style={M.title}>Change Password</h3>
//           <button onClick={onClose} style={M.close}>✕</button>
//         </div>
//         <p style={{fontSize:13,color:"#666",marginBottom:16}}>
//           Setting new password for <strong>{user.name}</strong> ({user.email}).
//           They will need this to login next time.
//         </p>
//         <div style={{display:"flex",flexDirection:"column",gap:12}}>
//           <div>
//             <label style={M.label}>New Password</label>
//             <input style={M.input} type="password" value={pw}
//               onChange={e => setPw(e.target.value)} placeholder="Min 8 characters"/>
//           </div>
//           <div>
//             <label style={M.label}>Confirm Password</label>
//             <input style={M.input} type="password" value={confirm}
//               onChange={e => setConf(e.target.value)} placeholder="Repeat password"/>
//           </div>
//           {err && <p style={{fontSize:12,color:"#d49090",margin:0}}>{err}</p>}
//         </div>
//         <div style={M.footer}>
//           <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
//           <button style={{...M.primaryBtn, opacity:saving?0.7:1}} onClick={submit} disabled={saving}>
//             {saving ? "Saving…" : "Update Password"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Toggle Access Modal ── */
// function AccessModal({ onClose, user, onConfirm }) {
//   const [saving, setSaving] = useState(false);
//   const disabling = user.isActive;

//   const confirm = async () => {
//     setSaving(true);
//     await onConfirm(user._id, user.isActive);
//     setSaving(false);
//     onClose();
//   };

//   return (
//     <div style={M.overlay}>
//       <div style={{...M.box, maxWidth:420}}>
//         <div style={M.header}>
//           <h3 style={M.title}>{disabling ? "Remove Access" : "Restore Access"}</h3>
//           <button onClick={onClose} style={M.close}>✕</button>
//         </div>
//         <p style={{fontSize:13,color:"#666",lineHeight:1.7}}>
//           {disabling ? (
//             <>
//               <strong>{user.name}</strong> will be immediately logged out and will not be able to login.
//               Their data is preserved. You can re-enable access at any time.
//             </>
//           ) : (
//             <>
//               Restore login access for <strong>{user.name}</strong>.
//               They will be able to login with their existing password.
//             </>
//           )}
//         </p>
//         <div style={M.footer}>
//           <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
//           <button style={{
//             ...M.primaryBtn,
//             background: disabling ? "#d49090" : "#7ec87e",
//             opacity: saving ? 0.7 : 1,
//           }} onClick={confirm} disabled={saving}>
//             {saving ? "Processing…" : disabling ? "Remove Access" : "Restore Access"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Delete User Modal ── */
// function DeleteModal({ onClose, user, onConfirm }) {
//   const [confirm, setConfirm] = useState("");
//   const [saving, setSaving]   = useState(false);
//   const expected = user.email.split("@")[0];

//   const submit = async () => {
//     if (confirm !== expected) return;
//     setSaving(true);
//     await onConfirm(user._id);
//     setSaving(false);
//   };

//   return (
//     <div style={M.overlay}>
//       <div style={{...M.box, maxWidth:420}}>
//         <div style={M.header}>
//           <h3 style={{...M.title, color:"#d49090"}}>Delete User Permanently</h3>
//           <button onClick={onClose} style={M.close}>✕</button>
//         </div>
//         <div style={{background:"#d4909010",border:"1px solid #d4909033",borderRadius:8,padding:"12px 14px",marginBottom:16,fontSize:12,color:"#9a3030",lineHeight:1.6}}>
//           ⚠ This will permanently delete <strong>{user.name}</strong>'s account, all their content submissions,
//           progress data, and session history. This cannot be undone.
//         </div>
//         <p style={{fontSize:13,color:"#666",marginBottom:10}}>
//           Type <code style={{background:"#f5f5f2",padding:"2px 6px",borderRadius:3}}>{expected}</code> to confirm:
//         </p>
//         <input style={M.input} value={confirm}
//           onChange={e => setConfirm(e.target.value)}
//           placeholder={`Type "${expected}" to confirm`}/>
//         <div style={M.footer}>
//           <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
//           <button style={{
//             ...M.primaryBtn,
//             background: "#d49090",
//             opacity: confirm !== expected ? 0.4 : saving ? 0.7 : 1,
//             cursor: confirm !== expected ? "not-allowed" : "pointer",
//           }} onClick={submit} disabled={confirm !== expected || saving}>
//             {saving ? "Deleting…" : "Delete Forever"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Assign Modules Modal (Module Master only) ── */
// function ModulesModal({ onClose, user, onSave }) {
//   const MODULES = [
//     "Creator Foundations","Content Creation System","Studio & Team Setup",
//     "Platform Growth & Algorithms","Collabs & Community","Monetization & Brand Deals",
//     "Creator Operations & Legal","Scaling & Career Growth",
//   ];
//   const [selected, setSelected] = useState(new Set(user.assignedModules || []));
//   const [saving, setSaving]     = useState(false);

//   const toggle = (i) => {
//     const n = new Set(selected);
//     n.has(i) ? n.delete(i) : n.add(i);
//     setSelected(n);
//   };

//   const save = async () => {
//     setSaving(true);
//     await onSave(user._id, [...selected]);
//     setSaving(false);
//     onClose();
//   };

//   return (
//     <div style={M.overlay}>
//       <div style={{...M.box, maxWidth:480}}>
//         <div style={M.header}>
//           <h3 style={M.title}>Assign Modules — {user.name}</h3>
//           <button onClick={onClose} style={M.close}>✕</button>
//         </div>
//         <p style={{fontSize:13,color:"#666",marginBottom:16}}>
//           Module Masters can only create and edit content in their assigned modules.
//         </p>
//         <div style={{display:"flex",flexDirection:"column",gap:6}}>
//           {MODULES.map((m, i) => (
//             <label key={i} style={{
//               display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
//               borderRadius:8, cursor:"pointer",
//               background: selected.has(i) ? "#7eb8d818" : "#fafaf8",
//               border: `1.5px solid ${selected.has(i) ? "#7eb8d844" : "#ededea"}`,
//               transition:"all .15s",
//             }}>
//               <input type="checkbox" checked={selected.has(i)} onChange={() => toggle(i)}
//                 style={{width:14,height:14,cursor:"pointer",accentColor:"#7eb8d8"}}/>
//               <span style={{fontSize:12,color: selected.has(i) ? "#1a4a7a" : "#555", fontWeight: selected.has(i) ? 500 : 400}}>
//                 <span style={{fontSize:10,color:"#7eb8d8",fontWeight:600,marginRight:6,letterSpacing:".1em"}}>
//                   {String(i+1).padStart(2,"0")}
//                 </span>
//                 {m}
//               </span>
//             </label>
//           ))}
//         </div>
//         <p style={{fontSize:11,color:"#bbb",marginTop:10}}>{selected.size} of {MODULES.length} modules selected</p>
//         <div style={M.footer}>
//           <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
//           <button style={{...M.primaryBtn, opacity:saving?0.7:1}} onClick={save} disabled={saving}>
//             {saving ? "Saving…" : "Save Modules"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Styles ── */
// const S = {
//   page:       { padding:"32px 40px", maxWidth:1300, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
//   toast:      { position:"fixed", top:20, right:20, zIndex:9999, padding:"12px 20px", borderRadius:8, color:"#fff", fontSize:13, fontWeight:500, boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
//   header:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 },
//   heading:    { fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:400, color:"#1a1208", marginBottom:4 },
//   sub:        { fontSize:13, color:"#aaa", display:"flex", alignItems:"center", gap:10 },
//   saChip:     { fontSize:9, letterSpacing:".1em", textTransform:"uppercase", padding:"3px 8px", borderRadius:3, background:"#C9A96E18", color:"#C9A96E", border:"1px solid #C9A96E33", fontWeight:600 },
//   newBtn:     { fontSize:11, letterSpacing:".1em", textTransform:"uppercase", padding:"10px 20px", background:"#1a1208", color:"#F0E8D6", border:"none", borderRadius:6, cursor:"pointer", fontWeight:500 },
//   roleCards:  { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 },
//   roleCard:   { background:"#fff", border:"1.5px solid #ededea", borderRadius:10, padding:"14px" },
//   roleChip:   { fontSize:11, fontWeight:600, letterSpacing:".03em" },
//   roleDesc:   { fontSize:10, color:"#aaa", lineHeight:1.5, marginTop:4 },
//   permPill:   { fontSize:8, letterSpacing:".08em", textTransform:"uppercase", padding:"2px 7px", borderRadius:3, fontWeight:600 },
//   filters:    { display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" },
//   search:     { fontSize:12, padding:"8px 14px", border:"1.5px solid #e8e8e4", borderRadius:8, outline:"none", width:220, fontFamily:"'DM Sans',sans-serif" },
//   roleTabs:   { display:"flex", gap:4, flexWrap:"wrap" },
//   roleTab:    { fontSize:10, letterSpacing:".06em", textTransform:"uppercase", padding:"5px 12px", border:"1.5px solid", borderRadius:20, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .15s" },
//   table:      { background:"#fff", border:"1.5px solid #ededea", borderRadius:10, overflow:"hidden" },
//   thead:      { display:"flex", alignItems:"center", padding:"10px 16px", background:"#fafaf8", borderBottom:"1px solid #ededea", fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:"#aaa", gap:12 },
//   trow:       { display:"flex", alignItems:"center", padding:"11px 16px", borderBottom:"1px solid #f5f5f2", gap:12, transition:"background .1s" },
//   empty:      { textAlign:"center", padding:"40px 0", fontSize:13, color:"#bbb" },
//   avatar:     { width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, flexShrink:0 },
//   userName:   { display:"block", fontSize:13, fontWeight:400, color:"#1a1208" },
//   userEmail:  { display:"block", fontSize:11, color:"#888" },
//   roleSelect: { fontSize:11, padding:"5px 10px", border:"1.5px solid", borderRadius:6, fontFamily:"'DM Sans',sans-serif", fontWeight:500 },
//   modulesBtn: { fontSize:11, padding:"4px 10px", border:"1.5px solid #7eb8d844", borderRadius:5, background:"#7eb8d808", color:"#1a4a7a", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },
//   statusPill: { fontSize:9, letterSpacing:".1em", textTransform:"uppercase", padding:"3px 8px", borderRadius:3, fontWeight:600 },
//   actionBtn:  { fontSize:10, padding:"4px 10px", border:"1.5px solid #e8e8e4", borderRadius:5, background:"#fff", cursor:"pointer", color:"#555", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap" },
// };

// const M = {
//   overlay:   { position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
//   box:       { background:"#fff", borderRadius:12, padding:"24px", width:"100%", maxWidth:520, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
//   header:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
//   title:     { fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:400, color:"#1a1208" },
//   close:     { background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#aaa" },
//   label:     { display:"block", fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:"#aaa", marginBottom:6, fontWeight:500 },
//   input:     { width:"100%", fontSize:13, padding:"9px 12px", border:"1.5px solid #e8e8e4", borderRadius:8, outline:"none", fontFamily:"'DM Sans',sans-serif" },
//   select:    { width:"100%", fontSize:13, padding:"9px 12px", border:"1.5px solid #e8e8e4", borderRadius:8, outline:"none", background:"#fff", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" },
//   footer:    { display:"flex", gap:10, justifyContent:"flex-end", marginTop:20, paddingTop:16, borderTop:"1px solid #ededea" },
//   cancelBtn: { fontSize:12, padding:"9px 18px", border:"1.5px solid #e8e8e4", borderRadius:6, background:"#fff", cursor:"pointer", color:"#555" },
//   primaryBtn:{ fontSize:12, padding:"9px 20px", border:"none", borderRadius:6, background:"#1a1208", cursor:"pointer", color:"#F0E8D6", fontWeight:500, transition:"all .2s" },
// };

"use client";
// app/admin/roles/page.js
// Full user & role management — superAdmin only
// Create users, assign roles, change password, toggle access, delete

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";

/* ── Role config ── */
const ROLES = [
  {
    key:   "superAdmin",
    label: "Super Admin",
    color: "#C9A96E",
    desc:  "Full platform access — revenue, settings, all content, all users",
    permissions: ["Everything"],
  },
  {
    key:   "contentManager",
    label: "Content Manager",
    color: "#a98fd0",
    desc:  "All content across all modules — edit, publish, approve, notifications",
    permissions: ["Content OS","Approvals","Media","Archive","Analytics","Notifications"],
  },
  {
    key:   "moduleMaster",
    label: "Module Master",
    color: "#6aa8cf",
    desc:  "Create & upload in assigned modules only — submit for review",
    permissions: ["Own Modules","Media Upload","Submit for Review","Own Analytics"],
  },
  {
    key:   "supportAgent",
    label: "Support Agent",
    color: "#6cae6c",
    desc:  "Tickets, FAQ builder, learner lookup, read-only content",
    permissions: ["Support Tickets","Learner Lookup","FAQ Builder","Read-Only Content"],
  },
  {
    key:   "learner",
    label: "Learner",
    color: "#9c9484",
    desc:  "End user — Learner Hub only, read topics, track progress",
    permissions: ["Learner Hub","Progress Tracking","Q&A"],
  },
];

const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.key, r]));

function timeAgo(iso) {
  if (!iso) return "never";
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now";
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d/60)}h ago`;
  if (d < 10080) return `${Math.floor(d/1440)}d ago`;
  return new Date(iso).toLocaleDateString("en-IN");
}

export default function RolesPage() {
  const { user } = useAdminAuthStore();
  const router   = useRouter();

  // Guard — superAdmin only
  useEffect(() => {
    if (user && user.role !== "superAdmin") router.replace("/admin");
  }, [user]);

  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [toast, setToast]         = useState(null);
  const [modal, setModal]         = useState(null); // { type, user }

  const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  const load = useCallback(async () => {
    try {
      const data = await api.get("/admin/roles/users");
      setUsers(data?.data?.users || data?.data || []);
    } catch {
      setUsers([
        { _id:"u1", name:"Nagi Teja",    email:"superadmin@fameo.in", role:"superAdmin",     isActive:true,  lastSeen:new Date().toISOString(),                   assignedModules:[0,1,2,3,4,5,6,7], createdAt:new Date(Date.now()-86400000*30).toISOString() },
        { _id:"u2", name:"Kiran Mehta",  email:"mm@fameo.in",         role:"moduleMaster",   isActive:true,  lastSeen:new Date(Date.now()-3600000).toISOString(),  assignedModules:[0,1,3], createdAt:new Date(Date.now()-86400000*20).toISOString() },
        { _id:"u3", name:"Priya Sharma", email:"cm@fameo.in",         role:"contentManager", isActive:true,  lastSeen:new Date(Date.now()-7200000).toISOString(),  assignedModules:[], createdAt:new Date(Date.now()-86400000*15).toISOString() },
        { _id:"u4", name:"Ravi Support", email:"support@fameo.in",    role:"supportAgent",   isActive:true,  lastSeen:new Date(Date.now()-86400000).toISOString(), assignedModules:[], createdAt:new Date(Date.now()-86400000*10).toISOString() },
        { _id:"u5", name:"Aarav Test",   email:"learner@fameo.in",    role:"learner",        isActive:false, lastSeen:new Date(Date.now()-172800000).toISOString(),assignedModules:[], createdAt:new Date(Date.now()-86400000*5).toISOString() },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!user || user.role !== "superAdmin") return null;

  const filtered = users.filter(u => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── Actions
  const changeRole = async (uid, role) => {
    if (uid === user?._id || uid === user?.id) { showToast("You can't change your own role", false); return; }
    try {
      await api.patch(`/admin/roles/${uid}`, { role });
      setUsers(prev => prev.map(u => u._id===uid ? {...u, role} : u));
      showToast(`Role updated to ${ROLE_MAP[role]?.label || role}`);
    } catch { showToast("Couldn't update role — try again", false); }
  };

  const toggleAccess = async (uid, currentlyActive) => {
    if (uid === user?._id || uid === user?.id) { showToast("You can't disable your own account", false); return; }
    try {
      await api.patch(`/admin/roles/${uid}/access`, { isActive: !currentlyActive });
      setUsers(prev => prev.map(u => u._id===uid ? {...u, isActive:!currentlyActive} : u));
      showToast(currentlyActive ? "Access removed — user can't log in" : "Access restored");
    } catch { showToast("Couldn't update access — try again", false); }
  };

  const deleteUser = async (uid) => {
    try {
      await api.delete(`/admin/roles/${uid}`);
      setUsers(prev => prev.filter(u => u._id !== uid));
      setModal(null);
      showToast("User deleted");
    } catch { showToast("Couldn't delete user — try again", false); }
  };

  const changePassword = async (uid, newPassword) => {
    try {
      await api.patch(`/admin/roles/${uid}/password`, { password: newPassword });
      setModal(null);
      showToast("Password updated — let the user know");
    } catch { showToast("Couldn't update password — try again", false); }
  };

  const createUser = async (data) => {
    try {
      await api.post("/admin/roles/create-user", data);
      setModal(null);
      load();
      showToast(`${data.name} created — ${ROLE_MAP[data.role]?.label}`);
    } catch (e) { showToast(e.message || "Couldn't create user — try again", false); }
  };

  const updateModules = async (uid, modules) => {
    try {
      await api.patch(`/admin/module-masters/${uid}/modules`, { moduleIds: modules });
      setUsers(prev => prev.map(u => u._id===uid ? {...u, assignedModules:modules} : u));
      showToast("Modules updated");
    } catch { showToast("Couldn't update modules — try again", false); }
  };

  const totalActive   = users.filter(u => u.isActive).length;
  const totalInactive = users.filter(u => !u.isActive).length;

  return (
    <div style={S.page}>
      <style>{KEYFRAMES}</style>
      {toast && (
        <div style={{...S.toast, background:toast.ok?"#1a1208":"#9a3030"}}>
          <span style={{color:toast.ok?"#9ad49a":"#f0c4c4"}}>{toast.ok?"✓":"✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div>
          <span style={S.eyebrow}>◈ Super Admin</span>
          <h1 style={S.heading}>Roles &amp; Users</h1>
        </div>
        <button onClick={() => setModal({ type:"create" })} style={S.newBtn}>
          + Create user
        </button>
      </div>

      {/* Stat strip */}
      <div style={S.statStrip}>
        <Stat n={users.length}    label="Total users" />
        <div style={S.statDiv} />
        <Stat n={totalActive}     label="Active"   tone="#3a7c3a" />
        <div style={S.statDiv} />
        <Stat n={totalInactive}   label="Disabled" tone={totalInactive ? "#9a3030" : "#b8b0a2"} />
        <div style={S.statDiv} />
        <Stat n={ROLES.length}    label="Roles" />
      </div>

      {/* Role reference cards */}
      <div style={S.sectionLabel}>Role reference</div>
      <div style={S.roleCards}>
        {ROLES.map(r => {
          const count = users.filter(u=>u.role===r.key).length;
          return (
            <div key={r.key} style={S.roleCard}>
              <div style={{...S.roleRail, background:r.color}} />
              <div style={S.roleCardInner}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <span style={{...S.roleChip, color:r.color}}>{r.label}</span>
                  <span style={{...S.countBadge, background:r.color+"16", color:r.color}}>
                    {count}
                  </span>
                </div>
                <p style={S.roleDesc}>{r.desc}</p>
                <div style={S.permWrap}>
                  {r.permissions.map(p => (
                    <span key={p} style={{...S.permPill, color:r.color, borderColor:r.color+"33"}}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={S.filters}>
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>⌕</span>
          <input style={S.search} placeholder="Search by name or email"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div style={S.roleTabs}>
          {["all",...ROLES.map(r=>r.key)].map(r => {
            const rc = ROLE_MAP[r];
            const count = r==="all" ? users.length : users.filter(u=>u.role===r).length;
            const on = roleFilter===r;
            const c  = rc?.color || "#1a1208";
            return (
              <button key={r} onClick={() => setRoleFilter(r)} style={{
                ...S.roleTab,
                background:   on ? c : "transparent",
                color:        on ? "#fff" : "#4a4338",
                borderColor:  on ? c : "#e6e1d6",
              }}>
                {rc?.label || "All"}<span style={{opacity:.65,marginLeft:5}}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User table */}
      {loading ? <div style={S.empty}>Loading users…</div> :
       filtered.length === 0 ? (
         <div style={S.empty}>
           No users match this filter. Adjust your search, or create a new user.
         </div>
       ) :
       <div style={S.table}>
         <div style={S.thead}>
           <span style={{flex:2.5}}>User</span>
           <span style={{flex:1.5}}>Role</span>
           <span style={{flex:1.5}}>Modules</span>
           <span style={{flex:1}}>Status</span>
           <span style={{flex:1}}>Last seen</span>
           <span style={{flex:1}}>Joined</span>
           <span style={{flex:2, textAlign:"right"}}>Actions</span>
         </div>

         {filtered.map(u => {
           const rc      = ROLE_MAP[u.role] || { color:"#9c9484", label:u.role };
           const isSelf  = u._id === user?._id || u._id === user?.id;

           return (
             <div key={u._id}
               style={{...S.trow, background: u.isActive ? "transparent" : "#fdfbf6"}}
               onMouseEnter={e => e.currentTarget.style.background="#faf6ed"}
               onMouseLeave={e => e.currentTarget.style.background = u.isActive ? "transparent" : "#fdfbf6"}>
               <div style={{...S.rowRail, background: u.isActive ? rc.color : "#b8b0a0"}} />

               {/* User info */}
               <div style={{flex:2.5, display:"flex", alignItems:"center", gap:11, minWidth:0}}>
                 <div style={{...S.avatar, background: rc.color+"1e", color: rc.color, borderColor: rc.color+"3a"}}>
                   {u.name?.charAt(0).toUpperCase()}
                 </div>
                 <div style={{minWidth:0}}>
                   <span style={S.userName}>
                     {u.name}{isSelf && <span style={S.youTag}>you</span>}
                   </span>
                   <span style={S.userEmail}>{u.email}</span>
                 </div>
               </div>

               {/* Role selector */}
               <div style={{flex:1.5}}>
                 <select value={u.role} disabled={isSelf}
                   style={{
                     ...S.roleSelect,
                     borderColor:     rc.color+"66",
                     borderLeftWidth: 4,
                     borderLeftColor: rc.color,
                     color:           "#2a2118",
                     background:      isSelf ? "#faf8f2" : "#fff",
                     cursor:          isSelf ? "not-allowed" : "pointer",
                   }}
                   onChange={e => changeRole(u._id, e.target.value)}>
                   {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                 </select>
               </div>

               {/* Assigned modules */}
               <div style={{flex:1.5, minWidth:0}}>
                 {u.role === "moduleMaster" ? (
                   <button onClick={() => setModal({ type:"modules", user:u })} style={S.modulesBtn}>
                     {u.assignedModules?.length > 0
                       ? `${u.assignedModules.length} module${u.assignedModules.length>1?"s":""}`
                       : "Assign modules"}
                     <span style={{fontSize:10,marginLeft:5,opacity:.7}}>✎</span>
                   </button>
                 ) : (
                   <span style={S.dash}>—</span>
                 )}
               </div>

               {/* Active status */}
               <div style={{flex:1}}>
                 <span style={{
                   ...S.statusPill,
                   background: u.isActive ? "#6cae6c22" : "#c93a3a18",
                   color:      u.isActive ? "#2f7030"   : "#a82c2c",
                 }}>
                   <span style={{...S.statusDot, background: u.isActive ? "#3a7c3a" : "#9a3030"}} />
                   {u.isActive ? "Active" : "Disabled"}
                 </span>
               </div>

               <span style={S.metaCell}>{timeAgo(u.lastSeen)}</span>
               <span style={S.metaCell}>{timeAgo(u.createdAt)}</span>

               {/* Actions */}
               <div style={{flex:2, display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end"}}>
                 {!isSelf && (
                   <>
                     <button style={S.actionBtn}
                       onMouseEnter={e=>{e.currentTarget.style.borderColor="#6aa8cf";e.currentTarget.style.color="#1a4a7a";}}
                       onMouseLeave={e=>{e.currentTarget.style.borderColor="#e6e1d6";e.currentTarget.style.color="#6b6456";}}
                       onClick={() => setModal({ type:"password", user:u })}>
                       Password
                     </button>
                     <button style={{
                       ...S.actionBtn,
                       color:       u.isActive ? "#9a5050" : "#3a7c3a",
                       borderColor: u.isActive ? "#d4909055" : "#6cae6c55",
                     }} onClick={() => setModal({ type:"access", user:u })}>
                       {u.isActive ? "Disable" : "Enable"}
                     </button>
                     <button style={{...S.actionBtn, color:"#a83232", borderColor:"#c0000033"}}
                       onMouseEnter={e=>{e.currentTarget.style.background="#a832320d";}}
                       onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}
                       onClick={() => setModal({ type:"delete", user:u })}>
                       Delete
                     </button>
                   </>
                 )}
               </div>
             </div>
           );
         })}
       </div>
      }

      {/* ── Modals ── */}
      {modal && (
        <Modal
          modal={modal}
          onClose={() => setModal(null)}
          onChangePassword={changePassword}
          onToggleAccess={toggleAccess}
          onDeleteUser={deleteUser}
          onCreateUser={createUser}
          onUpdateModules={updateModules}
          currentUserId={user?._id || user?.id}
        />
      )}
    </div>
  );
}

function Stat({ n, label, tone }) {
  return (
    <div style={S.stat}>
      <span style={{...S.statNum, color: tone || "#1a1208"}}>{n}</span>
      <span style={S.statLabel}>{label}</span>
    </div>
  );
}

/* ── Modal dispatcher ── */
function Modal({ modal, onClose, onChangePassword, onToggleAccess, onDeleteUser, onCreateUser, onUpdateModules }) {
  if (modal.type === "create")   return <CreateUserModal   onClose={onClose} onCreate={onCreateUser} />;
  if (modal.type === "password") return <PasswordModal     onClose={onClose} user={modal.user} onSave={onChangePassword} />;
  if (modal.type === "access")   return <AccessModal       onClose={onClose} user={modal.user} onConfirm={onToggleAccess} />;
  if (modal.type === "delete")   return <DeleteModal       onClose={onClose} user={modal.user} onConfirm={onDeleteUser} />;
  if (modal.type === "modules")  return <ModulesModal      onClose={onClose} user={modal.user} onSave={onUpdateModules} />;
  return null;
}

/* ── Create User Modal ── */
function CreateUserModal({ onClose, onCreate }) {
  const [form, setForm]   = useState({ name:"", email:"", password:"", role:"contentManager" });
  const [saving, setSaving] = useState(false);
  const [err, setErr]     = useState("");
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const activeRole = ROLES.find(r=>r.key===form.role);

  const submit = async () => {
    if (!form.name.trim())  { setErr("Enter the user's name"); return; }
    if (!form.email.trim()) { setErr("Enter an email address"); return; }
    if (form.password.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setSaving(true);
    setErr("");
    await onCreate(form);
    setSaving(false);
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={M.box} onMouseDown={e=>e.stopPropagation()}>
        <div style={M.header}>
          <div>
            <span style={M.eyebrow}>New account</span>
            <h3 style={M.title}>Create user</h3>
          </div>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={M.label}>Full name</label>
            <input style={M.input} value={form.name}
              onChange={e => set("name", e.target.value)} placeholder="Priya Sharma"/>
          </div>
          <div>
            <label style={M.label}>Email address</label>
            <input style={M.input} type="email" value={form.email}
              onChange={e => set("email", e.target.value)} placeholder="priya@fameo.in"/>
          </div>
          <div>
            <label style={M.label}>Password <span style={M.hint}>min 8 characters</span></label>
            <input style={M.input} type="password" value={form.password}
              onChange={e => set("password", e.target.value)} placeholder="Set a starting password"/>
          </div>
          <div>
            <label style={M.label}>Role</label>
            <select style={M.select} value={form.role} onChange={e => set("role", e.target.value)}>
              {ROLES.filter(r => r.key !== "learner").map(r => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
            {activeRole && (
              <div style={{...M.roleNote, borderColor:activeRole.color+"33", background:activeRole.color+"0c"}}>
                <span style={{...S.roleChip, color:activeRole.color, fontSize:10}}>{activeRole.label}</span>
                <p style={{fontSize:11.5,color:"#7a7264",margin:"4px 0 0",lineHeight:1.5}}>{activeRole.desc}</p>
              </div>
            )}
          </div>
          {err && <p style={M.err}>{err}</p>}
        </div>

        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{...M.primaryBtn, opacity:saving?0.7:1}} onClick={submit} disabled={saving}>
            {saving ? "Creating…" : "Create user"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Change Password Modal ── */
function PasswordModal({ onClose, user, onSave }) {
  const [pw, setPw]       = useState("");
  const [confirm, setConf] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr]     = useState("");

  const submit = async () => {
    if (pw.length < 8) { setErr("Password must be at least 8 characters"); return; }
    if (pw !== confirm) { setErr("Passwords don't match"); return; }
    setSaving(true);
    await onSave(user._id, pw);
    setSaving(false);
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{...M.box, maxWidth:400}} onMouseDown={e=>e.stopPropagation()}>
        <div style={M.header}>
          <div>
            <span style={M.eyebrow}>{user.email}</span>
            <h3 style={M.title}>Change password</h3>
          </div>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <p style={M.body}>
          Set a new password for <strong>{user.name}</strong>. They'll use it the next time they log in.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <label style={M.label}>New password</label>
            <input style={M.input} type="password" value={pw}
              onChange={e => setPw(e.target.value)} placeholder="Min 8 characters"/>
          </div>
          <div>
            <label style={M.label}>Confirm password</label>
            <input style={M.input} type="password" value={confirm}
              onChange={e => setConf(e.target.value)} placeholder="Repeat password"/>
          </div>
          {err && <p style={M.err}>{err}</p>}
        </div>
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{...M.primaryBtn, opacity:saving?0.7:1}} onClick={submit} disabled={saving}>
            {saving ? "Saving…" : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toggle Access Modal ── */
function AccessModal({ onClose, user, onConfirm }) {
  const [saving, setSaving] = useState(false);
  const disabling = user.isActive;

  const confirm = async () => {
    setSaving(true);
    await onConfirm(user._id, user.isActive);
    setSaving(false);
    onClose();
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{...M.box, maxWidth:420}} onMouseDown={e=>e.stopPropagation()}>
        <div style={M.header}>
          <h3 style={M.title}>{disabling ? "Remove access" : "Restore access"}</h3>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <p style={M.body}>
          {disabling ? (
            <>
              <strong>{user.name}</strong> will be logged out immediately and won't be able to log in.
              Their data stays intact, and you can re-enable access any time.
            </>
          ) : (
            <>
              Restore login access for <strong>{user.name}</strong>. They'll be able to log in with their existing password.
            </>
          )}
        </p>
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{
            ...M.primaryBtn,
            background: disabling ? "#9a3030" : "#3a7c3a",
            opacity: saving ? 0.7 : 1,
          }} onClick={confirm} disabled={saving}>
            {saving ? "Working…" : disabling ? "Remove access" : "Restore access"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete User Modal ── */
function DeleteModal({ onClose, user, onConfirm }) {
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving]   = useState(false);
  const expected = user.email.split("@")[0];
  const match = confirm === expected;

  const submit = async () => {
    if (!match) return;
    setSaving(true);
    await onConfirm(user._id);
    setSaving(false);
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{...M.box, maxWidth:420}} onMouseDown={e=>e.stopPropagation()}>
        <div style={M.header}>
          <h3 style={{...M.title, color:"#9a3030"}}>Delete user</h3>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <div style={M.danger}>
          This permanently deletes <strong>{user.name}</strong>'s account, content submissions,
          progress, and session history. This can't be undone.
        </div>
        <p style={{...M.body, marginBottom:10}}>
          Type <code style={M.code}>{expected}</code> to confirm:
        </p>
        <input style={M.input} value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder={expected}/>
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{
            ...M.primaryBtn,
            background: "#9a3030",
            opacity: !match ? 0.4 : saving ? 0.7 : 1,
            cursor: !match ? "not-allowed" : "pointer",
          }} onClick={submit} disabled={!match || saving}>
            {saving ? "Deleting…" : "Delete forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Assign Modules Modal (Module Master only) ── */
function ModulesModal({ onClose, user, onSave }) {
  const MODULES = [
    "Creator Foundations","Content Creation System","Studio & Team Setup",
    "Platform Growth & Algorithms","Collabs & Community","Monetization & Brand Deals",
    "Creator Operations & Legal","Scaling & Career Growth",
  ];
  const ACCENT = "#6aa8cf";
  const [selected, setSelected] = useState(new Set(user.assignedModules || []));
  const [saving, setSaving]     = useState(false);

  const toggle = (i) => {
    const n = new Set(selected);
    n.has(i) ? n.delete(i) : n.add(i);
    setSelected(n);
  };

  const save = async () => {
    setSaving(true);
    await onSave(user._id, [...selected]);
    setSaving(false);
    onClose();
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{...M.box, maxWidth:480}} onMouseDown={e=>e.stopPropagation()}>
        <div style={M.header}>
          <div>
            <span style={M.eyebrow}>Module Master</span>
            <h3 style={M.title}>Assign modules — {user.name}</h3>
          </div>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <p style={M.body}>
          Module Masters can only create and edit content in the modules you assign here.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {MODULES.map((m, i) => {
            const on = selected.has(i);
            return (
              <label key={i} style={{
                display:"flex", alignItems:"center", gap:11, padding:"10px 12px",
                borderRadius:8, cursor:"pointer",
                background: on ? ACCENT+"14" : "#fbfaf6",
                border: `1.5px solid ${on ? ACCENT+"55" : "#ece8de"}`,
                transition:"all .15s",
              }}>
                <input type="checkbox" checked={on} onChange={() => toggle(i)}
                  style={{width:15,height:15,cursor:"pointer",accentColor:ACCENT}}/>
                <span style={{fontSize:12.5, color: on ? "#1a4a7a" : "#5e564a", fontWeight: on ? 500 : 400}}>
                  <span style={{fontSize:10,color:ACCENT,fontWeight:700,marginRight:8,letterSpacing:".08em",fontVariantNumeric:"tabular-nums"}}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                  {m}
                </span>
              </label>
            );
          })}
        </div>
        <p style={{fontSize:11,color:"#a8a092",marginTop:11}}>{selected.size} of {MODULES.length} modules selected</p>
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{...M.primaryBtn, opacity:saving?0.7:1}} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save modules"}
          </button>
        </div>
      </div>
    </div>
  );
}

const KEYFRAMES = `
@keyframes toastIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
@keyframes modalIn { from { opacity:0; transform:translateY(10px) scale(.99) } to { opacity:1; transform:translateY(0) scale(1) } }
@media (prefers-reduced-motion: reduce) { * { animation:none !important } }
`;

/* ── Styles ── */
const INK = "#1a1208";
const GOLD = "#C9A96E";
const S = {
  page:       { padding:"36px 44px", maxWidth:1320, margin:"0 auto", fontFamily:"'DM Sans',sans-serif", color:INK, background:"#FAF7F0", minHeight:"100vh" },
  toast:      { position:"fixed", top:22, right:22, zIndex:9999, padding:"12px 20px", borderRadius:9, color:"#F0E8D6", fontSize:13, fontWeight:500, boxShadow:"0 10px 34px rgba(26,18,8,.28)", display:"flex", alignItems:"center", gap:9, animation:"toastIn .25s ease" },

  header:     { display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22 },
  eyebrow:    { display:"block", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:GOLD, fontWeight:600, marginBottom:7 },
  heading:    { fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:500, color:INK, margin:0, lineHeight:1 },
  newBtn:     { fontSize:11, letterSpacing:".12em", textTransform:"uppercase", padding:"11px 22px", background:INK, color:"#F0E8D6", border:"none", borderRadius:7, cursor:"pointer", fontWeight:500, fontFamily:"'DM Sans',sans-serif", transition:"transform .12s" },

  statStrip:  { display:"flex", alignItems:"center", gap:0, background:"#fff", border:"1.5px solid #ece8de", borderRadius:12, padding:"16px 8px", marginBottom:30, boxShadow:"0 1px 2px rgba(26,18,8,.03)" },
  stat:       { flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"0 12px" },
  statNum:    { fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:600, lineHeight:1, fontVariantNumeric:"tabular-nums" },
  statLabel:  { fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:"#8a8275", fontWeight:600 },
  statDiv:    { width:1, height:34, background:"#ece8de" },

  sectionLabel:{ fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color:"#8a8275", fontWeight:600, marginBottom:12 },
  roleCards:  { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:32 },
  roleCard:   { display:"flex", background:"#fff", border:"1.5px solid #ece8de", borderRadius:11, overflow:"hidden", boxShadow:"0 1px 2px rgba(26,18,8,.03)" },
  roleRail:   { width:4, flexShrink:0 },
  roleCardInner:{ padding:"14px 15px", flex:1, minWidth:0 },
  roleChip:   { fontSize:12, fontWeight:600, letterSpacing:".01em" },
  countBadge: { fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20, fontVariantNumeric:"tabular-nums", minWidth:12, textAlign:"center" },
  roleDesc:   { fontSize:11, color:"#6b6456", lineHeight:1.55, margin:"0 0 11px", minHeight:34 },
  permWrap:   { display:"flex", flexWrap:"wrap", gap:5 },
  permPill:   { fontSize:9, letterSpacing:".06em", textTransform:"uppercase", padding:"3px 8px", borderRadius:5, fontWeight:600, border:"1px solid" },

  filters:    { display:"flex", gap:14, marginBottom:18, alignItems:"center", flexWrap:"wrap", justifyContent:"space-between" },
  searchWrap: { position:"relative", display:"flex", alignItems:"center" },
  searchIcon: { position:"absolute", left:13, fontSize:15, color:"#b8b0a2", pointerEvents:"none" },
  search:     { fontSize:13, padding:"10px 14px 10px 34px", border:"1.5px solid #ddd6c8", borderRadius:9, outline:"none", width:260, fontFamily:"'DM Sans',sans-serif", background:"#fff", color:INK },
  roleTabs:   { display:"flex", gap:6, flexWrap:"wrap" },
  roleTab:    { fontSize:10.5, letterSpacing:".04em", padding:"7px 14px", border:"1.5px solid", borderRadius:22, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .15s", fontWeight:500, fontVariantNumeric:"tabular-nums" },

  table:      { background:"#fff", border:"1.5px solid #ece8de", borderRadius:12, overflow:"hidden", boxShadow:"0 1px 3px rgba(26,18,8,.04)" },
  thead:      { display:"flex", alignItems:"center", padding:"12px 20px 12px 24px", background:"#f3efe5", borderBottom:"1.5px solid #e6e1d6", fontSize:9.5, letterSpacing:".14em", textTransform:"uppercase", color:"#7a7264", gap:12, fontWeight:600 },
  trow:       { position:"relative", display:"flex", alignItems:"center", padding:"13px 20px 13px 24px", borderBottom:"1px solid #f4f1e9", gap:12, transition:"background .12s" },
  rowRail:    { position:"absolute", left:0, top:0, bottom:0, width:3 },
  empty:      { textAlign:"center", padding:"56px 20px", fontSize:13.5, color:"#a8a092", background:"#fff", border:"1.5px solid #ece8de", borderRadius:12, lineHeight:1.6 },

  avatar:     { width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13.5, fontWeight:600, flexShrink:0, border:"1.5px solid" },
  userName:   { display:"flex", alignItems:"center", gap:7, fontSize:13.5, fontWeight:500, color:INK, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  youTag:     { fontSize:8.5, letterSpacing:".1em", textTransform:"uppercase", color:GOLD, background:GOLD+"18", padding:"2px 6px", borderRadius:4, fontWeight:600 },
  userEmail:  { display:"block", fontSize:11.5, color:"#7a7264", marginTop:1 },

  roleSelect: { fontSize:11.5, padding:"6px 11px", border:"1.5px solid", borderRadius:7, fontFamily:"'DM Sans',sans-serif", fontWeight:500, outline:"none", maxWidth:"100%" },
  modulesBtn: { fontSize:11, padding:"6px 12px", border:"1.5px solid #6aa8cf44", borderRadius:7, background:"#6aa8cf0c", color:"#1a4a7a", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500 },
  dash:       { fontSize:12, color:"#c8c2b4" },
  statusPill: { display:"inline-flex", alignItems:"center", gap:6, fontSize:9.5, letterSpacing:".08em", textTransform:"uppercase", padding:"4px 10px", borderRadius:20, fontWeight:600 },
  statusDot:  { width:5, height:5, borderRadius:"50%" },
  metaCell:   { flex:1, fontSize:12, color:"#6b6456", fontVariantNumeric:"tabular-nums" },
  actionBtn:  { fontSize:10.5, padding:"6px 12px", border:"1.5px solid #ddd6c8", borderRadius:7, background:"#fff", cursor:"pointer", color:"#4a4338", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap", fontWeight:500, transition:"all .12s" },
};

const M = {
  overlay:   { position:"fixed", inset:0, background:"rgba(26,18,8,0.5)", backdropFilter:"blur(3px)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  box:       { background:"#fffdf9", borderRadius:14, padding:"26px", width:"100%", maxWidth:520, boxShadow:"0 24px 70px rgba(26,18,8,0.32)", border:"1px solid #ece8de", animation:"modalIn .22s cubic-bezier(.22,1,.36,1)" },
  header:    { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 },
  eyebrow:   { display:"block", fontSize:9.5, letterSpacing:".18em", textTransform:"uppercase", color:"#a8a092", fontWeight:600, marginBottom:5 },
  title:     { fontFamily:"'Cormorant Garamond',serif", fontSize:23, fontWeight:500, color:INK, margin:0, lineHeight:1.1 },
  close:     { background:"none", border:"none", fontSize:17, cursor:"pointer", color:"#b8b0a2", lineHeight:1, padding:4 },
  body:      { fontSize:13, color:"#7a7264", lineHeight:1.65, marginBottom:16 },
  label:     { display:"block", fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:"#a8a092", marginBottom:7, fontWeight:600 },
  hint:      { color:"#c0b9aa", fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6 },
  input:     { width:"100%", fontSize:13.5, padding:"10px 13px", border:"1.5px solid #e6e1d6", borderRadius:9, outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fff", color:INK, boxSizing:"border-box" },
  select:    { width:"100%", fontSize:13.5, padding:"10px 13px", border:"1.5px solid #e6e1d6", borderRadius:9, outline:"none", background:"#fff", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", color:INK, boxSizing:"border-box" },
  roleNote:  { marginTop:9, padding:"10px 12px", borderRadius:9, border:"1px solid" },
  err:       { fontSize:12, color:"#9a3030", margin:0, background:"#9a30300d", padding:"8px 12px", borderRadius:7, border:"1px solid #9a303022" },
  danger:    { background:"#9a30300d", border:"1px solid #9a303026", borderRadius:9, padding:"13px 15px", marginBottom:16, fontSize:12.5, color:"#8a2828", lineHeight:1.6 },
  code:      { background:"#f4f1e9", padding:"2px 7px", borderRadius:4, fontSize:12.5, color:INK, fontFamily:"ui-monospace,monospace" },
  footer:    { display:"flex", gap:10, justifyContent:"flex-end", marginTop:22, paddingTop:18, borderTop:"1px solid #ece8de" },
  cancelBtn: { fontSize:12, padding:"10px 18px", border:"1.5px solid #e6e1d6", borderRadius:7, background:"#fff", cursor:"pointer", color:"#6b6456", fontWeight:500, fontFamily:"'DM Sans',sans-serif" },
  primaryBtn:{ fontSize:12, padding:"10px 22px", border:"none", borderRadius:7, background:INK, cursor:"pointer", color:"#F0E8D6", fontWeight:500, fontFamily:"'DM Sans',sans-serif", transition:"opacity .2s" },
};