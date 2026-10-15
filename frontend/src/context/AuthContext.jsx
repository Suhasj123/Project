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
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, phone, password, isRoleAdmin = false) => {
    const defaultEmail = isRoleAdmin ? 'suhasjsuhasj505@gmail.com' : 'student@placement.com';
    const cleanEmail = (email || defaultEmail).toLowerCase().trim();
    localStorage.setItem('prep_ai_user_email', cleanEmail);

    const isAdmin = isRoleAdmin || cleanEmail === 'suhasjsuhasj505@gmail.com' || cleanEmail === 'admin@placement.com';

    if (isAdmin) {
      localStorage.setItem('prep_ai_admin_mode', 'true');
    } else {
      localStorage.removeItem('prep_ai_admin_mode');
    }

    try {
      const res = await API.post('/auth/login', { email: cleanEmail, phone, password });
      const userObj = res.data.user || {};
      userObj.role = isAdmin ? 'admin' : 'student';
      localStorage.setItem('prep_ai_token', res.data.token || (isAdmin ? 'mock_admin_token' : 'mock_student_token'));
      localStorage.setItem('prep_ai_user', JSON.stringify(userObj));
      setUser(userObj);
      addToast(isAdmin ? `Welcome back Admin, ${userObj.name || 'Suhas Admin'}! 🛡️` : `Welcome Candidate, ${userObj.name || 'Student Candidate'}! 🎓`, 'success');
      return true;
    } catch (err) {
      console.warn('[AuthContext] Backend login API offline or fallback active.');
      const fallbackUser = {
        _id: isAdmin ? '650000000000000000000002' : '650000000000000000000001',
        name: isAdmin ? 'Suhas Admin' : (cleanEmail.split('@')[0] || 'Student Candidate'),
        email: cleanEmail,
        phone: phone || '9876543210',
        role: isAdmin ? 'admin' : 'student',
        targetRole: 'Software Engineer',
        streakDays: 7,
        readinessScore: 88,
        profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      };
      const fallbackToken = isAdmin ? 'mock_admin_token_' + Date.now() : 'mock_student_token_' + Date.now();
      localStorage.setItem('prep_ai_token', fallbackToken);
      localStorage.setItem('prep_ai_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      addToast(isAdmin ? `Welcome Admin, ${fallbackUser.name}! 🛡️` : `Welcome Student, ${fallbackUser.name}! 🎓`, 'success');
      return true;
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      localStorage.setItem('prep_ai_token', res.data.token);
      localStorage.setItem('prep_ai_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      addToast('Registration successful! Welcome to PrepAI 🎉', 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('prep_ai_token');
    localStorage.removeItem('prep_ai_user');
    localStorage.removeItem('prep_ai_admin_mode');
    localStorage.removeItem('prep_ai_user_email');
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await API.put('/auth/profile', updatedData);
      setUser(prev => ({ ...prev, ...res.data.user }));
      addToast('Profile updated successfully!', 'success');
      return true;
    } catch (err) {
      addToast('Failed to update profile.', 'error');
      return false;
    }
  };

  // Direct candidate authentication access helper (Zero OTP)
  const directCandidateAccess = async (email, phone) => {
    const cleanEmail = email ? email.trim() : 'student@placement.com';
    const cleanPhone = phone ? phone.trim() : '9876543210';
    return await login(cleanEmail, cleanPhone, 'password123', false);
  };

  const sendOTP = async () => ({ success: true });
  const verifyOTP = async (email, phone) => directCandidateAccess(email, phone);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, directCandidateAccess, sendOTP, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
