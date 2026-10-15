import React, { Component } from 'react';
import { Bot, Sparkles, Brain, ScanLine } from 'lucide-react';

// Class Error Boundary to catch any third-party render errors
class LottieErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[Lottie Vector Player Notice]', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Pure SVG Vector Animation component
export const LottieAnimationPlayer = ({
  animationType = 'aiBrain', // 'aiBrain' | 'scanning'
  className = 'w-24 h-24'
}) => {
  const isScanning = animationType === 'scanning';

  const vectorGraphic = (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Pulsing Outer Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-purple/30 via-brand-blue/20 to-emerald-400/30 blur-lg animate-pulse-glow"></div>

      {/* Spinning SVG Vector Orbit Ring */}
      <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="12 8"
          fill="none"
          className={isScanning ? 'text-emerald-500' : 'text-brand-purple'}
        />
      </svg>

      {/* Center Vector Icon & Animation Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isScanning ? (
          <div className="relative flex flex-col items-center">
            <ScanLine className="w-10 h-10 text-emerald-500 animate-bounce" />
            <span className="w-12 h-1 bg-emerald-400/80 rounded-full blur-[1px] animate-pulse mt-1"></span>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <Brain className="w-10 h-10 text-brand-purple animate-pulse" />
            <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <LottieErrorBoundary fallback={vectorGraphic}>
      {vectorGraphic}
    </LottieErrorBoundary>
  );
};
