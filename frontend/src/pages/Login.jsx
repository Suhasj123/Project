import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

export const Login = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'admin' ? 'admin' : 'candidate';

  const [loginMode, setLoginMode] = useState(initialMode); // 'candidate' or 'admin'
  const [email, setEmail] = useState(initialMode === 'admin' ? 'suhasjsuhasj505@gmail.com' : 'student@placement.com');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [adminPassword, setAdminPassword] = useState('admin12345');
  
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Direct Candidate Sign In (NO OTP, NO CODE REQUIRED)
  const handleCandidateSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      addToast('Please enter your Email Address.', 'warning');
      return;
    }

    setLoading(true);
    const success = await login(email.trim(), phone.trim() || '9876543210', password.trim() || 'password123', false);
    setLoading(false);

    if (success) {
      addToast('Welcome to Candidate Portal! 🚀', 'success');
      navigate('/resume-analyzer');
    }
  };

  // Direct Admin Sign In (NO OTP, NO CODE REQUIRED)
  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const adminEmail = email.trim() || 'suhasjsuhasj505@gmail.com';
    const success = await login(adminEmail, '9876543210', adminPassword || 'admin12345', true);
    setLoading(false);

    if (success) {
      addToast('Admin Control Console Authenticated! 🛡️', 'success');
      navigate('/admin');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4">
      <div className="grid md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Visme.co Interactive Presentation Showcase */}
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

          {/* Visme Infographic Metric Cards Grid */}
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

        {/* Right Column: Visme-Card Glassmorphism Login Card */}
        <div className="md:col-span-6 max-w-md w-full mx-auto">
          <div className="visme-card p-8 md:p-10 space-y-6 shadow-2xl">
            
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mx-auto flex items-center justify-center shadow-lg">
                {loginMode === 'admin' ? <ShieldCheck className="w-7 h-7" /> : <Brain className="w-7 h-7" />}
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {loginMode === 'admin' ? 'Admin Control Login' : 'Candidate Portal Access'}
              </h2>
              <p className="text-xs text-gray-500">
                {loginMode === 'admin'
                  ? 'Access candidate master directory, question banks, and placement analytics.'
                  : 'Enter your credentials to access the AI placement preparation portal directly.'}
              </p>
            </div>

            {/* Dual Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-gray-100 dark:bg-dark-border/40 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('candidate');
                  setEmail('student@placement.com');
                  generateNewCaptcha();
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === 'candidate'
                    ? 'bg-white dark:bg-dark-bg text-brand-purple shadow-md font-extrabold scale-105'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Candidate Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setEmail('suhasjsuhasj505@gmail.com');
                  generateNewCaptcha();
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === 'admin'
                    ? 'bg-brand-purple text-white shadow-md font-extrabold scale-105'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            </div>

            {/* 1. Candidate Direct Sign In Flow (NO OTP) */}
            {loginMode === 'candidate' && (
              <form onSubmit={handleCandidateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-500 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@placement.com"
                      className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-500 mb-1 block">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-500 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                    />
                  </div>
                </div>



                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>{loading ? 'Authenticating Candidate...' : 'Sign In to Candidate Portal 🚀'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 border-t border-gray-100 dark:border-dark-border">
                  <button
                    type="button"
                    onClick={() => login('student@placement.com', '9876543210', 'password123', false).then(() => navigate('/resume-analyzer'))}
                    className="w-full py-3 rounded-xl bg-brand-purple/10 text-brand-purple font-extrabold text-xs hover:bg-brand-purple/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>⚡ 1-Click Direct Candidate Access</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. Admin Direct Login Flow (NO OTP) */}
            {loginMode === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-500 mb-1 block">Admin Master Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="suhasjsuhasj505@gmail.com"
                      className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-500 mb-1 block">Admin Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                      required
                    />
                  </div>
                </div>



                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Authenticating Admin Credentials...' : 'Login to Admin Control Console 🛡️'}</span>
                </button>
              </form>
            )}

            {/* Footer Registration Redirect */}
            <div className="text-center pt-2 border-t border-gray-100 dark:border-dark-border">
              <span className="text-xs text-gray-500">
                New candidate user?{' '}
                <Link to="/register" className="font-bold text-brand-purple hover:underline">
                  Create Student Candidate Profile
                </Link>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
