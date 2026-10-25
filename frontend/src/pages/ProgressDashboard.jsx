import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  Award,
  Download,
  Flame,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ProgressDashboard = () => {
  const [data, setData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, achRes] = await Promise.all([
          API.get('/progress/overview'),
          API.get('/progress/achievements')
        ]);
        setData(progRes.data);
        setAchievements(achRes.data);
      } catch (err) {
        addToast('Loaded default progress analytics.', 'info');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadReport = () => {
    window.print();
    addToast('Performance report print dialogue initiated.', 'success');
  };

  const chartData = data?.weeklyPerformance || [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 70 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 72 },
    { day: 'Fri', score: 85 },
    { day: 'Sat', score: 88 },
    { day: 'Sun', score: 92 }
  ];

  return (
    <div id="print-area" className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 min-w-0">
      {/* Header */}
      <div className="glass-card p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-brand-purple shrink-0" />
            <span>Progress Analytics & Badges</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track your preparation trajectory, domain accuracy, and unlocked achievements.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="btn-gradient w-full sm:w-auto justify-center px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 space-y-1">
          <div className="text-xs text-gray-400 font-semibold">Job Readiness</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-blue">{data?.jobReadinessScore || 78}%</div>
          <div className="text-[10px] text-emerald-500 font-bold">↑ Top 15% in Batch</div>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-1">
          <div className="text-xs text-gray-400 font-semibold">Learning Streak</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 flex items-center gap-1">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500 shrink-0" /> {data?.streakDays || 5} Days
          </div>
          <div className="text-[10px] text-gray-400">Continuous Practice</div>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-1">
          <div className="text-xs text-gray-400 font-semibold">Quizzes Taken</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-purple">{data?.totalQuizzesTaken || 12}</div>
          <div className="text-[10px] text-gray-400">Avg Score: {data?.avgQuizScore || 82}%</div>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-1">
          <div className="text-xs text-gray-400 font-semibold">AI Interviews</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">{data?.totalInterviewsTaken || 4}</div>
          <div className="text-[10px] text-gray-400">Avg Grade: {data?.avgInterviewScore || 85}%</div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Trend */}
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-blue shrink-0" />
            <span>Weekly Accuracy Trend</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak vs Strong Topics */}
        <div className="glass-card p-4 sm:p-6 space-y-6">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strong Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data?.strongTopics || ['Time & Work', 'OOP Fundamentals', 'Java Strings', 'SQL Joins']).map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Weak Topics (Needs Practice)
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data?.weakTopics || ['Speed, Distance & Time', 'Pointers in C++', 'Dynamic Programming']).map((wt, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold">
                  ⚠️ {wt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Module 11: Achievements & Gamified Badges */}
      <div className="glass-card p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
            <span>Unlocked Achievements & Badges</span>
          </h2>
          <span className="text-xs text-gray-400 font-medium shrink-0">Milestones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {achievements.map((badge, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 to-brand-purple/10 border-amber-500/40 shadow-md'
                  : 'bg-gray-50 dark:bg-dark-border/20 border-gray-200 dark:border-dark-border opacity-50'
              }`}
            >
              <div className="text-3xl">{badge.badgeIcon}</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{badge.title}</h4>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{badge.description}</p>
                <span className={`text-[10px] font-bold mt-1 inline-block ${badge.unlocked ? 'text-amber-500' : 'text-gray-400'}`}>
                  {badge.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
