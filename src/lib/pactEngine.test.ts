import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateReliability,
  isPastCutoff,
  canPresentProposal,
  isSelfMatch,
  isPactAssistEligible,
  isProposalLimitExhausted,
  isValidPartnershipTransition,
  applyCheckInIdempotently,
  progressCycle
} from './pactEngine.ts';
import { MatchingState, CheckIn } from '../types.ts';

describe('TEST GROUP 1 — RELIABILITY CALCULATION', () => {
  it('TC-47: computes 100% for pristine history or 0 commitments', () => {
    assert.equal(calculateReliability(0, 0), 100);
    assert.equal(calculateReliability(10, 10), 100);
  });

  it('TC-48 & TC-49: computes weighted score with partial commitments', () => {
    // 20 total, 18 done, 2 partial (18 + 1 = 19) => 19 / 20 = 95%
    const score = calculateReliability(18, 20, 2);
    assert.equal(score, 95);
  });

  it('TC-50: penalizes unrecovered misses properly', () => {
    // 10 total, 5 done, 0 partial => 5 / 10 = 50%
    const score = calculateReliability(5, 10, 0);
    assert.equal(score, 50);
  });

  it('awards recovery credit', () => {
    // 10 total, 8 done, 0 partial, 2 recovered => (8 + 1.6) / 10 = 96%
    const score = calculateReliability(8, 10, 0, 2);
    assert.equal(score, 96);
  });
});

describe('TEST GROUP 2 — CUTOFF EVALUATION', () => {
  it('TC-27: confirms waiting before cutoff', () => {
    assert.equal(isPastCutoff('20:59', '21:00'), false);
    assert.equal(isPastCutoff('14:30', '21:00'), false);
  });

  it('TC-30: confirms overdue/missed after cutoff', () => {
    assert.equal(isPastCutoff('21:01', '21:00'), true);
    assert.equal(isPastCutoff('22:00', '21:00'), true);
  });

  it('TC-35: edge case on exact cutoff minute', () => {
    assert.equal(isPastCutoff('21:00', '21:00'), true);
  });
});

describe('TEST GROUP 3 — MATCHING & PROPOSAL BUDGET', () => {
  it('TC-12: prevents self-matching', () => {
    assert.equal(isSelfMatch('user_123', 'user_123'), true);
    assert.equal(isSelfMatch('user_123', 'user_456'), false);
  });

  it('TC-21: enforces 2 proposals per 7 days limit', () => {
    const freshState: MatchingState = {
      proposalsUsedThisWeek: 0,
      waitingHours: 0,
      pactAssistOffered: false,
      isSearching: true
    };
    assert.equal(canPresentProposal(freshState), true);

    const oneUsed: MatchingState = { ...freshState, proposalsUsedThisWeek: 1 };
    assert.equal(canPresentProposal(oneUsed), true);

    const exhausted: MatchingState = { ...freshState, proposalsUsedThisWeek: 2 };
    assert.equal(canPresentProposal(exhausted), false);
    assert.equal(isProposalLimitExhausted(exhausted), true);
  });
});

describe('TEST GROUP 6 — PACT ASSIST INDEPENDENCE (CRITICAL)', () => {
  it('TC-56 & TC-57: Condition A requires waitingHours >= 48 for Pact Assist eligibility', () => {
    const under48: MatchingState = {
      proposalsUsedThisWeek: 0,
      waitingHours: 24,
      pactAssistOffered: false,
      isSearching: true
    };
    assert.equal(isPactAssistEligible(under48), false);

    const exactly48: MatchingState = { ...under48, waitingHours: 48 };
    assert.equal(isPactAssistEligible(exactly48), true);

    const over48: MatchingState = { ...under48, waitingHours: 52 };
    assert.equal(isPactAssistEligible(over48), true);
  });

  it('TC-67: Condition B (proposal limit exhausted) does NOT trigger Pact Assist without 48h wait', () => {
    const proposalsExhaustedEarly: MatchingState = {
      proposalsUsedThisWeek: 2,
      waitingHours: 5, // only 5 hours into search!
      pactAssistOffered: false,
      isSearching: true
    };
    assert.equal(isProposalLimitExhausted(proposalsExhaustedEarly), true);
    // MUST BE FALSE: exhausting 2 proposals does NOT automatically trigger Pact Assist!
    assert.equal(isPactAssistEligible(proposalsExhaustedEarly), false);
  });
});

describe('TEST GROUP 7 & 8 — STATE MACHINE & CONCURRENCY IDEMPOTENCE', () => {
  it('TC-23 & TC-24: validates legal state transitions', () => {
    assert.equal(isValidPartnershipTransition('pending', 'active'), true);
    assert.equal(isValidPartnershipTransition('active', 'recovering'), true);
    assert.equal(isValidPartnershipTransition('active', 'solo'), true);
    assert.equal(isValidPartnershipTransition('active', 'completed'), true);
    assert.equal(isValidPartnershipTransition('completed', 'active'), false); // cannot reactivate completed pact directly
  });

  it('TC-34: ensures check-in updates on same date are idempotent', () => {
    const existing: CheckIn[] = [
      {
        id: 'chk_1',
        partnershipId: 'pact_1',
        userId: 'user_alex',
        goalId: 'goal_1',
        date: '2026-10-08',
        status: 'partial',
        timestamp: '14:00'
      }
    ];

    const update: CheckIn = {
      id: 'chk_2',
      partnershipId: 'pact_1',
      userId: 'user_alex',
      goalId: 'goal_1',
      date: '2026-10-08',
      status: 'done',
      timestamp: '16:00'
    };

    const result = applyCheckInIdempotently(existing, update);
    assert.equal(result.length, 1);
    assert.equal(result[0].status, 'done');
  });

  it('TC-51 & TC-52: progresses cycle towards completion', () => {
    const progression = progressCycle(13, 14, 'done');
    assert.equal(progression.nextDay, 14);
    assert.equal(progression.isCompleted, true);

    const midProgression = progressCycle(5, 30, 'done');
    assert.equal(midProgression.nextDay, 6);
    assert.equal(midProgression.isCompleted, false);
  });
});
