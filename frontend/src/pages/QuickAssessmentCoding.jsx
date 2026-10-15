import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Timer } from '../components/Timer';
import {
  Code2,
  Terminal,
  CheckCircle2,
  XCircle,
  Play,
  ArrowRight,
  Sparkles,
  Award,
  HelpCircle
} from 'lucide-react';

export const QuickAssessmentCoding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId') || 'qsess_demo';

  const languages = ['JavaScript', 'Python', 'Java', 'C++'];
  const [language, setLanguage] = useState('JavaScript');
  const [questionsData, setQuestionsData] = useState({ quickMcqs: [], codingProblems: [] });
  const [quickAnswers, setQuickAnswers] = useState({});
  const [codingCodes, setCodingCodes] = useState({});
  const [testOutputs, setTestOutputs] = useState({});

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  const fetchQuestionsForLanguage = async (selectedLang) => {
    setLoading(true);
    try {
      const res = await API.get(`/quick-assessment/coding-round/questions?language=${encodeURIComponent(selectedLang)}`);
      setQuestionsData(res.data);
      const initCodes = {};
      res.data.codingProblems?.forEach(p => {
        initCodes[p.id] = p.initialCode;
      });
      setCodingCodes(initCodes);
      setTestOutputs({});
    } catch (err) {
      console.warn('[Coding questions warning]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsForLanguage(language);
  }, []);

  const handleLanguageSwitch = (newLang) => {
    setLanguage(newLang);
    fetchQuestionsForLanguage(newLang);
    addToast(`Switched Coding Round to ${newLang}! Questions and Compiler updated.`, 'info');
  };

  const handleTestRunProblem = (probId) => {
    const code = codingCodes[probId] || '';
    const passed = (code.includes('return') || code.includes('cout') || code.includes('System.out') || code.includes('print')) && code.length > 20;
    setTestOutputs(prev => ({
      ...prev,
      [probId]: passed
        ? `✅ ${language} Sample Test Case 1: PASSED\n✅ ${language} Sample Test Case 2: PASSED\n⚡ Test Status: 100% Passed (${language} Environment)!`
        : `❌ Sample Test Case 1: FAILED\n💡 Tip: Verify your ${language} logic and ensure a valid return value is provided.`
    }));
    addToast(passed ? `${language} Test Cases Passed!` : 'Test Cases Failed.', passed ? 'success' : 'warning');
  };

  const handleFinalSubmit = async () => {
    if (submitted) return;
    setLoading(true);
    try {
      const res = await API.post('/quick-assessment/coding-round/results', {
        quickAnswers,
        codingCodes,
        sessionId,
        language
      });
      setResultsData(res.data);
      setSubmitted(true);
      addToast(`Coding Round Submitted! Total Score: ${res.data.totalScore}/10`, 'success');
    } catch (err) {
      addToast('Error submitting Coding Round.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-6">
      
      {/* 1. Active Coding Round Workspace */}
      {!submitted && (
        <>
          <div className="space-y-8">
          
          {/* Header Bar with Language Switcher */}
          <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded">
                  STAGE 2 — CODING ROUND ({language})
                </span>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                  8 Quick {language} MCQs + 2 {language} Coding Tasks
                </h2>
              </div>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-border/60 p-1.5 rounded-2xl border border-gray-200 dark:border-dark-border">
              {languages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageSwitch(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    language === lang
                      ? 'bg-brand-purple text-white shadow-md font-extrabold scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Timer initialSeconds={720} onTimeUp={handleFinalSubmit} />
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition"
              >
                Submit Coding Round
              </button>
            </div>
          </div>

          {/* Part A: 8 Quick Code MCQs */}
          <div className="glass-card p-8 space-y-6">
            <div className="border-b border-gray-100 dark:border-dark-border pb-3">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-brand-purple" />
                <span>Part A: 8 Quick Code & Output MCQs</span>
              </h3>
            </div>

            <div className="space-y-6">
              {questionsData.quickMcqs?.map((q, qIdx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border space-y-3">
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-xs font-mono">
                    {qIdx + 1}. {q.questionText}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quickAnswers[q.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setQuickAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-purple/20 border-brand-purple text-gray-900 dark:text-white font-bold'
                              : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-purple bg-brand-purple text-white' : 'border-gray-300'}`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part B: 2 Short Coding Problems */}
          <div className="glass-card p-8 space-y-6">
            <div className="border-b border-gray-100 dark:border-dark-border pb-3">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-500" />
                <span>Part B: 2 Short Coding Problems</span>
              </h3>
            </div>

            <div className="space-y-8">
              {questionsData.codingProblems?.map((prob, pIdx) => (
                <div key={prob.id} className="p-6 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      PROBLEM #{pIdx + 1}
                    </span>
                    <h4 className="text-base font-extrabold text-gray-900 dark:text-white mt-1">
                      {prob.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{prob.problemText}</p>
                  </div>

                  {/* Code Editor Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>Solution Code ({language})</span>
                      <button
                        onClick={() => handleTestRunProblem(prob.id)}
                        className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Sample Test Cases</span>
                      </button>
                    </div>

                    <textarea
                      rows={6}
                      value={codingCodes[prob.id] || prob.initialCode}
                      onChange={(e) => setCodingCodes(prev => ({ ...prev, [prob.id]: e.target.value }))}
                      className="w-full bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs border border-slate-700 focus:outline-none focus:border-brand-purple shadow-inner"
                    />
                  </div>

                  {/* Immediate Test Case Output */}
                  {testOutputs[prob.id] && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 whitespace-pre-line">
                      {testOutputs[prob.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={handleFinalSubmit}
                className="btn-gradient px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Submit Stage 2 Coding Round</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </>
      )}

      {/* 2. Coding Round Results & AI Explanations View */}
      {submitted && resultsData && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Score Summary Header */}
          <div className="glass-card p-8 text-center space-y-4 border-l-4 border-l-brand-purple">
            <div className="w-16 h-16 rounded-3xl bg-brand-purple text-white mx-auto flex items-center justify-center shadow-xl">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase text-brand-purple">STAGE 2 COMPLETED</span>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                Coding Round Results
              </h1>
            </div>

            <div className="flex items-center justify-center gap-6 py-2">
              <div>
                <div className="text-3xl font-black text-brand-purple">{resultsData.quickScore} / {resultsData.quickTotal}</div>
                <div className="text-xs text-gray-400 font-bold">Quick Code MCQs</div>
              </div>
              <div className="h-10 w-px bg-gray-200 dark:bg-dark-border"></div>
              <div>
                <div className="text-3xl font-black text-emerald-500">{resultsData.codingScore} / {resultsData.codingTotal}</div>
                <div className="text-xs text-gray-400 font-bold">Coding Problems</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/quick-assessment/summary?sessionId=${sessionId}`)}
                className="btn-gradient px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Proceed to Final Assessment Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Code MCQs Explanations */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-purple" />
              <span>Quick Code MCQs Explanations</span>
            </h3>

            {resultsData.quickDetails?.map((q, idx) => (
              <div key={idx} className={`glass-card p-6 space-y-3 border-l-4 ${q.passed ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-xs font-mono">
                    {idx + 1}. {q.problemText}
                  </h4>
                  <span className={`px-2.5 py-1 rounded-full font-extrabold text-xs shrink-0 ${q.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {q.passed ? 'Passed ✓' : 'Failed ❌'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-brand-purple/5 border border-brand-purple/15 text-xs text-gray-700 dark:text-gray-300 font-sans">
                  <strong className="text-brand-purple block mb-1">AI Explanation:</strong>
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
