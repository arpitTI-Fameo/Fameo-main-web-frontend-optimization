// hooks/useWishlist.js
import { useWishlistStore } from '@/store/wishlistStore';
import { clientFetch }      from '@/lib/api/client/fetcher';
import { userEndpoints }    from '@/lib/api/endpoints';
import { useAuthStore }     from '@/store/authStore';

export const useWishlist = () => {
  const store    = useWishlistStore();
  // Signed-in check now comes from `user`; the token is httpOnly.
  const user     = useAuthStore((s) => s.user);

  const toggle = async (product) => {
    // Optimistic update locally
    store.toggle(product);

    // Sync with backend if logged in
    if (user) {
      try {
        await clientFetch(userEndpoints.toggleFavorite(product._id || product.id), { method: 'POST' });
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