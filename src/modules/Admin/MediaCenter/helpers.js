// modules/Admin/MediaCenter/helpers.js

export function timeAgo(iso) {
    const d = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (d < 60) return `${d}m ago`;
    if (d < 1440) return `${Math.floor(d / 60)}h ago`;
    return `${Math.floor(d / 1440)}d ago`;
}

export function fmtSize(b) {
    return b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
}
