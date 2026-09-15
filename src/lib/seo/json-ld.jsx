// lib/seo/json-ld.jsx
// Structured data. Rendered as a <script type="application/ld+json"> so it is
// invisible to users and legible to crawlers.
//
// JSON.stringify is the escaping story: the payload is serialised data, never
// interpolated markup, and the `</script>` sequence is neutralised below so a
// product name containing it cannot break out of the tag.

const serialize = (data) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

export function organizationJsonLd({ name, url, logo, sameAs = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd({ name, description, image, price, currency = 'INR', availability, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: String(price),
            priceCurrency: currency,
            ...(availability ? { availability } : {}),
            ...(url ? { url } : {}),
          },
        }
      : {}),
  };
}
