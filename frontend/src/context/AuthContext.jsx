import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, loginUser, logoutRequest, registerUser } from '../api/authApi';
import { retryRequest } from '../utils/retryRequest';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) {
      setUser(null);
      return null;
    }
    
    try {
      const res = await retryRequest(() => fetchMe(), 2);
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (localStorage.getItem('accessToken')) {
          const res = await retryRequest(() => fetchMe(), 2);
          if (!cancelled && res.success && res.data) {
            setUser(res.data);
          } else if (!cancelled) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await retryRequest(() => loginUser({ email, password }), 2);
    const res = response.data;
    if (!res.success || !res.data?.accessToken) {
      throw new Error(res.message || 'Login failed');
    }
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    setUser(res.data.user);
    return res;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await retryRequest(() => registerUser({ name, email, password }), 2);
    const res = response.data;
    if (!res.success || !res.data?.accessToken) {
      throw new Error(res.message || 'Registration failed');
    }
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    setUser(res.data.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('accessToken')) {
        await logoutRequest();
      }
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile
    }),
    [user, initializing, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
