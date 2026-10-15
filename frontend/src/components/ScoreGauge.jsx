import React from 'react';

export const ScoreGauge = ({ score = 75, title = "Job Readiness Score", subtitle = "Based on quiz & interview accuracy" }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-emerald-500";
  if (score < 50) colorClass = "text-rose-500";
  else if (score < 75) colorClass = "text-amber-500";

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card">
      <div className="relative flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-gray-200 dark:stroke-dark-border"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            className={`stroke-current ${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{score}%</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Score</span>
        </div>
      </div>
      <h3 className="mt-4 font-bold text-gray-900 dark:text-white text-base">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{subtitle}</p>
    </div>
  );
};
