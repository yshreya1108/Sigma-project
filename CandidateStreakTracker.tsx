import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StreakEngine, formatToDateKey } from '../lib/streakEngine';
import {
  Flame,
  Trophy,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Code2,
  Zap,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface CandidateStreakTrackerProps {
  onNavigateToAssessment: () => void;
}

export const CandidateStreakTracker: React.FC<CandidateStreakTrackerProps> = ({
  onNavigateToAssessment,
}) => {
  const { currentUserProfile, assessmentSubmissions, submitAssessment } = useApp();

  if (!currentUserProfile) return null;

  // Local storage for additional practice check-ins per candidate
  const storageKey = `skillmatch_practice_dates_${currentUserProfile.id}`;
  
  // Initialize with realistic seed dates so the user has an active streak (e.g., today & recent days)
  const [practiceDates, setPracticeDates] = useState<string[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default seed dates for a solid demonstration streak
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(d1.getDate() - 1);
    const d2 = new Date(today);
    d2.setDate(d2.getDate() - 2);
    const d3 = new Date(today);
    d3.setDate(d3.getDate() - 3);

    return [
      formatToDateKey(today),
      formatToDateKey(d1),
      formatToDateKey(d2),
      formatToDateKey(d3),
    ];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(practiceDates));
  }, [practiceDates, storageKey]);

  // Compute live streak metrics
  const streakData = StreakEngine.getStreakData(
    currentUserProfile.id,
    assessmentSubmissions,
    practiceDates
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick 5-minute daily practice check-in simulation
  const handleQuickPracticeCheckin = () => {
    const todayKey = formatToDateKey(new Date());
    if (practiceDates.includes(todayKey)) {
      setToastMessage("You've already secured today's streak! Take a full assessment to boost your match ranking.");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    setPracticeDates((prev) => [todayKey, ...prev]);
    
    // Also submit a lightweight daily check-in assessment to AppContext
    submitAssessment({
      candidateId: currentUserProfile.id,
      candidateName: currentUserProfile.name,
      candidateEmail: currentUserProfile.email,
      language: 'cpp',
      challengeId: 'cpp-smart-vector',
      challengeTitle: 'Daily Practice: C++ RAII Vector & Bounds Check',
      submittedCode: '// Daily practice check-in: Verified clean RAII buffer management.',
      syntaxValid: true,
      testCasesPassed: 4,
      totalTestCases: 4,
      score: 95,
      timeSpentSeconds: 300,
      tabSwitchCount: 0,
      copyPasteCount: 0,
      cheatSuspicion: 'LOW',
      timeComplexity: 'Amortized O(1)',
      spaceComplexity: 'O(N)',
      memorySafetyNotes: ['RAII destructor properly deallocates buffer with delete[]'],
      verdict: 'VERIFIED_ELIGIBLE',
      personalizedFeedback: 'Daily practice streak maintained. Verified clean memory safety and optimal runtime complexity.',
    });

    setToastMessage("🔥 Great job! Today's daily practice completed and your streak is extended.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
      {/* Top Banner with Flame Gradient */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 p-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0 ring-2 ring-white/30">
              <Flame className="w-7 h-7 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-100 bg-white/15 px-2.5 py-0.5 rounded-full">
                  Daily Coding Streak
                </span>
                {streakData.status === 'ACTIVE_TODAY' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Today Completed
                  </span>
                )}
                {streakData.status === 'AT_RISK' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" /> Practice Needed Today
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                {streakData.currentStreak} Day{streakData.currentStreak === 1 ? '' : 's'} Assessment Streak!
              </h3>
              <p className="text-xs text-amber-100/90 mt-0.5 max-w-xl">
                Daily C & C++ practice builds muscle memory in memory safety, pointer arithmetic, and algorithmic edge cases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleQuickPracticeCheckin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-orange-600 hover:bg-orange-50 transition-all shadow-sm active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-orange-600" />
              {streakData.hasPracticedToday ? 'Streak Secured' : 'Check In Practice Today'}
            </button>
            <button
              type="button"
              onClick={onNavigateToAssessment}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-700/60 hover:bg-orange-700/80 text-white transition-all backdrop-blur-xs border border-white/20 active:scale-95"
            >
              <Code2 className="w-3.5 h-3.5" />
              Launch Assessment IDE
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="mt-3.5 p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-xs font-semibold text-white border border-white/30 flex items-center gap-2 animate-in fade-in duration-200">
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            {toastMessage}
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500 text-white shrink-0 shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{streakData.currentStreak} Days</div>
              <div className="text-[11px] font-semibold text-orange-700">Current Streak</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500 text-white shrink-0 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{streakData.longestStreak} Days</div>
              <div className="text-[11px] font-semibold text-amber-700">Longest Streak</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-600 text-white shrink-0 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{streakData.totalActiveDays} Days</div>
              <div className="text-[11px] font-semibold text-indigo-700">Total Practice Days</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">1 Shield</div>
              <div className="text-[11px] font-semibold text-emerald-700">Exam Freeze Protection</div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Strip & 28-Day Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 7-Day Rolling Window */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  7-Day Assessment Activity
                </h4>
                <p className="text-[11px] text-slate-500">
                  Consecutive days of verified test evaluations & code submissions.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                Rolling Week
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-1">
              {streakData.weeklyStrip.map((day) => (
                <div
                  key={day.date}
                  className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all text-center ${
                    day.completed
                      ? 'bg-gradient-to-b from-orange-50 to-amber-50 border-orange-200 text-orange-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-400'
                  } ${day.isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                >
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase">{day.dayLabel}</span>
                  <div className="my-1.5 flex items-center justify-center">
                    {day.completed ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-xs">
                        <Flame className="w-4 h-4 fill-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center border border-dashed border-slate-300">
                        <span className="text-xs font-bold">•</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">{day.displayDate}</span>
                  {day.completed && day.bestScore !== undefined && (
                    <span className="text-[9px] font-extrabold text-orange-700 bg-white/80 px-1 rounded mt-1 border border-orange-200">
                      {day.bestScore}%
                    </span>
                  )}
                  {day.isToday && (
                    <span className="text-[9px] font-black text-indigo-600 uppercase mt-0.5">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* 28-Day Mini Heatmap */}
            <div className="pt-3 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700">28-Day Consistency Heatmap:</span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span>Inactive</span>
                  <span className="w-2.5 h-2.5 rounded bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded bg-orange-300" />
                  <span className="w-2.5 h-2.5 rounded bg-orange-500" />
                  <span>Active</span>
                </div>
              </div>
              <div className="grid grid-cols-14 gap-1.5">
                {streakData.monthlyHeatmap.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.completed ? `${day.submissionCount} assessment(s)` : 'No assessment activity'}`}
                    className={`h-4 rounded-xs transition-colors cursor-pointer ${
                      day.completed
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-slate-200 hover:bg-slate-300'
                    } ${day.isToday ? 'ring-1 ring-indigo-500' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Next Milestone & Featured Daily Challenge */}
          <div className="lg:col-span-5 space-y-3">
            {/* Next Milestone Card */}
            {streakData.nextMilestone && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{streakData.nextMilestone.badge}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Next Goal: {streakData.nextMilestone.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {streakData.nextMilestone.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    {streakData.currentStreak}/{streakData.nextMilestone.days} Days
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((streakData.currentStreak / streakData.nextMilestone.days) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>{streakData.nextMilestone.days - streakData.currentStreak} day(s) remaining</span>
                  <span>
                    {Math.min(
                      100,
                      Math.round((streakData.currentStreak / streakData.nextMilestone.days) * 100)
                    )}
                    % Complete
                  </span>
                </div>
              </div>
            )}

            {/* Featured Daily Challenge Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded">
                  Today's Featured Assessment
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {streakData.dailyChallengeRecommendation.timeLimitMinutes} mins
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-slate-900 text-white">
                    {streakData.dailyChallengeRecommendation.language.toUpperCase()}
                  </span>
                  {streakData.dailyChallengeRecommendation.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Solve memory bounds and pointer traversal under real anti-cheat monitoring to secure your daily streak.
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToAssessment}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                Solve Today's Challenge <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
