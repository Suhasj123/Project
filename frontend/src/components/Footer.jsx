import React from 'react';
import { Brain, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-t border-gray-200 dark:border-dark-border py-6 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-sm">
            <Brain className="w-4 h-4" />
          </div>
          <span>Interview<span className="text-brand-purple font-black">Pro</span></span>
          <span className="text-xs text-gray-400 font-normal border-l border-gray-300 dark:border-dark-border pl-2 ml-1 hidden sm:inline">
            AI Placement & Assessment Platform
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Developed by <strong className="text-brand-purple font-extrabold tracking-wide">Suhas J</strong></span>
        </div>

        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          © {new Date().getFullYear()} InterviewPro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
