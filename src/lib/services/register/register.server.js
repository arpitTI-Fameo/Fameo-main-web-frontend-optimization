import 'server-only';
// services/register/register.server.js
// Master / reference data, fetched publicly and cached.
//
// This is the public pattern from the guide: no cookies, a revalidate window
// and a cache tag. Touching a cookie here would make any page that calls it
// dynamic and throw the cache away.
//
// Currently unused by the client flow, which still fetches this data in the
// browser — see register.client.js. These exist so an RSC can prefetch them,
// and so /api/revalidate has something to invalidate by tag.

import { publicFetch } from '@/lib/api/server/fetcher';
import { masterEndpoints, tags, revalidate } from '@/lib/api/endpoints';
import { APP_ORIGIN } from '@/lib/api/config';

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
