import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('schemesetu_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authAPI.getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('schemesetu_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const accessToken = res.data.access_token;
    const userData = res.data.user;
    localStorage.setItem('schemesetu_token', accessToken);
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const accessToken = res.data.access_token;
    const userData = res.data.user;
    localStorage.setItem('schemesetu_token', accessToken);
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const requestOtp = async (identifier, purpose = 'login') => {
    const res = await authAPI.requestOtp(identifier, purpose);
    return res.data;
  };

  const verifyOtp = async (identifier, otpCode) => {
    const res = await authAPI.verifyOtp(identifier, otpCode);
    const accessToken = res.data.access_token;
    const userData = res.data.user;
    localStorage.setItem('schemesetu_token', accessToken);
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('schemesetu_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, requestOtp, verifyOtp, logout, isAdmin: user?.is_admin || false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
