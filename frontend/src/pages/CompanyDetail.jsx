import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  CheckCircle2,
  Star,
  ThumbsUp,
  MessageSquare,
  DollarSign,
  Briefcase,
  BookOpen,
  ArrowRight,
  Plus,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

export const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState({ company: null, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [newReview, setNewReview] = useState({
    authorName: 'Rahul Verma',
    rating: 5,
    role: 'Software Engineer',
    pros: 'Excellent engineering culture with cutting-edge cloud infrastructure.',
    cons: 'Fast-paced environment requiring strong self-initiative.',
    experienceText: 'Solved 2 LeetCode Medium questions on Hash Maps & Trees during technical rounds.'
  });

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/companies/${id}`);
      setData(res.data);
    } catch (err) {
      console.warn('[Company detail fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/companies/${id}/reviews`, newReview);
      addToast('Review Submitted & Published!', 'success');
      setShowReviewModal(false);
      setData(prev => ({ ...prev, reviews: [res.data, ...prev.reviews] }));
    } catch (err) {
      addToast('Failed to post review.', 'error');
    }
  };

  const { company, reviews } = data;
  if (!company && !loading) return <div className="p-12 text-center text-xs">Company not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/companies')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-purple transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Company Directory</span>
      </button>

      {/* Header Banner */}
      {company && (
        <div className="glass-card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-l-brand-purple">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white font-black text-2xl flex items-center justify-center shadow-xl">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  company.isVerified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-purple/10 text-brand-purple'
                }`}>
                  {company.isVerified ? 'Verified Profile ✓' : 'AI-Generated Guide ✨'}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{company.name}</h1>
              <p className="text-xs text-gray-500">{company.industry}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/ai-mock-interview?company=${company.name}`)}
            className="btn-gradient px-6 py-3.5 rounded-2xl font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice {company.name} Mock Interview 🚀</span>
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-dark-border pb-1 overflow-x-auto">
        {['Overview', 'Interview Q&A', 'Reviews', 'Salary Insights'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'Overview' && company && (
        <div className="glass-card p-8 space-y-6 text-xs animate-fadeIn">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">About {company.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{company.about}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Work Culture</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{company.culture}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Interview Hiring Process</h3>
            <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/15 text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">
              {company.interviewProcess}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interview Q&A */}
      {activeTab === 'Interview Q&A' && company && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              {company.name} Top Interview Questions ({company.qaList?.length || 0})
            </h3>
          </div>

          <div className="space-y-4">
            {company.qaList?.map((qa, idx) => (
              <div key={qa.id || idx} className="glass-card p-6 space-y-3 border-l-4 border-l-brand-purple">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple text-[10px] font-extrabold uppercase">
                      {qa.category || 'Technical'}
                    </span>
                    <h4 className="text-base font-extrabold text-gray-900 dark:text-white mt-1">
                      {idx + 1}. {qa.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-brand-purple font-extrabold bg-brand-purple/10 px-3 py-1.5 rounded-xl shrink-0">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{qa.upvotes || 12} Upvotes</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-dark-border/40 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white block mb-1">Detailed Solution / Answer:</strong>
                  {qa.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Candidate Reviews */}
      {activeTab === 'Reviews' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Candidate Interview Reviews</h3>
            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="glass-card p-6 space-y-3 border-l-4 border-l-amber-500 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-gray-900 dark:text-white">{r.authorName}</h4>
                    <span className="text-gray-400 font-semibold">{r.role}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    <strong className="block mb-0.5">Pros:</strong> {r.pros}
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                    <strong className="block mb-0.5">Cons:</strong> {r.cons}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Salary Insights */}
      {activeTab === 'Salary Insights' && company && (
        <div className="glass-card p-6 space-y-4 animate-fadeIn">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span>{company.name} Compensation & Salary Insights</span>
          </h3>

          <div className="space-y-3 text-xs">
            {company.salaryRows?.map((row, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{row.role}</h4>
                  <span className="text-gray-400">Experience: {row.experience}</span>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-emerald-500">{row.averageSalary}</div>
                  <div className="text-[10px] text-gray-400 font-bold">Average CTC</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Submit Candidate Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Your Name / Alias:</label>
                <input
                  type="text"
                  required
                  value={newReview.authorName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, authorName: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Pros:</label>
                <textarea
                  rows={2}
                  required
                  value={newReview.pros}
                  onChange={(e) => setNewReview(prev => ({ ...prev, pros: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Cons:</label>
                <textarea
                  rows={2}
                  required
                  value={newReview.cons}
                  onChange={(e) => setNewReview(prev => ({ ...prev, cons: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
                <button type="button" onClick={() => setShowReviewModal(false)} className="px-4 py-2 border rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="btn-gradient px-6 py-2 rounded-xl font-bold shadow-lg">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
