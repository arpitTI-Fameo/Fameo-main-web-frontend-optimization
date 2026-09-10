// modules/Admin/Roles/constants.js

/* ── Role config ── */
export const ROLES = [
  {
    key: "superAdmin",
    label: "Super Admin",
    color: "#C9A96E",
    desc: "Full platform access — revenue, settings, all content, all users",
    permissions: ["Everything"],
  },
  {
    key: "contentManager",
    label: "Content Manager",
    color: "#a98fd0",
    desc: "All content across all modules — edit, publish, approve, notifications",
    permissions: ["Content OS", "Approvals", "Media", "Archive", "Analytics", "Notifications"],
  },
  {
    key: "moduleMaster",
    label: "Module Master",
    color: "#6aa8cf",
    desc: "Create & upload in assigned modules only — submit for review",
    permissions: ["Own Modules", "Media Upload", "Submit for Review", "Own Analytics"],
  },
  {
    key: "supportAgent",
    label: "Support Agent",
    color: "#6cae6c",
    desc: "Tickets, FAQ builder, learner lookup, read-only content",
    permissions: ["Support Tickets", "Learner Lookup", "FAQ Builder", "Read-Only Content"],
  },
  {
    key: "learner",
    label: "Learner",
    color: "#9c9484",
    desc: "End user — Learner Hub only, read topics, track progress",
    permissions: ["Learner Hub", "Progress Tracking", "Q&A"],
  },
];

export const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.key, r]));
