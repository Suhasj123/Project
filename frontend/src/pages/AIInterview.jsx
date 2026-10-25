import React, { useState } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Award,
  Send,
  RotateCcw,
  User,
  ShieldCheck
} from 'lucide-react';

export const AIInterview = () => {
  const [interviewType, setInterviewType] = useState('Technical');
  const [domain, setDomain] = useState('Java');
  const [difficulty, setDifficulty] = useState('Medium');

  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [started, setStarted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const { addToast } = useToast();

  const types = ['Technical', 'HR', 'Behavioral'];
  const domains = ['Java', 'Python', 'MERN', 'SQL', 'C++', 'General HR'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const startInterview = async () => {
    setEvaluating(true);
    try {
      const res = await API.get(`/interviews/questions?interviewType=${interviewType}&domain=${domain}&difficulty=${difficulty}`);
      setQuestions(res.data.questions || []);
      setCurrentStep(0);
      setUserAnswers({});
      setCurrentInput('');
      setStarted(true);
      setEvaluationResult(null);
      addToast(`AI Mock Interview initiated for ${domain}!`, 'info');
    } catch (err) {
      addToast('Failed to initialize AI interview.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    setUserAnswers(prev => ({
      ...prev,
      [currentStep]: currentInput
    }));

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCurrentInput('');
    } else {
      // Complete interview & request AI Evaluation
      evaluateInterviewSession({
        ...userAnswers,
        [currentStep]: currentInput
      });
    }
  };

  const evaluateInterviewSession = async (allAnswers) => {
    setEvaluating(true);
    const qaPairs = questions.map((q, idx) => ({
      question: q,
      userAnswer: allAnswers[idx] || 'No response provided.'
    }));

    try {
      const res = await API.post('/interviews/submit', {
        interviewType,
        domain,
        difficulty,
        qaPairs
      });
      setEvaluationResult(res.data);
      addToast('AI Evaluation Complete!', 'success');
    } catch (err) {
      addToast('Error generating AI evaluation report.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16 min-w-0">
      {!started ? (
        /* Setup Modal/Card */
        <div className="glass-card p-5 sm:p-7 md:p-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mx-auto flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">AI Mock Interview Portal</h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Simulate real-time 1-on-1 technical and HR interview rounds with automated AI feedback.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Interview Type */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">1. Select Interview Type</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setInterviewType(t)}
                    className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold border transition ${
                      interviewType === t
                        ? 'bg-brand-blue/10 border-brand-blue text-brand-blue dark:text-white'
                        : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">2. Select Technical Domain</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {domains.map(d => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                      domain === d
                        ? 'btn-gradient shadow-md'
                        : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">3. Select Difficulty</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold border transition ${
                      difficulty === diff
                        ? 'bg-brand-purple/10 border-brand-purple text-brand-purple dark:text-white'
                        : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={evaluating}
              className="btn-gradient w-full py-3.5 sm:py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] transition-all"
            >
              {evaluating ? 'Connecting to AI Interviewer...' : 'Begin Mock Interview Now 🤖'}
            </button>
          </div>
        </div>
      ) : evaluationResult ? (
        /* Evaluation Results View */
        <div className="glass-card p-5 sm:p-7 md:p-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Interview Performance Report</h2>
            <p className="text-xs text-gray-500">{interviewType} Round • {domain} • {difficulty} Level</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-dark-border/40 text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-purple">{evaluationResult.overallScore}/100</div>
              <div className="text-xs font-bold text-gray-500 uppercase">Overall Rating</div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-dark-border/40 text-center space-y-2">
              <div className="text-lg sm:text-xl font-bold text-brand-blue capitalize">{evaluationResult.confidenceRating}</div>
              <div className="text-xs font-bold text-gray-500 uppercase">Confidence Level</div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-dark-border/40 text-center space-y-2">
              <div className="text-lg sm:text-xl font-bold text-emerald-500">{evaluationResult.qaPairs?.length || 4} / 4 Answered</div>
              <div className="text-xs font-bold text-gray-500 uppercase">Completion Rate</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 text-sm">Communication Feedback</h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{evaluationResult.communicationFeedback}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <h4 className="font-bold text-purple-600 dark:text-purple-400 text-sm">Technical Accuracy Feedback</h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{evaluationResult.technicalFeedback}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <h4 className="font-bold text-amber-600 dark:text-amber-400 text-sm">Key Improvement Suggestions</h4>
              <ul className="list-disc list-inside text-xs text-gray-700 dark:text-gray-300 space-y-1">
                {evaluationResult.suggestions?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setStarted(false)}
            className="btn-gradient w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Another Mock Interview</span>
          </button>
        </div>
      ) : (
        /* Active Interview Simulation Chat */
        <div className="glass-card p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center font-bold text-sm shrink-0">
                AI
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm truncate">Senior {domain} Interviewer</h3>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 shrink-0" /> Live Round Active
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-brand-purple bg-brand-purple/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shrink-0">
              {currentStep + 1} / {questions.length}
            </span>
          </div>

          {/* AI Question Statement */}
          <div className="p-4 sm:p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
            <span className="text-[10px] uppercase font-bold text-indigo-500">Interviewer Asks:</span>
            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
              "{questions[currentStep]}"
            </p>
          </div>

          {/* User Response Form */}
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block">Your Answer (Speak or Type):</label>
              <textarea
                rows={5}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your structured explanation here (e.g. Explain core concepts, syntax, or scenario)..."
                className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentInput("In Java, memory management is split between Stack and Heap. Primitive types and local variables live in Stack memory, while Objects created with new live in Heap memory.")}
                className="text-xs font-semibold text-brand-purple hover:underline"
              >
                💡 Insert Sample Answer
              </button>

              <button
                type="submit"
                disabled={evaluating || !currentInput.trim()}
                className="btn-gradient w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <span>{currentStep < questions.length - 1 ? 'Submit & Next Question' : 'Complete & Get AI Grade'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
