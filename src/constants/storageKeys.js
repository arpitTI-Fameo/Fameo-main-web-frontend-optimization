// constants/storageKeys.js
//
// Web-storage keys that more than one file reads or writes.
//
// A storage key is an identifier shared between whoever writes it and whoever
// reads it, and those two are usually in different layers — the login page
// writes `fameo_just_logged_in`, a banner component three folders away reads
// it. Spelled as literals, the pair drifts apart in total silence: the reader
// simply gets null forever and the feature quietly stops working.
//
// Only genuinely shared keys live here. A key used by exactly one file stays
// in that file — `fameo_onboarded` (Community) and `fameo_saved_addresses`
// (Checkout) are deliberately NOT listed.
//
// These are NOT cookie names. The session cookies live in lib/api/config.js
// (SESSION_COOKIE / LEGACY_SESSION_COOKIE / APP_SESSION_COOKIE) and are set
// server-side with httpOnly. `LEGACY_TOKEN` below happens to share its spelling
// with LEGACY_SESSION_COOKIE because both date from the build that kept one
// token in both places; they are cleaned up independently and are not the
// same storage.

export const STORAGE_KEYS = {
  /** sessionStorage — the user OBJECT (never a credential), read by the socket
   *  hooks to build their handshake payload. */
  USER: 'fameo_user',

  /** sessionStorage — one-shot flag telling the next page to show the welcome
   *  banner. Written at login, read and cleared by the banner. */
  JUST_LOGGED_IN: 'fameo_just_logged_in',

  /** localStorage — cached avatar URL. Used bare for an unknown user and as a
   *  `${PROFILE_PHOTO}:${id}` prefix once the user is known. */
  PROFILE_PHOTO: 'fameo_profile_photo',

  /** localStorage — pre-migration credentials. Nothing writes these any more;
   *  they are only ever removed, so an upgrade cannot leave a readable token
   *  behind for something still looking for one. */
  LEGACY_TOKEN: 'fameo_token',
  LEGACY_REFRESH: 'fameo_refresh',
};
