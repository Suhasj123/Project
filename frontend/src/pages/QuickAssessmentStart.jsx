import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * QuickAssessmentStart
 * Direct candidate entry bypass: Auto-redirects directly to the Resume Screener stage.
 * Completely eliminates OTP generation, verification, and code waiting.
 */
export const QuickAssessmentStart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/quick-assessment/resume', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
          Loading Quick Candidate Screener...
        </p>
      </div>
    </div>
  );
};

export default QuickAssessmentStart;
