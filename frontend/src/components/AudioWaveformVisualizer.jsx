import React, { useEffect, useRef } from 'react';
import { Mic, Volume2 } from 'lucide-react';

export const AudioWaveformVisualizer = ({ isActive = false, mode = 'listening' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 32;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        let barHeight;
        if (isActive) {
          // Dynamic sine wave pattern with random frequency variation
          const base = Math.sin(step * 0.1 + i * 0.3) * 0.5 + 0.5;
          const randomFactor = Math.random() * 0.4 + 0.6;
          barHeight = base * canvas.height * 0.75 * randomFactor + 8;
        } else {
          barHeight = 4 + Math.sin(i * 0.5) * 2;
        }

        const x = i * (barWidth + 2);
        const y = (canvas.height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (mode === 'listening') {
          gradient.addColorStop(0, '#8b5cf6'); // Purple
          gradient.addColorStop(1, '#ec4899'); // Pink
        } else {
          gradient.addColorStop(0, '#3b82f6'); // Blue
          gradient.addColorStop(1, '#10b981'); // Emerald
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
      }

      step += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, mode]);

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isActive 
        ? mode === 'listening'
          ? 'bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-500/10'
          : 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
        : 'bg-gray-500/5 border-gray-200 dark:border-dark-border opacity-75'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {mode === 'listening' ? (
            <Mic className={`w-4 h-4 ${isActive ? 'text-purple-500 animate-bounce' : 'text-gray-400'}`} />
          ) : (
            <Volume2 className={`w-4 h-4 ${isActive ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
          )}
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            {mode === 'listening' ? 'Candidate Voice Audio Input' : 'AI Speech Output'}
          </span>
        </div>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
          isActive
            ? mode === 'listening'
              ? 'bg-purple-500 text-white animate-pulse'
              : 'bg-blue-500 text-white animate-pulse'
            : 'bg-gray-200 dark:bg-dark-border text-gray-500'
        }`}>
          {isActive ? (mode === 'listening' ? 'LIVE LISTENING' : 'SPEAKING') : 'STANDBY'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={380}
        height={48}
        className="w-full h-12 rounded-xl"
      />
    </div>
  );
};
