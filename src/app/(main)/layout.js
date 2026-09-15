// app/(main)/layout.js

import MainNav from '@/components/Layout/Navbar';
import SessionWatcher from '@/components/SessionWatcher';
import MainFooter from '@/components/Layout/Footer';
import WelcomeBanner from '@/components/ui/WelcomeBanner';
import { JsonLd, organizationJsonLd } from '@/lib/seo/json-ld';
import { SITE } from '@/lib/seo/metadata';

// Rendered once for the whole public site rather than per page — an
// Organization node repeated on every route is noise, not extra signal.
const organization = organizationJsonLd({
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/og-image.jpg`,
});

export default function MainLayout({ children }) {
  return (
    <>
      <JsonLd data={organization} />
      <SessionWatcher />
      <MainNav />
      <WelcomeBanner />
      {children}
      <MainFooter />
    </>
  );
}