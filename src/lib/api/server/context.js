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

  // `host` comes from the real Host header, NOT from x-request-host.
  //
  // Middleware overwrites x-request-host with headers.set(), but middleware
  // only runs on the paths in its matcher. On any other route ("/", "/plans",
  // "/support", every /api route) nothing overwrites it, so a caller can send
  // `x-request-host: evil.example` and have it read back here verbatim. That
  // is harmless while getTenantId() returns a constant and becomes tenant
  // spoofing the moment it does not — which is exactly the kind of latent trap
  // worth removing before someone builds on it.
  //
  // The Host header is set by the platform from the request line and is what
  // the TLS/vhost layer already routed on.
  return {
    host: h.get('host') ?? h.get(REQUEST_HEADERS.host),
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
