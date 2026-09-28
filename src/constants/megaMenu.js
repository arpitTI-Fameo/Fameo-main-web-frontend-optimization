// constants/megaMenu.js
// Single source of truth for all navigation data.
// Used by: MainNav (top bar) and ProductsNav (products page category bar).

import { ROUTES } from '@/constants/routes';

export const MAIN_NAV_LINKS = [
  { href: ROUTES.HOME, label: 'Home' },
  // { href: ROUTES.PRODUCTS, label: 'Products' },
  { href: ROUTES.UPCOMING, label: 'Labs' },
  { href: ROUTES.RESOURCES, label: 'Resources' },
  // { href: ROUTES.COMMUNITY,   label: 'Community'    },
  // { href: ROUTES.PLANS, label: 'Plans' },
  // { href: ROUTES.TALENT_HIRE, label: 'Talent Hire'  },
];

// Shown only when user is signed in (in profile dropdown menu)
export const ACCOUNT_MENU_ITEMS = [
  { icon: '👤', label: 'My Profile', path: ROUTES.ACCOUNT_PROFILE },
  { icon: '📦', label: 'My Orders', path: ROUTES.ORDERS },
  { icon: '❤️', label: 'Favourites', path: ROUTES.FAVORITES },
  { icon: '◈', label: 'Subscription', path: ROUTES.SUBSCRIPTION },
  // { icon: '🚚', label: 'Track Order',   path: ROUTES.TRACK_ORDER },
  // { icon: '🎓', label: 'My Learnings',  path: ROUTES.MY_LEARNINGS },
  { icon: '⚙️', label: 'Settings', path: ROUTES.SETTINGS },
];

// Products page — category strip
export const PRODUCT_CATEGORIES = [
  'All',
  'Cameras',
  'Lenses',
  'Bags & Tripods',
  'Lighting',
  'Gimbals',
  'Audio',
  'Accessories',
];

// Products page — mega menu data
export const PRODUCT_MEGA_MENU = {
  Cameras: {
    'Mirrorless Cameras': ['Panasonic', 'Nikon', 'Fujifilm', 'Canon', 'Sony'],
    'Action Cameras': ['Digitek', 'GoPro', 'Insta360', 'DJI'],
    'Camcorders': ['Sony', 'Panasonic', 'Canon'],
    'DSLR Cameras': ['Nikon', 'Canon'],
    'Medium Format': ['Fujifilm'],
    'Cinema Cameras': ['Sony', 'Blackmagic', 'DJI'],
    'Instant Camera': ['Instax', 'Kodak'],
    'Point & Shoot': [],
    'Drones': [],
  },
  Lenses: {
    'Mirrorless Lenses': ['7artisans', 'Viltrox', 'Nikon Z', 'Canon', 'Sigma', 'Samyang', 'Sony', 'Tamron', 'Fujifilm', 'TTArtisan', 'ZEISS', 'Laowa'],
    'DSLR/SLR Lenses': ['Sony', 'Samyang', 'Canon', 'Nikon', 'Tamron', 'Sigma', 'Irix', 'Laowa'],
    'Medium Format Lenses': ['Laowa', 'Fujifilm', 'TTArtisan'],
    'Cine Lenses': ['Samyang', 'Laowa'],
  },
  'Bags & Tripods': {
    'Camera Bags': ['Travel Duffel', 'Backpacks', 'Shoulder Bags', 'Trolley Bags', 'Top Loader'],
    'Tripods & Monopods': ['Tripods', 'Monopods', 'Tripods With Head'],
    'Heads': ['Ball Heads', 'Pan Heads'],
  },
  Lighting: {
    'Flash': ['Studio Packs', 'Camera Flashes', 'Flash Head', 'Macro Lights', 'Studio Flashes & Kits', 'Hybrid LED & Flashes', 'Monolights & Kits'],
    'Continuous Lights': ['On-Camera Lights', 'Chip-on-Board LED', 'Panel Lights', 'Focusing Lights', 'Hybrid Flash LED', 'Light Wands & Tubes', 'Streaming Lights', 'Smartphone Lighting'],
    'Control System': ['Flash Trigger', 'Remote Controller'],
    'Shooting Tents': [],
  },
  Gimbals: {
    'Pocket Gimbals': [],
    'Camera Gimbals': [],
    'Smartphone Gimbals': [],
  },
  Audio: {
    'Wired Audio': ['Digitek', 'Godox'],
    'Wireless Audio': ['Godox', 'Hollyland', 'Mirfak', 'Digitek'],
  },
  Accessories: {
    'Lighting Accessories': ['Softboxes & Umbrellas', 'Light Shapers', 'Light Stands', 'Gels & Diffusion', 'Batteries & Chargers', 'Carrying Bag'],
    'Camera Accessories': ['Camera Straps', 'Camera Cage', 'Cards & Readers', 'Camera Plates', 'Camera Cases'],
    'Action Camera Accessories': ['GoPro', 'Insta360', 'Neck Bracket', 'Remote Control', 'Mounts', 'Protection'],
    'Bags & Tripod Accessories': ['Bag Accessories', 'Tripod Accessories', 'Supports & Rig'],
  },
};

export const PRODUCT_BRANDS = [
  'Sony', 'Canon', 'Nikon', 'Fujifilm', 'DJI', 'GoPro',
  'Sigma', 'Tamron', 'Godox', 'Blackmagic', 'Insta360',
  'Hollyland', 'Samyang', 'Laowa',
];