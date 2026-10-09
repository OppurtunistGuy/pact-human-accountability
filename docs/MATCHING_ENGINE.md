# Pact Matching Engine Specification

## 1. Matching Deterministic Rules
Candidates are evaluated against the current user's profile and active commitment using deterministic criteria:
1. **Self-match prevention**: `candidate.id !== currentUserId`
2. **Active partnership exclusion**: Candidates currently in an active pact are excluded.
3. **Category match**: Must match active goal category (`study` or `fitness`).
4. **Timezone proximity**: Synchronized active awake hours (within ±2h preferred).
5. **Accountability style alignment**: Strict / Balanced / Gentle preference compatibility.
6. **Reliability rating**: High-reliability users are matched to uphold mutual trust.

## 2. Free V1 Proposal Budgeting
- **Limit**: Free users receive a maximum of **2 match proposals per 7 days**.
- **Proposal Lifecycle**:
  - Proposal 1 presented: count = 1.
  - User chooses "Try another": proposal 2 presented, count = 2.
  - If rejected again: proposal limit reached for the 7-day period.

## 3. Pact Assist Independence (Condition A vs. Condition B)
- **Condition A (48-Hour Wait)**: `waitingHours >= 48`. Only when the user has searched for 48 hours without a human match does Pact Assist become available as an accountability bridge.
- **Condition B (Proposal Limit)**: `proposalsUsedThisWeek >= 2`. Reaching the 2-proposal limit does NOT automatically trigger Pact Assist unless Condition A (48h) is also met.
- **Background Matching**: While Pact Assist is active, the engine continues searching for human partners. When one accepts, the user transitions from Pact Assist to the human Pact without loss of commitment history.
