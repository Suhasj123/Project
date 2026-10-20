import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Brain,
  LayoutDashboard,
  Award,
  BookOpen,
  Code2,
  FileText,
  Building2,
  Bot,
  BarChart3,
  User,
  Users,
  HelpCircle,
  FileBarChart,
  Terminal,
  ShieldAlert,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Zap,
  FileCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not logged in or on login/auth pages, DO NOT display the navigation header/sidebar
  if (!user || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password') {
    return null;
  }

  const isAdminMode = user.role === 'admin' || user.email === 'suhasjsuhasj505@gmail.com' || localStorage.getItem('prep_ai_admin_mode') === 'true';

  // Construct Role-Specific Navigation Sidebar Panels
  let navLinks = [];

  if (user.role === 'admin' || user.email === 'suhasjsuhasj505@gmail.com') {
    // Admin Login Panels — Explicit Admin Management Features Only
    navLinks = [
      { name: 'Admin Console Hub', path: '/admin', icon: ShieldAlert },
      { name: 'Candidate Master Directory', path: '/admin', icon: Users },
      { name: 'Aptitude Question Manager', path: '/admin', icon: HelpCircle },
      { name: 'Coding Challenge Manager', path: '/admin', icon: Code2 },
      { name: 'Placement Hiring Reports', path: '/admin', icon: FileBarChart },
      { name: 'AI Engine Parameters', path: '/admin', icon: Bot },
      { name: 'Security Audit Logs', path: '/admin', icon: Terminal },
      { name: 'Leaderboard & Rankings', path: '/leaderboard', icon: Award }
    ];
  } else {
    // Student Candidate Process Panels - Resume Screener & ATS as first item
    navLinks = [
      { name: 'Resume Screener & ATS', path: '/resume-analyzer', icon: FileText },
      { name: 'Prep Dashboard', path: '/prep-dashboard', icon: LayoutDashboard },
      { name: 'Aptitude Assessment', path: '/aptitude-quiz', icon: BookOpen },
      { name: 'Coding Challenge', path: '/coding-quiz', icon: Code2 },
      { name: 'AI Mock Interview', path: '/ai-mock-interview', icon: Brain },
      { name: 'Performance Analytics', path: '/progress', icon: BarChart3 },
      { name: 'Leaderboard', path: '/leaderboard', icon: Award },
      { name: 'IT Companies 🏢', path: '/company-directory', icon: Building2 },
      { name: 'ATS Resume Creation 📄', path: '/resume-builder', icon: FileCheck }
    ];
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Top Navigation Bar (Visible only on small screens < lg) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-border px-4 py-3 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue via-brand-purple to-indigo-600 flex items-center justify-center text-white shadow">
            <Brain className="w-5 h-5" />
          </div>
          <span>Interview<span className="text-brand-purple font-extrabold">Pro</span></span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-200"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-border"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <aside className="w-72 bg-white dark:bg-dark-card h-full p-5 space-y-6 flex flex-col justify-between shadow-2xl border-r border-gray-200 dark:border-dark-border overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span>Interview<span className="text-brand-purple font-extrabold">Pro</span></span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-brand-purple text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer User Section */}
            <div className="border-t border-gray-100 dark:border-dark-border pt-4 space-y-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <img
                      src={user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-brand-purple"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-[10px] text-brand-purple capitalize font-extrabold">{user.role}</div>
                    </div>
                  </Link>
                  <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-xs font-bold border rounded-xl">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-gradient w-full text-center py-2 text-xs font-bold rounded-xl">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </aside>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Left-Side Vertical Sidebar Navigation Panel */}
      <aside className="hidden lg:flex w-64 h-screen fixed top-0 left-0 z-40 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-r border-gray-200 dark:border-dark-border flex-col justify-between p-5 shadow-2xl overflow-y-auto">
        <div className="space-y-6">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 px-2 pt-1 font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-purple to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <span>Interview<span className="text-brand-purple font-black">Pro</span></span>
          </Link>

          {/* Navigation Category Label */}
          <div className="px-2 text-[10px] font-extrabold tracking-wider uppercase text-gray-400">
            Placement Navigation
          </div>

          {/* Vertical Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-lg shadow-brand-purple/20 border-l-4 border-l-amber-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/60 hover:text-brand-purple'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-gray-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Theme Utility Panel */}
        <div className="border-t border-gray-100 dark:border-dark-border pt-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-gray-500">Appearance Mode</span>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

          {user ? (
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-border/40 border border-gray-100 dark:border-dark-border flex items-center justify-between">
              <Link to="/profile" className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt="Profile"
                  className="w-9 h-9 rounded-xl object-cover border-2 border-brand-purple shrink-0"
                />
                <div className="truncate">
                  <div className="text-xs font-extrabold text-gray-900 dark:text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-brand-purple capitalize font-black">{user.role}</div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <Link to="/login" className="block w-full text-center py-2.5 text-xs font-extrabold border border-gray-200 dark:border-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border">
                Sign In
              </Link>
              <Link to="/register" className="btn-gradient block w-full text-center py-2.5 text-xs font-extrabold rounded-xl shadow-md">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
