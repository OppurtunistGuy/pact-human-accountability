import React, { useState } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { CheckInStatus } from '../types';
import { Check, X, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const { activeGoal, submitCheckIn, partnership } = useAccountability();
  const [selectedStatus, setSelectedStatus] = useState<CheckInStatus>('done');
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      submitCheckIn(
        selectedStatus,
        note.trim() || (selectedStatus === 'done' ? 'Completed on schedule' : selectedStatus === 'partial' ? 'Made partial progress' : 'Missed commitment today')
      );
      setIsSubmitting(false);
      setShowNoteInput(false);
      setNote('');
      onClose();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full sm:max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-100">Check in</h2>
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{activeGoal.commitmentStatement}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            How did it go today?
          </div>

          {/* 3 Simple Choice Cards */}
          <div className="space-y-2.5">
            {/* DONE */}
            <button
              type="button"
              onClick={() => setSelectedStatus('done')}
              className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                selectedStatus === 'done'
                  ? 'border-emerald-500 bg-emerald-950/40 text-zinc-100 ring-1 ring-emerald-500/50'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedStatus === 'done' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-100">Done</div>
                  <div className="text-xs text-zinc-400">You completed the commitment.</div>
                </div>
              </div>
              {selectedStatus === 'done' && <span className="text-xs text-emerald-400 font-semibold">Selected</span>}
            </button>

            {/* PARTIAL */}
            <button
              type="button"
              onClick={() => setSelectedStatus('partial')}
              className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                selectedStatus === 'partial'
                  ? 'border-amber-500 bg-amber-950/40 text-zinc-100 ring-1 ring-amber-500/50'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedStatus === 'partial' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-100">Partial</div>
                  <div className="text-xs text-zinc-400">You made progress but fell short.</div>
                </div>
              </div>
              {selectedStatus === 'partial' && <span className="text-xs text-amber-400 font-semibold">Selected</span>}
            </button>

            {/* MISSED */}
            <button
              type="button"
              onClick={() => setSelectedStatus('missed')}
              className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                selectedStatus === 'missed'
                  ? 'border-rose-500 bg-rose-950/40 text-zinc-100 ring-1 ring-rose-500/50'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedStatus === 'missed' ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-100">Missed</div>
                  <div className="text-xs text-zinc-400">You didn't get to it.</div>
                </div>
              </div>
              {selectedStatus === 'missed' && <span className="text-xs text-rose-400 font-semibold">Selected</span>}
            </button>
          </div>

          {/* Context Message */}
          {selectedStatus === 'done' && (
            <div className="text-xs text-emerald-400/90 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl">
              Nice. Commitment kept.
            </div>
          )}

          {selectedStatus === 'partial' && (
            <div className="text-xs text-amber-300/90 bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl">
              Honesty is respected over pretending. Great job reporting honestly.
            </div>
          )}

          {selectedStatus === 'missed' && (
            <div className="text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              You missed today's commitment. That's okay. What matters now is recovery.
            </div>
          )}

          {/* Optional Note (Progressive disclosure) */}
          {!showNoteInput ? (
            <button
              type="button"
              onClick={() => setShowNoteInput(true)}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline block"
            >
              + Add an optional note
            </button>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Optional Note for Partner
              </label>
              <input
                type="text"
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={selectedStatus === 'done' ? 'e.g. Finished 2 chapters and problem set' : 'e.g. Squeezed 30 mins before meeting'}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedStatus === 'done'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                  : selectedStatus === 'partial'
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950'
              }`}
            >
              <span>{isSubmitting ? 'Saving...' : 'Confirm'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
