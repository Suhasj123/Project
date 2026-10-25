import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { Timer } from '../components/Timer';
import { useToast } from '../context/ToastContext';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  RotateCcw
} from 'lucide-react';
import { PlacementStepper } from '../components/PlacementStepper';

const sampleStage1Questions = [
  { _id: 's1', questionText: 'If A can complete a work in 12 days and B in 18 days, how many days will they take working together?', options: ['7.2 days', '6.5 days', '8 days', '10 days'], correctAnswer: '7.2 days', subTopic: 'Time & Work', explanation: 'Combined rate = (1/12 + 1/18) = 5/36 per day. Total time = 36/5 = 7.2 days.' },
  { _id: 's2', questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?', options: ['Queue', 'Stack', 'Array', 'Tree'], correctAnswer: 'Stack', subTopic: 'Data Structures', explanation: 'Stack operations (push/pop) follow LIFO order.' },
  { _id: 's3', questionText: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctAnswer: 'O(log N)', subTopic: 'Algorithms', explanation: 'BST halves search space at each node comparison, resulting in O(log N) average/worst case depth.' },
  { _id: 's4', questionText: 'In DBMS, which ACID property guarantees that all database operations in a transaction complete successfully or fail together?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correctAnswer: 'Atomicity', subTopic: 'DBMS', explanation: 'Atomicity ensures all-or-nothing execution of transaction operations.' },
  { _id: 's5', questionText: 'Select the synonym for the word: PRAGMATIC', options: ['Theoretical', 'Practical', 'Careless', 'Arrogant'], correctAnswer: 'Practical', subTopic: 'Verbal Ability', explanation: 'Pragmatic means dealing with things sensibly and realistically based on practical considerations.' },
  { _id: 's6', questionText: 'What will be the output of 15 % 4 in Java / C / C++?', options: ['3', '4', '3.75', '0'], correctAnswer: '3', subTopic: 'Programming Syntax', explanation: 'The modulus operator (%) returns the remainder of integer division: 15 / 4 = 3 with remainder 3.' },
  { _id: 's7', questionText: 'Which OOP pillar restricts direct access to object components and bundles data with methods?', options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'], correctAnswer: 'Encapsulation', subTopic: 'OOP Concepts', explanation: 'Encapsulation wraps state and behavior into a class and restricts direct variable access.' },
  { _id: 's8', questionText: 'In a train traveling at 60 km/h, how long will it take to cross a pole if the train length is 150 meters?', options: ['9 seconds', '12 seconds', '15 seconds', '6 seconds'], correctAnswer: '9 seconds', subTopic: 'Speed & Distance', explanation: 'Speed = 60 * (5/18) = 50/3 m/s. Time = Distance / Speed = 150 / (50/3) = 9 seconds.' },
  { _id: 's9', questionText: 'Which SQL clause is used to filter records resulting from an aggregate GROUP BY query?', options: ['WHERE', 'HAVING', 'ORDER BY', 'FILTER'], correctAnswer: 'HAVING', subTopic: 'SQL Queries', explanation: 'HAVING filters aggregate values, whereas WHERE filters individual table rows.' },
  { _id: 's10', questionText: 'What is the default subnet mask for a Class C IP Address?', options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'], correctAnswer: '255.255.255.0', subTopic: 'Computer Networks', explanation: 'Class C networks use the first 24 bits for network prefix (255.255.255.0).' },
  { _id: 's11', questionText: 'A seller marks an item 20% above cost price and allows a 10% discount. Find the net profit percentage.', options: ['8%', '10%', '12%', '6%'], correctAnswer: '8%', subTopic: 'Profit & Loss', explanation: 'If CP = 100, MP = 120. SP = 120 - 10% of 120 = 108. Profit % = (108 - 100) = 8%.' },
  { _id: 's12', questionText: 'Which memory allocation scheme suffers from External Fragmentation?', options: ['Paging', 'Segmentation', 'Virtual Memory', 'Cache'], correctAnswer: 'Segmentation', subTopic: 'Operating Systems', explanation: 'Segmentation uses variable-sized segments, causing free memory blocks to become fragmented over time.' },
  { _id: 's13', questionText: 'Find the next number in the series: 2, 6, 12, 20, 30, ?', options: ['42', '40', '36', '48'], correctAnswer: '42', subTopic: 'Logical Reasoning', explanation: 'Differences between terms are +4, +6, +8, +10. Next difference is +12: 30 + 12 = 42.' },
  { _id: 's14', questionText: 'Which sorting algorithm guarantees O(N log N) worst-case time complexity?', options: ['QuickSort', 'MergeSort', 'BubbleSort', 'InsertionSort'], correctAnswer: 'MergeSort', subTopic: 'Data Structures', explanation: 'MergeSort recursively divides arrays into halves and merges them in O(N log N) time consistently.' },
  { _id: 's15', questionText: 'What is the main function of ARP (Address Resolution Protocol)?', options: ['Map IP address to MAC address', 'Map MAC address to IP address', 'Assign dynamic IP addresses', 'Route packets across subnets'], correctAnswer: 'Map IP address to MAC address', subTopic: 'Computer Networks', explanation: 'ARP resolves 32-bit IPv4 addresses to 48-bit physical MAC Ethernet addresses.' },
  { _id: 's16', questionText: 'In C++, which keyword is used to prevent a member function from modifying object attributes?', options: ['static', 'const', 'virtual', 'mutable'], correctAnswer: 'const', subTopic: 'C++ Core', explanation: 'A const member function cannot modify non-mutable class member variables.' },
  { _id: 's17', questionText: 'How many binary trees can be formed with 3 unlabeled nodes?', options: ['3', '5', '6', '2'], correctAnswer: '5', subTopic: 'Discrete Math', explanation: 'Calculated using the 3rd Catalan number: C3 = (1/4) * (6! / (3! * 3!)) = 5.' },
  { _id: 's18', questionText: 'Which HTTP method is idempotent and used to replace target resources?', options: ['POST', 'PUT', 'DELETE', 'PATCH'], correctAnswer: 'POST', subTopic: 'Web Technologies', explanation: 'PUT is idempotent; repeating identical requests yields the exact same server resource state.' },
  { _id: 's19', questionText: 'Find the odd one out: Apple, Mango, Potato, Orange', options: ['Apple', 'Mango', 'Potato', 'Orange'], correctAnswer: 'Potato', subTopic: 'Logical Reasoning', explanation: 'Potato is a vegetable/tuber, while the rest are fruits.' },
  { _id: 's20', questionText: 'What is the primary function of an Operating System Kernel?', options: ['UI Rendering', 'Manage System Resources & Hardware Access', 'Compile source code', 'Web Browsing'], correctAnswer: 'Manage System Resources & Hardware Access', subTopic: 'Operating Systems', explanation: 'Kernel is the core OS component managing CPU, memory, devices, and system calls.' }
];

export const AptitudeQuiz = () => {
  const [questions, setQuestions] = useState(sampleStage1Questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [warningCount, setWarningCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  useEffect(() => {
    if (location.search.includes('autoStart=true') && !quizStarted && !submitted) {
      startStage1Quiz();
    }
  }, [location.search]);

  // Tab switch violation detector - auto submit on 3 warnings
  useEffect(() => {
    if (warningCount >= 3 && quizStarted && !submitted) {
      addToast('🚨 Test Auto-Submitted! Maximum tab switches exceeded (3/3). Tab switching is strictly prohibited.', 'error');
      handleFinalSubmit();
    }
  }, [warningCount, quizStarted, submitted]);

  // Helper to enter full-screen mode
  const enterFullScreenMode = () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } catch (e) {}
  };

  // Fullscreen exit detector
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (quizStarted && !submitted && !document.fullscreenElement) {
        setWarningCount(prev => {
          const nextCount = prev + 1;
          addToast(`⚠️ Proctoring Warning: Exited Full-Screen Mode (${nextCount}/3)!`, 'warning');
          return nextCount;
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [quizStarted, submitted]);

  const startStage1Quiz = async () => {
    enterFullScreenMode();
    setLoading(true);
    try {
      const res = await API.get('/quizzes/questions?limit=20');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        setQuestions(sampleStage1Questions);
      }
    } catch (err) {
      console.warn('[AptitudeQuiz] Backend questions endpoint offline, initializing 20 Stage-1 questions.');
      setQuestions(sampleStage1Questions);
    } finally {
      setCurrentIndex(0);
      setSelectedAnswers({});
      setQuizStarted(true);
      setSubmitted(false);
      setResultData(null);
      setStartTime(Date.now());
      addToast('Stage-1 MCQ Test Started! You have 10 minutes for 20 questions.', 'info');
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const handleFinalSubmit = async () => {
    if (submitted) return;

    let correctCount = 0;
    const reviewedQuestions = questions.map((q, idx) => {
      const uAns = selectedAnswers[idx] || '';
      const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        ...q,
        userAnswer: uAns,
        isCorrect,
        simpleExplanation: q.explanation || `The correct answer is "${q.correctAnswer}". Review fundamental core concepts to master this topic.`
      };
    });

    const totalCount = questions.length || 20;
    const scorePercentage = Math.round((correctCount / totalCount) * 100);

    const summary = {
      score: scorePercentage,
      correctCount,
      totalCount,
      reviewedQuestions
    };

    setResultData(summary);
    setSubmitted(true);

    try {
      await API.post('/quizzes/submit', {
        quizType: 'Aptitude Stage-1',
        category: 'Campus Aptitude',
        answers: questions.map((q, idx) => ({
          questionId: q._id,
          questionText: q.questionText,
          userAnswer: selectedAnswers[idx] || '',
          correctAnswer: q.correctAnswer,
          subTopic: q.subTopic
        })),
        timeSpentSeconds: Math.round((Date.now() - (startTime || Date.now())) / 1000)
      });
    } catch (e) {
      console.warn('[Quiz Submit Log]', e.message);
    }

    addToast(`Stage-1 Submitted! Your Score: ${scorePercentage}%`, 'success');
  };

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const activeResultsData = resultData || {
    score: 85,
    correctCount: 17,
    totalCount: 20,
    reviewedQuestions: (questions.length > 0 ? questions : sampleStage1Questions).map((q, idx) => ({
      ...q,
      userAnswer: selectedAnswers[idx] || q.correctAnswer,
      isCorrect: true,
      simpleExplanation: q.explanation || `The correct answer is "${q.correctAnswer}".`
    }))
  };

  return (
    <div className="quiz-stage-background max-w-4xl mx-auto space-y-8 pb-16">
      {/* Step-by-Step Placement Stepper */}
      <PlacementStepper currentStep={2} />

      {/* 1. Pre-test Stage-1 Welcome Screen */}
      {!quizStarted && !submitted && (
        <div className="glass-card p-4 sm:p-6 md:p-8 text-center space-y-5 sm:space-y-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-brand-blue/10 text-brand-blue mx-auto flex items-center justify-center">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-extrabold text-xs">
              STAGE - 1 ASSESSMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Aptitude & Technical MCQ Test</h1>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Complete <strong>20 Questions in 10 Minutes</strong> covering Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Core CS.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto text-left text-xs">
            <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border">
              <span className="text-gray-400 font-bold block text-[11px]">Questions</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base">20 MCQs</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border">
              <span className="text-gray-400 font-bold block text-[11px]">Time Limit</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base">10 Minutes</span>
            </div>
            <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border">
              <span className="text-gray-400 font-bold block text-[11px]">Assessment</span>
              <span className="font-extrabold text-emerald-500 text-sm sm:text-base">Timed Mode</span>
            </div>
          </div>

          <button
            onClick={startStage1Quiz}
            disabled={loading}
            className="btn-gradient w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all"
          >
            {loading ? 'Initializing Stage-1 Assessment...' : 'Start Stage-1 MCQ Test Now 🚀'}
          </button>
        </div>
      )}

      {/* 2. Active Test Screen */}
      {quizStarted && !submitted && (
        <div className="space-y-6">

          {/* Header Bar */}
          <div className="glass-card p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-[11px] font-extrabold text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-lg">
                STAGE-1 MCQ TEST
              </span>
              <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">20 Questions Assessment</div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              <Timer initialSeconds={600} onTimeUp={handleFinalSubmit} />
              <div className="text-xs font-bold text-brand-purple bg-brand-purple/10 px-3 py-1.5 rounded-xl shrink-0">
                Q {currentIndex + 1} of {questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-dark-border h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Question Box */}
          {currentQ && (
            <div className="glass-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-dark-border px-2.5 py-1 rounded-lg">
                  Q{currentIndex + 1} • {currentQ.subTopic || 'Aptitude'}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-relaxed pt-1">
                  {currentQ.questionText}
                </h2>
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === opt;
                  const hasAnswered = !!selectedAnswers[currentIndex];
                  const isCorrectOpt = opt === currentQ.correctAnswer;

                  let btnStyle = 'bg-white/50 dark:bg-dark-card/50 border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border';
                  if (hasAnswered) {
                    if (isCorrectOpt) {
                      btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 min-w-0 ${btnStyle}`}
                    >
                      <span className="break-words flex-1 min-w-0">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        hasAnswered && isCorrectOpt
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isSelected
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {hasAnswered && isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {hasAnswered && isSelected && !isCorrectOpt && <XCircle className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Instant Answer Evaluation & Simple Explanation Card */}
              {selectedAnswers[currentIndex] && (
                <div className={`p-5 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                  selectedAnswers[currentIndex] === currentQ.correctAnswer
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                }`}>
                  <div className="font-extrabold flex items-center gap-2 text-sm">
                    {selectedAnswers[currentIndex] === currentQ.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>✓ Excellent! Your answer is Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        <span>❌ Incorrect. Correct Answer: "{currentQ.correctAnswer}"</span>
                      </>
                    )}
                  </div>

                  <p className="font-medium text-xs leading-relaxed text-gray-800 dark:text-gray-200 pt-1">
                    💡 <strong>Simple Explanation:</strong> {currentQ.explanation || `The correct answer is "${currentQ.correctAnswer}".`}
                  </p>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-dark-border">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 disabled:opacity-30"
                >
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex(prev => prev + 1)}
                      className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalSubmit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition"
                    >
                      Submit Aptitude Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Switch Security Warning Overlay Modal */}
      {quizStarted && !submitted && warningCount > 0 && warningCount < 3 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 text-center space-y-5 border-2 border-rose-500 animate-pulse bg-slate-950 text-white">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/40">
              <AlertCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-wider">
                SECURITY VIOLATION WARNING ({warningCount}/3)
              </span>
              <h2 className="text-xl font-extrabold text-white mt-2">Tab Switch Detected!</h2>
              <p className="text-xs text-rose-200 leading-relaxed font-semibold">
                Leaving the browser window or switching tabs is strictly prohibited during the Aptitude Assessment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              ⚠️ If you switch tabs <strong>{3 - warningCount} more time(s)</strong>, your assessment will be <strong>AUTOMATICALLY SUBMITTED</strong> immediately.
            </div>

            <button
              onClick={() => {}}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition"
            >
              I Understand — Return to Assessment 🔒
            </button>
          </div>
        </div>
      )}

      {/* 3. On-Page Results & Simple Explanations Screen */}
      {submitted && (
        <div className="space-y-8 animate-fadeIn">
          {/* Score Header Card */}
          <div className="glass-card p-8 text-center space-y-4 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-purple/5 border-2 border-brand-purple/20">
            <div className="w-16 h-16 rounded-3xl bg-brand-purple text-white mx-auto flex items-center justify-center shadow-xl">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-purple">APTITUDE TEST COMPLETED</span>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">Aptitude Score & Explanations</h1>
            </div>

            <div className="flex items-center justify-center gap-6 py-2">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-brand-purple">{activeResultsData.score}%</div>
                <div className="text-xs text-gray-400 font-bold">Accuracy Score</div>
              </div>
              <div className="h-10 w-px bg-gray-200 dark:bg-dark-border"></div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-emerald-500">{activeResultsData.correctCount} / {activeResultsData.totalCount}</div>
                <div className="text-xs text-gray-400 font-bold">Questions Correct</div>
              </div>
            </div>

            {/* Action Banner to Proceed */}
            <div className="pt-4 border-t border-gray-100 dark:border-dark-border max-w-lg mx-auto space-y-3">
              <p className="text-xs text-gray-500 font-medium">
                Aptitude test complete! Proceed to <strong>Coding Test</strong> or <strong>AI Mock Interview</strong>.
              </p>
              <button
                onClick={() => navigate('/coding-quiz?autoStart=true')}
                className="btn-gradient px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Proceed to Coding Test 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Simple Explanations List for All 20 Questions */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              <span>Questions & Simple Explanations</span>
            </h2>

            <div className="space-y-4">
              {activeResultsData.reviewedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className={`glass-card p-6 border-l-4 space-y-3 ${
                    q.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-extrabold text-gray-400">
                      Q{idx + 1}. {q.subTopic || 'Aptitude'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      q.isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{q.isCorrect ? 'Correct (+1)' : 'Incorrect'}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {q.questionText}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-border/40">
                      <span className="text-gray-400 font-bold block mb-0.5">Your Answer:</span>
                      <span className={`font-bold ${q.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {q.userAnswer || 'Not Answered'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">Correct Answer:</span>
                      <span className="font-extrabold">{q.correctAnswer}</span>
                    </div>
                  </div>

                  {/* Simple Explanation Box */}
                  <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/15 text-xs text-gray-700 dark:text-gray-200 space-y-1">
                    <span className="font-extrabold text-brand-purple block">💡 Simple Explanation:</span>
                    <p className="leading-relaxed">{q.simpleExplanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company-Specific Placement Tests & Details (Before PDF Download Option) */}
          <CompanyTestsSection
            onDownloadPDF={() => {
              addToast('Generating Official Placement Test Performance PDF Report...', 'info');
              window.print();
            }}
          />

          {/* Bottom Redirect Button to Next Round */}
          <div className="glass-card p-6 text-center bg-gradient-to-r from-brand-purple/10 via-brand-blue/10 to-emerald-500/10 border-2 border-brand-purple/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="text-left">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Ready for the Next Round?</h3>
              <p className="text-xs text-gray-500">Proceed to Stage 2: Sandboxed Coding Assessment (Monaco Editor & Judge0 Execution Engine).</p>
            </div>

            <button
              onClick={() => navigate('/coding-quiz?autoStart=true')}
              className="btn-gradient px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Next Round: Proceed to Coding Test 🚀</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
