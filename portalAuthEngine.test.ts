import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdminCredentials,
  canViewUserAccountAndActivity,
  getVisibleActivitiesForViewer,
  matchTeamsBySkillAndInterest,
} from './portalAuthEngine';
import { ActivityLog, Team } from './types';

describe('portalAuthEngine', () => {
  it('verifies exact Admin credentials (adminsm$4146 / adminsrsad@414.) and rejects invalid ones', () => {
    assert.equal(verifyAdminCredentials('adminsm$4146', 'adminsrsad@414.'), true);
    assert.equal(verifyAdminCredentials('  adminsm$4146 ', ' adminsrsad@414. '), true);
    assert.equal(verifyAdminCredentials('adminsm$4146', 'adminsrsad@414'), true);
    assert.equal(verifyAdminCredentials('admin', 'adminsrsad@414.'), false);
    assert.equal(verifyAdminCredentials('adminsm$4146', 'wrongpass'), false);
  });

  it('enforces strict privacy visibility so data and activities are only visible to the creator and authenticated Admin', () => {
    // Creator can view their own data
    assert.equal(
      canViewUserAccountAndActivity({
        viewerRole: 'STUDENT',
        isAdminAuthenticated: false,
        viewerUserId: 'student-101',
        targetOwnerId: 'student-101',
      }),
      true
    );

    // Another student or team leader CANNOT view student-101's private data
    assert.equal(
      canViewUserAccountAndActivity({
        viewerRole: 'STUDENT',
        isAdminAuthenticated: false,
        viewerUserId: 'student-202',
        targetOwnerId: 'student-101',
      }),
      false
    );
    assert.equal(
      canViewUserAccountAndActivity({
        viewerRole: 'TEAM_LEADER',
        isAdminAuthenticated: false,
        viewerUserId: 'leader-303',
        targetOwnerId: 'student-101',
      }),
      false
    );

    // Unauthenticated ADMIN role cannot bypass privacy gate
    assert.equal(
      canViewUserAccountAndActivity({
        viewerRole: 'ADMIN',
        isAdminAuthenticated: false,
        viewerUserId: 'admin-system',
        targetOwnerId: 'student-101',
      }),
      false
    );

    // Authenticated Admin CAN view any user's data
    assert.equal(
      canViewUserAccountAndActivity({
        viewerRole: 'ADMIN',
        isAdminAuthenticated: true,
        viewerUserId: 'admin-system',
        targetOwnerId: 'student-101',
      }),
      true
    );
  });

  it('filters activity logs so non-admin users only see their own activities while Admin sees all', () => {
    const sampleLogs: ActivityLog[] = [
      {
        id: '1',
        type: 'REGISTRATION',
        description: 'Aarav registered as Team Member',
        actor: 'Aarav',
        actorId: 'user-aarav',
        timestamp: '10:00 AM',
      },
      {
        id: '2',
        type: 'PROJECT_CREATED',
        description: 'Priya created new project Quantum Net',
        actor: 'Priya',
        actorId: 'user-priya',
        timestamp: '10:05 AM',
      },
    ];

    const aaravLogs = getVisibleActivitiesForViewer({
      logs: sampleLogs,
      viewerRole: 'STUDENT',
      isAdminAuthenticated: false,
      viewerUserId: 'user-aarav',
      viewerName: 'Aarav',
    });
    assert.equal(aaravLogs.length, 1);
    assert.equal(aaravLogs[0].id, '1');

    const adminLogs = getVisibleActivitiesForViewer({
      logs: sampleLogs,
      viewerRole: 'ADMIN',
      isAdminAuthenticated: true,
      viewerUserId: 'admin-system',
    });
    assert.equal(adminLogs.length, 2);
  });

  it('matches teams by both student skills and interests', () => {
    const mockTeams: Team[] = [
      {
        id: 't-robotics',
        title: 'Autonomous Robotics C++ Kernel',
        department: 'Computer Science & Engineering',
        category: 'Robotics & Embedded',
        description: 'Building real-time ROS2 and C++ control loops',
        requiredSkills: ['C++', 'Algorithms'],
        teamSize: 4,
        leaderId: 'l1',
        leaderName: 'Lead 1',
        leaderEmail: 'l1@geu.ac.in',
        members: [],
        vacancyOpen: true,
        deadline: '2026-12-01',
        tags: ['Robotics', 'C++', 'Embedded'],
        bannerGradient: 'from-indigo-600 to-violet-600',
        createdAt: '2026-10-01',
      },
      {
        id: 't-web',
        title: 'Campus Portal UI',
        department: 'Information Technology',
        category: 'Web Development',
        description: 'Frontend dashboard in React',
        requiredSkills: ['React', 'CSS'],
        teamSize: 4,
        leaderId: 'l2',
        leaderName: 'Lead 2',
        leaderEmail: 'l2@geu.ac.in',
        members: [],
        vacancyOpen: true,
        deadline: '2026-12-01',
        tags: ['Frontend', 'UI/UX'],
        bannerGradient: 'from-blue-600 to-cyan-600',
        createdAt: '2026-10-01',
      },
    ];

    const results = matchTeamsBySkillAndInterest(
      {
        skills: ['C++', 'Algorithms'],
        interests: ['Robotics', 'Embedded Systems'],
        department: 'Computer Science & Engineering',
      },
      mockTeams
    );

    assert.equal(results.length, 2);
    assert.equal(results[0].team.id, 't-robotics');
    assert.ok(results[0].combinedScore >= 95);
    assert.ok(results[0].matchedInterests.includes('Robotics'));
  });

  it('populates complete login details and profiles for all leaders and members across all 105+ teams', async () => {
    const { INITIAL_STUDENTS, INITIAL_TEAMS, INITIAL_APPLICATIONS } = await import('./initialData');
    const { ensureAllTeamMembersInStudents, getTeamFullIntelligence, getUserTeamsMap } = await import('./portalAuthEngine');

    assert.ok(INITIAL_TEAMS.length >= 105, 'Should have at least 105 university teams');
    assert.ok(INITIAL_STUDENTS.length > 150, `Expected >150 full student profiles across all teams, got ${INITIAL_STUDENTS.length}`);

    const synced = ensureAllTeamMembersInStudents(INITIAL_STUDENTS, INITIAL_TEAMS);
    for (const person of synced) {
      assert.ok(person.email && person.email.includes('@'), `Person ${person.id} missing email`);
      assert.ok(person.studentIdNum && person.studentIdNum.length >= 6, `Person ${person.id} missing studentIdNum`);
      assert.ok(person.password && person.password.length >= 6, `Person ${person.id} missing login password`);
    }

    const firstTeamIntel = getTeamFullIntelligence(INITIAL_TEAMS[0], synced, INITIAL_APPLICATIONS);
    assert.equal(firstTeamIntel.team.id, 'team-sigma');
    assert.equal(firstTeamIntel.memberRecords.length, 3);
    assert.ok(firstTeamIntel.leaderProfile);
    assert.equal(firstTeamIntel.leaderProfile?.id, 'student-shreya');
    assert.ok(firstTeamIntel.memberRecords.every((r) => r.loginPassword && r.loginEmail && r.loginId));

    const userTeams = getUserTeamsMap(INITIAL_TEAMS);
    assert.equal(
      userTeams['student-shreya'].ledTeams.length,
      1,
      'Shreya Yadav must be leader of ONLY 1 team (Team Sigma)'
    );
    assert.equal(userTeams['student-shreya'].ledTeams[0].id, 'team-sigma');
    assert.equal(
      userTeams['student-shreya'].memberTeams.length,
      1,
      'Shreya Yadav must only be in Team Sigma'
    );
    assert.equal(userTeams['student-shreya'].memberTeams[0].id, 'team-sigma');
  });

  it('provides deep project descriptions, architecture modules, milestones, and unique leadership for every single team', async () => {
    const { INITIAL_TEAMS } = await import('./initialData');
    const { getTeamDeepProjectDetails } = await import('./portalAuthEngine');

    const leaderIds = new Set<string>();
    for (const team of INITIAL_TEAMS) {
      assert.ok(team.leaderId, `Team ${team.id} must have a leaderId`);
      if (team.id !== 'team-sigma') {
        assert.notEqual(
          team.leaderId,
          'student-shreya',
          `Team ${team.id} must not have Shreya Yadav as leader`
        );
        assert.ok(
          !team.leaderName.toLowerCase().includes('shreya yadav'),
          `Team ${team.id} must not list Shreya Yadav as leaderName`
        );
      }
      leaderIds.add(team.leaderId);

      const deep = getTeamDeepProjectDetails(team);
      assert.ok(deep.deepDescription.length >= 3, `Team ${team.id} missing deepDescription paragraphs`);
      assert.ok(deep.problemStatement.length > 20, `Team ${team.id} missing problemStatement`);
      assert.ok(deep.objectives.length >= 4, `Team ${team.id} missing objectives`);
      assert.ok(deep.architectureModules.length >= 4, `Team ${team.id} missing architectureModules`);
      assert.ok(deep.milestones.length >= 4, `Team ${team.id} missing milestones`);
      assert.ok(deep.techStackBreakdown.length >= 2, `Team ${team.id} missing techStackBreakdown`);
      assert.ok(deep.roleResponsibilities.length >= team.teamSize, `Team ${team.id} missing roleResponsibilities`);
      assert.ok(deep.expectedOutcomes.length >= 3, `Team ${team.id} missing expectedOutcomes`);
      assert.ok(deep.repositoryUrl.startsWith('https://'), `Team ${team.id} missing repositoryUrl`);
      assert.ok(deep.documentationUrl.startsWith('https://'), `Team ${team.id} missing documentationUrl`);
    }

    assert.equal(leaderIds.size, INITIAL_TEAMS.length, 'Every initial team should have a distinct leader');
  });
});


