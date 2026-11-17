import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LearningPathEngine } from '../lib/learningPathEngine';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Code2,
  AlertTriangle,
  ShieldCheck,
  BookMarked,
  Clock,
  ArrowRight,
  Cpu,
  GitBranch,
  Award,
  Users,
  Terminal,
  Check,
  CircleDot,
  Lock,
  Sparkles,
  FileCode,
} from 'lucide-react';

interface CandidateLearningPathProps {
  onNavigateToAssessment: () => void;
}

export const CandidateLearningPath: React.FC<CandidateLearningPathProps> = ({
  onNavigateToAssessment,
}) => {
  const { currentUserProfile, assessmentSubmissions, applications } = useApp();

  if (!currentUserProfile) return null;

  const learningData = LearningPathEngine.generateLearningPath(
    currentUserProfile,
    assessmentSubmissions
  );

  // Persistent mastered topic IDs in localStorage per candidate
  const storageKey = `skillmatch_mastered_${currentUserProfile.id}`;
  const [masteredTopicIds, setMasteredTopicIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(masteredTopicIds));
  }, [masteredTopicIds, storageKey]);

  // Compute the 5-stage Learning Path Progress Visualizer data
  const roadmap = LearningPathEngine.calculateRoadmapProgress(
    currentUserProfile,
    assessmentSubmissions,
    masteredTopicIds,
    applications
  );

  // Selected stage in the visualizer (defaults to current active stage)
  const [selectedStageId, setSelectedStageId] = useState<string>(roadmap.currentStageId);

  // Selected category filter for tutorial cards below
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Active code preview mode per topic: 'vulnerable' | 'fixed'
  const [codePreviewMode, setCodePreviewMode] = useState<Record<string, 'vulnerable' | 'fixed'>>({});

  const toggleMastered = (topicId: string) => {
    setMasteredTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const setTopicCodeMode = (topicId: string, mode: 'vulnerable' | 'fixed') => {
    setCodePreviewMode((prev) => ({ ...prev, [topicId]: mode }));
  };

  const totalTopics = learningData.topics.length;
  const completedCount = learningData.topics.filter((t) => masteredTopicIds.includes(t.id)).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const activeStage =
    roadmap.stages.find((s) => s.id === selectedStageId) ||
    roadmap.stages.find((s) => s.id === roadmap.currentStageId) ||
    roadmap.stages[0];

  const getStageIcon = (stepNumber: number, className = 'w-4 h-4') => {
    switch (stepNumber) {
      case 1:
        return <Terminal className={className} />;
      case 2:
        return <Cpu className={className} />;
      case 3:
        return <GitBranch className={className} />;
      case 4:
        return <ShieldCheck className={className} />;
      case 5:
      default:
        return <Users className={className} />;
    }
  };

  const filteredTopics = learningData.topics.filter((topic) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'HIGH_PRIORITY') return topic.priority === 'HIGH';
    if (selectedCategory === 'MASTERED') return masteredTopicIds.includes(topic.id);
    return topic.category === selectedCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Learning Path Progress Visualizer • C/C++ to Team Readiness
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {learningData.headline}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {learningData.overallRecommendation}
          </p>
        </div>

        {/* Overall Readiness & Topic Mastery Summary Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 min-w-[300px] space-y-2.5">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold text-slate-700">Collaboration Readiness</span>
            <span className="font-extrabold text-indigo-600">
              {roadmap.overallReadinessPercent}% Ready ({roadmap.completedStagesCount}/{roadmap.totalStagesCount} Tiers)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${roadmap.overallReadinessPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-500">
            <span>
              Topics Mastered: <strong className="text-slate-700">{completedCount}/{totalTopics}</strong> ({progressPercent}%)
            </span>
            <button
              type="button"
              onClick={onNavigateToAssessment}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Verify in IDE <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5-STAGE LEARNING PATH PROGRESS VISUALIZER                             */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-5">
        {/* Visualizer Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              {roadmap.readinessTierTitle}
            </div>
            <p className="text-xs text-slate-600">{roadmap.readinessSummary}</p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> In Progress
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Upcoming
            </span>
          </div>
        </div>

        {/* 5-Stage Interactive Progression Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {roadmap.stages.map((stage, idx) => {
            const isSelected = activeStage.id === stage.id;
            const isMastered = stage.status === 'MASTERED';
            const isInProgress = stage.status === 'IN_PROGRESS';

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`text-left rounded-xl p-3.5 border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                    : isMastered
                    ? 'bg-emerald-50/50 border-emerald-200 hover:bg-white hover:border-emerald-300'
                    : isInProgress
                    ? 'bg-white border-indigo-200 hover:border-indigo-400'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div>
                  {/* Top Row: Step Icon & Status Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isMastered
                          ? 'bg-emerald-600 text-white'
                          : isInProgress
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isMastered ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        getStageIcon(stage.stepNumber, 'w-3.5 h-3.5')
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isMastered
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isMastered
                        ? 'Mastered'
                        : isInProgress
                        ? 'Active Tier'
                        : 'Unlocked'}
                    </span>
                  </div>

                  {/* Stage Title & Tier */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stage {idx + 1} of {roadmap.stages.length}
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                    {stage.shortTitle.replace(/^\d+\.\s*/, '')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                    {stage.subtitle}
                  </div>
                </div>

                {/* Stage Mini Progress Bar */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                    <span className="text-slate-500">
                      {stage.checkpoints.filter((c) => c.completed).length}/{stage.checkpoints.length} Milestones
                    </span>
                    <span
                      className={
                        isMastered
                          ? 'text-emerald-700 font-bold'
                          : isInProgress
                          ? 'text-indigo-600 font-bold'
                          : 'text-slate-500'
                      }
                    >
                      {stage.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isMastered
                          ? 'bg-emerald-500'
                          : isInProgress
                          ? 'bg-indigo-600'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${stage.progressPercent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detailed Inspector Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeStage.tierLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  <FileCode className="w-3 h-3 text-indigo-600" />
                  Architecture Ref: {activeStage.cppModuleRef}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{activeStage.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{activeStage.subtitle}</p>
            </div>

            {/* Key Concepts Badges */}
            <div className="flex flex-wrap gap-1.5">
              {activeStage.keyConcepts.map((concept) => (
                <span
                  key={concept}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Stage Checkpoints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeStage.checkpoints.map((cp) => {
              const canToggleTopic = Boolean(cp.linkedTopicId);
              return (
                <div
                  key={cp.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    cp.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {cp.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <CircleDot className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {cp.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                      {cp.detail}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        cp.completed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cp.completed ? 'Completed' : 'In Progress'}
                    </span>

                    {canToggleTopic && cp.linkedTopicId && (
                      <button
                        type="button"
                        onClick={() => toggleMastered(cp.linkedTopicId!)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-md border transition-colors ${
                          cp.completed
                            ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {cp.completed ? 'Completed ✓' : 'Mark Concept Mastered'}
                      </button>
                    )}

                    {!canToggleTopic && !cp.completed && cp.actionType === 'TAKE_ASSESSMENT' && (
                      <button
                        type="button"
                        onClick={onNavigateToAssessment}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        Open C++ IDE <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended Next Step Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong className="text-slate-800">Stage Guidance:</strong> {activeStage.nextActionText}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {activeStage.progressPercent}% of {activeStage.shortTitle} Complete
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 scrollbar-none">
        <span className="text-slate-500 shrink-0 font-medium">Filter Modules:</span>
        {[
          { id: 'ALL', label: `All Topics (${totalTopics})` },
          { id: 'HIGH_PRIORITY', label: 'High Priority Areas' },
          { id: 'Memory Safety', label: 'Memory Safety & Leaks' },
          { id: 'Pointer Mechanics', label: 'Pointer Mechanics' },
          { id: 'Algorithms & Complexity', label: 'Algorithms & BFS' },
          { id: 'Defensive Coding', label: 'Defensive Coding' },
          { id: 'MASTERED', label: `Mastered (${completedCount})` },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Learning Topics List */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const isMastered = masteredTopicIds.includes(topic.id);
          const currentMode = codePreviewMode[topic.id] || 'fixed';

          return (
            <div
              key={topic.id}
              className={`rounded-xl border transition-all duration-200 p-5 ${
                isMastered
                  ? 'bg-slate-50/60 border-slate-200 opacity-95'
                  : topic.priority === 'HIGH'
                  ? 'bg-white border-amber-300 ring-1 ring-amber-100 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Topic Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                        topic.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {topic.priority === 'HIGH' ? 'High Priority Area' : 'Recommended Topic'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {topic.category}
                    </span>
                    {isMastered && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Topic Mastered
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{topic.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                {/* Mark as Mastered Toggle */}
                <button
                  type="button"
                  onClick={() => toggleMastered(topic.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors border ${
                    isMastered
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`}
                  />
                  {isMastered ? 'Completed' : 'Mark as Mastered'}
                </button>
              </div>

              {/* Assessment Diagnosis Callout */}
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 mb-4 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Assessment Diagnosis & Impact: </span>
                  <span className="text-amber-800">{topic.diagnosedIssue}</span>
                </div>
              </div>

              {/* Two-Column Detail: Tutorials & Code Sandbox */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                {/* Left: Recommended Tutorials & Official Documentation */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
                    Curated Tutorials & Documentation:
                  </div>

                  <div className="space-y-2">
                    {topic.tutorials.map((tut, i) => (
                      <a
                        key={i}
                        href={tut.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all flex items-start justify-between gap-2 group block"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <span>{tut.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-slate-600">{tut.source}</span>
                            <span>•</span>
                            <span className="text-indigo-600 font-medium">{tut.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5 text-slate-400" /> {tut.readTime}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right: Interactive Code Comparison Sandbox */}
                <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                  {/* Code Switcher Bar */}
                  <div className="bg-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono text-[11px] font-semibold text-slate-300">
                        Code Pattern Analysis
                      </span>
                    </div>

                    <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setTopicCodeMode(topic.id, 'vulnerable')}
                        className={`px-2 py-0.5 rounded font-medium transition-colors ${
                          currentMode === 'vulnerable'
                            ? 'bg-rose-900 text-rose-200 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Vulnerable Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setTopicCodeMode(topic.id, 'fixed')}
                        className={`px-2 py-0.5 rounded font-medium transition-colors ${
                          currentMode === 'fixed'
                            ? 'bg-emerald-800 text-emerald-100 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Safe Idiomatic Fix
                      </button>
                    </div>
                  </div>

                  {/* Code Body */}
                  <pre className="p-3.5 overflow-x-auto font-mono text-[11px] leading-relaxed text-emerald-300 bg-slate-950">
                    <code>
                      {currentMode === 'vulnerable'
                        ? topic.codeComparison.vulnerableSnippet
                        : topic.codeComparison.fixedSnippet}
                    </code>
                  </pre>

                  {/* Technical Rationale Footer */}
                  <div className="px-3.5 py-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-300">
                    <span className="font-bold text-slate-200">Engineering Rule: </span>
                    {topic.codeComparison.explanation}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
