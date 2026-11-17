/**
 * Type definitions for SkillMatch platform
 */

export interface StudentProfile {
  id: string;
  studentIdNum: string; // e.g., 25101210684
  name: string;
  email: string;
  phone?: string;
  department: string;
  year: string;
  avatar: string;
  bio: string;
  skills: string[];
  interests: string[];
  availability: string; // e.g., "15 hrs/week (Evenings & Weekends)"
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  coverLetterFileName?: string;
  coverLetterText?: string;
  certificates: {
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }[];
  assessmentStatus?: {
    cppVerified: boolean;
    cVerified: boolean;
    score: number;
    verdict: 'VERIFIED_ELIGIBLE' | 'ELIGIBLE_WITH_CONDITIONS' | 'NOT_ELIGIBLE_UNVERIFIED' | 'NOT_ATTEMPTED';
    cheatFlags: number;
    completedAt?: string;
    feedbackSummary?: string;
  };
  blockedUsers?: string[]; // IDs of blocked users
  isBanned?: boolean;
  password?: string;
  accountType?: 'TEAM_MEMBER' | 'TEAM_LEADER';
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Leader' | 'Member';
  skills: string[];
  avatar: string;
}

export interface ProjectArchitectureModule {
  name: string;
  role: string;
  tech: string;
  description: string;
}

export interface ProjectMilestone {
  phase: string;
  title: string;
  timeline: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  deliverable: string;
}

export interface ProjectRoleAllocation {
  roleTitle: string;
  assignedTo: string;
  memberId?: string;
  status: 'FILLED' | 'OPEN_VACANCY';
  responsibilities: string;
  skills: string[];
}

export interface Team {
  id: string;
  title: string;
  department: string;
  category: string;
  description: string;
  deepDescription?: string[];
  problemStatement?: string;
  objectives?: string[];
  architectureModules?: ProjectArchitectureModule[];
  milestones?: ProjectMilestone[];
  techStackBreakdown?: { category: string; items: string[] }[];
  roleResponsibilities?: ProjectRoleAllocation[];
  expectedOutcomes?: string[];
  repositoryUrl?: string;
  documentationUrl?: string;
  academicCourseCode?: string;
  requiredSkills: string[]; // Supports OR syntax, e.g., "C|C++"
  teamSize: number;
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  members: TeamMember[];
  vacancyOpen: boolean;
  deadline: string;
  tags: string[];
  bannerGradient: string;
  createdAt: string;
}

export interface TeamApplication {
  id: string;
  teamId: string;
  teamTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentSkills: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  message: string;
  matchScore: number;
  assessmentScore?: number;
  assessmentVerdict?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isSystemNotice?: boolean;
}

export interface ApplicationChatThread {
  applicationId: string;
  teamId: string;
  studentId: string;
  messages: ChatMessage[];
  transferredToTeamChat?: boolean;
}

export interface ReportItem {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'RESOLVED_WARNED' | 'RESOLVED_BANNED' | 'DISMISSED';
  createdAt: string;
  adminNotes?: string;
  isEscalated?: boolean;
  escalatedAt?: string;
}

export interface SiteSettings {
  maintenanceMode: boolean;
  eligibilityThreshold: number; // e.g. 70
  allowNewRegistrations: boolean;
  allowPublicApplications: boolean;
  announcementBanner: string;
}

export interface ActivityLog {
  id: string;
  type:
    | 'REGISTRATION'
    | 'PROJECT_CREATED'
    | 'PROFILE_UPDATE'
    | 'LOGIN'
    | 'APPLICATION'
    | 'APPROVAL'
    | 'REJECTION'
    | 'ASSESSMENT'
    | 'REPORT'
    | 'VACANCY_TOGGLE'
    | 'MODERATION';
  description: string;
  actor: string;
  actorId?: string;
  actorEmail?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AssessmentSubmission {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  language: 'cpp' | 'c';
  challengeId: string;
  challengeTitle: string;
  submittedCode: string;
  syntaxValid: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  score: number; // 0 - 100
  timeSpentSeconds: number;
  tabSwitchCount: number;
  copyPasteCount: number;
  cheatSuspicion: 'LOW' | 'MEDIUM' | 'HIGH';
  timeComplexity: string;
  spaceComplexity: string;
  memorySafetyNotes: string[];
  verdict: 'VERIFIED_ELIGIBLE' | 'ELIGIBLE_WITH_CONDITIONS' | 'NOT_ELIGIBLE_UNVERIFIED';
  personalizedFeedback: string;
  submittedAt: string;
}
