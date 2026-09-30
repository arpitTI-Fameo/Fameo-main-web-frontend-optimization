// modules/Resources/constants.js

import {
  BookOpen,
  Camera,
  Clapperboard,
  Compass,
  Download,
  Gem,
  Headphones,
  MessagesSquare,
  PencilLine,
  Rocket,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

/* In-page anchors the hero and closing CTA scroll to. */
export const SECTION_IDS = {
  courses: 'courses',
  membership: 'membership',
};

/* Hero portrait grid ─────────────────────────────────────────── */
export const PORTRAITS = [
  "/assets/landing/curators/portrait-01-culinary-curator.png",
  "/assets/landing/curators/portrait-02-design-curator.png",
  "/assets/landing/curators/portrait-03-music-curator.png",
  "/assets/landing/curators/portrait-04-style-curator.png",
];

export const COMMUNITY_PHOTO = {
  src: "/assets/landing/avatars/hero-01-wedding-filmmaker.webp",
  alt: "Community creator photo",
};

/* Goal → real category from constants/courses.js */
export const GOALS = [
  { value: "Foundations", label: "Build my foundations", icon: Compass },
  { value: "Content", label: "Create better content", icon: Clapperboard },
  { value: "Setup", label: "Set up my workflow", icon: Camera },
  { value: "Growth", label: "Grow my audience", icon: TrendingUp },
  { value: "Monetization", label: "Turn craft into income", icon: Gem },
  { value: "Scaling", label: "Scale into a lasting career", icon: Rocket },
];

export const PERKS = [
  { icon: BookOpen, label: "Courses & original playbooks" },
  { icon: Headphones, label: "Audio-ready lessons" },
  { icon: Download, label: "Templates & practical tools" },
  { icon: Smartphone, label: "Learn across your devices" },
  { icon: Sparkles, label: "Fresh perspectives & resources" },
  { icon: Users, label: "A creator-first community" },
];

export const COMMUNITY = [
  { icon: Sparkles, title: "Stay inspired", description: "Fresh perspectives from people who understand the creative life." },
  { icon: MessagesSquare, title: "Stay connected", description: "A place for shared interests and thoughtful conversations." },
  { icon: PencilLine, title: "Keep creating", description: "Turn what you learn into something that feels like you." },
];

export const MEMBERSHIP_POINTS = ["Course library", "Downloadable tools", "Learn at your pace"];

export const FAQS = [
  ["What is the Creator Knowledge Hub?", "It's Fameo's learning centre — 8 in-depth courses plus playbooks, toolkits, and checklists covering everything from creator foundations to monetisation and scaling, built from data across 12,000 Indian creators."],
  ["Who are these courses for?", "Verified creators, influencers, and public figures at every stage — whether you're picking your niche or building a team around a decade-long career."],
  ["Are the resources free?", "Core foundations are free for every verified Fameo member. Playbooks, masterclasses, and toolkits are part of the Pro and Elite memberships."],
  ["How often is new content added?", "New courses, reports, and checklists are added every month — including trend reports like The Creator Economy Report."],
  ["Can I learn on mobile?", "Yes. Every course works on desktop, tablet, and mobile, with bite-sized lessons designed for learning between shoots."],
];
