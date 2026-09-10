// modules/Admin/Roles/helpers.js

export function timeAgo(iso) {
  if (!iso) return "never";
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now";
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  if (d < 10080) return `${Math.floor(d / 1440)}d ago`;
  return new Date(iso).toLocaleDateString("en-IN");
}
