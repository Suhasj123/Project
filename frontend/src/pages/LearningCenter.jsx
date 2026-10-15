import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bookmark,
  RotateCcw,
  BookOpen,
  HelpCircle,
  X
} from 'lucide-react';

export const LearningCenter = () => {
  const location = useLocation();
  const quizResult = location.state?.quizResult || {
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    category: 'Quantitative Aptitude',
    answers: [
      {
        questionText: 'A can do a work in 10 days and B in 15 days. How many days will they take together?',
        userAnswer: '6 days',
        correctAnswer: '6 days',
        isCorrect: true,
        explanation: 'Combined 1 day work = 1/10 + 1/15 = 1/6. Total days = 6.',
        referenceNotes: 'Formula: (A * B) / (A + B).',
        subTopic: 'Time and Work',
        difficulty: 'Easy'
      },
      {
        questionText: 'The average score of 5 students is 80. If one scoring 100 is removed, find new average.',
        userAnswer: '78',
        correctAnswer: '75',
        isCorrect: false,
        explanation: 'Total = 400. Remaining = 300 / 4 = 75.',
        referenceNotes: 'Average = Sum / Count.',
        subTopic: 'Averages',
        difficulty: 'Easy'
      }
    ]
  };

  const [answers, setAnswers] = useState(quizResult.answers || []);
  const [filterMode, setFilterMode] = useState('All'); // All, Wrong, Correct
  const [aiModal, setAiModal] = useState({ open: false, loading: false, content: '', title: '' });

  const { addToast } = useToast();

  const handleFetchAIExplain = async (q) => {
    setAiModal({ open: true, loading: true, content: '', title: q.questionText });
    try {
      const res = await API.post('/quizzes/ai-explain', {
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer,
        explanation: q.explanation
      });
      setAiModal({ open: true, loading: false, content: res.data.aiExplanation, title: q.questionText });
    } catch (e) {
      setAiModal({ open: true, loading: false, content: 'Failed to connect to AI explanation service.', title: q.questionText });
    }
  };

  const handleBookmark = async (q) => {
    try {
      await API.post('/quizzes/bookmark', {
        questionId: q.questionId || 'q_' + Math.random(),
        questionText: q.questionText,
        category: quizResult.category,
        subTopic: q.subTopic
      });
      addToast('Question bookmarked!', 'success');
    } catch (e) {
      addToast('Error bookmarking question.', 'error');
    }
  };

  const filteredAnswers = answers.filter(a => {
    if (filterMode === 'Wrong') return !a.isCorrect;
    if (filterMode === 'Correct') return a.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Quiz Score Overview Card */}
      <div className="glass-card p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mx-auto flex items-center justify-center shadow-lg">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Learning & Review Center</h1>
          <p className="text-sm text-gray-500">
            Focus on understanding your mistakes rather than just viewing scores.
          </p>
        </div>

        {/* Score Pill Banner */}
        <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-gray-100 dark:bg-dark-border border border-gray-200 dark:border-dark-border">
          <div>
            <div className="text-2xl font-extrabold text-brand-purple">{quizResult.score} / {quizResult.totalQuestions}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Total Score</div>
          </div>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700"></div>
          <div>
            <div className={`text-2xl font-extrabold ${quizResult.percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {quizResult.percentage}%
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Accuracy Rate</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => setFilterMode('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterMode === 'All' ? 'btn-gradient' : 'bg-gray-100 dark:bg-dark-border text-gray-600'}`}
          >
            All Questions ({answers.length})
          </button>
          <button
            onClick={() => setFilterMode('Wrong')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterMode === 'Wrong' ? 'bg-rose-500 text-white' : 'bg-rose-500/10 text-rose-500'}`}
          >
            Wrong Answers Only ({answers.filter(a => !a.isCorrect).length})
          </button>
          <button
            onClick={() => setFilterMode('Correct')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterMode === 'Correct' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}
          >
            Correct Answers Only ({answers.filter(a => a.isCorrect).length})
          </button>
          <Link to="/aptitude-quiz" className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-dark-border flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
          </Link>
        </div>
      </div>

      {/* Answer Explanations List */}
      <div className="space-y-6">
        {filteredAnswers.map((item, idx) => (
          <div
            key={idx}
            className={`glass-card p-6 border-l-4 space-y-4 ${
              item.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-dark-border px-2 py-0.5 rounded">
                    {item.subTopic || 'Topic'} • {item.difficulty || 'Medium'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                  {idx + 1}. {item.questionText}
                </h3>
              </div>

              <button
                onClick={() => handleBookmark(item)}
                className="p-2 rounded-lg text-gray-400 hover:text-amber-500 transition"
                title="Bookmark Question"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Answer Display */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${item.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'}`}>
                <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">Your Choice:</span>
                {item.userAnswer}
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">Correct Answer:</span>
                {item.correctAnswer}
              </div>
            </div>

            {/* Explanation & Reference Notes */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 text-xs space-y-2">
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-purple" /> Solution Explanation:
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.explanation}</p>
              {item.referenceNotes && (
                <div className="text-[11px] text-brand-purple font-medium pt-1">
                  💡 Reference Note: {item.referenceNotes}
                </div>
              )}
            </div>

            {/* AI Explanation Trigger */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => handleFetchAIExplain(item)}
                className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Instant Explanation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Explanation Modal */}
      {aiModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setAiModal({ open: false, loading: false, content: '', title: '' })}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-purple font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>AI Tutor Explanation</span>
            </div>

            <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-relaxed">
              "{aiModal.title}"
            </h4>

            {aiModal.loading ? (
              <div className="py-8 flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-400">Generating breakdown...</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border text-xs text-gray-700 dark:text-gray-200 leading-relaxed max-h-60 overflow-y-auto">
                {aiModal.content}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
