import React, { useState } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { RefreshCw, X, Check, HeartHandshake } from 'lucide-react';

interface RematchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToMatchmaker: () => void;
}

export const RematchModal: React.FC<RematchModalProps> = ({
  isOpen,
  onClose,
  onSwitchToMatchmaker
}) => {
  const { partnership, requestRematch } = useAccountability();
  const [reason, setReason] = useState('My schedule or timezone shifted');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen || !partnership) return null;

  const partnerName = partnership.partner ? partnership.partner.name : 'Pact partner';

  const reasons = [
    'My schedule or timezone shifted',
    'Completed this goal phase / pivoting goals',
    'Need a different accountability style',
    'Partner has been unresponsive',
    'Mutual pact completed on good terms'
  ];

  const handleConfirmRematch = () => {
    const finalReason = customNote ? `${reason}: ${customNote}` : reason;
    requestRematch(finalReason);
    onClose();
    onSwitchToMatchmaker();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm">Respectful Rematch</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300">
              <span className="font-semibold text-zinc-200">No Guilt, No Drama.</span>
              <p className="mt-0.5 text-zinc-400">
                Life schedules change. Ending a pact to find better alignment is a normal part of accountability.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Reason for rematch
            </label>
            <div className="space-y-1.5">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    reason === r
                      ? 'border-amber-500/80 bg-amber-950/30 text-amber-200 font-bold'
                      : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span>{r}</span>
                  {reason === r && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Parting Note to {partnerName} (Optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Thanks for the mutual push!"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Keep Current Pact
            </button>
            <button
              type="button"
              onClick={handleConfirmRematch}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Conclude & Rematch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
