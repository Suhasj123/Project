import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  TrendingUp,
  Brain,
  Code2,
  FileCheck,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Flame
} from 'lucide-react';

export const VismeInfographicWidget = ({
  readinessScore = 88,
  atsScore = 92,
  codingSpeed = 95,
  confidence = 86
}) => {
  const [activeTab, setActiveTab] = useState('readiness'); // 'readiness', 'ats', 'coding', 'confidence'

  const metrics = {
    readiness: {
      title: 'Interview Readiness Index',
      score: readinessScore,
      unit: '/ 100',
      color: 'from-brand-purple to-indigo-600',
      strokeColor: '#7c3aed',
      description: 'Composite AI readiness score calculated from technical accuracy, communication clarity, and situational responses.',
      stats: [
        { label: 'Technical Depth', val: '92%' },
        { label: 'Communication STAR', val: '86%' },
        { label: 'Problem Solving', val: '88%' }
      ]
    },
    ats: {
      title: 'ATS Resume Match Metric',
      score: atsScore,
      unit: '% Match',
      color: 'from-emerald-500 to-teal-600',
      strokeColor: '#10b981',
      description: 'Real-time keyword relevance and formatting parser score optimized for Enterprise ATS software (Taleo, Greenhouse).',
      stats: [
        { label: 'Keyword Coverage', val: '94%' },
        { label: 'Format Compliance', val: '100%' },
        { label: 'Skill Gap Index', val: ' Low' }
      ]
    },
    coding: {
      title: 'Algorithmic Execution Speed',
      score: codingSpeed,
      unit: ' Percentile',
      color: 'from-brand-blue to-cyan-500',
      strokeColor: '#2563eb',
      description: 'Runtime efficiency and space complexity score derived from sandboxed Monaco code sandbox test suites.',
      stats: [
        { label: 'Time Complexity', val: 'O(N)' },
        { label: 'Space Complexity', val: 'O(1)' },
        { label: 'Test Suite Pass Rate', val: '100%' }
      ]
    },
    confidence: {
      title: 'Speech & Tone Confidence',
      score: confidence,
      unit: '% Tone Clarity',
      color: 'from-amber-500 to-rose-500',
      strokeColor: '#f59e0b',
      description: 'Acoustic pitch stability, filler word detection, and speaking cadence analyzed via speech recognition.',
      stats: [
        { label: 'WPM Cadence', val: '135 WPM' },
        { label: 'Filler Word Density', val: '< 1.2%' },
        { label: 'Pitch Variation', val: 'Optimal' }
      ]
    }
  };

  const current = metrics[activeTab];

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current.score / 100) * circumference;

  return (
    <div className="visme-card p-6 md:p-8 space-y-6">
      
      {/* Top Banner Header with Visme Animated Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider animate-float-slow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>VISME INTERACTIVE INFOGRAPHIC HUB</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            AI Placement Preparation Analytics
          </h2>
        </div>

        {/* Interactive Tab Switcher Buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-dark-border/40 rounded-2xl text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setActiveTab('readiness')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'readiness'
                ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Readiness</span>
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ats'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>ATS Match</span>
          </button>

          <button
            onClick={() => setActiveTab('coding')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'coding'
                ? 'bg-gradient-to-r from-brand-blue to-cyan-500 text-white shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Coding</span>
          </button>

          <button
            onClick={() => setActiveTab('confidence')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'confidence'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Speech Tone</span>
          </button>
        </div>
      </div>

      {/* Main Visme Interactive Graphic Layout */}
      <div className="grid md:grid-cols-12 gap-8 items-center">
        
        {/* Animated SVG Circular Progress Gauge & Pulsing Rings */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4 p-6 rounded-3xl bg-gray-50 dark:bg-dark-border/20 border border-gray-100 dark:border-dark-border/40 relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            
            {/* Background Spinning Graphic Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-purple/20 via-brand-blue/10 to-emerald-500/20 blur-xl animate-spin-slow pointer-events-none"></div>

            {/* SVG Circular Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-gray-200 dark:text-dark-border"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke={current.strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease'
                }}
              />
            </svg>

            {/* Center Animated Score Display */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${current.color}`}>
                {current.score}
              </span>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-0.5">
                {current.unit}
              </span>
            </div>
          </div>

          <div className="text-center space-y-1 max-w-xs">
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
              <Target className="w-4 h-4 text-brand-purple" />
              <span>{current.title}</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {current.description}
            </p>
          </div>
        </div>

        {/* Visme Presentation Breakdown Cards */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-purple" />
            <span>Interactive Category Metrics</span>
          </h4>

          <div className="grid gap-3">
            {current.stats.map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:border-brand-purple/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                    {st.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-brand-purple group-hover:text-brand-blue transition-colors">
                    {st.val}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {/* Visme Bottom Micro-Interaction Action Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 border border-brand-purple/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-brand-purple dark:text-indigo-300 font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>Real-Time AI Telemetry & Feedback Active</span>
            </div>
            <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Optimal Placement Target
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
