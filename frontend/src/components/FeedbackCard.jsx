import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export const FeedbackCard = ({ evaluation }) => {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  if (!evaluation) return null;

  const {
    clarity_score = 85,
    structure_score = 80,
    technical_accuracy_score = 88,
    confidence_score = 82,
    overall_readiness_score = 85,
    strengths = [],
    improvements = [],
    weakest_question = '',
    model_answer_sample = ''
  } = evaluation;

  return (
    <div className="glass-card p-4 sm:p-6 space-y-6 border-l-4 border-l-brand-purple animate-fadeIn min-w-0">
      {/* Header & Readiness Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-extrabold uppercase">
            AI EVALUATION SUMMARY
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mt-1">
            Answer Evaluation & Readiness Feedback
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-brand-purple/10 p-3 sm:p-3.5 rounded-2xl border border-brand-purple/20 shrink-0">
          <Award className="w-6 h-6 sm:w-7 sm:h-7 text-brand-purple shrink-0" />
          <div>
            <div className="text-xl sm:text-2xl font-black text-brand-purple">{overall_readiness_score}%</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase">Readiness Score</div>
          </div>
        </div>
      </div>

      {/* 4 Dimension Score Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-border/40 space-y-1">
          <div className="flex justify-between text-gray-500 font-semibold">
            <span>Clarity:</span>
            <span className="font-bold text-brand-purple">{clarity_score}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div className="h-full bg-brand-purple rounded-full" style={{ width: `${clarity_score}%` }}></div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-border/40 space-y-1">
          <div className="flex justify-between text-gray-500 font-semibold">
            <span>STAR Structure:</span>
            <span className="font-bold text-brand-blue">{structure_score}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue rounded-full" style={{ width: `${structure_score}%` }}></div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-border/40 space-y-1">
          <div className="flex justify-between text-gray-500 font-semibold">
            <span>Tech Accuracy:</span>
            <span className="font-bold text-emerald-500">{technical_accuracy_score || 85}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${technical_accuracy_score || 85}%` }}></div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-border/40 space-y-1">
          <div className="flex justify-between text-gray-500 font-semibold">
            <span>Confidence:</span>
            <span className="font-bold text-amber-500">{confidence_score}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${confidence_score}%` }}></div>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4 text-xs">
        {/* Strengths (Green) */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <CheckCircle2 className="w-4 h-4" /> Key Strengths
          </span>
          <ul className="space-y-1.5 text-gray-700 dark:text-gray-200">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements (Amber) */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <AlertTriangle className="w-4 h-4" /> Areas for Improvement
          </span>
          <ul className="space-y-1.5 text-gray-700 dark:text-gray-200">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Collapsible Model Answer Section */}
      {model_answer_sample && (
        <div className="border border-gray-200 dark:border-dark-border rounded-2xl overflow-hidden text-xs">
          <button
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="w-full p-4 bg-gray-50 dark:bg-dark-border/40 font-bold text-gray-800 dark:text-gray-200 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-dark-border transition"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-purple" />
              <span>See Model Answer for Weakest Question</span>
            </div>
            {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showModelAnswer && (
            <div className="p-4 bg-white dark:bg-dark-bg space-y-2 border-t border-gray-200 dark:border-dark-border animate-fadeIn">
              {weakest_question && (
                <div className="text-[11px] font-bold text-gray-500">
                  Target Question: <span className="text-gray-900 dark:text-white italic">"{weakest_question}"</span>
                </div>
              )}
              <div className="p-3 rounded-xl bg-brand-purple/5 border border-brand-purple/15 text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
                {model_answer_sample}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
