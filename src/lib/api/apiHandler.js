// lib/api/apiHandler.js
// The shared request builder behind createServerAction (lib/api/action.js).
//
// This is the BROWSER transport. It is imported by client hooks, so it cannot
// reach anything marked `server-only` — not even behind a lazy import, because
// Turbopack still pulls it into the Client Component SSR graph.
//
// A Server Component that needs the same data uses a sibling `*.server.js`
// module built on publicFetch/privateFetch, which talks to the upstream
// directly. See services/main/user.server.js for the established shape.

import { clientFetch, clientUpload } from '@/lib/api/client/fetcher';
import { qs } from '@/lib/api/core';

export const sendRequest = async ({
  url,
  body = null,
  params = null,
  method = "GET",
  ...rest
}) => {
  try {
    const config = { method, ...rest };

    if (["PUT", "PATCH", "POST", "DELETE"].includes(method.toUpperCase())) {
      if (body) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
      }
    }

    let finalUrl = url;
    if (params) {
      if (method.toUpperCase() === "GET" && body) {
        // ubantu pattern maps body to params for GET
        finalUrl += qs(body);
      } else {
        finalUrl += qs(params);
      }
    } else if (method.toUpperCase() === "GET" && body) {
      finalUrl += qs(body);
    }

    // NOTE: there is deliberately no `authToken` option any more.
    //
    // It used to set an `Authorization: Bearer …` header, which the BFF now
    // strips — the credential comes from the httpOnly cookie, never from the
    // caller. Leaving the option in place would have been worse than useless:
    // it looked like authentication while doing nothing, so a call site could
    // "add auth" and still get a 401 with no clue why.

    const isFormData = body instanceof FormData;
    const result = isFormData 
      ? await clientUpload(finalUrl, config.body, config)
      : await clientFetch(finalUrl, config);

    return {
      code: true,
      status: 200,
      error: null,
      result: result,
    };
  } catch (err) {
    return {
      code: false,
      status: err?.status || 500,
      error: err?.message || "Failed to fetch",
      serverMessage: err?.serverMessage || "",
      details: err?.details || null,
      fieldErrors: err?.fieldErrors || [],
      result: null,
    };
  }
};
