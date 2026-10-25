import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { PlacementStepper } from '../components/PlacementStepper';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';

export const QuickAssessmentResume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId') || 'qsess_demo';

  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [attachedResumeName, setAttachedResumeName] = useState('');
  const [hasAttachedResume, setHasAttachedResume] = useState(false);
  const [showReupload, setShowReupload] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('prep_ai_uploaded_resume');
      const storedFileName = localStorage.getItem('prep_ai_resume_file_name');
      const storedFeedback = localStorage.getItem('prep_ai_quick_feedback');

      if (stored) {
        setHasAttachedResume(true);
        setResumeText(stored);
        if (storedFileName) setAttachedResumeName(storedFileName);

        if (storedFeedback) {
          try {
            setFeedback(JSON.parse(storedFeedback));
          } catch (e) {}
        } else {
          // fetch feedback for attached resume
          (async () => {
            try {
              const res = await API.post('/quick-assessment/resume-feedback', {
                resumeText: stored,
                sessionId
              });
              if (res.data) {
                setFeedback(res.data);
                localStorage.setItem('prep_ai_quick_feedback', JSON.stringify(res.data));
              }
            } catch (err) {}
          })();
        }
      }
    } catch (e) {}
  }, [sessionId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setAttachedResumeName(selected.name);
      if (selected.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => setResumeText(event.target.result);
        reader.readAsText(selected);
      }
    }
  };

  const handleAnalyzeResume = async (e) => {
    e.preventDefault();
    setLoading(true);

    const activeText = resumeText.trim() || (file ? `Resume uploaded from ${file.name}.` : '') || `Candidate resume - Skilled in JavaScript, React, Node.js, SQL, Data Structures, and Web Development.`;
    const fileName = file ? file.name : (attachedResumeName || 'Candidate_Resume.pdf');
    try {
      localStorage.setItem('prep_ai_uploaded_resume', activeText);
      localStorage.setItem('prep_ai_resume_file_name', fileName);
      setHasAttachedResume(true);
      setAttachedResumeName(fileName);
      setShowReupload(false);
    } catch (e) {}

    try {
      const res = await API.post('/quick-assessment/resume-feedback', {
        resumeText: activeText,
        sessionId
      });

      setFeedback(res.data);
      try {
        localStorage.setItem('prep_ai_quick_feedback', JSON.stringify(res.data));
      } catch (e) {}
      addToast('AI Resume Feedback Generated!', 'success');
    } catch (err) {
      addToast('Error generating resume feedback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16 pt-2 sm:pt-4 min-w-0">
      {/* Header Stepper */}
      <PlacementStepper currentStage={2} />

      {/* Header Banner */}
      <div className="relative overflow-hidden p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-purple via-indigo-700 to-brand-blue text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>STAGE 1 OF 3 — CANDIDATE RESUME CHECK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Resume Verification & Quick Screener
          </h1>
          <p className="text-xs text-indigo-100 max-w-xl">
            Single-resume policy active: your resume is attached and evaluated across all stages without redundant uploads.
          </p>
        </div>
      </div>

      {/* When Resume Is Attached and Verified (Single-Upload Enforced) */}
      {hasAttachedResume && !showReupload && (
        <div className="glass-card p-4 sm:p-6 md:p-8 space-y-6 border-l-4 border-l-emerald-500 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                    Active Verified Resume Attached
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                    Single-Upload Enforced
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                  Source: <strong className="text-gray-700 dark:text-gray-200">{attachedResumeName || 'Resume ATS Audit'}</strong>. Your resume is linked to your candidate session. No duplicate upload required.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReupload(true)}
              className="text-xs font-bold text-gray-400 hover:text-brand-purple transition underline shrink-0"
            >
              Replace resume
            </button>
          </div>

          {/* Instant AI Feedback Details */}
          {feedback ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-xs">
                {/* Strengths */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strengths Identified
                  </span>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                    {feedback.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Suggestions to Improve
                  </span>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                    {feedback.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate(`/quick-assessment/aptitude-screener?sessionId=${sessionId}`)}
                  className="btn-gradient w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  <span>Continue to Stage 1 — Aptitude Screener (20 Mins)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center space-y-3">
              <div className="inline-block animate-spin text-brand-purple">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-500">Loading instant feedback for your attached resume...</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Form (Shown when no resume attached or user clicked replace) */}
      {(!hasAttachedResume || showReupload) && (
        <div className="glass-card p-8 space-y-6">
          {showReupload && (
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-dark-border">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Replace Active Resume
              </span>
              <button
                type="button"
                onClick={() => setShowReupload(false)}
                className="text-xs text-gray-400 hover:text-gray-600 underline font-semibold"
              >
                Cancel and keep existing resume
              </button>
            </div>
          )}

          <form onSubmit={handleAnalyzeResume} className="space-y-6 text-xs">
            <div className="border-2 border-dashed border-gray-200 dark:border-dark-border rounded-2xl p-6 text-center hover:border-brand-purple transition cursor-pointer bg-gray-50/50 dark:bg-dark-border/20">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="quick-resume-file"
              />
              <label htmlFor="quick-resume-file" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-brand-purple mx-auto" />
                <span className="font-bold text-gray-700 dark:text-gray-200 block">
                  {file ? file.name : 'Click to Upload PDF / Word Resume'}
                </span>
                <span className="text-[11px] text-gray-400">PDF, DOCX up to 5MB</span>
              </label>
            </div>

            <div>
              <span className="font-bold text-gray-700 dark:text-gray-200 block mb-1">Or Paste Resume Content:</span>
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your technical skills, projects, and work experience..."
                className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:ring-2 focus:ring-brand-purple focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3.5 rounded-xl font-bold text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Analyzing Resume...' : 'Get Instant AI Resume Feedback 🚀'}</span>
            </button>
          </form>
        </div>
      )}

      {/* AI Feedback Card for manual submit when replacing */}
      {showReupload && feedback && (
        <div className="glass-card p-8 space-y-6 border-l-4 border-l-brand-purple animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              <span>Here's What We Noticed</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-extrabold text-xs">
              AI RESUME CHECK
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strengths Identified
              </span>
              <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                {feedback.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <span className="font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Suggestions to Improve
              </span>
              <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                {feedback.suggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => navigate(`/quick-assessment/aptitude-screener?sessionId=${sessionId}`)}
              className="btn-gradient px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>Continue to Stage 1 — Aptitude Screener (20 Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
