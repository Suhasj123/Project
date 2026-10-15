import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  Code2,
  Database,
  Cpu,
  Bookmark,
  ChevronRight,
  BarChart2,
  FileCheck,
  Send,
  RefreshCw,
  Award,
  Check,
  X
} from 'lucide-react';

export const IncrementalModel = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // 1. SIMULATOR STATE
  // -------------------------------------------------------------
  const projectIncrements = [
    {
      id: 1,
      name: 'Increment 1: User Authentication & Profile',
      description: 'Delivers the baseline system: Registration, Login/Logout, JWT authentication, Bcrypt password hashing, and user profile management.',
      badge: 'Module 1 - Auth Base',
      features: ['JWT Auth Tokens', 'Bcrypt Hashing', 'User Profile Setup', 'Secure Sessions'],
      riskScore: 90,
      deliveredPercent: 11
    },
    {
      id: 2,
      name: 'Increment 2: Resume Screening & ATS Analyzer',
      description: 'Parses candidate resumes, extracts technical skills, calculates ATS compatibility score, and provides improvement feedback.',
      badge: 'Module 2 - Resume ATS',
      features: ['Resume Upload Parser', 'Skill Extractor', 'ATS Compatibility Score', 'AI Improvement Tips'],
      riskScore: 80,
      deliveredPercent: 22
    },
    {
      id: 3,
      name: 'Increment 3: Aptitude Assessment Engine',
      description: 'Multiple-choice question engine for Quantitative Aptitude, Logical Reasoning, and Verbal Ability with timer and automated scoring.',
      badge: 'Module 3 - Aptitude Engine',
      features: ['Quant / Logical / Verbal MCQs', 'Countdown Timer', 'Automatic Evaluation', 'Detailed Solutions'],
      riskScore: 70,
      deliveredPercent: 33
    },
    {
      id: 4,
      name: 'Increment 4: Coding Challenge & Sandbox',
      description: 'Interactive code workspace with difficulty levels, test execution console, solution submission, and automated complexity evaluation.',
      badge: 'Module 4 - Coding Workspace',
      features: ['Code Editor Workspace', 'Multi-Language Support', 'Test Runner Console', 'Time/Space Complexity Grader'],
      riskScore: 60,
      deliveredPercent: 44
    },
    {
      id: 5,
      name: 'Increment 5: AI Mock Interview Engine',
      description: 'Simulates 1-on-1 interviews with dynamic AI follow-up questions generated via Gemini/OpenAI API and STAR evaluation card.',
      badge: 'Module 5 - AI Interview Bot',
      features: ['Technical / HR Round Setup', 'AI Question Generator', 'Turn-by-turn Feedback', 'STAR Report Card'],
      riskScore: 50,
      deliveredPercent: 55
    },
    {
      id: 6,
      name: 'Increment 6: Speech Recognition Suite',
      description: 'Web Speech API integration converting candidate spoken answers to text in real-time with review option before submission.',
      badge: 'Module 6 - Speech API',
      features: ['Web Speech-to-Text API', 'Audio Waveform Visualizer', 'Speech Pace Analytics', 'Hands-free Voice Input'],
      riskScore: 40,
      deliveredPercent: 66
    },
    {
      id: 7,
      name: 'Increment 7: Performance Dashboard',
      description: 'Centralized analytics dashboard tracking Aptitude, Coding, Resume ATS, and AI Mock Interview scores with history.',
      badge: 'Module 7 - Dashboard',
      features: ['Aptitude & Coding Score Tracking', 'Resume ATS Score History', 'Mock Interview Grades', 'Performance Radar Chart'],
      riskScore: 30,
      deliveredPercent: 77
    },
    {
      id: 8,
      name: 'Increment 8: Recruiter Evaluation Portal',
      description: 'Dedicated recruiter dashboard allowing hiring managers to view candidate assessment results, resumes, and interview feedback.',
      badge: 'Module 8 - Recruiter Portal',
      features: ['Candidate Master Directory', 'Full Assessment Dossier', 'Evaluation Notes & Decision', 'CSV Export'],
      riskScore: 20,
      deliveredPercent: 88
    },
    {
      id: 9,
      name: 'Increment 9: Email Service & Notifications',
      description: 'Nodemailer SMTP integration dispatching welcome emails, assessment result summaries, and recruiter decision notifications.',
      badge: 'Module 9 - Email Dispatch',
      features: ['Nodemailer Transporter', 'Welcome Email Dispatch', 'Score Result Notifications', 'Recruiter Decision Emails'],
      riskScore: 10,
      deliveredPercent: 100
    }
  ];

  const phaseSteps = [
    { key: 'req', label: '1. Requirements Analysis', icon: FileCheck, color: 'text-blue-500' },
    { key: 'design', label: '2. Architecture & Design', icon: Cpu, color: 'text-purple-500' },
    { key: 'code', label: '3. Coding & Implementation', icon: Code2, color: 'text-indigo-500' },
    { key: 'test', label: '4. Unit & System Testing', icon: Database, color: 'text-emerald-500' },
    { key: 'deploy', label: '5. Release & Deployment', icon: Zap, color: 'text-amber-500' }
  ];

  const [activeIncrementIdx, setActiveIncrementIdx] = useState(0);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [completedIncrements, setCompletedIncrements] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleNextPhase = () => {
    if (activePhaseIdx < phaseSteps.length - 1) {
      setActivePhaseIdx(prev => prev + 1);
    } else {
      // Completed full cycle for current increment
      if (!completedIncrements.includes(activeIncrementIdx)) {
        setCompletedIncrements(prev => [...prev, activeIncrementIdx]);
      }
      if (activeIncrementIdx < projectIncrements.length - 1) {
        setActiveIncrementIdx(prev => prev + 1);
        setActivePhaseIdx(0);
        addToast(`Increment ${activeIncrementIdx + 1} Released! Moving to Increment ${activeIncrementIdx + 2}`, 'success');
      } else {
        addToast('🎉 All Increments Deployed! Complete System is now Operational!', 'success');
      }
    }
  };

  const handleResetSim = () => {
    setActiveIncrementIdx(0);
    setActivePhaseIdx(0);
    setCompletedIncrements([]);
    addToast('Simulation reset to Initial State.', 'info');
  };

  const handleCompleteAll = () => {
    setActiveIncrementIdx(projectIncrements.length - 1);
    setActivePhaseIdx(phaseSteps.length - 1);
    setCompletedIncrements([0, 1, 2, 3]);
    addToast('Full system successfully built across all 4 Increments!', 'success');
  };

  // -------------------------------------------------------------
  // 2. COMPARISON ENGINE MATRIX
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('matrix');

  const comparisonData = [
    {
      attribute: 'Working Software Delivery',
      incremental: 'Early operational build delivered in Increment 1; expanded in subsequent builds.',
      waterfall: 'Working software delivered only at the very end of the final phase.',
      agile: 'Working software delivered continuously in short 1-4 week sprints.'
    },
    {
      attribute: 'Flexibility to Requirement Changes',
      incremental: 'High flexibility between increments; requirements for upcoming builds can be adjusted.',
      waterfall: 'Extremely rigid; changes after design phase are difficult and costly.',
      agile: 'Maximum flexibility; requirements continuously evolve based on user stories.'
    },
    {
      attribute: 'Customer / Client Involvement',
      incremental: 'Moderate to High; customer reviews functional builds at the end of each increment.',
      waterfall: 'Low; customer involved mainly at initial requirements and final delivery.',
      agile: 'Continuous; customer/product owner participates daily or per sprint demo.'
    },
    {
      attribute: 'Risk of Total Project Failure',
      incremental: 'Low; core system is validated early in Increment 1.',
      waterfall: 'High; defects discovered late during system testing can derail launch.',
      agile: 'Very Low; frequent releases ensure rapid problem identification.'
    },
    {
      attribute: 'Architecture & Initial Planning',
      incremental: 'Requires robust initial architecture design upfront to support modular add-ons.',
      waterfall: 'Requires complete detailed specifications for the entire system upfront.',
      agile: 'Iterative architecture design that grows dynamically sprint by sprint.'
    },
    {
      attribute: 'Cost of Change',
      incremental: 'Moderate; changes in future increments are easy, changes in completed modules need re-testing.',
      waterfall: 'Very High; requires repeating entire sequential phases.',
      agile: 'Low; changes are prioritized in upcoming sprint backlogs.'
    }
  ];

  // -------------------------------------------------------------
  // 3. PRACTICE QUIZ STATE
  // -------------------------------------------------------------
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get('/sdlc/incremental-model/questions');
        if (res.data && res.data.questions) {
          setQuestions(res.data.questions);
        }
      } catch (err) {
        console.warn('[SDLC Questions Warning]', err);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectOption = (qId, option) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = () => {
    let s = 0;
    questions.forEach(q => {
      if (userAnswers[q._id] === q.correctAnswer) {
        s += 1;
      }
    });
    setScore(s);
    setQuizSubmitted(true);
    addToast(`Quiz Evaluated! Score: ${s} / ${questions.length}`, 'success');
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  // -------------------------------------------------------------
  // 4. AI TUTOR STATE
  // -------------------------------------------------------------
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorResponse, setTutorResponse] = useState('');

  const promptChips = [
    'Explain Incremental Model to a computer science fresher.',
    'Difference between Incremental Model and Iterative Model?',
    'What are the advantages and disadvantages of Incremental Model?',
    'When should a company choose Incremental Model over Waterfall?',
    'Top 5 viva questions on Incremental SDLC model.'
  ];

  const handleAskTutor = async (queryText) => {
    const q = queryText || tutorQuery;
    if (!q || !q.trim()) {
      addToast('Please enter a question for the AI Tutor.', 'warning');
      return;
    }
    setTutorLoading(true);
    setTutorResponse('');
    try {
      const res = await API.post('/sdlc/incremental-model/ai-tutor', { query: q });
      setTutorResponse(res.data.explanation || 'No response returned from AI Tutor.');
    } catch (err) {
      setTutorResponse('Failed to connect to AI Tutor server. Please try again.');
    } finally {
      setTutorLoading(false);
    }
  };

  const currentInc = projectIncrements[activeIncrementIdx];
  const currentPhase = phaseSteps[activePhaseIdx];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-fadeIn">
      
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER SECTION */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-purple via-indigo-700 to-brand-blue text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-300" /> SDLC Process Model
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-gray-900 text-xs font-black">
              Placement Essential
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/30">
              Interactive Simulator Included
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              The Incremental Model in Software Engineering
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-3xl leading-relaxed">
              Master the **Incremental SDLC Model** where software requirements are split into multiple standalone builds. Learn how core features are delivered early in **Increment 1**, followed by iterative enhancements to reduce risk and deliver value faster.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Delivery Style</div>
              <div className="text-lg font-black text-white mt-0.5">Iterative Builds</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Core MVP Release</div>
              <div className="text-lg font-black text-amber-300 mt-0.5">Increment 1</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Risk Reduction</div>
              <div className="text-lg font-black text-emerald-300 mt-0.5">Up to -75%</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">System Architecture</div>
              <div className="text-lg font-black text-white mt-0.5">Modular Upfront</div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODULE 1: INTERACTIVE INCREMENTAL BUILD SIMULATOR */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border-l-4 border-l-brand-purple">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-brand-purple uppercase tracking-wider mb-1">
              <Play className="w-4 h-4" /> Live Interactive Simulation
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Building InterviewPro via Incremental SDLC Model
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Simulate building a real-world AI software application step-by-step across 4 standalone increments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSim}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border text-gray-600 dark:text-gray-300 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={handleCompleteAll}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Complete All
            </button>
          </div>
        </div>

        {/* Increments Progress Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {projectIncrements.map((inc, idx) => {
            const isCurrent = idx === activeIncrementIdx;
            const isDone = completedIncrements.includes(idx);
            return (
              <div
                key={inc.id}
                onClick={() => {
                  setActiveIncrementIdx(idx);
                  setActivePhaseIdx(0);
                }}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-gradient-to-b from-brand-purple/10 to-indigo-600/5 border-brand-purple shadow-lg ring-2 ring-brand-purple/30'
                    : isDone
                    ? 'bg-emerald-500/5 border-emerald-500/40 text-gray-700 dark:text-gray-300'
                    : 'bg-gray-50 dark:bg-dark-border/40 border-gray-200 dark:border-dark-border opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-brand-purple text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {isDone ? '✓ Deployed' : isCurrent ? '⚡ Active' : `Pending`}
                  </span>
                  <span className="text-xs font-black text-gray-400">Inc #{inc.id}</span>
                </div>

                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white leading-snug">
                  {inc.name}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {inc.description}
                </p>

                {/* Micro Progress Indicator */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border/60 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-400">System Built:</span>
                  <span className={isDone ? 'text-emerald-500 font-black' : isCurrent ? 'text-brand-purple font-black' : 'text-gray-400'}>
                    {inc.deliveredPercent}% Complete
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Increment Execution Workspace */}
        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-dark-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-purple/20 text-brand-purple text-[10px] font-extrabold uppercase">
                  {currentInc.badge}
                </span>
                <span className="text-xs font-extrabold text-gray-400">
                  Target Product Release #{currentInc.id}
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                {currentInc.name}
              </h3>
            </div>

            {/* Next Phase Action Button */}
            <button
              onClick={handleNextPhase}
              className="btn-gradient px-6 py-3 rounded-2xl font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Execute Phase Step: {currentPhase.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Phase Steps Pipeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {phaseSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPhaseActive = idx === activePhaseIdx;
              const isPhasePassed = idx < activePhaseIdx || completedIncrements.includes(activeIncrementIdx);
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isPhaseActive
                      ? 'bg-brand-purple text-white font-extrabold shadow-md scale-105 border-brand-purple'
                      : isPhasePassed
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400'
                  }`}
                >
                  <StepIcon className={`w-4 h-4 mx-auto mb-1 ${isPhaseActive ? 'text-amber-300 animate-bounce' : isPhasePassed ? 'text-emerald-500' : 'text-gray-400'}`} />
                  <div className="text-[11px] leading-tight">{step.label}</div>
                  <div className="text-[9px] mt-0.5 opacity-80">
                    {isPhasePassed ? '✓ Complete' : isPhaseActive ? '⚡ In Progress' : 'Queued'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Increment Delivered Features & Risk Metric Breakdown */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Operational Features Delivered in Increment #{currentInc.id}:
              </h4>
              <div className="space-y-2">
                {currentInc.features.map((feat, fIdx) => (
                  <div key={fIdx} className="p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-2 shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-brand-purple" /> Incremental System Risk & Maturity Curve:
              </h4>

              <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-4 shadow-sm">
                <div>
                  <div className="flex justify-between text-xs font-extrabold mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Total System Build Completion:</span>
                    <span className="text-brand-purple">{currentInc.deliveredPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-purple to-indigo-600 transition-all duration-500"
                      style={{ width: `${currentInc.deliveredPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-extrabold mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Project Risk Level:</span>
                    <span className="text-rose-500 font-black">{currentInc.riskScore}% Risk Remaining</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-500"
                      style={{ width: `${currentInc.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                  💡 **SDLC Key Insight**: Notice how project risk drops sharply after Increment 1 is deployed! Core authentication and database schemas are verified before building complex AI features.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODULE 2: VISUAL SDLC PHASE ARCHITECTURE */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-gray-100 dark:border-dark-border pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-black text-brand-blue uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" /> SDLC Lifecycle Anatomy
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            How the Incremental Model Works (Phase Flow)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Every individual increment functions as a complete mini-SDLC lifecycle with its own requirements, design, coding, testing, and deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
              01
            </div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Requirements Partitioning</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              High-level system requirements are gathered and partitioned into high-priority core modules vs secondary optional modules.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xs">
              02
            </div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Modular Architecture Design</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Architects design clean interfaces and APIs upfront so future increments can plug seamlessly into existing modules without code breaking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
              03
            </div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Increment Build Development</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Developers write code for the specific increment features (e.g. Increment 1 Auth, Increment 2 Quiz, Increment 3 AI Engine).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
              04
            </div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Integration & System Testing</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              The newly completed increment is integrated with previously released increments and regression testing is executed.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs">
              05
            </div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Operational Build Release</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              The working build is released to end users. Customer feedback is collected to refine requirements for subsequent increments.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODULE 3: COMPARISON MATRIX (INCREMENTAL VS WATERFALL VS AGILE) */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-gray-100 dark:border-dark-border pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-wider mb-1">
            <BarChart2 className="w-4 h-4" /> SDLC Model Comparison Matrix
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Incremental Model vs. Waterfall vs. Agile
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Compare key software development life cycle methodologies commonly asked in placement technical interviews.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-100 dark:bg-dark-border/60 text-gray-900 dark:text-white">
                <th className="p-4 font-black uppercase text-[11px]">Evaluation Dimension</th>
                <th className="p-4 font-black uppercase text-[11px] text-brand-purple bg-brand-purple/10 border-x border-brand-purple/20">
                  ⚡ Incremental Model
                </th>
                <th className="p-4 font-black uppercase text-[11px] text-blue-600 dark:text-blue-400">
                  🌊 Waterfall Model
                </th>
                <th className="p-4 font-black uppercase text-[11px] text-emerald-600 dark:text-emerald-400">
                  🏃 Agile Model
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition">
                  <td className="p-4 font-extrabold text-gray-900 dark:text-white whitespace-nowrap">
                    {row.attribute}
                  </td>
                  <td className="p-4 font-semibold text-gray-800 dark:text-gray-200 bg-brand-purple/5 border-x border-brand-purple/10">
                    {row.incremental}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {row.waterfall}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {row.agile}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODULE 4: PRACTICE QUIZ & ASSESSMENT */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border-l-4 border-l-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> Placement Knowledge Assessment
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Incremental Model Practice Questions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Test your understanding of Incremental SDLC concepts before your campus placement technical round.
            </p>
          </div>

          {quizSubmitted && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </div>
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl text-xs font-extrabold border border-gray-200 dark:border-dark-border hover:bg-gray-100 transition"
              >
                Retry Quiz
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const selectedOpt = userAnswers[q._id];
            const isCorrect = selectedOpt === q.correctAnswer;
            return (
              <div
                key={q._id}
                className={`p-6 rounded-2xl border transition-all space-y-4 ${
                  quizSubmitted
                    ? isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/40'
                      : 'bg-rose-500/5 border-rose-500/40'
                    : 'bg-gray-50 dark:bg-dark-border/40 border-gray-200 dark:border-dark-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {idx + 1}. {q.questionText}
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-gray-200 dark:bg-dark-border text-gray-600 dark:text-gray-300">
                    {q.difficulty}
                  </span>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-extrabold">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === opt;
                    let optStyle = 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:border-brand-purple';

                    if (quizSubmitted) {
                      if (opt === q.correctAnswer) {
                        optStyle = 'bg-emerald-500 text-white border-emerald-600 shadow';
                      } else if (isSelected && !isCorrect) {
                        optStyle = 'bg-rose-500 text-white border-rose-600 shadow';
                      } else {
                        optStyle = 'bg-gray-100 dark:bg-dark-border text-gray-400 border-transparent opacity-60';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-brand-purple text-white border-brand-purple shadow-md';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q._id, opt)}
                        disabled={quizSubmitted}
                        className={`p-3.5 rounded-xl border text-left transition-all ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Solution Explanation Display */}
                {quizSubmitted && (
                  <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-xs space-y-1.5">
                    <div className="font-extrabold text-brand-purple flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Explanation & Reference:
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {q.explanation}
                    </p>
                    {q.referenceNotes && (
                      <div className="text-[11px] font-bold text-amber-500">
                        💡 Key Takeaway: {q.referenceNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!quizSubmitted && questions.length > 0 && (
          <div className="pt-2 text-center">
            <button
              onClick={handleSubmitQuiz}
              className="btn-gradient px-8 py-3 rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-all"
            >
              Submit & Grade Quiz
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODULE 5: 24/7 AI INCREMENTAL MODEL TUTOR */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-gray-100 dark:border-dark-border pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-black text-brand-purple uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" /> 24/7 AI SDLC Professor
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Ask AI Tutor About Incremental Model
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Get instant AI explanations, real-world examples, and viva answer scripts for any Incremental Model doubt.
          </p>
        </div>

        {/* Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTutorQuery(chip);
                handleAskTutor(chip);
              }}
              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-border hover:bg-brand-purple hover:text-white text-gray-700 dark:text-gray-300 text-xs font-bold transition-all"
            >
              💡 "{chip}"
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={tutorQuery}
            onChange={(e) => setTutorQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
            placeholder="Type your question about Incremental SDLC Model..."
            className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border text-xs focus:ring-2 focus:ring-brand-purple text-gray-900 dark:text-white outline-none"
          />
          <button
            onClick={() => handleAskTutor()}
            disabled={tutorLoading}
            className="btn-gradient px-6 py-3 rounded-2xl font-bold text-xs shadow-md flex items-center gap-2 shrink-0"
          >
            {tutorLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask AI</span>
              </>
            )}
          </button>
        </div>

        {/* AI Tutor Response Output */}
        {tutorResponse && (
          <div className="p-6 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-brand-purple text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Professor Answer Breakdown:
            </div>
            <div className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line font-sans">
              {tutorResponse}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default IncrementalModel;
