import ProductsSubNav from '@/modules/Products/ProductsSubNav';
import CartDrawer from '@/modules/Cart/CartDrawer';
import CartToast from '@/modules/Cart/CartToast';

export default function ProductsLayout({ children }) {
  return (
    <>
      <ProductsSubNav />
      {/* CartDrawer was already mounted here but nothing ever called
          openCartDrawer(), so it never appeared. CartToast is the confirmation
          layer that was missing entirely — uiStore.showToast() had no renderer
          on the storefront. */}
      <CartDrawer />
      <CartToast />
      {children}
    </>
  );
}