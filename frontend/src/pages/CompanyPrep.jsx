import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  CheckCircle2,
  HelpCircle,
  Code2,
  UserCheck,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { CompanyExplorerWidget } from '../components/CompanyExplorerWidget';
import { CompanyTestsSection } from '../components/CompanyTestsSection';
import { PlacementStepper } from '../components/PlacementStepper';

export const CompanyPrep = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Step-by-Step Placement Stepper */}
      <PlacementStepper currentStep={4} />

      {/* AI-Powered Company Explorer & Career Intelligence Dashboard */}
      <CompanyExplorerWidget />

      {/* Header */}
      <div className="glass-card p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-brand-blue/10 text-brand-blue mx-auto flex items-center justify-center">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Top Company Preparation Hubs</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Placement patterns, technical Q&A, coding questions, and real student experiences for IT service giants.
        </p>
      </div>

      {/* Company Selector Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {companies.map((comp) => (
          <button
            key={comp.name}
            onClick={() => { setSelectedCompany(comp); setActiveTab('pattern'); }}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCompany?.name === comp.name
                ? 'btn-gradient shadow-lg scale-105'
                : 'glass-card text-gray-700 dark:text-gray-300 hover:border-brand-purple'
            }`}
          >
            <span>{comp.name}</span>
          </button>
        ))}
      </div>

      {/* Main Selected Company Hub */}
      {selectedCompany && (
        <div className="glass-card p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-6">
            <div>
              <div className="text-xs font-bold text-brand-purple uppercase tracking-wider">Target Recruiter</div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">{selectedCompany.name} Placement Module</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Difficulty: {selectedCompany.pattern?.difficulty || 'Medium'}
              </span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 dark:border-dark-border gap-2 pb-2">
            {[
              { key: 'pattern', label: 'Interview Pattern', icon: BookOpen },
              { key: 'technical', label: 'Technical Q&A', icon: HelpCircle },
              { key: 'hr', label: 'HR Questions', icon: UserCheck },
              { key: 'coding', label: 'Coding Problems', icon: Code2 },
              { key: 'experiences', label: 'Student Experiences', icon: Sparkles }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    activeTab === tab.key
                      ? 'bg-brand-blue/10 dark:bg-brand-purple/20 text-brand-blue dark:text-brand-lightPurple border-b-2 border-brand-purple'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content 1: Pattern */}
          {activeTab === 'pattern' && (
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Selection Process Rounds</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedCompany.pattern?.rounds?.map((rd, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-purple">Round {i + 1}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{rd.duration}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{rd.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{rd.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 space-y-2">
                <h4 className="font-bold text-brand-blue text-sm">Eligibility Criteria</h4>
                <p className="text-xs text-gray-700 dark:text-gray-300">{selectedCompany.pattern?.eligibility}</p>
              </div>
            </div>
          )}

          {/* Tab Content 2: Technical Questions */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              {selectedCompany.technicalQuestions?.map((tq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-purple">Topic: {tq.topic}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">Q{i + 1}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{tq.question}</h4>
                  <div className="p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-xs text-gray-600 dark:text-gray-300">
                    <strong className="text-emerald-500">Suggested Answer: </strong>{tq.answer}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 3: HR Questions */}
          {activeTab === 'hr' && (
            <div className="space-y-4">
              {selectedCompany.hrQuestions?.map((hr, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">"{hr.question}"</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300"><strong>Sample Response: </strong>{hr.answer}</p>
                  <div className="text-[11px] text-brand-purple font-medium">💡 Preparation Tip: {hr.tips}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 4: Coding Questions */}
          {activeTab === 'coding' && (
            <div className="space-y-4">
              {selectedCompany.codingQuestions?.map((cq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{cq.title}</h4>
                    <span className="text-[10px] font-mono bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">{cq.language}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{cq.problemStatement}</p>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs">
                    <code>{cq.solution}</code>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 5: Student Experiences */}
          {activeTab === 'experiences' && (
            <div className="space-y-4">
              {selectedCompany.experiences?.map((exp, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{exp.studentName}</h4>
                      <span className="text-[10px] text-gray-400">{exp.college} • Batch {exp.year}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Verdict: {exp.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">"{exp.story}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Company Placement Tests & Details Section */}
      <CompanyTestsSection
        onDownloadPDF={() => {
          addToast('Generating Company Preparation Master Performance PDF...', 'info');
          window.print();
        }}
      />
    </div>
  );
};
