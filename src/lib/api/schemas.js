// lib/api/schemas.js
// Response contracts for the endpoints whose shape the app actually depends on.
//
// ── The one rule ─────────────────────────────────────────────────────────────
// Every object schema here MUST be loose (z.looseObject, never z.object).
//
// z.object STRIPS unknown keys. Parsing a real response through a strict schema
// would silently delete every field the schema does not name — a component
// reading `user.avatarUrl` would get undefined because the schema forgot to
// list it, and nothing would report an error. That is a data-loss bug wearing a
// validation costume.
//
// So: assert what the code CONSUMES, pass through everything else. A schema
// here is a description of our requirements, not of the backend's output.
//
// See lib/api/core.js for the strict-in-dev / warn-in-prod policy.

import { z } from 'zod';

/** Loose object. Use this instead of z.object everywhere in this file. */
const obj = z.looseObject;

// ── Primitives ───────────────────────────────────────────────────────────────

/** Backends disagree on _id vs id; both are optional so neither is load-bearing. */
const identifier = z.union([z.string(), z.number()]);

// ── Auth ─────────────────────────────────────────────────────────────────────

export const userSchema = obj({
  _id: identifier.optional(),
  id: identifier.optional(),
  email: z.string().optional(),
  role: z.string().optional(),
});

/** POST /api/auth/login — what the BROWSER receives from our own route. */
export const loginResponseSchema = obj({
  user: userSchema.nullable().optional(),
});

/** The upstream app-login envelope, read server-side in the login route. */
export const upstreamLoginSchema = obj({
  token: z.string().min(1, 'upstream returned no session token'),
  user: userSchema,
  appToken: z.string().nullable().optional(),
});

// ── Master / reference data ──────────────────────────────────────────────────
// Registration renders these as <select> options. An array is the only thing
// the UI can actually iterate, so that IS the contract.

export const masterListSchema = z.array(z.unknown());

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Wrap a schema so a null/absent payload is allowed through.
 *
 * Several endpoints legitimately answer `{ success: true, data: null }` for an
 * empty result, and that must not read as a contract violation.
 */
export const nullable = (schema) => schema.nullable().optional();

export { obj as looseObject };
