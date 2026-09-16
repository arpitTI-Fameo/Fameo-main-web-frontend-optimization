/* A topic's lifecycle. Module-scoped on purpose: these four values mean
   something to ContentOS and nothing outside it, so they do not belong in
   src/constants. Admin/Products has its own, separate status domain. */
export const CONTENT_STATUS = {
    PUBLISHED: "published",
    DRAFT: "draft",
    REVIEW: "review",
    ARCHIVED: "archived",
};

/* Keyed by CONTENT_STATUS so a status can never be configured under a name
   the rest of the module does not use. Insertion order is also the order the
   filter chips render in — see ContentOSFilters. */
export const STATUS_CONFIG = {
    [CONTENT_STATUS.PUBLISHED]: { label: "Published", color: "#7ec87e", bg: "#7ec87e18" },
    [CONTENT_STATUS.DRAFT]: { label: "Draft", color: "#C9A96E", bg: "#C9A96E18" },
    [CONTENT_STATUS.REVIEW]: { label: "In Review", color: "#7eb8d8", bg: "#7eb8d818" },
    [CONTENT_STATUS.ARCHIVED]: { label: "Archived", color: "#aaa", bg: "#aaa22" },
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

