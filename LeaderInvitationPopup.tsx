import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  MessageSquare,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface LeaderInvitationPopupProps {
  onOpenChat: (applicationId: string) => void;
}

export const LeaderInvitationPopup: React.FC<LeaderInvitationPopupProps> = ({
  onOpenChat,
}) => {
  const { activeNotificationPopup, clearNotificationPopup, role } = useApp();

  if (!activeNotificationPopup) return null;

  const handleAction = () => {
    if (activeNotificationPopup.actionPayload?.applicationId) {
      onOpenChat(activeNotificationPopup.actionPayload.applicationId);
    }
    clearNotificationPopup();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/40 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded bg-indigo-500/30 text-indigo-300">
                Team Leader Notice
              </span>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <h4 className="text-xs font-bold text-white mt-1">
              {activeNotificationPopup.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              {activeNotificationPopup.message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearNotificationPopup}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={clearNotificationPopup}
          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
        >
          Dismiss
        </button>
        <button
          type="button"
          onClick={handleAction}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Open Chat & Review
        </button>
      </div>
    </div>
  );
};
