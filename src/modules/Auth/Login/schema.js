// Form-input contract for the login card.
//
// This is NOT a response schema — those live in @/lib/api/schemas. This one
// describes what the USER may submit, and it is the single source of both the
// validation rules and the inferred value shape.
//
// The message is identical on both fields on purpose: the card renders ONE
// error line (.lg-error), and the behaviour it replaces set a single combined
// string ("Username and password are required") whenever either field was
// empty. Same rule, same copy, same place on screen.

import { z } from 'zod';

export const LOGIN_REQUIRED_MESSAGE = 'Username and password are required';

export const loginSchema = z.object({
  username: z.string().min(1, LOGIN_REQUIRED_MESSAGE),
  password: z.string().min(1, LOGIN_REQUIRED_MESSAGE),
});

/** @typedef {z.infer<typeof loginSchema>} LoginValues */

/** Values the form starts with — also the shape posted to /api/auth/login. */
/** @type {LoginValues} */
export const LOGIN_DEFAULT_VALUES = { username: '', password: '' };
