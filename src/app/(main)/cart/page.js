// Route: /cart

import Cart from '@/modules/Main/Cart';

import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Cart',
  path: ROUTES.CART,
  noIndex: true,
});

export default function CartPage() {
  return <Cart />;
}
