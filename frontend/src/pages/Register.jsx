import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LottieAnimationPlayer } from '../components/LottieAnimationPlayer';
import { Brain, User, Mail, Lock, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                    placeholder="Vikram Sharma"
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
                    placeholder="student@placement.com"
                    className="w-full pl-10 p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none font-semibold"
                    required
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
                    required
                  />
                </div>
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
                disabled={loading}
                className="btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-all"
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
