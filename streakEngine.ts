/**
 * Streak Calculation Engine for C/C++ Daily Coding Practice
 * Computes consecutive days of assessment activity, activity calendar,
 * milestones, and streak status.
 */

import { AssessmentSubmission } from './types';

export interface DayActivity {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon", "Tue"
  dayShort: string; // e.g. "M", "T"
  displayDate: string; // e.g. "Nov 1"
  isToday: boolean;
  completed: boolean;
  submissionCount: number;
  languages: ('cpp' | 'c')[];
  bestScore?: number;
}

export interface StreakMilestone {
  days: number;
  title: string;
  badge: string;
  description: string;
  unlocked: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  hasPracticedToday: boolean;
  status: 'ACTIVE_TODAY' | 'AT_RISK' | 'INACTIVE';
  streakFreezesAvailable: number;
  weeklyStrip: DayActivity[];
  monthlyHeatmap: DayActivity[];
  milestones: StreakMilestone[];
  nextMilestone: StreakMilestone | null;
  dailyChallengeRecommendation: {
    id: string;
    title: string;
    language: 'cpp' | 'c';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    timeLimitMinutes: number;
  };
}

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export function formatToDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse various date formats (ISO, YYYY-MM-DD, or localized strings)
 */
export function parseDateToKey(dateStr: string): string | null {
  if (!dateStr) return null;
  
  // If already YYYY-MM-DD at start
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // Handle local date string like "10/31/2026, 11:15 AM" or "10/31/2026"
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return formatToDateKey(parsed);
  }

  return null;
}

export class StreakEngine {
  /**
   * Defined milestone ladder for C/C++ coding consistency
   */
  public static readonly MILESTONES: StreakMilestone[] = [
    {
      days: 3,
      title: 'Consistency Bronze',
      badge: '🥉',
      description: '3 consecutive days of C/C++ problem solving.',
      unlocked: false,
    },
    {
      days: 7,
      title: '7-Day C++ Sprint',
      badge: '⚡',
      description: '1 full week of daily memory safety & algorithms practice.',
      unlocked: false,
    },
    {
      days: 14,
      title: 'Algorithmic Master',
      badge: '🏆',
      description: '2 weeks of continuous dynamic programming and graph traversals.',
      unlocked: false,
    },
    {
      days: 30,
      title: 'Kernel Architect',
      badge: '🛡️',
      description: '1 month of flawless daily C/C++ systems engineering.',
      unlocked: false,
    },
  ];

  /**
   * Extract distinct active dates and metadata for a specific candidate
   */
  public static extractActiveDateMap(
    candidateId: string,
    submissions: AssessmentSubmission[],
    additionalPracticeDates: string[] = []
  ): Map<string, { count: number; languages: Set<'cpp' | 'c'>; bestScore: number }> {
    const map = new Map<string, { count: number; languages: Set<'cpp' | 'c'>; bestScore: number }>();

    // Filter submissions for this candidate
    const candidateSubmissions = submissions.filter((s) => s.candidateId === candidateId);

    for (const sub of candidateSubmissions) {
      const dateKey = parseDateToKey(sub.submittedAt);
      if (!dateKey) continue;

      const entry = map.get(dateKey) || {
        count: 0,
        languages: new Set<'cpp' | 'c'>(),
        bestScore: 0,
      };

      entry.count += 1;
      if (sub.language) entry.languages.add(sub.language);
      if (sub.score > entry.bestScore) entry.bestScore = sub.score;

      map.set(dateKey, entry);
    }

    // Add additional practice dates (from localStorage or seeds)
    for (const dateStr of additionalPracticeDates) {
      const dateKey = parseDateToKey(dateStr);
      if (!dateKey) continue;

      if (!map.has(dateKey)) {
        map.set(dateKey, {
          count: 1,
          languages: new Set(['cpp']),
          bestScore: 90,
        });
      }
    }

    return map;
  }

  /**
   * Calculate consecutive streak days ending today or yesterday
   */
  public static calculateStreakDays(
    activeDates: Set<string>,
    referenceDate: Date = new Date()
  ): {
    currentStreak: number;
    hasPracticedToday: boolean;
    status: 'ACTIVE_TODAY' | 'AT_RISK' | 'INACTIVE';
  } {
    const todayKey = formatToDateKey(referenceDate);

    // Yesterday's date
    const yesterday = new Date(referenceDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatToDateKey(yesterday);

    const hasPracticedToday = activeDates.has(todayKey);
    const hasPracticedYesterday = activeDates.has(yesterdayKey);

    let currentStreak = 0;
    let status: 'ACTIVE_TODAY' | 'AT_RISK' | 'INACTIVE' = 'INACTIVE';

    if (hasPracticedToday) {
      status = 'ACTIVE_TODAY';
      currentStreak = 1;
      // Walk back from yesterday
      let checkDate = new Date(yesterday);
      while (activeDates.has(formatToDateKey(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (hasPracticedYesterday) {
      status = 'AT_RISK';
      currentStreak = 1;
      // Walk back from 2 days ago
      let checkDate = new Date(yesterday);
      checkDate.setDate(checkDate.getDate() - 1);
      while (activeDates.has(formatToDateKey(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      status = 'INACTIVE';
      currentStreak = 0;
    }

    return {
      currentStreak,
      hasPracticedToday,
      status,
    };
  }

  /**
   * Calculate longest streak across all recorded history
   */
  public static calculateLongestStreak(activeDates: Set<string>): number {
    if (activeDates.size === 0) return 0;

    const sortedDates = Array.from(activeDates).sort();
    let maxStreak = 1;
    let current = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffMs = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        current++;
        if (current > maxStreak) maxStreak = current;
      } else if (diffDays > 1) {
        current = 1;
      }
    }

    return maxStreak;
  }

  /**
   * Generate 7-day rolling window
   */
  public static generateWeeklyStrip(
    activeMap: Map<string, { count: number; languages: Set<'cpp' | 'c'>; bestScore: number }>,
    referenceDate: Date = new Date()
  ): DayActivity[] {
    const days: DayActivity[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const shortNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(d.getDate() - i);

      const dateKey = formatToDateKey(d);
      const isToday = i === 0;
      const entry = activeMap.get(dateKey);

      days.push({
        date: dateKey,
        dayLabel: dayNames[d.getDay()],
        dayShort: shortNames[d.getDay()],
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday,
        completed: !!entry && entry.count > 0,
        submissionCount: entry ? entry.count : 0,
        languages: entry ? Array.from(entry.languages) : [],
        bestScore: entry?.bestScore,
      });
    }

    return days;
  }

  /**
   * Generate 28-day monthly activity heatmap (4 rolling weeks)
   */
  public static generateMonthlyHeatmap(
    activeMap: Map<string, { count: number; languages: Set<'cpp' | 'c'>; bestScore: number }>,
    referenceDate: Date = new Date()
  ): DayActivity[] {
    const days: DayActivity[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const shortNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    for (let i = 27; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(d.getDate() - i);

      const dateKey = formatToDateKey(d);
      const isToday = i === 0;
      const entry = activeMap.get(dateKey);

      days.push({
        date: dateKey,
        dayLabel: dayNames[d.getDay()],
        dayShort: shortNames[d.getDay()],
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday,
        completed: !!entry && entry.count > 0,
        submissionCount: entry ? entry.count : 0,
        languages: entry ? Array.from(entry.languages) : [],
        bestScore: entry?.bestScore,
      });
    }

    return days;
  }

  /**
   * Main computation producing all streak data for a candidate
   */
  public static getStreakData(
    candidateId: string,
    submissions: AssessmentSubmission[],
    additionalPracticeDates: string[] = [],
    referenceDate: Date = new Date()
  ): StreakData {
    const activeMap = this.extractActiveDateMap(candidateId, submissions, additionalPracticeDates);
    const dateSet = new Set(activeMap.keys());

    const { currentStreak, hasPracticedToday, status } = this.calculateStreakDays(dateSet, referenceDate);
    const longestStreak = Math.max(currentStreak, this.calculateLongestStreak(dateSet));
    const totalActiveDays = dateSet.size;

    const weeklyStrip = this.generateWeeklyStrip(activeMap, referenceDate);
    const monthlyHeatmap = this.generateMonthlyHeatmap(activeMap, referenceDate);

    // Compute unlocked milestones
    const milestones = this.MILESTONES.map((m) => ({
      ...m,
      unlocked: currentStreak >= m.days || longestStreak >= m.days,
    }));

    const nextMilestone = milestones.find((m) => !m.unlocked) || null;

    // Daily featured challenge recommendation
    const dailyChallengeRecommendation = {
      id: 'c-pointer-string-reverse',
      title: 'In-Place String & Pointer Arithmetic',
      language: 'c' as const,
      difficulty: 'Intermediate' as const,
      timeLimitMinutes: 15,
    };

    return {
      currentStreak,
      longestStreak,
      totalActiveDays,
      hasPracticedToday,
      status,
      streakFreezesAvailable: 1, // 1 shield token available for exam preparation
      weeklyStrip,
      monthlyHeatmap,
      milestones,
      nextMilestone,
      dailyChallengeRecommendation,
    };
  }
}
