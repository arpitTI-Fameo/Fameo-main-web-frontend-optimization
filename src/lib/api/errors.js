// lib/api/errors.js
// One error type for the whole API layer.
//
// Services throw; they never swallow. Server Components route this to
// error.tsx, TanStack routes it to `error`, and the UI decides what to show by
// calling toUserMessage(). Catching here is what produced the original
// `try { ... } catch { return null }` pattern this migration removes.

export class ApiError extends Error {
  /**
   * @param {string} message  raw message, usually from the API envelope
   * @param {object} [opts]
   * @param {number} [opts.status]   HTTP status, 0 for network/timeout
   * @param {string} [opts.code]     backend error code, when present
   * @param {unknown} [opts.details] parsed body, for debugging
   * @param {string} [opts.url]      request URL, for logging
   * @param {Array}  [opts.fieldErrors]   per-field validation errors (422)
   * @param {string} [opts.serverMessage] the backend's own message, verbatim
   */
  constructor(message, {
    status = 0, code, details, url, fieldErrors = [], serverMessage = '',
  } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.url = url;
    // The registration backend nests 422 details three levels down and only
    // ever puts "Request validation failed" in `message`, which names no field.
    // Callers need the list, so it is a first-class property rather than
    // something every call site re-digs out of `details`.
    this.fieldErrors = fieldErrors;
    this.serverMessage = serverMessage;
  }

  get isValidation() { return this.status === 422 || this.status === 400; }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden()    { return this.status === 403; }
  get isNotFound()     { return this.status === 404; }
  get isTimeout()      { return this.code === 'TIMEOUT'; }
  get isNetwork()      { return this.status === 0; }
}

/**
 * Map an unknown thrown value to something safe to render.
 * Never leaks a stack trace or an internal 500 message to the user.
 */
export function toUserMessage(error) {
  if (!(error instanceof ApiError)) {
    return 'Something went wrong. Please try again.';
  }
  if (error.isTimeout) return 'That took too long. Please try again.';
  if (error.isNetwork) return 'Cannot reach the server. Check your connection.';
  if (error.status === 401) return 'Your session has expired. Please sign in again.';
  if (error.status === 403) return "You don't have access to that.";
  if (error.status === 404) return 'Not found.';
  if (error.status === 422 || error.status === 400) {
    // Validation messages come from our own backend and are safe to surface.
    return error.message || 'Please check the details you entered.';
  }
  if (error.status >= 500) return 'The server had a problem. Please try again shortly.';
  return error.message || 'Something went wrong. Please try again.';
}
