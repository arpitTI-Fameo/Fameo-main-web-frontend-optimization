import { createServerAction } from '@/lib/api/action';
import 'server-only';
// services/register/register.server.js
// Master / reference data, fetched publicly and cached.
//
// This is the public pattern from the guide: no cookies, a revalidate window
// and a cache tag. Touching a cookie here would make any page that calls it
// dynamic and throw the cache away.
//
// app/(auth)/register/page.js prefetches getStates() and getCategories()
// through these and hydrates the client, so step 1 of registration renders
// with its dropdowns already populated. The tags let POST /api/revalidate drop
// them the moment the backend publishes new master data.

import { publicFetch } from '@/lib/api/server/fetcher';
import { masterEndpoints, tags, revalidate } from '@/lib/api/endpoints';
import { APP_ORIGIN } from '@/lib/api/server/origins';

// publicFetch targets API_ORIGIN; master data lives on APP_ORIGIN, so these
// pass an absolute override.
const appUrl = (path) => `${APP_ORIGIN}${path}`;

export function getStates() {
  return publicFetch(appUrl(masterEndpoints.states()), {
    revalidate: revalidate.master,
    tags: [tags.masterStates()],
  });
}

export function getCities(stateId) {
  return publicFetch(appUrl(masterEndpoints.cities()), {
    params: { state_id: stateId },
    revalidate: revalidate.master,
    tags: [tags.masterCities(stateId)],
  });
}

export function getCategories() {
  return publicFetch(appUrl(masterEndpoints.categories()), {
    revalidate: revalidate.master,
    tags: [tags.masterCategories()],
  });
}

export function getProfessions(categoryCode) {
  return publicFetch(appUrl(masterEndpoints.professions(categoryCode)), {
    revalidate: revalidate.master,
    tags: [tags.masterProfessions(categoryCode)],
  });
}
