import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Code2,
  Brain,
  Download,
  X,
  ChevronRight,
  Clock,
  DollarSign,
  GraduationCap,
  FileText,
  Award,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { masterCompanyList } from '../data/companyData';

export const CompanyTestsSection = ({ onStartCompanyTest, onDownloadPDF }) => {
  const [selectedCompanyModal, setSelectedCompanyModal] = useState(null);
  const [activeTab, setActiveTab] = useState('pattern');
  const [activeTestModal, setActiveTestModal] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const { addToast } = useToast();

  const companyList = masterCompanyList;
  const filteredCompanies = companyList.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    c.shortName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.category.toLowerCase().includes(searchFilter.toLowerCase())
  );
  // Start Interactive Test Modal
  const handleStartTest = (company) => {
    setActiveTestModal(company);
    setUserAnswers({});
    setTestSubmitted(false);
    setTestScore(null);
    addToast(`Launched ${company.shortName} Specific Interview Test!`, 'info');
  };

  const handleSelectOption = (qId, option) => {
    if (testSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmitTest = () => {
    if (!activeTestModal) return;
    let score = 0;
    activeTestModal.questions.forEach(q => {
      if (userAnswers[q._id] === q.correctAnswer) {
        score += 1;
      }
    });
    const percentage = Math.round((score / activeTestModal.questions.length) * 100);
    setTestScore({ score, total: activeTestModal.questions.length, percentage });
    setTestSubmitted(true);
    addToast(`${activeTestModal.shortName} Test Completed! Score: ${percentage}%`, 'success');
  };

  // DOWNLOAD COMPANY TOP PREFERENCE QUESTIONS & SOLUTIONS PDF CHEATSHEET
  const handleDownloadCompanyPDF = (company) => {
    addToast(`Generating ${company.shortName} Top Questions & Answers PDF...`, 'info');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addToast('Pop-up blocked. Please allow pop-ups to download PDF.', 'warning');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${company.name} - Top Preference Questions & Answers</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px; color: #1e293b; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; }
            .company-title { font-size: 26px; font-weight: 800; color: #4338ca; margin: 0; }
            .category { font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; font-size: 13px; }
            .q-card { background: #ffffff; border: 1px solid #cbd5e1; border-left: 5px solid #6366f1; padding: 18px; margin-bottom: 18px; border-radius: 10px; page-break-inside: avoid; }
            .q-num { font-size: 11px; font-weight: 800; color: #6366f1; text-transform: uppercase; }
            .q-text { font-size: 15px; font-weight: 700; color: #0f172a; margin: 6px 0 10px 0; }
            .q-ans { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; margin-bottom: 8px; }
            .q-exp { background: #f1f5f9; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #334155; }
            .exp-section { background: #faf5ff; border: 1px solid #e9d5ff; padding: 16px; border-radius: 12px; margin-top: 24px; font-size: 13px; }
            .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="category">${company.category}</div>
            <h1 class="company-title">${company.name}</h1>
            <div style="font-size: 13px; color: #475569; font-weight: bold; margin-top: 4px;">Top Preference Placement Interview Cheatsheet</div>
          </div>

          <div class="meta-grid">
            <div><strong>💰 CTC / Package:</strong> ${company.package}</div>
            <div><strong>🎯 Difficulty Level:</strong> ${company.difficulty}</div>
            <div><strong>🎓 Eligibility:</strong> ${company.pattern.eligibility}</div>
            <div><strong>💻 Core Tech Stack:</strong> ${company.pattern.techStack.join(', ')}</div>
          </div>

          <h2 style="font-size: 18px; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 16px;">
            Top Preference Interview Questions & Answers
          </h2>

          ${company.questions.map((q, idx) => `
            <div class="q-card">
              <div class="q-num">Top Question #${idx + 1}</div>
              <div class="q-text">${q.questionText}</div>
              <div class="q-ans">✓ Correct Solution: ${q.correctAnswer}</div>
              <div class="q-exp">💡 <strong>Detailed Explanation:</strong> ${q.explanation}</div>
            </div>
          `).join('')}

          ${company.experiences && company.experiences.length > 0 ? `
            <div class="exp-section">
              <strong style="color: #6b21a8; font-size: 14px;">🌟 Student Placement Interview Tip:</strong>
              <p style="margin: 6px 0 0 0; color: #4c1d95; font-style: italic;">"${company.experiences[0].feedback}" - ${company.experiences[0].student}</p>
            </div>
          ` : ''}

          <div class="footer">
            Generated by PrepAI Official Placement Portal • ${company.shortName} Candidate Interview Kit
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 my-8">
      {/* Company Section Header */}
      <div className="glass-card p-6 border-l-4 border-l-brand-purple space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-purple" />
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Company-Specific Preparation Hub (16 Top Companies & 35+ Qs Each)
              </h2>
              <p className="text-xs text-gray-500 max-w-2xl">
                Explore recruitment patterns, practice tests, and download individual 35+ Top Q&A PDF cheatsheets for top IT service giants and product MNCs.
              </p>
            </div>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple font-extrabold text-xs shrink-0 self-start sm:self-auto">
            16 RECRUITERS AVAILABLE
          </span>
        </div>

        {/* Company Search Input Bar */}
        <div className="pt-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search company by name or category (e.g. TCS, Infosys, Amazon, Google, Microsoft, Accenture, Cloud)..."
            className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map((comp) => (
          <div
            key={comp.shortName}
            className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-brand-purple transition-all duration-300 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-dark-border p-1 overflow-hidden flex items-center justify-center">
                    <img src={comp.logo} alt={comp.shortName} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-base group-hover:text-brand-purple transition">
                      {comp.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-gray-400 block">{comp.category}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-white bg-gradient-to-r ${comp.color}`}>
                  {comp.difficulty}
                </span>
              </div>

              {/* Package & Eligibility Card */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-dark-border/40 text-xs space-y-1.5 border border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Package / CTC: <strong>{comp.package}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Eligibility: {comp.pattern.eligibility}</span>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5">
                {comp.pattern.techStack.slice(0, 5).map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple text-[10px] font-bold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* THREE INTERACTIVE BUTTONS PER COMPANY */}
            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-dark-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Button 1: Take Test */}
                <button
                  onClick={() => handleStartTest(comp)}
                  className="btn-gradient py-2.5 px-3 rounded-xl font-extrabold text-xs shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Take {comp.shortName} Test 🚀</span>
                </button>

                {/* Button 2: Company Details */}
                <button
                  onClick={() => { setSelectedCompanyModal(comp); setActiveTab('pattern'); }}
                  className="py-2.5 px-3 rounded-xl font-extrabold text-xs border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-brand-purple" />
                  <span>View Details 🏢</span>
                </button>
              </div>

              {/* Button 3: SMALL OPTION TO DOWNLOAD TOP PREFERENCE QUESTIONS & ANSWERS */}
              <button
                onClick={() => handleDownloadCompanyPDF(comp)}
                className="w-full py-2 px-3 rounded-xl font-bold text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition flex items-center justify-center gap-1.5"
                title={`Download ${comp.shortName} Top Q&A PDF`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {comp.shortName} Top Q&A PDF 📥</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BEFORE PDF DOWNLOAD ACTION BANNER */}
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-500/10 via-brand-purple/10 to-brand-blue/10 border-2 border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Ready for Master Placement Record?</h3>
          </div>
          <p className="text-xs text-gray-500">
            Generate and download your complete performance evaluation PDF report incorporating test scores, ATS compatibility, and company readiness breakdown.
          </p>
        </div>

        <button
          onClick={onDownloadPDF}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-extrabold text-xs shadow-xl hover:scale-105 transition flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Master Test PDF Report 📄</span>
        </button>
      </div>

      {/* MODAL 1: DETAILED COMPANY INFORMATION MODAL */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-dark-border pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedCompanyModal.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{selectedCompanyModal.name}</h3>
                  <span className="text-xs text-gray-400 font-medium">{selectedCompanyModal.category} • Package: {selectedCompanyModal.package}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-dark-border text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex flex-wrap sm:flex-nowrap sm:overflow-x-auto border-b border-gray-200 dark:border-dark-border gap-1.5 sm:gap-2 pb-2">
              {[
                { key: 'pattern', label: 'Company Overview & Pattern' },
                { key: 'questions', label: 'Prep Questions & Solutions' },
                { key: 'experiences', label: 'Student Placement Tips' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                    activeTab === tab.key
                      ? 'bg-brand-purple text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'pattern' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 text-xs space-y-2 border border-gray-200 dark:border-dark-border">
                  <span className="font-extrabold text-brand-purple block text-sm">🏢 Recruiter Overview:</span>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedCompanyModal.overview}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 text-xs space-y-1 border border-emerald-500/20">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">🎓 Academic Eligibility & Backlog Policy:</span>
                  <p className="text-emerald-800 dark:text-emerald-200 font-semibold leading-relaxed">{selectedCompanyModal.pattern.eligibility}</p>
                </div>

                <div className="space-y-3">
                  <span className="font-extrabold text-xs text-gray-900 dark:text-white block">Interview Rounds Breakdown:</span>
                  {selectedCompanyModal.pattern.rounds.map((rd, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-xl border border-gray-200 dark:border-dark-border space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                        <span>{rd.name}</span>
                        <span className="text-brand-purple font-extrabold">{rd.duration}</span>
                      </div>
                      <p className="text-gray-500 text-[11px]">{rd.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-3 text-xs">
                {selectedCompanyModal.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 space-y-2 border border-gray-200 dark:border-dark-border">
                    <span className="font-extrabold text-brand-purple block">Q{qIdx + 1}: {q.questionText}</span>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Correct Answer: {q.correctAnswer}
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed">💡 Explanation: {q.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'experiences' && (
              <div className="space-y-3 text-xs">
                {selectedCompanyModal.experiences.map((exp, eIdx) => (
                  <div key={eIdx} className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/15 space-y-2">
                    <span className="font-extrabold text-gray-900 dark:text-white block">{exp.student}</span>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">"{exp.feedback}"</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between gap-3">
              <button
                onClick={() => handleDownloadCompanyPDF(selectedCompanyModal)}
                className="py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Top Q&A PDF 📥</span>
              </button>

              <button
                onClick={() => {
                  const comp = selectedCompanyModal;
                  setSelectedCompanyModal(null);
                  handleStartTest(comp);
                }}
                className="btn-gradient px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5"
              >
                <span>Take {selectedCompanyModal.shortName} Assessment Test 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPANY PREPARATION TEST MODAL */}
      {activeTestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-lg">
                  OFFICIAL {activeTestModal.shortName.toUpperCase()} RECRUITMENT PREPARATION TEST
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {activeTestModal.name} Practice Test
                </h3>
              </div>
              <button
                onClick={() => setActiveTestModal(null)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-dark-border text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!testSubmitted ? (
              <div className="space-y-6 text-xs">
                {activeTestModal.questions.map((q, idx) => (
                  <div key={q._id} className="glass-card p-5 space-y-3">
                    <span className="font-extrabold text-brand-purple">Q{idx + 1}. {q.questionText}</span>
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isSel = userAnswers[q._id] === opt;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(q._id, opt)}
                            className={`w-full text-left p-3 rounded-xl border font-semibold transition flex items-center justify-between ${
                              isSel
                                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue dark:text-white font-bold'
                                : 'bg-gray-50 dark:bg-dark-border/40 border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSel && <CheckCircle2 className="w-4 h-4 text-brand-blue" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitTest}
                  className="btn-gradient w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg hover:scale-[1.01] transition"
                >
                  Submit {activeTestModal.shortName} Assessment Test
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">TEST SCORE SUMMARY</span>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                    {testScore.percentage}% Score
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    You answered {testScore.score} out of {testScore.total} questions correctly for {activeTestModal.shortName}.
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  {activeTestModal.questions.map((q, idx) => {
                    const isCorrect = userAnswers[q._id] === q.correctAnswer;
                    return (
                      <div key={q._id} className={`p-4 rounded-xl border text-xs space-y-1 ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                        <div className="flex items-center justify-between font-bold">
                          <span>Q{idx + 1}. {q.questionText}</span>
                          <span className={isCorrect ? 'text-emerald-500 font-extrabold' : 'text-rose-500 font-extrabold'}>
                            {isCorrect ? 'Correct (+1)' : 'Incorrect'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-[11px]">💡 Explanation: {q.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleDownloadCompanyPDF(activeTestModal)}
                    className="py-3 px-6 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {activeTestModal.shortName} Top Q&A PDF 📥</span>
                  </button>

                  <button
                    onClick={() => setActiveTestModal(null)}
                    className="btn-gradient px-8 py-3 rounded-xl font-extrabold text-xs"
                  >
                    Close Test Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
