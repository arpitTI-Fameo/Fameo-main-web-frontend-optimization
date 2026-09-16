// utils/relativeTime.js
// Relative-time formatting. Pure, no React, no network.
//
// This replaces eleven hand-written "timeAgo" copies across the Admin modules.
// They were NOT all the same function, which is exactly why this file keeps
// three names instead of merging everything into one:
//
//   timeAgo()         "just now" under a minute   — Approval, ContentOS, Overview
//   timeAgoNumeric()  "0m ago" under a minute     — MediaCenter, ModuleMasters,
//                                                   Notifications, Support
//   daysAgo()         "today"/"yesterday"/"N days ago" — Archive, Contacts
//
// timeAgo and timeAgoNumeric differ by one branch, and that branch is visible
// text in the UI, so both survive exactly as they were written.
//
// Two more copies deliberately did NOT move here, because they are different
// functions that merely shared a name:
//   Admin/Roles/helpers.js  lastSeenAgo() — answers "never" for a missing date
//                           and switches to an absolute date past a week.
//   Community/PostCard      timeAgo()     — returns "" for a missing date;
//                           used in one file, so it stays in that file.
//
// All three take an ISO string and read Date.now(), so all are time-dependent
// by design; none caches or memoises anything.

/** Minutes elapsed since `iso`, floored. Shared by both formatters. */
const minutesSince = (iso) => Math.floor((Date.now() - new Date(iso)) / 60000);

/** "just now" · "5m ago" · "3h ago" · "2d ago" */
export function timeAgo(iso) {
  const d = minutesSince(iso);
  if (d < 1) return "just now";
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
}

/** "0m ago" · "5m ago" · "3h ago" · "2d ago" — never "just now". */
export function timeAgoNumeric(iso) {
  const d = minutesSince(iso);
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
}

/** "today" · "yesterday" · "6 days ago" — whole-day granularity. */
export function daysAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}
