// components/Layout/AdminShell/constants.js

import { ADMIN_ROUTES } from "@/constants/routes";

export const NAV = {
  superAdmin: [
    { label: "Overview", icon: "◈", href: ADMIN_ROUTES.ROOT, section: "main" },
    { label: "Approvals", icon: "◎", href: ADMIN_ROUTES.APPROVAL, section: "main", badge: true },
    { label: "Content OS", icon: "◇", href: ADMIN_ROUTES.CONTENT, section: "content" },
    { label: "Media Center", icon: "◉", href: ADMIN_ROUTES.MEDIA_CENTER, section: "content" },
    { label: "Archive", icon: "◐", href: ADMIN_ROUTES.ARCHIVE, section: "content" },
    { label: "Products", icon: "◑", href: ADMIN_ROUTES.PRODUCTS, section: "commerce" },
    { label: "Revenue", icon: "◊", href: ADMIN_ROUTES.REVENUE, section: "commerce" },
    { label: "Analytics", icon: "◈", href: ADMIN_ROUTES.ANALYTICS, section: "commerce" },
    { label: "Contacts", icon: "◎", href: ADMIN_ROUTES.CONTACTS, section: "people" },
    { label: "Module Masters", icon: "◇", href: ADMIN_ROUTES.MODULE_MASTERS, section: "people" },
    { label: "Roles", icon: "◉", href: ADMIN_ROUTES.ROLES, section: "people" },
    { label: "Support", icon: "◐", href: ADMIN_ROUTES.SUPPORT, section: "people" },
    { label: "Notifications", icon: "◑", href: ADMIN_ROUTES.NOTIFICATIONS, section: "system" },
    { label: "Settings", icon: "◊", href: ADMIN_ROUTES.SETTINGS, section: "system" },
  ],
  moduleMaster: [
    { label: "My Overview", icon: "◈", href: ADMIN_ROUTES.ROOT, section: "main" },
    { label: "Content OS", icon: "◇", href: ADMIN_ROUTES.CONTENT, section: "content" },
    { label: "Media Center", icon: "◉", href: ADMIN_ROUTES.MEDIA_CENTER, section: "content" },
    { label: "Analytics", icon: "◈", href: ADMIN_ROUTES.ANALYTICS, section: "main" },
  ],
  contentManager: [
    { label: "Overview", icon: "◈", href: ADMIN_ROUTES.ROOT, section: "main" },
    { label: "Approvals", icon: "◎", href: ADMIN_ROUTES.APPROVAL, section: "main", badge: true },
    { label: "Content OS", icon: "◇", href: ADMIN_ROUTES.CONTENT, section: "content" },
    { label: "Media Center", icon: "◉", href: ADMIN_ROUTES.MEDIA_CENTER, section: "content" },
    { label: "Archive", icon: "◐", href: ADMIN_ROUTES.ARCHIVE, section: "content" },
    { label: "Analytics", icon: "◈", href: ADMIN_ROUTES.ANALYTICS, section: "main" },
    { label: "Notifications", icon: "◑", href: ADMIN_ROUTES.NOTIFICATIONS, section: "system" },
  ],
  supportAgent: [
    { label: "Support", icon: "◐", href: ADMIN_ROUTES.ROOT, section: "main" },
    { label: "Contacts", icon: "◎", href: ADMIN_ROUTES.CONTACTS, section: "people" },
  ],
};

export const SECTION_LABELS = { main: "Main", content: "Content", commerce: "Commerce", people: "People", system: "System" };

export const ROLE_COLORS = {
  superAdmin: { bg: "#1a1208", accent: "#C9A96E", label: "Super Admin" },
  moduleMaster: { bg: "#0a1420", accent: "#7eb8d8", label: "Module Master" },
  contentManager: { bg: "#100a20", accent: "#b89fd4", label: "Content Mgr" },
  supportAgent: { bg: "#0a1a0a", accent: "#7ec87e", label: "Support Agent" },
};
