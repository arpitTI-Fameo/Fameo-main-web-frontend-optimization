// tests/proxy.test.js
//
// The BFF proxy is the single place a credential is attached to an outbound
// request, so these are the tests that matter most. Each one pins a property
// that, if it broke, would be invisible in the UI:
//
//   - the caller's Authorization header is IGNORED (otherwise the httpOnly
//     cookie is decorative and anyone can pass their own bearer)
//   - the caller's Cookie header never reaches the upstream
//   - a 401 triggers exactly one refresh, and the retry carries the new token
//   - rate limiting actually refuses

import { describe, it, expect, vi, beforeEach } from 'vitest';

// next/server's NextResponse.json is the only bit the proxy uses.
vi.mock('next/server', () => ({
  NextResponse: class NextResponse extends Response {
    static json(body, init = {}) {
      return new Response(JSON.stringify(body), {
        ...init,
        headers: { 'content-type': 'application/json', ...(init.headers || {}) },
      });
    }
  },
}));

const session = vi.hoisted(() => ({
  token: 'session-token',
  appToken: 'app-token',
  set: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({
  getSessionToken: async () => session.token,
  getAppToken: async () => session.appToken,
  setSessionToken: async (t) => { session.set(t); session.token = t; },
}));

vi.mock('@/lib/api/server/origins', () => ({
  API_ORIGIN: 'https://upstream.test',
  PRODUCTS_ORIGIN: 'https://products.test',
  APP_ORIGIN: 'https://app.test',
}));

const { createProxy } = await import('@/lib/api/server/proxy');

const ctx = (path) => ({ params: Promise.resolve({ path }) });
const ok = (body = { success: true }) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
const unauthorized = () =>
  new Response(JSON.stringify({ message: 'expired' }), { status: 401, headers: { 'content-type': 'application/json' } });

// A fresh IP per test so the module-level rate-limit buckets don't bleed across.
let ip = 0;
const req = (url, init = {}) => new Request(url, {
  ...init,
  headers: { 'x-forwarded-for': `10.0.0.${++ip}`, ...(init.headers || {}) },
});

beforeEach(() => { session.token = 'session-token'; session.set.mockClear(); });

describe('credential attachment', () => {
  it('attaches the session token from the cookie', async () => {
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal('fetch', fetchMock);

    await createProxy('https://upstream.test')(req('https://x.test/api/bff/me'), ctx(['api', 'me']));

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://upstream.test/api/me');
    expect(init.headers.get('authorization')).toBe('Bearer session-token');
  });

  it('IGNORES an Authorization header supplied by the caller', async () => {
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal('fetch', fetchMock);

    await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me', { headers: { authorization: 'Bearer attacker-supplied' } }),
      ctx(['api', 'me']),
    );

    expect(fetchMock.mock.calls[0][1].headers.get('authorization')).toBe('Bearer session-token');
  });

  it('never forwards the caller\'s Cookie header upstream', async () => {
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal('fetch', fetchMock);

    await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me', { headers: { cookie: 'fameo_session=secret' } }),
      ctx(['api', 'me']),
    );

    expect(fetchMock.mock.calls[0][1].headers.get('cookie')).toBeNull();
  });

  it('uses the APP credential when the route asks for it', async () => {
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal('fetch', fetchMock);

    await createProxy('https://app.test', { credential: 'app' })(
      req('https://x.test/api/bff-app/profile'), ctx(['api', 'profile']),
    );

    expect(fetchMock.mock.calls[0][1].headers.get('authorization')).toBe('Bearer app-token');
  });

  it('preserves the query string', async () => {
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal('fetch', fetchMock);

    await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/items?page=2&q=a%20b'), ctx(['api', 'items']),
    );

    expect(fetchMock.mock.calls[0][0]).toBe('https://upstream.test/api/items?page=2&q=a%20b');
  });
});

describe('token refresh on 401', () => {
  it('refreshes once and replays the request with the new token', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(unauthorized())                                  // original
      .mockResolvedValueOnce(ok({ success: true, data: { token: 'fresh' } })) // refresh
      .mockResolvedValueOnce(ok({ success: true, data: 'payload' }));         // replay
    vi.stubGlobal('fetch', fetchMock);

    const res = await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me'), ctx(['api', 'me']),
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(session.set).toHaveBeenCalledWith('fresh');
    expect(fetchMock.mock.calls[2][1].headers.get('authorization')).toBe('Bearer fresh');
  });

  it('gives up and returns the 401 when the refresh itself fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(new Response('no', { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me'), ctx(['api', 'me']),
    );

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not attempt a refresh for the non-refreshable app credential', async () => {
    const fetchMock = vi.fn().mockResolvedValue(unauthorized());
    vi.stubGlobal('fetch', fetchMock);

    const res = await createProxy('https://app.test', { credential: 'app' })(
      req('https://x.test/api/bff-app/me'), ctx(['api', 'me']),
    );

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('responses', () => {
  it('forces no-store so a per-user reply is never shared-cached', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' },
    })));

    const res = await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me'), ctx(['api', 'me']),
    );

    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('answers 502 rather than throwing when the upstream is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ECONNREFUSED'); }));

    const res = await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me'), ctx(['api', 'me']),
    );

    expect(res.status).toBe(502);
  });
});

describe('rate limiting', () => {
  it('refuses with 429 once the window is exhausted', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ok()));
    const proxy = createProxy('https://upstream.test', { rateLimit: { limit: 2, windowMs: 60_000 } });

    // Same IP for all three, so they share a bucket.
    const headers = { 'x-forwarded-for': '198.51.100.7' };
    const call = () => proxy(new Request('https://x.test/api/bff/me', { headers }), ctx(['api', 'me']));

    expect((await call()).status).toBe(200);
    expect((await call()).status).toBe(200);

    const third = await call();
    expect(third.status).toBe(429);
    expect(third.headers.get('retry-after')).toBeTruthy();
  });
});

describe('the upstream cannot reach past the proxy', () => {
  it('strips Set-Cookie so an upstream cannot set cookies on our domain', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie': 'fameo_session=attacker-chosen; Path=/; HttpOnly',
      },
    })));

    const res = await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me'), ctx(['api', 'me']),
    );

    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('does not leak a 5xx body to the browser', async () => {
    const leak = 'Error: connect ECONNREFUSED 10.0.0.5:5432\n  at Connection._handleError';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(leak, {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    })));

    const res = await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/me'), ctx(['api', 'me']),
    );
    const body = await res.text();

    expect(res.status).toBe(500);
    expect(body).not.toContain('ECONNREFUSED');
    expect(body).not.toContain('10.0.0.5');
    expect(body).toContain('The server had a problem');
  });

  it('DOES pass a 4xx body through — those carry validation messages', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify({ success: false, message: 'Email already registered' }),
      { status: 422, headers: { 'content-type': 'application/json' } },
    )));

    const res = await createProxy('https://upstream.test')(
      req('https://x.test/api/bff/register'), ctx(['api', 'register']),
    );

    expect(res.status).toBe(422);
    expect(await res.text()).toContain('Email already registered');
  });
});
