import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  Sparkles,
  Flame,
  Zap,
  BookOpen,
  Bot,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await API.get('/progress/overview');
        setData(res.data);
      } catch (err) {
        console.warn('Fallback progress overview loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const readinessScore = data?.jobReadinessScore || user?.readinessScore || 72;
  const streak = data?.streakDays || user?.streakDays || 5;
  const weakTopics = data?.weakTopics || ['Speed, Distance & Time', 'Pointers in C++', 'Dynamic Programming'];
  const quizHistory = data?.quizHistory || [];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 w-full max-w-full min-w-0">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-5 sm:p-7 md:p-8 rounded-3xl bg-gradient-to-r from-brand-blue via-brand-purple to-indigo-900 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Role: {user?.targetRole || 'Software Engineer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Candidate'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Complete your step-by-step placement pathway below to maximize your interview readiness score!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/20 w-full md:w-auto shrink-0">
            <div className="p-3 bg-amber-400/20 text-amber-300 rounded-xl shrink-0">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black">{streak} Days</div>
              <div className="text-xs text-indigo-200">Active Learning Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP PLACEMENT PATHWAY ROADMAP */}
      <div className="glass-card p-4 sm:p-6 border-l-4 border-l-brand-purple space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-brand-purple shrink-0" />
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
              Official Step-by-Step Candidate Placement Pathway
            </h2>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-extrabold text-xs">
            4-STEP WORKFLOW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {/* Step 1 */}
          <Link
            to="/resume-analyzer"
            className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 hover:bg-brand-purple/5 border border-gray-200 dark:border-dark-border hover:border-brand-purple transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <FileText className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Step 1: ATS Resume Audit</h3>
            <p className="text-[11px] text-gray-500 mt-1">Select placement role, upload resume & analyze ATS score.</p>
          </Link>

          {/* Step 2 */}
          <Link
            to="/aptitude-quiz"
            className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 hover:bg-brand-purple/5 border border-gray-200 dark:border-dark-border hover:border-brand-purple transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-brand-blue text-white font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <BookOpen className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Stage-1: MCQ Test</h3>
            <p className="text-[11px] text-gray-500 mt-1">20 Qs / 10 Mins test with AI face proctoring & explanations.</p>
          </Link>

          {/* Step 3 */}
          <Link
            to="/coding-quiz"
            className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 hover:bg-brand-purple/5 border border-gray-200 dark:border-dark-border hover:border-brand-purple transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-brand-purple text-white font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <Building2 className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Stage-2: Coding Test</h3>
            <p className="text-[11px] text-gray-500 mt-1">5 Qs / 5 Mins coding test with interactive test runner.</p>
          </Link>

          {/* Step 4 */}
          <Link
            to="/company-prep"
            className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 hover:bg-brand-purple/5 border border-gray-200 dark:border-dark-border hover:border-brand-purple transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center">
                4
              </span>
              <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Step 4: Company Prep</h3>
            <p className="text-[11px] text-gray-500 mt-1">16 Companies, practice tests & 35+ Question PDFs.</p>
          </Link>
        </div>
      </div>

      {/* Main Grid: Score Gauge + Today's Progress + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Job Readiness Score Gauge */}
        <ScoreGauge
          score={readinessScore}
          title="Job Readiness Score"
          subtitle="Calculated from quiz accuracy, mock interview feedback & streak"
        />

        {/* Daily Challenge Card */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-lg">
                Daily Placement Challenge
              </span>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-500" /> +50 XP
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
              Master SQL GROUP BY & HAVING Clauses
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Test your knowledge on aggregate functions commonly asked in TCS & Infosys technical rounds.
            </p>
          </div>

          <Link to="/aptitude-quiz?category=Coding" className="btn-gradient w-full py-2.5 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
            <span>Start Today's Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Latest Achievement Card */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg inline-block">
              Latest Achievement
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg">
                🔥
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">7-Day Streak Master</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Practiced continuously for a week!</p>
              </div>
            </div>
          </div>

          <Link to="/progress" className="text-xs font-semibold text-brand-blue dark:text-brand-lightPurple hover:underline flex items-center gap-1">
            View All Badge Achievements →
          </Link>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-purple" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Link to="/aptitude-quiz" className="glass-card glass-card-hover p-5 flex items-center gap-4 group">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">Aptitude Quiz</div>
              <div className="text-[11px] text-gray-500">Quant, Logical, Verbal</div>
            </div>
          </Link>

          <Link to="/ai-interview" className="glass-card glass-card-hover p-5 flex items-center gap-4 group">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">AI Interview</div>
              <div className="text-[11px] text-gray-500">Tech & HR Rounds</div>
            </div>
          </Link>

          <Link to="/resume-analyzer" className="glass-card glass-card-hover p-5 flex items-center gap-4 group">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">Resume Analyzer</div>
              <div className="text-[11px] text-gray-500">ATS Score & Skills</div>
            </div>
          </Link>

          <Link to="/ai-mentor" className="glass-card glass-card-hover p-5 flex items-center gap-4 group">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">AI Mentor Chat</div>
              <div className="text-[11px] text-gray-500">24/7 Doubt Support</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Weak Topics & Recommended Learning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Identified Weak Topics</span>
            </h3>
            <span className="text-xs text-gray-400">Needs Practice</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                ⚠️ {topic}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed pt-2">
            These topics were flagged during your recent quizzes. Retrying questions in these areas will raise your score!
          </p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-blue" />
              <span>Recommended Learning</span>
            </h3>
          </div>
          <div className="space-y-3">
            <Link to="/learning-center" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-border/50 hover:bg-gray-100 transition">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Review Speed, Distance & Time Formulas</div>
                <div className="text-[10px] text-gray-500">Quantitative Aptitude Notes</div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-purple" />
            </Link>

            <Link to="/company-prep" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-border/50 hover:bg-gray-100 transition">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">TCS Technical Round Top 20 Questions</div>
                <div className="text-[10px] text-gray-500">Company Prep Module</div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-purple" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
