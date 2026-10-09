import React, { useState } from 'react';
import { useAccountability } from '../context/AccountabilityContext';
import { GoalCategory } from '../types';
import { BookOpen, Dumbbell, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface AuthSetupViewProps {
  onComplete: () => void;
}

export const AuthSetupView: React.FC<AuthSetupViewProps> = ({ onComplete }) => {
  const { signUp, login, startNewPact } = useAccountability();

  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [step, setStep] = useState<'account' | 'commitment'>('account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('America/New_York (UTC-4)');
  const [validationError, setValidationError] = useState('');

  // Commitment
  const [category, setCategory] = useState<GoalCategory>('study');
  const [title, setTitle] = useState('CAT & Certification Exam Study');
  const [commitmentStatement, setCommitmentStatement] = useState('2 hours focused study before 10:00 PM');
  const [frequency, setFrequency] = useState(5);
  const [cutoffTime, setCutoffTime] = useState('22:00');
  const [cycleLength, setCycleLength] = useState(30);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (!email.trim() || (!name.trim() && authMode === 'signup')) {
      setValidationError('Please complete all required fields.');
      return;
    }

    if (authMode === 'login') {
      login(email.trim());
      onComplete();
    } else {
      setStep('commitment');
    }
  };

  const handleCommitmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (!title.trim() || !commitmentStatement.trim()) {
      setValidationError('Commitment description cannot be empty.');
      return;
    }

    signUp(name.trim(), email.trim(), timezone);
    startNewPact({
      title: title.trim(),
      category,
      commitmentStatement: commitmentStatement.trim(),
      frequencyDaysPerWeek: frequency,
      commitmentDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      dailyTargetTime: cutoffTime,
      cycleLengthDays: cycleLength
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Brand */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Pact Free V1
          </div>
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">PACT</h1>
          <p className="text-xs text-zinc-400">
            A human accountability network to follow through on daily commitments.
          </p>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
            {validationError}
          </div>
        )}

        {step === 'account' ? (
          <form onSubmit={handleAccountSubmit} className="space-y-4">
            {/* Toggle Sign Up / Login */}
            <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2 rounded-lg transition ${
                  authMode === 'signup'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 rounded-lg transition ${
                  authMode === 'login'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Log In
              </button>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="America/New_York (UTC-4)">Eastern Time (UTC-4)</option>
                  <option value="America/Chicago (UTC-5)">Central Time (UTC-5)</option>
                  <option value="America/Denver (UTC-6)">Mountain Time (UTC-6)</option>
                  <option value="America/Los_Angeles (UTC-7)">Pacific Time (UTC-7)</option>
                  <option value="Europe/London (UTC+1)">London (UTC+1)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 mt-4"
            >
              <span>{authMode === 'signup' ? 'Continue to Goal Setup' : 'Log In to Pact'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleCommitmentSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                2. Set Your Commitment
              </span>
              <button
                type="button"
                onClick={() => setStep('account')}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                Back
              </button>
            </div>

            {/* Category: Study or Fitness */}
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Choose Category</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setCategory('study');
                    setTitle('CAT & Certification Exam Study');
                    setCommitmentStatement('2 hours focused study before 10:00 PM');
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                    category === 'study'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-400'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xs">Study</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategory('fitness');
                    setTitle('Consistent Strength & Conditioning');
                    setCommitmentStatement('45 min workout before 8:00 PM');
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                    category === 'fitness'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-400'
                  }`}
                >
                  <Dumbbell className="w-5 h-5" />
                  <span className="text-xs">Fitness</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Commitment Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Specific Daily Commitment</label>
              <input
                type="text"
                required
                value={commitmentStatement}
                onChange={(e) => setCommitmentStatement(e.target.value)}
                placeholder="e.g. 2 hours focused study before 10 PM"
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Daily Cutoff</label>
                <input
                  type="time"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Cycle Length</label>
                <select
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                >
                  <option value={14}>14 days</option>
                  <option value={21}>21 days</option>
                  <option value={30}>30 days (Standard)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start gap-2 text-xs text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Pact Honest Pledge:</strong> If you miss, you promise to report honestly rather than ghost.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Find Human Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
