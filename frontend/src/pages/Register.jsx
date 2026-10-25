import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LottieAnimationPlayer } from '../components/LottieAnimationPlayer';
import {
  Brain,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Password Policy Rules
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasDigit;

  // Confirm password matching rule
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Phone input sanitizer: digits only, max 10
  const handlePhoneChange = (e) => {
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(numericOnly);
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    if (!name || !name.trim()) {
      setErrorMessage('Full name is required.');
      addToast('Please enter your full name.', 'warning');
      return false;
    }

    if (!email || !email.trim()) {
      setErrorMessage('Email address is required.');
      addToast('Please enter your email address.', 'warning');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please provide a valid email address format.');
      addToast('Please provide a valid email address format.', 'warning');
      return false;
    }

    if (phone && phone.trim().length > 0 && phone.trim().length !== 10) {
      setErrorMessage('Phone number must contain exactly 10 digits (0-9).');
      addToast('Phone number must contain exactly 10 digits.', 'warning');
      return false;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
      addToast('Password does not meet standard complexity specifications.', 'warning');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password do not match.');
      addToast('Passwords do not match.', 'warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await register(name, email, password, confirmPassword, phone);
    setLoading(false);

    if (result.success) {
      addToast('Registration successful. Please log in.', 'success');
      navigate('/login?registered=true');
    } else {
      setErrorMessage(result.message);
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4">
      <div className="grid md:grid-cols-12 gap-8 items-center">
        
        {/* Left Presentation Showcase */}
        <div className="md:col-span-6 space-y-8 hidden md:block">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider animate-float-slow">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>VISME CANDIDATE ONBOARDING ENGINE</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              Build Your Placement Profile & Unlock AI Mock Interview Tools
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Create your student candidate profile to track test scores, run Monaco code sandboxes, benchmark ATS resume gap analysis, and practice voice AI interviews.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-xs font-bold text-gray-700 dark:text-gray-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Developed by <strong className="text-brand-purple font-extrabold">Suhas J</strong></span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-tr from-brand-purple/10 via-indigo-500/10 to-emerald-500/10 border border-brand-purple/20 flex items-center justify-between">
            <div className="space-y-2 max-w-xs">
              <div className="text-xs font-black text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Candidate Registration</span>
              </div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                Your credentials are encrypted securely with bcrypt and stored in MongoDB.
              </p>
            </div>
            
            <LottieAnimationPlayer animationType="aiBrain" className="w-32 h-32 shrink-0" />
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-6 max-w-md w-full mx-auto">
          <div className="visme-card p-8 md:p-10 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mx-auto flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Create Student Candidate Profile</h2>
              <p className="text-xs text-gray-500">Join InterviewPro to access candidate assessment processes.</p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Full Name */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">Gmail / Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="name@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Optional Phone Number */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">Phone Number (Optional)</label>
                  <span className="text-[10px] text-gray-400">10 digits</span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple font-semibold"
                  />
                </div>
                {phone.length > 0 && phone.length < 10 && (
                  <span className="text-[10px] text-amber-500 font-medium mt-1 block">
                    {10 - phone.length} more digit{10 - phone.length > 1 ? 's' : ''} needed
                  </span>
                )}
              </div>

              {/* Password Field with Policy Feedback */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
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
                    placeholder="e.g. StudentPass2026!"
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

                {/* Password Policy Checklist */}
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

              {/* Confirm Password Field */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Re-enter your password"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (password.length > 0 && !isPasswordValid) || (confirmPassword.length > 0 && !passwordsMatch)}
                className={`btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  (password.length > 0 && !isPasswordValid) || (confirmPassword.length > 0 && !passwordsMatch)
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:scale-[1.01]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Profile in MongoDB...</span>
                  </>
                ) : (
                  <>
                    <span>Create Student Candidate Profile 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100 dark:border-dark-border text-xs text-gray-500 space-y-2">
              <span className="block">
                Already registered?{' '}
                <Link to="/login" className="text-brand-purple font-bold hover:underline">
                  Sign In to Candidate Portal
                </Link>
              </span>
              <p className="text-[11px] font-bold text-gray-400">
                Developed by <span className="text-brand-purple font-extrabold">Suhas J</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
