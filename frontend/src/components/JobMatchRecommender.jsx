import React, { useState } from 'react';
import { Briefcase, Award, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const JobMatchRecommender = () => {
  const navigate = useNavigate();

  const roleProfiles = [
    {
      id: 'fullstack',
      role: 'Full Stack Engineer',
      matchScore: 88,
      demandLevel: 'Very High',
      avgSalary: '$85k - $120k',
      acquiredSkills: ['React.js', 'Node.js', 'JavaScript', 'REST APIs', 'MongoDB'],
      missingSkills: ['Docker', 'System Design'],
      prepLink: '/quiz/coding'
    },
    {
      id: 'sde1',
      role: 'Software Development Engineer (SDE-1)',
      matchScore: 82,
      demandLevel: 'High',
      avgSalary: '$90k - $130k',
      acquiredSkills: ['Data Structures', 'OOPs', 'Java', 'SQL'],
      missingSkills: ['Dynamic Programming', 'Graph Algorithms'],
      prepLink: '/quiz/aptitude'
    },
    {
      id: 'backend',
      role: 'Backend & Cloud Developer',
      matchScore: 74,
      demandLevel: 'High',
      avgSalary: '$80k - $115k',
      acquiredSkills: ['Node.js', 'Express', 'SQL', 'PostgreSQL'],
      missingSkills: ['Redis Caching', 'Kubernetes'],
      prepLink: '/ai-mock-interview'
    }
  ];

  const [selectedRole, setSelectedRole] = useState(roleProfiles[0]);

  return (
    <div className="glass-card p-6 space-y-6 rounded-3xl border border-gray-200 dark:border-dark-border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-purple/10 text-brand-purple">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-extrabold uppercase">
              <Sparkles className="w-3 h-3" /> AI JOB MATCH RECOMMENDER
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Corporate Job Readiness & Compatibility Engine
            </h3>
          </div>
        </div>

        <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-dark-border px-3 py-1.5 rounded-xl">
          Profile Synced with Placement History
        </span>
      </div>

      {/* Role Selection & Compatibility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roleProfiles.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedRole(item)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
              selectedRole.id === item.id
                ? 'bg-gradient-to-br from-brand-purple/10 via-indigo-500/5 to-transparent border-brand-purple shadow-lg ring-2 ring-brand-purple/20'
                : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border hover:border-brand-purple/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                {item.role}
              </span>
              <div className="flex items-center gap-1 text-emerald-500 font-extrabold text-sm">
                <Zap className="w-4 h-4 fill-current" />
                <span>{item.matchScore}%</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-dark-border h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-purple to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${item.matchScore}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>Demand: <strong className="text-gray-700 dark:text-gray-300">{item.demandLevel}</strong></span>
              <span>Avg: <strong className="text-gray-700 dark:text-gray-300">{item.avgSalary}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Skill Breakdown for Selected Role */}
      {selectedRole && (
        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-dark-border pb-3">
            <h4 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-purple" />
              <span>Skill Compatibility Breakdown for {selectedRole.role}</span>
            </h4>
            <button
              onClick={() => navigate(selectedRole.prepLink)}
              className="btn-gradient px-4 py-2 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
            >
              <span>Launch Recommended Preparation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Acquired Skills */}
            <div className="space-y-2">
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Acquired Placement Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.acquiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="space-y-2">
              <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Recommended Skill Gaps to Bridge:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-500/20"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
