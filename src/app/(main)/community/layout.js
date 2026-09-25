// app/(main)/community/layout.js
// Paid-tier gate. Composition only — see lib/auth/entitlement.js.

import { requirePaidPlan } from '@/lib/auth/entitlement';

export default async function CommunityLayout({ children }) {
  await requirePaidPlan();
  return children;
}
