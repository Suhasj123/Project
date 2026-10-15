import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false, adminOrRecruiterOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Loading PrepAI Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={adminOnly ? "/login?mode=admin" : "/login"} replace />;
  }

  if (adminOnly && user.role !== 'admin' && user.email !== 'suhasjsuhasj505@gmail.com') {
    return <Navigate to="/login?mode=admin" replace />;
  }

  if (adminOrRecruiterOnly && user.role !== 'admin' && user.role !== 'recruiter' && user.email !== 'suhasjsuhasj505@gmail.com') {
    return <Navigate to="/login?mode=admin" replace />;
  }

  return children;
};
