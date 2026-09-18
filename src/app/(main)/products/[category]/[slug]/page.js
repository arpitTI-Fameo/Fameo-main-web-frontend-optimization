import ProductDetails from '@/modules/Main/Products/ProductDetails';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Product',
  description:
    'Full specifications, dimensions, materials and customer reviews for every piece of gear in the Fameo store.',
  path: '/products',
});

export default function ProductDetailPage() {
  return <ProductDetails />;
}
