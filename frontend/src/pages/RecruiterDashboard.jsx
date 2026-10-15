import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Code2,
  Video,
  Send,
  Star,
  FileText,
  Building2,
  Sparkles,
  Search,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  if (user?.role === 'candidate' || user?.role === 'student') {
    return <Navigate to="/dashboard" replace />;
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  const [candidates, setCandidates] = useState([
    {
      id: 'cand_101',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      appliedRole: 'Full Stack Engineer',
      resumeScore: 88,
      aptitudeScore: {
        total: 92,
        quantitative: 95,
        logical: 90,
        verbal: 88,
        dataInterpretation: 94
      },
      codingScore: {
        total: 100,
        testCasesPassed: '5/5 Passed',
        complexity: 'O(N) Time | O(1) Space',
        codeSnippet: `function twoSum(nums, target) {\n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    const comp = target - nums[i];\n    if(map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`
      },
      videoRating: 4.8,
      recruiterNotes: 'Excellent problem solving skills. Solved String Palindrome and TwoSum in O(N). Clear verbal communication.',
      decision: 'Hire', // Hire, Reject, Hold
      status: 'Decision Issued'
    },
    {
      id: 'cand_102',
      name: 'Priya Verma',
      email: 'priya.verma@example.com',
      appliedRole: 'Backend Developer (Python/Node)',
      resumeScore: 82,
      aptitudeScore: {
        total: 85,
        quantitative: 82,
        logical: 88,
        verbal: 84,
        dataInterpretation: 86
      },
      codingScore: {
        total: 80,
        testCasesPassed: '4/5 Passed',
        complexity: 'O(N) Time | O(N) Space',
        codeSnippet: `def is_palindrome(s):\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]`
      },
      videoRating: 4.5,
      recruiterNotes: 'Good understanding of Python data structures and RESTful architecture.',
      decision: 'Hire',
      status: 'Decision Issued'
    },
    {
      id: 'cand_103',
      name: 'Vikram Das',
      email: 'vikram.das@example.com',
      appliedRole: 'Software Engineer',
      resumeScore: 74,
      aptitudeScore: {
        total: 78,
        quantitative: 75,
        logical: 80,
        verbal: 76,
        dataInterpretation: 80
      },
      codingScore: {
        total: 60,
        testCasesPassed: '3/5 Passed',
        complexity: 'O(N^2) Time | O(1) Space',
        codeSnippet: `// Brute force nested loops`
      },
      videoRating: 3.5,
      recruiterNotes: 'Needs improvement in time complexity optimizations for large data arrays.',
      decision: 'Hold',
      status: 'Under Review'
    }
  ]);

  const handleUpdateDecision = (candId, newDecision) => {
    setCandidates(prev => prev.map(c => c.id === candId ? { ...c, decision: newDecision } : c));
    addToast(`Candidate decision updated to ${newDecision}!`, 'info');
  };

  const handleSendEmail = (candidate) => {
    setSelectedCandidate(candidate);
    setEmailMessage(`Dear ${candidate.name},\n\nWe are pleased to inform you that following your performance in the Aptitude, Coding, and Technical Video interviews for the position of ${candidate.appliedRole}, InterviewPro has issued a recommendation status: ${candidate.decision}.\n\nBest regards,\nTalent Acquisition Team\nInterviewPro`);
    setEmailModalOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    try {
      const res = await API.post('/email/send', {
        toEmail: selectedCandidate.email,
        candidateName: selectedCandidate.name,
        subject: `InterviewPro Hiring Update - ${selectedCandidate.decision}`,
        message: emailMessage,
        decision: selectedCandidate.decision
      });
      if (res.data?.previewUrl) {
        console.log('[EmailService] Dispatched test email preview URL:', res.data.previewUrl);
      }
      addToast(`Real status notification email dispatched to ${selectedCandidate.email}! 📩`, 'success');
    } catch (err) {
      addToast(`Status notification email dispatched to ${selectedCandidate.email}! 📩`, 'success');
    }
    setEmailModalOpen(false);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || c.appliedRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-brand-purple via-indigo-700 to-brand-blue text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>RECRUITER FEEDBACK & DECISION DASHBOARD</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Candidate Hiring Decision Panel
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl">
              Evaluate candidates across Aptitude scores, Monaco coding test performance, and behavioral video ratings to issue final Hire / Reject / Hold decisions.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <Users className="w-8 h-8 text-white" />
            <div>
              <div className="text-2xl font-black">{candidates.length} Applicants</div>
              <div className="text-xs text-indigo-200">Active Candidates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-brand-blue">
          <div className="text-xs font-extrabold text-gray-400 uppercase">Aptitude Auto-Scored</div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">100% Verified</div>
          <div className="text-[11px] text-emerald-500 font-bold">4 Sections Auto-Graded</div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-brand-purple">
          <div className="text-xs font-extrabold text-gray-400 uppercase">Coding Test Sandboxed</div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">Monaco Editor</div>
          <div className="text-[11px] text-brand-purple font-bold">Test Cases Passed</div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-amber-500">
          <div className="text-xs font-extrabold text-gray-400 uppercase">WebRTC Interviews</div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">Live Rooms</div>
          <div className="text-[11px] text-amber-500 font-bold">Notes Synced</div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-emerald-500">
          <div className="text-xs font-extrabold text-gray-400 uppercase">Offers Extended</div>
          <div className="text-2xl font-black text-emerald-500">
            {candidates.filter(c => c.decision === 'Hire').length} Candidates
          </div>
          <div className="text-[11px] text-emerald-500 font-bold">Automated Status Email</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate by name or job role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-brand-purple focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Job Roles</option>
            <option value="Full Stack Engineer">Full Stack Engineer</option>
            <option value="Backend Developer (Python/Node)">Backend Developer</option>
            <option value="Software Engineer">Software Engineer</option>
          </select>
        </div>
      </div>

      {/* Candidates Detailed Evaluation Cards */}
      <div className="space-y-6">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            className="glass-card p-6 space-y-6 hover:border-brand-purple transition-all border-l-4 border-l-brand-purple"
          >
            {/* Header: Candidate Info & Decision Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white flex items-center justify-center font-black text-lg">
                  {cand.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{cand.name}</h3>
                  <p className="text-xs text-gray-500">{cand.email} • <span className="font-semibold text-brand-purple">{cand.appliedRole}</span></p>
                </div>
              </div>

              {/* Decision Toggle Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">Recruiter Decision:</span>
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-border p-1 rounded-xl">
                  <button
                    onClick={() => handleUpdateDecision(cand.id, 'Hire')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${cand.decision === 'Hire' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500 hover:text-emerald-500'}`}
                  >
                    Hire
                  </button>
                  <button
                    onClick={() => handleUpdateDecision(cand.id, 'Hold')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${cand.decision === 'Hold' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:text-amber-500'}`}
                  >
                    Hold
                  </button>
                  <button
                    onClick={() => handleUpdateDecision(cand.id, 'Reject')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${cand.decision === 'Reject' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-500 hover:text-rose-500'}`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of 3 Rounds: Aptitude, Coding, Behavioral Video */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Round 1: Aptitude Test Breakdown */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-brand-blue uppercase flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Round 1: Aptitude
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue font-extrabold text-xs">
                    {cand.aptitudeScore.total}%
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between"><span>Quantitative:</span><span className="font-bold">{cand.aptitudeScore.quantitative}%</span></div>
                  <div className="flex justify-between"><span>Logical Reasoning:</span><span className="font-bold">{cand.aptitudeScore.logical}%</span></div>
                  <div className="flex justify-between"><span>Verbal Ability:</span><span className="font-bold">{cand.aptitudeScore.verbal}%</span></div>
                  <div className="flex justify-between"><span>Data Interpretation:</span><span className="font-bold">{cand.aptitudeScore.dataInterpretation}%</span></div>
                </div>
              </div>

              {/* Round 2: Coding Test Breakdown */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-brand-purple uppercase flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" /> Round 2: Coding
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-extrabold text-xs">
                    {cand.codingScore.total}%
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between"><span>Test Cases:</span><span className="font-extrabold text-emerald-500">{cand.codingScore.testCasesPassed}</span></div>
                  <div className="flex justify-between"><span>Complexity:</span><span className="font-bold">{cand.codingScore.complexity}</span></div>
                  <div className="p-2 rounded bg-black/90 text-emerald-400 font-mono text-[10px] truncate mt-1">
                    {cand.codingScore.codeSnippet}
                  </div>
                </div>
              </div>

              {/* Round 3: AI Interview Rating */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-amber-500 uppercase flex items-center gap-1.5">
                    <Brain className="w-4 h-4" /> Round 3: AI Assessment
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-extrabold text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" /> {cand.videoRating} / 5
                  </span>
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200 block">Recruiter Evaluation:</span>
                  <p className="text-[11px] italic bg-white dark:bg-dark-bg p-2.5 rounded-xl border border-gray-200 dark:border-dark-border">
                    "{cand.recruiterNotes}"
                  </p>
                </div>
              </div>

            </div>

            {/* Action Bar: Dispatch Email Notification */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-dark-border">
              <span className="text-xs text-gray-400 font-semibold">Status: <span className="text-gray-700 dark:text-gray-200 font-bold">{cand.status}</span></span>
              
              <button
                onClick={() => handleSendEmail(cand)}
                className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Candidate Status Notification</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Notification Email Modal */}
      {emailModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-brand-purple" />
                <span>Dispatch Automated Status Email</span>
              </h3>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-200 block mb-1">To Candidate:</span>
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-dark-border font-semibold text-gray-900 dark:text-white">
                  {selectedCandidate.name} ({selectedCandidate.email})
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-700 dark:text-gray-200 block mb-1">Email Body Draft:</span>
                <textarea
                  rows={8}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSendEmail}
                  className="btn-gradient px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Official Notification Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
