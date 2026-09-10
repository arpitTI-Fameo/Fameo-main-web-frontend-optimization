// hooks/useWishlist.js
import { useWishlistStore } from '@/store/wishlistStore';
import { userApi }          from '@/lib/api';
import { useAuthStore }     from '@/store/authStore';

export const useWishlist = () => {
  const store    = useWishlistStore();
  const { token }= useAuthStore();

  const toggle = async (product) => {
    // Optimistic update locally
    store.toggle(product);

    // Sync with backend if logged in
    if (token) {
      try {
        await userApi.toggleFavorite(product._id || product.id);
      } catch (_) {
        // Revert on failure
        store.toggle(product);
      }
    }
  };

  return {
    items:     store.items,
    count:     store.count(),
    has:       store.has,
    toggle,
    add:       store.add,
    remove:    store.remove,
  };
};