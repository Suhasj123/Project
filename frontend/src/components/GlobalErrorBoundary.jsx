import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PrepAI Portal Error Boundary Captured]', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-gray-800 border border-gray-700 space-y-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black">PrepAI Session Recovery</h1>
              <p className="text-xs text-gray-400">
                An unexpected UI state occurred. Click below to clear cache and return to the main login portal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-left text-xs font-mono text-rose-300 overflow-x-auto">
              {this.state.error?.toString() || 'Unknown UI Exception'}
            </div>

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset & Open Visme Login</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
