import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export const Timer = ({ initialSeconds = 600, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isWarning = secondsLeft < 60;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold shadow-sm transition-all ${
        isWarning
          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 animate-pulse'
          : 'bg-brand-blue/10 dark:bg-brand-purple/20 text-brand-blue dark:text-brand-lightPurple border border-brand-blue/20'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>{formatted}</span>
    </div>
  );
};
