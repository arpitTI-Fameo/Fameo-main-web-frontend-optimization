// app/admin/layout.js
// Server-side role gate for the whole admin panel, then the client guard and
// shell. Composition only — the check lives in lib/auth/entitlement.js.
//
// The gate runs here, above the Client Component, so a non-admin gets a real
// redirect before anything renders.

import AdminGuard from '@/components/Layout/AdminGuard';
import { requireAdminRole } from '@/lib/auth/entitlement';

export default async function AdminLayout({ children }) {
  await requireAdminRole();
  return <AdminGuard>{children}</AdminGuard>;
}
