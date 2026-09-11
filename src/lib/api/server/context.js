import 'server-only';
// lib/api/server/context.js
// Reads the headers middleware injected onto the REQUEST (not the response).
//
// Defect #2: setting headers on the response makes them visible to the browser
// but invisible to Server Components. Middleware now forwards them on the
// request via NextResponse.next({ request: { headers } }), and this is where
// they are read back.

import { headers } from 'next/headers';

import { REQUEST_HEADERS } from '../request-headers';

export { REQUEST_HEADERS };

/**
 * @returns {Promise<{ host: string|null, path: string|null }>}
 */
export async function getRequestContext() {
  const h = await headers();
  return {
    host: h.get(REQUEST_HEADERS.host),
    path: h.get(REQUEST_HEADERS.path),
  };
}

/**
 * Tenant resolution, derived from HOST — never from a client-supplied
 * `x-tenant-id` header, which any caller can forge (defect #3).
 *
 * Fameo is currently single-tenant, so this returns a constant. It exists as
 * the seam: when tenants arrive, map host → tenant here and nothing else
 * changes.
 */
export async function getTenantId() {
  const { host } = await getRequestContext();
  if (!host) return 'fameo';
  return 'fameo';
}
