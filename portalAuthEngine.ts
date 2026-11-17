import { ActivityLog, StudentProfile, Team, TeamApplication, TeamMember } from './types';
import { MatchingEngine, defaultSkillGraph } from './graphEngine';

export const ADMIN_USERNAME = 'adminsm$4146';
export const ADMIN_PASSWORD_EXACT = 'adminsrsad@414.';
export const ADMIN_PASSWORD_ALT = 'adminsrsad@414';

/**
 * Verifies the Supreme Admin credentials:
 * Username: adminsm$4146
 * Password: adminsrsad@414. (or adminsrsad@414)
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const cleanUser = username.trim();
  const cleanPass = password.trim();
  return (
    cleanUser === ADMIN_USERNAME &&
    (cleanPass === ADMIN_PASSWORD_EXACT || cleanPass === ADMIN_PASSWORD_ALT)
  );
}

/**
 * Enforces strict privacy visibility rule:
 * When a user creates an account in any option (Team Member or Team Leader),
 * their stored data and every activity is ONLY visible to:
 * 1. The person who created that account (viewerUserId === targetOwnerId)
 * 2. The authenticated Admin (viewerRole === 'ADMIN' && isAdminAuthenticated)
 */
export function canViewUserAccountAndActivity(params: {
  viewerRole: 'STUDENT' | 'TEAM_LEADER' | 'ADMIN';
  isAdminAuthenticated: boolean;
  viewerUserId: string;
  targetOwnerId: string;
}): boolean {
  const { viewerRole, isAdminAuthenticated, viewerUserId, targetOwnerId } = params;
  if (viewerRole === 'ADMIN' && isAdminAuthenticated) {
    return true;
  }
  if (!viewerUserId || !targetOwnerId) {
    return false;
  }
  return viewerUserId === targetOwnerId;
}

/**
 * Filters platform activity logs so a user ONLY sees their own activities,
 * whereas an authenticated Admin sees every activity across the website.
 */
export function getVisibleActivitiesForViewer(params: {
  logs: ActivityLog[];
  viewerRole: 'STUDENT' | 'TEAM_LEADER' | 'ADMIN';
  isAdminAuthenticated: boolean;
  viewerUserId: string;
  viewerName?: string;
}): ActivityLog[] {
  const { logs, viewerRole, isAdminAuthenticated, viewerUserId, viewerName } = params;
  if (viewerRole === 'ADMIN' && isAdminAuthenticated) {
    return logs;
  }
  if (!viewerUserId) return [];
  return logs.filter((log) => {
    if (log.actorId) {
      return log.actorId === viewerUserId;
    }
    if (viewerName && log.actor) {
      return log.actor.toLowerCase() === viewerName.toLowerCase();
    }
    return false;
  });
}

export interface MatchedTeamResult {
  team: Team;
  skillScore: number;
  interestMatchCount: number;
  matchedInterests: string[];
  combinedScore: number;
  exactMatches: string[];
  relatedMatches: { required: string; candidateHas: string; weight: number }[];
  missingSkills: string[];
}

/**
 * Matches teams for a registered student based on BOTH their skills (C++ Graph Engine)
 * AND their interests / domain tags.
 */
export function matchTeamsBySkillAndInterest(
  student: Pick<StudentProfile, 'skills' | 'interests' | 'department'>,
  teams: Team[],
  onlyOpenVacancies = true
): MatchedTeamResult[] {
  const normalizedInterests = (student.interests || [])
    .map((i) => i.trim().toLowerCase())
    .filter(Boolean);
  const normalizedSkills = (student.skills || [])
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return teams
    .filter((team) => !onlyOpenVacancies || (team.vacancyOpen && team.members.length < team.teamSize))
    .map((team) => {
      const detailed = MatchingEngine.calculateDetailedScore(
        student.skills || [],
        team.requiredSkills || [],
        defaultSkillGraph
      );

      const searchableTeamTokens = [
        team.category,
        team.department,
        team.title,
        team.description,
        ...(team.tags || []),
        ...(team.requiredSkills || []),
      ]
        .join(' ')
        .toLowerCase();

      const matchedInterests: string[] = [];
      for (const interest of student.interests || []) {
        const clean = interest.trim().toLowerCase();
        if (!clean) continue;
        // Check if any word or phrase of the interest appears in the team's category, tags, title, or description
        const words = clean.split(/[\s/&,-]+/).filter((w) => w.length >= 2);
        if (
          searchableTeamTokens.includes(clean) ||
          words.some((w) => searchableTeamTokens.includes(w))
        ) {
          matchedInterests.push(interest);
        }
      }

      // Also check if student skills align with team tags/category
      let tagSkillBonus = 0;
      for (const sk of normalizedSkills) {
        if ((team.tags || []).some((t) => t.toLowerCase().includes(sk))) {
          tagSkillBonus += 4;
        }
      }

      const interestBonus = Math.min(20, matchedInterests.length * 8);
      const deptBonus =
        student.department &&
        team.department.toLowerCase().includes(student.department.toLowerCase().split(' ')[0])
          ? 5
          : 0;

      const combinedScore = Math.min(
        100,
        Math.round(detailed.score * 0.8 + interestBonus + Math.min(10, tagSkillBonus) + deptBonus)
      );

      const exactMatches = detailed.breakdown
        .filter((b) => b.matchType === 'exact')
        .map((b) => b.required);
      const relatedMatches = detailed.breakdown
        .filter((b) => b.matchType === 'related')
        .map((b) => ({
          required: b.required,
          candidateHas: b.matchedSkill || '',
          weight: b.score / 100,
        }));
      const missingSkills = detailed.breakdown
        .filter((b) => b.matchType === 'none')
        .map((b) => b.required);

      return {
        team,
        skillScore: detailed.score,
        interestMatchCount: matchedInterests.length,
        matchedInterests,
        combinedScore: Math.max(detailed.score, combinedScore),
        exactMatches,
        relatedMatches,
        missingSkills,
      };
    })
    .sort((a, b) => {
      if (b.combinedScore !== a.combinedScore) {
        return b.combinedScore - a.combinedScore;
      }
      if (b.interestMatchCount !== a.interestMatchCount) {
        return b.interestMatchCount - a.interestMatchCount;
      }
      return b.skillScore - a.skillScore;
    });
}

/**
 * Guarantees every team leader and team member across all teams has a complete StudentProfile
 * with login credentials (email, studentIdNum, password), department, skills, and interests.
 */
export function ensureAllTeamMembersInStudents(
  students: StudentProfile[],
  teams: Team[]
): StudentProfile[] {
  const byId = new Map<string, StudentProfile>();
  let seq = 500;

  for (const stu of students) {
    const firstToken = stu.name.split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'User';
    const fallbackPass = `${firstToken}@${stu.studentIdNum.slice(-4) || '2026'}#gehu`;
    byId.set(stu.id, {
      ...stu,
      password: stu.password || fallbackPass,
      accountType: stu.accountType || 'TEAM_MEMBER',
      createdAt: stu.createdAt || '2026-10-15 10:00',
    });
  }

  for (const team of teams) {
    for (const member of team.members) {
      if (byId.has(member.id)) continue;
      seq += 1;
      const isLeader = member.role === 'Leader' || member.id === team.leaderId;
      const studentIdNum = isLeader ? `2510110${seq}` : `2510190${seq}`;
      const firstToken = member.name.split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'User';
      const password = `${firstToken}@${seq}#gehu`;
      const cleanSkills =
        member.skills && member.skills.length > 0
          ? member.skills.map((s) => s.split('|')[0])
          : ['C++', 'Algorithms'];

      byId.set(member.id, {
        id: member.id,
        studentIdNum,
        name: member.name,
        email: member.email,
        password,
        accountType: isLeader ? 'TEAM_LEADER' : 'TEAM_MEMBER',
        createdAt: '2026-10-18 11:00',
        phone: `+91 98100 ${String(10000 + seq).slice(-5)}`,
        department: team.department,
        year: isLeader ? '3rd Year (Project Lead)' : '3rd Year',
        avatar: member.avatar || '👨‍💻',
        bio: isLeader
          ? `Team Leader for ${team.title} (${team.department}).`
          : `Project Member in ${team.title} (${team.department}).`,
        skills: cleanSkills,
        interests: [team.category, ...(team.tags || []).slice(0, 2)],
        availability: '15 hrs/week',
        certificates: [],
        assessmentStatus: {
          cppVerified: true,
          cVerified: false,
          score: 85,
          verdict: 'VERIFIED_ELIGIBLE',
          cheatFlags: 0,
          completedAt: '2026-10-20 14:00',
        },
        blockedUsers: [],
        isBanned: false,
      });
    }
  }

  return Array.from(byId.values());
}

export interface TeamMemberFullRecord {
  member: TeamMember;
  profile: StudentProfile;
  isLeader: boolean;
  loginEmail: string;
  loginId: string;
  loginPassword: string;
}

export interface TeamFullIntelligence {
  team: Team;
  leaderProfile: StudentProfile | null;
  memberRecords: TeamMemberFullRecord[];
  teamApplications: TeamApplication[];
  capacityMetrics: {
    filled: number;
    total: number;
    openSpots: number;
    fillPercentage: number;
    isFull: boolean;
  };
}

/**
 * Resolves exhaustive team & member login intelligence for the Admin Team Inspector.
 */
export function getTeamFullIntelligence(
  team: Team,
  students: StudentProfile[],
  applications: TeamApplication[]
): TeamFullIntelligence {
  const studentMap = new Map<string, StudentProfile>();
  for (const s of students) {
    studentMap.set(s.id, s);
  }

  const memberRecords: TeamMemberFullRecord[] = team.members.map((m) => {
    const existing = studentMap.get(m.id);
    const firstToken = m.name.split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'User';
    const fallbackProfile: StudentProfile = existing || {
      id: m.id,
      studentIdNum: `251019999`,
      name: m.name,
      email: m.email,
      password: `${firstToken}@2026#gehu`,
      accountType: m.role === 'Leader' ? 'TEAM_LEADER' : 'TEAM_MEMBER',
      createdAt: team.createdAt || '2026-10-18',
      department: team.department,
      year: '3rd Year',
      avatar: m.avatar || '👨‍💻',
      bio: `${m.role} of ${team.title}`,
      skills: m.skills || [],
      interests: [team.category],
      availability: '15 hrs/week',
      certificates: [],
      assessmentStatus: {
        cppVerified: true,
        cVerified: false,
        score: 85,
        verdict: 'VERIFIED_ELIGIBLE',
        cheatFlags: 0,
      },
    };
    const loginPassword = fallbackProfile.password || `${firstToken}@2026#gehu`;

    return {
      member: m,
      profile: fallbackProfile,
      isLeader: m.role === 'Leader' || m.id === team.leaderId,
      loginEmail: fallbackProfile.email,
      loginId: fallbackProfile.studentIdNum,
      loginPassword,
    };
  });

  const leaderProfile =
    studentMap.get(team.leaderId) ||
    memberRecords.find((r) => r.isLeader)?.profile ||
    null;

  const teamApplications = applications.filter((a) => a.teamId === team.id);
  const filled = team.members.length;
  const total = Math.max(1, team.teamSize);
  const openSpots = Math.max(0, total - filled);
  const fillPercentage = Math.min(100, Math.round((filled / total) * 100));

  return {
    team,
    leaderProfile,
    memberRecords,
    teamApplications,
    capacityMetrics: {
      filled,
      total,
      openSpots,
      fillPercentage,
      isFull: filled >= total,
    },
  };
}

/**
 * Maps every user ID to the teams they lead and the teams they are a member of.
 */
export function getUserTeamsMap(teams: Team[]): Record<
  string,
  { ledTeams: Team[]; memberTeams: Team[] }
> {
  const map: Record<string, { ledTeams: Team[]; memberTeams: Team[] }> = {};
  for (const team of teams) {
    if (team.leaderId) {
      if (!map[team.leaderId]) {
        map[team.leaderId] = { ledTeams: [], memberTeams: [] };
      }
      map[team.leaderId].ledTeams.push(team);
    }
    for (const m of team.members) {
      if (!map[m.id]) {
        map[m.id] = { ledTeams: [], memberTeams: [] };
      }
      if (!map[m.id].memberTeams.some((t) => t.id === team.id)) {
        map[m.id].memberTeams.push(team);
      }
    }
  }
  return map;
}

export interface ResolvedTeamDeepProjectDetails {
  deepDescription: string[];
  problemStatement: string;
  objectives: string[];
  architectureModules: {
    name: string;
    role: string;
    tech: string;
    description: string;
  }[];
  milestones: {
    phase: string;
    title: string;
    timeline: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
    deliverable: string;
  }[];
  techStackBreakdown: {
    category: string;
    items: string[];
  }[];
  roleResponsibilities: {
    roleTitle: string;
    assignedTo: string;
    memberId?: string;
    status: 'FILLED' | 'OPEN_VACANCY';
    responsibilities: string;
    skills: string[];
  }[];
  expectedOutcomes: string[];
  repositoryUrl: string;
  documentationUrl: string;
  academicCourseCode: string;
}

/**
 * Resolves full, deep project documentation, architecture breakdown, milestones,
 * role allocations, and deliverables for ANY team on the platform (all 105+ initial teams
 * and any newly created team).
 */
export function getTeamDeepProjectDetails(team: Team): ResolvedTeamDeepProjectDetails {
  const cleanSkills = (team.requiredSkills || ['C++', 'Algorithms']).map((s) => s.split('|')[0]);
  const primarySkill = cleanSkills[0] || 'C++';
  const secondarySkill = cleanSkills[1] || 'Algorithms';
  const openSlotsCount = Math.max(0, team.teamSize - team.members.length);
  const courseCode =
    team.academicCourseCode ||
    `B.Tech ${(team.category || 'CSE').split(' ')[0].toUpperCase()}-2026-PBL`;

  const deepDescription =
    team.deepDescription && team.deepDescription.length > 0
      ? team.deepDescription
      : [
          `${team.title} is an official engineering and research project team operating under the Department of ${team.department} (${team.category}) at Graphic Era Deemed to be University. Led by ${team.leaderName}, the project focuses on: ${team.description}`,
          `The technical architecture is built around ${team.requiredSkills.join(', ')} with strict modular boundaries, deterministic memory and execution guarantees, and automated test verification. Each team member owns a dedicated subsystem while collaborating through shared Git workflows and weekly sprint reviews.`,
          `Candidates joining ${team.title} work directly with ${team.leaderName} and the core roster to design, implement, benchmark, and document the complete system ahead of the ${team.deadline} evaluation milestone.`,
        ];

  const problemStatement =
    team.problemStatement ||
    `Existing approaches in ${team.category} face performance, scalability, and integration bottlenecks when addressing ${team.description.toLowerCase().replace(/\.$/, '')}. ${team.title} solves this challenge through a purpose-built architecture leveraging ${team.requiredSkills.join(' and ')}.`;

  const objectives =
    team.objectives && team.objectives.length > 0
      ? team.objectives
      : [
          `Design and implement the core ${team.title} engine using ${primarySkill} and ${secondarySkill}.`,
          `Ensure end-to-end integration across ${team.requiredSkills.join(', ')} modules with high reliability.`,
          `Validate system throughput, memory safety, and edge-case correctness via automated test suites.`,
          `Deliver complete source code, technical documentation, and live demonstration by ${team.deadline}.`,
        ];

  const architectureModules =
    team.architectureModules && team.architectureModules.length > 0
      ? team.architectureModules
      : [
          {
            name: `Module 1: Core ${primarySkill} Engine & State Kernel`,
            role: `Led by ${team.leaderName}`,
            tech: `${primarySkill}, ${secondarySkill}`,
            description: `Implements the primary data structures, algorithmic kernel, and execution pipeline for ${team.title}.`,
          },
          {
            name: `Module 2: ${team.category} Processing & Integration Layer`,
            role: team.members[1] ? `Engineered by ${team.members[1].name}` : 'Core Team Roster',
            tech: team.requiredSkills.join(', '),
            description: `Manages subsystem communication, data transformation, and modular service orchestration.`,
          },
          {
            name: 'Module 3: Interface, Telemetry & Diagnostics Module',
            role: team.members[2] ? `Engineered by ${team.members[2].name}` : 'Collaborative Team Module',
            tech: `${cleanSkills[cleanSkills.length - 1] || primarySkill}, Real-time Telemetry`,
            description: `Provides interactive visualization, runtime metrics, and user/system interfacing for ${team.title}.`,
          },
          {
            name: 'Module 4: Verification, Benchmarking & QA Suite',
            role: openSlotsCount > 0 ? 'Open Vacancy / Sprint Collaboration' : 'Team QA & Verification',
            tech: `Automated Testing, Profiling, ${primarySkill}`,
            description: `Executes unit tests, stress benchmarks, and memory/correctness audits across all project modules.`,
          },
        ];

  const milestones =
    team.milestones && team.milestones.length > 0
      ? team.milestones
      : [
          {
            phase: 'Phase I',
            title: 'Problem Definition & System Architecture Blueprint',
            timeline: 'Completed',
            status: 'COMPLETED' as const,
            deliverable: `Approved technical specification and module interfaces for ${team.title}.`,
          },
          {
            phase: 'Phase II',
            title: `Core ${primarySkill} & ${secondarySkill} Implementation`,
            timeline: 'Completed',
            status: 'COMPLETED' as const,
            deliverable: `Working core engine and primary data structures verified on unit test suites.`,
          },
          {
            phase: 'Phase III',
            title: 'Full Module Integration & Performance Optimization',
            timeline: 'Active Sprint',
            status: 'IN_PROGRESS' as const,
            deliverable: `End-to-end integration of ${team.requiredSkills.join(', ')} components and stress profiling.`,
          },
          {
            phase: 'Phase IV',
            title: 'Final Evaluation, Documentation & Deployment',
            timeline: `Due ${team.deadline}`,
            status: 'UPCOMING' as const,
            deliverable: 'Final project defense, complete repository release, and technical report.',
          },
        ];

  const techStackBreakdown =
    team.techStackBreakdown && team.techStackBreakdown.length > 0
      ? team.techStackBreakdown
      : [
          {
            category: 'Required Technical Skills',
            items: team.requiredSkills.map((s) => s.replace('|', ' OR ')),
          },
          {
            category: 'Domain & Academic Track',
            items: [team.category, team.department, ...(team.tags || [])],
          },
          {
            category: 'Engineering & Collaboration Tools',
            items: ['Git / GitHub', 'Automated Test Suite', 'SkillMatch Team Workspace', 'Code Review Pipeline'],
          },
        ];

  const roleResponsibilities =
    team.roleResponsibilities && team.roleResponsibilities.length > 0
      ? team.roleResponsibilities
      : [
          ...team.members.map((m, idx) => ({
            roleTitle:
              m.role === 'Leader' || idx === 0
                ? `Team Leader & Lead ${primarySkill} Architect`
                : `Core ${m.skills[0] || primarySkill} Module Engineer`,
            assignedTo: m.name,
            memberId: m.id,
            status: 'FILLED' as const,
            responsibilities:
              m.role === 'Leader' || idx === 0
                ? `Leads overall system architecture, sprint planning, code reviews, and core ${primarySkill} integration for ${team.title}.`
                : `Implements and tests ${m.skills.join(' & ')} components and collaborates on milestone deliverables.`,
            skills: m.skills && m.skills.length > 0 ? m.skills : [primarySkill],
          })),
          ...Array.from({ length: openSlotsCount }).map((_, slotIdx) => ({
            roleTitle: `Open Team Member Slot #${slotIdx + 1} (${team.requiredSkills[slotIdx % team.requiredSkills.length] || primarySkill})`,
            assignedTo: 'Open Vacancy — Ready for Applicant',
            status: 'OPEN_VACANCY' as const,
            responsibilities: `Contribute to ${team.title} module development using ${team.requiredSkills.join(', ')}, participate in team sprints, and co-author final deliverables.`,
            skills: team.requiredSkills,
          })),
        ];

  const expectedOutcomes =
    team.expectedOutcomes && team.expectedOutcomes.length > 0
      ? team.expectedOutcomes
      : [
          `Fully functional, benchmarked prototype for ${team.title}.`,
          `Modular, well-documented codebase utilizing ${team.requiredSkills.join(', ')}.`,
          `Comprehensive technical report and live presentation for ${team.department}.`,
        ];

  return {
    deepDescription,
    problemStatement,
    objectives,
    architectureModules,
    milestones,
    techStackBreakdown,
    roleResponsibilities,
    expectedOutcomes,
    repositoryUrl:
      team.repositoryUrl ||
      `https://github.com/gehu-projects-2026/${team.id}-${team.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    documentationUrl:
      team.documentationUrl ||
      `https://gehu.ac.in/projects/2026/${team.id}/documentation`,
    academicCourseCode: courseCode,
  };
}


