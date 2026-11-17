import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  C_CPP_CHALLENGES,
  CodeChallenge,
  AssessmentEngine,
  CodeEvaluationResult,
} from '../lib/assessmentEngine';
import {
  Code2,
  ShieldAlert,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Terminal,
  Send,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';

export const SkillAssessment: React.FC = () => {
  const { currentUserProfile, submitAssessment, role } = useApp();

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('cpp-smart-vector');
  const currentChallenge: CodeChallenge =
    C_CPP_CHALLENGES.find((c) => c.id === selectedChallengeId) || C_CPP_CHALLENGES[0];

  const [code, setCode] = useState<string>(currentChallenge.starterCode);
  const [timeLeft, setTimeLeft] = useState<number>(currentChallenge.timeLimitMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Anti-cheat telemetry
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [copyPasteCount, setCopyPasteCount] = useState<number>(0);
  const [cheatAlert, setCheatAlert] = useState<string | null>(null);

  // Results
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<CodeEvaluationResult | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Switch challenge resets
  useEffect(() => {
    setCode(currentChallenge.starterCode);
    setTimeLeft(currentChallenge.timeLimitMinutes * 60);
    setTabSwitchCount(0);
    setCopyPasteCount(0);
    setEvaluationResult(null);
    setSubmittedSuccess(false);
    setCheatAlert(null);
    setIsRunning(true);
  }, [selectedChallengeId]);

  // Anti-cheat: Tab-switch & Visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setCheatAlert(`Anti-Cheat Warning: Tab switch / window blur detected (#${next}). This event is logged in your candidate audit report.`);
          return next;
        });
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPaste = (e: React.ClipboardEvent) => {
    setCopyPasteCount((prev) => {
      const next = prev + 1;
      setCheatAlert(`Anti-Cheat Notice: Clipboard copy/paste activity detected (#${next}). Code originality verification active.`);
      return next;
    });
  };

  const handleReset = () => {
    if (confirm('Reset code back to the initial challenge template?')) {
      setCode(currentChallenge.starterCode);
      setEvaluationResult(null);
      setSubmittedSuccess(false);
    }
  };

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setCheatAlert(null);

    const timeSpent = currentChallenge.timeLimitMinutes * 60 - timeLeft;

    // Run automated code evaluation engine
    setTimeout(() => {
      const result = AssessmentEngine.evaluateCode(code, currentChallenge, {
        timeSpentSeconds: timeSpent,
        tabSwitchCount,
        copyPasteCount,
      });

      setEvaluationResult(result);
      setIsEvaluating(false);

      // Submit assessment and send directly to recruiting teams
      if (currentUserProfile) {
        submitAssessment({
          candidateId: currentUserProfile.id,
          candidateName: currentUserProfile.name,
          candidateEmail: currentUserProfile.email,
          language: currentChallenge.language,
          challengeId: currentChallenge.id,
          challengeTitle: currentChallenge.title,
          submittedCode: code,
          syntaxValid: result.syntaxValid,
          testCasesPassed: result.testCasesPassed,
          totalTestCases: result.totalTestCases,
          score: result.score,
          timeSpentSeconds: timeSpent,
          tabSwitchCount,
          copyPasteCount,
          cheatSuspicion: result.cheatSuspicion,
          timeComplexity: result.timeComplexity,
          spaceComplexity: result.spaceComplexity,
          memorySafetyNotes: result.memorySafetyNotes,
          verdict: result.verdict,
          personalizedFeedback: result.personalizedFeedback,
        });

        setSubmittedSuccess(true);
      }
    }, 600);
  };

  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Code2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              C & C++ Developer Skill Assessment & Verification
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Automated code quality audit, memory safety analyzer, test suite runner, and anti-cheat telemetry.
          </p>
        </div>

        {/* Challenge Selector & Architecture Blueprint Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPlanModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Implementation Plan (8 Modules)
          </button>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Challenge:</label>
            <select
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
              className="text-xs font-medium py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              {C_CPP_CHALLENGES.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  [{ch.language.toUpperCase()}] {ch.title} ({ch.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive 8-Module Assessment Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[88vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Engineering Specification & Architectural Blueprint
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  C++ & C Skill Assessment Module Implementation Plan
                </h3>
                <p className="text-xs text-slate-300">
                  Comprehensive 8-pillar design specification for candidate proficiency evaluation & recruitment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Proficiency Evaluation */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">1</span>
                    Proficiency Evaluation
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Evaluates candidate depth across core low-level paradigms: raw pointer arithmetic, dynamic heap allocations, RAII destructors, copy semantics, and graph adjacency structures. Candidates are classified into Beginner, Intermediate, and Advanced tiers.
                  </p>
                </div>

                {/* 2. Answer Verification */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">2</span>
                    Answer Verification & Test Harness
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Automated dual-tier test runner executing both transparent sample test suites and hidden edge cases (null pointer boundaries, empty strings, capacity overflow doubling, cyclical graph paths). Verifies exact input-output compliance.
                  </p>
                </div>

                {/* 3. Eligibility Criteria */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">3</span>
                    Eligibility Criteria Enforcement
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Enforces strict criteria cutoffs: <span className="font-semibold text-emerald-700">VERIFIED_ELIGIBLE (Score ≥ 75% & Low Cheat)</span> awards the Verified Developer Badge and priority matching; <span className="font-semibold text-amber-700">ELIGIBLE_WITH_CONDITIONS (50–74%)</span>; and <span className="font-semibold text-rose-700">NOT_ELIGIBLE_UNVERIFIED (&lt;50%)</span> locks critical project positions.
                  </p>
                </div>

                {/* 4. Anti-Cheat Measures */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">4</span>
                    Anti-Cheat Telemetry System
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Real-time client monitoring: Page visibility and window blur listener tracking tab switches; clipboard paste event interceptors; 20-minute countdown timer; and rapid bot-submission velocity detection. Violations increment flags and deduct integrity points.
                  </p>
                </div>

                {/* 5. Automated Code Quality */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">5</span>
                    Automated Code Quality & Memory Safety
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Syntax and memory leak analyzer: Verifies balance between <code className="font-mono text-emerald-700">new[]/delete[]</code> and <code className="font-mono text-emerald-700">malloc/free</code>, detects dangerous functions like <code className="font-mono text-rose-700">gets()</code>, checks boundary validation, and categorizes Big-O Time and Space complexity.
                  </p>
                </div>

                {/* 6. Personalized Feedback */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">6</span>
                    Personalized Constructive Feedback
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Generates customized technical feedback highlighting algorithmic strengths, pinpointed memory hygiene vulnerabilities, defensive pointer recommendations, and actionable next steps for the developer's growth.
                  </p>
                </div>

                {/* 7. Candidate Dashboard */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">7</span>
                    Candidate Dashboard & Scheduling Tracker
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Provides candidates with an all-in-one hub: 4-stage application progress and scheduling status timeline, document management (PDF resume, cover letter, verified certificates), and top algorithm-matched teams based on verified test results.
                  </p>
                </div>

                {/* 8. Reporting to Recruiters */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">8</span>
                    Recruiting Team Dispatch Pipeline
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Upon assessment completion, full candidate reports—including submitted code, test case scores, anti-cheat audit logs, complexity analysis, and verification verdict—are dispatched directly to team leaders and university recruiting coordinators.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheat Telemetry Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
              Automated Integrity & Anti-Cheat System
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Active</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Monitoring tab switches, clipboard paste anomalies, and memory safety invariants.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-amber-300">{formatTimer(timeLeft)}</span>
          </div>

          {/* Tab Switch Counter */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
              tabSwitchCount > 0
                ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <span>Tab Switches:</span>
            <span className="font-bold">{tabSwitchCount}</span>
          </div>

          {/* Copy Paste Counter */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
              copyPasteCount > 0
                ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <span>Paste Count:</span>
            <span className="font-bold">{copyPasteCount}</span>
          </div>
        </div>
      </div>

      {/* Anti-cheat Alert Toast */}
      {cheatAlert && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-lg p-3 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{cheatAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setCheatAlert(null)}
            className="text-amber-700 hover:text-amber-900 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Coding & Problem Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Problem Brief & Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                  {currentChallenge.language.toUpperCase()} • {currentChallenge.difficulty}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentChallenge.testCases.length} Test Criteria
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">{currentChallenge.title}</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {currentChallenge.description}
              </p>
            </div>

            {/* Step by Step Instructions */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Engineering Requirements:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {currentChallenge.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Test Cases Overview */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Verification Test Suites:
              </h3>
              <div className="space-y-2">
                {currentChallenge.testCases.map((tc) => (
                  <div
                    key={tc.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>{tc.description}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          tc.isHidden
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {tc.isHidden ? 'Hidden Edge Case' : 'Public Test'}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-600">
                      Input: {tc.input} ➔ Expected: {tc.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Code Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-md flex flex-col">
            {/* Editor Toolbar */}
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-semibold text-slate-200">
                  solution.{currentChallenge.language === 'cpp' ? 'cpp' : 'c'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="relative p-2 bg-slate-950">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onPaste={handleCopyPaste}
                onCopy={handleCopyPaste}
                rows={16}
                spellCheck={false}
                className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded resize-y leading-relaxed"
                placeholder="// Write your C/C++ solution here..."
              />
            </div>

            {/* Action Bar */}
            <div className="bg-slate-900/90 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Press Run to execute test suite and verify eligibility.
              </div>
              <button
                type="button"
                onClick={handleRunEvaluation}
                disabled={isEvaluating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    Auditing Code & Memory...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run & Submit for Verification
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results & Personalized Recruiting Feedback Display */}
          {evaluationResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Assessment & Verification Results
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Automated feedback and eligibility report sent directly to recruiting teams and team leaders.
                  </p>
                </div>

                {/* Verdict Badge */}
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      evaluationResult.verdict === 'VERIFIED_ELIGIBLE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : evaluationResult.verdict === 'ELIGIBLE_WITH_CONDITIONS'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {evaluationResult.verdict.replace(/_/g, ' ')}
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    Score: {evaluationResult.score}%
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 font-medium">Test Cases Passed</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {evaluationResult.testCasesPassed} / {evaluationResult.totalTestCases}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 font-medium">Time Complexity</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {evaluationResult.timeComplexity}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 font-medium">Space Complexity</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {evaluationResult.spaceComplexity}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 font-medium">Anti-Cheat Suspicion</div>
                  <div
                    className={`text-sm font-bold mt-1 ${
                      evaluationResult.cheatSuspicion === 'LOW'
                        ? 'text-emerald-700'
                        : evaluationResult.cheatSuspicion === 'MEDIUM'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {evaluationResult.cheatSuspicion} Risk
                  </div>
                </div>
              </div>

              {/* Memory Safety Feedback */}
              {evaluationResult.memorySafetyNotes.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Memory Safety Observations:
                  </div>
                  <ul className="list-disc list-inside text-rose-700">
                    {evaluationResult.memorySafetyNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Personalized Recruiting Team Feedback */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Personalized Candidate Feedback (Forwarded to Recruiting Team):
                  </span>
                  {submittedSuccess && (
                    <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Forwarded
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-900/90 leading-relaxed italic">
                  "{evaluationResult.personalizedFeedback}"
                </p>
              </div>

              {submittedSuccess && (
                <div className="text-xs text-slate-500 bg-emerald-50 text-emerald-800 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Your candidate profile and verified score have been updated. Team leaders will see
                  your verification status during application reviews!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
