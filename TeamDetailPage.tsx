import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Team, StudentProfile } from '../lib/types';
import { MatchingEngine, defaultSkillGraph } from '../lib/graphEngine';
import { getTeamDeepProjectDetails, getTeamFullIntelligence } from '../lib/portalAuthEngine';
import { UserAvatar } from './UserAvatar';
import {
  ArrowLeft,
  ArrowRight,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  FolderGit2,
  Cpu,
  Layers,
  Target,
  Milestone,
  BookOpen,
  ExternalLink,
  Mail,
  Code2,
  Award,
  Unlock,
  Lock,
  MessageSquare,
  Check,
  Terminal,
  FileCode2,
  Compass,
} from 'lucide-react';

interface TeamDetailPageProps {
  teamId: string;
  onBack: () => void;
  onSelectTeam: (teamId: string) => void;
  onOpenApplyModal: (team: Team) => void;
  onOpenChatModal: (applicationId: string) => void;
  onInspectProfile?: (profile: StudentProfile) => void;
}

export const TeamDetailPage: React.FC<TeamDetailPageProps> = ({
  teamId,
  onBack,
  onSelectTeam,
  onOpenApplyModal,
  onOpenChatModal,
  onInspectProfile,
}) => {
  const {
    teams,
    students,
    applications,
    currentUserProfile,
    role,
    isAdminAuthenticated,
    toggleTeamVacancy,
    teamChatThreads,
    sendTeamChatMessage,
  } = useApp();

  const [chatInput, setChatInput] = useState('');
  const [activeSectionTab, setActiveSectionTab] = useState<
    'OVERVIEW' | 'ARCHITECTURE' | 'ROSTER' | 'ROADMAP'
  >('OVERVIEW');

  const currentTeamIndex = useMemo(() => {
    const idx = teams.findIndex((t) => t.id === teamId);
    return idx >= 0 ? idx : 0;
  }, [teams, teamId]);

  const team = teams[currentTeamIndex] || teams[0];

  const prevTeam = currentTeamIndex > 0 ? teams[currentTeamIndex - 1] : null;
  const nextTeam = currentTeamIndex < teams.length - 1 ? teams[currentTeamIndex + 1] : null;

  const deepDetails = useMemo(() => {
    if (!team) return null;
    return getTeamDeepProjectDetails(team);
  }, [team]);

  const teamIntel = useMemo(() => {
    if (!team) return null;
    return getTeamFullIntelligence(team, students, applications);
  }, [team, students, applications]);

  const matchInfo = useMemo(() => {
    if (!team) return { score: 0, breakdown: [] };
    const skills = currentUserProfile ? currentUserProfile.skills : ['C++', 'Algorithms'];
    return MatchingEngine.calculateDetailedScore(skills, team.requiredSkills, defaultSkillGraph);
  }, [team, currentUserProfile]);

  const existingApp = useMemo(() => {
    if (!currentUserProfile || !team) return null;
    return (
      applications.find(
        (a) => a.teamId === team.id && a.studentId === currentUserProfile.id
      ) || null
    );
  }, [applications, currentUserProfile, team]);

  if (!team || !deepDetails || !teamIntel) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
        <p className="text-slate-600 text-sm">Project team not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Teams
        </button>
      </div>
    );
  }

  const spotsLeft = Math.max(0, team.teamSize - team.members.length);
  const isFullOrClosed = !team.vacancyOpen || spotsLeft === 0;
  const isCurrentUserMember = currentUserProfile
    ? team.members.some((m) => m.id === currentUserProfile.id)
    : false;
  const isCurrentUserLeader =
    (currentUserProfile && team.leaderId === currentUserProfile.id) ||
    (role === 'ADMIN' && isAdminAuthenticated);

  const canAccessTeamRoom =
    isCurrentUserMember || isCurrentUserLeader || (role === 'ADMIN' && isAdminAuthenticated);
  const teamMessages = teamChatThreads[team.id] || [];

  const handleSendRoomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendTeamChatMessage(team.id, chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Team Switcher Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:px-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Previous Page</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
            <span>All Teams Directory</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{team.department}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-indigo-600 truncate max-w-[240px]">{team.title}</span>
          </div>
        </div>

        {/* Prev / Jump / Next Team Controls so user can inspect every single team seamlessly */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!prevTeam}
            onClick={() => prevTeam && onSelectTeam(prevTeam.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
              prevTeam
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 cursor-pointer'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
            title={prevTeam ? `Previous: ${prevTeam.title}` : 'First Team'}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev Team</span>
          </button>

          <select
            value={team.id}
            onChange={(e) => onSelectTeam(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 max-w-[210px] sm:max-w-[260px] focus:outline-none focus:border-indigo-500"
          >
            {teams.map((t, idx) => (
              <option key={t.id} value={t.id}>
                {idx + 1}. {t.title} ({t.leaderName.replace(' (Team Lead)', '')})
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!nextTeam}
            onClick={() => nextTeam && onSelectTeam(nextTeam.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
              nextTeam
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 cursor-pointer'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
            title={nextTeam ? `Next: ${nextTeam.title}` : 'Last Team'}
          >
            <span className="hidden sm:inline">Next Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Project Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800">
        <div
          className={`h-3 w-full bg-gradient-to-r ${
            team.bannerGradient || 'from-indigo-600 via-violet-600 to-purple-700'
          }`}
        />
        <div className="p-6 sm:p-8 lg:p-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 max-w-4xl">
              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                  {deepDetails.academicCourseCode}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 font-semibold">
                  {team.department}
                </span>
                <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 font-semibold">
                  {team.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                  ID: {team.id}
                </span>
                {isFullOrClosed ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 font-bold">
                    <XCircle className="w-3.5 h-3.5" /> Vacancy Closed ({team.members.length}/{team.teamSize} Filled)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {spotsLeft} Open Vacancy Spot{spotsLeft > 1 ? 's' : ''} ({team.members.length}/{team.teamSize} Members)
                  </span>
                )}
              </div>

              {/* Project Title & Executive Tagline */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  {team.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mt-2.5 leading-relaxed">
                  {team.description}
                </p>
              </div>

              {/* Key Project Facts Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">Team Leader</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                    {team.leaderName.replace(' (Team Lead)', '')}
                  </div>
                  <div className="text-[10px] text-indigo-300 font-mono truncate">
                    {team.leaderEmail}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">Team Roster Capacity</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5">
                    {team.members.length} / {team.teamSize} Active Members
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {spotsLeft > 0 ? `${spotsLeft} slot(s) available` : 'All slots filled'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">Application Deadline</div>
                  <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">
                    {team.deadline}
                  </div>
                  <div className="text-[10px] text-slate-400">Created: {team.createdAt}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">Skill Match Score</div>
                  <div className="text-xs sm:text-sm font-black text-indigo-300 mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    {matchInfo.score}% Compatibility
                  </div>
                  <div className="text-[10px] text-slate-400">C++ Graph Engine Ranked</div>
                </div>
              </div>
            </div>

            {/* Action Box on Right of Hero */}
            <div className="lg:w-72 shrink-0 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3.5">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
                <span>Project Action Center</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200">
                  Live Status
                </span>
              </div>

              {isCurrentUserMember ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>You are an Active Member of this Project Team</span>
                </div>
              ) : existingApp ? (
                <button
                  type="button"
                  onClick={() => onOpenChatModal(existingApp.id)}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {existingApp.status === 'APPROVED'
                      ? 'Open Team Collaboration Chat'
                      : 'Open 1-on-1 Leader Interview Chat'}
                  </span>
                </button>
              ) : isFullOrClosed ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-slate-700 text-slate-400 font-bold text-xs cursor-not-allowed"
                >
                  Vacancy Currently Closed
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenApplyModal(team)}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Apply to Join {team.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {isCurrentUserLeader && (
                <button
                  type="button"
                  onClick={() => toggleTeamVacancy(team.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                    team.vacancyOpen
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                  }`}
                >
                  {team.vacancyOpen ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" /> Vacancy Open (Click to Lock)
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Vacancy Closed (Click to Reopen)
                    </>
                  )}
                </button>
              )}

              {/* External Repository & Spec Links */}
              <div className="pt-2 border-t border-slate-700 space-y-2 text-xs">
                <a
                  href={deepDetails.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-950 text-slate-200 border border-slate-700 font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                    Project Git Repository
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href={deepDetails.documentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-950 text-slate-200 border border-slate-700 font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    Technical Specification
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation Bar (All Sections Visible or Jumpable) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveSectionTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeSectionTab === 'OVERVIEW'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          1. Complete Deep Description & Overview (All Sections)
        </button>
        <button
          type="button"
          onClick={() => setActiveSectionTab('ARCHITECTURE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeSectionTab === 'ARCHITECTURE'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          2. System Architecture & Tech Stack ({deepDetails.architectureModules.length} Modules)
        </button>
        <button
          type="button"
          onClick={() => setActiveSectionTab('ROSTER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeSectionTab === 'ROSTER'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          3. Team Leader, Roster & Role Allocation ({team.members.length}/{team.teamSize})
        </button>
        <button
          type="button"
          onClick={() => setActiveSectionTab('ROADMAP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeSectionTab === 'ROADMAP'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Milestone className="w-3.5 h-3.5" />
          4. Milestones, Deliverables & Workspace
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Deep Project Description, Architecture, Modules, Roadmap, and Role Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION A: DEEP PROJECT DESCRIPTION & PROBLEM STATEMENT */}
          {(activeSectionTab === 'OVERVIEW' || activeSectionTab === 'ARCHITECTURE') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    In-Depth Technical Documentation
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    Deep Project Description & Engineering Scope
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                  {team.category}
                </span>
              </div>

              {/* Multi-paragraph Deep Description */}
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {deepDetails.deepDescription.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Problem Statement Callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-violet-50/80 border border-indigo-200/80 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  Problem Statement & Research Motivation
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {deepDetails.problemStatement}
                </p>
              </div>

              {/* Core Technical Objectives & Expected Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    Core Engineering Objectives
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {deepDetails.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Expected Outcomes & Deliverables
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {deepDetails.expectedOutcomes.map((out, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: SYSTEM ARCHITECTURE & SUBSYSTEM MODULES */}
          {(activeSectionTab === 'OVERVIEW' || activeSectionTab === 'ARCHITECTURE') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                    Modular System Design
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-violet-600" />
                    Technical Architecture & Subsystem Modules
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  {deepDetails.architectureModules.length} Core Subsystems
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deepDetails.architectureModules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Subsystem #{idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600 truncate">
                          {mod.role}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{mod.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{mod.description}</p>
                    </div>
                    <div className="pt-2.5 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-mono text-indigo-700">
                      <Code2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{mod.tech}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete Tech Stack Categorization */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  Complete Project Tech Stack & Environment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {deepDetails.techStackBreakdown.map((group, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="text-[11px] font-bold text-slate-700">{group.category}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-800"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION C: ROLE ALLOCATION & OPEN VACANCY RESPONSIBILITIES */}
          {(activeSectionTab === 'OVERVIEW' || activeSectionTab === 'ROSTER') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                    Team Structure & Task Division
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    Member Role Allocation & Open Vacancy Responsibilities
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {team.members.length} Filled • {spotsLeft} Open Slot{spotsLeft === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-3">
                {deepDetails.roleResponsibilities.map((slot, idx) => {
                  const isFilled = slot.status === 'FILLED';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isFilled
                          ? 'bg-slate-50/80 border-slate-200'
                          : 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isFilled
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {isFilled ? `Filled Role #${idx + 1}` : 'Open Vacancy Slot'}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">{slot.roleTitle}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isFilled ? 'text-slate-700' : 'text-emerald-700'
                            }`}
                          >
                            {isFilled ? `Assigned: ${slot.assignedTo}` : slot.assignedTo}
                          </span>
                          {!isFilled && !isCurrentUserMember && !existingApp && team.vacancyOpen && (
                            <button
                              type="button"
                              onClick={() => onOpenApplyModal(team)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Apply for Slot
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                        {slot.responsibilities}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Role Skills:
                        </span>
                        {slot.skills.map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION D: PROJECT ROADMAP & ACADEMIC MILESTONES */}
          {(activeSectionTab === 'OVERVIEW' || activeSectionTab === 'ROADMAP') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                    Execution Schedule & Deliverables
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
                    <Milestone className="w-5 h-5 text-amber-600" />
                    Project Roadmap & Phase Milestones
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Final Deadline: {team.deadline}
                </span>
              </div>

              <div className="space-y-3">
                {deepDetails.milestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-bold">
                          {ms.phase}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{ms.title}</h3>
                        <span className="text-xs text-slate-500 font-medium">({ms.timeline})</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-700">Deliverable:</strong> {ms.deliverable}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        ms.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : ms.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {ms.status === 'COMPLETED'
                        ? '✓ Completed'
                        : ms.status === 'IN_PROGRESS'
                        ? '● In Progress'
                        : 'Upcoming'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION E: TEAM GROUP COLLABORATION WORKSPACE (FOR MEMBERS / LEADER / ADMIN) */}
          {canAccessTeamRoom && (
            <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Team Project Collaboration Workspace
                    </h3>
                    <p className="text-xs text-slate-500">
                      Live team discussion channel for {team.title}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  Member Access Active
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
                {teamMessages.length > 0 ? (
                  teamMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs ${
                        msg.isSystemNotice
                          ? 'bg-amber-50 border border-amber-200 text-amber-900 font-semibold'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-bold text-slate-900">
                          {msg.senderName} ({msg.senderRole})
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No messages yet in this project room. Start the technical discussion below!
                  </p>
                )}
              </div>

              <form onSubmit={handleSendRoomMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Post an update or technical note to ${team.title}...`}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Skill Compatibility Breakdown + Full Team Leader & Members Roster */}
        <div className="lg:col-span-4 space-y-6">
          {/* Skill Requirements & Compatibility Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Required Skills & Match Analysis
                </h3>
                <p className="text-[11px] text-slate-500">
                  Evaluated via C++ Adjacency-List Skill Graph
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-200">
                {matchInfo.score}%
              </span>
            </div>

            <div className="space-y-2">
              {team.requiredSkills.map((req, idx) => {
                const b = matchInfo.breakdown.find((item) => item.required === req);
                const isExact = b?.matchType === 'exact';
                const isRelated = b?.matchType === 'related';

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                      isExact
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : isRelated
                        ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{req.replace('|', ' OR ')}</div>
                      <div className="text-[11px] opacity-80">
                        {isExact
                          ? 'Exact Skill Match (100% Credit)'
                          : isRelated
                          ? `Related Graph Match (75% via ${b?.matchedSkill})`
                          : 'Required Team Skill'}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isExact
                          ? 'bg-emerald-600 text-white'
                          : isRelated
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isExact ? '100%' : isRelated ? '75%' : 'Required'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Project Tags */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Project Domain Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {team.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Complete Team Roster Card (Leader + Members) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Complete Team Roster ({team.members.length}/{team.teamSize})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Team Leader and active project members
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {teamIntel.memberRecords.map((rec) => {
                const { member, profile, isLeader } = rec;
                return (
                  <div
                    key={member.id}
                    onClick={() => onInspectProfile && onInspectProfile(profile)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      onInspectProfile ? 'cursor-pointer hover:border-indigo-400' : ''
                    } ${
                      isLeader
                        ? 'bg-indigo-50/50 border-indigo-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        name={member.name}
                        avatar={profile.avatar || member.avatar}
                        size="md"
                        isVerified={profile.assessmentStatus?.cppVerified}
                        showBadge
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {member.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                              isLeader
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isLeader ? 'Team Leader' : 'Member'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 mt-1">
                          {profile.department} • {profile.year}
                        </div>

                        {profile.assessmentStatus?.cppVerified && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-1.5">
                            <ShieldCheck className="w-3 h-3" /> Verified C++ ({profile.assessmentStatus.score}%)
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mt-2">
                          {(member.skills || []).map((sk, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-700"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Open Vacancy Cards in Roster */}
              {spotsLeft > 0 &&
                Array.from({ length: spotsLeft }).map((_, idx) => (
                  <div
                    key={`open-slot-${idx}`}
                    className="p-3.5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-emerald-900">
                        Open Team Member Slot #{team.members.length + idx + 1}
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Seeking: {team.requiredSkills.join(', ')}
                      </div>
                    </div>
                    {!isCurrentUserMember && !existingApp && (
                      <button
                        type="button"
                        onClick={() => onOpenApplyModal(team)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
