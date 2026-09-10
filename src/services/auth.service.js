// services/auth.service.js
// Maps to backend: /api/auth/*
// Used by: (auth)/login, (auth)/register, (auth)/otp pages

import { authApi }        from '@/lib/api';
import { useAuthStore }   from '@/store/authStore';

// ─── Register new user ────────────────────────────────────────────────────────
// Called from: register/page.js
export const register = async ({ name, email, password, phone, role }) => {
  const res = await authApi.register({ name, email, password, phone, role });
  return res.data; // { userId, message }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
// Called from: otp/page.js
export const verifyOtp = async ({ phone, otp }) => {
  const res = await authApi.verifyOtp({ phone, otp });
  // Auto-login after OTP verified
  const { login } = useAuthStore.getState();
  login(res.data.user, res.data.token);
  return res.data;
};

// ─── Login ────────────────────────────────────────────────────────────────────
// Called from: login/page.js
export const login = async ({ email, password }) => {
  const res = await authApi.login({ email, password });
  const { login: storeLogin } = useAuthStore.getState();
  storeLogin(res.data.user, res.data.token);
  return res.data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = async () => {
  try { await authApi.logout(); } catch (_) {}
  const { logout: storeLogout } = useAuthStore.getState();
  storeLogout();
};

// ─── Hydrate auth on app load ─────────────────────────────────────────────────
// Called from: providers/Providers.jsx on mount
export const hydrateAuth = async () => {
  const { token, setUser } = useAuthStore.getState();
  if (!token) return;
  try {
    const res = await authApi.me();
    setUser(res.data);
  } catch (_) {
    const { logout: storeLogout } = useAuthStore.getState();
    storeLogout();
  }
};

// ─── Send OTP ─────────────────────────────────────────────────────────────────
export const sendOtp = async ({ phone }) => {
  const res = await authApi.sendOtp({ phone });
  return res.data;
};

// ─── Forgot / Reset password ──────────────────────────────────────────────────
export const forgotPassword = async ({ phone }) => {
  const res = await authApi.forgotPassword({ phone });
  return res.data;
};

export const resetPassword = async ({ phone, otp, newPassword }) => {
  const res = await authApi.resetPassword({ phone, otp, newPassword });
  return res.data;
};