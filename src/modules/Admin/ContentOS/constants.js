export const STATUS_CONFIG = {
    published: { label: "Published", color: "#7ec87e", bg: "#7ec87e18" },
    draft: { label: "Draft", color: "#C9A96E", bg: "#C9A96E18" },
    review: { label: "In Review", color: "#7eb8d8", bg: "#7eb8d818" },
    archived: { label: "Archived", color: "#aaa", bg: "#aaa22" },
};

export const MODULES = [
    { id: 0, title: "Creator Foundations" },
    { id: 1, title: "Content Creation System" },
    { id: 2, title: "Studio & Team Setup" },
    { id: 3, title: "Platform Growth & Algorithms" },
    { id: 4, title: "Collabs & Community" },
    { id: 5, title: "Monetization & Brand Deals" },
    { id: 6, title: "Creator Operations & Legal" },
    { id: 7, title: "Scaling & Career Growth" },
];

export function timeAgo(iso) {
    const d = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (d < 1) return "just now";
    if (d < 60) return `${d}m ago`;
    if (d < 1440) return `${Math.floor(d / 60)}h ago`;
    return `${Math.floor(d / 1440)}d ago`;
}
