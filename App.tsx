import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { TeamExplorer } from './components/TeamExplorer';
import { SkillAssessment } from './components/SkillAssessment';
import { CandidateDashboard } from './components/CandidateDashboard';
import { TeamLeaderDashboard } from './components/TeamLeaderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CppVisualizer } from './components/CppVisualizer';
import { TeamDetailPage } from './components/TeamDetailPage';
import { ApplicantChatModal } from './components/ApplicantChatModal';
import { ApplyTeamModal } from './components/ApplyTeamModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { LeaderInvitationPopup } from './components/LeaderInvitationPopup';
import { SourceCodeViewerModal } from './components/SourceCodeViewerModal';
import { Team, StudentProfile } from './lib/types';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Heart,
  Github,
  BookOpen,
  Feather,
  Download,
  Code2,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role, currentUserProfile, siteSettings } = useApp();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [previousTab, setPreviousTab] = useState<string>('teams');
  const [selectedTeamIdForPage, setSelectedTeamIdForPage] = useState<string>('team-sigma');

  // Modals state
  const [activeChatAppId, setActiveChatAppId] = useState<string | null>(null);
  const [activeApplyTeam, setActiveApplyTeam] = useState<Team | null>(null);
  const [viewingProfile, setViewingProfile] = useState<StudentProfile | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showSourceCodeModal, setShowSourceCodeModal] = useState<boolean>(false);

  const handleOpenTeamPage = (teamOrId: Team | string) => {
    const id = typeof teamOrId === 'string' ? teamOrId : teamOrId.id;
    setSelectedTeamIdForPage(id);
    if (activeTab !== 'team-detail') {
      setPreviousTab(activeTab);
    }
    setActiveTab('team-detail');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={() => setShowRegisterModal(true)}
        onOpenProfile={() => {
          if (currentUserProfile) setViewingProfile(currentUserProfile);
        }}
      />

      {/* Site-Wide Maintenance Banner */}
      {siteSettings.maintenanceMode && (
        <div className="bg-rose-600 text-white text-xs font-bold py-2 px-4 text-center">
          ⚠️ System Maintenance Mode Active: Application submissions are currently locked by the university administrator.
        </div>
      )}

      {/* Official Announcement Strip (shown only inside dashboards) */}
      {activeTab !== 'home' && siteSettings.announcementBanner && !siteSettings.maintenanceMode && (
        <div className="bg-indigo-50 border-b border-indigo-100 text-indigo-900 text-xs py-1.5 px-4 text-center font-medium">
          📢 {siteSettings.announcementBanner}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenRegister={() => setShowRegisterModal(true)}
            onOpenApplyModal={(team) => setActiveApplyTeam(team)}
            onOpenTeamPage={handleOpenTeamPage}
          />
        )}

        {activeTab === 'teams' && (
          <TeamExplorer
            onOpenApplyModal={(team) => setActiveApplyTeam(team)}
            onOpenChatModal={(appId) => setActiveChatAppId(appId)}
            onOpenTeamPage={handleOpenTeamPage}
          />
        )}

        {activeTab === 'team-detail' && (
          <TeamDetailPage
            teamId={selectedTeamIdForPage}
            onBack={() => setActiveTab(previousTab || 'teams')}
            onSelectTeam={(id) => {
              setSelectedTeamIdForPage(id);
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onOpenApplyModal={(team) => setActiveApplyTeam(team)}
            onOpenChatModal={(appId) => setActiveChatAppId(appId)}
            onInspectProfile={(profile) => setViewingProfile(profile)}
          />
        )}

        {activeTab === 'assessment' && <SkillAssessment />}

        {activeTab === 'candidate-dashboard' && (
          <CandidateDashboard
            onOpenChat={(appId) => setActiveChatAppId(appId)}
            onOpenApplyModal={(team) => setActiveApplyTeam(team)}
            onNavigateToAssessment={() => setActiveTab('assessment')}
            onOpenTeamPage={handleOpenTeamPage}
          />
        )}

        {activeTab === 'leader-dashboard' && (
          <TeamLeaderDashboard
            onOpenChat={(appId) => setActiveChatAppId(appId)}
            onOpenTeamPage={handleOpenTeamPage}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onOpenTeamPage={handleOpenTeamPage} />
        )}

        {activeTab === 'cpp-visualizer' && <CppVisualizer />}
      </main>

      {/* Persistent Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                SM
              </div>
              <div>
                <div className="font-bold text-slate-800">
                  SkillMatch: Student Skill Exchange & Project Team Platform
                </div>
                <div className="text-slate-500 text-[11px]">
                  Graphic Era Deemed to be University • Course B.Tech DSCPP-III-2026-T383
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSourceCodeModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>View & Copy All Modules Code</span>
              </button>
              <a
                href="/SkillMatch-Full-Source-Code.zip"
                download="SkillMatch-Full-Source-Code.zip"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white font-semibold text-[11px] border border-slate-200 hover:border-indigo-600 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full Website Code (.zip)</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right">
            <div className="text-[11px] text-slate-500">
              Private Account & Activity Storage • Visible Only to Account Creator & Admin
            </div>
            <div
              data-testid="creator-signature"
              className="inline-flex flex-col items-center md:items-end group select-none"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-50/90 via-violet-50/90 to-amber-50/80 border border-indigo-200/70 shadow-2xs">
                <Feather className="w-3.5 h-3.5 text-indigo-600 -rotate-12 shrink-0" />
                <span className="font-signature text-lg sm:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-violet-700 to-indigo-950 -rotate-1">
                  website created by ShishirTB4146
                </span>
              </div>
              <svg
                viewBox="0 0 220 10"
                className="w-44 h-2 text-indigo-500/70 -mt-0.5"
                fill="none"
                 aria-hidden="true"
              >
                <path
                  d="M4 7C58 2 142 1.5 216 6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M35 8.5C95 5 160 5 198 8"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeOpacity="0.65"
                />
              </svg>
            </div>
          </div>
        </div>
      </footer>

      {/* Complete All-Modules Source Code Explorer Modal */}
      {showSourceCodeModal && (
        <SourceCodeViewerModal onClose={() => setShowSourceCodeModal(false)} />
      )}

      {/* Live 1-on-1 Applicant Chat Modal */}
      {activeChatAppId && (
        <ApplicantChatModal
          applicationId={activeChatAppId}
          onClose={() => setActiveChatAppId(null)}
        />
      )}

      {/* Team Invitation Application Modal */}
      {activeApplyTeam && (
        <ApplyTeamModal
          team={activeApplyTeam}
          onClose={() => setActiveApplyTeam(null)}
          onSuccess={() => {
            setActiveApplyTeam(null);
            setActiveTab('candidate-dashboard');
          }}
        />
      )}

      {/* Student Profile & Reporting Modal */}
      {viewingProfile && (
        <StudentProfileModal
          profile={viewingProfile}
          onClose={() => setViewingProfile(null)}
        />
      )}

      {/* Student Registration Modal */}
      {showRegisterModal && (
        <StudentRegistrationModal
          onClose={() => setShowRegisterModal(false)}
          onRegisteredSuccess={() => {
            setShowRegisterModal(false);
            setActiveTab('candidate-dashboard');
          }}
        />
      )}

      {/* Team Leader Real-time Application Popup */}
      <LeaderInvitationPopup onOpenChat={(appId) => setActiveChatAppId(appId)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
