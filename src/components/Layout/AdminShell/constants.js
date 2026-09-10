// components/Layout/AdminShell/constants.js

export const NAV = {
  superAdmin: [
    { label: "Overview", icon: "◈", href: "/admin", section: "main" },
    { label: "Approvals", icon: "◎", href: "/admin/approval", section: "main", badge: true },
    { label: "Content OS", icon: "◇", href: "/admin/content", section: "content" },
    { label: "Media Center", icon: "◉", href: "/admin/media-center", section: "content" },
    { label: "Archive", icon: "◐", href: "/admin/archive", section: "content" },
    { label: "Products", icon: "◑", href: "/admin/products", section: "commerce" },
    { label: "Revenue", icon: "◊", href: "/admin/revenue", section: "commerce" },
    { label: "Analytics", icon: "◈", href: "/admin/analytics", section: "commerce" },
    { label: "Contacts", icon: "◎", href: "/admin/contacts", section: "people" },
    { label: "Module Masters", icon: "◇", href: "/admin/module-masters", section: "people" },
    { label: "Roles", icon: "◉", href: "/admin/roles", section: "people" },
    { label: "Support", icon: "◐", href: "/admin/support", section: "people" },
    { label: "Notifications", icon: "◑", href: "/admin/notifications", section: "system" },
    { label: "Settings", icon: "◊", href: "/admin/settings", section: "system" },
  ],
  moduleMaster: [
    { label: "My Overview", icon: "◈", href: "/admin", section: "main" },
    { label: "Content OS", icon: "◇", href: "/admin/content", section: "content" },
    { label: "Media Center", icon: "◉", href: "/admin/media-center", section: "content" },
    { label: "Analytics", icon: "◈", href: "/admin/analytics", section: "main" },
  ],
  contentManager: [
    { label: "Overview", icon: "◈", href: "/admin", section: "main" },
    { label: "Approvals", icon: "◎", href: "/admin/approval", section: "main", badge: true },
    { label: "Content OS", icon: "◇", href: "/admin/content", section: "content" },
    { label: "Media Center", icon: "◉", href: "/admin/media-center", section: "content" },
    { label: "Archive", icon: "◐", href: "/admin/archive", section: "content" },
    { label: "Analytics", icon: "◈", href: "/admin/analytics", section: "main" },
    { label: "Notifications", icon: "◑", href: "/admin/notifications", section: "system" },
  ],
  supportAgent: [
    { label: "Support", icon: "◐", href: "/admin", section: "main" },
    { label: "Contacts", icon: "◎", href: "/admin/contacts", section: "people" },
  ],
};

export const SECTION_LABELS = { main: "Main", content: "Content", commerce: "Commerce", people: "People", system: "System" };

export const ROLE_COLORS = {
  superAdmin: { bg: "#1a1208", accent: "#C9A96E", label: "Super Admin" },
  moduleMaster: { bg: "#0a1420", accent: "#7eb8d8", label: "Module Master" },
  contentManager: { bg: "#100a20", accent: "#b89fd4", label: "Content Mgr" },
  supportAgent: { bg: "#0a1a0a", accent: "#7ec87e", label: "Support Agent" },
};
