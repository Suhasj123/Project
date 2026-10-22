import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('prep_ai_token');
      const cachedUserStr = localStorage.getItem('prep_ai_user');

      if (cachedUserStr && token) {
        try {
          const parsed = JSON.parse(cachedUserStr);
          if (parsed && typeof parsed === 'object') {
            setUser(parsed);
          }
        } catch (e) {
          localStorage.removeItem('prep_ai_token');
          localStorage.removeItem('prep_ai_user');
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password, phone = '', loginMode = 'candidate') => {
    try {
      const cleanEmail = email ? email.toLowerCase().trim() : '';
      const cleanPhone = phone ? phone.trim() : '';

      const res = await API.post('/auth/login', {
        email: cleanEmail,
        password,
        phone: cleanPhone || undefined,
        loginMode
      });

      const userObj = res.data.user;
      const token = res.data.token;

      localStorage.setItem('prep_ai_token', token);
      localStorage.setItem('prep_ai_user', JSON.stringify(userObj));
      localStorage.setItem('prep_ai_user_email', cleanEmail);

      if (userObj.role === 'admin') {
        localStorage.setItem('prep_ai_admin_mode', 'true');
      } else {
        localStorage.removeItem('prep_ai_admin_mode');
      }

      setUser(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials and server connection.';
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, confirmPassword, phone = '') => {
    try {
      const cleanEmail = email ? email.toLowerCase().trim() : '';
      const cleanPhone = phone ? phone.trim() : '';

      const res = await API.post('/auth/register', {
        name: name ? name.trim() : '',
        email: cleanEmail,
        password,
        confirmPassword,
        phone: cleanPhone || undefined
      });

      return {
        success: true,
        message: res.data.message || 'Registration successful. Please log in.'
      };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('prep_ai_token');
    localStorage.removeItem('prep_ai_user');
    localStorage.removeItem('prep_ai_admin_mode');
    localStorage.removeItem('prep_ai_user_email');
    setUser(null);
    addToast('Logged out successfully.', 'info');
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await API.put('/auth/profile', updatedData);
      setUser(prev => ({ ...prev, ...res.data.user }));
      addToast('Profile updated successfully!', 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      addToast(msg, 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
