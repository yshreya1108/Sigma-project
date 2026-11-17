import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getVisibleActivitiesForViewer } from '../lib/portalAuthEngine';
import {
  Users,
  UserCheck,
  UserX,
  MessageSquare,
  Lock,
  Unlock,
  Send,
  ShieldCheck,
  Sparkles,
  Plus,
  Rocket,
  FolderGit2,
  Activity,
  CheckCircle2,
  X,
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface TeamLeaderDashboardProps {
  onOpenChat: (applicationId: string) => void;
  onOpenTeamPage?: (teamOrId: any) => void;
}

const COMMON_SKILLS = [
  'C++',
  'C',
  'Data Structures',
  'Algorithms',
  'STL',
  'Multithreading',
  'Python',
  'React',
  'TypeScript',
  'Node.js',
  'Machine Learning',
  'Embedded Systems',
  'SQL',
  'Cybersecurity',
  'Linux',
];

export const TeamLeaderDashboard: React.FC<TeamLeaderDashboardProps> = ({
  onOpenChat,
  onOpenTeamPage,
}) => {
  const {
    teams,
    currentUserId,
    applications,
    approveApplication,
    rejectApplication,
    removeMemberFromTeam,
    toggleTeamVacancy,
    teamChatThreads,
    sendTeamChatMessage,
    currentUserProfile,
    createProjectForCurrentLeader,
    updateTeamProjectDetails,
    activityLogs,
    role,
    isAdminAuthenticated,
  } = useApp();

  // Find teams led by current user (default to Team Sigma if Shreya)
  const myLeadTeams = teams.filter((t) => t.leaderId === currentUserId);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    myLeadTeams[0]?.id || 'team-sigma'
  );

  useEffect(() => {
    if (myLeadTeams.length > 0 && !myLeadTeams.some((t) => t.id === selectedTeamId)) {
      setSelectedTeamId(myLeadTeams[0].id);
    }
  }, [myLeadTeams, selectedTeamId]);

  const activeTeam =
    teams.find((t) => t.id === selectedTeamId) ||
    myLeadTeams[0] ||
    teams.find((t) => t.id === 'team-sigma') ||
    teams[0];

  const [activeTab, setActiveTab] = useState<
    'APPLICATIONS' | 'MEMBERS' | 'PROJECT_DETAILS' | 'GROUP_CHAT' | 'PRIVATE_VAULT'
  >('APPLICATIONS');
  const [teamChatInput, setTeamChatInput] = useState('');

  // Create New Project Modal state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('Systems & C++ Engineering');
  const [newProjDept, setNewProjDept] = useState(
    currentUserProfile?.department || 'Computer Science & Engineering'
  );
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjSkills, setNewProjSkills] = useState<string[]>(['C++', 'Algorithms']);
  const [customNewSkill, setCustomNewSkill] = useState('');
  const [newProjSize, setNewProjSize] = useState(4);
  const [newProjDeadline, setNewProjDeadline] = useState('2026-12-31');
  const [newProjTags, setNewProjTags] = useState('C++20, Systems, Graph');

  // Edit current project state
  const [editTitle, setEditTitle] = useState(activeTeam.title);
  const [editCategory, setEditCategory] = useState(activeTeam.category);
  const [editDept, setEditDept] = useState(activeTeam.department);
  const [editDesc, setEditDesc] = useState(activeTeam.description);
  const [editSkills, setEditSkills] = useState<string[]>(activeTeam.requiredSkills);
  const [editSize, setEditSize] = useState(activeTeam.teamSize);
  const [editDeadline, setEditDeadline] = useState(activeTeam.deadline);
  const [editTags, setEditTags] = useState((activeTeam.tags || []).join(', '));
  const [saveNotice, setSaveNotice] = useState('');

  useEffect(() => {
    setEditTitle(activeTeam.title);
    setEditCategory(activeTeam.category);
    setEditDept(activeTeam.department);
    setEditDesc(activeTeam.description);
    setEditSkills(activeTeam.requiredSkills);
    setEditSize(activeTeam.teamSize);
    setEditDeadline(activeTeam.deadline);
    setEditTags((activeTeam.tags || []).join(', '));
  }, [activeTeam]);

  // Applications for this team
  const teamApplications = applications.filter((a) => a.teamId === activeTeam.id);
  const pendingApps = teamApplications.filter((a) => a.status === 'PENDING');

  // Group messages
  const groupMessages = teamChatThreads[activeTeam.id] || [];

  // Private activities visible ONLY to this Team Leader and Admin
  const myPrivateActivities = getVisibleActivitiesForViewer({
    logs: activityLogs,
    viewerRole: role,
    isAdminAuthenticated,
    viewerUserId: currentUserProfile?.id || currentUserId,
    viewerName: currentUserProfile?.name || activeTeam.leaderName,
  });

  const handleSendGroupMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamChatInput.trim()) return;
    sendTeamChatMessage(activeTeam.id, teamChatInput);
    setTeamChatInput('');
  };

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;
    const created = createProjectForCurrentLeader({
      title: newProjTitle.trim(),
      category: newProjCategory,
      department: newProjDept,
      description: newProjDesc.trim(),
      requiredSkills: newProjSkills,
      teamSize: newProjSize,
      deadline: newProjDeadline,
      tags: newProjTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    if (created) {
      setSelectedTeamId(created.id);
      setShowNewProjectModal(false);
      setNewProjTitle('');
      setNewProjDesc('');
    }
  };

  const handleSaveProjectDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeamProjectDetails(activeTeam.id, {
      title: editTitle.trim() || activeTeam.title,
      category: editCategory,
      department: editDept,
      description: editDesc.trim() || activeTeam.description,
      requiredSkills: editSkills,
      teamSize: Number(editSize) || activeTeam.teamSize,
      deadline: editDeadline,
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setSaveNotice('Project & team requirements saved and updated!');
    setTimeout(() => setSaveNotice(''), 3500);
  };

  const spotsLeft = Math.max(0, activeTeam.teamSize - activeTeam.members.length);

  return (
    <div className="space-y-6">
      {/* Team Leader Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Team Leader Command Center
              </span>
              <span className="text-xs text-slate-400">{activeTeam.department}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-200 border border-violet-500/30">
                {activeTeam.category}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{activeTeam.title}</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {activeTeam.description}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-[11px] font-semibold text-indigo-300">Required Team Skills:</span>
              {activeTeam.requiredSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded bg-white/10 text-white text-[11px] font-medium border border-white/15"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Project Selector, New Project Button & Vacancy Control */}
          <div className="flex flex-wrap items-center gap-2.5">
            {myLeadTeams.length > 1 && (
              <select
                value={activeTeam.id}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
              >
                {myLeadTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    Project: {t.title}
                  </option>
                ))}
              </select>
            )}

            {onOpenTeamPage && (
              <button
                type="button"
                onClick={() => onOpenTeamPage(activeTeam)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4" /> Open Full Project Page
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Project
            </button>

            <button
              type="button"
              onClick={() => toggleTeamVacancy(activeTeam.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm ${
                activeTeam.vacancyOpen
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {activeTeam.vacancyOpen ? (
                <>
                  <Unlock className="w-4 h-4" /> Vacancy Open ({spotsLeft} Spot{spotsLeft > 1 ? 's' : ''} Left)
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Vacancy Closed (Team Full)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400">Team Size Target</div>
            <div className="text-lg font-bold text-white mt-0.5">{activeTeam.teamSize} Members</div>
          </div>
          <div>
            <div className="text-slate-400">Current Roster</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">
              {activeTeam.members.length} Active
            </div>
          </div>
          <div>
            <div className="text-slate-400">Pending Applications</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">
              {pendingApps.length} Applicants
            </div>
          </div>
          <div>
            <div className="text-slate-400">Vacancy Status</div>
            <div
              className={`text-lg font-bold mt-0.5 ${
                activeTeam.vacancyOpen ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {activeTeam.vacancyOpen ? 'Open to Candidates' : 'Closed & Locked'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 gap-4 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'APPLICATIONS'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Candidate Applications ({teamApplications.length})
          {pendingApps.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              {pendingApps.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PROJECT_DETAILS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'PROJECT_DETAILS'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Project & Team Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MEMBERS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'MEMBERS'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Active Roster ({activeTeam.members.length}/{activeTeam.teamSize})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('GROUP_CHAT')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'GROUP_CHAT'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Team Group Chatroom
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PRIVATE_VAULT')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'PRIVATE_VAULT'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4 text-emerald-600" />
          My Private Account & Activity ({myPrivateActivities.length})
        </button>
      </div>

      {/* Tab 1: Candidate Applications Review & Instant 1-on-1 Chat */}
      {activeTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Review applicant verification tests, resumes, and interview via dedicated 1-on-1 chat
              before approving.
            </span>
          </div>

          {teamApplications.length > 0 ? (
            <div className="space-y-4">
              {teamApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900">{app.studentName}</h3>
                        <span className="text-xs text-slate-500 font-mono">({app.studentEmail})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>Applied on: {app.appliedAt}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-600 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> {app.matchScore}% Compatibility
                        </span>
                        {app.assessmentScore !== undefined && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> C++ Verified Test: {app.assessmentScore}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Chat Action Button */}
                    <button
                      type="button"
                      onClick={() => onOpenChat(app.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Open 1-on-1 Chat
                    </button>
                  </div>

                  {/* Candidate statement & skills */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <p className="text-slate-700 leading-relaxed italic">"{app.message}"</p>
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500">Candidate Skills:</span>
                      {app.studentSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-white text-slate-700 font-medium text-[11px] border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Leader Decision Actions */}
                  {app.status === 'PENDING' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="text-xs text-slate-500">
                        Approving automatically adds {app.studentName} to the team and merges your 1-on-1 chat history into the team room.
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => rejectApplication(app.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => approveApplication(app.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-xs"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Approve & Add to Team
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No applications submitted yet for {activeTeam.title}. New students whose skills and interests match [{activeTeam.requiredSkills.join(', ')}] will see your project in their matched teams list!
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Project & Team Details Configuration */}
      {activeTab === 'PROJECT_DETAILS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Project & Team Requirements Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Specify all details needed in your team—project title, description, required skills, target team size, and deadline.
              </p>
            </div>
          </div>

          {saveNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {saveNotice}
            </div>
          )}

          <form onSubmit={handleSaveProjectDetails} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project / Team Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Detailed Project Description & Deliverables
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Skills Needed in the Team (Click to Toggle)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.map((sk) => {
                  const active = editSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() =>
                        setEditSkills(
                          active
                            ? editSkills.length > 1
                              ? editSkills.filter((x) => x !== sk)
                              : editSkills
                            : [...editSkills, sk]
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Team Size (Total Members)
                </label>
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={editSize}
                  onChange={(e) => setEditSize(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Project Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
              >
                Save Team & Project Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Active Roster & Leader Member Removal Authority */}
      {activeTab === 'MEMBERS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Current Team Members</h3>
              <p className="text-xs text-slate-500">
                As the Team Leader, you have the full authority to manage and remove members if needed.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {activeTeam.members.length} of {activeTeam.teamSize} Slots Filled
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {activeTeam.members.map((member) => (
              <div
                key={member.id}
                className="py-3.5 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar name={member.name} avatar={member.avatar} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{member.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          member.role === 'Leader'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono">{member.email}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.2 rounded bg-slate-50 text-slate-600 text-[10px] border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Leader Authority to Remove Member */}
                {member.role !== 'Leader' ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeMemberFromTeam(activeTeam.id, member.id);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    <UserX className="w-3.5 h-3.5" /> Remove from Team
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">Team Lead</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Team Group Chatroom (Includes Transferred History) */}
      {activeTab === 'GROUP_CHAT' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                {activeTeam.title} • Official Team Room
              </div>
              <div className="text-[11px] text-slate-500">
                All team members + transferred approved candidate discussions
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Room
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
            {groupMessages.map((msg) => {
              const isMe = currentUserProfile ? msg.senderId === currentUserProfile.id : false;

              if (msg.isSystemNotice) {
                return (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-center text-xs text-indigo-900 font-medium"
                  >
                    {msg.content}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                    {msg.senderName} ({msg.senderRole}) • {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSendGroupMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={teamChatInput}
              onChange={(e) => setTeamChatInput(e.target.value)}
              placeholder="Broadcast a message to all team members..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Team Leader's Private Account Data & Activity History */}
      {activeTab === 'PRIVATE_VAULT' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Team Leader Stored Account Data & Private Activity Log
                </h3>
                <p className="text-xs text-slate-500">
                  Every project you create and activity you perform is stored and visible{' '}
                  <strong className="text-slate-900">
                    ONLY to you ({currentUserProfile?.name || activeTeam.leaderName}) and the Website Admin (adminsm$4146)
                  </strong>
                  .
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Owner + Admin Visibility Only
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Leader Account & Projects Summary
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Leader Name</span>
                <span className="font-bold text-slate-900">
                  {currentUserProfile?.name || activeTeam.leaderName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Leader Email</span>
                <span className="font-mono text-slate-800">
                  {currentUserProfile?.email || activeTeam.leaderEmail}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Projects Led by You</span>
                <div className="space-y-1 mt-1">
                  {(myLeadTeams.length > 0 ? myLeadTeams : [activeTeam]).map((t) => (
                    <div
                      key={t.id}
                      className="p-2 rounded bg-white border border-slate-200 font-semibold text-slate-800"
                    >
                      {t.title} ({t.members.length}/{t.teamSize} members)
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                Your Private Activity Log ({myPrivateActivities.length})
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {myPrivateActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 font-bold text-[10px] shrink-0">
                        {act.type}
                      </span>
                      <span className="text-slate-700">{act.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Create Additional New Project */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-900 to-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Rocket className="w-5 h-5 text-violet-300" />
                <h3 className="text-base font-black">Create New Project & Team</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewProject} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Real-Time C++ Compiler Engine"
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Project Description & Goals *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the project architecture, deliverables, and member responsibilities..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skills Needed in Team *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_SKILLS.map((sk) => {
                    const active = newProjSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() =>
                          setNewProjSkills(
                            active
                              ? newProjSkills.length > 1
                                ? newProjSkills.filter((x) => x !== sk)
                                : newProjSkills
                              : [...newProjSkills, sk]
                          )
                        }
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                          active
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sk}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom required skill..."
                    value={customNewSkill}
                    onChange={(e) => setCustomNewSkill(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        customNewSkill.trim() &&
                        !newProjSkills.includes(customNewSkill.trim())
                      ) {
                        setNewProjSkills([...newProjSkills, customNewSkill.trim()]);
                        setCustomNewSkill('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Team Size</label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={newProjSize}
                    onChange={(e) => setNewProjSize(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={newProjDeadline}
                    onChange={(e) => setNewProjDeadline(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={newProjTags}
                    onChange={(e) => setNewProjTags(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
