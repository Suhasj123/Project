import React from 'react';

export const ScoreGauge = ({ score = 75, title = "Job Readiness Score", subtitle = "Based on quiz & interview accuracy" }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-emerald-500";
  if (score < 50) colorClass = "text-rose-500";
  else if (score < 75) colorClass = "text-amber-500";

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 glass-card w-full max-w-full">
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-40 sm:h-40 transform -rotate-90 shrink-0">
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
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{score}%</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Score</span>
        </div>
      </div>
      <h3 className="mt-3 sm:mt-4 font-bold text-gray-900 dark:text-white text-sm sm:text-base text-center">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 max-w-xs">{subtitle}</p>
    </div>
  );
};
