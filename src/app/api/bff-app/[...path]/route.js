// app/api/bff-app/[...path]/route.js
// BFF for the "app" backend that the registration flow uses.
//
// Registration is unauthenticated, so this proxy is not here to attach a token
// (createProxy attaches one only if a session exists). It is here so the
// upstream origin stops shipping in the client bundle, and so every register
// call shares one error path with the rest of the API layer.

import { APP_ORIGIN } from '@/lib/api/config';
import { createProxy } from '@/lib/api/server/proxy';

const proxy = createProxy(APP_ORIGIN);

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export const dynamic = 'force-dynamic';
