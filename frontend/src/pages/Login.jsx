import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LottieAnimationPlayer } from '../components/LottieAnimationPlayer';
import {
  Brain,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const Login = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isRegisteredSuccess = queryParams.get('registered') === 'true';

  const [loginMode] = useState('candidate'); // Dedicated Candidate Portal mode
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    isRegisteredSuccess ? 'Registration successful. Please log in.' : ''
  );
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isRegisteredSuccess) {
      addToast('Registration successful. Please log in.', 'success');
    }
  }, [isRegisteredSuccess]);

  // Phone input sanitizer: only digits, max 10
  const handlePhoneChange = (e) => {
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(numericOnly);
    if (errorMessage) setErrorMessage('');
  };

  const validateInputs = () => {
    if (!email || !email.trim()) {
      setErrorMessage('Please enter your email address.');
      addToast('Please enter your email address.', 'warning');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address format.');
      addToast('Please enter a valid email address format.', 'warning');
      return false;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      addToast('Please enter your password.', 'warning');
      return false;
    }

    if (phone && phone.trim().length > 0 && phone.trim().length !== 10) {
      setErrorMessage('Phone number must contain exactly 10 digits (0-9).');
      addToast('Phone number must contain exactly 10 digits.', 'warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateInputs()) return;

    setLoading(true);
    const result = await login(
      email.trim(),
      password,
      phone.trim(),
      loginMode
    );
    setLoading(false);

    if (result.success) {
      const userRole = result.user?.role;
      if (userRole === 'admin') {
        addToast(`Admin Control Console Authenticated! 🛡️`, 'success');
        navigate('/admin');
      } else {
        addToast(`Welcome to Candidate Portal! 🚀`, 'success');
        navigate('/resume-analyzer');
      }
    } else {
      setErrorMessage(result.message);
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 md:py-16 px-3 sm:px-4 w-full max-w-full">
      <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
        
        {/* Left Column: Presentation Showcase */}
        <div className="md:col-span-6 space-y-8 hidden md:block">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider animate-float-slow">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>VISME INTERACTIVE PLACEMENT PLATFORM</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              AI-Powered Interview Preparation & Assessment System
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Accelerate your campus placement success with real-time AI mock interviews, Monaco code execution sandboxes, ATS resume screeners, and interactive performance telemetry.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-xs font-bold text-gray-700 dark:text-gray-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Developed by <strong className="text-brand-purple font-extrabold">Suhas J</strong></span>
            </div>
          </div>

          {/* Lottie Vector Animation Player Showcase */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-brand-purple/10 via-indigo-500/10 to-brand-blue/10 border border-brand-purple/20 relative overflow-hidden flex items-center justify-between">
            <div className="space-y-2 max-w-xs z-10">
              <div className="text-xs font-black text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                <span>AI Interview Bot Active</span>
              </div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                Simulate technical, behavioral, and system design rounds with speech tone clarity feedback.
              </p>
            </div>
            
            <LottieAnimationPlayer animationType="aiBrain" className="w-32 h-32 shrink-0 z-10" />
          </div>

          {/* Infographic Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="visme-card p-4 text-center space-y-1">
              <span className="text-2xl font-black text-brand-purple">98.4%</span>
              <span className="text-[11px] font-bold text-gray-500 block uppercase">Hire Rate</span>
            </div>

            <div className="visme-card p-4 text-center space-y-1">
              <span className="text-2xl font-black text-brand-blue">100+</span>
              <span className="text-[11px] font-bold text-gray-500 block uppercase">Code Sandboxes</span>
            </div>

            <div className="visme-card p-4 text-center space-y-1">
              <span className="text-2xl font-black text-emerald-500">ATS</span>
              <span className="text-[11px] font-bold text-gray-500 block uppercase">Resume Screener</span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphism Login Card */}
        <div className="md:col-span-6 max-w-md w-full mx-auto">
          <div className="visme-card p-5 sm:p-7 md:p-10 space-y-5 sm:space-y-6 shadow-2xl w-full">
            
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mx-auto flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Candidate Portal Access
              </h2>
              <p className="text-xs text-gray-500">
                Enter your registered credentials to access the AI placement preparation portal.
              </p>
            </div>

            {/* Success or Error Feedback Alerts */}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Candidate Portal Badge */}
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-extrabold shadow-sm">
              <UserCheck className="w-4 h-4 text-brand-purple" />
              <span>Candidate Portal</span>
            </div>

            {/* Unified Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Email Address */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                  Email Address
                </label>
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

              {/* Optional Phone Number (Visible for candidate mode) */}
              {loginMode === 'candidate' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">
                      Phone Number (Optional)
                    </label>
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
              )}

              {/* Password Field with Eye Visibility Control */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-brand-purple hover:underline font-bold"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple font-semibold"
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Candidate Portal 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Registration Redirect */}
            <div className="text-center pt-2 border-t border-gray-100 dark:border-dark-border space-y-2">
              <span className="text-xs text-gray-500 block">
                New candidate user?{' '}
                <Link to="/register" className="font-bold text-brand-purple hover:underline">
                  Create Student Candidate Profile
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
