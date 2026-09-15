// lib/seo/metadata.js
// One place that builds a page's metadata, so every public route gets a
// canonical without each one remembering to.
//
// Why canonicals matter here: /products, /products?category=x and
// /products?sort=y are the same page to a user and three URLs to a crawler.
// Without a canonical the crawl budget is split across duplicates and none of
// them ranks as well as the one page would have.

export const SITE = {
  name: 'Fameo',
  url: 'https://fameo.vip',
  twitter: '@fameo',
};

/**
 * @param {object} opts
 * @param {string} opts.title        page title (the root template appends "| Fameo")
 * @param {string} [opts.description]
 * @param {string} opts.path         route path, e.g. '/products'
 * @param {string} [opts.image]      OG image, resolved against metadataBase
 * @param {boolean} [opts.noIndex]   true for private / transactional pages
 * @returns {import('next').Metadata}
 */
export function buildMetadata({ title, description, path, image, noIndex = false }) {
  const canonical = path === '/' ? '/' : path.replace(/\/$/, '');

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      url: canonical,
      siteName: SITE.name,
      type: 'website',
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : {}),
      ...(image ? { images: [image] } : {}),
    },
  };
}
