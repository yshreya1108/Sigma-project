import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Team, StudentProfile } from '../lib/types';
import { MatchingEngine, defaultSkillGraph } from '../lib/graphEngine';
import {
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Send,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

interface TeamExplorerProps {
  onOpenApplyModal: (team: Team) => void;
  onOpenChatModal: (applicationId: string) => void;
  onOpenTeamPage: (team: Team) => void;
}

export const TeamExplorer: React.FC<TeamExplorerProps> = ({
  onOpenApplyModal,
  onOpenChatModal,
  onOpenTeamPage,
}) => {
  const { teams, currentUserProfile, applications, role } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [vacancyFilter, setVacancyFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [sortBy, setSortBy] = useState<'MATCH' | 'VACANCY' | 'DEADLINE' | 'TITLE'>('MATCH');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');

  // Compute department list with counts
  const departments = useMemo(() => {
    const map = new Map<string, number>();
    teams.forEach((t) => {
      map.set(t.department, (map.get(t.department) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [teams]);

  // Compute skill list with frequency
  const popularSkills = useMemo(() => {
    const skillCount = new Map<string, number>();
    teams.forEach((t) => {
      t.requiredSkills.forEach((req) => {
        req.split('|').forEach((s) => {
          const trimmed = s.trim();
          skillCount.set(trimmed, (skillCount.get(trimmed) || 0) + 1);
        });
      });
    });
    return Array.from(skillCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([s]) => s);
  }, [teams]);

  // Map student applications for fast lookup
  const studentAppMap = useMemo(() => {
    const map = new Map<string, { status: string; id: string }>();
    if (!currentUserProfile) return map;
    applications
      .filter((a) => a.studentId === currentUserProfile.id)
      .forEach((a) => {
        map.set(a.teamId, { status: a.status, id: a.id });
      });
    return map;
  }, [applications, currentUserProfile]);

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    const studentSkills = currentUserProfile ? currentUserProfile.skills : [];

    return teams
      .map((team) => {
        // Calculate match score
        const matchInfo = MatchingEngine.calculateDetailedScore(
          studentSkills,
          team.requiredSkills,
          defaultSkillGraph
        );
        return {
          ...team,
          matchScore: matchInfo.score,
          matchBreakdown: matchInfo.breakdown,
        };
      })
      .filter((team) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = team.title.toLowerCase().includes(q);
          const matchDesc = team.description.toLowerCase().includes(q);
          const matchDept = team.department.toLowerCase().includes(q);
          const matchSkills = team.requiredSkills.some((s) => s.toLowerCase().includes(q));
          const matchLeader = team.leaderName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchDept && !matchSkills && !matchLeader) {
            return false;
          }
        }

        // Department filter
        if (selectedDept !== 'ALL' && team.department !== selectedDept) {
          return false;
        }

        // Vacancy filter
        if (vacancyFilter === 'OPEN' && (!team.vacancyOpen || team.members.length >= team.teamSize)) {
          return false;
        }
        if (vacancyFilter === 'CLOSED' && team.vacancyOpen && team.members.length < team.teamSize) {
          return false;
        }

        // Specific skill filter
        if (selectedSkillFilter !== 'ALL') {
          const hasSkill = team.requiredSkills.some((req) =>
            req.toLowerCase().includes(selectedSkillFilter.toLowerCase())
          );
          if (!hasSkill) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'MATCH') {
          return b.matchScore - a.matchScore;
        }
        if (sortBy === 'VACANCY') {
          const aSpots = Math.max(0, a.teamSize - a.members.length);
          const bSpots = Math.max(0, b.teamSize - b.members.length);
          return bSpots - aSpots;
        }
        if (sortBy === 'DEADLINE') {
          return a.deadline.localeCompare(b.deadline);
        }
        return a.title.localeCompare(b.title);
      });
  }, [
    teams,
    currentUserProfile,
    searchQuery,
    selectedDept,
    vacancyFilter,
    selectedSkillFilter,
    sortBy,
  ]);

  return (
    <div className="space-y-6">
      {/* Hero Banner with University Context */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-4">
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            Graphic Era University • B.Tech Project Matching Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Find Your Ideal Academic Project Team ({teams.length}+ Teams Available)
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed mb-6">
            Powered by our C++ Graph Relationship & Priority Queue Engine. Compatibility scores are
            calculated considering exact skills (100%), related graph skills (75%), and verified
            C/C++ proficiency tests.
          </p>

          {currentUserProfile && (
            <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-indigo-400/20">
              <span className="font-semibold text-indigo-300">Logged in as:</span>
              <span className="font-bold text-white">{currentUserProfile.name}</span>
              <span className="text-slate-400">({currentUserProfile.department})</span>
              <span className="text-indigo-400">•</span>
              <span className="text-slate-300">Your Skills:</span>
              <div className="flex flex-wrap gap-1">
                {currentUserProfile.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-medium text-[11px]"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {currentUserProfile.assessmentStatus?.cppVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified C++ (
                  {currentUserProfile.assessmentStatus.score}%)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters Control Center */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ teams by title, tech stack, keyword, or leader..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Department Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="ALL">All Departments ({teams.length})</option>
              {departments.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.count})
                </option>
              ))}
            </select>
          </div>

          {/* Vacancy Filter */}
          <div className="md:col-span-2">
            <select
              value={vacancyFilter}
              onChange={(e) => setVacancyFilter(e.target.value as any)}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="ALL">All Vacancies</option>
              <option value="OPEN">Open Only</option>
              <option value="CLOSED">Closed Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-indigo-700"
            >
              <option value="MATCH">Sort: Best Match</option>
              <option value="VACANCY">Sort: Spots Left</option>
              <option value="DEADLINE">Sort: Deadline</option>
              <option value="TITLE">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Popular Skill Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none text-xs">
          <span className="text-slate-500 shrink-0 font-medium">Filter by Skill:</span>
          <button
            type="button"
            onClick={() => setSelectedSkillFilter('ALL')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              selectedSkillFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {popularSkills.map((sk) => (
            <button
              key={sk}
              type="button"
              onClick={() => setSelectedSkillFilter(sk)}
              className={`px-2.5 py-1 rounded-full font-medium shrink-0 transition-colors ${
                selectedSkillFilter === sk
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredTeams.length}</span> of{' '}
          <span className="font-bold text-slate-800">{teams.length}</span> university teams
        </div>
        {currentUserProfile && (
          <div className="text-indigo-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Real-time Compatibility Ranked
          </div>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team) => {
          const spotsLeft = Math.max(0, team.teamSize - team.members.length);
          const isFullOrClosed = !team.vacancyOpen || spotsLeft === 0;
          const isCurrentUserMember = currentUserProfile
            ? team.members.some((m) => m.id === currentUserProfile.id)
            : false;
          const existingApp = studentAppMap.get(team.id);

          return (
            <div
              key={team.id}
              onClick={() => onOpenTeamPage(team)}
              className={`group bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer ${
                isFullOrClosed
                  ? 'border-slate-200 opacity-90 hover:border-indigo-300'
                  : team.matchScore >= 80
                  ? 'border-indigo-300 ring-1 ring-indigo-200/50 hover:border-indigo-500'
                  : 'border-slate-200 hover:border-indigo-400'
              }`}
            >
              {/* Card Header Gradient & Department Tag */}
              <div>
                <div className={`h-2.5 bg-gradient-to-r ${team.bannerGradient}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {team.department}
                    </span>

                    {/* Vacancy Pill */}
                    {isFullOrClosed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3" /> Vacancy Closed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {spotsLeft} Spot{spotsLeft > 1 ? 's' : ''} Open
                      </span>
                    )}
                  </div>

                  {/* Title & Match Score Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {team.title}
                    </h3>

                    {currentUserProfile && (
                      <div
                        className={`shrink-0 px-2 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${
                          team.matchScore >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : team.matchScore >= 50
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                        title="Algorithm Match Score"
                      >
                        <Sparkles className="w-3 h-3" />
                        {team.matchScore}%
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {team.description}
                  </p>

                  {/* Required Skills */}
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Required Skills & OR Criteria:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {team.requiredSkills.map((req, idx) => {
                        const breakdown = team.matchBreakdown?.find((b) => b.required === req);
                        const isExact = breakdown?.matchType === 'exact';
                        const isRelated = breakdown?.matchType === 'related';

                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              isExact
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : isRelated
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                            title={
                              isExact
                                ? 'Exact Match (100%)'
                                : isRelated
                                ? `Related Match (75%) with ${breakdown?.matchedSkill}`
                                : 'Requirement'
                            }
                          >
                            {req}
                            {isExact && ' ✓'}
                            {isRelated && ' ~'}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Leader and Team Roster Info */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Lead: </span>
                      <span className="font-semibold text-slate-800">{team.leaderName}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      {team.members.length}/{team.teamSize} members
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTeamPage(team);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Project Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {/* State specific buttons */}
                {isCurrentUserMember ? (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Current Member
                  </span>
                ) : existingApp ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChatModal(existingApp.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    {existingApp.status === 'APPROVED' ? 'Open Team Chat' : 'Applicant Chat'}
                  </button>
                ) : isFullOrClosed ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTeamPage(team);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                  >
                    View Project Page
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenApplyModal(team);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                  >
                    Apply for Invite
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
