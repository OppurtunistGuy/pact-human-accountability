import React, { useState } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { CheckInStatus, RecoveryAction } from '../types';
import { isPastCutoff, getCurrentTimeHHMM } from '../lib/pactEngine';
import { Check, Clock, AlertTriangle, Bell, HeartHandshake, ArrowRight, RotateCcw, Sparkles, Award } from 'lucide-react';

interface TodayViewProps {
  onOpenCheckIn: () => void;
  onOpenMatchmaker: () => void;
  onOpenPartnerTab: () => void;
  onOpenHistory: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  onOpenCheckIn,
  onOpenMatchmaker,
  onOpenPartnerTab,
  onOpenHistory
}) => {
  const {
    currentUser,
    activeGoal,
    partnership,
    sendNudge,
    reactToPartnerCheckIn,
    resolveRecovery,
    transitionPactAssistToHuman,
    candidates
  } = useAccountability();

  const [nudgeSent, setNudgeSent] = useState(false);
  const [selectedRecoveryAction, setSelectedRecoveryAction] = useState<RecoveryAction>('complete_work');
  const [recoveryDetail, setRecoveryDetail] = useState('');
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);

  const currentTime = getCurrentTimeHHMM();
  const userPastCutoff = isPastCutoff(currentTime, activeGoal.dailyTargetTime);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const userCheckIn = partnership?.todayUserCheckIn;
  const partnerCheckIn = partnership?.todayPartnerCheckIn;
  const partner = partnership?.partner;
  const activeRecovery = partnership?.activeRecovery;
  const isPactAssist = partnership?.isPactAssist;
  const isSolo = partnership?.isSolo;
  const cycle = partnership?.cycle;

  const partnerCutoff = partnership?.partnerGoal?.dailyTargetTime || '21:00';
  const partnerPastCutoff = isPastCutoff(currentTime, partnerCutoff);

  const handleNudge = () => {
    sendNudge();
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 2500);
  };

  const handleResolveRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    const actionLabel = 
      selectedRecoveryAction === 'complete_work' ? 'Completed missed work' :
      selectedRecoveryAction === 'smaller_version' ? 'Completed smaller recovery session' :
      selectedRecoveryAction === 'reschedule' ? 'Rescheduled for tomorrow morning' :
      'Acknowledged missed session honestly';

    resolveRecovery(selectedRecoveryAction, recoveryDetail.trim() || actionLabel);
    setShowRecoveryForm(false);
  };

  const renderStatusDot = (status: CheckInStatus | 'pending' | 'rest') => {
    switch (status) {
      case 'done':
        return <span className="text-emerald-400 font-bold text-xs">✓</span>;
      case 'partial':
        return <span className="text-amber-400 font-bold text-xs">½</span>;
      case 'missed':
        return <span className="text-rose-400 font-bold text-xs">×</span>;
      case 'rest':
        return <span className="text-zinc-600 text-xs">—</span>;
      case 'pending':
      default:
        return <span className="text-zinc-600 text-xs">•</span>;
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-4 animate-in fade-in duration-150">
      {/* Top Greeting & Cycle Day */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight mt-0.5">
            {greeting}, {currentUser.name.split(' ')[0]}
          </h2>
        </div>

        {cycle && (
          <div className="text-right">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Day {cycle.currentDay} of {cycle.cycleDays}
            </span>
          </div>
        )}
      </div>

      {/* PHASE 5B: CYCLE COMPLETED BANNER */}
      {cycle && cycle.isCompleted && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Pact Cycle Complete!</span>
          </div>
          <p className="text-xs text-zinc-200">
            You completed your {cycle.cycleDays}-day Pact commitment ({cycle.completedDays} days done, {cycle.partialDays} partial, {cycle.recoveredDays} recovered).
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenHistory}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl"
            >
              Review History
            </button>
            <button
              onClick={onOpenMatchmaker}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl"
            >
              Start New Pact
            </button>
          </div>
        </div>
      )}

      {/* PHASE 5D: PACT ASSIST BANNER (BRIDGE MODE) */}
      {isPactAssist && (
        <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-zinc-200">Pact Assist Active: </span>
              <span className="text-zinc-400">Searching for human match in background...</span>
            </div>
          </div>
          <button
            onClick={() => transitionPactAssistToHuman(candidates[0].id)}
            className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950 rounded-lg font-bold text-[11px] transition shrink-0"
          >
            Match Found! Transition
          </button>
        </div>
      )}

      {/* PHASE 4: RECOVERY PROTOCOL (Contextual, calm tone) */}
      {activeRecovery && activeRecovery.status === 'pending' && (
        <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recovery in Progress</span>
            </span>
            <span className="text-xs text-zinc-400">
              {activeRecovery.deadlineHoursRemaining}h remaining
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            You missed yesterday's commitment. That's okay. What matters now is honest recovery to keep the pact going.
          </p>

          {!showRecoveryForm ? (
            <button
              onClick={() => setShowRecoveryForm(true)}
              className="w-full py-2.5 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Plan Recovery Action</span>
            </button>
          ) : (
            <form onSubmit={handleResolveRecovery} className="space-y-3 pt-1">
              <div className="space-y-1.5">
                {[
                  { type: 'complete_work', label: 'Complete the missed work now' },
                  { type: 'smaller_version', label: 'Do a smaller recovery version' },
                  { type: 'reschedule', label: 'Reschedule once for early tomorrow' },
                  { type: 'cannot_recover', label: 'Cannot recover (record honest miss)' }
                ].map((act) => (
                  <button
                    key={act.type}
                    type="button"
                    onClick={() => setSelectedRecoveryAction(act.type as RecoveryAction)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                      selectedRecoveryAction === act.type
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400'
                    }`}
                  >
                    <span>{act.label}</span>
                    {selectedRecoveryAction === act.type && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={recoveryDetail}
                onChange={(e) => setRecoveryDetail(e.target.value)}
                placeholder="Optional recovery note (e.g. Squeezed 30m makeup block)"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRecoveryForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs"
                >
                  Confirm Recovery
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* CARD 1: TODAY'S COMMITMENT (HERO ACTION) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Today's Commitment
          </span>
          {/* TC-27 & TC-30: Accurately show Waiting vs Overdue based on cutoff */}
          <span className={`text-xs font-medium ${userPastCutoff && !userCheckIn ? 'text-rose-400' : 'text-zinc-400'}`}>
            {userCheckIn ? (
              `Cutoff: ${activeGoal.dailyTargetTime}`
            ) : userPastCutoff ? (
              `Past cutoff (${activeGoal.dailyTargetTime})`
            ) : (
              `Waiting for check-in • Cutoff: ${activeGoal.dailyTargetTime}`
            )}
          </span>
        </div>

        <div className="text-base sm:text-lg font-semibold text-zinc-100 leading-snug">
          {activeGoal.commitmentStatement}
        </div>

        {/* Primary Action Button */}
        {userCheckIn ? (
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                userCheckIn.status === 'done'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : userCheckIn.status === 'partial'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}>
                {userCheckIn.status === 'done' ? '✓' : userCheckIn.status === 'partial' ? '½' : '×'}
              </div>
              <div>
                <div className="text-xs font-bold capitalize text-zinc-200">
                  {userCheckIn.status === 'done' ? 'Checked in • Kept' : userCheckIn.status === 'partial' ? 'Checked in • Partial' : 'Missed'}
                </div>
                {userCheckIn.note && (
                  <div className="text-[11px] text-zinc-400 line-clamp-1">{userCheckIn.note}</div>
                )}
              </div>
            </div>
            <button
              onClick={onOpenCheckIn}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline font-medium"
            >
              Update
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onOpenCheckIn}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Check in</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-zinc-500">
              {partner 
                ? (userPastCutoff ? `${partner.name.split(' ')[0]} is waiting — log your status` : `${partner.name.split(' ')[0]} is waiting for your update`)
                : isPactAssist 
                ? 'Pact Assist is monitoring your check-in' 
                : 'Log your daily progress'}
            </p>
          </div>
        )}
      </div>

      {/* CARD 2: PARTNER STATUS */}
      {partnership && partner ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-7 h-7 rounded-full object-cover border border-zinc-700"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                {partner.name}
              </span>
            </div>
            <span className="text-xs text-zinc-500">
              Cutoff: {partnerCutoff}
            </span>
          </div>

          <div className="text-xs text-zinc-300">
            {partnership.partnerGoal?.commitmentStatement || 'Daily accountability commitment'}
          </div>

          {/* Partner Status State */}
          {partnerCheckIn ? (
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${
                  partnerCheckIn.status === 'done'
                    ? 'text-emerald-400'
                    : partnerCheckIn.status === 'partial'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {partnerCheckIn.status === 'done' ? '✓ Done' : partnerCheckIn.status === 'partial' ? '½ Partial' : '× Missed'}
                </span>
                {partnerCheckIn.note && (
                  <span className="text-xs text-zinc-400 truncate max-w-[200px]">
                    "{partnerCheckIn.note}"
                  </span>
                )}
              </div>

              {/* Quick Acknowledge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => reactToPartnerCheckIn('pact_kept')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                    partnerCheckIn.partnerReaction === 'pact_kept'
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750'
                  }`}
                >
                  🤝 Pact Kept
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-500">
                {partnerPastCutoff ? 'Past cutoff • Waiting for check-in' : 'Waiting for check-in'}
              </span>
              <button
                onClick={handleNudge}
                disabled={nudgeSent}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  nudgeSent
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-200'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-zinc-400" />
                <span>{nudgeSent ? 'Nudge sent' : 'Send nudge'}</span>
              </button>
            </div>
          )}
        </div>
      ) : isSolo ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-zinc-200">Solo Commitment Active</span>
            <p className="text-zinc-400 mt-0.5">Pursuing goal independently. You can rematch anytime.</p>
          </div>
          <button
            onClick={onOpenMatchmaker}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg"
          >
            Find Partner
          </button>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center space-y-2">
          <HeartHandshake className="w-6 h-6 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-200">No partner matched yet</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Pair with an accountability peer to share daily follow-through.
          </p>
          <button
            onClick={onOpenMatchmaker}
            className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition"
          >
            Find a Partner
          </button>
        </div>
      )}

      {/* QUIET WEEKLY PROGRESS (SECONDARY) */}
      {partnership && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium text-zinc-400">This week</span>
          <div className="flex items-center gap-3 font-mono">
            {partnership.weeklyHistory.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-zinc-500">{day.day[0]}</span>
                {renderStatusDot(day.userStatus)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
