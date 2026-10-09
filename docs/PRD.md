# Pact Free V1 — Product Requirements Document (PRD)

## 1. Product Vision & Principles
Pact is a mobile-first human accountability network pairing people to consistently follow through on daily commitments (Study and Fitness in V1).
- **Core Principle**: One user → one commitment → one partner → one daily action.
- **Philosophy**: Miss → acknowledge → recover → continue.
- **Anti-Pattern**: Not a habit tracker, not a social feed, not a dating app, not an AI chatbot.

## 2. Target Persona & MVP Scope
- Primary personas: Students studying for exams (e.g. CAT, Bar, Med) and individuals building consistent workout discipline.
- Categories: **Study** and **Fitness** exclusively in Free V1.
- Active pact limit: **Strictly 1 active Pact** per user at any time.

## 3. Human Matching Engine Specifications
- **No Marketplace Browsing**: Users do not browse a directory of people. They receive the single best proposal based on:
  - Goal category alignment
  - Timezone compatibility (within sync window)
  - Commitment intensity & schedule
  - Accountability style (Strict / Balanced / Gentle)
- **Free Matching Limit**: Maximum **2 match proposals per 7 days**.
- **Mutual Acceptance**: Both users must accept for a Pact to become active.

## 4. Pact Assist (48-Hour Bridge)
- **Condition A (Independent)**: If no human match is formed after **48 hours of searching**, Pact Assist is offered.
- **Condition B (Independent)**: Proposal exhaustion (2 of 2 viewed) does NOT equate to 48 hours.
- **Pact Assist Scope**: Scoped to 4 accountability actions only: Plan, Start, Check, Recover.
- **Bridge Behavior**: Human matching continues in the background; seamless transition once a human match is confirmed.

## 5. Daily Accountability & Check-In
- **Today Surface**: "What do I need to do today?"
- **Cutoff Rule**: State is **WAITING** before cutoff passes; **OVERDUE/MISSED** only after cutoff passes.
- **Check-In Options**:
  - **Done**: 100% full commitment kept.
  - **Partial**: Valid honest outcome for trimmed effort.
  - **Missed**: Triggers 24h recovery protocol without shaming.
- **Lightweight Sync**: Send nudge, acknowledge (*Pact Kept*, *Solid*, *Respect*), brief note.

## 6. Recovery & Continuation
- **Recovery Actions**:
  1. Complete missed work now
  2. Smaller recovery version
  3. Reschedule once
  4. Cannot recover
- **Partner Visibility**: Displays *"Recovery in progress"*.
- **Continuation**: Respectfully rematch or Continue Solo (commitment stays active).

## 7. Reliability & Cycle Completion
- Trust metric: *"Can people trust me?"* (e.g. 93% with 27 of 29 kept).
- Cycle lengths: 14, 21, or 30 days.
- Cycle completion summary and progression to next Pact.
