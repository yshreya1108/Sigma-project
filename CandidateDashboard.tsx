import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MatchingEngine, defaultSkillGraph } from '../lib/graphEngine';
import {
  matchTeamsBySkillAndInterest,
  getVisibleActivitiesForViewer,
} from '../lib/portalAuthEngine';
import { CandidateLearningPath } from './CandidateLearningPath';
import { CandidateStreakTracker } from './CandidateStreakTracker';
import { UserAvatar, AVATAR_EMOJI_OPTIONS } from './UserAvatar';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Award,
  Send,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Plus,
  Trash2,
  FileCheck,
  Flag,
  Ban,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Activity,
  Search,
  Layers,
} from 'lucide-react';

interface CandidateDashboardProps {
  onOpenChat: (applicationId: string) => void;
  onOpenApplyModal: (teamId: any) => void;
  onNavigateToAssessment: () => void;
  onOpenTeamPage?: (teamOrId: any) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  onOpenChat,
  onOpenApplyModal,
  onNavigateToAssessment,
  onOpenTeamPage,
}) => {
  const {
    currentUserProfile,
    applications,
    teams,
    updateStudentProfile,
    reports,
    escalateReport,
    unblockUser,
    students,
    activityLogs,
    role,
    isAdminAuthenticated,
  } = useApp();

  const [activeDocTab, setActiveDocTab] = useState<'RESUME' | 'COVER' | 'CERTS' | 'MY_REPORTS'>('RESUME');
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');
  const [showAddCert, setShowAddCert] = useState(false);

  // Matched teams filter state
  const [matchSearch, setMatchSearch] = useState('');
  const [showAllMatchedTeams, setShowAllMatchedTeams] = useState(false);

  // Resume upload mock simulation
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  if (!currentUserProfile) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
        <p className="text-slate-600">Please select or register a student profile to view the candidate dashboard.</p>
      </div>
    );
  }

  // Calculate all matched teams based on BOTH skills and interests
  const allSkillAndInterestMatches = matchTeamsBySkillAndInterest(
    currentUserProfile,
    teams,
    true
  );

  const filteredMatches = allSkillAndInterestMatches.filter((m) => {
    if (!matchSearch.trim()) return true;
    const q = matchSearch.toLowerCase();
    return (
      m.team.title.toLowerCase().includes(q) ||
      m.team.department.toLowerCase().includes(q) ||
      m.team.category.toLowerCase().includes(q) ||
      m.team.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
      (m.team.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const displayedMatches = showAllMatchedTeams
    ? filteredMatches
    : filteredMatches.slice(0, 6);

  // Top 3 for quick sidebar widget
  const suggestedTeams = allSkillAndInterestMatches.slice(0, 3).map((m) => ({
    ...m.team,
    matchScore: m.combinedScore,
  }));

  // Private activities visible ONLY to this account owner and Admin
  const myPrivateActivities = getVisibleActivitiesForViewer({
    logs: activityLogs,
    viewerRole: role,
    isAdminAuthenticated,
    viewerUserId: currentUserProfile.id,
    viewerName: currentUserProfile.name,
  });

  // My submitted applications
  const myApplications = applications.filter((a) => a.studentId === currentUserProfile.id);

  // Handle mock PDF file upload
  const handleFileUpload = (type: 'resume' | 'cover') => {
    setIsUploading(true);
    setTimeout(() => {
      if (type === 'resume') {
        updateStudentProfile({
          ...currentUserProfile,
          resumeFileName: `${currentUserProfile.name.replace(/\s+/g, '_')}_Official_Resume.pdf`,
        });
        setUploadNotice('Resume PDF uploaded and verified successfully for recruiter assessment!');
      } else {
        updateStudentProfile({
          ...currentUserProfile,
          coverLetterFileName: `${currentUserProfile.name.replace(/\s+/g, '_')}_Cover_Letter.pdf`,
        });
        setUploadNotice('Cover Letter PDF updated successfully.');
      }
      setIsUploading(false);
      setTimeout(() => setUploadNotice(null), 4000);
    }, 600);
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim()) return;

    const newCert = {
      id: `cert-${Date.now()}`,
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim() || 'Accredited Institution',
      date: newCertDate.trim() || 'October 2026',
      credentialUrl: newCertUrl.trim() || undefined,
    };

    updateStudentProfile({
      ...currentUserProfile,
      certificates: [...(currentUserProfile.certificates || []), newCert],
    });

    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertDate('');
    setNewCertUrl('');
    setShowAddCert(false);
  };

  const handleRemoveCert = (id: string) => {
    updateStudentProfile({
      ...currentUserProfile,
      certificates: (currentUserProfile.certificates || []).filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Candidate Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <UserAvatar
              name={currentUserProfile.name}
              avatar={currentUserProfile.avatar}
              size="xl"
              isVerified={currentUserProfile.assessmentStatus?.cppVerified}
              showBadge
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{currentUserProfile.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ID: {currentUserProfile.studentIdNum}
                </span>
                {currentUserProfile.assessmentStatus?.cppVerified && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified C++ Developer (
                    {currentUserProfile.assessmentStatus.score}%)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {currentUserProfile.department} • {currentUserProfile.year} • {currentUserProfile.availability}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {currentUserProfile.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick External Links */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {currentUserProfile.githubUrl && (
              <a
                href={currentUserProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {currentUserProfile.linkedinUrl && (
              <a
                href={currentUserProfile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Profile Emoji / Avatar Selector */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-slate-800">Profile Emoji / Avatar: </span>
            <span className="text-slate-500">
              Select an emoji avatar for your profile across teams, leader chats, and leaderboards.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {AVATAR_EMOJI_OPTIONS.map((opt) => {
              const isSelected =
                (currentUserProfile.avatar || '👨‍💻') === opt.emoji;
              return (
                <button
                  key={opt.emoji}
                  type="button"
                  onClick={() =>
                    updateStudentProfile({
                      ...currentUserProfile,
                      avatar: opt.emoji,
                    })
                  }
                  title={`${opt.label} (${opt.emoji})`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all border ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 scale-105 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {opt.emoji}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ALL TEAMS MATCHED TO YOUR SKILLS & INTERESTS */}
      <div className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-black text-slate-900">
                Teams Matched to Your Skills & Interests ({filteredMatches.length} Open Teams)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automatically ranked for your skills (
              <span className="font-semibold text-indigo-700">
                {currentUserProfile.skills.join(', ')}
              </span>
              ) and interests (
              <span className="font-semibold text-emerald-700">
                {(currentUserProfile.interests || ['Engineering']).join(', ')}
              </span>
              ).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by skill, interest, or title..."
                value={matchSearch}
                onChange={(e) => setMatchSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAllMatchedTeams(!showAllMatchedTeams)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors"
            >
              {showAllMatchedTeams
                ? 'Show Top 6 Matches'
                : `View All ${filteredMatches.length} Matched Teams`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMatches.map((matchItem) => {
            const { team, combinedScore, exactMatches, matchedInterests } = matchItem;
            const alreadyApplied = myApplications.some((a) => a.teamId === team.id);
            return (
              <div
                key={team.id}
                onClick={() => onOpenTeamPage && onOpenTeamPage(team)}
                className="group p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-indigo-500 transition-all flex flex-col justify-between gap-3 text-xs cursor-pointer shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {team.category}
                      </span>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm leading-snug">
                        {team.title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[11px] shrink-0">
                      {combinedScore}% Match
                    </span>
                  </div>

                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {team.description}
                  </p>

                  <div className="text-[11px] text-slate-500">
                    Lead: <strong className="text-slate-700">{team.leaderName}</strong> •{' '}
                    {team.department} • {team.members.length}/{team.teamSize} Members
                  </div>

                  {/* Required Skills & Matched Indicators */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {team.requiredSkills.map((req) => {
                      const isExact = exactMatches.includes(req);
                      return (
                        <span
                          key={req}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            isExact
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {req}
                        </span>
                      );
                    })}
                    {matchedInterests.map((mi) => (
                      <span
                        key={mi}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        ★ Interest: {mi}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenTeamPage) onOpenTeamPage(team);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Project Page</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={alreadyApplied}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenApplyModal(team);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      alreadyApplied
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                    }`}
                  >
                    {alreadyApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </>
                    ) : (
                      <>
                        <span>Apply to Join</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MY PRIVATE ACCOUNT DATA & ACTIVITY VAULT (VISIBLE ONLY TO CREATOR & ADMIN) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">
                My Stored Account Data & Private Activity History
              </h2>
              <p className="text-[11px] text-slate-500">
                Strictly confidential: This account record and activity trail are visible{' '}
                <strong className="text-slate-800">
                  ONLY to {currentUserProfile.name} (Creator) and the Website Admin (adminsm$4146)
                </strong>
                .
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" /> Owner + Admin Encrypted Visibility
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
          {/* Stored Account Data Summary */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Stored Account Record
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Account Holder</span>
                <span className="font-bold text-slate-900">{currentUserProfile.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email Credential</span>
                <span className="font-mono text-slate-800 break-all">
                  {currentUserProfile.email}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">University ID</span>
                <span className="font-mono text-slate-800">{currentUserProfile.studentIdNum}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Account Option</span>
                <span className="font-bold text-indigo-700">
                  {currentUserProfile.accountType || 'TEAM_MEMBER'}
                </span>
              </div>
            </div>
            <div className="pt-1">
              <span className="text-slate-400 block text-[10px]">Stored Interests</span>
              <span className="text-slate-700 font-medium">
                {(currentUserProfile.interests || ['Systems & C++']).join(', ')}
              </span>
            </div>
          </div>

          {/* Private Activity Log for this User */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                Your Recorded Activities ({myPrivateActivities.length})
              </span>
              <span className="text-[10px] text-slate-500">Hidden from other students</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {myPrivateActivities.length > 0 ? (
                myPrivateActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] shrink-0">
                        {act.type}
                      </span>
                      <span className="text-slate-700 truncate">{act.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 py-3 text-center">
                  Activities you perform on the site will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Progress & Scheduling Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          Real-Time Application Progress & Scheduling Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Milestone 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-bold text-slate-800">Profile & PDF Documents</div>
            <p className="text-[11px] text-slate-500 mt-1">Resume and credentials active</p>
          </div>

          {/* Milestone 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 2</span>
              {currentUserProfile.assessmentStatus?.cppVerified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="text-xs font-bold text-slate-800">Skill Assessment</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {currentUserProfile.assessmentStatus?.cppVerified
                ? `Verified (${currentUserProfile.assessmentStatus.score}%)`
                : 'Pending C/C++ Test'}
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 3</span>
              {myApplications.length > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-slate-300" />
              )}
            </div>
            <div className="text-xs font-bold text-slate-800">Team Applications</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {myApplications.length} Team{myApplications.length === 1 ? '' : 's'} Applied
            </p>
          </div>

          {/* Milestone 4 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 4</span>
              {myApplications.some((a) => a.status === 'APPROVED') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-indigo-500" />
              )}
            </div>
            <div className="text-xs font-bold text-slate-800">Leader Chat & Approval</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {myApplications.some((a) => a.status === 'APPROVED')
                ? 'Approved to Team Room!'
                : 'Under Review / 1-on-1 Chat'}
            </p>
          </div>
        </div>
      </div>

      {/* Daily C/C++ Assessment Practice Streak Tracker */}
      <CandidateStreakTracker onNavigateToAssessment={onNavigateToAssessment} />

      {/* Interactive C/C++ Learning Path & Tutorial Recommendations */}
      <CandidateLearningPath onNavigateToAssessment={onNavigateToAssessment} />

      {/* Main Grid: Application Documents Manager & My Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Documents Manager */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Application Documents & Portfolio</h3>
                <p className="text-xs text-slate-500">
                  Manage PDF resumes, cover letters, and verified certificates.
                </p>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveDocTab('RESUME')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeDocTab === 'RESUME'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Resume PDF
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('COVER')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeDocTab === 'COVER'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Cover Letter
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('CERTS')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeDocTab === 'CERTS'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Certificates ({currentUserProfile.certificates?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('MY_REPORTS')}
                className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1 ${
                  activeDocTab === 'MY_REPORTS'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                My Reports & Safety ({reports.filter((r) => r.reporterId === currentUserProfile.id).length})
              </button>
            </div>

            {uploadNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {uploadNotice}
              </div>
            )}

            {/* Resume Tab Content */}
            {activeDocTab === 'RESUME' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {currentUserProfile.resumeFileName || 'Candidate_Resume.pdf'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        PDF Document • Verified for Recruiter & Leader Review
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active PDF
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFileUpload('resume')}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? 'Uploading PDF...' : 'Upload New Resume PDF'}
                  </button>
                </div>
              </div>
            )}

            {/* Cover Letter Tab */}
            {activeDocTab === 'COVER' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    {currentUserProfile.coverLetterFileName || 'Cover_Letter.pdf'}
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{currentUserProfile.coverLetterText ||
                      'Excited to join an ambitious academic project team. I have strong algorithmic grounding in C/C++ and practical web development skills.'}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileUpload('cover')}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? 'Uploading...' : 'Upload Cover Letter PDF'}
                </button>
              </div>
            )}

            {/* Certificates Tab */}
            {activeDocTab === 'CERTS' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Showcase your verified credentials</span>
                  <button
                    type="button"
                    onClick={() => setShowAddCert(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Certificate
                  </button>
                </div>

                {showAddCert && (
                  <form
                    onSubmit={handleAddCertificate}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Certificate Title (e.g. C++ Advanced Specialization)"
                      value={newCertTitle}
                      onChange={(e) => setNewCertTitle(e.target.value)}
                      required
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Issuer (e.g. Graphic Era University)"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Date (e.g. Oct 2026)"
                        value={newCertDate}
                        onChange={(e) => setNewCertDate(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Verification URL (optional)"
                      value={newCertUrl}
                      onChange={(e) => setNewCertUrl(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddCert(false)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-indigo-600 text-white rounded font-semibold"
                      >
                        Save Certificate
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {currentUserProfile.certificates && currentUserProfile.certificates.length > 0 ? (
                    currentUserProfile.certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-slate-900">{cert.title}</div>
                            <div className="text-[11px] text-slate-500">
                              {cert.issuer} • {cert.date}
                            </div>
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 font-semibold flex items-center gap-1 mt-0.5 hover:underline"
                              >
                                View Credential <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCert(cert.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 text-center py-4">
                      No certificates uploaded yet. Click "+ Add Certificate" to attach your credentials.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Reports & Safety Tab */}
            {activeDocTab === 'MY_REPORTS' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold">Strict Confidentiality Notice:</span> Reports you file are
                  strictly private and visible only to you and the university administration. Other users
                  cannot see your complaints.
                </div>

                {/* List of reports filed by me */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs">Reports Filed by You:</h4>
                  {reports.filter((r) => r.reporterId === currentUserProfile.id).length > 0 ? (
                    reports
                      .filter((r) => r.reporterId === currentUserProfile.id)
                      .map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              Target: <span className="text-rose-600">{rep.reportedUserName}</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  rep.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-800'
                                    : rep.status === 'RESOLVED_BANNED'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {rep.status === 'PENDING' ? 'Under Review' : rep.status}
                              </span>
                              {rep.isEscalated && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
                                  Escalated
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-slate-600">
                            <span className="font-semibold text-slate-700">Reason:</span> {rep.reason}
                          </div>
                          {rep.details && (
                            <div className="text-slate-500 text-[11px]">Details: {rep.details}</div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                            <span className="text-[10px] text-slate-400">Filed on: {rep.createdAt}</span>

                            {rep.status === 'PENDING' && !rep.isEscalated && (
                              <button
                                type="button"
                                onClick={() => escalateReport(rep.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md border border-purple-200 transition-colors"
                              >
                                <AlertTriangle className="w-3 h-3 text-purple-600" />
                                Escalate to Dean
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-xs text-slate-400 p-4 text-center bg-slate-50 rounded-lg">
                      You haven't filed any reports yet. If you encounter fake or fraudulent profiles,
                      you can report them directly from their profile view.
                    </div>
                  )}
                </div>

                {/* Blocked Users Section */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">Blocked Users ({currentUserProfile.blockedUsers?.length || 0}):</h4>
                  {currentUserProfile.blockedUsers && currentUserProfile.blockedUsers.length > 0 ? (
                    <div className="space-y-1.5">
                      {currentUserProfile.blockedUsers.map((blockedId) => {
                        const targetUser = students.find((s) => s.id === blockedId);
                        return (
                          <div
                            key={blockedId}
                            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-slate-700">
                              {targetUser ? targetUser.name : blockedId}
                            </span>
                            <button
                              type="button"
                              onClick={() => unblockUser(blockedId)}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                            >
                              Unblock User
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">You haven't blocked any users.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Assessment Card Callout */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-xl border border-emerald-800 shadow-xs flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold">C & C++ Skill Verification</h4>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Take our anti-cheat verified C/C++ assessment to boost your match scores and prove
                eligibility to team leaders.
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToAssessment}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shrink-0"
            >
              {currentUserProfile.assessmentStatus?.cppVerified ? 'Retake Test' : 'Take Test'}
            </button>
          </div>
        </div>

        {/* Right Column: Active Applications & Live 1-on-1 Chat Access */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Team Applications</h3>
                <p className="text-xs text-slate-500">
                  Track live status and chat directly with team leaders.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {myApplications.length} Active
              </span>
            </div>

            {myApplications.length > 0 ? (
              <div className="space-y-3">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onOpenTeamPage && onOpenTeamPage(app.teamId)}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-400 transition-all flex flex-col justify-between gap-3 text-xs cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 hover:text-indigo-600 text-sm">
                          {app.teamTitle}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status === 'APPROVED'
                            ? 'APPROVED & JOINED'
                            : app.status === 'REJECTED'
                            ? 'DECLINED'
                            : 'UNDER REVIEW'}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 italic">"{app.message}"</p>
                      <div className="text-[11px] text-slate-400 mt-2">
                        Applied on: {app.appliedAt} • Match Score: {app.matchScore}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {app.status === 'APPROVED'
                          ? 'Joined Team Group Room'
                          : '1-on-1 Interview Chat Active'}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenChat(app.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        {app.status === 'APPROVED' ? 'Open Team Chat' : 'Open Leader Chat'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                You haven't submitted any team applications yet. Browse the 100+ teams catalog below
                and apply to your top matches!
              </div>
            )}
          </div>

          {/* Suggested Best Matches for this Candidate */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Algorithm Suggested Matches for You
              </h3>
              <span className="text-[11px] text-slate-500">Based on C++ Graph Engine</span>
            </div>

            <div className="space-y-2">
              {suggestedTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => onOpenTeamPage && onOpenTeamPage(team)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-400 transition-colors flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-2">
                      <span>{team.title}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        {team.matchScore}% Match
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {team.department} • Lead: {team.leaderName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenApplyModal(team);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
                  >
                    Apply <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
