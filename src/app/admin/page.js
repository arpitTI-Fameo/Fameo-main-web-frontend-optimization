// // // // "use client";
// // // // // app/admin/page.js  — Overview Dashboard

// // // // import { useState, useEffect } from "react";
// // // // import Link from "next/link";
// // // // import { useAuthStore } from "@/store/authStore";

// // // // const ROLE_ACCENT = {
// // // //   superAdmin: "#C9A96E", moduleMaster: "#7eb8d8",
// // // //   contentManager: "#b89fd4", supportAgent: "#7ec87e",
// // // // };

// // // // export default function AdminOverview() {
// // // //   const { user } = useAuthStore();
// // // //   const accent   = ROLE_ACCENT[user?.role] || "#C9A96E";
// // // //   const [stats, setStats]       = useState(null);
// // // //   const [pending, setPending]   = useState([]);
// // // //   const [activity, setActivity] = useState([]);
// // // //   const [loading, setLoading]   = useState(true);

// // // //   useEffect(() => {
// // // //     Promise.all([
// // // //       fetch("/api/admin/stats").then(r => r.json()),
// // // //       fetch("/api/admin/approvals?status=pending&limit=5").then(r => r.json()),
// // // //       fetch("/api/admin/activity?limit=8").then(r => r.json()),
// // // //     ]).then(([s, p, a]) => {
// // // //       setStats(s.data);
// // // //       setPending(p.data?.approvals || []);
// // // //       setActivity(a.data?.activity || []);
// // // //       setLoading(false);
// // // //     }).catch(() => {
// // // //       // Dev fallback
// // // //       setStats({ totalTopics: 48, publishedTopics: 34, draftTopics: 9, pendingApprovals: 3, totalLearners: 1240, activeLearners: 387, totalProducts: 12, revenue: "₹2,84,000" });
// // // //       setPending([
// // // //         { _id: "1", title: "Reels Algorithm Deep Dive", submittedByName: "Kiran M.", type: "topic", submittedAt: new Date().toISOString() },
// // // //         { _id: "2", title: "Brand Deal Template Pack", submittedByName: "Priya S.", type: "product", submittedAt: new Date().toISOString() },
// // // //         { _id: "3", title: "Instagram Growth Masterclass", submittedByName: "Arjun R.", type: "topic", submittedAt: new Date().toISOString() },
// // // //       ]);
// // // //       setActivity([
// // // //         { action: "Published", target: "Creator Foundations — Lesson 3", user: "Admin", time: "2m ago", color: "#7ec87e" },
// // // //         { action: "Approved", target: "Monetization Template Pack", user: "Admin", time: "14m ago", color: "#C9A96E" },
// // // //         { action: "Archived", target: "Old Brand Deal Guide", user: "Kiran M.", time: "1h ago", color: "#d49090" },
// // // //         { action: "Enrolled", target: "45 new learners today", user: "system", time: "2h ago", color: "#7eb8d8" },
// // // //       ]);
// // // //       setLoading(false);
// // // //     });
// // // //   }, []);

// // // //   if (loading) return <div style={S.loading}><span style={{ color: accent }}>◈</span> Loading…</div>;

// // // //   const statCards = [
// // // //     { label: "Published Topics", value: stats?.publishedTopics, sub: `${stats?.draftTopics} drafts`, accent: "#7ec87e" },
// // // //     { label: "Pending Approvals", value: stats?.pendingApprovals, sub: "need review", accent: "#C9A96E", href: "/admin/approvals" },
// // // //     { label: "Active Learners", value: stats?.activeLearners, sub: `of ${stats?.totalLearners?.toLocaleString()} total`, accent: "#7eb8d8" },
// // // //     { label: "Revenue (MTD)", value: stats?.revenue, sub: "this month", accent: "#b89fd4", superAdminOnly: true },
// // // //   ];

// // // //   return (
// // // //     <div style={S.page}>
// // // //       {/* Header */}
// // // //       <div style={S.header}>
// // // //         <div>
// // // //           <h1 style={S.heading}>Good {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}</h1>
// // // //           <p style={S.subheading}>Here's what's happening on Fameo right now.</p>
// // // //         </div>
// // // //         <div style={S.headerActions}>
// // // //           <Link href="/admin/content/new" style={{ ...S.btnPrimary, background: accent, color: "#1a1208" }}>
// // // //             + New Topic
// // // //           </Link>
// // // //         </div>
// // // //       </div>

// // // //       {/* Stat Cards */}
// // // //       <div style={S.statsGrid}>
// // // //         {statCards
// // // //           .filter(c => !c.superAdminOnly || user?.role === "superAdmin")
// // // //           .map(card => (
// // // //             <Link key={card.label} href={card.href || "#"} style={{ ...S.statCard, textDecoration: "none", borderTop: `3px solid ${card.accent}` }}>
// // // //               <span style={S.statValue}>{card.value ?? "—"}</span>
// // // //               <span style={S.statLabel}>{card.label}</span>
// // // //               <span style={S.statSub}>{card.sub}</span>
// // // //             </Link>
// // // //           ))}
// // // //       </div>

// // // //       <div style={S.twoCol}>
// // // //         {/* Pending Approvals */}
// // // //         <div style={S.card}>
// // // //           <div style={S.cardHeader}>
// // // //             <h2 style={S.cardTitle}>Pending Approvals</h2>
// // // //             <Link href="/admin/approvals" style={{ ...S.cardLink, color: accent }}>View all →</Link>
// // // //           </div>
// // // //           {pending.length === 0 ? (
// // // //             <p style={S.emptyMsg}>All caught up ✓</p>
// // // //           ) : pending.map(item => (
// // // //             <div key={item._id} style={S.approvalRow}>
// // // //               <div style={{ ...S.approvalType, background: item.type === "topic" ? "#7ec87e22" : "#C9A96E22", color: item.type === "topic" ? "#3a7c3a" : "#7a5a1a" }}>
// // // //                 {item.type}
// // // //               </div>
// // // //               <div style={S.approvalInfo}>
// // // //                 <span style={S.approvalTitle}>{item.title}</span>
// // // //                 <span style={S.approvalMeta}>by {item.submittedByName} · {timeAgo(item.submittedAt)}</span>
// // // //               </div>
// // // //               <div style={S.approvalActions}>
// // // //                 <ApproveBtn id={item._id} accent={accent} onDone={() => setPending(p => p.filter(x => x._id !== item._id))} />
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         {/* Activity Feed */}
// // // //         <div style={S.card}>
// // // //           <div style={S.cardHeader}>
// // // //             <h2 style={S.cardTitle}>Recent Activity</h2>
// // // //           </div>
// // // //           {activity.map((a, i) => (
// // // //             <div key={i} style={S.activityRow}>
// // // //               <span style={{ ...S.activityDot, background: a.color }} />
// // // //               <div>
// // // //                 <span style={S.activityAction}>{a.action}</span>
// // // //                 <span style={S.activityTarget}> — {a.target}</span>
// // // //                 <div style={S.activityMeta}>{a.user} · {a.time}</div>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       {/* Feature Flags — super admin only */}
// // // //       {user?.role === "superAdmin" && <FeatureFlags accent={accent} />}
// // // //     </div>
// // // //   );
// // // // }

// // // // /* ── Approve/Reject inline buttons ── */
// // // // function ApproveBtn({ id, accent, onDone }) {
// // // //   const [loading, setLoading] = useState(false);
// // // //   const approve = async () => {
// // // //     setLoading(true);
// // // //     await fetch(`/api/admin/approvals/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved" }) });
// // // //     onDone();
// // // //   };
// // // //   return (
// // // //     <div style={{ display: "flex", gap: 6 }}>
// // // //       <button onClick={approve} disabled={loading} style={{ ...S.approveBtn, background: accent + "22", color: accent, border: `1px solid ${accent}44` }}>
// // // //         {loading ? "…" : "✓"}
// // // //       </button>
// // // //       <button onClick={onDone} style={{ ...S.approveBtn, background: "#d4909022", color: "#d49090", border: "1px solid #d4909044" }}>✕</button>
// // // //     </div>
// // // //   );
// // // // }

// // // // /* ── Feature Flags Panel ── */
// // // // function FeatureFlags({ accent }) {
// // // //   const [flags, setFlags] = useState({
// // // //     progressTracking: true, moduleFollowing: true, qaComments: true,
// // // //     shopAndCTAs: true, contentApprovalWorkflow: true, moduleGlossary: false,
// // // //     liveSessionScheduling: false, learnerRegistration: true,
// // // //   });
// // // //   const [saving, setSaving] = useState(false);

// // // //   const toggle = async (key) => {
// // // //     const next = { ...flags, [key]: !flags[key] };
// // // //     setFlags(next);
// // // //     setSaving(true);
// // // //     await fetch("/api/admin/settings/features", {
// // // //       method: "PATCH",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify({ [key]: next[key] }),
// // // //     }).catch(() => {});
// // // //     setSaving(false);
// // // //   };

// // // //   const FLAG_LABELS = {
// // // //     progressTracking: "Progress Tracking", moduleFollowing: "Module Following",
// // // //     qaComments: "Q&A Comments", shopAndCTAs: "Shop & CTAs",
// // // //     contentApprovalWorkflow: "Approval Workflow", moduleGlossary: "Module Glossary",
// // // //     liveSessionScheduling: "Live Sessions", learnerRegistration: "Learner Registration",
// // // //   };

// // // //   return (
// // // //     <div style={S.card}>
// // // //       <div style={S.cardHeader}>
// // // //         <h2 style={S.cardTitle}>Feature Flags</h2>
// // // //         <span style={S.savingIndicator}>{saving ? "Saving…" : "Live — changes reflect instantly"}</span>
// // // //       </div>
// // // //       <div style={S.flagsGrid}>
// // // //         {Object.entries(flags).map(([key, val]) => (
// // // //           <div key={key} style={S.flagRow}>
// // // //             <span style={S.flagLabel}>{FLAG_LABELS[key]}</span>
// // // //             <button onClick={() => toggle(key)} style={{ ...S.toggle, background: val ? accent : "#ddd" }}>
// // // //               <span style={{ ...S.toggleThumb, transform: val ? "translateX(18px)" : "translateX(2px)" }} />
// // // //             </button>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function getGreeting() {
// // // //   const h = new Date().getHours();
// // // //   if (h < 12) return "morning";
// // // //   if (h < 17) return "afternoon";
// // // //   return "evening";
// // // // }
// // // // function timeAgo(iso) {
// // // //   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
// // // //   if (d < 1) return "just now";
// // // //   if (d < 60) return `${d}m ago`;
// // // //   return `${Math.floor(d / 60)}h ago`;
// // // // }

// // // // const S = {
// // // //   page:       { padding: "32px 40px", maxWidth: 1200, margin: "0 auto" },
// // // //   loading:    { display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", fontSize: 18, gap: 10, fontFamily: "'DM Sans',sans-serif" },
// // // //   header:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 },
// // // //   heading:    { fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: "#1a1208", letterSpacing: "-.01em", marginBottom: 4 },
// // // //   subheading: { fontSize: 13, color: "#aaa" },
// // // //   headerActions: { display: "flex", gap: 10 },
// // // //   btnPrimary: { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", border: "none", borderRadius: 6, fontWeight: 600, textDecoration: "none", cursor: "pointer" },

// // // //   statsGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 },
// // // //   statCard:   { background: "#fff", borderRadius: 10, padding: "20px 20px 16px", border: "1.5px solid #ededea", display: "flex", flexDirection: "column", gap: 2, transition: "transform .2s" },
// // // //   statValue:  { fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: "#1a1208", lineHeight: 1, letterSpacing: "-.02em" },
// // // //   statLabel:  { fontSize: 12, fontWeight: 500, color: "#555", marginTop: 6 },
// // // //   statSub:    { fontSize: 11, color: "#bbb" },

// // // //   twoCol:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 },
// // // //   card:       { background: "#fff", borderRadius: 10, border: "1.5px solid #ededea", overflow: "hidden", marginBottom: 16 },
// // // //   cardHeader: { padding: "16px 20px", borderBottom: "1px solid #f0f0ee", display: "flex", alignItems: "center", justifyContent: "space-between" },
// // // //   cardTitle:  { fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: "#1a1208" },
// // // //   cardLink:   { fontSize: 12, textDecoration: "none", letterSpacing: ".04em" },
// // // //   emptyMsg:   { padding: "20px", fontSize: 13, color: "#bbb", textAlign: "center" },

// // // //   approvalRow:    { display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f5f5f2" },
// // // //   approvalType:   { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, fontWeight: 600, flexShrink: 0 },
// // // //   approvalInfo:   { flex: 1, minWidth: 0 },
// // // //   approvalTitle:  { display: "block", fontSize: 13, fontWeight: 400, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
// // // //   approvalMeta:   { fontSize: 11, color: "#bbb" },
// // // //   approvalActions:{ flexShrink: 0 },
// // // //   approveBtn:     { fontSize: 12, padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontWeight: 600 },

// // // //   activityRow:    { display: "flex", gap: 12, padding: "11px 20px", borderBottom: "1px solid #f5f5f2", alignItems: "flex-start" },
// // // //   activityDot:    { width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
// // // //   activityAction: { fontSize: 12, fontWeight: 500, color: "#1a1208" },
// // // //   activityTarget: { fontSize: 12, color: "#666" },
// // // //   activityMeta:   { fontSize: 10, color: "#bbb", marginTop: 2 },

// // // //   savingIndicator:{ fontSize: 10, color: "#bbb", letterSpacing: ".04em" },
// // // //   flagsGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 },
// // // //   flagRow:        { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid #f5f5f2" },
// // // //   flagLabel:      { fontSize: 12, color: "#555" },
// // // //   toggle:         { width: 38, height: 22, borderRadius: 11, border: "none", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 },
// // // //   toggleThumb:    { position: "absolute", top: 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "transform .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" },
// // // // };

// // // "use client";
// // // // app/admin/page.js — Live Overview Dashboard

// // // import { useState, useEffect, useCallback } from "react";
// // // import Link from "next/link";
// // // import { useAdminAuthStore } from "@/store/adminAuthStore";
// // // import { api } from "@/services/api";
// // // import { useSocket } from "@/hooks/useSocket";

// // // const ROLE_ACCENT = { superAdmin: "#C9A96E", moduleMaster: "#7eb8d8", contentManager: "#b89fd4", supportAgent: "#7ec87e" };

// // // function timeAgo(iso) {
// // //   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
// // //   if (d < 1) return "just now"; if (d < 60) return `${d}m ago`;
// // //   if (d < 1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
// // // }
// // // function greeting() { const h = new Date().getHours(); return h<12?"morning":h<17?"afternoon":"evening"; }

// // // export default function AdminOverview() {
// // //   const { user } = useAdminAuthStore();
// // //   const accent   = ROLE_ACCENT[user?.role] || "#C9A96E";
// // //   const [stats, setStats]     = useState(null);
// // //   const [pending, setPending] = useState([]);
// // //   const [activity, setActivity] = useState([]);
// // //   const [flags, setFlags]     = useState({});
// // //   const [flagSaving, setFlagSaving] = useState({});
// // //   const [loading, setLoading] = useState(true);
// // //   const [toast, setToast]     = useState(null);

// // //   const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

// // //   const loadData = useCallback(async () => {
// // //     try {
// // //       const [s, p, a, sets] = await Promise.all([
// // //         api.get("/admin/stats"),
// // //         api.get("/admin/approvals?status=pending&limit=5"),
// // //         api.get("/admin/activity?limit=8"),
// // //         user?.role === "superAdmin" ? api.get("/admin/settings") : Promise.resolve(null),
// // //       ]);
// // //       setStats(s?.data);
// // //       setPending(p?.data?.approvals || []);
// // //       setActivity(a?.data?.activity || []);
// // //       if (sets) setFlags(sets?.data?.features || {});
// // //     } catch {
// // //       setStats({ totalTopics:48, publishedTopics:34, draftTopics:9, pendingApprovals:3, totalLearners:1240, activeLearners:387, revenue:"₹2,84,000" });
// // //       setPending([
// // //         { _id:"1", title:"Reels Algorithm Deep Dive", submittedByName:"Kiran M.", type:"topic", submittedAt: new Date(Date.now()-3600000).toISOString() },
// // //         { _id:"2", title:"Brand Deal Template Pack",  submittedByName:"Priya S.", type:"product",submittedAt: new Date(Date.now()-7200000).toISOString() },
// // //       ]);
// // //       setActivity([
// // //         { action:"Published", target:"Creator Foundations — Lesson 3", user:"Admin",   time:"2m ago",  color:"#7ec87e" },
// // //         { action:"Approved",  target:"Monetization Template Pack",      user:"Admin",   time:"14m ago", color:"#C9A96E" },
// // //         { action:"Archived",  target:"Old Brand Deal Guide",            user:"Kiran M.",time:"1h ago",  color:"#d49090" },
// // //         { action:"Enrolled",  target:"45 new learners today",           user:"system",  time:"2h ago",  color:"#7eb8d8" },
// // //       ]);
// // //       setFlags({ progressTracking:true,moduleFollowing:true,qaComments:true,shopAndCTAs:true,contentApprovalWorkflow:true,moduleGlossary:false,liveSessionScheduling:false,learnerRegistration:true });
// // //     }
// // //     setLoading(false);
// // //   }, [user]);

// // //   useEffect(() => { loadData(); }, [loadData]);

// // //   // Live: re-fetch when any content changes
// // //   useSocket({
// // //     "topic:published":  loadData,
// // //     "topic:archived":   loadData,
// // //     "settings:updated": (data) => { if (data?.features) setFlags(data.features); },
// // //   });

// // //   const approveItem = async (id) => {
// // //     try {
// // //       await api.patch(`/admin/approvals/${id}`, { status: "approved" });
// // //       setPending(p => p.filter(x => x._id !== id));
// // //       showToast("Approved — published live ◉");
// // //     } catch { showToast("Failed", false); }
// // //   };

// // //   const rejectItem = async (id) => {
// // //     try {
// // //       await api.patch(`/admin/approvals/${id}`, { status: "rejected" });
// // //       setPending(p => p.filter(x => x._id !== id));
// // //       showToast("Rejected");
// // //     } catch { showToast("Failed", false); }
// // //   };

// // //   const toggleFlag = async (key) => {
// // //     const next = { ...flags, [key]: !flags[key] };
// // //     setFlags(next);
// // //     setFlagSaving(s => ({...s,[key]:true}));
// // //     try {
// // //       await api.patch("/admin/settings/features", { [key]: next[key] });
// // //       showToast(`${key} ${next[key]?"enabled":"disabled"} — live instantly`);
// // //     } catch { showToast("Save failed", false); }
// // //     setFlagSaving(s => ({...s,[key]:false}));
// // //   };

// // //   if (loading) return <div style={S.loading}><span style={{color:accent,fontSize:20}}>◈</span> Loading…</div>;

// // //   const statCards = [
// // //     { label:"Published Topics",  value:stats?.publishedTopics,                         sub:`${stats?.draftTopics||0} drafts`,      accent:"#7ec87e",  href:"/admin/content"   },
// // //     { label:"Pending Approvals", value:stats?.pendingApprovals,                        sub:"need review",                          accent:"#C9A96E",  href:"/admin/approval"  },
// // //     { label:"Active Learners",   value:stats?.activeLearners,                          sub:`of ${stats?.totalLearners?.toLocaleString()||0} total`, accent:"#7eb8d8", href:"/admin/contacts" },
// // //     { label:"Revenue (MTD)",     value:stats?.revenue,                                 sub:"this month",                           accent:"#b89fd4",  href:"/admin/revenue", superAdminOnly:true },
// // //   ];

// // //   const FLAG_LABELS = {
// // //     progressTracking:"Progress Tracking", moduleFollowing:"Module Following",
// // //     qaComments:"Q&A Comments", shopAndCTAs:"Shop & CTAs",
// // //     contentApprovalWorkflow:"Approval Workflow", moduleGlossary:"Module Glossary",
// // //     liveSessionScheduling:"Live Sessions", learnerRegistration:"Learner Registration",
// // //   };

// // //   return (
// // //     <div style={S.page}>
// // //       {toast && <div style={{...S.toast,background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

// // //       {/* Header */}
// // //       <div style={S.header}>
// // //         <div>
// // //           <h1 style={S.heading}>Good {greeting()}, {user?.name?.split(" ")[0] || "Admin"}</h1>
// // //           <p style={S.sub}>Here's what's happening on Fameo right now.</p>
// // //         </div>
// // //         <Link href="/admin/content/new" style={{...S.newBtn, background:accent, color:"#1a1208"}}>+ New Topic</Link>
// // //       </div>

// // //       {/* Stat cards */}
// // //       <div style={S.statsGrid}>
// // //         {statCards.filter(c => !c.superAdminOnly || user?.role==="superAdmin").map(c => (
// // //           <Link key={c.label} href={c.href||"#"} style={{...S.statCard, borderTop:`3px solid ${c.accent}`, textDecoration:"none"}}>
// // //             <span style={S.statValue}>{c.value ?? "—"}</span>
// // //             <span style={S.statLabel}>{c.label}</span>
// // //             <span style={S.statSub}>{c.sub}</span>
// // //           </Link>
// // //         ))}
// // //       </div>

// // //       <div style={S.twoCol}>
// // //         {/* Pending approvals */}
// // //         <div style={S.card}>
// // //           <div style={S.cardHead}>
// // //             <h2 style={S.cardTitle}>Pending Approvals</h2>
// // //             <Link href="/admin/approval" style={{...S.cardLink,color:accent}}>View all →</Link>
// // //           </div>
// // //           {pending.length===0 ? <p style={S.empty}>All caught up ✓</p> :
// // //            pending.map(item=>(
// // //             <div key={item._id} style={S.approvalRow}>
// // //               <span style={{...S.typePill, background:item.type==="topic"?"#7ec87e22":"#C9A96E22", color:item.type==="topic"?"#3a7c3a":"#7a5a1a"}}>{item.type}</span>
// // //               <div style={S.approvalInfo}>
// // //                 <span style={S.approvalTitle}>{item.title}</span>
// // //                 <span style={S.approvalMeta}>by {item.submittedByName} · {timeAgo(item.submittedAt)}</span>
// // //               </div>
// // //               <div style={{display:"flex",gap:6}}>
// // //                 <button onClick={()=>approveItem(item._id)} style={{...S.approveBtn,background:accent+"22",color:accent,border:`1px solid ${accent}44`}}>✓</button>
// // //                 <button onClick={()=>rejectItem(item._id)}  style={{...S.approveBtn,background:"#d4909022",color:"#d49090",border:"1px solid #d4909044"}}>✕</button>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Activity feed */}
// // //         <div style={S.card}>
// // //           <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Activity</h2></div>
// // //           {activity.map((a,i)=>(
// // //             <div key={i} style={S.activityRow}>
// // //               <span style={{...S.activityDot,background:a.color}}/>
// // //               <div>
// // //                 <span style={S.activityAction}>{a.action}</span>
// // //                 <span style={S.activityTarget}> — {a.target}</span>
// // //                 <div style={S.activityMeta}>{a.user} · {a.time}</div>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Feature flags — superAdmin only */}
// // //       {user?.role==="superAdmin" && (
// // //         <div style={S.card}>
// // //           <div style={S.cardHead}>
// // //             <h2 style={S.cardTitle}>Feature Flags</h2>
// // //             <span style={S.liveNote}>◉ Live — changes reflect instantly on Learner Hub</span>
// // //           </div>
// // //           <div style={S.flagsGrid}>
// // //             {Object.entries(FLAG_LABELS).map(([key,label])=>(
// // //               <div key={key} style={S.flagRow}>
// // //                 <span style={S.flagLabel}>{label}</span>
// // //                 <div style={{display:"flex",alignItems:"center",gap:6}}>
// // //                   {flagSaving[key] && <span style={{fontSize:10,color:"#bbb"}}>…</span>}
// // //                   <button onClick={()=>toggleFlag(key)} style={{...S.toggle,background:flags[key]?accent:"#ddd"}}>
// // //                     <span style={{...S.toggleThumb,transform:flags[key]?"translateX(18px)":"translateX(2px)"}}/>
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // const S = {
// // //   page:        { padding:"32px 40px",maxWidth:1200,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
// // //   loading:     { display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",fontSize:16,gap:12,fontFamily:"'DM Sans',sans-serif",color:"#999" },
// // //   toast:       { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
// // //   header:      { display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:32 },
// // //   heading:     { fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:400,color:"#1a1208",letterSpacing:"-.01em",marginBottom:4 },
// // //   sub:         { fontSize:13,color:"#aaa" },
// // //   newBtn:      { fontSize:11,letterSpacing:".1em",textTransform:"uppercase",padding:"10px 20px",border:"none",borderRadius:6,fontWeight:600,textDecoration:"none",cursor:"pointer" },
// // //   statsGrid:   { display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24 },
// // //   statCard:    { background:"#fff",borderRadius:10,padding:"20px 20px 16px",border:"1.5px solid #ededea",display:"flex",flexDirection:"column",gap:2 },
// // //   statValue:   { fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:"#1a1208",lineHeight:1,letterSpacing:"-.02em" },
// // //   statLabel:   { fontSize:12,fontWeight:500,color:"#555",marginTop:6 },
// // //   statSub:     { fontSize:11,color:"#bbb" },
// // //   twoCol:      { display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 },
// // //   card:        { background:"#fff",borderRadius:10,border:"1.5px solid #ededea",overflow:"hidden",marginBottom:16 },
// // //   cardHead:    { padding:"16px 20px",borderBottom:"1px solid #f0f0ee",display:"flex",alignItems:"center",justifyContent:"space-between" },
// // //   cardTitle:   { fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,color:"#1a1208" },
// // //   cardLink:    { fontSize:12,textDecoration:"none",letterSpacing:".04em" },
// // //   empty:       { padding:"20px",fontSize:13,color:"#bbb",textAlign:"center" },
// // //   approvalRow: { display:"flex",alignItems:"center",gap:12,padding:"11px 20px",borderBottom:"1px solid #f5f5f2" },
// // //   typePill:    { fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 7px",borderRadius:3,fontWeight:600,flexShrink:0 },
// // //   approvalInfo:{ flex:1,minWidth:0 },
// // //   approvalTitle:{ display:"block",fontSize:13,fontWeight:400,color:"#1a1208",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" },
// // //   approvalMeta: { fontSize:11,color:"#bbb" },
// // //   approveBtn:  { fontSize:12,padding:"4px 9px",borderRadius:5,cursor:"pointer",fontWeight:600 },
// // //   activityRow: { display:"flex",gap:12,padding:"11px 20px",borderBottom:"1px solid #f5f5f2",alignItems:"flex-start" },
// // //   activityDot: { width:7,height:7,borderRadius:"50%",flexShrink:0,marginTop:5 },
// // //   activityAction:{ fontSize:12,fontWeight:500,color:"#1a1208" },
// // //   activityTarget:{ fontSize:12,color:"#666" },
// // //   activityMeta:  { fontSize:10,color:"#bbb",marginTop:2 },
// // //   liveNote:    { fontSize:11,color:"#7ec87e",fontWeight:500 },
// // //   flagsGrid:   { display:"grid",gridTemplateColumns:"1fr 1fr",gap:0 },
// // //   flagRow:     { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid #f5f5f2" },
// // //   flagLabel:   { fontSize:12,color:"#555" },
// // //   toggle:      { width:38,height:22,borderRadius:11,border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0 },
// // //   toggleThumb: { position:"absolute",top:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"transform .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" },
// // // };

// // "use client";
// // // app/admin/page.js — Live Overview Dashboard

// // import { useState, useEffect, useCallback } from "react";
// // import Link from "next/link";
// // import { useAdminAuthStore } from "@/store/adminAuthStore";
// // import { api } from "@/services/api";
// // import { useSocket } from "@/hooks/useSocket";

// // const ROLE_ACCENT = { superAdmin:"#C9A96E", moduleMaster:"#7eb8d8", contentManager:"#b89fd4", supportAgent:"#7ec87e" };

// // function timeAgo(iso) {
// //   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
// //   if (d < 1) return "just now"; if (d < 60) return `${d}m ago`;
// //   if (d < 1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
// // }
// // function greeting() { const h = new Date().getHours(); return h<12?"morning":h<17?"afternoon":"evening"; }

// // export default function AdminOverview() {
// //   const { user } = useAdminAuthStore();
// //   const role     = user?.role;
// //   const accent   = ROLE_ACCENT[role] || "#C9A96E";

// //   // ── Permission flags
// //   const canApprove  = ["superAdmin","contentManager"].includes(role);
// //   const canCreate   = ["superAdmin","contentManager","moduleMaster"].includes(role);
// //   const isSA        = role === "superAdmin";
// //   const isSupport   = role === "supportAgent";
// //   const isMM        = role === "moduleMaster";

// //   const [stats, setStats]       = useState(null);
// //   const [pending, setPending]   = useState([]);
// //   const [activity, setActivity] = useState([]);
// //   const [flags, setFlags]       = useState({});
// //   const [flagSaving, setFlagSaving] = useState({});
// //   const [loading, setLoading]   = useState(true);
// //   const [toast, setToast]       = useState(null);

// //   const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

// //   const loadData = useCallback(async () => {
// //     try {
// //       const calls = [
// //         api.get("/admin/stats"),
// //         api.get("/admin/activity?limit=8"),
// //       ];
// //       // Only roles that can approve fetch pending queue
// //       if (canApprove) calls.push(api.get("/admin/approvals?status=pending&limit=5"));
// //       // Only superAdmin fetches settings/flags
// //       if (isSA) calls.push(api.get("/admin/settings"));

// //       const results = await Promise.all(calls);
// //       setStats(results[0]?.data);
// //       setActivity(results[1]?.data?.activity || []);
// //       if (canApprove) setPending(results[2]?.data?.approvals || []);
// //       if (isSA && results[3]) setFlags(results[3]?.data?.features || {});
// //     } catch {
// //       setStats({ totalTopics:48, publishedTopics:34, draftTopics:9, pendingApprovals:3, totalLearners:1240, activeLearners:387, revenue:"₹2,84,000" });
// //       if (canApprove) setPending([
// //         { _id:"1", title:"Reels Algorithm Deep Dive", submittedByName:"Kiran M.", type:"topic",   submittedAt:new Date(Date.now()-3600000).toISOString() },
// //         { _id:"2", title:"Brand Deal Template Pack",  submittedByName:"Priya S.", type:"product", submittedAt:new Date(Date.now()-7200000).toISOString() },
// //       ]);
// //       setActivity([
// //         { action:"Published", target:"Creator Foundations — Lesson 3", user:"Admin",    time:"2m ago",  color:"#7ec87e" },
// //         { action:"Approved",  target:"Monetization Template Pack",      user:"Admin",    time:"14m ago", color:"#C9A96E" },
// //         { action:"Archived",  target:"Old Brand Deal Guide",            user:"Kiran M.", time:"1h ago",  color:"#d49090" },
// //         { action:"Enrolled",  target:"45 new learners today",           user:"system",   time:"2h ago",  color:"#7eb8d8" },
// //       ]);
// //       if (isSA) setFlags({ progressTracking:true, moduleFollowing:true, qaComments:true, shopAndCTAs:true, contentApprovalWorkflow:true, moduleGlossary:false, liveSessionScheduling:false, learnerRegistration:true });
// //     }
// //     setLoading(false);
// //   }, [user, canApprove, isSA]);

// //   useEffect(() => { loadData(); }, [loadData]);

// //   useSocket({
// //     "topic:published":  loadData,
// //     "topic:archived":   loadData,
// //     "settings:updated": (data) => { if (data?.features) setFlags(data.features); },
// //   });

// //   const approveItem = async (id) => {
// //     try {
// //       await api.patch(`/admin/approvals/${id}`, { status:"approved" });
// //       setPending(p => p.filter(x => x._id !== id));
// //       showToast("Approved — published live ◉");
// //     } catch { showToast("Failed", false); }
// //   };

// //   const rejectItem = async (id) => {
// //     try {
// //       await api.patch(`/admin/approvals/${id}`, { status:"rejected" });
// //       setPending(p => p.filter(x => x._id !== id));
// //       showToast("Rejected");
// //     } catch { showToast("Failed", false); }
// //   };

// //   const toggleFlag = async (key) => {
// //     const next = { ...flags, [key]: !flags[key] };
// //     setFlags(next);
// //     setFlagSaving(s => ({...s,[key]:true}));
// //     try {
// //       await api.patch("/admin/settings/features", { [key]: next[key] });
// //       showToast(`${key} ${next[key]?"enabled":"disabled"} — live instantly`);
// //     } catch { showToast("Save failed", false); }
// //     setFlagSaving(s => ({...s,[key]:false}));
// //   };

// //   if (loading) return <div style={S.loading}><span style={{color:accent,fontSize:20}}>◈</span> Loading…</div>;

// //   // ── Stat cards — filtered by role
// //   // const statCards = [
// //   //   { label:"Published Topics",  value:stats?.publishedTopics, sub:`${stats?.draftTopics||0} drafts`, accent:"#7ec87e", href:"/admin/content" },
// //   //   // Pending Approvals — only for roles that can approve
// //   //   ...(canApprove ? [{ label:"Pending Approvals", value:stats?.pendingApprovals, sub:"need review", accent:"#C9A96E", href:"/admin/approval" }] : []),
// //   //   { label:"Active Learners",   value:stats?.activeLearners, sub:`of ${stats?.totalLearners?.toLocaleString()||0} total`, accent:"#7eb8d8", href:"/admin/contacts" },
// //   //   // Revenue — superAdmin only
// //   //   ...(isSA ? [{ label:"Revenue (MTD)", value:stats?.revenue, sub:"this month", accent:"#b89fd4", href:"/admin/revenue" }] : []),
// //   // ];
// //   // Replace statCards definition
// // const statCards = [
// //   // supportAgent only sees their ticket count
// //   ...(isSupport ? [] : [
// //     { label:"Published Topics", value:stats?.publishedTopics, sub:`${stats?.draftTopics||0} drafts`, accent:"#7ec87e", href:"/admin/content" },
// //   ]),
// //   ...(canApprove ? [
// //     { label:"Pending Approvals", value:stats?.pendingApprovals, sub:"need review", accent:"#C9A96E", href:"/admin/approval" },
// //   ] : []),
// //   ...(isSupport ? [
// //     { label:"Open Tickets",   value:stats?.openTickets   || "—", sub:"need response",   accent:"#7ec87e", href:"/admin/support" },
// //     { label:"Total Learners", value:stats?.totalLearners || "—", sub:"registered users", accent:"#7eb8d8", href:"/admin/contacts" },
// //   ] : [
// //     { label:"Active Learners", value:stats?.activeLearners, sub:`of ${stats?.totalLearners?.toLocaleString()||0} total`, accent:"#7eb8d8", href:"/admin/contacts" },
// //   ]),
// //   ...(isSA ? [{ label:"Revenue (MTD)", value:stats?.revenue, sub:"this month", accent:"#b89fd4", href:"/admin/revenue" }] : []),
// // ];

// //   const FLAG_LABELS = {
// //     progressTracking:"Progress Tracking", moduleFollowing:"Module Following",
// //     qaComments:"Q&A Comments", shopAndCTAs:"Shop & CTAs",
// //     contentApprovalWorkflow:"Approval Workflow", moduleGlossary:"Module Glossary",
// //     liveSessionScheduling:"Live Sessions", learnerRegistration:"Learner Registration",
// //   };

// //   // ── Role-specific greeting subtitle
// //   const roleSub = {
// //     superAdmin:     "Here's what's happening on Fameo right now.",
// //     contentManager: "Your content queue and activity feed.",
// //     moduleMaster:   `Your assigned modules and submission status.`,
// //     supportAgent:   "Your open tickets and learner queue.",
// //   }[role] || "Here's what's happening on Fameo right now.";

// //   return (
// //     <div style={S.page}>
// //       {toast && <div style={{...S.toast,background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

// //       {/* Header */}
// //       <div style={S.header}>
// //         <div>
// //           <h1 style={S.heading}>Good {greeting()}, {user?.name?.split(" ")[0] || "Admin"}</h1>
// //           <p style={S.sub}>{roleSub}</p>
// //         </div>
// //         {/* New Topic button — not for supportAgent */}
// //         {canCreate && (
// //           <Link href="/admin/content/new" style={{...S.newBtn, background:accent, color:"#1a1200"}}>
// //             + New Topic
// //           </Link>
// //         )}
// //         {/* Support Agent — go to support directly */}
// //         {isSupport && (
// //           <Link href="/admin/support" style={{...S.newBtn, background:accent, color:"#1a1200"}}>
// //             View Tickets →
// //           </Link>
// //         )}
// //       </div>

// //       {/* Stat cards */}
// //       <div style={S.statsGrid}>
// //         {statCards.map(c => (
// //           <Link key={c.label} href={c.href||"#"} style={{...S.statCard, borderTop:`3px solid ${c.accent}`, textDecoration:"none"}}>
// //             <span style={S.statValue}>{c.value ?? "—"}</span>
// //             <span style={S.statLabel}>{c.label}</span>
// //             <span style={S.statSub}>{c.sub}</span>
// //           </Link>
// //         ))}
// //       </div>

// //       {/* ── supportAgent: show only activity feed */}
// //       {isSupport && (
// //         <div style={S.card}>
// //           <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Platform Activity</h2></div>
// //           {activity.map((a,i) => (
// //             <div key={i} style={S.activityRow}>
// //               <span style={{...S.activityDot, background:a.color}}/>
// //               <div>
// //                 <span style={S.activityAction}>{a.action}</span>
// //                 <span style={S.activityTarget}> — {a.target}</span>
// //                 <div style={S.activityMeta}>{a.user} · {a.time}</div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* ── moduleMaster: show their submission status */}
// //       {isMM && (
// //         <div style={S.twoCol}>
// //           <div style={S.card}>
// //             <div style={S.cardHead}>
// //               <h2 style={S.cardTitle}>My Submissions</h2>
// //               <Link href="/admin/content" style={{...S.cardLink, color:accent}}>View all →</Link>
// //             </div>
// //             {pending.length === 0
// //               ? <p style={S.empty}>No pending submissions</p>
// //               : pending.map(item => (
// //                 <div key={item._id} style={S.approvalRow}>
// //                   <span style={{...S.typePill, background:"#7eb8d822", color:"#1a4a7a"}}>{item.type}</span>
// //                   <div style={S.approvalInfo}>
// //                     <span style={S.approvalTitle}>{item.title}</span>
// //                     <span style={S.approvalMeta}>Submitted {timeAgo(item.submittedAt)}</span>
// //                   </div>
// //                   <span style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,background:"#7eb8d822",color:"#1a4a7a",fontWeight:600}}>
// //                     In Review
// //                   </span>
// //                 </div>
// //               ))
// //             }
// //           </div>
// //           <div style={S.card}>
// //             <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Activity</h2></div>
// //             {activity.map((a,i) => (
// //               <div key={i} style={S.activityRow}>
// //                 <span style={{...S.activityDot, background:a.color}}/>
// //                 <div>
// //                   <span style={S.activityAction}>{a.action}</span>
// //                   <span style={S.activityTarget}> — {a.target}</span>
// //                   <div style={S.activityMeta}>{a.user} · {a.time}</div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* ── superAdmin + contentManager: full two-column view */}
// //       {canApprove && (
// //         <div style={S.twoCol}>
// //           <div style={S.card}>
// //             <div style={S.cardHead}>
// //               <h2 style={S.cardTitle}>Pending Approvals</h2>
// //               <Link href="/admin/approval" style={{...S.cardLink, color:accent}}>View all →</Link>
// //             </div>
// //             {pending.length === 0
// //               ? <p style={S.empty}>All caught up ✓</p>
// //               : pending.map(item => (
// //                 <div key={item._id} style={S.approvalRow}>
// //                   <span style={{...S.typePill, background:item.type==="topic"?"#7ec87e22":"#C9A96E22", color:item.type==="topic"?"#3a7c3a":"#7a5a1a"}}>{item.type}</span>
// //                   <div style={S.approvalInfo}>
// //                     <span style={S.approvalTitle}>{item.title}</span>
// //                     <span style={S.approvalMeta}>by {item.submittedByName} · {timeAgo(item.submittedAt)}</span>
// //                   </div>
// //                   <div style={{display:"flex",gap:6}}>
// //                     <button onClick={()=>approveItem(item._id)} style={{...S.approveBtn,background:accent+"22",color:accent,border:`1px solid ${accent}44`}}>✓</button>
// //                     <button onClick={()=>rejectItem(item._id)}  style={{...S.approveBtn,background:"#d4909022",color:"#d49090",border:"1px solid #d4909044"}}>✕</button>
// //                   </div>
// //                 </div>
// //               ))
// //             }
// //           </div>
// //           <div style={S.card}>
// //             <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Activity</h2></div>
// //             {activity.map((a,i) => (
// //               <div key={i} style={S.activityRow}>
// //                 <span style={{...S.activityDot, background:a.color}}/>
// //                 <div>
// //                   <span style={S.activityAction}>{a.action}</span>
// //                   <span style={S.activityTarget}> — {a.target}</span>
// //                   <div style={S.activityMeta}>{a.user} · {a.time}</div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* Feature flags — superAdmin only */}
// //       {isSA && (
// //         <div style={S.card}>
// //           <div style={S.cardHead}>
// //             <h2 style={S.cardTitle}>Feature Flags</h2>
// //             <span style={S.liveNote}>◉ Live — changes reflect instantly on Learner Hub</span>
// //           </div>
// //           <div style={S.flagsGrid}>
// //             {Object.entries(FLAG_LABELS).map(([key,label]) => (
// //               <div key={key} style={S.flagRow}>
// //                 <span style={S.flagLabel}>{label}</span>
// //                 <div style={{display:"flex",alignItems:"center",gap:6}}>
// //                   {flagSaving[key] && <span style={{fontSize:10,color:"#bbb"}}>…</span>}
// //                   <button onClick={()=>toggleFlag(key)} style={{...S.toggle, background:flags[key]?accent:"#ddd"}}>
// //                     <span style={{...S.toggleThumb, transform:flags[key]?"translateX(18px)":"translateX(2px)"}}/>
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // const S = {
// //   page:          { padding:"32px 40px", maxWidth:1200, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
// //   loading:       { display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", fontSize:16, gap:12, fontFamily:"'DM Sans',sans-serif", color:"#999" },
// //   toast:         { position:"fixed", top:20, right:20, zIndex:999, padding:"12px 20px", borderRadius:8, color:"#fff", fontSize:13, fontWeight:500, boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
// //   header:        { display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32 },
// //   heading:       { fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:400, color:"#1a1208", letterSpacing:"-.01em", marginBottom:4 },
// //   sub:           { fontSize:13, color:"#aaa" },
// //   newBtn:        { fontSize:11, letterSpacing:".1em", textTransform:"uppercase", padding:"10px 20px", border:"none", borderRadius:6, fontWeight:600, textDecoration:"none", cursor:"pointer", flexShrink:0 },
// //   statsGrid:     { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:24 },
// //   statCard:      { background:"#fff", borderRadius:10, padding:"20px 20px 16px", border:"1.5px solid #ededea", display:"flex", flexDirection:"column", gap:2 },
// //   statValue:     { fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300, color:"#1a1208", lineHeight:1, letterSpacing:"-.02em" },
// //   statLabel:     { fontSize:12, fontWeight:500, color:"#555", marginTop:6 },
// //   statSub:       { fontSize:11, color:"#bbb" },
// //   twoCol:        { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 },
// //   card:          { background:"#fff", borderRadius:10, border:"1.5px solid #ededea", overflow:"hidden", marginBottom:16 },
// //   cardHead:      { padding:"16px 20px", borderBottom:"1px solid #f0f0ee", display:"flex", alignItems:"center", justifyContent:"space-between" },
// //   cardTitle:     { fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:400, color:"#1a1208" },
// //   cardLink:      { fontSize:12, textDecoration:"none", letterSpacing:".04em" },
// //   empty:         { padding:"20px", fontSize:13, color:"#bbb", textAlign:"center" },
// //   approvalRow:   { display:"flex", alignItems:"center", gap:12, padding:"11px 20px", borderBottom:"1px solid #f5f5f2" },
// //   typePill:      { fontSize:9, letterSpacing:".1em", textTransform:"uppercase", padding:"2px 7px", borderRadius:3, fontWeight:600, flexShrink:0 },
// //   approvalInfo:  { flex:1, minWidth:0 },
// //   approvalTitle: { display:"block", fontSize:13, fontWeight:400, color:"#1a1208", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
// //   approvalMeta:  { fontSize:11, color:"#bbb" },
// //   approveBtn:    { fontSize:12, padding:"4px 9px", borderRadius:5, cursor:"pointer", fontWeight:600 },
// //   activityRow:   { display:"flex", gap:12, padding:"11px 20px", borderBottom:"1px solid #f5f5f2", alignItems:"flex-start" },
// //   activityDot:   { width:7, height:7, borderRadius:"50%", flexShrink:0, marginTop:5 },
// //   activityAction:{ fontSize:12, fontWeight:500, color:"#1a1208" },
// //   activityTarget:{ fontSize:12, color:"#666" },
// //   activityMeta:  { fontSize:10, color:"#bbb", marginTop:2 },
// //   liveNote:      { fontSize:11, color:"#7ec87e", fontWeight:500 },
// //   flagsGrid:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 },
// //   flagRow:       { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", borderBottom:"1px solid #f5f5f2" },
// //   flagLabel:     { fontSize:12, color:"#555" },
// //   toggle:        { width:38, height:22, borderRadius:11, border:"none", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 },
// //   toggleThumb:   { position:"absolute", top:2, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"transform .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" },
// // };

// "use client";
// // app/admin/page.js — Live Overview Dashboard

// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";
// import { COURSES } from "@/constants/courses";  // ← add

// const ROLE_ACCENT = { superAdmin:"#C9A96E", moduleMaster:"#7eb8d8", contentManager:"#b89fd4", supportAgent:"#7ec87e" };

// function timeAgo(iso) {
//   const d = Math.floor((Date.now() - new Date(iso)) / 60000);
//   if (d < 1) return "just now"; if (d < 60) return `${d}m ago`;
//   if (d < 1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
// }
// function greeting() { const h = new Date().getHours(); return h<12?"morning":h<17?"afternoon":"evening"; }

// export default function AdminOverview() {
//   const { user } = useAdminAuthStore();
//   const role     = user?.role;
//   const accent   = ROLE_ACCENT[role] || "#C9A96E";

//   const canApprove  = ["superAdmin","contentManager"].includes(role);
//   const canCreate   = ["superAdmin","contentManager","moduleMaster"].includes(role);
//   const isSA        = role === "superAdmin";
//   const isSupport   = role === "supportAgent";
//   const isMM        = role === "moduleMaster";

//   const [stats, setStats]           = useState(null);
//   const [pending, setPending]       = useState([]);
//   const [activity, setActivity]     = useState([]);
//   const [flags, setFlags]           = useState({});
//   const [flagSaving, setFlagSaving] = useState({});
//   const [loading, setLoading]       = useState(true);
//   const [toast, setToast]           = useState(null);

//   const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

//   const loadData = useCallback(async () => {
//     try {
//       const calls = [
//         api.get("/admin/stats"),
//         api.get("/admin/activity?limit=8"),
//       ];
//       if (canApprove) calls.push(api.get("/admin/approvals?status=pending&limit=5"));
//       if (isSA)       calls.push(api.get("/admin/settings"));

//       const results = await Promise.all(calls);
//       setStats(results[0]?.data);
//       setActivity(results[1]?.data?.activity || []);
//       if (canApprove) setPending(results[2]?.data?.approvals || []);
//       if (isSA && results[3]) setFlags(results[3]?.data?.features || {});
//     } catch {
//       setStats({ totalTopics:48, publishedTopics:34, draftTopics:9, pendingApprovals:3, totalLearners:1240, activeLearners:387, revenue:"₹2,84,000" });
//       if (canApprove) setPending([
//         { _id:"1", title:"Reels Algorithm Deep Dive", submittedByName:"Kiran M.", type:"topic",   submittedAt:new Date(Date.now()-3600000).toISOString() },
//         { _id:"2", title:"Brand Deal Template Pack",  submittedByName:"Priya S.", type:"product", submittedAt:new Date(Date.now()-7200000).toISOString() },
//       ]);
//       setActivity([
//         { action:"Published", target:"Creator Foundations — Lesson 3", user:"Admin",    time:"2m ago",  color:"#7ec87e" },
//         { action:"Approved",  target:"Monetization Template Pack",      user:"Admin",    time:"14m ago", color:"#C9A96E" },
//         { action:"Archived",  target:"Old Brand Deal Guide",            user:"Kiran M.", time:"1h ago",  color:"#d49090" },
//         { action:"Enrolled",  target:"45 new learners today",           user:"system",   time:"2h ago",  color:"#7eb8d8" },
//       ]);
//       if (isSA) setFlags({ progressTracking:true, moduleFollowing:true, qaComments:true, shopAndCTAs:true, contentApprovalWorkflow:true, moduleGlossary:false, liveSessionScheduling:false, learnerRegistration:true });
//     }
//     setLoading(false);
//   }, [user, canApprove, isSA]);

//   useEffect(() => { loadData(); }, [loadData]);

//   useSocket({
//     "topic:published":  loadData,
//     "topic:archived":   loadData,
//     "settings:updated": (data) => { if (data?.features) setFlags(data.features); },
//   });

//   const approveItem = async (id) => {
//     try {
//       await api.patch(`/admin/approvals/${id}`, { status:"approved" });
//       setPending(p => p.filter(x => x._id !== id));
//       showToast("Approved — published live ◉");
//     } catch { showToast("Failed", false); }
//   };

//   const rejectItem = async (id) => {
//     try {
//       await api.patch(`/admin/approvals/${id}`, { status:"rejected" });
//       setPending(p => p.filter(x => x._id !== id));
//       showToast("Rejected");
//     } catch { showToast("Failed", false); }
//   };

//   const toggleFlag = async (key) => {
//     const next = { ...flags, [key]: !flags[key] };
//     setFlags(next);
//     setFlagSaving(s => ({...s,[key]:true}));
//     try {
//       await api.patch("/admin/settings/features", { [key]: next[key] });
//       showToast(`${key} ${next[key]?"enabled":"disabled"} — live instantly`);
//     } catch { showToast("Save failed", false); }
//     setFlagSaving(s => ({...s,[key]:false}));
//   };

//   if (loading) return <div style={S.loading}><span style={{color:accent,fontSize:20}}>◈</span> Loading…</div>;

//   const statCards = [
//     ...(isSupport ? [] : [
//       { label:"Published Topics", value:stats?.publishedTopics, sub:`${stats?.draftTopics||0} drafts`, accent:"#7ec87e", href:"/admin/content" },
//     ]),
//     ...(canApprove ? [
//       { label:"Pending Approvals", value:stats?.pendingApprovals, sub:"need review", accent:"#C9A96E", href:"/admin/approval" },
//     ] : []),
//     ...(isSupport ? [
//       { label:"Open Tickets",   value:stats?.openTickets||"—",   sub:"need response",   accent:"#7ec87e", href:"/admin/support"  },
//       { label:"Total Learners", value:stats?.totalLearners||"—", sub:"registered users", accent:"#7eb8d8", href:"/admin/contacts" },
//     ] : [
//       { label:"Active Learners", value:stats?.activeLearners, sub:`of ${stats?.totalLearners?.toLocaleString()||0} total`, accent:"#7eb8d8", href:"/admin/contacts" },
//     ]),
//     ...(isSA ? [{ label:"Revenue (MTD)", value:stats?.revenue, sub:"this month", accent:"#b89fd4", href:"/admin/revenue" }] : []),
//   ];

//   const FLAG_LABELS = {
//     progressTracking:"Progress Tracking", moduleFollowing:"Module Following",
//     qaComments:"Q&A Comments", shopAndCTAs:"Shop & CTAs",
//     contentApprovalWorkflow:"Approval Workflow", moduleGlossary:"Module Glossary",
//     liveSessionScheduling:"Live Sessions", learnerRegistration:"Learner Registration",
//   };

//   const roleSub = {
//     superAdmin:     "Here's what's happening on Fameo right now.",
//     contentManager: "Your content queue and activity feed.",
//     moduleMaster:   "Your assigned modules and submission status.",
//     supportAgent:   "Your open tickets and learner queue.",
//   }[role] || "Here's what's happening on Fameo right now.";

//   return (
//     <div style={S.page}>
//       {toast && <div style={{...S.toast,background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

//       {/* Header */}
//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Good {greeting()}, {user?.name?.split(" ")[0] || "Admin"}</h1>
//           <p style={S.sub}>{roleSub}</p>
//         </div>
//         <div style={{display:"flex",gap:10}}>
//           {canCreate && (
//             <Link href="/admin/content/new" style={{...S.newBtn, background:accent, color:"#1a1200"}}>
//               + New Topic
//             </Link>
//           )}
//           {(isSA || role==="contentManager") && (
//             <Link href="/admin/courses" style={{...S.newBtn, background:"#1a1208", color:"#F0E8D6"}}>
//               Manage Courses
//             </Link>
//           )}
//           {isSupport && (
//             <Link href="/admin/support" style={{...S.newBtn, background:accent, color:"#1a1200"}}>
//               View Tickets →
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Stat cards */}
//       <div style={S.statsGrid}>
//         {statCards.map(c => (
//           <Link key={c.label} href={c.href||"#"} style={{...S.statCard, borderTop:`3px solid ${c.accent}`, textDecoration:"none"}}>
//             <span style={S.statValue}>{c.value ?? "—"}</span>
//             <span style={S.statLabel}>{c.label}</span>
//             <span style={S.statSub}>{c.sub}</span>
//           </Link>
//         ))}
//       </div>

//       {/* ── Course Catalog — superAdmin + contentManager */}
//       {(isSA || role==="contentManager") && (
//         <div style={{...S.card, marginBottom:24}}>
//           <div style={S.cardHead}>
//             <h2 style={S.cardTitle}>Course Catalog <span style={{fontSize:13,color:"#bbb",fontWeight:400,fontFamily:"'DM Sans',sans-serif"}}>({COURSES.length})</span></h2>
//             <Link href="/admin/courses" style={{...S.cardLink, color:accent}}>Manage all →</Link>
//           </div>
//           <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))"}}>
//             {COURSES.map((c,i) => (
//               <div key={c.id} style={{
//                 display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
//                 borderBottom:"1px solid #f5f5f2",
//                 borderRight: (i % 2 === 0) ? "1px solid #f5f5f2" : "none",
//               }}>
//                 <div style={{
//                   width:42, height:28, borderRadius:3, flexShrink:0,
//                   backgroundImage:`url(${c.thumbnail})`,
//                   backgroundSize:"cover", backgroundPosition:"center",
//                   border:"1px solid #ededea",
//                 }}/>
//                 <div style={{flex:1, minWidth:0}}>
//                   <span style={{display:"block",fontSize:12,fontWeight:400,color:"#1a1208",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
//                     {c.title}
//                   </span>
//                   <span style={{fontSize:10,color:"#bbb"}}>{c.category} · {c.lessons} lessons · {c.level}</span>
//                 </div>
//                 <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
//                   <span style={{fontSize:9,letterSpacing:".08em",textTransform:"uppercase",padding:"2px 7px",borderRadius:3,background:c.accent+"18",color:c.accent,fontWeight:600}}>
//                     {c.tag}
//                   </span>
//                   <Link href={`/resources/courses/${c.slug}`} target="_blank"
//                     style={{fontSize:11,padding:"3px 8px",border:"1.5px solid #e8e8e4",borderRadius:4,color:"#555",textDecoration:"none"}}>
//                     ↗
//                   </Link>
//                   <Link href={`/admin/courses`}
//                     style={{fontSize:11,padding:"3px 8px",border:"1.5px solid #e8e8e4",borderRadius:4,color:accent,textDecoration:"none"}}>
//                     Edit
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div style={{padding:"10px 16px",fontSize:11,color:"#aaa",borderTop:"1px solid #f5f5f2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
//             <span>{COURSES.length} courses · Click Edit to add chapters, lessons, and manage enrollments</span>
//             <Link href="/admin/courses" style={{color:accent,textDecoration:"none",fontWeight:500,fontSize:11}}>
//               Open Course Manager →
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* ── supportAgent: activity only */}
//       {isSupport && (
//         <div style={S.card}>
//           <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Platform Activity</h2></div>
//           {activity.map((a,i) => (
//             <div key={i} style={S.activityRow}>
//               <span style={{...S.activityDot, background:a.color}}/>
//               <div>
//                 <span style={S.activityAction}>{a.action}</span>
//                 <span style={S.activityTarget}> — {a.target}</span>
//                 <div style={S.activityMeta}>{a.user} · {a.time}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── moduleMaster: submissions + activity */}
//       {isMM && (
//         <div style={S.twoCol}>
//           <div style={S.card}>
//             <div style={S.cardHead}>
//               <h2 style={S.cardTitle}>My Submissions</h2>
//               <Link href="/admin/content" style={{...S.cardLink, color:accent}}>View all →</Link>
//             </div>
//             {pending.length === 0
//               ? <p style={S.empty}>No pending submissions</p>
//               : pending.map(item => (
//                 <div key={item._id} style={S.approvalRow}>
//                   <span style={{...S.typePill, background:"#7eb8d822", color:"#1a4a7a"}}>{item.type}</span>
//                   <div style={S.approvalInfo}>
//                     <span style={S.approvalTitle}>{item.title}</span>
//                     <span style={S.approvalMeta}>Submitted {timeAgo(item.submittedAt)}</span>
//                   </div>
//                   <span style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,background:"#7eb8d822",color:"#1a4a7a",fontWeight:600}}>
//                     In Review
//                   </span>
//                 </div>
//               ))
//             }
//           </div>
//           <div style={S.card}>
//             <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Activity</h2></div>
//             {activity.map((a,i) => (
//               <div key={i} style={S.activityRow}>
//                 <span style={{...S.activityDot, background:a.color}}/>
//                 <div>
//                   <span style={S.activityAction}>{a.action}</span>
//                   <span style={S.activityTarget}> — {a.target}</span>
//                   <div style={S.activityMeta}>{a.user} · {a.time}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── superAdmin + contentManager: approvals + activity */}
//       {canApprove && (
//         <div style={S.twoCol}>
//           <div style={S.card}>
//             <div style={S.cardHead}>
//               <h2 style={S.cardTitle}>Pending Approvals</h2>
//               <Link href="/admin/approval" style={{...S.cardLink, color:accent}}>View all →</Link>
//             </div>
//             {pending.length === 0
//               ? <p style={S.empty}>All caught up ✓</p>
//               : pending.map(item => (
//                 <div key={item._id} style={S.approvalRow}>
//                   <span style={{...S.typePill, background:item.type==="topic"?"#7ec87e22":"#C9A96E22", color:item.type==="topic"?"#3a7c3a":"#7a5a1a"}}>{item.type}</span>
//                   <div style={S.approvalInfo}>
//                     <span style={S.approvalTitle}>{item.title}</span>
//                     <span style={S.approvalMeta}>by {item.submittedByName} · {timeAgo(item.submittedAt)}</span>
//                   </div>
//                   <div style={{display:"flex",gap:6}}>
//                     <button onClick={()=>approveItem(item._id)} style={{...S.approveBtn,background:accent+"22",color:accent,border:`1px solid ${accent}44`}}>✓</button>
//                     <button onClick={()=>rejectItem(item._id)}  style={{...S.approveBtn,background:"#d4909022",color:"#d49090",border:"1px solid #d4909044"}}>✕</button>
//                   </div>
//                 </div>
//               ))
//             }
//           </div>
//           <div style={S.card}>
//             <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Activity</h2></div>
//             {activity.map((a,i) => (
//               <div key={i} style={S.activityRow}>
//                 <span style={{...S.activityDot, background:a.color}}/>
//                 <div>
//                   <span style={S.activityAction}>{a.action}</span>
//                   <span style={S.activityTarget}> — {a.target}</span>
//                   <div style={S.activityMeta}>{a.user} · {a.time}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Feature flags — superAdmin only */}
//       {isSA && (
//         <div style={S.card}>
//           <div style={S.cardHead}>
//             <h2 style={S.cardTitle}>Feature Flags</h2>
//             <span style={S.liveNote}>◉ Live — changes reflect instantly on Learner Hub</span>
//           </div>
//           <div style={S.flagsGrid}>
//             {Object.entries(FLAG_LABELS).map(([key,label]) => (
//               <div key={key} style={S.flagRow}>
//                 <span style={S.flagLabel}>{label}</span>
//                 <div style={{display:"flex",alignItems:"center",gap:6}}>
//                   {flagSaving[key] && <span style={{fontSize:10,color:"#bbb"}}>…</span>}
//                   <button onClick={()=>toggleFlag(key)} style={{...S.toggle, background:flags[key]?accent:"#ddd"}}>
//                     <span style={{...S.toggleThumb, transform:flags[key]?"translateX(18px)":"translateX(2px)"}}/>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const S = {
//   page:          { padding:"32px 40px", maxWidth:1200, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
//   loading:       { display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", fontSize:16, gap:12, fontFamily:"'DM Sans',sans-serif", color:"#999" },
//   toast:         { position:"fixed", top:20, right:20, zIndex:999, padding:"12px 20px", borderRadius:8, color:"#fff", fontSize:13, fontWeight:500, boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
//   header:        { display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32 },
//   heading:       { fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:400, color:"#1a1208", letterSpacing:"-.01em", marginBottom:4 },
//   sub:           { fontSize:13, color:"#aaa" },
//   newBtn:        { fontSize:11, letterSpacing:".1em", textTransform:"uppercase", padding:"10px 20px", border:"none", borderRadius:6, fontWeight:600, textDecoration:"none", cursor:"pointer", flexShrink:0 },
//   statsGrid:     { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:24 },
//   statCard:      { background:"#fff", borderRadius:10, padding:"20px 20px 16px", border:"1.5px solid #ededea", display:"flex", flexDirection:"column", gap:2 },
//   statValue:     { fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300, color:"#1a1208", lineHeight:1, letterSpacing:"-.02em" },
//   statLabel:     { fontSize:12, fontWeight:500, color:"#555", marginTop:6 },
//   statSub:       { fontSize:11, color:"#bbb" },
//   twoCol:        { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 },
//   card:          { background:"#fff", borderRadius:10, border:"1.5px solid #ededea", overflow:"hidden", marginBottom:16 },
//   cardHead:      { padding:"16px 20px", borderBottom:"1px solid #f0f0ee", display:"flex", alignItems:"center", justifyContent:"space-between" },
//   cardTitle:     { fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:400, color:"#1a1208" },
//   cardLink:      { fontSize:12, textDecoration:"none", letterSpacing:".04em" },
//   empty:         { padding:"20px", fontSize:13, color:"#bbb", textAlign:"center" },
//   approvalRow:   { display:"flex", alignItems:"center", gap:12, padding:"11px 20px", borderBottom:"1px solid #f5f5f2" },
//   typePill:      { fontSize:9, letterSpacing:".1em", textTransform:"uppercase", padding:"2px 7px", borderRadius:3, fontWeight:600, flexShrink:0 },
//   approvalInfo:  { flex:1, minWidth:0 },
//   approvalTitle: { display:"block", fontSize:13, fontWeight:400, color:"#1a1208", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
//   approvalMeta:  { fontSize:11, color:"#bbb" },
//   approveBtn:    { fontSize:12, padding:"4px 9px", borderRadius:5, cursor:"pointer", fontWeight:600 },
//   activityRow:   { display:"flex", gap:12, padding:"11px 20px", borderBottom:"1px solid #f5f5f2", alignItems:"flex-start" },
//   activityDot:   { width:7, height:7, borderRadius:"50%", flexShrink:0, marginTop:5 },
//   activityAction:{ fontSize:12, fontWeight:500, color:"#1a1208" },
//   activityTarget:{ fontSize:12, color:"#666" },
//   activityMeta:  { fontSize:10, color:"#bbb", marginTop:2 },
//   liveNote:      { fontSize:11, color:"#7ec87e", fontWeight:500 },
//   flagsGrid:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 },
//   flagRow:       { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", borderBottom:"1px solid #f5f5f2" },
//   flagLabel:     { fontSize:12, color:"#555" },
//   toggle:        { width:38, height:22, borderRadius:11, border:"none", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 },
//   toggleThumb:   { position:"absolute", top:2, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"transform .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" },
// };
"use client";
// app/admin/page.js — Live Overview Dashboard

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import { COURSES } from "@/constants/courses";  // ← add

const ROLE_ACCENT = { superAdmin:"#C9A96E", moduleMaster:"#7eb8d8", contentManager:"#b89fd4", supportAgent:"#7ec87e" };

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now"; if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
}
function greeting() { const h = new Date().getHours(); return h<12?"morning":h<17?"afternoon":"evening"; }

export default function AdminOverview() {
  const { user } = useAdminAuthStore();
  const role     = user?.role;
  const accent   = ROLE_ACCENT[role] || "#C9A96E";

  const canApprove  = ["superAdmin","contentManager"].includes(role);
  const canCreate   = ["superAdmin","contentManager","moduleMaster"].includes(role);
  const isSA        = role === "superAdmin";
  const isSupport   = role === "supportAgent";
  const isMM        = role === "moduleMaster";

  const [stats, setStats]           = useState(null);
  const [pending, setPending]       = useState([]);
  const [activity, setActivity]     = useState([]);
  const [flags, setFlags]           = useState({});
  const [flagSaving, setFlagSaving] = useState({});
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  // ── Course Catalog (DB-merged) — gives the overview panel real publish/feature actions
  const canEditCourses = ["superAdmin","contentManager"].includes(role);
  const [catalog, setCatalog] = useState([]);

  const loadCatalog = useCallback(async () => {
    if (!canEditCourses) return;
    try {
      const data = await api.get("/courses/admin/list");
      const dbCourses = data?.data?.courses || [];
      const dbSlugs   = new Set(dbCourses.map(c => c.slug));
      const staticOnly = COURSES
        .filter(c => !dbSlugs.has(c.slug))
        .map(c => ({
          ...c,
          _id:           c.id,
          isPublished:   false,
          isFeatured:    false,
          enrolledCount: c.enrolled || 0,
          totalLessons:  c.lessons  || 0,
          _static:       true,
        }));
      setCatalog([...dbCourses, ...staticOnly]);
    } catch {
      setCatalog(COURSES.map(c => ({ ...c, _id:c.id, isPublished:false, isFeatured:false, _static:true })));
    }
  }, [canEditCourses]);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  // Migrate a static seed course into the DB; returns the DB record so callers can act on it
  const migrateCourse = async (course, { silent = false } = {}) => {
    try {
      const { _static, _id, updatedAt, ...payload } = course;
      const data = await api.post("/courses/admin", {
        ...payload,
        courseId:    course.id || course.slug,
        enrolled:    course.enrolled || course.enrolledCount || 0,
        lessons:     course.lessons  || course.totalLessons  || 0,
        rating:      course.rating   || 0,
        reviews:     course.reviews  || course.reviewCount   || 0,
        isPublished: false,
      });
      if (!silent) { showToast("Course saved to database ◉"); loadCatalog(); }
      return data?.data?.course || null;
    } catch (e) {
      if (e.message?.includes("already exists")) {
        try {
          const list  = await api.get("/courses/admin/list");
          const found = (list?.data?.courses || []).find(c => c.slug === course.slug);
          if (!silent) loadCatalog();
          return found || null;
        } catch { return null; }
      }
      if (!silent) showToast("Couldn't save course", false);
      return null;
    }
  };

  const togglePublishCourse = async (course) => {
    let target = course;
    if (course._static) {
      target = await migrateCourse(course, { silent: true });
      if (!target?._id) { showToast("Couldn't save course to DB", false); return; }
    }
    try {
      const data = await api.patch(`/courses/admin/${target._id}/toggle-publish`, {});
      showToast(data?.data?.isPublished ? "Published live ◉" : "Unpublished");
    } catch { showToast("Failed", false); return; }
    loadCatalog();
  };

  const toggleFeatureCourse = async (course) => {
    let target = course;
    if (course._static) {
      target = await migrateCourse(course, { silent: true });
      if (!target?._id) { showToast("Couldn't save course to DB", false); return; }
    }
    try {
      await api.patch(`/courses/admin/${target._id}/feature`, {});
      showToast("Featured status updated");
    } catch { showToast("Failed", false); return; }
    loadCatalog();
  };

  const loadData = useCallback(async () => {
    try {
      const calls = [
        api.get("/admin/stats"),
        api.get("/admin/activity?limit=8"),
      ];
      if (canApprove) calls.push(api.get("/admin/approvals?status=pending&limit=5"));
      if (isSA)       calls.push(api.get("/admin/settings"));

      const results = await Promise.all(calls);
      setStats(results[0]?.data);
      setActivity(results[1]?.data?.activity || []);
      if (canApprove) setPending(results[2]?.data?.approvals || []);
      if (isSA && results[3]) setFlags(results[3]?.data?.features || {});
    } catch {
      setStats({ totalTopics:48, publishedTopics:34, draftTopics:9, pendingApprovals:3, totalLearners:1240, activeLearners:387, revenue:"₹2,84,000" });
      if (canApprove) setPending([
        { _id:"1", title:"Reels Algorithm Deep Dive", submittedByName:"Kiran M.", type:"topic",   submittedAt:new Date(Date.now()-3600000).toISOString() },
        { _id:"2", title:"Brand Deal Template Pack",  submittedByName:"Priya S.", type:"product", submittedAt:new Date(Date.now()-7200000).toISOString() },
      ]);
      setActivity([
        { action:"Published", target:"Creator Foundations — Lesson 3", user:"Admin",    time:"2m ago",  color:"#7ec87e" },
        { action:"Approved",  target:"Monetization Template Pack",      user:"Admin",    time:"14m ago", color:"#C9A96E" },
        { action:"Archived",  target:"Old Brand Deal Guide",            user:"Kiran M.", time:"1h ago",  color:"#d49090" },
        { action:"Enrolled",  target:"45 new learners today",           user:"system",   time:"2h ago",  color:"#7eb8d8" },
      ]);
      if (isSA) setFlags({ progressTracking:true, moduleFollowing:true, qaComments:true, shopAndCTAs:true, contentApprovalWorkflow:true, moduleGlossary:false, liveSessionScheduling:false, learnerRegistration:true });
    }
    setLoading(false);
  }, [user, canApprove, isSA]);

  useEffect(() => { loadData(); }, [loadData]);

  useSocket({
    "topic:published":  loadData,
    "topic:archived":   loadData,
    "course:published":   loadCatalog,
    "course:unpublished": loadCatalog,
    "course:updated":     loadCatalog,
    "course:deleted":     loadCatalog,
    "settings:updated": (data) => { if (data?.features) setFlags(data.features); },
  });

  const approveItem = async (id) => {
    try {
      await api.patch(`/admin/approvals/${id}`, { status:"approved" });
      setPending(p => p.filter(x => x._id !== id));
      showToast("Approved — published live ◉");
    } catch { showToast("Failed", false); }
  };

  const rejectItem = async (id) => {
    try {
      await api.patch(`/admin/approvals/${id}`, { status:"rejected" });
      setPending(p => p.filter(x => x._id !== id));
      showToast("Rejected");
    } catch { showToast("Failed", false); }
  };

  const toggleFlag = async (key) => {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    setFlagSaving(s => ({...s,[key]:true}));
    try {
      await api.patch("/admin/settings/features", { [key]: next[key] });
      showToast(`${key} ${next[key]?"enabled":"disabled"} — live instantly`);
    } catch { showToast("Save failed", false); }
    setFlagSaving(s => ({...s,[key]:false}));
  };

  if (loading) return <div style={S.loading}><span style={{color:accent,fontSize:20}}>◈</span> Loading…</div>;

  const statCards = [
    ...(isSupport ? [] : [
      { label:"Published Topics", value:stats?.publishedTopics, sub:`${stats?.draftTopics||0} drafts`, accent:"#7ec87e", href:"/admin/content" },
    ]),
    ...(canApprove ? [
      { label:"Pending Approvals", value:stats?.pendingApprovals, sub:"need review", accent:"#C9A96E", href:"/admin/approval" },
    ] : []),
    ...(isSupport ? [
      { label:"Open Tickets",   value:stats?.openTickets||"—",   sub:"need response",   accent:"#7ec87e", href:"/admin/support"  },
      { label:"Total Learners", value:stats?.totalLearners||"—", sub:"registered users", accent:"#7eb8d8", href:"/admin/contacts" },
    ] : [
      { label:"Active Learners", value:stats?.activeLearners, sub:`of ${stats?.totalLearners?.toLocaleString()||0} total`, accent:"#7eb8d8", href:"/admin/contacts" },
    ]),
    ...(isSA ? [{ label:"Revenue (MTD)", value:stats?.revenue, sub:"this month", accent:"#b89fd4", href:"/admin/revenue" }] : []),
  ];

  const FLAG_LABELS = {
    progressTracking:"Progress Tracking", moduleFollowing:"Module Following",
    qaComments:"Q&A Comments", shopAndCTAs:"Shop & CTAs",
    contentApprovalWorkflow:"Approval Workflow", moduleGlossary:"Module Glossary",
    liveSessionScheduling:"Live Sessions", learnerRegistration:"Learner Registration",
  };

  const roleSub = {
    superAdmin:     "Here's what's happening on Fameo right now.",
    contentManager: "Your content queue and activity feed.",
    moduleMaster:   "Your assigned modules and submission status.",
    supportAgent:   "Your open tickets and learner queue.",
  }[role] || "Here's what's happening on Fameo right now.";

  return (
    <div style={S.page}>
      {toast && <div style={{...S.toast,background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Good {greeting()}, {user?.name?.split(" ")[0] || "Admin"}</h1>
          <p style={S.sub}>{roleSub}</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          {canCreate && (
            <Link href="/admin/content/new" style={{...S.newBtn, background:accent, color:"#1a1200"}}>
              + New Topic
            </Link>
          )}
          {(isSA || role==="contentManager") && (
            <Link href="/admin/courses" style={{...S.newBtn, background:"#1a1208", color:"#F0E8D6"}}>
              Manage Courses
            </Link>
          )}
          {isSupport && (
            <Link href="/admin/support" style={{...S.newBtn, background:accent, color:"#1a1200"}}>
              View Tickets →
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div style={S.statsGrid}>
        {statCards.map(c => (
          <Link key={c.label} href={c.href||"#"} style={{...S.statCard, borderTop:`3px solid ${c.accent}`, textDecoration:"none"}}>
            <span style={S.statValue}>{c.value ?? "—"}</span>
            <span style={S.statLabel}>{c.label}</span>
            <span style={S.statSub}>{c.sub}</span>
          </Link>
        ))}
      </div>

      {/* ── Course Catalog — superAdmin + contentManager */}
      {(isSA || role==="contentManager") && (
        <div style={{...S.card, marginBottom:24}}>
          <div style={S.cardHead}>
            <h2 style={S.cardTitle}>Course Catalog <span style={{fontSize:13,color:"#bbb",fontWeight:400,fontFamily:"'DM Sans',sans-serif"}}>({catalog.length})</span></h2>
            <Link href="/admin/courses" style={{...S.cardLink, color:accent}}>Manage all →</Link>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))"}}>
            {catalog.map((c,i) => {
              const sc = c._static ? ["Static","#C9A96E","#C9A96E18"]
                       : c.isPublished ? ["◉ Live","#3a7c3a","#7ec87e18"]
                       : ["Draft","#888","#f5f5f2"];
              return (
              <div key={c._id || c.id} style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
                borderBottom:"1px solid #f5f5f2",
                borderRight: (i % 2 === 0) ? "1px solid #f5f5f2" : "none",
                background: c._static ? "#fffdf8" : "#fff",
              }}>
                <div style={{
                  width:42, height:28, borderRadius:3, flexShrink:0,
                  backgroundImage:`url(${c.thumbnail})`,
                  backgroundSize:"cover", backgroundPosition:"center",
                  border:"1px solid #ededea",
                }}/>
                <div style={{flex:1, minWidth:0}}>
                  <span style={{display:"block",fontSize:12,fontWeight:400,color:"#1a1208",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {c.title}
                  </span>
                  <span style={{fontSize:10,color:"#bbb"}}>
                    {c.category} · {c.totalLessons || c.lessons || 0} lessons · {c.level}
                  </span>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                  <span style={{fontSize:9,letterSpacing:".08em",textTransform:"uppercase",padding:"2px 7px",borderRadius:3,background:sc[2],color:sc[1],fontWeight:600}}>
                    {sc[0]}
                  </span>
                  <Link href={`/resources/courses/${c.slug}`} target="_blank" style={S.catBtn}>↗</Link>
                  {canEditCourses && (
                    <>
                      <Link href="/admin/courses" style={{...S.catBtn,color:accent}}>Edit</Link>
                      <button onClick={() => togglePublishCourse(c)} style={{
                        ...S.catBtn,
                        color:       c.isPublished ? "#888" : "#3a7c3a",
                        borderColor: c.isPublished ? "#e8e8e4" : "#7ec87e44",
                      }}>
                        {c.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => toggleFeatureCourse(c)} style={{
                        ...S.catBtn,
                        color:       c.isFeatured ? "#b89fd4" : "#888",
                        borderColor: c.isFeatured ? "#b89fd444" : "#e8e8e4",
                      }}>
                        {c.isFeatured ? "★" : "☆"}
                      </button>
                    </>
                  )}
                </div>
              </div>
              );
            })}
          </div>
          <div style={{padding:"10px 16px",fontSize:11,color:"#aaa",borderTop:"1px solid #f5f5f2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>Publish / Feature work right here · open the manager to edit chapters &amp; lessons</span>
            <Link href="/admin/courses" style={{color:accent,textDecoration:"none",fontWeight:500,fontSize:11}}>
              Open Course Manager →
            </Link>
          </div>
        </div>
      )}

      {/* ── supportAgent: activity only */}
      {isSupport && (
        <div style={S.card}>
          <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Platform Activity</h2></div>
          {activity.map((a,i) => (
            <div key={i} style={S.activityRow}>
              <span style={{...S.activityDot, background:a.color}}/>
              <div>
                <span style={S.activityAction}>{a.action}</span>
                <span style={S.activityTarget}> — {a.target}</span>
                <div style={S.activityMeta}>{a.user} · {a.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── moduleMaster: submissions + activity */}
      {isMM && (
        <div style={S.twoCol}>
          <div style={S.card}>
            <div style={S.cardHead}>
              <h2 style={S.cardTitle}>My Submissions</h2>
              <Link href="/admin/content" style={{...S.cardLink, color:accent}}>View all →</Link>
            </div>
            {pending.length === 0
              ? <p style={S.empty}>No pending submissions</p>
              : pending.map(item => (
                <div key={item._id} style={S.approvalRow}>
                  <span style={{...S.typePill, background:"#7eb8d822", color:"#1a4a7a"}}>{item.type}</span>
                  <div style={S.approvalInfo}>
                    <span style={S.approvalTitle}>{item.title}</span>
                    <span style={S.approvalMeta}>Submitted {timeAgo(item.submittedAt)}</span>
                  </div>
                  <span style={{fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:3,background:"#7eb8d822",color:"#1a4a7a",fontWeight:600}}>
                    In Review
                  </span>
                </div>
              ))
            }
          </div>
          <div style={S.card}>
            <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Activity</h2></div>
            {activity.map((a,i) => (
              <div key={i} style={S.activityRow}>
                <span style={{...S.activityDot, background:a.color}}/>
                <div>
                  <span style={S.activityAction}>{a.action}</span>
                  <span style={S.activityTarget}> — {a.target}</span>
                  <div style={S.activityMeta}>{a.user} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── superAdmin + contentManager: approvals + activity */}
      {canApprove && (
        <div style={S.twoCol}>
          <div style={S.card}>
            <div style={S.cardHead}>
              <h2 style={S.cardTitle}>Pending Approvals</h2>
              <Link href="/admin/approval" style={{...S.cardLink, color:accent}}>View all →</Link>
            </div>
            {pending.length === 0
              ? <p style={S.empty}>All caught up ✓</p>
              : pending.map(item => (
                <div key={item._id} style={S.approvalRow}>
                  <span style={{...S.typePill, background:item.type==="topic"?"#7ec87e22":"#C9A96E22", color:item.type==="topic"?"#3a7c3a":"#7a5a1a"}}>{item.type}</span>
                  <div style={S.approvalInfo}>
                    <span style={S.approvalTitle}>{item.title}</span>
                    <span style={S.approvalMeta}>by {item.submittedByName} · {timeAgo(item.submittedAt)}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>approveItem(item._id)} style={{...S.approveBtn,background:accent+"22",color:accent,border:`1px solid ${accent}44`}}>✓</button>
                    <button onClick={()=>rejectItem(item._id)}  style={{...S.approveBtn,background:"#d4909022",color:"#d49090",border:"1px solid #d4909044"}}>✕</button>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={S.card}>
            <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Activity</h2></div>
            {activity.map((a,i) => (
              <div key={i} style={S.activityRow}>
                <span style={{...S.activityDot, background:a.color}}/>
                <div>
                  <span style={S.activityAction}>{a.action}</span>
                  <span style={S.activityTarget}> — {a.target}</span>
                  <div style={S.activityMeta}>{a.user} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature flags — superAdmin only */}
      {isSA && (
        <div style={S.card}>
          <div style={S.cardHead}>
            <h2 style={S.cardTitle}>Feature Flags</h2>
            <span style={S.liveNote}>◉ Live — changes reflect instantly on Learner Hub</span>
          </div>
          <div style={S.flagsGrid}>
            {Object.entries(FLAG_LABELS).map(([key,label]) => (
              <div key={key} style={S.flagRow}>
                <span style={S.flagLabel}>{label}</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {flagSaving[key] && <span style={{fontSize:10,color:"#bbb"}}>…</span>}
                  <button onClick={()=>toggleFlag(key)} style={{...S.toggle, background:flags[key]?accent:"#ddd"}}>
                    <span style={{...S.toggleThumb, transform:flags[key]?"translateX(18px)":"translateX(2px)"}}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page:          { padding:"32px 40px", maxWidth:1200, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
  loading:       { display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", fontSize:16, gap:12, fontFamily:"'DM Sans',sans-serif", color:"#999" },
  toast:         { position:"fixed", top:20, right:20, zIndex:999, padding:"12px 20px", borderRadius:8, color:"#fff", fontSize:13, fontWeight:500, boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
  header:        { display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32 },
  heading:       { fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:400, color:"#1a1208", letterSpacing:"-.01em", marginBottom:4 },
  sub:           { fontSize:13, color:"#aaa" },
  newBtn:        { fontSize:11, letterSpacing:".1em", textTransform:"uppercase", padding:"10px 20px", border:"none", borderRadius:6, fontWeight:600, textDecoration:"none", cursor:"pointer", flexShrink:0 },
  statsGrid:     { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:24 },
  statCard:      { background:"#fff", borderRadius:10, padding:"20px 20px 16px", border:"1.5px solid #ededea", display:"flex", flexDirection:"column", gap:2 },
  statValue:     { fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300, color:"#1a1208", lineHeight:1, letterSpacing:"-.02em" },
  statLabel:     { fontSize:12, fontWeight:500, color:"#555", marginTop:6 },
  statSub:       { fontSize:11, color:"#bbb" },
  twoCol:        { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 },
  card:          { background:"#fff", borderRadius:10, border:"1.5px solid #ededea", overflow:"hidden", marginBottom:16 },
  cardHead:      { padding:"16px 20px", borderBottom:"1px solid #f0f0ee", display:"flex", alignItems:"center", justifyContent:"space-between" },
  cardTitle:     { fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:400, color:"#1a1208" },
  cardLink:      { fontSize:12, textDecoration:"none", letterSpacing:".04em" },
  catBtn:        { fontSize:10, padding:"4px 9px", border:"1.5px solid #e8e8e4", borderRadius:5, background:"#fff", cursor:"pointer", color:"#555", textDecoration:"none", letterSpacing:".03em", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" },
  empty:         { padding:"20px", fontSize:13, color:"#bbb", textAlign:"center" },
  approvalRow:   { display:"flex", alignItems:"center", gap:12, padding:"11px 20px", borderBottom:"1px solid #f5f5f2" },
  typePill:      { fontSize:9, letterSpacing:".1em", textTransform:"uppercase", padding:"2px 7px", borderRadius:3, fontWeight:600, flexShrink:0 },
  approvalInfo:  { flex:1, minWidth:0 },
  approvalTitle: { display:"block", fontSize:13, fontWeight:400, color:"#1a1208", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  approvalMeta:  { fontSize:11, color:"#bbb" },
  approveBtn:    { fontSize:12, padding:"4px 9px", borderRadius:5, cursor:"pointer", fontWeight:600 },
  activityRow:   { display:"flex", gap:12, padding:"11px 20px", borderBottom:"1px solid #f5f5f2", alignItems:"flex-start" },
  activityDot:   { width:7, height:7, borderRadius:"50%", flexShrink:0, marginTop:5 },
  activityAction:{ fontSize:12, fontWeight:500, color:"#1a1208" },
  activityTarget:{ fontSize:12, color:"#666" },
  activityMeta:  { fontSize:10, color:"#bbb", marginTop:2 },
  liveNote:      { fontSize:11, color:"#7ec87e", fontWeight:500 },
  flagsGrid:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 },
  flagRow:       { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", borderBottom:"1px solid #f5f5f2" },
  flagLabel:     { fontSize:12, color:"#555" },
  toggle:        { width:38, height:22, borderRadius:11, border:"none", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 },
  toggleThumb:   { position:"absolute", top:2, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"transform .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" },
};