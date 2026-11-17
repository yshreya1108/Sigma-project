import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Users,
  Code2,
  FileCheck,
  ShieldAlert,
  GraduationCap,
  UserCheck,
  Sparkles,
  Layers,
  UserPlus,
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegister: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
}) => {
  const {
    role,
    currentUserProfile,
    applications,
    isAdminAuthenticated,
    logoutUser,
  } = useApp();

  const pendingAppsCount = applications.filter((a) => a.status === 'PENDING').length;

  // Opening Page Header: clean, no top-right 3-option switcher, no active student session
  if (activeTab === 'home') {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-semibold text-indigo-300">
                <GraduationCap className="w-3.5 h-3.5" /> Graphic Era Deemed to be University
              </span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline text-slate-400">
                B.Tech DSCPP-III-2026-T383 • Official Opening Website Page
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Private Account & Activity Vaults Enabled
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  SkillMatch
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Student Skill Exchange & Project Team Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* University & Project Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-indigo-300">
              <GraduationCap className="w-3.5 h-3.5" /> Graphic Era Deemed to be University
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              B.Tech DSCPP-III-2026-T383
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              logoutUser();
              setActiveTab('home');
            }}
            className="text-[11px] font-semibold text-indigo-300 hover:text-white transition-colors"
          >
            ← Exit to Opening Website Page
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    SkillMatch
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    C++ Engine
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Student Skill Exchange & Project Team Matcher
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Home className="w-4 h-4" />
              Opening Page
            </button>

            {role === 'STUDENT' && (
              <button
                type="button"
                onClick={() => setActiveTab('candidate-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'candidate-dashboard'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                My Member Dashboard
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('teams')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'teams'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Explore Teams (100+)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('assessment')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'assessment'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-600" />
              C/C++ Skill Assessment
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">
                Anti-Cheat
              </span>
            </button>

            {role === 'TEAM_LEADER' && (
              <button
                type="button"
                onClick={() => setActiveTab('leader-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'leader-dashboard'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Team Leader Dashboard
                {pendingAppsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {pendingAppsCount}
                  </span>
                )}
              </button>
            )}

            {role === 'ADMIN' && isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Admin Control
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('cpp-visualizer')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'cpp-visualizer'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-violet-600" />
              C++ Engine Code
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {currentUserProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/80"
                title="View My Profile & Documents"
              >
                <UserAvatar
                  name={currentUserProfile.name}
                  avatar={currentUserProfile.avatar}
                  size="sm"
                  isVerified={currentUserProfile.assessmentStatus?.cppVerified}
                  showBadge
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUserProfile.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {role === 'TEAM_LEADER' ? 'Team Leader' : currentUserProfile.studentIdNum}
                  </div>
                </div>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                logoutUser();
                setActiveTab('home');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              Opening Page
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex overflow-x-auto py-2 gap-1 border-t border-slate-100 text-xs scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="px-3 py-1.5 rounded-md shrink-0 font-medium bg-slate-100 text-slate-700"
          >
            Opening Page
          </button>
          {role === 'STUDENT' && (
            <button
              type="button"
              onClick={() => setActiveTab('candidate-dashboard')}
              className={`px-3 py-1.5 rounded-md shrink-0 font-medium ${
                activeTab === 'candidate-dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Member Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1.5 rounded-md shrink-0 font-medium ${
              activeTab === 'teams' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Teams (100+)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assessment')}
            className={`px-3 py-1.5 rounded-md shrink-0 font-medium ${
              activeTab === 'assessment' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            C/C++ Assessment
          </button>
          {role === 'TEAM_LEADER' && (
            <button
              type="button"
              onClick={() => setActiveTab('leader-dashboard')}
              className={`px-3 py-1.5 rounded-md shrink-0 font-medium ${
                activeTab === 'leader-dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Team Leader
            </button>
          )}
          {role === 'ADMIN' && isAdminAuthenticated && (
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-md shrink-0 font-medium ${
                activeTab === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
