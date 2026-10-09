import React, { useState } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { isPactAssistEligible, isProposalLimitExhausted } from '../lib/pactEngine';
import { Check, ArrowRight, RefreshCw, X, Sparkles, Clock, AlertCircle } from 'lucide-react';

interface MatchmakerViewProps {
  onPactActivated?: () => void;
  onCancel?: () => void;
}

export const MatchmakerView: React.FC<MatchmakerViewProps> = ({
  onPactActivated,
  onCancel
}) => {
  const {
    currentUser,
    candidates,
    activeGoal,
    matchingState,
    consumeMatchProposal,
    acceptMatchWithCandidate,
    startWithPactAssist,
    partnership
  } = useAccountability();

  // Exclude current user (TC-12: self-match prevention) and filter by goal category
  const matchingCandidates = candidates.filter(
    (c) => c.id !== currentUser.id && c.primaryCategory === activeGoal.category
  );

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false);

  const candidate = matchingCandidates[candidateIndex] || candidates.find(c => c.id !== currentUser.id) || candidates[0];
  
  const proposalLimitReached = isProposalLimitExhausted(matchingState);
  const pactAssistEligible = isPactAssistEligible(matchingState);
  const currentProposalNumber = Math.min(2, matchingState.proposalsUsedThisWeek + 1);

  const handleNextProposal = () => {
    consumeMatchProposal();
    setCandidateIndex((prev) => (prev + 1) % matchingCandidates.length);
  };

  const handleAcceptProposal = () => {
    setIsAccepting(true);
    setTimeout(() => {
      acceptMatchWithCandidate(candidate.id);
      setIsAccepting(false);
      if (onPactActivated) onPactActivated();
    }, 350);
  };

  const handleActivatePactAssist = () => {
    startWithPactAssist();
    if (onPactActivated) onPactActivated();
  };

  return (
    <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-150">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            Human Matching
          </span>
          <h2 className="text-lg font-bold text-zinc-100">
            We found someone who looks like a good fit
          </h2>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Free Proposal Budget Status (Condition B) */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
        <span className="text-zinc-400">
          Proposal <strong className="text-zinc-200">{proposalLimitReached ? 2 : currentProposalNumber} of 2</strong> this week
        </span>
        <span className="text-[10px] text-zinc-500">1 active Pact at a time</span>
      </div>

      {/* Condition B Check: If NOT exhausted, show candidate proposal */}
      {!proposalLimitReached ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
          {/* Candidate Card */}
          <div className="flex items-center gap-3.5">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-100">{candidate.name}</h3>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full capitalize">
                  {candidate.primaryCategory}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cutoff: {candidate.preferredCheckInTime} • {candidate.timezone.split(' ')[0]}
              </p>
              <span className="text-[11px] text-emerald-400 font-medium">
                {candidate.reliabilityScore}% verified follow-through
              </span>
            </div>
          </div>

          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 italic">
            "{candidate.bio}"
          </div>

          {/* 2-3 Human-Readable Match Reasons */}
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Why you match
            </span>
            <div className="space-y-1.5 text-xs text-zinc-300">
              {candidate.matchReasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleAcceptProposal}
              disabled={isAccepting}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isAccepting ? 'Forming Pact...' : `Pair with ${candidate.name.split(' ')[0]}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNextProposal}
              className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Try another proposal ({2 - currentProposalNumber} left this week)
            </button>
          </div>
        </div>
      ) : (
        /* Condition B: 2 proposals viewed -> limit reached message (DO NOT conflate with Pact Assist!) */
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Weekly Proposal Limit Reached (2 of 2)</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            You've viewed your 2 Free match proposals for this 7-day period. Human matching is actively evaluating newly joined peers in the background.
          </p>
          <p className="text-[11px] text-zinc-500">
            Next proposals will unlock after your weekly reset.
          </p>
        </div>
      )}

      {/* Condition A Check: Pact Assist is offered ONLY IF waitingHours >= 48 (Independent condition!) */}
      {pactAssistEligible ? (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-100">
              Pact Assist Available (48h search active)
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Still looking for your human partner. You don't have to wait to get started. Pact Assist can keep you accountable while human matching continues in the background.
          </p>
          <button
            onClick={handleActivatePactAssist}
            className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>Start with Pact Assist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Status note when searching and under 48 hours */
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Matching search active ({matchingState.waitingHours}h / 48h)</span>
          </span>
          <span className="text-zinc-500">Autonomous peer pool</span>
        </div>
      )}
    </div>
  );
};
