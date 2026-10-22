import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Brain, Mail, ArrowLeft, AlertCircle, CheckCircle2, KeyRound, ExternalLink } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseState, setResponseState] = useState(null); // { success, emailConfigured, message, devResetUrl }
  const [errorMessage, setErrorMessage] = useState('');

  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResponseState(null);

    if (!email || !email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      addToast('Please enter your email address.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email: email.trim() });
      setResponseState(res.data);
      if (res.data.emailConfigured) {
        addToast('Reset link dispatched!', 'success');
      } else {
        addToast(res.data.message, 'info');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process password reset request.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="visme-card p-8 md:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mx-auto flex items-center justify-center shadow-lg">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-xs text-gray-500">
            Enter your registered email address to receive a secure, single-use password reset link.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!responseState ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple font-semibold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Secure Link...</span>
                </>
              ) : (
                <span>Send Reset Link (Zero OTP) 🚀</span>
              )}
            </button>
          </form>
        ) : responseState.emailConfigured ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 text-xs animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-emerald-800 dark:text-emerald-300">
              Password Reset Link Dispatched!
            </p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
              {responseState.message}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 text-xs animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-amber-800 dark:text-amber-300">
              Email Delivery Notice
            </p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
              {responseState.message}
            </p>
            {responseState.devResetUrl && (
              <div className="pt-2 border-t border-amber-500/20">
                <p className="text-[10px] text-gray-400 mb-2 font-mono">Development Mode Link:</p>
                <a
                  href={responseState.devResetUrl}
                  className="btn-gradient inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow"
                >
                  <span>Open Reset Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-2 border-t border-gray-100 dark:border-dark-border">
          <Link
            to="/login"
            className="text-xs text-brand-purple font-bold hover:underline inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Candidate Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
