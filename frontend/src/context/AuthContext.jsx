

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token  = localStorage.getItem('access_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { clearAuth(); }
    }
    setLoading(false);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const saveAuth = (userData, tokens) => {
    localStorage.setItem('access_token',  tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    saveAuth(data.user, data.tokens);
    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    saveAuth(data.user, data.tokens);
    return data.user;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) await logoutUser(refresh);
    } catch {}
    clearAuth();
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAuthenticated: !!user,
      isHost:    user?.role === 'host',
      isTourist: user?.role === 'tourist',
      isAdmin:   user?.role === 'admin' || user?.is_superuser,
      login, register, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};