import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain } from 'lucide-react';

export const Footer = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border py-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <span>Prep<span className="text-brand-purple">AI</span></span>
          <span className="text-xs text-gray-500 font-normal border-l border-gray-300 dark:border-dark-border pl-2 ml-1">Placement & Interview Prep</span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
          AI-Powered Interview Preparation & Assessment System
        </p>

        <div className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} PrepAI Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
