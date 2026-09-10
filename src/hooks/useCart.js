// hooks/useCart.js
import { useCartStore }  from '@/store/cartStore';
import { useUIStore }    from '@/store/uiStore';

export const useCart = () => {
  const store          = useCartStore();
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  const addToCartAndOpen = (product, qty = 1) => {
    store.addToCart(product, qty);
    openCartDrawer();
  };

  return {
    cartItems:         store.cartItems,
    cartCount:         store.cartCount(),
    cartTotal:         store.cartTotal(),
    addToCart:         store.addToCart,
    addToCartAndOpen,  // use this for "Add to Bag" buttons
    updateQty:         store.updateQty,
    removeFromCart:    store.removeFromCart,
    clearCart:         store.clearCart,
  };
};