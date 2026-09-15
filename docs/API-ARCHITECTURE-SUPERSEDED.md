# API Architecture & Implementation Guide — SUPERSEDED

> **Do not follow this document.** It is kept only as a record.
>
> This is the "before" state that `docs/API-ARCHITECTURE.md` exists to fix. Its
> defect table lists these exact patterns as the things to remove: axios on the
> server (#5), `getClientToken` (#4), `response.headers.set()` in middleware
> (#2), a `['users']` prefetch key against a `['users', params]` hook key (#6),
> `throw` inside `onSuccess` (#8), `string[]` invalidation keys (#9),
> `if (response.code)` (#10) and flat endpoint enums (#12).
>
> It also predates this codebase being JavaScript — the samples are TypeScript.

This document outlines the API architecture adapted for a **single-repo Next.js application** (web-only). It incorporates best practices for server-side prefetching, secure token management, middleware ID injection, consistent enumerations, error handling, and robust TanStack integrations.

## 1. Directory Structure (Web-Only)

Since this is not a monorepo, everything will reside inside your Next.js `src` directory under `services/` or `lib/`.

```text
src/
└── services/
    ├── api/
    │   ├── auth/
    │   │   ├── auth.api.ts      # API actions (fetch/axios calls)
    │   │   └── auth.hooks.ts    # Tanstack Query Hooks
    │   ├── product/
    │   │   ├── product.api.ts
    │   │   └── product.hooks.ts
    ├── shared/
    │   ├── apiEndpoints.ts      # Enums for URLs & Methods
    │   ├── apiHandler.ts        # Core Axios/Fetch wrapper
    │   ├── errorService.ts      # Standardized error handling & toasts
    │   ├── interceptors.ts      # Axios interceptors (Auth & Error parsing)
    │   └── http.ts              # Axios instance configuration
    ├── hooks/
    │   └── useGenericMutation.ts # Reusable mutation wrapper
    └── utils/
        ├── action.ts            # Generic API wrapper (createServerAction)
        └── authUtils.ts         # Token extractors (Server & Client)
```

## 2. Enums for Consistency

To maintain absolute consistency, avoid hardcoding URLs or HTTP methods. Maintain strict enumerations for everything.

### `shared/apiEndpoints.ts`
```typescript
export enum MethodTypesEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum API_ENDPOINTS {
  // Auth
  USER_LOGIN = "/v1/auth/user/login",
  USER_SIGNUP = "/v1/auth/user/signup",
  
  // Users
  GET_ALL_USERS = "/v1/user/get-all-users",
  CREATE_USER = "/v1/user/create-user",
  UPDATE_USER = "/v1/auth/user/update-user",
  
  // Products
  GET_PRODUCTS = "/v1/products",
}
```

## 3. Secure Token Management & Server-Side Execution

Instead of `js-cookie` (client-side), store the token securely in **HTTP-only cookies**. 

### `utils/authUtils.ts` (Next.js App Router)
```typescript
import { cookies } from "next/headers";
import { getCookie } from "cookies-next"; 

export const getServerToken = () => {
  try {
    const cookieStore = cookies();
    return cookieStore.get("UBT_USER_TOKEN")?.value;
  } catch (error) {
    return null; 
  }
};

export const getClientToken = () => {
  return getCookie("UBT_USER_TOKEN");
};
```

## 4. Axios Setup & Interceptors

For robust error handling and token injection, configure Axios interceptors. This ensures every request—client or server—automatically picks up the right tokens and gracefully catches errors.

### `shared/interceptors.ts`
```typescript
import axios from "axios";
import { getServerToken, getClientToken } from "../utils/authUtils";
import { ErrorService } from "./errorService";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request Interceptor
http.interceptors.request.use(async (config) => {
  const isServer = typeof window === "undefined";
  const token = isServer ? getServerToken() : getClientToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Attach middleware injected headers if on server
  if (isServer) {
    const { headers } = await import("next/headers");
    const storeId = headers().get("x-store-id");
    if (storeId) config.headers["x-store-id"] = storeId;
  }

  return config;
});

// Response Interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const isServer = typeof window === "undefined";
    
    // Global Error Handling
    if (!isServer && error.response) {
      if (error.response.status === 401) {
        ErrorService.sendErrorMessage("Session expired. Please log in.");
        // optionally trigger logout
      }
    }
    
    return Promise.reject(error);
  }
);
```

## 5. Middleware for Dynamic IDs
Pass multiple IDs (e.g., Tenant ID, Store ID) via middleware.

### `middleware.ts` (Next.js Root)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const storeId = request.cookies.get('store-id')?.value || 'default-store';
  const tenantId = request.headers.get('x-tenant-id') || 'default-tenant';

  response.headers.set('x-store-id', storeId);
  response.headers.set('x-tenant-id', tenantId);

  return response;
}
```

## 6. TanStack Query: Mutations, Queries & Prefetching

### Naming Conventions
- **API Actions**: `[actionName]Action`
- **Query Hooks**: `use[QueryName]`
- **Mutation Hooks**: `use[ActionName]Mutation`

### Generic Mutation (`hooks/useGenericMutation.ts`)
For `POST`, `PUT`, `PATCH`, `DELETE` operations, rely on `useGenericMutation` to keep your code DRY.

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorService } from "../shared/errorService";

export function useGenericMutation<T>(
  mutationFn: (...args: any[]) => Promise<any>,
  queryKeysToInvalidate: string[]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (response) => {
      if (response.code) {
        // Automatically refresh queries dependent on this data
        queryClient.invalidateQueries({ queryKey: queryKeysToInvalidate });
      } else {
        ErrorService.handleResponse(response);
        throw response;
      }
    },
    onError: (error) => {
      // Handled by the interceptor or ErrorService, but can add custom UI logic here
      ErrorService.handleError(error);
    }
  });
}
```

### Hook Implementations (`auth.hooks.ts`)
```typescript
import { useQuery } from "@tanstack/react-query";
import { useGenericMutation } from "../hooks/useGenericMutation";
import { getAllUsersAction, createUserAction } from "./auth.api";

// GET - Query
export const useGetAllUsers = (params: any) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await getAllUsersAction(params);
      if (!response.code) throw response;
      return response.result;
    },
  });
};

// POST/PUT/DELETE - Mutation
export const useCreateUserMutation = () => {
  // Pass the action and the query key to invalidate ("users")
  return useGenericMutation(createUserAction, ["users"]);
};
```

### Server-Side Prefetching Example (`page.tsx`)
```tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAllUsersAction } from '@/services/api/auth/auth.api';

export default async function UsersPage() {
  const queryClient = new QueryClient();

  // Prefetch on the server (Uses HTTP-only cookies automatically via Interceptors)
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsersAction({ /* params */ }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClientComponent />
    </HydrationBoundary>
  );
}
```

## 7. Comprehensive Error Handling (`ErrorService`)
The `ErrorService` acts as the bridge between raw API responses and User-facing UI.

1. **Server Side (`isServer = true`)**: Suppress all toast notifications. Structure the error and return it so Server Components can decide to render Error boundaries or fallback UI.
2. **Client Side (`isServer = false`)**: Invoke `react-toastify` for validation errors (`400`), unauthorized (`401`), and server faults (`500`). 
3. **Interceptors**: Use the Axios response interceptor for catastrophic global errors (like a forcibly expired token), leaving `ErrorService` to handle domain-level messaging returned by your API structure (e.g. `response.data.message`).
