// // app/(main)/products/layout.js
// import ProductsSubNav from '@/components/navbar/ProductsSubNav';

// export default function ProductsLayout({ children }) {
//   return (
//     <>
//       <ProductsSubNav />
//       {children}
//     </>
//   );
// }

// import ProductsSubNav from '@/components/navbar/ProductsSubNav';
// import CartDrawer     from '@/components/cart/CartDrawer';

// export default function ProductsLayout({ children }) {
//   return (
//     <>
//       <ProductsSubNav />
//       <CartDrawer />
//       {children}
//     </>
//   );
// }
import ProductsSubNav from '@/components/navbar/ProductsSubNav';
import CartDrawer     from '@/components/cart/CartDrawer';
import CartToast      from '@/components/cart/CartToast';

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