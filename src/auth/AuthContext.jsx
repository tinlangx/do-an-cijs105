// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// HARD-CODE backend để test cho chắc
const API_URL = 'https://do-an-cijs105-be.vercel.app';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user')) || null;
    } catch {
      return null;
    }
  });

  // values = { email, password } từ Form
  const login = async (values) => {
    const { email, password } = values;

    let res;
    try {
      res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      console.error('Network login error:', err);
      throw new Error('Không kết nối được server');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Sai email hoặc mật khẩu');
    }

    const session = data.user; // { id, name, email }
    localStorage.setItem('auth_user', JSON.stringify(session));
    setUser(session);
    return session;
  };

  // values = { name, email, password } từ Form
  const register = async (values) => {
    const { name, email, password } = values;

    let res;
    try {
      res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
    } catch (err) {
      console.error('Network register error:', err);
      throw new Error('Không kết nối được server');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Đăng ký thất bại');
    }

    const session = data.user;
    localStorage.setItem('auth_user', JSON.stringify(session));
    setUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthed: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
