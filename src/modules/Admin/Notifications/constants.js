export const MODULES = [
  "Creator Foundations", "Content Creation System", "Studio & Team Setup",
  "Platform Growth & Algorithms", "Collabs & Community", "Monetization & Brand Deals",
  "Creator Operations & Legal", "Scaling & Career Growth",
];
export const EMPTY = { title: "", body: "", type: "newContent", audience: "all", moduleId: null };
export const TYPE_COLOR = { newContent: "#7eb8d8", product: "#C9A96E", platformUpdate: "#b89fd4" };

export function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
}
