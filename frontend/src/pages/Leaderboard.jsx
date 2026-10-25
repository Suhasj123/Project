import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  User,
  Star,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const Leaderboard = () => {
  const [userGamification, setUserGamification] = useState({
    currentStreak: 5,
    longestStreak: 8,
    totalXp: 450,
    optInLeaderboard: true
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, listRes] = await Promise.all([
          API.get('/gamification/status/cand_101'),
          API.get('/gamification/leaderboard')
        ]);
        if (userRes.data) setUserGamification(userRes.data);
        if (listRes.data) setLeaderboard(listRes.data);
      } catch (err) {
        console.warn('[Gamification fetch error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 min-w-0">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span>GAMIFIED PREPARATION LEADERBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Candidate Leaderboard & Daily Streaks
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
              Earn XP for every practice activity (+20 Mock Interview, +15 Coding, +10 Aptitude, +5 Resume) and maintain daily streaks to top the ranking!
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 bg-white/10 p-3 sm:p-4 rounded-2xl border border-white/20 backdrop-blur-md w-full sm:w-auto justify-around sm:justify-start shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300 text-amber-300 animate-pulse shrink-0" />
                <span>{userGamification.currentStreak || 5}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-white/80 mt-0.5">
                Day Streak 🔥
              </div>
            </div>

            <div className="h-8 w-px bg-white/20" />

            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-black text-white">{userGamification.totalXp || 450}</div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-white/80 mt-0.5">
                Total XP ⚡
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* XP Rewards Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'AI Mock Interview', xp: '+20 XP', color: 'from-purple-500 to-indigo-600', icon: Sparkles },
          { label: 'Coding Round', xp: '+15 XP', color: 'from-emerald-500 to-teal-600', icon: Zap },
          { label: 'Aptitude Screener', xp: '+10 XP', color: 'from-blue-500 to-cyan-600', icon: Award },
          { label: 'Resume Gap Audit', xp: '+5 XP', color: 'from-amber-500 to-orange-600', icon: Trophy }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-card p-4 flex items-center justify-between border-l-4 border-l-amber-500">
              <div>
                <div className="text-xs font-extrabold text-gray-900 dark:text-white">{item.label}</div>
                <div className="text-xs font-black text-amber-500">{item.xp}</div>
              </div>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Top Candidate Leaderboard</span>
          </h2>
          <span className="text-xs font-bold text-gray-400 shrink-0">Opt-in Public Ranking</span>
        </div>

        <div className="space-y-3">
          {leaderboard.map((row) => {
            const isTop1 = row.rank === 1;
            const isTop2 = row.rank === 2;
            const isTop3 = row.rank === 3;

            return (
              <div
                key={row.rank}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2 border transition-all ${
                  isTop1
                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30'
                    : isTop2
                    ? 'bg-gradient-to-r from-slate-400/10 to-gray-500/10 border-slate-400/30'
                    : isTop3
                    ? 'bg-gradient-to-r from-amber-700/10 to-orange-700/10 border-amber-700/30'
                    : 'bg-gray-50 dark:bg-dark-border/40 border-gray-100 dark:border-dark-border'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    isTop1
                      ? 'bg-amber-500 text-white shadow-md'
                      : isTop2
                      ? 'bg-slate-400 text-white shadow-md'
                      : isTop3
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-dark-border text-gray-700 dark:text-gray-300'
                  }`}>
                    {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${row.rank}`}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2 truncate">
                      <span className="truncate">{row.name}</span>
                      {row.name.includes('Vikram') && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-brand-purple/10 text-brand-purple shrink-0">
                          YOU
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5">
                      <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px] sm:text-xs">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 shrink-0" /> {row.streak}d Streak
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base sm:text-lg font-black text-brand-purple">{row.xp} XP</div>
                  <div className="text-[9px] sm:text-[10px] text-emerald-500 font-extrabold uppercase">Verified</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
