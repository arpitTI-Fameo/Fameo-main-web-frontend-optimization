// Route: /cart

import Cart from '@/modules/Main/Cart';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Cart',
  path: '/cart',
  noIndex: true,
});

export default function CartPage() {
  return <Cart />;
}
