import React, { useState, useRef, useEffect } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { Send, Bell, Check, RefreshCw, HeartHandshake, Sparkles, User, ArrowRight } from 'lucide-react';

interface PartnerViewProps {
  onOpenCheckIn: () => void;
  onOpenRematch: () => void;
  onOpenMatchmaker: () => void;
}

export const PartnerView: React.FC<PartnerViewProps> = ({
  onOpenCheckIn,
  onOpenRematch,
  onOpenMatchmaker
}) => {
  const {
    currentUser,
    partnership,
    messages,
    sendMessage,
    sendNudge,
    reactToPartnerCheckIn,
    continueSolo
  } = useAccountability();

  const [input, setInput] = useState('');
  const [nudgeSent, setNudgeSent] = useState(false);
  const [showSoloConfirm, setShowSoloConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!partnership) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-3 max-w-lg mx-auto">
        <HeartHandshake className="w-8 h-8 text-zinc-500 mx-auto" />
        <h3 className="text-base font-bold text-zinc-100">No Active Partner</h3>
        <p className="text-xs text-zinc-400 max-w-xs mx-auto">
          You are currently unmatched. Pair with an accountability peer to share daily follow-through.
        </p>
        <button
          onClick={onOpenMatchmaker}
          className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition"
        >
          Find a Partner Match
        </button>
      </div>
    );
  }

  const partner = partnership.partner;
  const partnerCheckIn = partnership.todayPartnerCheckIn;
  const userCheckIn = partnership.todayUserCheckIn;
  const isPactAssist = partnership.isPactAssist;
  const isSolo = partnership.isSolo;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleNudge = () => {
    sendNudge();
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 2500);
  };

  const handlePactAssistPrompt = (actionType: 'plan' | 'start' | 'check' | 'recover') => {
    const text = 
      actionType === 'plan' ? 'Pact Assist: What specific 1 or 2 tasks will you focus on during your session?' :
      actionType === 'start' ? 'Pact Assist: Ready to begin? Set your timer and put distractions away.' :
      actionType === 'check' ? 'Pact Assist: How did today’s commitment go? Remember to log Done, Partial, or Missed.' :
      'Pact Assist: What is your concrete make-up plan within the 24h recovery window?';
    sendMessage(text);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-4 animate-in fade-in duration-150">
      {/* 1. Partner Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {partner ? (
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-12 h-12 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                <User className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-zinc-100">
                  {partner ? partner.name : isPactAssist ? 'Pact Assist' : 'Solo Mode'}
                </h3>
                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {isPactAssist ? 'Temporary Bridge' : isSolo ? 'Independent' : 'Reliable Partner'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {partner ? partner.timezone.split(' ')[0] : 'Human matching continues in background'}
              </p>
            </div>
          </div>
        </div>

        {/* Pact Statement */}
        <div className="pt-2 border-t border-zinc-800/80 text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
            {isPactAssist ? 'Bridge Protocol' : isSolo ? 'Your Solo Goal' : "Partner's Commitment"}
          </span>
          <p className="text-zinc-200">
            "{partnership.partnerGoal ? partnership.partnerGoal.commitmentStatement : partnership.userGoal.commitmentStatement}"
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Daily cutoff: {partnership.partnerGoal?.dailyTargetTime || partnership.userGoal.dailyTargetTime}
          </span>
        </div>
      </div>

      {/* PHASE 5D: PACT ASSIST SPECIFIC ACTIONS */}
      {isPactAssist && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            Pact Assist Accountability Prompts
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handlePactAssistPrompt('plan')}
              className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-left hover:border-emerald-500/50 text-zinc-200"
            >
              <span className="font-bold block text-emerald-400">1. Plan</span>
              <span className="text-[11px] text-zinc-400">Clarify session tasks</span>
            </button>
            <button
              onClick={() => handlePactAssistPrompt('start')}
              className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-left hover:border-emerald-500/50 text-zinc-200"
            >
              <span className="font-bold block text-emerald-400">2. Start</span>
              <span className="text-[11px] text-zinc-400">Trigger focus block</span>
            </button>
            <button
              onClick={() => handlePactAssistPrompt('check')}
              className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-left hover:border-emerald-500/50 text-zinc-200"
            >
              <span className="font-bold block text-emerald-400">3. Check</span>
              <span className="text-[11px] text-zinc-400">Review completion</span>
            </button>
            <button
              onClick={() => handlePactAssistPrompt('recover')}
              className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-left hover:border-emerald-500/50 text-zinc-200"
            >
              <span className="font-bold block text-emerald-400">4. Recover</span>
              <span className="text-[11px] text-zinc-400">Make-up guidance</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Today's Status Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <span className="text-[10px] uppercase font-bold text-zinc-500 block">
          Today's Follow-Through
        </span>

        {/* Partner's status */}
        {!isSolo && (
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-300 block">
                {partner ? partner.name.split(' ')[0] : 'Pact Assist'}
              </span>
              {partnerCheckIn ? (
                <span className={`text-xs font-medium ${
                  partnerCheckIn.status === 'done' ? 'text-emerald-400' : partnerCheckIn.status === 'partial' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {partnerCheckIn.status === 'done' ? '✓ Done' : partnerCheckIn.status === 'partial' ? '½ Partial' : '× Missed'}: "{partnerCheckIn.note}"
                </span>
              ) : (
                <span className="text-xs text-zinc-500">Waiting for check-in</span>
              )}
            </div>

            {partnerCheckIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => reactToPartnerCheckIn('pact_kept')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    partnerCheckIn.partnerReaction === 'pact_kept'
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750'
                  }`}
                >
                  🤝 Pact Kept
                </button>
              </div>
            ) : (
              <button
                onClick={handleNudge}
                disabled={nudgeSent}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-750 text-zinc-200 flex items-center gap-1"
              >
                <Bell className="w-3 h-3" />
                <span>{nudgeSent ? 'Nudge sent' : 'Nudge'}</span>
              </button>
            )}
          </div>
        )}

        {/* Your status */}
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-300 block">You</span>
            {userCheckIn ? (
              <span className={`text-xs font-medium ${
                userCheckIn.status === 'done' ? 'text-emerald-400' : userCheckIn.status === 'partial' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {userCheckIn.status === 'done' ? '✓ Done' : userCheckIn.status === 'partial' ? '½ Partial' : '× Missed'}
              </span>
            ) : (
              <span className="text-xs text-zinc-500">Waiting for check-in</span>
            )}
          </div>

          {!userCheckIn && (
            <button
              onClick={onOpenCheckIn}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg text-xs"
            >
              Check in
            </button>
          )}
        </div>
      </div>

      {/* 3. Lightweight Accountability Messages */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-64 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/90 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>Accountability Messages</span>
          <span className="text-zinc-500 lowercase font-normal">keep it brief</span>
        </div>

        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                  isMe ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-500 text-zinc-950 font-medium'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-2 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send quick update or encouragement..."
            className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg transition disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 4. Phase 4: Rematch or Continue Solo (Quiet Bottom Actions) */}
      <div className="pt-2 flex items-center justify-center gap-4 text-xs text-zinc-500">
        {!isSolo && (
          <>
            <button
              onClick={onOpenRematch}
              className="hover:text-zinc-300 underline transition"
            >
              Respectfully Rematch
            </button>
            <span>•</span>
            <button
              onClick={() => setShowSoloConfirm(true)}
              className="hover:text-zinc-300 underline transition"
            >
              Continue Solo
            </button>
          </>
        )}
      </div>

      {/* Continue Solo Confirm Modal */}
      {showSoloConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-sm text-zinc-100">Continue Solo?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your partnership will end respectfully, but your commitment and daily check-ins remain fully active so you can continue without disruption.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSoloConfirm(false)}
                className="px-3 py-1.5 text-xs text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  continueSolo();
                  setShowSoloConfirm(false);
                }}
                className="px-3.5 py-1.5 bg-emerald-500 text-zinc-950 font-bold rounded-xl text-xs"
              >
                Switch to Solo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
