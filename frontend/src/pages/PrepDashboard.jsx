import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { VismeInfographicWidget } from '../components/VismeInfographicWidget';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Award,
  BookOpen,
  Calendar,
  Code2,
  FileText,
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckSquare,
  Layers
} from 'lucide-react';

export const PrepDashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [dashboardData, setDashboardData] = useState({
    readinessTrend: [
      { date: '2026-08-01', session_label: 'Mock #1 - Technical', readiness_score: 62 },
      { date: '2026-08-03', session_label: 'Mock #2 - Behavioral', readiness_score: 68 },
      { date: '2026-08-05', session_label: 'Mock #3 - System Design', readiness_score: 75 },
      { date: '2026-08-07', session_label: 'Mock #4 - Technical', readiness_score: 82 },
      { date: '2026-08-08', session_label: 'Mock #5 - Full Stack', readiness_score: 88 }
    ],
    sessions: [],
    codingStats: {
      attemptedCount: 14,
      solvedCount: 12,
      weakTopics: ['Dynamic Programming', 'Graph BFS/DFS', 'Trie Indexing'],
      strongTopics: ['Arrays & Hash Maps', 'Two Pointers', 'SQL Aggregation']
    }
  });

  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const radarData = [
    { category: 'Clarity', score: 85 },
    { category: 'Structure', score: 80 },
    { category: 'Technical Accuracy', score: 88 },
    { category: 'Confidence', score: 84 },
    { category: 'Problem Solving', score: 86 }
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await API.get('/ai/prep-dashboard');
        if (res.data) {
          setDashboardData(prev => ({
            ...prev,
            readinessTrend: res.data.readinessTrend || prev.readinessTrend,
            sessions: res.data.sessions || [],
            codingStats: res.data.codingStats || prev.codingStats
          }));
        }
      } catch (err) {
        console.warn('[Dashboard fetch warning]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-brand-purple">
          <div className="text-xs font-extrabold text-gray-400 uppercase">Current Readiness Score</div>
          <div className="text-3xl font-black text-brand-purple">88 / 100</div>
          <div className="text-[11px] text-emerald-500 font-bold">↑ +14% Improvement</div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-brand-blue">
          <div className="text-xs font-extrabold text-gray-400 uppercase">Mock Sessions Completed</div>
          <div className="text-3xl font-black text-gray-900 dark:text-white">5 Sessions</div>
          <div className="text-[11px] text-brand-blue font-bold">Claude AI Dynamic Follow-ups</div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-emerald-500">
          <div className="text-xs font-extrabold text-gray-400 uppercase">Practice Streak & XP</div>
          <div className="text-3xl font-black text-emerald-500">450 XP</div>
          <div className="text-[11px] text-amber-500 font-extrabold">🔥 5-Day Practice Streak</div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-amber-500">
          <div className="text-xs font-extrabold text-gray-400 uppercase">Resume JD Match Score</div>
          <div className="text-3xl font-black text-amber-500">78% Match</div>
          <div className="text-[11px] text-amber-500 font-bold">4-Week Active Roadmap</div>
        </div>
      </div>

      {/* Visme Interactive Animated Infographic Hub */}
      <VismeInfographicWidget readinessScore={88} atsScore={92} codingSpeed={95} confidence={86} />

      {/* Charts Grid: Readiness Trend Line Chart & Skill Breakdown Radar Chart */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left: Recharts Line Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-purple" />
              <span>Interview Readiness Score Trend</span>
            </h3>
            <span className="text-xs text-gray-400 font-semibold">Target: 70+ Score</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dashboardData.readinessTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-3 border border-gray-200 dark:border-dark-border text-xs">
                      <p className="font-bold text-gray-900 dark:text-white">{p.session_label}</p>
                      <p className="text-brand-purple font-extrabold mt-0.5">Score: {p.readiness_score}/100</p>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Target 70', fontSize: 11, fill: '#22c55e', position: 'right' }} />
              <Line
                type="monotone"
                dataKey="readiness_score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Recharts Skill Radar Chart */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-blue" />
            <span>Latest Session Radar</span>
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#374151' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Mock Interview Session History & Weak Topics Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Mock Interview Session History List */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-3">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-purple" />
              <span>Mock Interview Session History</span>
            </h3>
            <button
              onClick={() => navigate('/ai-mock-interview')}
              className="text-xs font-bold text-brand-purple hover:underline"
            >
              + New Session
            </button>
          </div>

          <div className="space-y-3">
            {(dashboardData?.sessions || []).map((sess) => (
              <div
                key={sess._id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border hover:border-brand-purple transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-extrabold text-[10px] uppercase">
                      {sess.type} • {sess.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(sess.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white mt-1">
                    Role: {sess.role}
                  </h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-base font-black text-brand-purple">{sess.readinessScore}%</div>
                    <div className="text-[10px] text-gray-400 font-bold">Readiness Score</div>
                  </div>

                  <button
                    onClick={() => setSelectedSession(sess)}
                    className="px-4 py-2 rounded-xl bg-brand-purple text-white font-bold text-xs shadow hover:scale-105 transition"
                  >
                    View Transcript
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coding Practice Stats & Weak Topics Panel */}
        <div className="glass-card p-6 space-y-6">
          <div className="border-b border-gray-100 dark:border-dark-border pb-3">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-purple" />
              <span>Coding Weak Topics Tracker</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Track topics needing practice based on test failures.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-extrabold text-rose-500 block mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Identified Weak Topics to Practice:
              </span>
              <div className="flex flex-wrap gap-2">
                {(dashboardData?.codingStats?.weakTopics || ['Dynamic Programming', 'Graph Algorithms']).map((topic, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold">
                    ⚠ {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="font-extrabold text-emerald-500 block mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strong Mastered Topics:
              </span>
              <div className="flex flex-wrap gap-2">
                {(dashboardData?.codingStats?.strongTopics || ['Arrays & Hash Maps', 'Two Pointers']).map((topic, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold">
                    ✓ {topic}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/coding-quiz')}
              className="btn-gradient w-full py-3 rounded-xl font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Code2 className="w-4 h-4" />
              <span>Practice Monaco Coding Quiz</span>
            </button>
          </div>
        </div>

      </div>

      {/* Transcript Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-8 space-y-6 max-h-[85vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Mock Interview Transcript
                </h3>
                <p className="text-xs text-gray-500">{selectedSession.role} ({selectedSession.type})</p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedSession.transcript?.map((t, idx) => (
                <div key={idx} className={`p-4 rounded-2xl space-y-1 ${t.sender === 'ai' ? 'bg-brand-purple/10 border border-brand-purple/20' : 'bg-gray-100 dark:bg-dark-border/60'}`}>
                  <span className="font-extrabold uppercase text-[10px] text-brand-purple block">
                    {t.sender === 'ai' ? 'Claude AI Interviewer' : 'Candidate Answer'}
                  </span>
                  <p className="text-gray-800 dark:text-gray-200 font-sans">{t.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-dark-border text-right">
              <button
                onClick={() => setSelectedSession(null)}
                className="btn-gradient px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
