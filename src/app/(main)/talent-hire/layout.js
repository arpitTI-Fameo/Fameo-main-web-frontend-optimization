// app/(main)/talent-hire/layout.js
// Paid-tier gate. Composition only — see lib/auth/entitlement.js.

import { requirePaidPlan } from '@/lib/auth/entitlement';

export default async function TalentHireLayout({ children }) {
  await requirePaidPlan();
  return children;
}
