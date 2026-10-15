import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Timer } from '../components/Timer';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  HelpCircle
} from 'lucide-react';

export const QuickAssessmentAptitude = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId') || 'qsess_demo';

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await API.get('/quick-assessment/aptitude-screener/questions');
        setQuestions(res.data);
      } catch (err) {
        console.warn('[Questions fetch warning]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleFinalSubmit = async () => {
    if (submitted) return;
    setLoading(true);
    try {
      const res = await API.post('/quick-assessment/aptitude-screener/results', {
        userAnswers: selectedAnswers,
        sessionId
      });
      setResultsData(res.data);
      setSubmitted(true);
      addToast(`Aptitude Screener Submitted! Score: ${res.data.score}/${res.data.total}`, 'success');
    } catch (err) {
      addToast('Error submitting Aptitude Screener.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-6">
      
      {/* 1. Active Test Header & Question Stream */}
      {!submitted && (
        <>
          <div className="space-y-6">
          
          {/* Header Bar with Countdown */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded">
                  STAGE 1 — APTITUDE SCREENER
                </span>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                  Question {currentIndex + 1} of {questions.length}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Timer initialSeconds={1200} onTimeUp={handleFinalSubmit} />
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition"
              >
                Submit Stage 1
              </button>
            </div>
          </div>

          {/* Active Question Card */}
          {currentQ && (
            <div className="glass-card p-8 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
                {currentIndex + 1}. {currentQ.questionText}
              </h2>

              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-purple/15 border-brand-purple text-gray-900 dark:text-white font-bold shadow-sm'
                          : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-border'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-purple bg-brand-purple text-white' : 'border-gray-300'}`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-dark-border">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 disabled:opacity-30"
                >
                  Previous
                </button>

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
                    Submit Stage 1 Assessment
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </>
      )}

      {/* 2. Results & Plain-Language Explanations View */}
      {submitted && resultsData && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Score Header Card */}
          <div className="glass-card p-8 text-center space-y-4 border-l-4 border-l-brand-purple">
            <div className="w-16 h-16 rounded-3xl bg-brand-purple text-white mx-auto flex items-center justify-center shadow-xl">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase text-brand-purple">STAGE 1 COMPLETED</span>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                Aptitude Screener Results
              </h1>
            </div>

            <div className="text-5xl font-black text-brand-purple py-2">
              {resultsData.score} <span className="text-2xl font-bold text-gray-400">/ {resultsData.total}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/quick-assessment/coding-round?sessionId=${sessionId}`)}
                className="btn-gradient px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Continue to Stage 2 — Coding Round (12 Mins)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Every Question Answer & Explanation Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-purple" />
              <span>Plain-Language Answer Explanations ({resultsData.questions?.length})</span>
            </h3>

            {resultsData.questions?.map((q, idx) => (
              <div
                key={idx}
                className={`glass-card p-6 space-y-3 border-l-4 ${q.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">
                    {idx + 1}. {q.questionText}
                  </h4>
                  <span className={`px-2.5 py-1 rounded-full font-extrabold text-xs shrink-0 ${
                    q.isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {q.isCorrect ? 'Correct ✓' : 'Incorrect ❌'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-dark-border/40">
                    <span className="font-bold text-gray-500 block">Your Answer:</span>
                    <span className={`font-semibold ${q.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {q.candidateAnswer}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-dark-border/40">
                    <span className="font-bold text-gray-500 block">Correct Answer:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {q.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Explanation Box */}
                <div className="p-3.5 rounded-xl bg-brand-purple/5 border border-brand-purple/15 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                  <strong className="text-brand-purple block mb-1">Plain-Language Explanation:</strong>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};
