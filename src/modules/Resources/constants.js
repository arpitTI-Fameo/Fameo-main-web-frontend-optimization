// modules/Resources/constants.js

/* Editorial helpers ─────────────────────────────────────────── */
export const PORTRAITS = [
  "photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d",
  "photo-1534528741775-53994a69daeb", "photo-1500648767791-00dcc994a43e",
  "photo-1517841905240-472988babdf9", "photo-1524504388940-b1c1722653e1",
  "photo-1506794778202-cad84cf45f1d", "photo-1531123897727-8f129e1688ce",
  "photo-1539571696357-5a69c17a67c6", "photo-1544005313-94ddf0286df2",
].map(id => `https://images.unsplash.com/${id}?w=460&q=70&fit=crop`);

export const FAN = [
  { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=70", cap: "shared a collab win" },
  { img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=70", cap: "posted a studio setup" },
  { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=70", cap: "hit 10× reach" },
];

export const MEMBER_IMG = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=70";

/* Goal → real category from constants/courses.js */
export const GOALS = [
  ["Build strong creator foundations", "Foundations"],
  ["Create better content, faster", "Content"],
  ["Set up my studio & workflow", "Setup"],
  ["Grow my audience & reach", "Growth"],
  ["Turn my content into income", "Monetization"],
  ["Scale into a lasting career", "Scaling"],
];

export const PILL_ICON = {
  All: "✦", Foundations: "◈", Content: "✎", Setup: "⚙",
  Growth: "↗", Monetization: "₹", Operations: "⚖", Scaling: "⤢",
};

export const PERKS = [
  ["▣", "All 8 courses and original playbooks"],
  ["♫", "Audio-ready lessons for learning on the go"],
  ["⇩", "Download toolkits, templates & checklists"],
  ["▤", "Learn on desktop, tablet, or mobile"],
  ["☆", "New resources added every month"],
  ["✓", "Verified creator community access"],
];

export const COMMUNITY = [
  ["✦", "Stay Inspired", "Discover trending topics, get quick answers, and find your people among verified creators."],
  ["◈", "Stay Connected", "Follow your peers and mentors, exchange perspectives, and share some love."],
  ["✎", "Keep Creating", "Explore new ideas for your next piece of content, post your work, and get feedback."],
];

export const FAQS = [
  ["What is the Creator Knowledge Hub?", "It's Fameo's learning centre — 8 in-depth courses plus playbooks, toolkits, and checklists covering everything from creator foundations to monetisation and scaling, built from data across 12,000 Indian creators."],
  ["Who are these courses for?", "Verified creators, influencers, and public figures at every stage — whether you're picking your niche or building a team around a decade-long career."],
  ["Are the resources free?", "Core foundations are free for every verified Fameo member. Playbooks, masterclasses, and toolkits are part of the Pro and Elite memberships."],
  ["How often is new content added?", "New courses, reports, and checklists are added every month — including trend reports like The Creator Economy Report."],
  ["Can I learn on mobile?", "Yes. Every course works on desktop, tablet, and mobile, with bite-sized lessons designed for learning between shoots."],
];

export const STATEMENT_WORDS = [
  ["Meet", 0], ["the", 0], ["best", 1], ["courses.", 1],
  ["New", 0], ["resources", 0], ["added", 0], ["every", 0], ["month.", 0],
];
