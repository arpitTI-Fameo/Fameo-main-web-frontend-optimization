// Copy for /upcoming.
//
// /upcoming               → the "What's next" overview
// /upcoming?source=<key>  → that feature's detail page and use cases
//
// The keys match the ?source= values the redirects in next.config.mjs attach;
// an unknown source falls back to the overview. Key order is the order the
// features appear in the overview's link strip.
//
// Shape, per feature:
//   title, label, icon, status  eyebrow ("Fameo Community · Coming soon") and strip link
//   headline                    [plain line, rose serif line]
//   teaser, link                overview copy and its link label
//   description, features       detail lead and its three chip labels
//   date                        reads as "Expected · <date>"
//   image, useCases             detail photo and three { title, text } pairs
// plus section-specific extras (`highlights`, `note`, `pass`).

import {
  Badge,
  Camera,
  Clapperboard,
  MessagesSquare,
  UserRound,
  Users,
} from 'lucide-react';

/* In-page anchor for "Take a first look" / "Revisit the first look". */
export const FIRST_LOOK_ID = 'first-look';

export const UPCOMING_HERO = {
  eyebrow: 'The next chapter of Fameo',
  title: 'Good things.',
  accent: 'Worth the wait.',
  text: 'More ways to find your people, follow your craft and make room for what’s next.',
  cta: 'Take a first look',
  caption: 'A little preview of what we’re building.',
  artCaption: 'Thoughtfully in the making',
  pass: { title: 'A little more possibility.', caption: 'Your next chapter' },
  photos: [
    { src: '/assets/landing/useCases/products.png', caption: 'For your craft' },
    { src: '/assets/landing/hero/hero-01-wedding-filmmaker.webp', caption: 'For your next idea' },
  ],
};

export const UPCOMING_TOOLS = {
  title: 'For the things',
  accent: 'you haven’t made yet.',
  aside: ['The tools. The people.', 'A little more room for your ideas.'],
  badge: 'In the making',
};

export const UPCOMING_NOTE =
  'A first look, not a launch announcement. These features are still in development; availability and final details will be shared when they’re ready.';

export const UPCOMING_CLOSING = {
  title: 'There’s more to your story.',
  accent: 'We’re making room for it.',
  text: 'Keep an eye on this space. The next chapter is taking shape.',
  cta: 'Revisit the first look',
};

export const UPCOMING_FEATURES = {
  community: {
    title: 'Fameo Community',
    label: 'Community',
    icon: Users,
    status: 'Coming soon',
    headline: ['Good people.', 'Your kind of circle.'],
    teaser: 'Imagine a space where people get your world. Shared interests, fresh perspectives and conversations you want to come back to.',
    highlights: ['Find your niche', 'Share perspectives', 'Feel connected'],
    note: 'Different worlds. Something in common.',
    link: 'A glimpse inside',
    description: 'A members-only space to meet creators in your niche, swap feedback and team up on work.',
    features: ['Niche spaces', 'Live creator events', 'Collab requests'],
    date: 'Winter 2026',
    image: { src: '/assets/landing/useCases/community.jpg', alt: 'An illustrated crowd of diverse creators' },
    useCases: [
      { title: 'Find your niche', text: 'Join spaces for fashion, food, tech or travel creators and talk shop with people who make what you make.' },
      { title: 'Get feedback before posting', text: 'Share a draft reel or thumbnail and get honest notes from other creators.' },
      { title: 'Team up', text: 'Post a collab request and find creators to co-host, cross-promote or shoot with.' },
    ],
  },
  products: {
    title: 'Fameo Creator Store',
    label: 'Creator Store',
    icon: Camera,
    status: 'In the making',
    headline: ['Your craft.', 'Meet your toolkit.'],
    teaser: 'A considered edit of cameras, lighting and audio. Essentials with creators in mind.',
    link: 'Explore the idea',
    description: 'Pro-grade cameras, lighting and audio, picked for creators, with member pricing built in.',
    features: ['Creator-tested gear', 'Member-only pricing', 'Tracked delivery'],
    date: 'Fall 2026',
    image: { src: '/assets/landing/useCases/products.png', alt: 'A compact mirrorless camera with a wrist strap and battery' },
    useCases: [
      { title: 'Upgrade your kit', text: 'Compare cameras, lights and mics side by side and pick what suits your format, whether you shoot reels, vlogs or weddings.' },
      { title: 'Buy at member prices', text: 'Paid members see their discount applied to every item, with no codes to hunt for.' },
      { title: 'Gear up for a shoot', text: 'Pick up a tripod, gimbal and lighting for a one-off project and have it delivered in time for shoot day.' },
    ],
  },
  'talent-hire': {
    title: 'Fameo Talent Hire',
    label: 'Talent Hire',
    icon: Clapperboard,
    status: 'In the making',
    headline: ['Big idea.', 'The right people.'],
    teaser: 'Discover the editors, shooters and designers who could help bring your vision to life.',
    link: 'Explore the idea',
    description: 'Find editors, shooters and designers who work with creators, and get hired for your own skills.',
    features: ['Verified portfolios', 'Direct booking', 'Secure payouts'],
    date: 'Spring 2027',
    image: { src: '/assets/landing/hero/hero-01-wedding-filmmaker.webp', alt: 'A wedding filmmaker operating a cinema camera at a lit venue' },
    useCases: [
      { title: 'Hire for a project', text: 'Find an editor for a wedding film or a photographer for a brand shoot, and book them directly.' },
      { title: 'Get hired', text: 'Put your portfolio in front of creators who need your skills and take on paid work.' },
      { title: 'Get paid safely', text: 'Payments are held securely and released when the work is delivered.' },
    ],
  },
  plans: {
    title: 'Fameo Membership',
    label: 'Membership',
    icon: Badge,
    status: 'Coming soon',
    headline: ['A little more Fameo.', 'A lot more possibility.'],
    teaser: 'A new way to bring more of your creative world together. Thoughtful benefits, made to grow with you.',
    link: 'A look ahead',
    pass: { title: 'Keep becoming.', caption: 'The creator membership' },
    description: 'One membership for store discounts, the full course library and the community. Pick the tier that fits.',
    features: ['Store discounts', 'Full course library', 'Priority support'],
    date: 'Late 2026',
    image: { src: '/assets/landing/useCases/resources.jpg', alt: 'A case-study booklet surrounded by printed photos' },
    useCases: [
      { title: 'Save on gear', text: 'Members get a discount on every Creator Store order.' },
      { title: 'Learn the craft', text: 'Unlock the full course library, from shooting basics to growing an audience.' },
      { title: 'Choose your tier', text: 'Start on a shorter plan and upgrade when it suits you, with the price difference worked out for you.' },
    ],
  },
  account: {
    title: 'Your Fameo Account',
    label: 'Your account',
    icon: UserRound,
    status: 'Planned',
    headline: ['Your world.', 'Beautifully together.'],
    teaser: 'Your profile, preferences and membership details, with a little less back-and-forth.',
    link: 'See what’s taking shape',
    description: 'Your profile, orders, wallet and membership in one place, being polished before it opens.',
    features: ['Profile & settings', 'Orders & wallet', 'Referral rewards'],
    date: 'In the coming months',
    image: { src: '/assets/landing/hero/scene-02-home-studio.webp', alt: 'A creator smiling at a desk in a home podcast studio' },
    useCases: [
      { title: 'One home for everything', text: 'See your profile, orders, wallet and membership on one page.' },
      { title: 'Earn from referrals', text: 'Invite other creators and track the rewards you earn in your wallet.' },
      { title: 'Manage your membership', text: 'Renew, upgrade or turn off auto-renew yourself, without contacting support.' },
    ],
  },
  support: {
    title: 'Fameo Support',
    label: 'Support',
    icon: MessagesSquare,
    status: 'Planned',
    headline: ['A little guidance.', 'Right when you need it.'],
    teaser: 'Helpful answers and a clearer way to reach the team. Less searching, more moving forward.',
    link: 'See what’s taking shape',
    description: 'Quick answers and a direct line to our team for anything about your account or orders.',
    features: ['Help articles', 'Ticket tracking', 'Order help'],
    date: 'In the coming months',
    image: { src: '/assets/landing/hero/scene-07-dream-studio.webp', alt: 'A sunlit creator studio with a camera on a tripod facing an empty backdrop' },
    useCases: [
      { title: 'Find answers fast', text: 'Search help articles on orders, payments and membership.' },
      { title: 'Raise a ticket', text: 'Open a ticket for anything the articles do not cover and follow its status.' },
      { title: 'Get help with an order', text: 'Report a delivery or product issue straight from the order it relates to.' },
    ],
  },
};
