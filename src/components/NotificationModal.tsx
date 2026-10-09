import React from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, X, Check } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCheckIn?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToCheckIn
}) => {
  const { notifications, markNotificationsRead } = useAccountability();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'partner_checkin':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'nudge':
        return <Bell className="w-4 h-4 text-amber-400" />;
      case 'recovery':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'match_ready':
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-zinc-100">Notifications & Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsRead}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 rounded hover:bg-zinc-800"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              No recent notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border text-xs transition ${
                  notif.read
                    ? 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400'
                    : 'bg-zinc-900 border-zinc-700/80 text-zinc-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getIcon(notif.type)}
                    <span className="font-semibold text-zinc-200">{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0">{notif.timeAgo}</span>
                </div>
                <p className="mt-1 text-zinc-300 leading-relaxed pl-6">
                  {notif.message}
                </p>
                {notif.actionText && (
                  <div className="mt-2 pl-6 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        if (onNavigateToCheckIn) onNavigateToCheckIn();
                      }}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[11px] font-medium transition"
                    >
                      {notif.actionText}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
