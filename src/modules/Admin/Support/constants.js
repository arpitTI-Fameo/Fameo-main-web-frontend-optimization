export const PRIORITY_COLOR = { high: "#d49090", medium: "#C9A96E", low: "#7eb8d8" };
export const STATUS_COLOR = { open: "#d49090", inProgress: "#C9A96E", resolved: "#7ec87e", closed: "#aaa" };

export function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
}
