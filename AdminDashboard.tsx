import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Activity,
  Users,
  Layers,
  Trash2,
  CheckCircle2,
  Lock,
  Unlock,
  Search,
  Eye,
  EyeOff,
  ShieldCheck,
  Ban,
  Settings,
  Sliders,
  Download,
  KeyRound,
  LogOut,
  Edit3,
  UserPlus,
  Crown,
  MessageSquare,
  Send,
  Copy,
  Check,
  FolderKanban,
  Sparkles,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { getTeamFullIntelligence, getUserTeamsMap } from '../lib/portalAuthEngine';

interface AdminDashboardProps {
  onOpenTeamPage?: (teamOrId: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenTeamPage }) => {
  const {
    students,
    teams,
    applications,
    teamChatThreads,
    reports,
    activityLogs,
    assessmentSubmissions,
    adminDeleteUser,
    adminResolveReport,
    adminUpdateTeam,
    adminDeleteTeam,
    adminAddMemberToTeam,
    adminPromoteTeamLeader,
    adminUpdateStudent,
    adminSendTeamDirective,
    adminDeleteTeamChatMessage,
    removeMemberFromTeam,
    approveApplication,
    rejectApplication,
    toggleTeamVacancy,
    siteSettings,
    updateSiteSettings,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
  } = useApp();

  // Default to TEAMS first when Admin logs in, as requested
  const [activeTab, setActiveTab] = useState<
    | 'TEAMS'
    | 'PRIVATE_VAULTS'
    | 'STUDENTS'
    | 'REPORTS'
    | 'ACTIVITIES'
    | 'ASSESSMENTS'
    | 'SITE_CONTROLS'
  >('TEAMS');

  const [studentSearch, setStudentSearch] = useState('');
  const [personRoleFilter, setPersonRoleFilter] = useState<
    'ALL' | 'TEAM_LEADER' | 'TEAM_MEMBER' | 'VERIFIED' | 'BANNED'
  >('ALL');
  const [showAllPasswords, setShowAllPasswords] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string>('');

  const [teamSearch, setTeamSearch] = useState('');
  const [teamStatusFilter, setTeamStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'team-sigma');

  // Inline Team Editor State
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamTitle, setEditTeamTitle] = useState('');
  const [editTeamDept, setEditTeamDept] = useState('');
  const [editTeamCategory, setEditTeamCategory] = useState('');
  const [editTeamDesc, setEditTeamDesc] = useState('');
  const [editTeamSkills, setEditTeamSkills] = useState('');
  const [editTeamTags, setEditTeamTags] = useState('');
  const [editTeamSize, setEditTeamSize] = useState(4);
  const [editTeamDeadline, setEditTeamDeadline] = useState('');

  // Add Member to Selected Team State
  const [candidateToAddId, setCandidateToAddId] = useState<string>('');
  const [candidateToAddRole, setCandidateToAddRole] = useState<'Member' | 'Leader'>('Member');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Admin Directive Chat Input
  const [directiveText, setDirectiveText] = useState('');
  const [confirmDeleteTeamId, setConfirmDeleteTeamId] = useState<string | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);

  // Selected Person in Private Vault
  const [selectedVaultUserId, setSelectedVaultUserId] = useState<string>(
    students[0]?.id || ''
  );
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserStudentId, setEditUserStudentId] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserRole, setEditUserRole] = useState<'TEAM_MEMBER' | 'TEAM_LEADER'>('TEAM_MEMBER');
  const [editUserDept, setEditUserDept] = useState('');
  const [editUserYear, setEditUserYear] = useState('');
  const [editUserSkills, setEditUserSkills] = useState('');
  const [editUserInterests, setEditUserInterests] = useState('');

  // Admin Login Gate state if not authenticated
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');

  const userTeamsMap = useMemo(() => getUserTeamsMap(teams), [teams]);

  if (!isAdminAuthenticated) {
    const handleAdminAuth = (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      const ok = loginAdmin(adminUser, adminPass);
      if (ok) {
        setActiveTab('TEAMS');
        if (teams[0]) {
          setSelectedTeamId(teams[0].id);
        }
      } else {
        setAuthError('Access Denied: Invalid Admin username or password.');
      }
    };

    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-lg font-black">Supreme Admin Security Gate</h1>
              <p className="text-xs text-amber-200">
                Authenticate to control all teams, user login credentials & website policies
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAdminAuth} className="p-6 space-y-4 text-xs">
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              {authError}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Admin Username *</label>
            <input
              type="text"
              required
              placeholder="Enter Admin Username"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Admin Password *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Enter Admin Password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Supreme Admin Control</span>
          </button>
        </form>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === 'PENDING');
  const openTeamsCount = teams.filter((t) => t.vacancyOpen && t.members.length < t.teamSize).length;
  const verifiedStudentsCount = students.filter((s) => s.assessmentStatus?.cppVerified).length;
  const teamLeadersCount = students.filter(
    (s) => s.accountType === 'TEAM_LEADER' || (userTeamsMap[s.id]?.ledTeams.length || 0) > 0
  ).length;

  const filteredStudents = students.filter((s) => {
    const q = studentSearch.trim().toLowerCase();
    const userTeams = userTeamsMap[s.id];
    const teamNames = [
      ...(userTeams?.ledTeams.map((t) => t.title) || []),
      ...(userTeams?.memberTeams.map((t) => t.title) || []),
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.studentIdNum.toLowerCase().includes(q) ||
      (s.password || '').toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.skills.some((sk) => sk.toLowerCase().includes(q)) ||
      teamNames.includes(q);

    if (!matchesSearch) return false;
    if (personRoleFilter === 'TEAM_LEADER') {
      return s.accountType === 'TEAM_LEADER' || (userTeams?.ledTeams.length || 0) > 0;
    }
    if (personRoleFilter === 'TEAM_MEMBER') {
      return s.accountType !== 'TEAM_LEADER' && (userTeams?.ledTeams.length || 0) === 0;
    }
    if (personRoleFilter === 'VERIFIED') {
      return Boolean(s.assessmentStatus?.cppVerified);
    }
    if (personRoleFilter === 'BANNED') {
      return Boolean(s.isBanned);
    }
    return true;
  });

  const filteredTeams = teams.filter((t) => {
    const q = teamSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.leaderName.toLowerCase().includes(q) ||
      t.leaderEmail.toLowerCase().includes(q) ||
      t.requiredSkills.some((sk) => sk.toLowerCase().includes(q)) ||
      t.members.some((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    const isOpen = t.vacancyOpen && t.members.length < t.teamSize;
    if (teamStatusFilter === 'OPEN') return isOpen;
    if (teamStatusFilter === 'CLOSED') return !isOpen;
    return true;
  });

  const selectedTeam =
    teams.find((t) => t.id === selectedTeamId) || filteredTeams[0] || teams[0] || null;

  const selectedTeamIntel = selectedTeam
    ? getTeamFullIntelligence(selectedTeam, students, applications)
    : null;

  const selectedVaultStudent =
    students.find((s) => s.id === selectedVaultUserId) ||
    filteredStudents[0] ||
    students[0] ||
    null;

  const selectedUserActivities = selectedVaultStudent
    ? activityLogs.filter(
        (l) =>
          l.actorId === selectedVaultStudent.id ||
          l.actor.toLowerCase() === selectedVaultStudent.name.toLowerCase() ||
          l.description.toLowerCase().includes(selectedVaultStudent.name.toLowerCase())
      )
    : [];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(''), 1800);
  };

  const startEditingTeam = (team: typeof selectedTeam) => {
    if (!team) return;
    setEditTeamTitle(team.title);
    setEditTeamDept(team.department);
    setEditTeamCategory(team.category);
    setEditTeamDesc(team.description);
    setEditTeamSkills(team.requiredSkills.join(', '));
    setEditTeamTags(team.tags.join(', '));
    setEditTeamSize(team.teamSize);
    setEditTeamDeadline(team.deadline);
    setIsEditingTeam(true);
  };

  const saveTeamEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    adminUpdateTeam(selectedTeam.id, {
      title: editTeamTitle.trim() || selectedTeam.title,
      department: editTeamDept.trim() || selectedTeam.department,
      category: editTeamCategory.trim() || selectedTeam.category,
      description: editTeamDesc.trim() || selectedTeam.description,
      requiredSkills: editTeamSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: editTeamTags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      teamSize: Math.max(1, Number(editTeamSize) || selectedTeam.teamSize),
      deadline: editTeamDeadline || selectedTeam.deadline,
    });
    setIsEditingTeam(false);
  };

  const startEditingUser = (stu: typeof selectedVaultStudent) => {
    if (!stu) return;
    setEditUserName(stu.name);
    setEditUserEmail(stu.email);
    setEditUserStudentId(stu.studentIdNum);
    setEditUserPassword(stu.password || '');
    setEditUserRole(stu.accountType || 'TEAM_MEMBER');
    setEditUserDept(stu.department);
    setEditUserYear(stu.year);
    setEditUserSkills(stu.skills.join(', '));
    setEditUserInterests((stu.interests || []).join(', '));
    setIsEditingUser(true);
  };

  const saveUserEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaultStudent) return;
    adminUpdateStudent(selectedVaultStudent.id, {
      name: editUserName.trim() || selectedVaultStudent.name,
      email: editUserEmail.trim() || selectedVaultStudent.email,
      studentIdNum: editUserStudentId.trim() || selectedVaultStudent.studentIdNum,
      password: editUserPassword.trim() || selectedVaultStudent.password,
      accountType: editUserRole,
      department: editUserDept.trim() || selectedVaultStudent.department,
      year: editUserYear.trim() || selectedVaultStudent.year,
      skills: editUserSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      interests: editUserInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setIsEditingUser(false);
  };

  const inspectPersonInVault = (personId: string) => {
    setSelectedVaultUserId(personId);
    setIsEditingUser(false);
    setActiveTab('PRIVATE_VAULTS');
  };

  const inspectTeamInCommandCenter = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsEditingTeam(false);
    setActiveTab('TEAMS');
  };

  const eligibleStudentsToAdd = selectedTeam
    ? students.filter(
        (s) =>
          !selectedTeam.members.some((m) => m.id === s.id) &&
          (!memberSearchQuery.trim() ||
            s.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
            s.studentIdNum.includes(memberSearchQuery))
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Supreme Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-amber-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Graphic Era University • Supreme Administration & Total Platform Authority
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Supreme Admin Command Center: All Teams, Login Credentials & Controls
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Click any team below to inspect every single team detail, view every member&apos;s login
              credentials, override rosters, edit requirements, or inspect all {students.length} user
              accounts and private activity vaults.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAllPasswords(!showAllPasswords)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-bold text-amber-200 transition-colors"
            >
              {showAllPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAllPasswords ? 'Passwords Visible' : 'Reveal All Passwords'}</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-xs font-bold text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Lock Admin
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('TEAMS')}
            className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <div className="text-slate-400">All University Teams</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{teams.length} Teams</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setTeamStatusFilter('OPEN');
              setActiveTab('TEAMS');
            }}
            className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <div className="text-slate-400">Open Vacancy Teams</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{openTeamsCount} Open</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setPersonRoleFilter('ALL');
              setActiveTab('PRIVATE_VAULTS');
            }}
            className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <div className="text-slate-400">All People & Logins</div>
            <div className="text-xl font-black text-indigo-300 mt-0.5">
              {students.length} People
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setPersonRoleFilter('TEAM_LEADER');
              setActiveTab('PRIVATE_VAULTS');
            }}
            className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <div className="text-slate-400">Team Leaders</div>
            <div className="text-xl font-black text-cyan-300 mt-0.5">{teamLeadersCount} Leaders</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setPersonRoleFilter('VERIFIED');
              setActiveTab('STUDENTS');
            }}
            className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <div className="text-slate-400">Verified C/C++ Devs</div>
            <div className="text-xl font-black text-emerald-300 mt-0.5">
              {verifiedStudentsCount} Verified
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REPORTS')}
            className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <div className="text-slate-400">Dispute Reports</div>
            <div
              className={`text-xl font-black mt-0.5 ${
                pendingReports.length > 0 ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {pendingReports.length} Pending
            </div>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs — TEAMS IS FIRST */}
      <div className="flex flex-wrap border-b border-slate-200 gap-3 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('TEAMS')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'TEAMS'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600" />
          1. All Teams & Team Control Center ({teams.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PRIVATE_VAULTS')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'PRIVATE_VAULTS'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-600" />
          2. All People Login Credentials & Activity Vault ({students.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('STUDENTS')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'STUDENTS'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          3. Master Login & Profile Directory ({students.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REPORTS')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'REPORTS'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          Dispute Reports ({reports.length})
          {pendingReports.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ACTIVITIES')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'ACTIVITIES'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Global Audit Logs ({activityLogs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ASSESSMENTS')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'ASSESSMENTS'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Anti-Cheat Submissions ({assessmentSubmissions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SITE_CONTROLS')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'SITE_CONTROLS'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-700" />
          Site-Wide Controls
        </button>
      </div>

      {/* =====================================================================
          TAB 1 (DEFAULT ON ADMIN LOGIN): ALL TEAMS & DEEP TEAM COMMAND CENTER
         ===================================================================== */}
      {activeTab === 'TEAMS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (5 cols): Searchable List of All 105+ Teams */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-amber-600" />
                  All University Teams ({filteredTeams.length} / {teams.length})
                </h2>
                <p className="text-[11px] text-slate-500">
                  Click any team to inspect all team details, member logins & full controls
                </p>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search team title, ID, leader, member, or skill..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTeamStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    teamStatusFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({teams.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTeamStatusFilter('OPEN')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    teamStatusFilter === 'OPEN'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Open Vacancy ({openTeamsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTeamStatusFilter('CLOSED')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    teamStatusFilter === 'CLOSED'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Full / Closed ({teams.length - openTeamsCount})
                </button>
              </div>
            </div>

            {/* Scrollable Team Selector Cards */}
            <div className="space-y-2 max-h-[760px] overflow-y-auto pr-1">
              {filteredTeams.map((team) => {
                const isSelected = selectedTeam?.id === team.id;
                const isOpen = team.vacancyOpen && team.members.length < team.teamSize;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setIsEditingTeam(false);
                      setConfirmDeleteTeamId(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-2 ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {team.id}
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-700 truncate">
                            {team.category}
                          </span>
                        </div>
                        <div className="font-black text-xs text-slate-900 mt-1 line-clamp-1">
                          {team.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {team.department}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isOpen
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {team.members.length}/{team.teamSize} {isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/70">
                      <div className="truncate text-slate-700">
                        <span className="text-slate-400">Lead:</span>{' '}
                        <span className="font-bold">{team.leaderName}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700">
                        Inspect & Control →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN (7 cols): Deep Team Inspector & Full Per-Team Admin Controls */}
          <div className="lg:col-span-7 space-y-5">
            {selectedTeam && selectedTeamIntel ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Team Banner & Primary Controls */}
                <div
                  className={`bg-gradient-to-r ${selectedTeam.bannerGradient || 'from-slate-900 to-indigo-900'} text-white p-6`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-black/30 backdrop-blur-xs font-mono text-[11px] font-bold">
                          ID: {selectedTeam.id}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/20 text-[11px] font-bold">
                          {selectedTeam.category}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/15 text-[11px]">
                          Created: {selectedTeam.createdAt}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/15 text-[11px]">
                          Deadline: {selectedTeam.deadline}
                        </span>
                      </div>
                      <h2 className="text-xl font-black tracking-tight">{selectedTeam.title}</h2>
                      <p className="text-xs text-white/90">{selectedTeam.department}</p>
                    </div>

                    {/* Quick Status & Capacity Pill */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-black border ${
                          selectedTeam.vacancyOpen &&
                          selectedTeam.members.length < selectedTeam.teamSize
                            ? 'bg-emerald-500 text-white border-emerald-300'
                            : 'bg-rose-600 text-white border-rose-400'
                        }`}
                      >
                        {selectedTeam.vacancyOpen &&
                        selectedTeam.members.length < selectedTeam.teamSize
                          ? `VACANCY OPEN (${selectedTeamIntel.capacityMetrics.openSpots} Spots Left)`
                          : 'VACANCY CLOSED / FULL'}
                      </span>
                      <span className="text-xs font-bold text-white/90">
                        Roster: {selectedTeam.members.length} / {selectedTeam.teamSize} Members (
                        {selectedTeamIntel.capacityMetrics.fillPercentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Admin Master Controls Bar for This Team */}
                  <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/20 text-xs">
                    {onOpenTeamPage && (
                      <button
                        type="button"
                        onClick={() => onOpenTeamPage(selectedTeam)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black shadow-xs transition-colors cursor-pointer"
                      >
                        <FolderKanban className="w-3.5 h-3.5" />
                        Open Full Project Page
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        isEditingTeam ? setIsEditingTeam(false) : startEditingTeam(selectedTeam)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-amber-100 font-bold shadow-xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      {isEditingTeam ? 'Cancel Edit' : 'Edit Team Details'}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleTeamVacancy(selectedTeam.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold border border-white/25 transition-colors"
                    >
                      {selectedTeam.vacancyOpen ? (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Force Close Vacancy
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" /> Force Open Vacancy
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        adminUpdateTeam(selectedTeam.id, {
                          teamSize: selectedTeam.teamSize + 1,
                          vacancyOpen: true,
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold border border-white/25 transition-colors"
                      title="Increase Max Team Capacity"
                    >
                      +1 Slot (Max {selectedTeam.teamSize + 1})
                    </button>

                    {selectedTeam.teamSize > selectedTeam.members.length &&
                      selectedTeam.teamSize > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            adminUpdateTeam(selectedTeam.id, {
                              teamSize: selectedTeam.teamSize - 1,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold border border-white/25 transition-colors"
                        >
                          -1 Slot
                        </button>
                      )}

                    {confirmDeleteTeamId === selectedTeam.id ? (
                      <div className="inline-flex items-center gap-1.5 bg-rose-950/90 px-3 py-1 rounded-xl border border-rose-400">
                        <span className="text-[11px] font-bold text-rose-200">
                          Dissolve & delete team?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextTeam = teams.find((t) => t.id !== selectedTeam.id);
                            adminDeleteTeam(selectedTeam.id);
                            setConfirmDeleteTeamId(null);
                            if (nextTeam) setSelectedTeamId(nextTeam.id);
                          }}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px]"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteTeamId(null)}
                          className="px-2 py-0.5 rounded bg-slate-700 text-white text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteTeamId(selectedTeam.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold border border-rose-400/40 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Dissolve Team
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6 text-xs">
                  {/* Inline Team Editor Form (when active) */}
                  {isEditingTeam && (
                    <form
                      onSubmit={saveTeamEdits}
                      className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4 text-amber-600" />
                          Admin Override: Edit Team Specifications
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Team Title</label>
                          <input
                            type="text"
                            required
                            value={editTeamTitle}
                            onChange={(e) => setEditTeamTitle(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Department</label>
                          <input
                            type="text"
                            required
                            value={editTeamDept}
                            onChange={(e) => setEditTeamDept(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Category</label>
                          <input
                            type="text"
                            required
                            value={editTeamCategory}
                            onChange={(e) => setEditTeamCategory(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Max Team Size
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={15}
                              value={editTeamSize}
                              onChange={(e) => setEditTeamSize(Number(e.target.value))}
                              className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Deadline</label>
                            <input
                              type="text"
                              value={editTeamDeadline}
                              onChange={(e) => setEditTeamDeadline(e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Project Description & Deliverable Scope
                        </label>
                        <textarea
                          rows={2}
                          value={editTeamDesc}
                          onChange={(e) => setEditTeamDesc(e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Required Skills (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={editTeamSkills}
                            onChange={(e) => setEditTeamSkills(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={editTeamTags}
                            onChange={(e) => setEditTeamTags(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingTeam(false)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                        >
                          Save Team Changes
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Team Blueprint Overview */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        Project Description & Architecture Objective
                      </div>
                      <p className="text-slate-800 mt-1 leading-relaxed font-medium">
                        {selectedTeam.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Required Skills ({selectedTeam.requiredSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedTeam.requiredSkills.map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[11px]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Domain Tags
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedTeam.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-semibold text-[11px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 1: TEAM LEADER & COMPLETE MEMBER ROSTER + LOGIN CREDENTIALS */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-600" />
                          Team Roster & Complete Member Login Credentials (
                          {selectedTeamIntel.memberRecords.length} / {selectedTeam.teamSize})
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Every person in this team with their login email, university ID, password,
                          skills, and instant Admin controls.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedTeamIntel.memberRecords.map((rec) => {
                        const { profile, isLeader, loginEmail, loginId, loginPassword } = rec;
                        return (
                          <div
                            key={profile.id}
                            className={`p-4 rounded-xl border transition-all space-y-3 ${
                              isLeader
                                ? 'bg-amber-50/50 border-amber-300'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <UserAvatar
                                  name={profile.name}
                                  avatar={profile.avatar}
                                  size="md"
                                  isVerified={profile.assessmentStatus?.cppVerified}
                                  showBadge
                                />
                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-black text-sm text-slate-900">
                                      {profile.name}
                                    </span>
                                    {isLeader ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black">
                                        <Crown className="w-3 h-3" /> TEAM LEADER
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                                        TEAM MEMBER
                                      </span>
                                    )}
                                    {profile.assessmentStatus?.cppVerified && (
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                        Verified C/C++ ({profile.assessmentStatus.score}%)
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {profile.department} • {profile.year}
                                    {profile.phone ? ` • ${profile.phone}` : ''}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {profile.skills.map((sk) => (
                                      <span
                                        key={sk}
                                        className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]"
                                      >
                                        {sk}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Per-Member Admin Actions */}
                              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => inspectPersonInVault(profile.id)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white font-bold text-[11px] transition-colors"
                                >
                                  Full Vault & Edit
                                </button>
                                {!isLeader && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      adminPromoteTeamLeader(selectedTeam.id, profile.id)
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px]"
                                    title="Promote this member to Team Leader"
                                  >
                                    <Crown className="w-3 h-3" /> Make Leader
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeMemberFromTeam(selectedTeam.id, profile.id)
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px]"
                                >
                                  <Trash2 className="w-3 h-3" /> Remove from Team
                                </button>
                              </div>
                            </div>

                            {/* Member Login Credentials Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 text-white font-mono text-[11px]">
                              <div className="flex items-center justify-between gap-1 bg-slate-800/90 px-2.5 py-1.5 rounded-lg">
                                <div className="truncate">
                                  <span className="text-slate-400 text-[9px] block uppercase font-sans font-bold">
                                    Login Email
                                  </span>
                                  <span className="text-amber-300 truncate">{loginEmail}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(loginEmail, `email-${profile.id}`)}
                                  className="text-slate-400 hover:text-white shrink-0"
                                  title="Copy Email"
                                >
                                  {copiedToken === `email-${profile.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              <div className="flex items-center justify-between gap-1 bg-slate-800/90 px-2.5 py-1.5 rounded-lg">
                                <div className="truncate">
                                  <span className="text-slate-400 text-[9px] block uppercase font-sans font-bold">
                                    Student ID / Username
                                  </span>
                                  <span className="text-cyan-300">{loginId}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(loginId, `id-${profile.id}`)}
                                  className="text-slate-400 hover:text-white shrink-0"
                                  title="Copy ID"
                                >
                                  {copiedToken === `id-${profile.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              <div className="flex items-center justify-between gap-1 bg-slate-800/90 px-2.5 py-1.5 rounded-lg">
                                <div className="truncate">
                                  <span className="text-slate-400 text-[9px] block uppercase font-sans font-bold">
                                    Login Password
                                  </span>
                                  <span className="text-emerald-300 font-bold">
                                    {showAllPasswords ? loginPassword : '••••••••••••'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(loginPassword, `pass-${profile.id}`)}
                                  className="text-slate-400 hover:text-white shrink-0"
                                  title="Copy Password"
                                >
                                  {copiedToken === `pass-${profile.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Admin Force-Add Any Person to This Team */}
                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                      <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-indigo-600" />
                        Admin Roster Override: Force-Add Any Person to {selectedTeam.title}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input
                          type="text"
                          placeholder="Filter people by name/ID..."
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          className="sm:col-span-4 p-2 rounded-lg border border-indigo-200 bg-white text-xs"
                        />
                        <select
                          value={candidateToAddId}
                          onChange={(e) => setCandidateToAddId(e.target.value)}
                          className="sm:col-span-5 p-2 rounded-lg border border-indigo-200 bg-white text-xs"
                        >
                          <option value="">
                            Select person ({eligibleStudentsToAdd.length} available)...
                          </option>
                          {eligibleStudentsToAdd.slice(0, 80).map((stu) => (
                            <option key={stu.id} value={stu.id}>
                              {stu.name} ({stu.studentIdNum}) — {stu.skills.slice(0, 2).join(', ')}
                            </option>
                          ))}
                        </select>
                        <select
                          value={candidateToAddRole}
                          onChange={(e) =>
                            setCandidateToAddRole(e.target.value as 'Member' | 'Leader')
                          }
                          className="sm:col-span-3 p-2 rounded-lg border border-indigo-200 bg-white text-xs font-bold"
                        >
                          <option value="Member">Add as Member</option>
                          <option value="Leader">Assign as Leader</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={!candidateToAddId}
                          onClick={() => {
                            if (!candidateToAddId) return;
                            adminAddMemberToTeam(
                              selectedTeam.id,
                              candidateToAddId,
                              candidateToAddRole
                            );
                            setCandidateToAddId('');
                          }}
                          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs"
                        >
                          + Force Add Person to Team
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: TEAM APPLICATIONS & RECRUITMENT OVERRIDE */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-200">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Applications to This Team ({selectedTeamIntel.teamApplications.length})
                    </h3>
                    {selectedTeamIntel.teamApplications.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTeamIntel.teamApplications.map((app) => (
                          <div
                            key={app.id}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{app.studentName}</span>
                                <span className="text-[11px] font-mono text-slate-500">
                                  ({app.studentEmail})
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    app.status === 'PENDING'
                                      ? 'bg-amber-100 text-amber-800'
                                      : app.status === 'APPROVED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {app.status}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                                  Match: {app.matchScore}%
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 italic">&ldquo;{app.message}&rdquo;</p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => inspectPersonInVault(app.studentId)}
                                className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px]"
                              >
                                Inspect Applicant
                              </button>
                              {app.status === 'PENDING' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => approveApplication(app.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                                  >
                                    <UserCheck className="w-3 h-3" /> Force Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => rejectApplication(app.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]"
                                  >
                                    <XCircle className="w-3 h-3" /> Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                        No applications currently on file for {selectedTeam.title}. You can force-add
                        any person directly using the Roster Override tool above.
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: TEAM CHAT MONITOR & OFFICIAL ADMIN DIRECTIVE BROADCAST */}
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      Team Chat Room Audit & Official Admin Broadcast
                    </h3>

                    <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5 max-h-60 overflow-y-auto">
                      {(teamChatThreads[selectedTeam.id] || []).length > 0 ? (
                        (teamChatThreads[selectedTeam.id] || []).map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                              msg.senderRole === 'ADMIN DIRECTIVE'
                                ? 'bg-amber-500/20 border-amber-400/50 text-amber-100'
                                : 'bg-slate-800 border-slate-700 text-slate-200'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-white">
                                  {msg.senderName}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono">
                                  {msg.senderRole}
                                </span>
                                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                              </div>
                              <p className="text-xs leading-relaxed">{msg.content}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                adminDeleteTeamChatMessage(selectedTeam.id, msg.id)
                              }
                              className="text-slate-400 hover:text-rose-400 p-1"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-xs py-2 text-center">
                          No messages in this team&apos;s room yet. Send an official Admin directive
                          below to initialize or instruct the team.
                        </div>
                      )}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!directiveText.trim()) return;
                        adminSendTeamDirective(selectedTeam.id, directiveText);
                        setDirectiveText('');
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder={`Post official [ADMIN DIRECTIVE] into ${selectedTeam.title} chat...`}
                        value={directiveText}
                        onChange={(e) => setDirectiveText(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" /> Broadcast Directive
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: ALL PEOPLE LOGIN CREDENTIALS & PRIVATE ACTIVITY VAULTS (195+ PEOPLE)
         ===================================================================== */}
      {activeTab === 'PRIVATE_VAULTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                All People Login Credentials, Profiles & Individual Activity Vault ({students.length}{' '}
                Total People)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete database of every single Team Leader, Team Member, and registered student
                across all {teams.length} teams, including their login email, student ID, password,
                team assignments, and private activity logs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setPersonRoleFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg font-bold ${
                  personRoleFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All People ({students.length})
              </button>
              <button
                type="button"
                onClick={() => setPersonRoleFilter('TEAM_LEADER')}
                className={`px-2.5 py-1.5 rounded-lg font-bold ${
                  personRoleFilter === 'TEAM_LEADER'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Team Leaders ({teamLeadersCount})
              </button>
              <button
                type="button"
                onClick={() => setPersonRoleFilter('TEAM_MEMBER')}
                className={`px-2.5 py-1.5 rounded-lg font-bold ${
                  personRoleFilter === 'TEAM_MEMBER'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                Team Members ({students.length - teamLeadersCount})
              </button>
              <button
                type="button"
                onClick={() => setPersonRoleFilter('VERIFIED')}
                className={`px-2.5 py-1.5 rounded-lg font-bold ${
                  personRoleFilter === 'VERIFIED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Verified C/C++ ({verifiedStudentsCount})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            {/* Left: Searchable Directory of All People */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, email, ID, password, team, or skill..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between px-1">
                <span>
                  Showing {filteredStudents.length} of {students.length} people
                </span>
                <span>Click any person for full vault</span>
              </div>

              <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                {filteredStudents.map((stu) => {
                  const isSelected = selectedVaultStudent?.id === stu.id;
                  const uTeams = userTeamsMap[stu.id];
                  const ledCount = uTeams?.ledTeams.length || 0;
                  const memCount = uTeams?.memberTeams.length || 0;
                  const isLeader = stu.accountType === 'TEAM_LEADER' || ledCount > 0;

                  return (
                    <button
                      key={stu.id}
                      type="button"
                      onClick={() => {
                        setSelectedVaultUserId(stu.id);
                        setIsEditingUser(false);
                        setConfirmDeleteUserId(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar
                            name={stu.name}
                            avatar={stu.avatar}
                            size="sm"
                            isVerified={stu.assessmentStatus?.cppVerified}
                            showBadge
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{stu.name}</span>
                              {stu.isBanned && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black">
                                  BANNED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono truncate">
                              {stu.email}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLeader
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {isLeader ? 'TEAM_LEADER' : 'TEAM_MEMBER'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono bg-white/80 px-2 py-1 rounded border border-slate-200/70">
                        <span className="text-slate-600">ID: {stu.studentIdNum}</span>
                        <span className="text-emerald-700 font-bold">
                          Pass: {showAllPasswords ? stu.password : '••••••••'}
                        </span>
                        <span className="font-sans font-bold text-indigo-700">
                          {memCount} Team{memCount === 1 ? '' : 's'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Person's Complete Login Details, Teams, Profile & Private Activity Vault */}
            <div className="lg:col-span-7">
              {selectedVaultStudent ? (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                  {/* Top Header & Admin Account Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={selectedVaultStudent.name}
                        avatar={selectedVaultStudent.avatar}
                        size="md"
                        isVerified={selectedVaultStudent.assessmentStatus?.cppVerified}
                        showBadge
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-black text-slate-900">
                            {selectedVaultStudent.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black">
                            {selectedVaultStudent.accountType || 'TEAM_MEMBER'}
                          </span>
                          {selectedVaultStudent.isBanned && (
                            <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black">
                              SUSPENDED / BANNED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Internal Key: {selectedVaultStudent.id} • Created:{' '}
                          {selectedVaultStudent.createdAt || '2026-10-15'}
                        </div>
                        <div className="text-[11px] text-slate-700 font-semibold mt-0.5">
                          {selectedVaultStudent.department} • {selectedVaultStudent.year}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          isEditingUser
                            ? setIsEditingUser(false)
                            : startEditingUser(selectedVaultStudent)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {isEditingUser ? 'Cancel Edit' : 'Edit Login & Profile'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          adminUpdateStudent(selectedVaultStudent.id, {
                            assessmentStatus: {
                              cppVerified: !selectedVaultStudent.assessmentStatus?.cppVerified,
                              cVerified: true,
                              score: selectedVaultStudent.assessmentStatus?.cppVerified ? 0 : 95,
                              verdict: selectedVaultStudent.assessmentStatus?.cppVerified
                                ? 'NOT_ATTEMPTED'
                                : 'VERIFIED_ELIGIBLE',
                              cheatFlags: 0,
                              completedAt: 'Admin Verified',
                            },
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {selectedVaultStudent.assessmentStatus?.cppVerified
                          ? 'Revoke C++ Badge'
                          : 'Force Verify C++'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          adminUpdateStudent(selectedVaultStudent.id, {
                            isBanned: !selectedVaultStudent.isBanned,
                          })
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-xs ${
                          selectedVaultStudent.isBanned
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        {selectedVaultStudent.isBanned ? 'Unban User' : 'Suspend'}
                      </button>

                      {confirmDeleteUserId === selectedVaultStudent.id ? (
                        <div className="inline-flex items-center gap-1 bg-rose-100 px-2 py-1 rounded-lg border border-rose-300">
                          <button
                            type="button"
                            onClick={() => {
                              const nextStu = students.find(
                                (s) => s.id !== selectedVaultStudent.id
                              );
                              adminDeleteUser(selectedVaultStudent.id);
                              setConfirmDeleteUserId(null);
                              if (nextStu) setSelectedVaultUserId(nextStu.id);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[11px]"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteUserId(null)}
                            className="px-2 py-0.5 rounded bg-white text-slate-700 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteUserId(selectedVaultStudent.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Login & Profile Editor */}
                  {isEditingUser && (
                    <form
                      onSubmit={saveUserEdits}
                      className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-3"
                    >
                      <div className="font-black text-amber-950 text-xs flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        Admin Override: Edit Person Login Credentials & Profile Details
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editUserName}
                            onChange={(e) => setEditUserName(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Login Email</label>
                          <input
                            type="email"
                            required
                            value={editUserEmail}
                            onChange={(e) => setEditUserEmail(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Student ID / Login Username
                          </label>
                          <input
                            type="text"
                            required
                            value={editUserStudentId}
                            onChange={(e) => setEditUserStudentId(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Login Password
                          </label>
                          <input
                            type="text"
                            required
                            value={editUserPassword}
                            onChange={(e) => setEditUserPassword(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Account Role</label>
                          <select
                            value={editUserRole}
                            onChange={(e) =>
                              setEditUserRole(e.target.value as 'TEAM_MEMBER' | 'TEAM_LEADER')
                            }
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                          >
                            <option value="TEAM_MEMBER">TEAM_MEMBER</option>
                            <option value="TEAM_LEADER">TEAM_LEADER</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Department</label>
                          <input
                            type="text"
                            value={editUserDept}
                            onChange={(e) => setEditUserDept(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Skills (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={editUserSkills}
                            onChange={(e) => setEditUserSkills(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Interests (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={editUserInterests}
                            onChange={(e) => setEditUserInterests(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingUser(false)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                        >
                          Save Login & Profile Changes
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Complete Login Credentials Card */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5" />
                        Stored Login Credentials & Authentication Details
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Can sign in via Email or Student ID
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">
                          Login Email
                        </span>
                        <span className="text-amber-300 break-all">
                          {selectedVaultStudent.email}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">
                          Student ID / Roll No.
                        </span>
                        <span className="text-cyan-300 font-bold">
                          {selectedVaultStudent.studentIdNum}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">
                          Account Password
                        </span>
                        <span className="text-emerald-300 font-black">
                          {showAllPasswords
                            ? selectedVaultStudent.password || 'Gehu@2026#pass'
                            : '••••••••••••'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Teams Led & Joined by This Person (Clickable to jump to Team Control Panel) */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>
                        Teams Associated With {selectedVaultStudent.name} (
                        {userTeamsMap[selectedVaultStudent.id]?.memberTeams.length || 0})
                      </span>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        Click any team to open full Team Controls
                      </span>
                    </div>

                    {(userTeamsMap[selectedVaultStudent.id]?.memberTeams.length || 0) > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {userTeamsMap[selectedVaultStudent.id]?.memberTeams.map((t) => {
                          const isTeamLead = t.leaderId === selectedVaultStudent.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => inspectTeamInCommandCenter(t.id)}
                              className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 text-left transition-all flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">{t.title}</div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {t.id} • {t.members.length}/{t.teamSize} members
                                </div>
                              </div>
                              <span
                                className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isTeamLead
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {isTeamLead ? 'Leader' : 'Member'} →
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs">
                        Not currently assigned to a project team roster.
                      </div>
                    )}
                  </div>

                  {/* Stored Profile Data */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Stored Skills ({selectedVaultStudent.skills.length})
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedVaultStudent.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Stored Interests
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(selectedVaultStudent.interests || ['Engineering']).map((i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]"
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-bold">Availability:</span>{' '}
                        <span className="text-slate-700 font-semibold">
                          {selectedVaultStudent.availability || '15 hrs/week'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">C/C++ Verification:</span>{' '}
                        <span className="text-emerald-700 font-bold">
                          {selectedVaultStudent.assessmentStatus?.verdict || 'NOT_ATTEMPTED'} (
                          {selectedVaultStudent.assessmentStatus?.score || 0}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Individual Activity Trail */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>
                        Stored Activity Trail for {selectedVaultStudent.name} (
                        {selectedUserActivities.length})
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Visible only to {selectedVaultStudent.name} & Admin
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {selectedUserActivities.length > 0 ? (
                        selectedUserActivities.map((act) => (
                          <div
                            key={act.id}
                            className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                                {act.type}
                              </span>
                              <span className="text-slate-800">{act.description}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {act.timestamp}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-slate-400">
                          Account active and synced in university roster. Any new logins, project
                          actions, or submissions by {selectedVaultStudent.name} appear here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: MASTER LOGIN & PROFILE DIRECTORY TABLE (ALL 195+ PEOPLE)
         ===================================================================== */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Master User Accounts, Login Credentials & Team Assignments ({filteredStudents.length}{' '}
                / {students.length} People)
              </h3>
              <p className="text-xs text-slate-500">
                Every single person across the platform with their login email, student ID,
                password, role, team links, and instant Admin actions.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search any person, email, ID, password..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[680px]">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">Person & Role</th>
                  <th className="py-2.5 px-3">Login Email & Student ID</th>
                  <th className="py-2.5 px-3">Login Password</th>
                  <th className="py-2.5 px-3">Teams (Click to Control)</th>
                  <th className="py-2.5 px-3">C/C++ Status</th>
                  <th className="py-2.5 px-3 text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const uTeams = userTeamsMap[student.id]?.memberTeams || [];
                  const isLead =
                    student.accountType === 'TEAM_LEADER' ||
                    (userTeamsMap[student.id]?.ledTeams.length || 0) > 0;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            name={student.name}
                            avatar={student.avatar}
                            size="sm"
                            isVerified={student.assessmentStatus?.cppVerified}
                            showBadge
                          />
                          <div>
                            <div className="font-bold text-slate-900">{student.name}</div>
                            <span
                              className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isLead
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-indigo-50 text-indigo-700'
                              }`}
                            >
                              {isLead ? 'TEAM LEADER' : 'TEAM MEMBER'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div className="text-slate-900 font-semibold">{student.email}</div>
                        <div className="text-slate-500">ID: {student.studentIdNum}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="px-2 py-1 rounded bg-slate-900 text-emerald-300 font-bold">
                          {showAllPasswords ? student.password || 'Gehu@2026#pass' : '••••••••••'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {uTeams.slice(0, 3).map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => inspectTeamInCommandCenter(t.id)}
                              className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold truncate max-w-[180px]"
                              title={`Inspect ${t.title}`}
                            >
                              {t.title}
                            </button>
                          ))}
                          {uTeams.length > 3 && (
                            <span className="text-[10px] text-slate-400">
                              +{uTeams.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {student.assessmentStatus?.cppVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Verified (
                            {student.assessmentStatus.score}%)
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Unverified</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => inspectPersonInVault(student.id)}
                            className="px-2.5 py-1 rounded text-xs font-bold bg-slate-900 text-white hover:bg-indigo-600"
                          >
                            Full Vault & Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => adminDeleteUser(student.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: DISPUTE REPORTS & MODERATION
         ===================================================================== */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Strict Privacy Notice:</span> User reports are strictly
            confidential and visible ONLY to the platform administrator and the complaining user.
            Admins hold sole authority to delete or ban fraudulent accounts.
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Report against:{' '}
                          <span className="text-rose-600">{report.reportedUserName}</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            report.status === 'PENDING'
                              ? 'bg-rose-100 text-rose-800'
                              : report.status === 'RESOLVED_BANNED'
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Filed by: {report.reporterName} ({report.reporterEmail}) on{' '}
                        {report.createdAt}
                      </div>
                    </div>

                    {report.status === 'PENDING' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => adminResolveReport(report.id, 'DISMISS')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                        >
                          Dismiss
                        </button>
                        <button
                          type="button"
                          onClick={() => adminResolveReport(report.id, 'WARN')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300"
                        >
                          Issue Warning
                        </button>
                        <button
                          type="button"
                          onClick={() => adminResolveReport(report.id, 'BAN_DELETE')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete User Profile
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-slate-800">
                      Reason: <span className="font-normal text-slate-700">{report.reason}</span>
                    </div>
                    {report.details && (
                      <div className="text-slate-600 text-[11px]">
                        Additional details: {report.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No dispute or profile reports logged on the platform.
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 5: GLOBAL AUDIT LOGS
         ===================================================================== */}
      {activeTab === 'ACTIVITIES' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" /> Real-Time Platform Audit Logs (
            {activityLogs.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.type === 'REGISTRATION'
                        ? 'bg-blue-100 text-blue-800'
                        : log.type === 'APPLICATION'
                        ? 'bg-indigo-100 text-indigo-800'
                        : log.type === 'APPROVAL'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.type === 'REPORT'
                        ? 'bg-rose-100 text-rose-800'
                        : log.type === 'ASSESSMENT'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {log.type}
                  </span>
                  <span className="text-slate-800 font-medium">{log.description}</span>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: ANTI-CHEAT SUBMISSIONS
         ===================================================================== */}
      {activeTab === 'ASSESSMENTS' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Automated code verification logs, anti-cheat violation metrics, and algorithmic
            complexity reports.
          </div>

          <div className="space-y-4">
            {assessmentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{sub.candidateName}</span>
                      <span className="text-xs text-slate-500 font-mono">
                        ({sub.candidateEmail})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          sub.verdict === 'VERIFIED_ELIGIBLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.verdict}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {sub.challengeTitle} • Submitted on {sub.submittedAt}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">{sub.score}%</span>
                    <div className="text-[11px] text-slate-500">
                      Tests: {sub.testCasesPassed}/{sub.totalTestCases} Passed
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-lg">
                  <div>
                    <span className="text-slate-400">Time Spent:</span>{' '}
                    <span className="font-bold text-slate-800">
                      {Math.round(sub.timeSpentSeconds / 60)} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tab Switches:</span>{' '}
                    <span
                      className={`font-bold ${
                        sub.tabSwitchCount > 0 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {sub.tabSwitchCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Paste Events:</span>{' '}
                    <span
                      className={`font-bold ${
                        sub.copyPasteCount > 0 ? 'text-amber-600' : 'text-slate-800'
                      }`}
                    >
                      {sub.copyPasteCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Suspicion:</span>{' '}
                    <span className="font-bold text-emerald-700">{sub.cheatSuspicion} Risk</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950">
                  <span className="font-bold">Automated Feedback: </span>
                  {sub.personalizedFeedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 7: SITE-WIDE CONTROLS & POLICIES
         ===================================================================== */}
      {activeTab === 'SITE_CONTROLS' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                University Portal Governance & Policy Controls
              </h3>
              <p className="text-xs text-slate-500">
                Configure global criteria thresholds, security maintenance gates, and recruitment
                parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Maintenance Lockout Mode</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Restrict student invitations and lock database changes during exam windows.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSiteSettings({ maintenanceMode: !siteSettings.maintenanceMode })
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    siteSettings.maintenanceMode
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {siteSettings.maintenanceMode ? 'Enabled (Locked)' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">Verified Developer Cutoff Score</div>
                  <span className="font-bold text-indigo-600 text-xs px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                    {siteSettings.eligibilityThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  value={siteSettings.eligibilityThreshold}
                  onChange={(e) =>
                    updateSiteSettings({ eligibilityThreshold: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Student Account Registration</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Allow new student profiles to be registered on the platform.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSiteSettings({
                      allowNewRegistrations: !siteSettings.allowNewRegistrations,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    siteSettings.allowNewRegistrations
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {siteSettings.allowNewRegistrations ? 'Open' : 'Suspended'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Public Invitation Applications</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Enable candidate applications to open vacancies across all {teams.length} teams.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSiteSettings({
                      allowPublicApplications: !siteSettings.allowPublicApplications,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    siteSettings.allowPublicApplications
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {siteSettings.allowPublicApplications ? 'Active' : 'Paused'}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Site-Wide Announcement Message:
              </label>
              <input
                type="text"
                value={siteSettings.announcementBanner}
                onChange={(e) => updateSiteSettings({ announcementBanner: e.target.value })}
                placeholder="Official portal notification..."
                className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-bold text-slate-900">System Logs & Full Database Archive</div>
              <div className="text-[11px] text-slate-500">
                Download complete JSON snapshot of all {teams.length} teams, {students.length} user
                credentials, and {activityLogs.length} audit logs.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify({ teams, students, activityLogs }, null, 2)],
                  { type: 'application/json' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `skillmatch-admin-full-dump-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Full Admin Database (JSON)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
