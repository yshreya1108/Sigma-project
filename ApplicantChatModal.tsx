import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Sparkles,
  FileText,
  User,
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface ApplicantChatModalProps {
  applicationId: string;
  onClose: () => void;
}

export const ApplicantChatModal: React.FC<ApplicantChatModalProps> = ({
  applicationId,
  onClose,
}) => {
  const {
    applications,
    teams,
    students,
    chatThreads,
    sendChatMessage,
    approveApplication,
    rejectApplication,
    currentUserId,
    role,
  } = useApp();

  const [messageText, setMessageText] = useState('');

  const app = applications.find((a) => a.id === applicationId);
  if (!app) return null;

  const team = teams.find((t) => t.id === app.teamId);
  const applicant = students.find((s) => s.id === app.studentId);
  const thread = chatThreads[applicationId];
  const messages = thread ? thread.messages : [];

  const isLeader = team ? team.leaderId === currentUserId : role === 'TEAM_LEADER';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendChatMessage(applicationId, messageText);
    setMessageText('');
  };

  const handleApprove = () => {
    approveApplication(applicationId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {isLeader ? `Applicant Interview: ${app.studentName}` : `Chat with Team Leader: ${team?.leaderName}`}
                </h3>
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                    app.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Team: <span className="font-semibold text-white">{app.teamTitle}</span> • Compatibility:{' '}
                <span className="text-indigo-400 font-bold">{app.matchScore}%</span>
              </p>
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

        {/* Candidate Snapshot Bar */}
        {applicant && (
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <UserAvatar
                name={applicant.name}
                size="xs"
                isVerified={applicant.assessmentStatus?.cppVerified}
                showBadge
              />
              <span className="font-semibold text-slate-800">{applicant.name}</span>
              <span className="text-slate-400">({applicant.department})</span>
            </div>
            <div className="flex items-center gap-2">
              {applicant.assessmentStatus?.cppVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified C++ ({applicant.assessmentStatus.score}%)
                </span>
              )}
              {applicant.resumeFileName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
                  <FileText className="w-3 h-3" /> Resume Attached
                </span>
              )}
            </div>
          </div>
        )}

        {/* Notice on Transferred Chat */}
        {thread?.transferredToTeamChat && (
          <div className="bg-emerald-50 text-emerald-800 px-4 py-2 border-b border-emerald-200 text-xs font-medium flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Candidate approved! This conversation is now synchronized directly into the official Team Room.
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {msg.senderName} ({msg.senderRole}) • {msg.timestamp}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leader Approval Bar (if pending) */}
        {isLeader && app.status === 'PENDING' && (
          <div className="bg-indigo-50 border-t border-indigo-100 p-3 flex items-center justify-between gap-3 text-xs">
            <span className="text-indigo-950 font-medium">
              Ready to welcome {app.studentName} into {app.teamTitle}?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => rejectApplication(app.id)}
                className="px-3 py-1.5 rounded-lg font-semibold text-rose-700 hover:bg-rose-100"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" /> Approve & Transfer to Team
              </button>
            </div>
          </div>
        )}

        {/* Message Input Box */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
