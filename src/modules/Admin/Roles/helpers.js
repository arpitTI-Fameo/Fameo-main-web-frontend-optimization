// modules/Admin/Roles/helpers.js

import { DEFAULT_LOCALE } from '@/constants/locale';

/* Not the shared formatter: this one answers "never" for a missing date and
   switches to an absolute date past a week, which is what a last-seen column
   needs. Renamed off `timeAgo` so the difference is visible at the call site. */
export function lastSeenAgo(iso) {
  if (!iso) return "never";
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now";
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  if (d < 10080) return `${Math.floor(d / 1440)}d ago`;
  return new Date(iso).toLocaleDateString(DEFAULT_LOCALE);
}
