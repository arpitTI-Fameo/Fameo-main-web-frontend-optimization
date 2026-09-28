// Copy for /upcoming.
//
// /upcoming               → overview grid of every entry in UPCOMING_FEATURES
// /upcoming?source=<key>  → that feature's detail page and use cases
//
// The keys match the ?source= values the redirects in next.config.mjs attach;
// an unknown source falls back to the overview.
//
// Shape: `title` fills the eyebrow and the card heading, `description` is the
// detail headline (one or two short sentences), `features` are three short
// chip labels, `date` reads as "Expected · <date>", and `useCases` are three
// { title, text } pairs.

export const UPCOMING_OVERVIEW = {
  title: 'Fameo Labs',
  description: 'New tools for creators are in the works. Pick one to see what it does and how you will use it.',
};

export const UPCOMING_FEATURES = {
  products: {
    title: 'Fameo Creator Store',
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
  community: {
    title: 'Fameo Community',
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
  'talent-hire': {
    title: 'Fameo Talent Hire',
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
