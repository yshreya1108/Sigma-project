import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile } from '../lib/types';
import {
  X,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Github,
  Linkedin,
  Award,
  ExternalLink,
  Flag,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { UserAvatar, AVATAR_EMOJI_OPTIONS } from './UserAvatar';

interface StudentProfileModalProps {
  profile: StudentProfile;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  profile,
  onClose,
}) => {
  const {
    currentUserProfile,
    fileReport,
    blockUser,
    reports,
    role,
    adminDeleteUser,
    updateStudentProfile,
  } = useApp();

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('Fraudulent credentials or fake GitHub');
  const [reportDetails, setReportDetails] = useState('');
  const [reportedSuccess, setReportedSuccess] = useState(false);
  const [isBlocked, setIsBlocked] = useState(
    currentUserProfile?.blockedUsers?.includes(profile.id) || false
  );

  // Check if current user already reported this profile
  const myExistingReport = reports.find(
    (r) => r.reportedUserId === profile.id && r.reporterId === currentUserProfile?.id
  );

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    fileReport(profile.id, profile.name, reportReason, reportDetails);
    setReportedSuccess(true);
    setShowReportForm(false);
  };

  const handleBlockToggle = () => {
    blockUser(profile.id);
    setIsBlocked(true);
  };

  const isSelf = currentUserProfile?.id === profile.id;
  const activeProfile = isSelf && currentUserProfile ? currentUserProfile : profile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <UserAvatar
              name={activeProfile.name}
              avatar={activeProfile.avatar}
              size="xl"
              isVerified={activeProfile.assessmentStatus?.cppVerified}
              showBadge
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white">{activeProfile.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  ID: {activeProfile.studentIdNum}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                {activeProfile.department} • {activeProfile.year}
              </p>
              <div className="text-xs text-slate-300 mt-0.5">{activeProfile.email}</div>
            </div>
          </div>

          {isSelf && currentUserProfile && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-indigo-200">
                Choose Profile Emoji / Avatar:
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {AVATAR_EMOJI_OPTIONS.map((opt) => (
                  <button
                    key={opt.emoji}
                    type="button"
                    onClick={() =>
                      updateStudentProfile({
                        ...currentUserProfile,
                        avatar: opt.emoji,
                      })
                    }
                    title={opt.label}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${
                      (currentUserProfile.avatar || '👨‍💻') === opt.emoji
                        ? 'bg-indigo-500 text-white ring-2 ring-white/60 scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-700'
                    }`}
                  >
                    {opt.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* Bio */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              About & Experience
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {profile.bio || 'Student at Graphic Era University seeking collaborative engineering projects.'}
            </p>
          </div>

          {/* C/C++ Assessment Badge */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Skill Verification Assessment
            </h4>
            {profile.assessmentStatus?.cppVerified ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-bold text-emerald-900">
                      Verified C/C++ Developer ({profile.assessmentStatus.score}%)
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      Anti-Cheat Cleared (0 flags) • {profile.assessmentStatus.feedbackSummary || 'Algorithms & RAII verified'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  VERIFIED
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
                Candidate has not completed the automated C/C++ skill verification test yet.
              </div>
            )}
          </div>

          {/* Technical Skills & Interests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Skills & Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Interests & Availability
              </h4>
              <div className="text-slate-600 space-y-1">
                <div>
                  <span className="font-semibold text-slate-700">Commitment:</span>{' '}
                  {profile.availability || 'Flexible'}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Interests:</span>{' '}
                  {profile.interests.join(', ') || 'Systems programming, Algorithms'}
                </div>
              </div>
            </div>
          </div>

          {/* External Links & Portfolio */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Portfolio & External Profiles
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800"
                >
                  <Github className="w-3.5 h-3.5" /> View GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                </a>
              )}
              {profile.resumeFileName && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
                  <FileText className="w-3.5 h-3.5" /> Resume: {profile.resumeFileName}
                </span>
              )}
            </div>
          </div>

          {/* Reporting & Moderation Notice (Only visible to Reporter and Admin) */}
          {!isSelf && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Safety & Profile Trust</h4>
                  <p className="text-[11px] text-slate-500">
                    If this profile exhibits fake claims or impersonation, report it directly to University Admin.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBlockToggle}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 border ${
                      isBlocked
                        ? 'bg-slate-200 text-slate-600 border-slate-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    {isBlocked ? 'Blocked' : 'Block User'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="px-3 py-1.5 rounded-lg font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-1"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Report Profile
                  </button>
                </div>
              </div>

              {/* Status of report filed by current user */}
              {(myExistingReport || reportedSuccess) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Confidential Report Filed
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Your report about this account is visible ONLY to you and the system administrator.
                    The admin will review the credentials and take appropriate moderation action.
                  </p>
                </div>
              )}

              {/* Report Input Form */}
              {showReportForm && (
                <form
                  onSubmit={handleReportSubmit}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="font-bold text-slate-900 text-xs">File Confidential Report to Admin</div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Violation Category:
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      <option value="Fraudulent credentials or fake GitHub">
                        Fraudulent credentials or fake GitHub link
                      </option>
                      <option value="Plagiarized project portfolio / fake experience">
                        Plagiarized project portfolio / fake experience
                      </option>
                      <option value="Inaccurate or false skill claims">
                        Inaccurate or false skill claims
                      </option>
                      <option value="Impersonation or abusive behavior">
                        Impersonation or abusive behavior
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Supporting Details for Admin:
                    </label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Explain what was incorrect or suspicious about this account..."
                      rows={2}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReportForm(false)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Admin Supreme Action */}
          {role === 'ADMIN' && (
            <div className="pt-4 border-t border-rose-200 flex items-center justify-between bg-rose-50/50 p-3 rounded-xl">
              <span className="text-xs font-bold text-rose-900">
                Administrator Authority:
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Permanently purge and delete profile for ${profile.name}?`)) {
                    adminDeleteUser(profile.id);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 text-xs flex items-center gap-1"
              >
                <Ban className="w-3.5 h-3.5" />
                Delete Profile Permanently
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
