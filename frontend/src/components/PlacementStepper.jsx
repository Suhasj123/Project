import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const PlacementStepper = ({ currentStep, currentStage }) => {
  const activeStep = currentStep || currentStage || 1;
  const steps = [
    { number: 1, label: '1. Resume ATS & Quick Scan', path: '/resume-analyzer', icon: FileText, desc: 'Single Upload & Audit' },
    { number: 2, label: '2. Aptitude Screener', path: '/quick-assessment/resume', icon: Zap, desc: 'Candidate Screener' },
    { number: 3, label: '3. AI Mock Interview', path: '/ai-mock-interview', icon: Sparkles, desc: 'Voice AI Practice' },
    { number: 4, label: '4. Company Hub & PDFs', path: '/company-prep', icon: Building2, desc: '16 Recruiters & Qs' }
  ];

  return (
    <div className="glass-card p-3 md:p-4 mb-6">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 overflow-hidden">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === step.number;
          const isCompleted = activeStep > step.number;

          return (
            <React.Fragment key={step.number}>
              <Link
                to={step.path}
                className={`flex-1 flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white font-extrabold shadow-md scale-[1.02]'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20'
                    : 'bg-gray-50 dark:bg-dark-border/40 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-dark-border'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 dark:bg-dark-border text-gray-700 dark:text-gray-300'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.number}
                </div>

                <div>
                  <div className="text-xs leading-none">{step.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-indigo-100' : 'text-gray-400'}`}>
                    {step.desc}
                  </div>
                </div>
              </Link>

              {idx < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
