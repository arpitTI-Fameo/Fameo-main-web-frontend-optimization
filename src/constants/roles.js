// constants/roles.js
//
// The set of roles allowed into /admin.
//
// This list decides authorisation, and it was written out FOUR times: the
// edge middleware's guard (lib/security/jwtEdge.js), the admin login route's
// post-auth check (app/api/auth/admin-login/route.js), the admin layout's
// client-side guard (app/admin/layout.js), and a stale comment pointing at a
// fifth copy that no longer exists. Four copies of an allowlist is four places
// to forget when a role is added — and the failure mode is a role that can
// sign in but gets bounced, or worse, one that slips past a guard that was
// never updated.
//
// Plain strings only, so this stays importable from the edge runtime, a server
// route, and a client component alike.

/** Admin role identifiers, exactly as they appear in the token's `role` claim. */
export const ADMIN_ROLE = {
  SUPER_ADMIN: 'superAdmin',
  CONTENT_MANAGER: 'contentManager',
  MODULE_MASTER: 'moduleMaster',
  SUPPORT_AGENT: 'supportAgent',
};

/**
 * Every role permitted into /admin, in the order the guards listed them.
 * Order is not load-bearing — membership is.
 */
export const ADMIN_ROLES = [
  ADMIN_ROLE.SUPER_ADMIN,
  ADMIN_ROLE.CONTENT_MANAGER,
  ADMIN_ROLE.MODULE_MASTER,
  ADMIN_ROLE.SUPPORT_AGENT,
];

/* ── Capability allowlists ─────────────────────────────────────────────────
   Which roles may do what to content. These were written inline in both
   Admin/ContentOS and Admin/Overview — two independent modules deriving the
   same permission flags from their own copy of the list. Add a role to one
   and the other silently keeps denying it.

   Listed explicitly rather than derived by subtracting a role from
   ADMIN_ROLES: a permission set that is defined by what it excludes is one
   refactor away from quietly granting something.
   ------------------------------------------------------------------------ */

/** May create and edit topics. */
export const CONTENT_AUTHOR_ROLES = [
  ADMIN_ROLE.SUPER_ADMIN,
  ADMIN_ROLE.CONTENT_MANAGER,
  ADMIN_ROLE.MODULE_MASTER,
];

/** May publish, archive and approve topics. */
export const CONTENT_APPROVER_ROLES = [
  ADMIN_ROLE.SUPER_ADMIN,
  ADMIN_ROLE.CONTENT_MANAGER,
];
