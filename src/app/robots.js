// app/robots.js
// Generated, not a static file, so the host and the disallow list follow the
// app instead of being maintained twice.
//
// The disallow list is derived from the middleware's gated routes plus the
// transactional pages. A crawler that fetches a gated URL gets a 307 to /login
// — telling it not to bother is strictly better than letting it find out.

import { SITE } from '@/lib/seo/metadata';
import { GATED_ROUTES } from '@/lib/auth/gated-routes';

// Public but worthless to index: no stable content, and per-visitor state.
const TRANSACTIONAL = ['/cart', '/otp', '/api/'];

export default function robots() {
  const disallow = [...new Set([...GATED_ROUTES, ...TRANSACTIONAL])].sort();

  return {
    rules: [{ userAgent: '*', allow: '/', disallow }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
