// modules/Admin/Archive/helpers.js

export function timeAgo(iso) {
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    return `${d} days ago`;
}
