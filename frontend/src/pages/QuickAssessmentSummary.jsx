import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Award,
  CheckCircle2,
  BookOpen,
  Code2,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Zap,
  RotateCcw
} from 'lucide-react';

export const QuickAssessmentSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId') || 'qsess_demo';

  const [summary, setSummary] = useState({
    aptitudeScore: 16,
    aptitudeTotal: 20,
    codingScore: 8,
    codingTotal: 10
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get(`/quick-assessment/summary/${sessionId}`);
        if (res.data) setSummary(res.data);
      } catch (err) {
        console.warn('[Summary fetch warning]', err);
      }
    };
    fetchSummary();
  }, [sessionId]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-brand-purple via-indigo-700 to-brand-blue text-white shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md text-white mx-auto flex items-center justify-center font-black">
          <Zap className="w-8 h-8" />
        </div>
        
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase backdrop-blur-md">
            QUICK ASSESSMENT COMPLETED
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">
            Your Candidate Self-Check Summary
          </h1>
        </div>

        {/* Progress Indicator Stepper */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>Aptitude Screener ✓</span>
          </div>
          <div className="w-8 h-0.5 bg-white/30"></div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>Coding Round ✓</span>
          </div>
        </div>
      </div>

      {/* Main Score Metrics Card */}
      <div className="glass-card p-8 text-center space-y-6 border-l-4 border-l-brand-purple">
        <div className="grid md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 space-y-2">
            <BookOpen className="w-8 h-8 text-brand-purple mx-auto" />
            <div className="text-xs font-extrabold uppercase text-brand-purple">STAGE 1 APTITUDE SCREENER</div>
            <div className="text-4xl font-black text-brand-purple">
              {summary.aptitudeScore} <span className="text-xl font-bold text-gray-400">/ {summary.aptitudeTotal}</span>
            </div>
            <div className="text-[11px] text-gray-500 font-semibold">80% Accuracy</div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <Code2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <div className="text-xs font-extrabold uppercase text-emerald-500">STAGE 2 CODING ROUND</div>
            <div className="text-4xl font-black text-emerald-500">
              {summary.codingScore} <span className="text-xl font-bold text-gray-400">/ {summary.codingTotal}</span>
            </div>
            <div className="text-[11px] text-gray-500 font-semibold">80% Code Pass Rate</div>
          </div>

        </div>
      </div>

      {/* Next Step Call-to-Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* CTA 1: AI Mock Interview */}
        <div className="glass-card p-6 space-y-4 border-l-4 border-l-brand-purple hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Try an AI Mock Interview</h3>
              <p className="text-xs text-gray-500">1-on-1 voice interview with dynamic Claude AI follow-up questions.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai-mock-interview')}
            className="btn-gradient w-full py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
          >
            <span>Launch AI Mock Interview Bot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* CTA 2: Prep Dashboard */}
        <div className="glass-card p-6 space-y-4 border-l-4 border-l-brand-blue hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">View Candidate Prep Dashboard</h3>
              <p className="text-xs text-gray-500">Track readiness trends, radar skill charts, and week-by-week roadmaps.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/prep-dashboard')}
            className="px-5 py-3 rounded-xl bg-brand-blue text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition w-full flex items-center justify-center gap-2"
          >
            <span>Open Candidate Prep Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
