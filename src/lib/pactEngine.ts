import {
  UserProfile,
  Goal,
  Partnership,
  CheckIn,
  CheckInStatus,
  MatchingState,
  PartnershipStatus,
  RecoveryAction
} from '../types';

/**
 * PACT FREE V1 DOMAIN LOGIC & INVARIANT ENGINE
 * Pure, authoritative, and side-effect free logic.
 */

// 1. Reliability Score Calculation
export function calculateReliability(
  completedCommitments: number,
  totalCommitments: number,
  partialCommitments: number = 0,
  recoveredCommitments: number = 0
): number {
  if (totalCommitments <= 0) return 100;
  // Formula: (Done * 1.0 + Partial * 0.5 + Recovered * 0.8) / Total * 100
  const weightedScore = (completedCommitments * 1.0 + partialCommitments * 0.5 + recoveredCommitments * 0.8);
  const score = Math.round((weightedScore / totalCommitments) * 100);
  return Math.max(0, Math.min(100, score));
}

// 2. Cutoff & Time Evaluation
export function isPastCutoff(currentTimeStr: string, cutoffTimeStr: string): boolean {
  // Compares "HH:MM"
  const [currentH, currentM] = currentTimeStr.split(':').map(Number);
  const [cutoffH, cutoffM] = cutoffTimeStr.split(':').map(Number);
  if (currentH > cutoffH) return true;
  if (currentH === cutoffH && currentM >= cutoffM) return true;
  return false;
}

export function getCurrentTimeHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// 3. Matching Invariants
export function canPresentProposal(matchingState: MatchingState): boolean {
  return matchingState.proposalsUsedThisWeek < 2;
}

export function isSelfMatch(candidateId: string, currentUserId: string): boolean {
  return candidateId === currentUserId;
}

// 4. Critical Separation: Condition A vs Condition B
export function isPactAssistEligible(matchingState: MatchingState): boolean {
  // Condition A: Strictly requires 48 hours without a human match
  return matchingState.waitingHours >= 48;
}

export function isProposalLimitExhausted(matchingState: MatchingState): boolean {
  // Condition B: Strictly tracks Free 2-proposal weekly limit
  return matchingState.proposalsUsedThisWeek >= 2;
}

// 5. State Machine Transition Verification
const ALLOWED_TRANSITIONS: Record<PartnershipStatus, PartnershipStatus[]> = {
  pending: ['active', 'dissolved'],
  active: ['recovering', 'solo', 'completed', 'dissolved'],
  recovering: ['active', 'solo', 'dissolved', 'completed'],
  solo: ['active', 'completed', 'dissolved'],
  completed: ['dissolved'],
  dissolved: []
};

export function isValidPartnershipTransition(
  fromStatus: PartnershipStatus,
  toStatus: PartnershipStatus
): boolean {
  if (fromStatus === toStatus) return true;
  return ALLOWED_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}

// 6. Check-in Idempotency
export function applyCheckInIdempotently(
  existingCheckIns: CheckIn[],
  newCheckIn: CheckIn
): CheckIn[] {
  // Filter out any check-in on the same date for the same user and goal
  const filtered = existingCheckIns.filter(
    (c) => !(c.userId === newCheckIn.userId && c.date === newCheckIn.date && c.goalId === newCheckIn.goalId)
  );
  return [newCheckIn, ...filtered];
}

// 7. Cycle Progression
export function progressCycle(
  currentDay: number,
  cycleDays: number,
  status: CheckInStatus
): { nextDay: number; isCompleted: boolean } {
  const nextDay = Math.min(cycleDays, currentDay + 1);
  const isCompleted = nextDay >= cycleDays;
  return { nextDay, isCompleted };
}
