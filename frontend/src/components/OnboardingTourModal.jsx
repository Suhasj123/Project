import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  LayoutDashboard,
  BookOpen,
  Code2,
  Brain,
  BarChart3,
  Award,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';

export const OnboardingTourModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Step 1: Resume Screener & ATS Audit',
      subtitle: 'Analyze Resume vs Job Description Keyword Compatibility',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      badge: '1ST CANDIDATE STEP',
      path: '/resume-analyzer',
      desc: 'Upload your resume or paste candidate text alongside a job description. The AI engine extracts missing keywords, calculates an overall compatibility score, and builds a 4-week prep roadmap.',
      features: [
        'Instant ATS Match Percentage Gauge',
        'Matching vs Missing Skills Extraction',
        'Personalized 4-Week Skill Prep Roadmap'
      ]
    },
    {
      title: 'Step 2: Candidate Preparation Dashboard',
      subtitle: 'Monitor Placement Telemetry & Telemetry Metrics',
      icon: LayoutDashboard,
      color: 'from-purple-600 to-indigo-600',
      badge: 'ANALYTICS HUB',
      path: '/prep-dashboard',
      desc: 'View your overall readiness score, past mock interview session scores, Monaco coding problem accuracy, and targeted weak topics in one unified Visme telemetry dashboard.',
      features: [
        'Visme Interactive Infographic Gauge',
        'Readiness Score & XP Streak Tracking',
        'Targeted Weak Topics & Action Checklist'
      ]
    },
    {
      title: 'Step 3: Aptitude Assessment Suite',
      subtitle: 'Master Quantitative, Logical & Verbal Reasoning Tests',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      badge: 'SPEED ASSESSMENT',
      path: '/aptitude-quiz',
      desc: 'Practice timed aptitude screening tests modeled after top IT recruiter screening patterns (TCS NQT, Infosys, Wipro, Accenture) with instant scoring and detailed answer explanations.',
      features: [
        'Timed Countdown Test Engine',
        'Category Breakdown (Quant, Verbal, Logic)',
        'Detailed Solutions & Explanations'
      ]
    },
    {
      title: 'Step 4: Monaco Code Sandbox Challenge',
      subtitle: 'Solve Algorithmic Coding Questions with Real-Time Execution',
      icon: Code2,
      color: 'from-emerald-500 to-teal-600',
      badge: 'LIVE SANDBOX',
      path: '/coding-quiz',
      desc: 'Write, execute, and debug JavaScript/Python code using VS Code-powered Monaco Editor with sandboxed test case runners and automated code hints.',
      features: [
        'VS Code Monaco Editor Interface',
        '1-Click Test Case Execution Runner',
        'AI Coding Coach Hints & Feedback'
      ]
    },
    {
      title: 'Step 5: Voice AI Mock Interview Bot',
      subtitle: 'Simulate Real Technical & Behavioral Voice Interviews',
      icon: Brain,
      color: 'from-brand-purple to-indigo-700',
      badge: 'VOICE AI SIMULATOR',
      path: '/ai-mock-interview',
      desc: 'Engage in dynamic, voice-enabled mock interviews. The AI bot asks tailored role questions, listens via Web Speech API, and evaluates clarity, technical accuracy, and confidence.',
      features: [
        'Real-Time Web Speech API Recognition',
        'STAR Method Answer Evaluation',
        'Overall Readiness & Score Breakdown'
      ]
    },
    {
      title: 'Step 6: Performance Analytics & Radar',
      subtitle: 'Visualize Skill Progression Graphs & Topic Coverage',
      icon: BarChart3,
      color: 'from-cyan-600 to-blue-700',
      badge: 'TELEMETRY GRAPHS',
      path: '/progress',
      desc: 'Track long-term readiness score progression charts, review skill distribution radar plots, and inspect historical mock interview feedback reports.',
      features: [
        'Historical Score Line Telemetry',
        'Skill Matrix Radar Visualization',
        'Completed Module Records'
      ]
    },
    {
      title: 'Step 7: Leaderboard & Rankings',
      subtitle: 'Benchmark Candidate Performance & Placement Readiness',
      icon: Award,
      color: 'from-amber-600 to-yellow-500',
      badge: 'RANKINGS & BADGES',
      path: '/leaderboard',
      desc: 'Compare test scores and practice streaks with candidate peers. Unlock placement readiness badges as you complete assessment milestones.',
      features: [
        'Campus Candidate Leaderboard',
        'XP Streak Badges & Milestones',
        'Recruiter Visibility Status'
      ]
    },
    {
      title: 'Step 8: ATS Resume Creation 📄',
      subtitle: 'Export A4 Sheet Resumes Ready for Campus Recruitment',
      icon: FileCheck,
      color: 'from-indigo-600 to-brand-blue',
      badge: 'FINAL WORKFLOW STEP',
      path: '/resume-builder',
      desc: 'Generate a clean, perfectly aligned A4 Sheet Candidate Resume. Styled for A4 paper print and 1-click PDF export with zero alignment distortion.',
      features: [
        'Clean Centered A4 Sheet Preview',
        '1-Click Export to PDF Engine',
        'ATS-Compliant Section Formatting'
      ]
    }
  ];

  const currentInfo = tourSteps[currentStep];
  const Icon = currentInfo.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLaunchModule = () => {
    onClose();
    navigate(currentInfo.path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-x-hidden text-gray-900 dark:text-white transition-all">
        
        {/* Header Bar */}
        <div className={`p-4 sm:p-6 bg-gradient-to-r ${currentInfo.color} text-white relative flex items-center justify-between`}>
          <div className="space-y-1 z-10 min-w-0 pr-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] sm:text-[11px] font-black uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span>{currentInfo.badge}</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold tracking-tight truncate">{currentInfo.title}</h2>
            <p className="text-xs text-white/80 font-medium truncate">{currentInfo.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all shrink-0 z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-gray-100 dark:bg-dark-border/40 h-1.5 w-full flex">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStep ? 'bg-brand-purple' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0 shadow-inner">
              <Icon className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                {currentInfo.desc}
              </p>
            </div>
          </div>

          {/* Key Feature Bullet Points */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/30 border border-gray-200 dark:border-dark-border space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-purple block">
              ✨ Core Module Highlights:
            </span>
            <div className="grid gap-2">
              {currentInfo.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Selector Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-7 bg-brand-purple'
                    : 'w-2 bg-gray-300 dark:bg-dark-border hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-5 bg-gray-50 dark:bg-dark-border/20 border-t border-gray-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            onClick={handleLaunchModule}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-brand-purple/10 text-brand-purple font-extrabold text-xs hover:bg-brand-purple/20 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <span className="truncate">Launch {currentInfo.title.split(':')[1] || 'Module'} 🚀</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 sm:flex-initial justify-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-dark-border transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn-gradient flex-1 sm:flex-initial justify-center px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5"
            >
              <span>{currentStep < tourSteps.length - 1 ? 'Next Step' : 'Finish Tour 🎉'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
