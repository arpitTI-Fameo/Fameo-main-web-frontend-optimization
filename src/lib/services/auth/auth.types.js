// services/auth/auth.types.js
// Shared shapes — the drift guard.
//
// The reference guide uses TypeScript interfaces. This codebase is JavaScript,
// so these are JSDoc typedefs: no compile-time enforcement, but editors get
// autocomplete and there is still ONE written definition of each shape rather
// than a guess at every call site.

/**
 * @typedef {Object} AuthUser
 * @property {string}  [_id]
 * @property {string}  [id]
 * @property {string}  [name]
 * @property {string}  [username]
 * @property {string}  [email]
 * @property {string}  [role]
 * @property {{ type?: string }} [membership]
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} username
 * @property {string} password
 */

/**
 * What POST /api/auth/login (our route, not upstream) returns.
 * Note: no token. It is in an httpOnly cookie by design.
 * @typedef {Object} LoginResult
 * @property {AuthUser|null} user
 * @property {string|null}   appToken  legacy, remove after Phase 4
 */

export {};
