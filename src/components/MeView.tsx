import React, { useState } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { Check, Clock, AlertTriangle, RotateCcw, ChevronDown, ChevronUp, Settings, LogOut, Award, Calendar } from 'lucide-react';
import { AccountabilityStyle } from '../types';

interface MeViewProps {
  onOpenGoalModal: () => void;
  onOpenMatchmaker: () => void;
}

export const MeView: React.FC<MeViewProps> = ({ onOpenGoalModal, onOpenMatchmaker }) => {
  const {
    currentUser,
    activeGoal,
    partnership,
    pactHistory,
    updatePreferences,
    signOut,
    completePactCycle
  } = useAccountability();

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showCommitmentDetails, setShowCommitmentDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings form state
  const [style, setStyle] = useState<AccountabilityStyle>(currentUser.accountabilityStyle);
  const [checkInTime, setCheckInTime] = useState(currentUser.preferredCheckInTime);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({ style, checkInTime, timezone });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const cycle = partnership?.cycle;

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-4 animate-in fade-in duration-150">
      {/* 1. Profile Summary Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover border border-zinc-700"
          />
          <div>
            <h2 className="font-bold text-base text-zinc-100">{currentUser.name}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{currentUser.timezone.split(' ')[0]}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            title="Account Preferences"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={signOut}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Drawer (if toggled) */}
      {showSettings && (
        <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-bold text-sm text-zinc-100">Preferences</h3>
            {savedNotice && <span className="text-xs text-emerald-400 font-semibold">Saved ✓</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Accountability Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['strict', 'balanced', 'gentle'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`p-2 rounded-xl border text-xs capitalize transition ${
                    style === s
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-zinc-800 bg-zinc-950/40 text-zinc-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Check-in Cutoff
              </label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
              >
                <option value="America/New_York (UTC-4)">Eastern (UTC-4)</option>
                <option value="America/Chicago (UTC-5)">Central (UTC-5)</option>
                <option value="America/Denver (UTC-6)">Mountain (UTC-6)</option>
                <option value="America/Los_Angeles (UTC-7)">Pacific (UTC-7)</option>
                <option value="Europe/London (UTC+1)">London (UTC+1)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition"
            >
              Save Preferences
            </button>
          </div>
        </form>
      )}

      {/* 2. My Commitment Card (Progressive Disclosure) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              My Commitment
            </span>
            <h3 className="font-bold text-base text-zinc-100">{activeGoal.title}</h3>
          </div>
          <button
            onClick={onOpenGoalModal}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold rounded-xl transition"
          >
            Edit
          </button>
        </div>

        <p className="text-sm text-zinc-200 leading-relaxed font-medium">
          "{activeGoal.commitmentStatement}"
        </p>

        <p className="text-xs text-zinc-400">
          {activeGoal.frequencyDaysPerWeek} days/week • Before {activeGoal.dailyTargetTime} • {activeGoal.category}
        </p>

        {/* Commitment Details Accordion */}
        <div className="pt-2 border-t border-zinc-800/80">
          <button
            onClick={() => setShowCommitmentDetails(!showCommitmentDetails)}
            className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium"
          >
            <span>Commitment details</span>
            {showCommitmentDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCommitmentDetails && (
            <div className="mt-2.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-2 text-zinc-300">
              <div>
                <span className="text-zinc-500 font-semibold block text-[10px] uppercase">Pledge</span>
                <span className="italic text-zinc-400">"{activeGoal.antiExcusePledge}"</span>
              </div>
              {cycle && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 font-semibold block text-[10px] uppercase">Current Cycle</span>
                    <span>Day {cycle.currentDay} of {cycle.cycleDays} days</span>
                  </div>
                  {(cycle.isCompleted || cycle.currentDay >= cycle.cycleDays) && (
                    <button
                      onClick={completePactCycle}
                      className="px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg font-semibold transition"
                    >
                      Complete & Archive
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. PHASE 5A: RELIABILITY (Quiet & Human Trust Signal) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
            Your Reliability
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-4xl font-extrabold text-emerald-400 font-mono">
              {currentUser.reliabilityScore}%
            </span>
            <div>
              <div className="text-xs font-bold text-zinc-200">Strong follow-through</div>
              <div className="text-xs text-zinc-400">
                {currentUser.completedCommitments} of {currentUser.totalCommitments} commitments kept
              </div>
            </div>
          </div>
        </div>

        {/* Recent History List */}
        <div className="pt-3 border-t border-zinc-800 space-y-2">
          <span className="text-xs font-semibold text-zinc-400 block">Recent history</span>
          <div className="space-y-1.5 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950/60 flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Yesterday's session</span>
              </span>
              <span className="text-[11px] text-zinc-500">Done</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">½</span>
                <span>Midweek block</span>
              </span>
              <span className="text-[11px] text-zinc-500">Partial</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">↻</span>
                <span>Recovered session</span>
              </span>
              <span className="text-[11px] text-zinc-500">Recovered</span>
            </div>
          </div>
        </div>

        {/* How this works (Collapsed by default) */}
        <div className="pt-2 border-t border-zinc-800">
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium"
          >
            <span>How reliability works</span>
            {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHowItWorks && (
            <div className="mt-2.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400 leading-relaxed space-y-1.5">
              <p>Reliability answers: <strong>"Can people trust me?"</strong></p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 pt-1">
                <li><strong className="text-zinc-300">Done:</strong> Kept your commitment on schedule.</li>
                <li><strong className="text-zinc-300">Partial:</strong> Honest acknowledgment of trimmed effort. Honesty is respected.</li>
                <li><strong className="text-zinc-300">Recovered:</strong> Restored commitment during the 24h recovery window.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 4. PHASE 5C: BASIC PACT HISTORY */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
            Pact History
          </span>
          <span className="text-[10px] text-zinc-500">{pactHistory.length} completed</span>
        </div>

        <div className="space-y-2 text-xs">
          {pactHistory.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-zinc-200">{item.title}</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {item.cycleDays} days • {item.completedDays} days completed {item.partnerName ? `with ${item.partnerName}` : ''}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                {item.outcome}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
