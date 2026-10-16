import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LottieAnimationPlayer } from '../components/LottieAnimationPlayer';
import { Brain, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff, Check, X, ShieldAlert } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password Policy Rules
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);

  const passedCount = [hasLength, hasUpper, hasLower, hasDigit].filter(Boolean).length;
  const isPasswordValid = passedCount === 4;

  const strengthDetails = [
    { label: 'Too Weak', color: 'bg-rose-500', width: 'w-1/4', text: 'text-rose-500' },
    { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4', text: 'text-amber-500' },
    { label: 'Good', color: 'bg-blue-500', width: 'w-3/4', text: 'text-blue-500' },
    { label: 'Strong & Compliant', color: 'bg-emerald-500', width: 'w-full', text: 'text-emerald-500' }
  ];

  const currentStrength = passedCount > 0 ? strengthDetails[passedCount - 1] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setLoading(true);
    const success = await register(name, email, password, role);
    setLoading(false);
    if (success) {
      navigate(role === 'admin' ? '/admin' : '/prep-dashboard');
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
              Create your candidate profile to track test scores, run Monaco code sandboxes, benchmark ATS resume gap analysis, and receive automated welcome emails.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-tr from-brand-purple/10 via-indigo-500/10 to-emerald-500/10 border border-brand-purple/20 flex items-center justify-between">
            <div className="space-y-2 max-w-xs">
              <div className="text-xs font-black text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant Account Setup</span>
              </div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                Automatic Nodemailer welcome email dispatch and candidate dashboard provisioning.
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
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Create Candidate Profile</h2>
              <p className="text-xs text-gray-500">Join InterviewPro to access candidate assessment processes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-500 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-500 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya.sharma@campusprep.edu"
                    className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Password Field with Policy Feedback */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-500 block">Password</label>
                  {currentStrength && (
                    <span className={`text-[10px] font-bold ${currentStrength.text}`}>
                      {currentStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onFocus={() => setShowChecklist(true)}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!showChecklist) setShowChecklist(true);
                    }}
                    placeholder="e.g. DemoUser2026!"
                    className={`w-full pl-10 pr-10 p-3.5 rounded-xl border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold transition-all ${
                      password.length > 0 
                        ? (isPasswordValid ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500' : 'border-rose-400 focus:ring-1 focus:ring-rose-400')
                        : 'border-gray-200 dark:border-dark-border'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Strength Meter Bar */}
                {password.length > 0 && currentStrength && (
                  <div className="w-full bg-gray-100 dark:bg-dark-border h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${currentStrength.color} ${currentStrength.width} transition-all duration-300`}></div>
                  </div>
                )}

                {/* Real-Time Password Policy Feedback Checklist */}
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

              <div>
                <label className="font-bold text-gray-500 mb-1 block">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                >
                  <option value="student">Student Candidate</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || (password.length > 0 && !isPasswordValid)}
                className={`btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  password.length > 0 && !isPasswordValid ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'
                }`}
              >
                <span>{loading ? 'Creating Candidate Profile...' : 'Register Account & Send Welcome Email 🚀'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100 dark:border-dark-border text-xs text-gray-500">
              Already registered?{' '}
              <Link to="/login" className="text-brand-purple font-bold hover:underline">
                Sign In to Candidate Portal
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
