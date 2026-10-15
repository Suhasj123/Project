import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Bot,
  FileText,
  Building2,
  Award,
  CheckCircle2,
  ArrowRight,
  Code2,
  BarChart2
} from 'lucide-react';

export const Home = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI Mock Interviews',
      desc: 'Simulate technical, HR, and behavioral interviews with real-time feedback on confidence, communication, and technical depth.'
    },
    {
      icon: FileText,
      title: 'Smart Resume Analyzer',
      desc: 'Upload your resume to get instant ATS scores, missing skills detection, improvements, and custom interview questions.'
    },
    {
      icon: Code2,
      title: 'Aptitude & Coding Quizzes',
      desc: 'Master Quant, Logical, Verbal, and programming challenges (Java, Python, C++, JS, SQL) with interactive timers.'
    },
    {
      icon: Building2,
      title: 'Company Specific Prep',
      desc: 'Access pattern guides, previous interview questions, and placement experiences for TCS, Infosys, Accenture, Wipro, etc.'
    },
    {
      icon: Award,
      title: 'Interactive Learning Center',
      desc: 'Learn from wrong answers with color-coded reviews, detailed explanations, reference notes, and AI instant assistance.'
    },
    {
      icon: BarChart2,
      title: 'Progress & Gamification',
      desc: 'Track weak topics, job readiness score, weekly trends, and unlock achievements as you level up.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-brand-blue/20 via-brand-purple/20 to-transparent blur-3xl -z-10 rounded-full"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Placement Prep Portal for Final-Year Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Master Campus Placements with <br />
            <span className="text-gradient">Personalized AI Mentorship</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to crack dream job interviews—Aptitude Quizzes, Coding Practice, AI Mock Interviews, Resume ATS Scoring, and Company Guides in one platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register" className="btn-gradient px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
              <span>Start Preparing Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/ai-mock-interview" className="px-8 py-4 rounded-2xl font-bold text-base bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-border transition-all">
              Try AI Mock Interview
            </Link>
            <Link to="/login?mode=admin" className="px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              <span>Admin Login Dashboard 🛡️</span>
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-gray-200 dark:border-dark-border/60 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-extrabold text-brand-blue">500+</div>
              <div className="text-xs text-gray-500 font-medium">Placement Questions</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-brand-purple">6 Top</div>
              <div className="text-xs text-gray-500 font-medium">IT Recruiters Covered</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-500">95%</div>
              <div className="text-xs text-gray-500 font-medium">Viva Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-amber-500">24/7</div>
              <div className="text-xs text-gray-500 font-medium">AI Mentor Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All-In-One Placement Toolkit</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Structured modules engineered specifically for freshers and job candidates.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card glass-card-hover p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue/10 to-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Separate Dedicated Admin Dashboard Access Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-extrabold uppercase tracking-wider border border-amber-500/30">
              RECRUITER & ADMIN PORTAL
            </span>
            <h3 className="text-2xl font-extrabold">Admin Control & Hiring Dashboard</h3>
            <p className="text-xs text-indigo-200 max-w-xl">
              Access candidate analytics, evaluation scorecards, question banks, and trigger automated hiring decisions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login?mode=admin"
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <span>Go to Admin Login 🛡️</span>
            </Link>
            <Link
              to="/recruiter-dashboard"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
            >
              <span>Recruiter Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
