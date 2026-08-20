import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('luma_token');
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('luma_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await client.post('/api/auth/login', { email, password });
    localStorage.setItem('luma_token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (email, password, name) => {
    const res = await client.post('/api/auth/register', { email, password, name });
    localStorage.setItem('luma_token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('luma_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
