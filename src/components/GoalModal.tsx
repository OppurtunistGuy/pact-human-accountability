import React, { useState } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { GoalCategory } from '../types';
import { X, BookOpen, Dumbbell, ArrowRight } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { activeGoal, updateGoal } = useAccountability();

  const [category, setCategory] = useState<GoalCategory>(activeGoal.category || 'study');
  const [title, setTitle] = useState(activeGoal.title || '');
  const [commitmentStatement, setCommitmentStatement] = useState(activeGoal.commitmentStatement || '');
  const [frequency, setFrequency] = useState<number>(activeGoal.frequencyDaysPerWeek || 5);
  const [targetTime, setTargetTime] = useState(activeGoal.dailyTargetTime || '21:00');
  const [cycleLength, setCycleLength] = useState<number>(activeGoal.cycleLengthDays || 30);
  const [pledgeAgreed, setPledgeAgreed] = useState(true);

  if (!isOpen) return null;

  const handleCategorySelect = (cat: GoalCategory) => {
    setCategory(cat);
    if (!title || title === activeGoal.title) {
      if (cat === 'study') {
        setTitle('CAT & Certification Exam Study');
        setCommitmentStatement('2 hours focused study before 10:00 PM');
      } else {
        setTitle('Consistent Strength & Conditioning');
        setCommitmentStatement('45 min workout before 8:00 PM');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !commitmentStatement.trim()) return;

    updateGoal({
      title: title.trim(),
      category,
      commitmentStatement: commitmentStatement.trim(),
      frequencyDaysPerWeek: frequency,
      dailyTargetTime: targetTime,
      cycleLengthDays: cycleLength
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100">Edit Commitment</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Category: Study or Fitness */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Focus Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCategorySelect('study')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  category === 'study'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">Study</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategorySelect('fitness')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  category === 'fitness'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400'
                }`}
              >
                <Dumbbell className="w-5 h-5" />
                <span className="text-xs">Fitness</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Commitment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Daily Commitment Statement */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Concrete Daily Action
            </label>
            <input
              type="text"
              required
              value={commitmentStatement}
              onChange={(e) => setCommitmentStatement(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Frequency, Cutoff & Cycle */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Days/Wk
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
              >
                <option value={4}>4 days</option>
                <option value={5}>5 days</option>
                <option value={6}>6 days</option>
                <option value={7}>7 days</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Cutoff
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full px-2 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Cycle
              </label>
              <select
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
              >
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
