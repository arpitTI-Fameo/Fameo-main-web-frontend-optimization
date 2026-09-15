// tests/seo.test.js
import { describe, it, expect } from 'vitest';

import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo/json-ld';

describe('buildMetadata', () => {
  it('always sets a canonical', () => {
    expect(buildMetadata({ title: 'T', path: '/products' }).alternates.canonical)
      .toBe('/products');
  });

  it('strips a trailing slash so /x and /x/ do not become two canonicals', () => {
    expect(buildMetadata({ title: 'T', path: '/products/' }).alternates.canonical)
      .toBe('/products');
  });

  it('leaves the root path alone', () => {
    expect(buildMetadata({ title: 'T', path: '/' }).alternates.canonical).toBe('/');
  });

  it('marks a page noindex only when asked', () => {
    expect(buildMetadata({ title: 'Cart', path: '/cart', noIndex: true }).robots)
      .toEqual({ index: false, follow: false });
    expect(buildMetadata({ title: 'Products', path: '/products' }).robots).toBeUndefined();
  });

  it('mirrors the title into OpenGraph and Twitter', () => {
    const m = buildMetadata({ title: 'Products', description: 'd', path: '/products' });
    expect(m.openGraph.title).toBe('Products');
    expect(m.twitter.title).toBe('Products');
    expect(m.twitter.card).toBe('summary_large_image');
  });
});

describe('json-ld', () => {
  it('numbers breadcrumb positions from 1', () => {
    const b = breadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
    ]);
    expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  it('omits the offer entirely when there is no price', () => {
    expect(productJsonLd({ name: 'X' })).not.toHaveProperty('offers');
  });

  it('serialises a price of 0 rather than dropping it as falsy', () => {
    expect(productJsonLd({ name: 'X', price: 0 }).offers.price).toBe('0');
  });
});

describe('sitemap and robots follow the auth gate', () => {
  it('the sitemap never advertises a route that redirects to /login', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const { GATED_ROUTES, matchesRoute } = await import('@/lib/auth/gated-routes');

    const paths = sitemap().map((e) => new URL(e.url).pathname);
    const gated = paths.filter((p) => matchesRoute(p, GATED_ROUTES));

    expect(gated).toEqual([]);
    // Guard against the filter silently emptying the sitemap entirely.
    expect(paths).toContain('/');
  });

  it('robots disallows every gated route', async () => {
    const { default: robots } = await import('@/app/robots');
    const { GATED_ROUTES } = await import('@/lib/auth/gated-routes');

    const { disallow } = robots().rules[0];
    for (const route of GATED_ROUTES) expect(disallow).toContain(route);
    expect(disallow).toContain('/api/');
  });
});
