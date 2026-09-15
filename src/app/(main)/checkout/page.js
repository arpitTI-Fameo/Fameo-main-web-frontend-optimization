import Checkout from '@/modules/Main/Checkout';
import { getAddressesServerAction } from '@/lib/services/main/user.server';

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Checkout',
  path: '/checkout',
  noIndex: true,
});

export default async function CheckoutPage() {
  const addresses = await getAddressesServerAction().catch(() => null);
  return <Checkout initialAddresses={addresses} />;
}
