import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StudentProfile,
  Team,
  TeamApplication,
  ApplicationChatThread,
  ReportItem,
  ActivityLog,
  AssessmentSubmission,
  ChatMessage,
  SiteSettings,
} from '../lib/types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEAMS,
  INITIAL_APPLICATIONS,
  INITIAL_CHAT_THREADS,
  INITIAL_REPORTS,
  INITIAL_ACTIVITIES,
  INITIAL_SUBMISSIONS,
} from '../lib/initialData';
import { MatchingEngine, defaultSkillGraph } from '../lib/graphEngine';
import { verifyAdminCredentials, ensureAllTeamMembersInStudents } from '../lib/portalAuthEngine';

export type UserRole = 'STUDENT' | 'TEAM_LEADER' | 'ADMIN';

export interface NewProjectPayload {
  title: string;
  department: string;
  category: string;
  description: string;
  requiredSkills: string[];
  teamSize: number;
  deadline: string;
  tags: string[];
}

export interface AppNotification {
  id: string;
  type: 'APPLICATION' | 'APPROVAL' | 'REJECTION' | 'CHAT' | 'REPORT' | 'VACANCY';
  title: string;
  message: string;
  timestamp: string;
  actionPayload?: {
    teamId?: string;
    applicationId?: string;
  };
  read: boolean;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  currentUserProfile: StudentProfile | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  logoutUser: () => void;
  loginUserAccount: (
    emailOrId: string,
    password?: string,
    targetRole?: 'STUDENT' | 'TEAM_LEADER'
  ) => StudentProfile | null;
  createLeaderAndProject: (
    leaderData: Omit<StudentProfile, 'id' | 'certificates' | 'blockedUsers' | 'isBanned'> & {
      password?: string;
    },
    projectData: NewProjectPayload
  ) => { leader: StudentProfile; team: Team };
  createProjectForCurrentLeader: (projectData: NewProjectPayload) => Team | null;
  updateTeamProjectDetails: (
    teamId: string,
    updates: Partial<NewProjectPayload>
  ) => void;
  students: StudentProfile[];
  teams: Team[];
  applications: TeamApplication[];
  chatThreads: Record<string, ApplicationChatThread>;
  teamChatThreads: Record<string, ChatMessage[]>;
  reports: ReportItem[];
  activityLogs: ActivityLog[];
  assessmentSubmissions: AssessmentSubmission[];
  notifications: AppNotification[];
  activeNotificationPopup: AppNotification | null;
  clearNotificationPopup: () => void;

  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  escalateReport: (reportId: string) => void;
  unblockUser: (targetUserId: string) => void;
  registerStudent: (student: Omit<StudentProfile, 'id' | 'certificates' | 'blockedUsers' | 'isBanned'> & { password?: string }) => StudentProfile;
  updateStudentProfile: (profile: StudentProfile) => void;
  applyToTeam: (teamId: string, message: string) => boolean;
  approveApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
  removeMemberFromTeam: (teamId: string, memberId: string) => void;
  toggleTeamVacancy: (teamId: string, open?: boolean) => void;
  sendChatMessage: (applicationId: string, content: string) => void;
  sendTeamChatMessage: (teamId: string, content: string) => void;
  submitAssessment: (submission: Omit<AssessmentSubmission, 'id' | 'submittedAt'>) => AssessmentSubmission;
  fileReport: (reportedUserId: string, reportedUserName: string, reason: string, details: string) => void;
  blockUser: (targetUserId: string) => void;
  adminDeleteUser: (userId: string) => void;
  adminResolveReport: (reportId: string, action: 'WARN' | 'BAN_DELETE' | 'DISMISS') => void;
  adminUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  adminDeleteTeam: (teamId: string) => void;
  adminAddMemberToTeam: (teamId: string, studentId: string, role?: 'Leader' | 'Member') => boolean;
  adminPromoteTeamLeader: (teamId: string, newLeaderId: string) => void;
  adminUpdateStudent: (studentId: string, updates: Partial<StudentProfile>) => void;
  adminSendTeamDirective: (teamId: string, content: string) => void;
  adminDeleteTeamChatMessage: (teamId: string, messageId: string) => void;
  addActivity: (
    type: ActivityLog['type'],
    description: string,
    actor: string,
    actorId?: string,
    actorEmail?: string
  ) => void;
  switchUser: (role: UserRole, userId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'skillmatch_students_v5',
  TEAMS: 'skillmatch_teams_v5',
  APPLICATIONS: 'skillmatch_applications_v2',
  CHATS: 'skillmatch_chats_v2',
  TEAM_CHATS: 'skillmatch_team_chats_v2',
  REPORTS: 'skillmatch_reports_v2',
  LOGS: 'skillmatch_logs_v2',
  SUBMISSIONS: 'skillmatch_submissions_v2',
  ADMIN_AUTH: 'skillmatch_admin_auth_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user state (empty by default so no student session is shown on the opening page)
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  // Core entities loaded from localStorage or seeded, guaranteed to contain all team leaders & members
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const rawStudents: StudentProfile[] = saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    const savedTeams = localStorage.getItem(STORAGE_KEYS.TEAMS);
    const rawTeams: Team[] = savedTeams ? JSON.parse(savedTeams) : INITIAL_TEAMS;
    return ensureAllTeamMembersInStudents(rawStudents, rawTeams);
  });

  const [applications, setApplications] = useState<TeamApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [chatThreads, setChatThreads] = useState<Record<string, ApplicationChatThread>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_THREADS;
  });

  const [teamChatThreads, setTeamChatThreads] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAM_CHATS);
    return saved
      ? JSON.parse(saved)
      : {
          'team-sigma': [
            {
              id: 'team-msg-init',
              senderId: 'student-shreya',
              senderName: 'Shreya Yadav (Team Lead)',
              senderRole: 'Team Leader',
              content: 'Welcome to Team Sigma project group chat! All approved candidate discussions and deliverables will sync here.',
              timestamp: '10:00 AM',
            },
          ],
        };
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [assessmentSubmissions, setAssessmentSubmissions] = useState<AssessmentSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'APPLICATION',
      title: 'New Team Application',
      message: 'Shishir Dwivedi applied to Team Sigma (Match: 98%, Verified C++ score: 95%).',
      timestamp: 'Just now',
      actionPayload: { teamId: 'team-sigma', applicationId: 'app-sigma-shishir' },
      read: false,
    },
  ]);

  const [activeNotificationPopup, setActiveNotificationPopup] = useState<AppNotification | null>(null);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('skillmatch_settings_v1');
    return saved
      ? JSON.parse(saved)
      : {
          maintenanceMode: false,
          eligibilityThreshold: 70,
          allowNewRegistrations: true,
          allowPublicApplications: true,
          announcementBanner: 'Graphic Era University Spring 2026 Academic Project Matchmaking Active',
        };
  });

  useEffect(() => {
    localStorage.setItem('skillmatch_settings_v1', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM_CHATS, JSON.stringify(teamChatThreads));
  }, [teamChatThreads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(assessmentSubmissions));
  }, [assessmentSubmissions]);

  const currentUserProfile = students.find((s) => s.id === currentUserId) || null;

  const addActivity = (
    type: ActivityLog['type'],
    description: string,
    actor: string,
    actorId?: string,
    actorEmail?: string
  ) => {
    const formattedTime =
      new Date().toLocaleDateString() +
      ' ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      description,
      actor,
      actorId: actorId || currentUserProfile?.id || currentUserId,
      actorEmail: actorEmail || currentUserProfile?.email,
      timestamp: formattedTime,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const loginAdmin = (username: string, password: string): boolean => {
    const valid = verifyAdminCredentials(username, password);
    if (valid) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      setRole('ADMIN');
      setCurrentUserId('admin-system');
      addActivity(
        'LOGIN',
        `Supreme Admin (${username.trim()}) authenticated and accessed website control center.`,
        username.trim(),
        'admin-system',
        'admin@skillmatch.geu.ac.in'
      );
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setRole('STUDENT');
    setCurrentUserId('');
  };

  const logoutUser = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setRole('STUDENT');
    setCurrentUserId('');
  };

  const loginUserAccount = (
    emailOrId: string,
    password?: string,
    targetRole: 'STUDENT' | 'TEAM_LEADER' = 'STUDENT'
  ): StudentProfile | null => {
    const clean = emailOrId.trim().toLowerCase();
    const matched = students.find(
      (s) =>
        s.email.toLowerCase() === clean ||
        s.studentIdNum.toLowerCase() === clean ||
        s.id.toLowerCase() === clean
    );
    if (!matched) return null;
    if (matched.password && password && matched.password !== password) {
      return null;
    }
    setCurrentUserId(matched.id);
    setRole(targetRole);
    addActivity(
      'LOGIN',
      `${matched.name} signed in to the ${targetRole === 'TEAM_LEADER' ? 'Team Leader' : 'Team Member'} portal.`,
      matched.name,
      matched.id,
      matched.email
    );
    return matched;
  };

  const registerStudent = (
    data: Omit<StudentProfile, 'id' | 'certificates' | 'blockedUsers' | 'isBanned'> & { password?: string }
  ): StudentProfile => {
    const newId = `student-${Date.now()}`;
    const nowStr =
      new Date().toLocaleDateString() +
      ' ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newStudent: StudentProfile = {
      ...data,
      id: newId,
      accountType: data.accountType || 'TEAM_MEMBER',
      createdAt: nowStr,
      certificates: [],
      blockedUsers: [],
      isBanned: false,
      assessmentStatus: {
        cppVerified: false,
        cVerified: false,
        score: 0,
        verdict: 'NOT_ATTEMPTED',
        cheatFlags: 0,
      },
    };

    setStudents((prev) => [newStudent, ...prev]);
    setCurrentUserId(newId);
    setRole('STUDENT');

    addActivity(
      'REGISTRATION',
      `New Team Member account created for ${newStudent.name} (${newStudent.department}). Matched with teams for skills: [${newStudent.skills.join(', ')}] & interests: [${newStudent.interests.join(', ')}].`,
      newStudent.name,
      newId,
      newStudent.email
    );

    return newStudent;
  };

  const createLeaderAndProject = (
    leaderData: Omit<StudentProfile, 'id' | 'certificates' | 'blockedUsers' | 'isBanned'> & {
      password?: string;
    },
    projectData: NewProjectPayload
  ): { leader: StudentProfile; team: Team } => {
    const nowStr =
      new Date().toLocaleDateString() +
      ' ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const leaderId = `leader-${Date.now()}`;
    const newLeader: StudentProfile = {
      ...leaderData,
      id: leaderId,
      accountType: 'TEAM_LEADER',
      createdAt: nowStr,
      certificates: [],
      blockedUsers: [],
      isBanned: false,
      assessmentStatus: {
        cppVerified: true,
        cVerified: true,
        score: 92,
        verdict: 'VERIFIED_ELIGIBLE',
        cheatFlags: 0,
        completedAt: nowStr,
      },
    };

    const teamId = `team-proj-${Date.now()}`;
    const gradients = [
      'from-indigo-600 via-violet-600 to-purple-700',
      'from-emerald-600 via-teal-600 to-cyan-700',
      'from-blue-600 via-indigo-600 to-slate-800',
      'from-amber-600 via-orange-600 to-rose-700',
    ];
    const newTeam: Team = {
      id: teamId,
      title: projectData.title.trim(),
      department: projectData.department,
      category: projectData.category,
      description: projectData.description.trim(),
      requiredSkills:
        projectData.requiredSkills.length > 0 ? projectData.requiredSkills : ['C++', 'Algorithms'],
      teamSize: Math.max(2, Number(projectData.teamSize) || 4),
      leaderId: newLeader.id,
      leaderName: newLeader.name,
      leaderEmail: newLeader.email,
      members: [
        {
          id: newLeader.id,
          name: newLeader.name,
          email: newLeader.email,
          role: 'Leader',
          skills: newLeader.skills,
          avatar: newLeader.avatar || '🚀',
        },
      ],
      vacancyOpen: true,
      deadline: projectData.deadline || '2026-12-30',
      tags: projectData.tags.length > 0 ? projectData.tags : [projectData.category, 'C++'],
      bannerGradient: gradients[Math.floor(Math.random() * gradients.length)],
      createdAt: nowStr,
    };

    setStudents((prev) => [newLeader, ...prev]);
    setTeams((prev) => [newTeam, ...prev]);
    setTeamChatThreads((prev) => ({
      ...prev,
      [teamId]: [
        {
          id: `team-msg-init-${Date.now()}`,
          senderId: newLeader.id,
          senderName: `${newLeader.name} (Team Lead)`,
          senderRole: 'Team Leader',
          content: `Welcome to the official project room for "${newTeam.title}"! Required skills: ${newTeam.requiredSkills.join(', ')}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));

    setCurrentUserId(newLeader.id);
    setRole('TEAM_LEADER');

    // Log both account creation and project creation under leaderId
    const regLog: ActivityLog = {
      id: `act-reg-${Date.now()}`,
      type: 'REGISTRATION',
      description: `New Team Leader account created by ${newLeader.name} (${newLeader.email}).`,
      actor: newLeader.name,
      actorId: newLeader.id,
      actorEmail: newLeader.email,
      timestamp: nowStr,
    };
    const projLog: ActivityLog = {
      id: `act-proj-${Date.now() + 1}`,
      type: 'PROJECT_CREATED',
      description: `Team Leader ${newLeader.name} created new project "${newTeam.title}" (${newTeam.category}) requiring [${newTeam.requiredSkills.join(', ')}] with ${newTeam.teamSize} total slots.`,
      actor: newLeader.name,
      actorId: newLeader.id,
      actorEmail: newLeader.email,
      timestamp: nowStr,
    };
    setActivityLogs((prev) => [projLog, regLog, ...prev]);

    return { leader: newLeader, team: newTeam };
  };

  const createProjectForCurrentLeader = (projectData: NewProjectPayload): Team | null => {
    const leader = currentUserProfile;
    if (!leader) return null;

    const nowStr =
      new Date().toLocaleDateString() +
      ' ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const teamId = `team-proj-${Date.now()}`;
    const newTeam: Team = {
      id: teamId,
      title: projectData.title.trim(),
      department: projectData.department || leader.department,
      category: projectData.category,
      description: projectData.description.trim(),
      requiredSkills:
        projectData.requiredSkills.length > 0 ? projectData.requiredSkills : ['C++', 'Algorithms'],
      teamSize: Math.max(2, Number(projectData.teamSize) || 4),
      leaderId: leader.id,
      leaderName: leader.name,
      leaderEmail: leader.email,
      members: [
        {
          id: leader.id,
          name: leader.name,
          email: leader.email,
          role: 'Leader',
          skills: leader.skills,
          avatar: leader.avatar || '🚀',
        },
      ],
      vacancyOpen: true,
      deadline: projectData.deadline || '2026-12-30',
      tags: projectData.tags.length > 0 ? projectData.tags : [projectData.category],
      bannerGradient: 'from-indigo-600 via-violet-600 to-purple-700',
      createdAt: nowStr,
    };

    setTeams((prev) => [newTeam, ...prev]);
    setTeamChatThreads((prev) => ({
      ...prev,
      [teamId]: [
        {
          id: `team-msg-init-${Date.now()}`,
          senderId: leader.id,
          senderName: `${leader.name} (Team Lead)`,
          senderRole: 'Team Leader',
          content: `Project room initialized for "${newTeam.title}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));

    addActivity(
      'PROJECT_CREATED',
      `Team Leader ${leader.name} launched new project "${newTeam.title}" requiring [${newTeam.requiredSkills.join(', ')}] (${newTeam.teamSize} slots).`,
      leader.name,
      leader.id,
      leader.email
    );

    return newTeam;
  };

  const updateTeamProjectDetails = (teamId: string, updates: Partial<NewProjectPayload>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
    if (currentUserProfile) {
      addActivity(
        'PROFILE_UPDATE',
        `Team Leader ${currentUserProfile.name} updated project details & requirements for ${updates.title || teamId}.`,
        currentUserProfile.name,
        currentUserProfile.id,
        currentUserProfile.email
      );
    }
  };

  const updateStudentProfile = (updated: StudentProfile) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    addActivity('PROFILE_UPDATE', `Profile updated for ${updated.name}`, updated.name, updated.id, updated.email);
  };

  const applyToTeam = (teamId: string, message: string): boolean => {
    const team = teams.find((t) => t.id === teamId);
    const student = currentUserProfile;
    if (!team || !student) return false;

    if (!team.vacancyOpen || team.members.length >= team.teamSize) {
      return false;
    }

    const matchCalc = MatchingEngine.calculateDetailedScore(student.skills, team.requiredSkills, defaultSkillGraph);

    const newAppId = `app-${Date.now()}`;
    const newApp: TeamApplication = {
      id: newAppId,
      teamId: team.id,
      teamTitle: team.title,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentSkills: student.skills,
      status: 'PENDING',
      appliedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message,
      matchScore: matchCalc.score,
      assessmentScore: student.assessmentStatus?.score,
      assessmentVerdict: student.assessmentStatus?.verdict,
    };

    setApplications((prev) => [newApp, ...prev]);

    // Create 1-on-1 application chat thread
    const newThread: ApplicationChatThread = {
      applicationId: newAppId,
      teamId: team.id,
      studentId: student.id,
      transferredToTeamChat: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: student.id,
          senderName: student.name,
          senderRole: 'Applicant',
          content: message || `Hello! I would love to join ${team.title}. My compatibility score is ${matchCalc.score}%.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setChatThreads((prev) => ({
      ...prev,
      [newAppId]: newThread,
    }));

    // Trigger popup for team leader!
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'APPLICATION',
      title: `New Applicant for ${team.title}`,
      message: `${student.name} applied with ${matchCalc.score}% match score! A dedicated chat is open.`,
      timestamp: 'Just now',
      actionPayload: { teamId: team.id, applicationId: newAppId },
      read: false,
    };

    setNotifications((prev) => [notif, ...prev]);
    setActiveNotificationPopup(notif);

    addActivity('APPLICATION', `${student.name} applied for invitation to ${team.title}.`, student.name);

    return true;
  };

  const approveApplication = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app || app.status !== 'PENDING') return;

    const team = teams.find((t) => t.id === app.teamId);
    const applicant = students.find((s) => s.id === app.studentId);
    if (!team || !applicant) return;

    // 1. Mark application as APPROVED
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'APPROVED' } : a))
    );

    // 2. Add applicant to team members
    const newMember = {
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      role: 'Member' as const,
      skills: applicant.skills,
      avatar: applicant.avatar,
    };

    const updatedMembers = [...team.members, newMember];
    const isNowFull = updatedMembers.length >= team.teamSize;

    setTeams((prev) =>
      prev.map((t) =>
        t.id === team.id
          ? {
              ...t,
              members: updatedMembers,
              vacancyOpen: isNowFull ? false : t.vacancyOpen,
            }
          : t
      )
    );

    // 3. TRANSFER CHAT: Move 1-on-1 chat history directly into the Team Chatbox!
    const applicantThread = chatThreads[applicationId];
    const transferredMessages = applicantThread ? applicantThread.messages : [];

    const approvalNotice: ChatMessage = {
      id: `sys-approve-${Date.now()}`,
      senderId: 'system',
      senderName: 'SkillMatch System',
      senderRole: 'System',
      content: `🎉 ${applicant.name} was officially APPROVED and joined ${team.title}! Previous applicant conversation has been merged into this team room.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemNotice: true,
    };

    setTeamChatThreads((prev) => {
      const existingTeamChat = prev[team.id] || [];
      return {
        ...prev,
        [team.id]: [...existingTeamChat, approvalNotice, ...transferredMessages],
      };
    });

    setChatThreads((prev) => {
      if (!prev[applicationId]) return prev;
      return {
        ...prev,
        [applicationId]: {
          ...prev[applicationId],
          transferredToTeamChat: true,
        },
      };
    });

    addActivity('APPROVAL', `${team.leaderName} approved ${applicant.name} to join ${team.title}.`, team.leaderName);
  };

  const rejectApplication = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'REJECTED' } : a))
    );

    addActivity('REJECTION', `Application for ${app.studentName} was declined.`, 'Team Leader');
  };

  const removeMemberFromTeam = (teamId: string, memberId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const filtered = t.members.filter((m) => m.id !== memberId);
          return {
            ...t,
            members: filtered,
            vacancyOpen: true, // open vacancy back up
          };
        }
        return t;
      })
    );

    addActivity('MODERATION', `A member was removed from ${teamId} by team leader.`, 'Team Leader');
  };

  const toggleTeamVacancy = (teamId: string, open?: boolean) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const newStatus = open !== undefined ? open : !t.vacancyOpen;
          return { ...t, vacancyOpen: newStatus };
        }
        return t;
      })
    );

    addActivity('VACANCY_TOGGLE', `Vacancy status updated for team ${teamId}`, 'Team Leader');
  };

  const sendChatMessage = (applicationId: string, content: string) => {
    const sender = currentUserProfile;
    if (!sender || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: role === 'TEAM_LEADER' ? 'Team Leader' : 'Applicant',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatThreads((prev) => {
      const thread = prev[applicationId];
      if (!thread) return prev;
      return {
        ...prev,
        [applicationId]: {
          ...thread,
          messages: [...thread.messages, newMessage],
        },
      };
    });
  };

  const sendTeamChatMessage = (teamId: string, content: string) => {
    const sender = currentUserProfile;
    if (!sender || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: `team-msg-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: role === 'TEAM_LEADER' ? 'Team Leader' : 'Member',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTeamChatThreads((prev) => ({
      ...prev,
      [teamId]: [...(prev[teamId] || []), newMessage],
    }));
  };

  const submitAssessment = (submission: Omit<AssessmentSubmission, 'id' | 'submittedAt'>): AssessmentSubmission => {
    const newSubmission: AssessmentSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAssessmentSubmissions((prev) => [newSubmission, ...prev]);

    // Update student's assessmentStatus
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === submission.candidateId) {
          return {
            ...s,
            assessmentStatus: {
              cppVerified: submission.language === 'cpp' && submission.verdict === 'VERIFIED_ELIGIBLE',
              cVerified: submission.language === 'c' && submission.verdict === 'VERIFIED_ELIGIBLE',
              score: submission.score,
              verdict: submission.verdict,
              cheatFlags: submission.tabSwitchCount + submission.copyPasteCount,
              completedAt: newSubmission.submittedAt,
              feedbackSummary: submission.personalizedFeedback,
            },
          };
        }
        return s;
      })
    );

    addActivity(
      'ASSESSMENT',
      `${submission.candidateName} completed ${submission.language.toUpperCase()} Assessment (${submission.score}%, ${submission.verdict}).`,
      submission.candidateName
    );

    return newSubmission;
  };

  const fileReport = (reportedUserId: string, reportedUserName: string, reason: string, details: string) => {
    const reporter = currentUserProfile;
    if (!reporter) return;

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reportedUserId,
      reportedUserName,
      reporterId: reporter.id,
      reporterName: reporter.name,
      reporterEmail: reporter.email,
      reason,
      details,
      status: 'PENDING',
      createdAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setReports((prev) => [newReport, ...prev]);

    addActivity('REPORT', `Report filed against ${reportedUserName} for "${reason}".`, reporter.name);
  };

  const blockUser = (targetUserId: string) => {
    if (!currentUserProfile) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentUserProfile.id) {
          const existing = s.blockedUsers || [];
          return { ...s, blockedUsers: Array.from(new Set([...existing, targetUserId])) };
        }
        return s;
      })
    );
  };

  const unblockUser = (targetUserId: string) => {
    if (!currentUserProfile) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentUserProfile.id) {
          return {
            ...s,
            blockedUsers: (s.blockedUsers || []).filter((id) => id !== targetUserId),
          };
        }
        return s;
      })
    );
  };

  const escalateReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              isEscalated: true,
              escalatedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : r
      )
    );
    addActivity('REPORT', `Report #${reportId} was escalated to Senior University Disciplinary Board.`, 'Complainant');
  };

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    addActivity('MODERATION', 'Administrator updated site-wide system settings', 'Administrator');
  };

  const adminDeleteUser = (userId: string) => {
    const target = students.find((s) => s.id === userId);
    const targetName = target ? target.name : userId;

    // Purge student
    setStudents((prev) => prev.filter((s) => s.id !== userId));

    // Remove from any teams
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        members: t.members.filter((m) => m.id !== userId),
      }))
    );

    // Resolve reports about this user
    setReports((prev) =>
      prev.map((r) => (r.reportedUserId === userId ? { ...r, status: 'RESOLVED_BANNED', adminNotes: 'Profile deleted by Admin.' } : r))
    );

    addActivity('MODERATION', `Admin permanently removed user profile: ${targetName}.`, 'Administrator');
  };

  const adminResolveReport = (reportId: string, action: 'WARN' | 'BAN_DELETE' | 'DISMISS') => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    if (action === 'BAN_DELETE') {
      adminDeleteUser(report.reportedUserId);
    } else {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: action === 'WARN' ? 'RESOLVED_WARNED' : 'DISMISSED',
                adminNotes: action === 'WARN' ? 'Warning issued to candidate' : 'Reviewed and dismissed',
              }
            : r
        )
      );
    }

    addActivity('MODERATION', `Admin resolved report #${reportId} (${action}).`, 'Administrator');
  };

  const adminUpdateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
    addActivity(
      'MODERATION',
      `Admin updated configuration/details for team ${updates.title || teamId}.`,
      'Supreme Admin',
      'admin-system',
      'admin@skillmatch.geu.ac.in'
    );
  };

  const adminDeleteTeam = (teamId: string) => {
    const target = teams.find((t) => t.id === teamId);
    const title = target ? target.title : teamId;
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    setApplications((prev) => prev.filter((a) => a.teamId !== teamId));
    addActivity(
      'MODERATION',
      `Admin dissolved and permanently deleted project team "${title}" (${teamId}).`,
      'Supreme Admin',
      'admin-system',
      'admin@skillmatch.geu.ac.in'
    );
  };

  const adminAddMemberToTeam = (
    teamId: string,
    studentId: string,
    memberRole: 'Leader' | 'Member' = 'Member'
  ): boolean => {
    const student = students.find((s) => s.id === studentId);
    const team = teams.find((t) => t.id === teamId);
    if (!student || !team) return false;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const alreadyIn = t.members.some((m) => m.id === student.id);
        let updatedMembers = alreadyIn
          ? t.members.map((m) => (m.id === student.id ? { ...m, role: memberRole } : m))
          : [
              ...t.members,
              {
                id: student.id,
                name: student.name,
                email: student.email,
                role: memberRole,
                skills: student.skills.slice(0, 4),
                avatar: student.avatar || '👨‍💻',
              },
            ];
        if (memberRole === 'Leader') {
          updatedMembers = updatedMembers.map((m) =>
            m.id === student.id ? { ...m, role: 'Leader' } : { ...m, role: 'Member' }
          );
        }
        const nextCapacity = Math.max(t.teamSize, updatedMembers.length);
        return {
          ...t,
          members: updatedMembers,
          teamSize: nextCapacity,
          ...(memberRole === 'Leader'
            ? {
                leaderId: student.id,
                leaderName: student.name,
                leaderEmail: student.email,
              }
            : {}),
        };
      })
    );

    if (memberRole === 'Leader') {
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, accountType: 'TEAM_LEADER' } : s))
      );
    }

    addActivity(
      'MODERATION',
      `Admin added ${student.name} (${student.email}) to "${team.title}" as ${memberRole}.`,
      'Supreme Admin',
      'admin-system',
      'admin@skillmatch.geu.ac.in'
    );
    return true;
  };

  const adminPromoteTeamLeader = (teamId: string, newLeaderId: string) => {
    const student = students.find((s) => s.id === newLeaderId);
    const team = teams.find((t) => t.id === teamId);
    if (!student || !team) return;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const hasMember = t.members.some((m) => m.id === student.id);
        const nextMembers = (hasMember
          ? t.members
          : [
              {
                id: student.id,
                name: student.name,
                email: student.email,
                role: 'Leader' as const,
                skills: student.skills.slice(0, 4),
                avatar: student.avatar || '🚀',
              },
              ...t.members,
            ]
        ).map((m) => ({
          ...m,
          role: (m.id === student.id ? 'Leader' : 'Member') as 'Leader' | 'Member',
        }));

        return {
          ...t,
          leaderId: student.id,
          leaderName: student.name,
          leaderEmail: student.email,
          members: nextMembers,
          teamSize: Math.max(t.teamSize, nextMembers.length),
        };
      })
    );

    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, accountType: 'TEAM_LEADER' } : s))
    );

    addActivity(
      'MODERATION',
      `Admin reassigned Team Leader of "${team.title}" to ${student.name} (${student.email}).`,
      'Supreme Admin',
      'admin-system',
      'admin@skillmatch.geu.ac.in'
    );
  };

  const adminUpdateStudent = (studentId: string, updates: Partial<StudentProfile>) => {
    const target = students.find((s) => s.id === studentId);
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
    if (updates.name || updates.email) {
      setTeams((prev) =>
        prev.map((t) => ({
          ...t,
          leaderName: t.leaderId === studentId && updates.name ? updates.name : t.leaderName,
          leaderEmail: t.leaderId === studentId && updates.email ? updates.email : t.leaderEmail,
          members: t.members.map((m) =>
            m.id === studentId
              ? {
                  ...m,
                  name: updates.name || m.name,
                  email: updates.email || m.email,
                  skills: updates.skills || m.skills,
                }
              : m
          ),
        }))
      );
    }
    addActivity(
      'MODERATION',
      `Admin modified account/credentials for ${target?.name || studentId}.`,
      'Supreme Admin',
      'admin-system',
      'admin@skillmatch.geu.ac.in'
    );
  };

  const adminSendTeamDirective = (teamId: string, content: string) => {
    if (!content.trim()) return;
    const team = teams.find((t) => t.id === teamId);
    const msg: ChatMessage = {
      id: `admin-dir-${Date.now()}`,
      senderId: 'admin-system',
      senderName: 'Supreme Admin (Platform Authority)',
      senderRole: 'ADMIN DIRECTIVE',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemNotice: true,
    };
    setTeamChatThreads((prev) => ({
      ...prev,
      [teamId]: [...(prev[teamId] || []), msg],
    }));
    addActivity(
      'MODERATION',
      `Admin broadcasted official directive to "${team?.title || teamId}": "${content.trim()}"`,
      'Supreme Admin',
      'admin-system',
      'admin@skillmatch.geu.ac.in'
    );
  };

  const adminDeleteTeamChatMessage = (teamId: string, messageId: string) => {
    setTeamChatThreads((prev) => ({
      ...prev,
      [teamId]: (prev[teamId] || []).filter((m) => m.id !== messageId),
    }));
    addActivity(
      'MODERATION',
      `Admin removed chat message (${messageId}) from team ${teamId}.`,
      'Supreme Admin',
      'admin-system',
      'admin@skillmatch.geu.ac.in'
    );
  };

  const clearNotificationPopup = () => {
    setActiveNotificationPopup(null);
  };

  const switchUser = (newRole: UserRole, targetId?: string) => {
    setRole(newRole);
    if (newRole === 'ADMIN') {
      setCurrentUserId('admin-system');
    } else if (newRole === 'TEAM_LEADER') {
      setCurrentUserId(targetId || 'student-shreya');
    } else {
      setCurrentUserId(targetId || 'student-shishir');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUserId,
        setCurrentUserId,
        currentUserProfile,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        logoutUser,
        loginUserAccount,
        createLeaderAndProject,
        createProjectForCurrentLeader,
        updateTeamProjectDetails,
        students,
        teams,
        applications,
        chatThreads,
        teamChatThreads,
        reports,
        activityLogs,
        assessmentSubmissions,
        notifications,
        activeNotificationPopup,
        clearNotificationPopup,
        siteSettings,
        updateSiteSettings,
        escalateReport,
        unblockUser,
        registerStudent,
        updateStudentProfile,
        applyToTeam,
        approveApplication,
        rejectApplication,
        removeMemberFromTeam,
        toggleTeamVacancy,
        sendChatMessage,
        sendTeamChatMessage,
        submitAssessment,
        fileReport,
        blockUser,
        adminDeleteUser,
        adminResolveReport,
        adminUpdateTeam,
        adminDeleteTeam,
        adminAddMemberToTeam,
        adminPromoteTeamLeader,
        adminUpdateStudent,
        adminSendTeamDirective,
        adminDeleteTeamChatMessage,
        addActivity,
        switchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
