import React, { useState } from 'react';
import { AccountabilityProvider, useAccountability } from './context/AccountabilityContext';
import { TodayView } from './components/TodayView';
import { PartnerView } from './components/PartnerView';
import { MeView } from './components/MeView';
import { MatchmakerView } from './components/MatchmakerView';
import { AuthSetupView } from './components/AuthSetupView';
import { CheckInModal } from './components/CheckInModal';
import { GoalModal } from './components/GoalModal';
import { RematchModal } from './components/RematchModal';
import { NotificationModal } from './components/NotificationModal';
import { Calendar, Users, User, Bell } from 'lucide-react';

type TabType = 'today' | 'partner' | 'me';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    partnership,
    unreadNotifsCount
  } = useAccountability();

  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isRematchOpen, setIsRematchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // If not logged in, show Phase 1 Auth & Setup
  if (!isAuthenticated) {
    return (
      <AuthSetupView
        onComplete={() => {
          setShowMatchmaker(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-lg w-full mx-auto bg-zinc-950 px-4 pt-4 pb-24 sm:px-6">
        
        {/* Top Header */}
        <header className="py-2.5 mb-3 flex items-center justify-between border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-tight text-zinc-100">PACT</span>
            <span className="text-[10px] text-zinc-500 font-mono">Free V1</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-200 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('me')}
              className="flex items-center gap-1.5 p-1 rounded-full text-zinc-400 hover:text-zinc-200 transition"
              title="View Profile & Settings"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-zinc-700"
              />
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1">
          {showMatchmaker ? (
            <MatchmakerView
              onPactActivated={() => {
                setShowMatchmaker(false);
                setActiveTab('today');
              }}
              onCancel={() => setShowMatchmaker(false)}
            />
          ) : (
            <>
              {activeTab === 'today' && (
                <TodayView
                  onOpenCheckIn={() => setIsCheckInOpen(true)}
                  onOpenMatchmaker={() => setShowMatchmaker(true)}
                  onOpenPartnerTab={() => setActiveTab('partner')}
                  onOpenHistory={() => setActiveTab('me')}
                />
              )}

              {activeTab === 'partner' && (
                <PartnerView
                  onOpenCheckIn={() => setIsCheckInOpen(true)}
                  onOpenRematch={() => setIsRematchOpen(true)}
                  onOpenMatchmaker={() => setShowMatchmaker(true)}
                />
              )}

              {activeTab === 'me' && (
                <MeView
                  onOpenGoalModal={() => setIsGoalModalOpen(true)}
                  onOpenMatchmaker={() => setShowMatchmaker(true)}
                />
              )}
            </>
          )}
        </main>

        {/* 3-Tab Bottom Navigation (Today | Partner | Me) */}
        {!showMatchmaker && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 max-w-lg mx-auto">
            <div className="grid grid-cols-3 py-2 px-6">
              {/* 1. Today */}
              <button
                onClick={() => setActiveTab('today')}
                className={`flex flex-col items-center justify-center py-1 transition ${
                  activeTab === 'today'
                    ? 'text-emerald-400 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Calendar className="w-5 h-5 mb-0.5" />
                <span className="text-[11px]">Today</span>
              </button>

              {/* 2. Partner */}
              <button
                onClick={() => setActiveTab('partner')}
                className={`flex flex-col items-center justify-center py-1 transition ${
                  activeTab === 'partner'
                    ? 'text-emerald-400 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Users className="w-5 h-5 mb-0.5" />
                <span className="text-[11px]">Partner</span>
              </button>

              {/* 3. Me */}
              <button
                onClick={() => setActiveTab('me')}
                className={`flex flex-col items-center justify-center py-1 transition ${
                  activeTab === 'me'
                    ? 'text-emerald-400 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <User className="w-5 h-5 mb-0.5" />
                <span className="text-[11px]">Me</span>
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Modals & Dialogs */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <RematchModal
        isOpen={isRematchOpen}
        onClose={() => setIsRematchOpen(false)}
        onSwitchToMatchmaker={() => setShowMatchmaker(true)}
      />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigateToCheckIn={() => {
          setActiveTab('today');
          setIsCheckInOpen(true);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AccountabilityProvider>
      <AppContent />
    </AccountabilityProvider>
  );
}
