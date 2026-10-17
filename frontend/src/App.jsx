import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Dashboard } from './pages/Dashboard';
import { AptitudeQuiz } from './pages/AptitudeQuiz';
import { CodingQuiz } from './pages/CodingQuiz';
import { AIInterview } from './pages/AIInterview';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { LearningCenter } from './pages/LearningCenter';
import { CompanyPrep } from './pages/CompanyPrep';
import { CompanyDirectory } from './pages/CompanyDirectory';
import { AIMentor } from './pages/AIMentor';
import { ProgressDashboard } from './pages/ProgressDashboard';
import { Profile } from './pages/Profile';
import { AdminPanel } from './pages/AdminPanel';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { AIMockInterview } from './pages/AIMockInterview';
import { PrepDashboard } from './pages/PrepDashboard';
import { QuickAssessmentStart } from './pages/QuickAssessmentStart';
import { QuickAssessmentResume } from './pages/QuickAssessmentResume';
import { QuickAssessmentAptitude } from './pages/QuickAssessmentAptitude';
import { QuickAssessmentCoding } from './pages/QuickAssessmentCoding';
import { QuickAssessmentSummary } from './pages/QuickAssessmentSummary';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { CompanyDetail } from './pages/CompanyDetail';
import { Leaderboard } from './pages/Leaderboard';
import { IncrementalModel } from './pages/IncrementalModel';

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isSidebarVisible = user && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/forgot-password';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-200">
      <Navbar />
      <div className={`flex-1 flex flex-col justify-between min-h-screen w-full overflow-x-hidden ${isSidebarVisible ? 'lg:pl-64' : ''}`}>
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
                    {/* Public Auth Routes */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Quick Assessment Routes (Direct 0-OTP Candidate Flow) */}
                    <Route path="/quick-assessment" element={<ProtectedRoute><QuickAssessmentResume /></ProtectedRoute>} />
                    <Route path="/quick-assessment/start" element={<ProtectedRoute><QuickAssessmentResume /></ProtectedRoute>} />
                    <Route path="/quick-assessment/resume" element={<ProtectedRoute><QuickAssessmentResume /></ProtectedRoute>} />
                    <Route path="/quick-assessment/aptitude-screener" element={<ProtectedRoute><QuickAssessmentAptitude /></ProtectedRoute>} />
                    <Route path="/quick-assessment/coding-round" element={<ProtectedRoute><QuickAssessmentCoding /></ProtectedRoute>} />
                    <Route path="/quick-assessment/summary" element={<ProtectedRoute><QuickAssessmentSummary /></ProtectedRoute>} />

                    {/* Protected Candidate, Recruiter & Admin Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/company-directory" element={<ProtectedRoute><CompanyDirectory /></ProtectedRoute>} />
                    <Route path="/aptitude-quiz" element={<ProtectedRoute><AptitudeQuiz /></ProtectedRoute>} />
                    <Route path="/coding-quiz" element={<ProtectedRoute><CodingQuiz /></ProtectedRoute>} />
                    <Route path="/ai-interview" element={<ProtectedRoute><AIInterview /></ProtectedRoute>} />
                    <Route path="/ai-mock-interview" element={<ProtectedRoute><AIMockInterview /></ProtectedRoute>} />
                    <Route path="/prep-dashboard" element={<ProtectedRoute><PrepDashboard /></ProtectedRoute>} />
                    <Route path="/recruiter-dashboard" element={<ProtectedRoute adminOrRecruiterOnly={true}><RecruiterDashboard /></ProtectedRoute>} />
                    <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
                    <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
                    <Route path="/companies" element={<ProtectedRoute><CompanyDirectory /></ProtectedRoute>} />
                    <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                    <Route path="/incremental-model" element={<ProtectedRoute><IncrementalModel /></ProtectedRoute>} />
                    <Route path="/learning-center" element={<ProtectedRoute><LearningCenter /></ProtectedRoute>} />
                    <Route path="/company-prep" element={<ProtectedRoute><CompanyPrep /></ProtectedRoute>} />
                    <Route path="/ai-mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />

                    {/* Catch-all Fallback Route for clean page reloads */}
                    <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/resume-analyzer') : '/login'} replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
