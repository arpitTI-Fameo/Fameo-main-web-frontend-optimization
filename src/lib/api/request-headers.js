// lib/api/request-headers.js
// Names of the headers middleware injects onto the request.
//
// Deliberately its own module with no imports: middleware runs in the Edge
// runtime, and pulling in server/context.js would drag `next/headers` and
// `server-only` into the middleware bundle.

export const REQUEST_HEADERS = {
  host: 'x-request-host',
  path: 'x-request-path',
};
