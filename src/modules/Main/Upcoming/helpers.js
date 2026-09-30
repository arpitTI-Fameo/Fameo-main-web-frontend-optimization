// modules/Main/Upcoming/helpers.js

import { ROUTES, withQuery } from '@/constants/routes';

/* /upcoming?source=<key> — a feature's detail page. */
export const featureHref = (key) => withQuery(ROUTES.UPCOMING, { source: key });

/* "Fameo Community · Coming soon" */
export const featureEyebrow = (feature) => `${feature.title} · ${feature.status}`;
