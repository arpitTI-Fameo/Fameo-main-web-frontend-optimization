import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Products from '@/modules/Main/Products';
import { buildMetadata } from '@/lib/seo/metadata';
import { fameoProductsKeys } from '@/lib/hooks/main/useProduct';
import { getStorefrontProductsServer } from '@/lib/services/main/prefetch.server';

export const metadata = buildMetadata({
  title: 'Products',
  description:
    'Premium gear and equipment curated for creators — cameras, audio, lighting and studio essentials.',
  path: '/products',
});

export default async function ProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: fameoProductsKeys.storefrontProducts(),
    queryFn: () => getStorefrontProductsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Products />
    </HydrationBoundary>
  );
}
