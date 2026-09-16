// Form-input contract for the support request form.
//
// It replaces a hand-rolled validate() that returned ONE message at a time, in
// field order, into a single .sc-error line. The schema keeps that exactly:
// the messages are unchanged, and firstSupportError() picks the same one the
// old early-return ladder would have picked.
//
// The object is loose on purpose. zodResolver hands its parsed output back to
// React Hook Form as the submitted values, and the EmailJS payload is built
// from them — a z.object would silently drop any field added to the form but
// not named here, and the message would go out missing a section with no error
// anywhere. Same rule as lib/api/schemas.js, for the same reason.
//
// `website` is the honeypot. It is deliberately NOT validated: a bot filling it
// must be ignored in silence, not told it failed, so that check stays in the
// submit handler ahead of validation, exactly where it was.

import { z } from 'zod';

/** The form's own loose email rule — unchanged from the original validate(). */
export const SUPPORT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const supportSchema = z.looseObject({
  // .refine over .trim(): .trim() is a transform, and the values that come back
  // from the resolver are what gets emailed. Nothing may rewrite the message a
  // user typed.
  name: z.string().refine((v) => v.trim().length > 0, 'Please enter your name.'),
  email: z.string().refine((v) => SUPPORT_EMAIL_PATTERN.test(v), 'Please enter a valid email address.'),
  message: z.string().refine((v) => v.trim().length > 0, 'Please describe how we can help.'),
});

/** @typedef {z.infer<typeof supportSchema>} SupportValues */

/** The order validate() checked in — the first failure is the one shown. */
export const SUPPORT_ERROR_ORDER = ['name', 'email', 'message'];

/** First failing field's message, or '' when the form is clean. */
export function firstSupportError(errors) {
  for (const key of SUPPORT_ERROR_ORDER) {
    if (errors[key]?.message) return errors[key].message;
  }
  return '';
}
