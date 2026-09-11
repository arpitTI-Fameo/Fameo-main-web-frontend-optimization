// services/register/register.types.js
// Shared shapes for the registration flow — the drift guard.
//
// JSDoc rather than TypeScript interfaces, matching the rest of this codebase.

/**
 * @typedef {Object} MasterState
 * @property {number|string} [id]
 * @property {number|string} [state_id]
 * @property {string} [name]
 * @property {string} [state_name]
 */

/**
 * @typedef {Object} MasterCity
 * @property {number|string} [id]
 * @property {string} [name]
 * @property {string} [city_name]
 */

/**
 * @typedef {Object} MasterCategory
 * @property {string} [code]
 * @property {string} [category_code]
 * @property {string} [name]
 */

/**
 * @typedef {Object} MasterProfession
 * @property {number|string} [id]
 * @property {string} [code]
 * @property {string} [name]
 */

/**
 * Resolved pincode. Normalised here because the endpoint answers with either
 * `state`/`state_name` and `district`/`city`/`city_name` depending on the row.
 * @typedef {Object} PincodeMatch
 * @property {string} state
 * @property {string} district
 * @property {string} area
 */

export {};
