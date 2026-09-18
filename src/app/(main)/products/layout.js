// import ProductsSubNav from '@/modules/Main/Products/ProductsSubNav';
import CartDrawer from '@/modules/Main/Cart/CartDrawer';
import CartToast from '@/modules/Main/Cart/CartToast';

export default function ProductsLayout({ children }) {
  return (
    <>
      {/* <ProductsSubNav /> */}
      <CartDrawer />
      <CartToast />
      {children}
    </>
  );
}