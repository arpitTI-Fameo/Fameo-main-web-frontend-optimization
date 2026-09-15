import Brands from '@/modules/Main/Products/Brands';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Shop by Brand',
  description:
    'Browse creator gear by brand on Fameo.',
  path: '/products/brand',
});

export default function BrandsPage() {
  return <Brands />;
}
