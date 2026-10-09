# Pact Free V1 Architecture Decisions

## Decision 1: Scope Containment for Free V1
- **Status**: Accepted
- **Context**: Prevent feature bloat or premature monetization.
- **Decision**: No paywalls, no Pro tier, no multi-pact clutter. Strictly 1 active pact per user at a time. Only Study and Fitness categories.

## Decision 2: Separate Independence of 48-Hour Wait vs. Proposal Limit
- **Status**: Accepted
- **Context**: Conflating proposal exhaustion with the 48-hour bridge would prematurely trigger AI assistance.
- **Decision**: Condition A (48-hour wait without match) and Condition B (2 proposals per 7 days exhausted) are strictly decoupled. Pact Assist is only offered after 48 hours of unmatched searching.

## Decision 3: Idempotent Check-in and Concurrency Protection
- **Status**: Accepted
- **Context**: Network replays or multiple taps could create duplicate check-ins or race conditions.
- **Decision**: Same-date check-ins update the existing daily record idempotently; mutual acceptance uses state transition locks.
