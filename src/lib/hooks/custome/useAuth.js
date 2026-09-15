// hooks/useAuth.js
// Thin wrapper around authStore — use this in components
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { logoutRequest as logout } from '@/lib/services/auth/auth.api';
import { ROUTES } from '@/constants/routes';

export const useAuth = () => {
  const router = useRouter();
  const store = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  return {
    user: store.user,
    token: store.token,
    isLoggedIn: !!store.token,
    isCreator: store.user?.role === 'creator',
    isBrand: store.user?.role === 'brand',
    isAdmin: store.user?.role === 'admin',
    membership: store.user?.membership?.type || 'free',
    isVerified: store.user?.isVerified || false,
    logout: handleLogout,
    setUser: store.setUser,
  };
};