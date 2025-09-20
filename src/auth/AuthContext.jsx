import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user')) || null;
    } catch {
      return null;
    }
  });

  const login = async ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Sai email hoặc mật khẩu');
    const session = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem('auth_user', JSON.stringify(session));
    setUser(session);
    return session;
  };

  const register = async ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) throw new Error('Email đã tồn tại');

    const newUser = {
      id: (crypto?.randomUUID?.() || String(Date.now())),
      name, email, password
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    const session = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('auth_user', JSON.stringify(session));
    setUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthed: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
