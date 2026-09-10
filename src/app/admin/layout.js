// // "use client";
// // // app/admin/layout.js
// // // Fameo Admin Dashboard — Root Layout with Role-Based Sidebar

// // import { useState, useEffect } from "react";
// // import Link from "next/link";
// // import { usePathname, useRouter } from "next/navigation";
// // import { useAuthStore } from "@/store/authStore";

// // /* ── Role → allowed nav items ── */
// // const NAV_BY_ROLE = {
// //   superAdmin: [
// //     { label: "Overview",      icon: "◈", href: "/admin",                 section: "main"    },
// //     { label: "Approvals",     icon: "◎", href: "/admin/approvals",        section: "main", badge: "pending" },
// //     { label: "Content OS",    icon: "◇", href: "/admin/content",          section: "content" },
// //     { label: "Media Library", icon: "◉", href: "/admin/media",            section: "content" },
// //     { label: "Archive",       icon: "◐", href: "/admin/archive",          section: "content" },
// //     { label: "Products",      icon: "◑", href: "/admin/products",         section: "commerce"},
// //     { label: "Revenue",       icon: "◊", href: "/admin/revenue",          section: "commerce"},
// //     { label: "Analytics",     icon: "◈", href: "/admin/analytics",        section: "commerce"},
// //     { label: "Learners",      icon: "◎", href: "/admin/learners",         section: "people"  },
// //     { label: "Module Masters",icon: "◇", href: "/admin/module-masters",   section: "people"  },
// //     { label: "Roles",         icon: "◉", href: "/admin/roles",            section: "people"  },
// //     { label: "Support",       icon: "◐", href: "/admin/support",          section: "people"  },
// //     { label: "Notifications", icon: "◑", href: "/admin/notifications",    section: "system"  },
// //     { label: "Settings",      icon: "◊", href: "/admin/settings",         section: "system"  },
// //   ],
// //   moduleMaster: [
// //     { label: "My Modules",    icon: "◈", href: "/admin",                  section: "main"    },
// //     { label: "Content OS",    icon: "◇", href: "/admin/content",          section: "content" },
// //     { label: "Media Library", icon: "◉", href: "/admin/media",            section: "content" },
// //   ],
// //   contentManager: [
// //     { label: "Overview",      icon: "◈", href: "/admin",                  section: "main"    },
// //     { label: "Approvals",     icon: "◎", href: "/admin/approvals",        section: "main", badge: "pending" },
// //     { label: "Content OS",    icon: "◇", href: "/admin/content",          section: "content" },
// //     { label: "Media Library", icon: "◉", href: "/admin/media",            section: "content" },
// //     { label: "Archive",       icon: "◐", href: "/admin/archive",          section: "content" },
// //     { label: "Analytics",     icon: "◈", href: "/admin/analytics",        section: "main"    },
// //   ],
// //   supportAgent: [
// //     { label: "Support",       icon: "◐", href: "/admin",                  section: "main"    },
// //     { label: "Learners",      icon: "◎", href: "/admin/learners",         section: "people"  },
// //   ],
// // };

// // const SECTION_LABELS = { main: "Main", content: "Content", commerce: "Commerce", people: "People", system: "System" };

// // const ROLE_COLORS = {
// //   superAdmin:     { bg: "#1a1208", accent: "#C9A96E", label: "Super Admin" },
// //   moduleMaster:   { bg: "#0a1420", accent: "#7eb8d8", label: "Module Master" },
// //   contentManager: { bg: "#100a20", accent: "#b89fd4", label: "Content Mgr" },
// //   supportAgent:   { bg: "#0a1a0a", accent: "#7ec87e", label: "Support Agent" },
// // };

// // export default function AdminLayout({ children }) {
// //   const pathname   = usePathname();
// //   const router     = useRouter();
// //   const { user }   = useAuthStore();
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [pendingCount, setPendingCount] = useState(3); // from API in real app

// //   // Redirect if not admin role
// //   useEffect(() => {
// //     if (user && user.role === "learner") router.push("/");
// //   }, [user, router]);

// //   const role     = user?.role || "contentManager"; // fallback for dev
// //   const roleConf = ROLE_COLORS[role] || ROLE_COLORS.contentManager;
// //   const navItems = NAV_BY_ROLE[role] || [];

// //   // Group by section
// //   const sections = {};
// //   navItems.forEach(item => {
// //     if (!sections[item.section]) sections[item.section] = [];
// //     sections[item.section].push(item);
// //   });

// //   return (
// //     <div style={S.root}>
// //       {/* ── Sidebar ── */}
// //       <aside style={{ ...S.sidebar, width: collapsed ? 64 : 240, background: roleConf.bg }}>
// //         {/* Logo */}
// //         <div style={S.sbLogo}>
// //           {!collapsed && (
// //             <span style={{ ...S.logoText, color: "#F0E8D6" }}>
// //               Fameo <span style={{ color: roleConf.accent }}>Admin</span>
// //             </span>
// //           )}
// //           <button onClick={() => setCollapsed(c => !c)} style={{ ...S.collapseBtn, color: roleConf.accent }}>
// //             {collapsed ? "›" : "‹"}
// //           </button>
// //         </div>

// //         {/* Role badge */}
// //         {!collapsed && (
// //           <div style={{ ...S.roleBadge, background: roleConf.accent + "18", border: `1px solid ${roleConf.accent}33` }}>
// //             <span style={{ ...S.roleDot, background: roleConf.accent }} />
// //             <span style={{ ...S.roleLabel, color: roleConf.accent }}>{roleConf.label}</span>
// //           </div>
// //         )}

// //         {/* Nav */}
// //         <nav style={S.nav}>
// //           {Object.entries(sections).map(([section, items]) => (
// //             <div key={section} style={S.navSection}>
// //               {!collapsed && (
// //                 <span style={S.sectionLabel}>{SECTION_LABELS[section]}</span>
// //               )}
// //               {items.map(item => {
// //                 const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
// //                 return (
// //                   <Link key={item.href} href={item.href} style={{
// //                     ...S.navItem,
// //                     background: isActive ? roleConf.accent + "18" : "transparent",
// //                     borderLeft: isActive ? `3px solid ${roleConf.accent}` : "3px solid transparent",
// //                     color: isActive ? "#F0E8D6" : "rgba(240,232,214,0.45)",
// //                     justifyContent: collapsed ? "center" : "flex-start",
// //                   }}>
// //                     <span style={{ ...S.navIcon, color: isActive ? roleConf.accent : "inherit" }}>
// //                       {item.icon}
// //                     </span>
// //                     {!collapsed && (
// //                       <>
// //                         <span style={S.navLabel}>{item.label}</span>
// //                         {item.badge === "pending" && pendingCount > 0 && (
// //                           <span style={{ ...S.navBadge, background: roleConf.accent, color: roleConf.bg }}>
// //                             {pendingCount}
// //                           </span>
// //                         )}
// //                       </>
// //                     )}
// //                   </Link>
// //                 );
// //               })}
// //             </div>
// //           ))}
// //         </nav>

// //         {/* User footer */}
// //         {!collapsed && (
// //           <div style={S.sbFooter}>
// //             <div style={{ ...S.sbAvatar, background: roleConf.accent + "22", color: roleConf.accent }}>
// //               {(user?.name || "A").charAt(0).toUpperCase()}
// //             </div>
// //             <div style={S.sbUserInfo}>
// //               <span style={S.sbUserName}>{user?.name || "Admin"}</span>
// //               <span style={S.sbUserRole}>{roleConf.label}</span>
// //             </div>
// //             <button onClick={() => router.push("/")} style={{ ...S.sbExitBtn, color: "rgba(240,232,214,0.3)" }} title="Back to site">
// //               ↗
// //             </button>
// //           </div>
// //         )}
// //       </aside>

// //       {/* ── Main ── */}
// //       <main style={S.main}>
// //         {children}
// //       </main>
// //     </div>
// //   );
// // }

// // const S = {
// //   root:       { display: "flex", minHeight: "100vh", background: "#F7F6F3", fontFamily: "'DM Sans', sans-serif" },
// //   sidebar:    { display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .25s cubic-bezier(.22,1,.36,1)", overflow: "hidden", position: "sticky", top: 0, height: "100vh" },
// //   sbLogo:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 16px", borderBottom: "1px solid rgba(240,232,214,0.08)", flexShrink: 0 },
// //   logoText:   { fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" },
// //   collapseBtn:{ background: "none", border: "none", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "2px 0" },
// //   roleBadge:  { margin: "12px 12px 4px", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 7, flexShrink: 0 },
// //   roleDot:    { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
// //   roleLabel:  { fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 },
// //   nav:        { flex: 1, overflowY: "auto", padding: "8px 0", scrollbarWidth: "none" },
// //   navSection: { marginBottom: 4 },
// //   sectionLabel:{ display: "block", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,214,0.2)", padding: "10px 16px 4px" },
// //   navItem:    { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", textDecoration: "none", transition: "all .15s", cursor: "pointer", fontSize: 12, fontWeight: 400 },
// //   navIcon:    { fontSize: 13, flexShrink: 0, width: 16, textAlign: "center" },
// //   navLabel:   { flex: 1, letterSpacing: ".02em" },
// //   navBadge:   { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10, letterSpacing: ".05em" },
// //   sbFooter:   { padding: "12px 14px", borderTop: "1px solid rgba(240,232,214,0.08)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
// //   sbAvatar:   { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 },
// //   sbUserInfo: { flex: 1, minWidth: 0 },
// //   sbUserName: { display: "block", fontSize: 11, color: "rgba(240,232,214,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
// //   sbUserRole: { display: "block", fontSize: 9, color: "rgba(240,232,214,0.3)", letterSpacing: ".06em", textTransform: "uppercase" },
// //   sbExitBtn:  { background: "none", border: "none", fontSize: 14, cursor: "pointer" },
// //   main:       { flex: 1, overflow: "auto", minWidth: 0 },
// // };

// "use client";
// // app/admin/layout.js — Real auth, live pending count from API, role-based nav

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useAdminAuthStore } from "@/store/adminAuthStore";
// import { api } from "@/services/api";
// import { useSocket } from "@/hooks/useSocket";

// const NAV = {
//   superAdmin: [
//     { label: "Overview",       icon: "◈", href: "/admin",                section: "main"     },
//     { label: "Approvals",      icon: "◎", href: "/admin/approval",       section: "main",    badge: true },
//     { label: "Content OS",     icon: "◇", href: "/admin/content",        section: "content"  },
//     { label: "Media Center",   icon: "◉", href: "/admin/media-center",   section: "content"  },
//     { label: "Archive",        icon: "◐", href: "/admin/archive",        section: "content"  },
//     { label: "Products",       icon: "◑", href: "/admin/products",       section: "commerce" },
//     { label: "Revenue",        icon: "◊", href: "/admin/revenue",        section: "commerce" },
//     { label: "Analytics",      icon: "◈", href: "/admin/analytics",      section: "commerce" },
//     { label: "Contacts",       icon: "◎", href: "/admin/contacts",       section: "people"   },
//     { label: "Module Masters", icon: "◇", href: "/admin/module-masters", section: "people"   },
//     { label: "Roles",          icon: "◉", href: "/admin/roles",          section: "people"   },
//     { label: "Support",        icon: "◐", href: "/admin/support",        section: "people"   },
//     { label: "Notifications",  icon: "◑", href: "/admin/notifications",  section: "system"   },
//     { label: "Settings",       icon: "◊", href: "/admin/settings",       section: "system"   },
//   ],
//   moduleMaster: [
//     { label: "My Overview",    icon: "◈", href: "/admin",                section: "main"     },
//     { label: "Content OS",     icon: "◇", href: "/admin/content",        section: "content"  },
//     { label: "Media Center",   icon: "◉", href: "/admin/media-center",   section: "content"  },
//     { label: "Analytics",      icon: "◈", href: "/admin/analytics",      section: "main"     },
//   ],
//   contentManager: [
//     { label: "Overview",       icon: "◈", href: "/admin",                section: "main"     },
//     { label: "Approvals",      icon: "◎", href: "/admin/approval",       section: "main",    badge: true },
//     { label: "Content OS",     icon: "◇", href: "/admin/content",        section: "content"  },
//     { label: "Media Center",   icon: "◉", href: "/admin/media-center",   section: "content"  },
//     { label: "Archive",        icon: "◐", href: "/admin/archive",        section: "content"  },
//     { label: "Analytics",      icon: "◈", href: "/admin/analytics",      section: "main"     },
//     { label: "Notifications",  icon: "◑", href: "/admin/notifications",  section: "system"   },
//   ],
//   supportAgent: [
//     { label: "Support",        icon: "◐", href: "/admin",                section: "main"     },
//     { label: "Contacts",       icon: "◎", href: "/admin/contacts",       section: "people"   },
//   ],
// };

// const SECTION_LABELS = { main: "Main", content: "Content", commerce: "Commerce", people: "People", system: "System" };

// const ROLE_COLORS = {
//   superAdmin:     { bg: "#1a1208", accent: "#C9A96E", label: "Super Admin"     },
//   moduleMaster:   { bg: "#0a1420", accent: "#7eb8d8", label: "Module Master"   },
//   contentManager: { bg: "#100a20", accent: "#b89fd4", label: "Content Mgr"     },
//   supportAgent:   { bg: "#0a1a0a", accent: "#7ec87e", label: "Support Agent"   },
// };

// export default function AdminLayout({ children }) {
//   const pathname = usePathname();
//   const router   = useRouter();
//   const { user, logout } = useAdminAuthStore();
//   const [collapsed, setCollapsed]   = useState(false);
//   const [pendingCount, setPending]  = useState(0);

//   // Auth guard
//   useEffect(() => {
//     if (!user) { router.replace("/admin/login"); return; }
//     if (!["superAdmin","contentManager","moduleMaster","supportAgent"].includes(user.role)) {
//       router.replace("/");
//     }
//   }, [user, router]);

//    if (pathname === "/admin/login") {
//     return <>{children}</>;        // ← add this
//   }

//   // Live pending approvals count — refresh every 30s + on socket event
//   const fetchPending = async () => {
//     try {
//       const d = await api.get("/admin/approvals?status=pending&limit=1");
//       setPending(d?.data?.total ?? d?.data?.approvals?.length ?? 0);
//     } catch {}
//   };

//   useEffect(() => {
//     if (!user) return;
//     fetchPending();
//     const t = setInterval(fetchPending, 30000);
//     return () => clearInterval(t);
//   }, [user]);

//   // Socket — bump pending count when new approval arrives
//   useSocket({
//     "admin:approval_reviewed": fetchPending,
//     "topic:published": fetchPending,
//   });

//   const doLogout = async () => { await logout(); router.replace("/admin/login"); };

//   if (!user) return <div style={{ minHeight: "100vh", background: "#0c0c12", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#C9A96E" }}>◈</span></div>;

//   const rc = ROLE_COLORS[user.role] || ROLE_COLORS.contentManager;
//   const navItems = NAV[user.role] || [];
//   const sections = {};
//   navItems.forEach(item => { if (!sections[item.section]) sections[item.section] = []; sections[item.section].push(item); });

//   return (
//     <div style={S.root}>
//       <aside style={{ ...S.sidebar, width: collapsed ? 64 : 240, background: rc.bg }}>
//         <div style={S.sbTop}>
//           {!collapsed && (
//             <Link href="/admin" style={{ ...S.logo, color: "#F0E8D6", textDecoration: "none" }}>
//               Fameo <span style={{ color: rc.accent }}>Admin</span>
//             </Link>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{ ...S.colBtn, color: rc.accent }}>
//             {collapsed ? "›" : "‹"}
//           </button>
//         </div>

//         {!collapsed && (
//           <div style={{ ...S.roleBadge, background: rc.accent + "18", border: `1px solid ${rc.accent}33` }}>
//             <span style={{ ...S.roleDot, background: rc.accent }} />
//             <span style={{ ...S.roleLabel, color: rc.accent }}>{rc.label}</span>
//           </div>
//         )}

//         <nav style={S.nav}>
//           {Object.entries(sections).map(([sec, items]) => (
//             <div key={sec} style={S.navSec}>
//               {!collapsed && <span style={S.secLabel}>{SECTION_LABELS[sec]}</span>}
//               {items.map(item => {
//                 const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
//                 return (
//                   <Link key={item.href} href={item.href} style={{
//                     ...S.navItem,
//                     background:   active ? rc.accent + "18" : "transparent",
//                     borderLeft:   active ? `3px solid ${rc.accent}` : "3px solid transparent",
//                     color:        active ? "#F0E8D6" : "rgba(240,232,214,0.42)",
//                     justifyContent: collapsed ? "center" : "flex-start",
//                   }}>
//                     <span style={{ ...S.navIcon, color: active ? rc.accent : "inherit" }}>{item.icon}</span>
//                     {!collapsed && (
//                       <>
//                         <span style={S.navLabel}>{item.label}</span>
//                         {item.badge && pendingCount > 0 && (
//                           <span style={{ ...S.badge, background: rc.accent, color: rc.bg }}>{pendingCount}</span>
//                         )}
//                       </>
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>
//           ))}
//         </nav>

//         {!collapsed && (
//           <div style={S.footer}>
//             <div style={{ ...S.avatar, background: rc.accent + "22", color: rc.accent }}>
//               {user.name?.charAt(0).toUpperCase() || "A"}
//             </div>
//             <div style={S.footInfo}>
//               <span style={S.footName}>{user.name}</span>
//               <span style={S.footRole}>{rc.label}</span>
//             </div>
//             <button onClick={() => router.push("/")} style={S.footBtn} title="Back to site">↗</button>
//             <button onClick={doLogout} style={S.footBtn} title="Logout">⏻</button>
//           </div>
//         )}
//       </aside>

//       <main style={S.main}>{children}</main>
//     </div>
//   );
// }

// const S = {
//   root:      { display: "flex", minHeight: "100vh", background: "#F7F6F3", fontFamily: "'DM Sans',sans-serif" },
//   sidebar:   { display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .25s cubic-bezier(.22,1,.36,1)", overflow: "hidden", position: "sticky", top: 0, height: "100vh" },
//   sbTop:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 16px", borderBottom: "1px solid rgba(240,232,214,0.07)", flexShrink: 0 },
//   logo:      { fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" },
//   colBtn:    { background: "none", border: "none", fontSize: 18, cursor: "pointer", lineHeight: 1 },
//   roleBadge: { margin: "10px 12px 4px", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 7, flexShrink: 0 },
//   roleDot:   { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
//   roleLabel: { fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 },
//   nav:       { flex: 1, overflowY: "auto", padding: "6px 0", scrollbarWidth: "none" },
//   navSec:    { marginBottom: 4 },
//   secLabel:  { display: "block", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,214,0.18)", padding: "10px 16px 4px" },
//   navItem:   { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", textDecoration: "none", transition: "all .15s", fontSize: 12 },
//   navIcon:   { fontSize: 13, flexShrink: 0, width: 16, textAlign: "center" },
//   navLabel:  { flex: 1, letterSpacing: ".02em" },
//   badge:     { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10 },
//   footer:    { padding: "10px 14px", borderTop: "1px solid rgba(240,232,214,0.07)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
//   avatar:    { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 },
//   footInfo:  { flex: 1, minWidth: 0 },
//   footName:  { display: "block", fontSize: 11, color: "rgba(240,232,214,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
//   footRole:  { display: "block", fontSize: 9, color: "rgba(240,232,214,0.28)", letterSpacing: ".06em", textTransform: "uppercase" },
//   footBtn:   { background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "rgba(240,232,214,0.28)" },
//   main:      { flex: 1, overflow: "auto", minWidth: 0 },
// };

"use client";
// app/admin/layout.js

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

const NAV = {
  superAdmin: [
    { label: "Overview",       icon: "◈", href: "/admin",                section: "main"     },
    { label: "Approvals",      icon: "◎", href: "/admin/approval",       section: "main",    badge: true },
    { label: "Content OS",     icon: "◇", href: "/admin/content",        section: "content"  },
    { label: "Media Center",   icon: "◉", href: "/admin/media-center",   section: "content"  },
    { label: "Archive",        icon: "◐", href: "/admin/archive",        section: "content"  },
    { label: "Products",       icon: "◑", href: "/admin/products",       section: "commerce" },
    { label: "Revenue",        icon: "◊", href: "/admin/revenue",        section: "commerce" },
    { label: "Analytics",      icon: "◈", href: "/admin/analytics",      section: "commerce" },
    { label: "Contacts",       icon: "◎", href: "/admin/contacts",       section: "people"   },
    { label: "Module Masters", icon: "◇", href: "/admin/module-masters", section: "people"   },
    { label: "Roles",          icon: "◉", href: "/admin/roles",          section: "people"   },
    { label: "Support",        icon: "◐", href: "/admin/support",        section: "people"   },
    { label: "Notifications",  icon: "◑", href: "/admin/notifications",  section: "system"   },
    { label: "Settings",       icon: "◊", href: "/admin/settings",       section: "system"   },
  ],
  moduleMaster: [
    { label: "My Overview",    icon: "◈", href: "/admin",                section: "main"     },
    { label: "Content OS",     icon: "◇", href: "/admin/content",        section: "content"  },
    { label: "Media Center",   icon: "◉", href: "/admin/media-center",   section: "content"  },
    { label: "Analytics",      icon: "◈", href: "/admin/analytics",      section: "main"     },
  ],
  contentManager: [
    { label: "Overview",       icon: "◈", href: "/admin",                section: "main"     },
    { label: "Approvals",      icon: "◎", href: "/admin/approval",       section: "main",    badge: true },
    { label: "Content OS",     icon: "◇", href: "/admin/content",        section: "content"  },
    { label: "Media Center",   icon: "◉", href: "/admin/media-center",   section: "content"  },
    { label: "Archive",        icon: "◐", href: "/admin/archive",        section: "content"  },
    { label: "Analytics",      icon: "◈", href: "/admin/analytics",      section: "main"     },
    { label: "Notifications",  icon: "◑", href: "/admin/notifications",  section: "system"   },
  ],
  supportAgent: [
    { label: "Support",        icon: "◐", href: "/admin",                section: "main"     },
    { label: "Contacts",       icon: "◎", href: "/admin/contacts",       section: "people"   },
  ],
};

const SECTION_LABELS = { main: "Main", content: "Content", commerce: "Commerce", people: "People", system: "System" };

const ROLE_COLORS = {
  superAdmin:     { bg: "#1a1208", accent: "#C9A96E", label: "Super Admin"   },
  moduleMaster:   { bg: "#0a1420", accent: "#7eb8d8", label: "Module Master" },
  contentManager: { bg: "#100a20", accent: "#b89fd4", label: "Content Mgr"   },
  supportAgent:   { bg: "#0a1a0a", accent: "#7ec87e", label: "Support Agent" },
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAdminAuthStore();
  const [collapsed, setCollapsed]  = useState(false);
  const [pendingCount, setPending] = useState(0);
  const [hydrated, setHydrated]    = useState(false);

  // Wait for Zustand to rehydrate from localStorage before doing anything
  useEffect(() => { setHydrated(true); }, []);

  // ── Login page — bypass layout entirely
  if (pathname === "/admin/login") return <>{children}</>;

  // ── Not hydrated yet — show nothing (prevents flash)
  if (!hydrated) return null;

  // ── Auth guard — runs after hydration
  if (!user) {
    if (typeof window !== "undefined") router.replace("/admin/login");
    return null;
  }

  const adminRoles = ["superAdmin","contentManager","moduleMaster","supportAgent"];
  if (!adminRoles.includes(user.role)) {
    if (typeof window !== "undefined") router.replace("/");
    return null;
  }

  return <AuthedLayout user={user} logout={logout} pathname={pathname} router={router}
    collapsed={collapsed} setCollapsed={setCollapsed} pendingCount={pendingCount} setPending={setPending}>
    {children}
  </AuthedLayout>;
}


// ── Separate component so hooks run after auth checks pass
function AuthedLayout({ user, logout, pathname, router, collapsed, setCollapsed, pendingCount, setPending, children }) {

  // Only superAdmin and contentManager can access approvals
  const canFetchPending = ["superAdmin","contentManager"].includes(user.role);

  const fetchPending = async () => {
    if (!canFetchPending) return;  // ← fix: skip for supportAgent + moduleMaster
    try {
      const d = await api.get("/admin/approvals?status=pending&limit=1");
      setPending(d?.data?.total ?? d?.data?.approvals?.length ?? 0);
    } catch {}
  };

  useEffect(() => {
    fetchPending();
    const t = setInterval(fetchPending, 30000);
    return () => clearInterval(t);
  }, []);

  useSocket({
    "admin:approval_reviewed": fetchPending,
    "topic:published":         canFetchPending ? fetchPending : () => {},
  });

  // ... rest of component unchanged
  const doLogout = async () => { await logout(); router.replace("/admin/login"); };

  const rc       = ROLE_COLORS[user.role] || ROLE_COLORS.contentManager;
  const navItems = NAV[user.role] || [];
  const sections = {};
  navItems.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  return (
    <div style={S.root}>
      <aside style={{ ...S.sidebar, width: collapsed ? 64 : 240, background: rc.bg }}>
        <div style={S.sbTop}>
          {!collapsed && (
            <Link href="/admin" style={{ ...S.logo, color: "#F0E8D6", textDecoration: "none" }}>
              Fameo <span style={{ color: rc.accent }}>Admin</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{ ...S.colBtn, color: rc.accent }}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {!collapsed && (
          <div style={{ ...S.roleBadge, background: rc.accent + "18", border: `1px solid ${rc.accent}33` }}>
            <span style={{ ...S.roleDot, background: rc.accent }} />
            <span style={{ ...S.roleLabel, color: rc.accent }}>{rc.label}</span>
          </div>
        )}

        <nav style={S.nav}>
          {Object.entries(sections).map(([sec, items]) => (
            <div key={sec} style={S.navSec}>
              {!collapsed && <span style={S.secLabel}>{SECTION_LABELS[sec]}</span>}
              {items.map(item => {
                const active = pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} style={{
                    ...S.navItem,
                    background:     active ? rc.accent + "18" : "transparent",
                    borderLeft:     active ? `3px solid ${rc.accent}` : "3px solid transparent",
                    color:          active ? "#F0E8D6" : "rgba(240,232,214,0.42)",
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}>
                    <span style={{ ...S.navIcon, color: active ? rc.accent : "inherit" }}>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span style={S.navLabel}>{item.label}</span>
                        {item.badge && pendingCount > 0 && (
                          <span style={{ ...S.badge, background: rc.accent, color: rc.bg }}>{pendingCount}</span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div style={S.footer}>
            <div style={{ ...S.avatar, background: rc.accent + "22", color: rc.accent }}>
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div style={S.footInfo}>
              <span style={S.footName}>{user.name}</span>
              <span style={S.footRole}>{rc.label}</span>
            </div>
            <button onClick={() => router.push("/")} style={S.footBtn} title="Back to site">↗</button>
            <button onClick={doLogout} style={S.footBtn} title="Logout">⏻</button>
          </div>
        )}
      </aside>

      <main style={S.main}>{children}</main>
    </div>
  );
}

const S = {
  root:      { display: "flex", minHeight: "100vh", background: "#F7F6F3", fontFamily: "'DM Sans',sans-serif" },
  sidebar:   { display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .25s cubic-bezier(.22,1,.36,1)", overflow: "hidden", position: "sticky", top: 0, height: "100vh" },
  sbTop:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 16px", borderBottom: "1px solid rgba(240,232,214,0.07)", flexShrink: 0 },
  logo:      { fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" },
  colBtn:    { background: "none", border: "none", fontSize: 18, cursor: "pointer", lineHeight: 1 },
  roleBadge: { margin: "10px 12px 4px", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 7, flexShrink: 0 },
  roleDot:   { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  roleLabel: { fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 },
  nav:       { flex: 1, overflowY: "auto", padding: "6px 0", scrollbarWidth: "none" },
  navSec:    { marginBottom: 4 },
  secLabel:  { display: "block", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(240,232,214,0.18)", padding: "10px 16px 4px" },
  navItem:   { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", textDecoration: "none", transition: "all .15s", fontSize: 12 },
  navIcon:   { fontSize: 13, flexShrink: 0, width: 16, textAlign: "center" },
  navLabel:  { flex: 1, letterSpacing: ".02em" },
  badge:     { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10 },
  footer:    { padding: "10px 14px", borderTop: "1px solid rgba(240,232,214,0.07)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  avatar:    { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 },
  footInfo:  { flex: 1, minWidth: 0 },
  footName:  { display: "block", fontSize: 11, color: "rgba(240,232,214,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  footRole:  { display: "block", fontSize: 9, color: "rgba(240,232,214,0.28)", letterSpacing: ".06em", textTransform: "uppercase" },
  footBtn:   { background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "rgba(240,232,214,0.28)" },
  main:      { flex: 1, overflow: "auto", minWidth: 0 },
};