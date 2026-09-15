// app/sitemap.js
// Only routes a signed-out crawler can actually reach.
//
// This is the whole point of deriving from GATED_ROUTES rather than listing
// paths by hand: /products, /resources and /community all redirect to /login
// for a visitor with no session, so advertising them in a sitemap spends crawl
// budget on 307s and reads as a soft 404. The filter below makes it impossible
// to list one by accident, and it follows the middleware automatically if a
// route is ever opened up.
//
// Deliberately static: every dynamic route here needs an upstream call to
// enumerate, and a sitemap that throws when the API is slow is worse than one
// that lists the stable routes.

import { SITE } from '@/lib/seo/metadata';
import { GATED_ROUTES, matchesRoute } from '@/lib/auth/gated-routes';

const candidates = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/plans', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/support', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/login', changeFrequency: 'monthly', priority: 0.3 },
  // Listed so the filter below is exercised by real data rather than being
  // dead code: these are gated today and are dropped automatically.
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  { path: '/resources', changeFrequency: 'daily', priority: 0.9 },
  { path: '/talent-hire', changeFrequency: 'weekly', priority: 0.7 },
];

export default function sitemap() {
  const lastModified = new Date();

  return candidates
    .filter(({ path }) => !matchesRoute(path, GATED_ROUTES))
    .map(({ path, changeFrequency, priority }) => ({
      url: `${SITE.url}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }));
}
