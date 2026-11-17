import { test, describe } from 'node:test';
import assert from 'node:assert';
import { StreakEngine, formatToDateKey } from './streakEngine';
import { AssessmentSubmission } from './types';

describe('StreakEngine', () => {
  const refDate = new Date('2026-11-01T12:00:00Z');
  const todayKey = formatToDateKey(refDate);

  const yesterday = new Date(refDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatToDateKey(yesterday);

  const dayBefore = new Date(refDate);
  dayBefore.setDate(dayBefore.getDate() - 2);
  const dayBeforeKey = formatToDateKey(dayBefore);

  test('returns 0 streak when candidate has no assessment activity', () => {
    const data = StreakEngine.getStreakData('student-1', [], [], refDate);
    assert.strictEqual(data.currentStreak, 0);
    assert.strictEqual(data.hasPracticedToday, false);
    assert.strictEqual(data.status, 'INACTIVE');
    assert.strictEqual(data.totalActiveDays, 0);
  });

  test('detects active streak when practiced today', () => {
    const mockSubmission: AssessmentSubmission = {
      id: 'sub-101',
      candidateId: 'student-1',
      candidateName: 'Test Student',
      candidateEmail: 'test@gehu.ac.in',
      language: 'cpp',
      challengeId: 'cpp-smart-vector',
      challengeTitle: 'Vector Challenge',
      submittedCode: 'int main(){}',
      syntaxValid: true,
      testCasesPassed: 4,
      totalTestCases: 4,
      score: 100,
      timeSpentSeconds: 300,
      tabSwitchCount: 0,
      copyPasteCount: 0,
      cheatSuspicion: 'LOW',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(N)',
      memorySafetyNotes: [],
      verdict: 'VERIFIED_ELIGIBLE',
      personalizedFeedback: 'Great work',
      submittedAt: `${todayKey} 10:30`,
    };

    const data = StreakEngine.getStreakData('student-1', [mockSubmission], [], refDate);
    assert.strictEqual(data.currentStreak, 1);
    assert.strictEqual(data.hasPracticedToday, true);
    assert.strictEqual(data.status, 'ACTIVE_TODAY');
    assert.strictEqual(data.totalActiveDays, 1);
  });

  test('identifies AT_RISK status when practiced yesterday but not today', () => {
    const mockSubmission: AssessmentSubmission = {
      id: 'sub-102',
      candidateId: 'student-1',
      candidateName: 'Test Student',
      candidateEmail: 'test@gehu.ac.in',
      language: 'c',
      challengeId: 'c-pointer-string-reverse',
      challengeTitle: 'Pointer Reversal',
      submittedCode: 'void rev(){}',
      syntaxValid: true,
      testCasesPassed: 4,
      totalTestCases: 4,
      score: 90,
      timeSpentSeconds: 250,
      tabSwitchCount: 0,
      copyPasteCount: 0,
      cheatSuspicion: 'LOW',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      memorySafetyNotes: [],
      verdict: 'VERIFIED_ELIGIBLE',
      personalizedFeedback: 'Good pointers',
      submittedAt: `${yesterdayKey} 18:00`,
    };

    const data = StreakEngine.getStreakData('student-1', [mockSubmission], [], refDate);
    assert.strictEqual(data.currentStreak, 1);
    assert.strictEqual(data.hasPracticedToday, false);
    assert.strictEqual(data.status, 'AT_RISK');
  });

  test('calculates 3-day consecutive streak across yesterday and day before', () => {
    const dates = [dayBeforeKey, yesterdayKey, todayKey];
    const data = StreakEngine.getStreakData('student-1', [], dates, refDate);

    assert.strictEqual(data.currentStreak, 3);
    assert.strictEqual(data.longestStreak, 3);
    assert.strictEqual(data.status, 'ACTIVE_TODAY');
    assert.strictEqual(data.milestones[0].unlocked, true); // 3-day Consistency Bronze unlocked
  });

  test('generates correct 7-day strip and 28-day monthly heatmap', () => {
    const dates = [yesterdayKey, todayKey];
    const data = StreakEngine.getStreakData('student-1', [], dates, refDate);

    assert.strictEqual(data.weeklyStrip.length, 7);
    assert.strictEqual(data.monthlyHeatmap.length, 28);
    assert.strictEqual(data.weeklyStrip[6].isToday, true);
    assert.strictEqual(data.weeklyStrip[6].completed, true);
    assert.strictEqual(data.weeklyStrip[5].completed, true);
  });
});
