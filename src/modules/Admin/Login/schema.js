// Form-input contract for the admin sign-in card.
//
// The card validated through HTML attributes only — `required` on both fields
// and `type="email"` on the first. Those attributes STAY on the inputs; this
// schema restates the same two rules so the values are checked in one place
// and the submit handler receives a validated payload.
//
// ── Why the regex instead of z.email() ───────────────────────────────────────
// z.email() requires a dot and a TLD, so it rejects addresses the browser
// accepts (`root@localhost`, `admin@intranet`). That would block a sign-in that
// works today — the schema would be stricter than the attribute it mirrors.
// EMAIL_PATTERN below is the WHATWG "valid e-mail address" production, which is
// precisely what type="email" enforces, so the browser and zod agree and
// neither can reject what the other allows.

import { z } from 'zod';

/** WHATWG valid-email production — the rule behind input[type=email]. */
export const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const ADMIN_LOGIN_REQUIRED_MESSAGE = 'Email and password are required';

/* One message for both required rules: the card renders a single error line
   (S.err), the same slot the auth store's error uses. */
export const adminLoginSchema = z.looseObject({
  email: z.string()
    .min(1, ADMIN_LOGIN_REQUIRED_MESSAGE)
    .refine((v) => !v || EMAIL_PATTERN.test(v), 'Enter a valid email address'),
  password: z.string().min(1, ADMIN_LOGIN_REQUIRED_MESSAGE),
});

/** @typedef {z.infer<typeof adminLoginSchema>} AdminLoginValues */

/** @type {AdminLoginValues} */
export const ADMIN_LOGIN_DEFAULT_VALUES = { email: '', password: '' };
