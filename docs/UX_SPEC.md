# Pact UX Specification (Free V1)

## 1. Information Architecture
Pact Free V1 features a 3-tab persistent navigation model:
- **Today**: Daily action (Commitment, Cutoff countdown, Check in, Partner status, Contextual recovery).
- **Partner**: Shared human relationship (Partner profile, Pact commitment, Status, Acknowledge, Lightweight notes, Rematch/Solo).
- **Me**: Personal trust index (Commitment details, Reliability, History, Preferences, Sign out).
- **Matchmaker**: Contextual modal/view only shown when unmatched or rematching.

## 2. Interaction Invariants
- **Check-in Duration**: Target < 10 seconds. Done, Partial, Missed.
- **Waiting vs. Missed**: Before cutoff time, card states "Waiting for check-in". After cutoff, states "Overdue / Missed".
- **Contextual Recovery**: Never shown unless a commitment was actually missed. 4 clean actions.
- **Progressive Disclosure**: Detailed schedule, pledges, and formulas remain collapsed by default.
