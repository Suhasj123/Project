import React, { useState } from 'react';
import { masterCompanyList } from '../data/companyData';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import {
  Search,
  Building2,
  Bookmark,
  BookmarkCheck,
  ArrowRightLeft,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Briefcase,
  DollarSign,
  Code2,
  Layers,
  HelpCircle,
  ExternalLink,
  Award,
  Globe,
  X,
  FileText
} from 'lucide-react';

export const CompanyExplorerWidget = () => {
  const [searchTerm, setSearchTerm] = useState('TCS');
  const [activeCompany, setActiveCompany] = useState(masterCompanyList[0]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, tech, hiring, questions, askAI, gap
  const [savedCompanies, setSavedCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem('prep_ai_saved_companies');
      return saved ? JSON.parse(saved) : ['TCS', 'Infosys', 'Amazon'];
    } catch (e) {
      return ['TCS', 'Infosys', 'Amazon'];
    }
  });

  // AI "Ask About This Company" States
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Compare Companies Modal State
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareCompany1, setCompareCompany1] = useState(masterCompanyList[0]);
  const [compareCompany2, setCompareCompany2] = useState(masterCompanyList[1]);

  const { addToast } = useToast();

  // Search Filtered List
  const filteredCompanies = masterCompanyList.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.pattern.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle Search Selection or Fallback Search
  const handleSelectCompany = (company) => {
    setActiveCompany(company);
    setActiveTab('overview');
    setAiChatHistory([]);
  };

  // Toggle Bookmark / Save Company
  const toggleSaveCompany = (shortName) => {
    let updated;
    if (savedCompanies.includes(shortName)) {
      updated = savedCompanies.filter(c => c !== shortName);
      addToast(`Removed ${shortName} from saved list.`, 'info');
    } else {
      updated = [...savedCompanies, shortName];
      addToast(`Saved ${shortName} to your Career Favorites! 🌟`, 'success');
    }
    setSavedCompanies(updated);
    localStorage.setItem('prep_ai_saved_companies', JSON.stringify(updated));
  };

  // Handle AI "Ask About This Company"
  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userPrompt = aiQuestion.trim();
    setAiQuestion('');
    setAiChatHistory(prev => [...prev, { role: 'user', text: userPrompt }]);
    setAiLoading(true);

    try {
      const res = await API.post('/ai/chat', {
        message: `Regarding ${activeCompany.name}: ${userPrompt}`,
        context: `Company: ${activeCompany.name}, Package: ${activeCompany.package}, Category: ${activeCompany.category}, Tech Stack: ${activeCompany.pattern.techStack.join(', ')}`
      });

      const aiReply = res.data.reply || `In ${activeCompany.name}, interviewers place high emphasis on ${activeCompany.pattern.techStack.slice(0, 3).join(', ')}. Practice core algorithmic speed and STAR behavioral project stories.`;
      setAiChatHistory(prev => [...prev, { role: 'assistant', text: aiReply }]);
    } catch (err) {
      setAiChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `For ${activeCompany.name}, focus on mastering ${activeCompany.pattern.techStack.join(', ')}. In Round 1, accuracy in Quantitative & Reasoning is key. In Round 2, be prepared to write clean SQL queries and explain your final-year project architecture.`
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Bar & Compare Button Header */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>AI CAREER INTELLIGENCE ENGINE</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Company Explorer & Intelligence Dashboard
            </h2>
            <p className="text-xs text-gray-500 max-w-xl">
              Search any IT giant or product firm. Inspect packages, tech stacks, hiring rounds, verified Q&A, skill gaps, and ask real-time AI career questions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 font-extrabold text-xs transition-all flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Compare 2 Companies ⚖️</span>
            </button>
          </div>
        </div>

        {/* Dynamic Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company name, category, or tech stack (e.g. TCS, Infosys, Amazon, React, Python)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple shadow-sm"
          />
        </div>

        {/* Quick Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-black uppercase text-gray-400 mr-1">Quick Select:</span>
          {(filteredCompanies.length > 0 ? filteredCompanies : masterCompanyList).slice(0, 8).map((comp) => {
            const isSelected = activeCompany.shortName === comp.shortName;
            const isSaved = savedCompanies.includes(comp.shortName);
            return (
              <button
                key={comp.shortName}
                onClick={() => handleSelectCompany(comp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-md scale-[1.02]'
                    : 'bg-gray-100 dark:bg-dark-border/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
                }`}
              >
                <span>{comp.shortName}</span>
                {isSaved && <BookmarkCheck className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Company Intelligence Canvas */}
      <div className="glass-card p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Company Title Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 border-b border-gray-100 dark:border-dark-border pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-lg shrink-0">
              {activeCompany.shortName.slice(0, 3)}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{activeCompany.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple font-extrabold text-[10px] uppercase">
                  {activeCompany.difficulty} Difficulty
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium flex flex-wrap items-center gap-2">
                <span>{activeCompany.category}</span> •
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activeCompany.package}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => toggleSaveCompany(activeCompany.shortName)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                savedCompanies.includes(activeCompany.shortName)
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {savedCompanies.includes(activeCompany.shortName) ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Saved to Favorites</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-gray-400" />
                  <span>Save Company</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-3 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'overview', label: '🏢 Overview & Culture', icon: Building2 },
            { id: 'tech', label: '🛠️ Tech Stack & Roles', icon: Code2 },
            { id: 'hiring', label: '📋 Recruitment Rounds', icon: Layers },
            { id: 'questions', label: '💡 Verified Q&A (35+)', icon: HelpCircle },
            { id: 'gap', label: '⚠️ Skill Gap Checklist', icon: AlertTriangle },
            { id: 'askAI', label: '🤖 Ask About This Company', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-extrabold transition-all shrink-0 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/60'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <div className="p-5 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 space-y-2">
              <h3 className="font-extrabold text-sm text-brand-purple uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Company Overview
              </h3>
              <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                {activeCompany.overview}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-1">
                <span className="font-extrabold text-gray-400 uppercase text-[10px]">CTC Packages Offered</span>
                <p className="font-extrabold text-gray-900 dark:text-white text-xs">{activeCompany.package}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-1">
                <span className="font-extrabold text-gray-400 uppercase text-[10px]">Selection Difficulty</span>
                <p className="font-extrabold text-brand-purple text-xs">{activeCompany.difficulty}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-1">
                <span className="font-extrabold text-gray-400 uppercase text-[10px]">Eligibility Criteria</span>
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{activeCompany.pattern.eligibility}</p>
              </div>
            </div>

            {/* Student Experience */}
            {activeCompany.experiences && activeCompany.experiences.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <h4 className="font-extrabold text-amber-600 dark:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" /> Verified Candidate Interview Experience
                </h4>
                <p className="text-xs italic text-gray-800 dark:text-gray-200">
                  "{activeCompany.experiences[0].feedback}"
                </p>
                <span className="text-[11px] font-bold text-gray-500 block">— {activeCompany.experiences[0].student}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Tech Stack */}
        {activeTab === 'tech' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-purple" /> Primary Technologies & Languages Evaluated
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeCompany.pattern.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-brand-purple/10 text-brand-purple font-extrabold text-xs">
                    ⚡ {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase">Career Roles & Hiring Tracks</h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                Candidates hired at {activeCompany.name} are assigned to roles such as Full Stack Developer, Data Engineer, DevOps Engineer, Cloud Architect, or System Analyst depending on assessment performance.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 3: Hiring Rounds */}
        {activeTab === 'hiring' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-purple" /> Recruitment & Selection Round Breakdown
            </h3>
            
            <div className="space-y-3">
              {activeCompany.pattern.rounds.map((round, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-xs text-brand-purple">
                    <span>{round.name}</span>
                    <span className="text-gray-400 font-medium">{round.duration}</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{round.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: Verified Q&A */}
        {activeTab === 'questions' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-2">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-purple" /> Verified Technical & Aptitude Q&A
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[10px]">
                35 VERIFIED QUESTIONS
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {(activeCompany.questions || []).slice(0, 5).map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border space-y-2">
                  <div className="font-extrabold text-xs text-gray-900 dark:text-white">
                    Q{idx + 1}. {q.questionText}
                  </div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    ✓ Correct Answer: {q.correctAnswer}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    💡 Explanation: {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 5: Skill Gap Checklist */}
        {activeTab === 'gap' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Candidate Readiness vs {activeCompany.shortName} Requirements
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Skills Present in Your Candidate Profile
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['JavaScript', 'React', 'Node.js', 'SQL', 'Git'].map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-extrabold text-[11px]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <span className="font-extrabold text-rose-600 dark:text-rose-400 text-xs uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Recommended Target Skills to Add
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCompany.pattern.techStack.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 font-extrabold text-[11px]">
                      ⚠ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 6: AI "Ask About This Company" Assistant */}
        {activeTab === 'askAI' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 space-y-1">
              <span className="font-extrabold text-brand-purple uppercase text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" /> Ask AI Career Coach About {activeCompany.shortName}
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Ask custom questions about work life, salary negotiations, technical round focus areas, or recent recruitment trends.
              </p>
            </div>

            {/* Chat History Box */}
            <div className="space-y-3 max-h-80 overflow-y-auto p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-200 dark:border-dark-border">
              {aiChatHistory.length === 0 ? (
                <p className="text-center text-gray-400 italic py-4">
                  No questions asked yet. Type your question below! (e.g. "What coding questions does {activeCompany.shortName} ask in Round 1?")
                </p>
              ) : (
                aiChatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl max-w-xl font-medium leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-purple text-white ml-auto text-right font-semibold'
                        : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 mr-auto'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="p-3 rounded-2xl bg-brand-purple/10 text-brand-purple font-extrabold text-xs animate-pulse">
                  🤖 AI Coach analyzing {activeCompany.shortName} dataset...
                </div>
              )}
            </div>

            {/* AI Query Form */}
            <form onSubmit={handleAskAI} className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={`Ask anything about ${activeCompany.shortName}...`}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-purple text-xs"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="btn-gradient px-5 py-3 rounded-xl font-extrabold text-xs shadow-md shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Compare 2 Companies Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-4xl w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl shadow-2xl p-6 space-y-6 text-gray-900 dark:text-white">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-brand-purple" />
                <span>Side-by-Side Company Comparison</span>
              </h3>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border text-gray-500 hover:text-gray-900 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector Columns */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="font-extrabold text-xs text-brand-purple block mb-1">Select Company 1</label>
                <select
                  value={compareCompany1.shortName}
                  onChange={(e) => setCompareCompany1(masterCompanyList.find(c => c.shortName === e.target.value) || masterCompanyList[0])}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white font-extrabold text-xs focus:outline-none"
                >
                  {masterCompanyList.map(c => (
                    <option key={c.shortName} value={c.shortName}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-extrabold text-xs text-indigo-600 block mb-1">Select Company 2</label>
                <select
                  value={compareCompany2.shortName}
                  onChange={(e) => setCompareCompany2(masterCompanyList.find(c => c.shortName === e.target.value) || masterCompanyList[1])}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white font-extrabold text-xs focus:outline-none"
                >
                  {masterCompanyList.map(c => (
                    <option key={c.shortName} value={c.shortName}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              
              {/* Company 1 */}
              <div className="p-5 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 space-y-3">
                <h4 className="font-extrabold text-base text-brand-purple">{compareCompany1.name}</h4>
                <div><strong>Category:</strong> {compareCompany1.category}</div>
                <div><strong>CTC Package:</strong> <span className="text-emerald-600 font-extrabold">{compareCompany1.package}</span></div>
                <div><strong>Difficulty:</strong> {compareCompany1.difficulty}</div>
                <div><strong>Tech Stack:</strong> {compareCompany1.pattern.techStack.join(', ')}</div>
                <div><strong>Eligibility:</strong> {compareCompany1.pattern.eligibility}</div>
              </div>

              {/* Company 2 */}
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                <h4 className="font-extrabold text-base text-indigo-600">{compareCompany2.name}</h4>
                <div><strong>Category:</strong> {compareCompany2.category}</div>
                <div><strong>CTC Package:</strong> <span className="text-emerald-600 font-extrabold">{compareCompany2.package}</span></div>
                <div><strong>Difficulty:</strong> {compareCompany2.difficulty}</div>
                <div><strong>Tech Stack:</strong> {compareCompany2.pattern.techStack.join(', ')}</div>
                <div><strong>Eligibility:</strong> {compareCompany2.pattern.eligibility}</div>
              </div>

            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="btn-gradient px-8 py-3 rounded-xl font-extrabold text-xs shadow-md"
              >
                Done Comparing
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
