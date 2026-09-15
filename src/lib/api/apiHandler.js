import { clientFetch } from '@/lib/api/client/fetcher';
import { qs } from '@/lib/api/core';

export const sendRequest = async ({
  url,
  body = null,
  authToken = null,
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

    if (authToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }

    const result = await clientFetch(finalUrl, config);
    
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
      result: null,
    };
  }
};
