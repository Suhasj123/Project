import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  // Password Policy Rules
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasDigit;

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Reset token is missing. Please request a new link.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
      addToast('Password does not meet standard specifications.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      addToast('Passwords do not match.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      });

      addToast(res.data.message || 'Password reset successful. Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
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
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Create New Password</h1>
          <p className="text-xs text-gray-500">
            Set your new secure password for InterviewPro.
          </p>
        </div>

        {!token && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Password Reset Link Invalid</span>
            </div>
            <p className="font-normal text-[11px]">
              No valid token found in the URL. Please request a new password reset link from the forgot password page.
            </p>
            <Link to="/forgot-password" className="text-brand-purple underline block mt-2">
              Go to Forgot Password Page
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {token && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* New Password */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onFocus={() => setShowChecklist(true)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!showChecklist) setShowChecklist(true);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. NewSecret2026!"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold transition-all ${
                    password.length > 0 
                      ? (isPasswordValid ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500' : 'border-rose-400 focus:ring-1 focus:ring-rose-400')
                      : 'border-gray-200 dark:border-dark-border'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Requirements checklist */}
              {(showChecklist || password.length > 0) && (
                <div className="mt-2.5 p-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border space-y-1.5 animate-fadeIn">
                  <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Password Requirements:
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${hasLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {hasLength ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    <span>At least one uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    <span>At least one lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${hasDigit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {hasDigit ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    <span>At least one number (0-9)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Re-enter your new password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold transition-all ${
                    confirmPassword.length > 0
                      ? (passwordsMatch ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500' : 'border-rose-400 focus:ring-1 focus:ring-rose-400')
                      : 'border-gray-200 dark:border-dark-border'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className={`mt-1.5 text-[11px] font-semibold flex items-center gap-1 ${
                  passwordsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                }`}>
                  {passwordsMatch ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid || !passwordsMatch}
              className="btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password & Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-gray-100 dark:border-dark-border">
          <Link to="/login" className="text-xs text-brand-purple font-bold hover:underline">
            Back to Candidate Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
