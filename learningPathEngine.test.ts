import test from 'node:test';
import assert from 'node:assert/strict';
import { LearningPathEngine } from './learningPathEngine';
import { StudentProfile, AssessmentSubmission } from './types';

test('LearningPathEngine generates high priority memory safety topic when leak is detected in submission', () => {
  const profile: StudentProfile = {
    id: 'test-student',
    studentIdNum: '12345',
    name: 'Test Student',
    email: 'test@gehu.ac.in',
    department: 'CSE',
    year: '3rd Year',
    avatar: '',
    bio: '',
    skills: ['C++'],
    interests: [],
    availability: '10 hrs',
    certificates: [],
    assessmentStatus: {
      cppVerified: false,
      cVerified: false,
      score: 60,
      verdict: 'ELIGIBLE_WITH_CONDITIONS',
      cheatFlags: 0,
    },
  };

  const submissions: AssessmentSubmission[] = [
    {
      id: 'sub-test',
      candidateId: 'test-student',
      candidateName: 'Test Student',
      candidateEmail: 'test@gehu.ac.in',
      language: 'cpp',
      challengeId: 'cpp-smart-vector',
      challengeTitle: 'C++ Custom Dynamic Vector',
      submittedCode: '...',
      syntaxValid: true,
      testCasesPassed: 2,
      totalTestCases: 4,
      score: 60,
      timeSpentSeconds: 120,
      tabSwitchCount: 0,
      copyPasteCount: 0,
      cheatSuspicion: 'LOW',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      memorySafetyNotes: ['Memory leak detected: new allocated without delete[] in destructor.'],
      verdict: 'ELIGIBLE_WITH_CONDITIONS',
      personalizedFeedback: 'Need to implement proper destructor deallocation.',
      submittedAt: '2026-10-31',
    },
  ];

  const result = LearningPathEngine.generateLearningPath(profile, submissions);

  assert.ok(result.topics.length >= 3);
  const memoryTopic = result.topics.find((t) => t.category === 'Memory Safety');
  assert.ok(memoryTopic);
  assert.equal(memoryTopic.priority, 'HIGH');
  assert.ok(memoryTopic.diagnosedIssue.includes('assessment'));
  assert.ok(memoryTopic.tutorials.some((tut) => tut.url.includes('cppreference.com')));
  assert.ok(memoryTopic.codeComparison.fixedSnippet.includes('delete[]'));
});

test('LearningPathEngine generates high-performing path for verified 95% developers', () => {
  const profile: StudentProfile = {
    id: 'test-shishir',
    studentIdNum: '25101210684',
    name: 'Shishir Dwivedi',
    email: 'shishir@gehu.ac.in',
    department: 'CSE',
    year: '3rd Year',
    avatar: '',
    bio: '',
    skills: ['C++', 'Data Structures'],
    interests: [],
    availability: '18 hrs',
    certificates: [],
    assessmentStatus: {
      cppVerified: true,
      cVerified: true,
      score: 95,
      verdict: 'VERIFIED_ELIGIBLE',
      cheatFlags: 0,
    },
  };

  const result = LearningPathEngine.generateLearningPath(profile, []);

  assert.ok(result.headline.includes('Mastery') || result.headline.includes('Advanced'));
  assert.ok(result.overallRecommendation.includes('Verified'));
});

test('LearningPathEngine.calculateRoadmapProgress computes 5-stage visualizer from beginner to collaboration ready', () => {
  const beginnerProfile: StudentProfile = {
    id: 'student-beginner',
    studentIdNum: '10001',
    name: 'Beginner Student',
    email: 'beginner@gehu.ac.in',
    department: 'CSE',
    year: '1st Year',
    avatar: '',
    bio: '',
    skills: ['Python'],
    interests: [],
    availability: '8 hrs',
    certificates: [],
    assessmentStatus: {
      cppVerified: false,
      cVerified: false,
      score: 0,
      verdict: 'NOT_ATTEMPTED',
      cheatFlags: 0,
    },
  };

  const beginnerRoadmap = LearningPathEngine.calculateRoadmapProgress(beginnerProfile, [], [], []);
  assert.equal(beginnerRoadmap.stages.length, 5);
  assert.equal(beginnerRoadmap.overallReadinessPercent, 0);
  assert.equal(beginnerRoadmap.currentStageId, 'stage-1-foundations');
  assert.equal(beginnerRoadmap.stages[0].status, 'IN_PROGRESS');

  // Toggle beginner C++ topics as mastered and check advancement
  const midRoadmap = LearningPathEngine.calculateRoadmapProgress(
    { ...beginnerProfile, skills: ['C++'] },
    [],
    ['topic-pointers-nullsafety', 'topic-buffer-safety'],
    []
  );
  assert.equal(midRoadmap.stages[0].status, 'MASTERED');
  assert.equal(midRoadmap.stages[0].progressPercent, 100);
  assert.equal(midRoadmap.currentStageId, 'stage-2-memory-raii');

  // Verify advanced collaboration readiness when all stages are completed
  const advancedProfile: StudentProfile = {
    ...beginnerProfile,
    id: 'student-advanced',
    skills: ['C++', 'Data Structures', 'STL'],
    resumeFileName: 'Resume.pdf',
    githubUrl: 'https://github.com/student/cpp-graph',
    assessmentStatus: {
      cppVerified: true,
      cVerified: true,
      score: 95,
      verdict: 'VERIFIED_ELIGIBLE',
      cheatFlags: 0,
    },
  };

  const advancedRoadmap = LearningPathEngine.calculateRoadmapProgress(
    advancedProfile,
    [],
    ['topic-pointers-nullsafety', 'topic-buffer-safety', 'topic-raii-memory', 'topic-graph-bfs'],
    [
      {
        id: 'app-1',
        teamId: 'team-1',
        teamTitle: 'Core Systems',
        studentId: 'student-advanced',
        studentName: 'Advanced Student',
        studentEmail: 'advanced@gehu.ac.in',
        studentSkills: ['C++'],
        status: 'APPROVED',
        appliedAt: '2026-10-30',
        message: 'Ready to collaborate',
        matchScore: 96,
      },
    ]
  );

  assert.equal(advancedRoadmap.overallReadinessPercent, 100);
  assert.equal(advancedRoadmap.completedStagesCount, 5);
  assert.ok(advancedRoadmap.readinessTierTitle.includes('Advanced Project Collaboration Ready'));
});

