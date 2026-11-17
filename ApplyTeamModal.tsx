import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Team } from '../lib/types';
import { MatchingEngine, defaultSkillGraph } from '../lib/graphEngine';
import {
  X,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
} from 'lucide-react';

interface ApplyTeamModalProps {
  team: Team;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyTeamModal: React.FC<ApplyTeamModalProps> = ({
  team,
  onClose,
  onSuccess,
}) => {
  const { currentUserProfile, applyToTeam } = useApp();

  const [message, setMessage] = useState(
    `Hello ${team.leaderName}! I am interested in joining ${team.title}. I have attached my resume and verified credentials for your review.`
  );
  const [submitting, setSubmitting] = useState(false);

  if (!currentUserProfile) return null;

  const matchInfo = MatchingEngine.calculateDetailedScore(
    currentUserProfile.skills,
    team.requiredSkills,
    defaultSkillGraph
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const success = applyToTeam(team.id, message);
    setSubmitting(false);

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Team Invitation Application
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">{team.title}</h2>
            <div className="text-xs text-slate-300">
              Leader: {team.leaderName} • {team.department}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Match Score Banner */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-bold text-slate-900">
                  Calculated Compatibility: {matchInfo.score}%
                </div>
                <div className="text-[11px] text-slate-600">
                  Computed by C++ Graph & Matching Priority Queue Engine
                </div>
              </div>
            </div>
            <span className="text-base font-black text-indigo-700">{matchInfo.score}%</span>
          </div>

          {/* Breakdown Pills */}
          <div>
            <div className="font-semibold text-slate-700 mb-1.5">Required Skills Matching:</div>
            <div className="flex flex-wrap gap-1">
              {matchInfo.breakdown.map((b, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    b.matchType === 'exact'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : b.matchType === 'related'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {b.required}: {b.matchType === 'exact' ? '100% Exact' : b.matchType === 'related' ? '75% Related' : 'Unmatched'}
                </span>
              ))}
            </div>
          </div>

          {/* Candidate Verified Assessment Notice */}
          {currentUserProfile.assessmentStatus?.cppVerified && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Verified C++ Test Score ({currentUserProfile.assessmentStatus.score}%) and anti-cheat cleared status will be highlighted to {team.leaderName}!
              </span>
            </div>
          )}

          {/* Personal Statement */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Personal Invitation Message to Team Leader:
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Submitting this will initiate an instant 1-on-1 interview chat with the team leader.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
