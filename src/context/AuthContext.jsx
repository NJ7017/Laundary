import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aurawash_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      localStorage.setItem('aurawash_user', JSON.stringify(data.user));
      localStorage.setItem('aurawash_token', data.token);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setUser(data.user);
      localStorage.setItem('aurawash_user', JSON.stringify(data.user));
      localStorage.setItem('aurawash_token', data.token);
      showToast('Account created successfully! Welcome to AuraWash.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurawash_user');
    localStorage.removeItem('aurawash_token');
    showToast('You have been logged out.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, toast, showToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
