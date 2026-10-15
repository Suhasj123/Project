import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Brain, Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
      addToast('Reset instructions sent!', 'success');
    } catch (err) {
      addToast('Failed to send reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mx-auto flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-xs text-gray-500">Enter your email to receive a password reset link.</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-500 mb-1 block">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@placement.com"
                  className="w-full pl-9 p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3.5 rounded-xl font-bold text-xs shadow-lg"
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 text-xs text-emerald-600 dark:text-emerald-400">
            <p className="font-bold">Password Reset Email Dispatched! 🎉</p>
            <p className="text-[11px] text-gray-500">Check your inbox for step-by-step instructions to create a new password.</p>
          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs text-brand-purple font-bold hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
