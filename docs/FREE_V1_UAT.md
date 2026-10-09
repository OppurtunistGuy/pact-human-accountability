# Pact Free V1 User Acceptance Test (UAT)

## TEST GROUP 1 — ACCOUNT & SETUP
- **TC-01**: New user signup — Creates a new account with name, email, and timezone.
- **TC-02**: Login / logout — Existing user can log in with email and log out cleanly back to sign-in.
- **TC-03**: Profile creation — Profile saves name, avatar, timezone, and accountability style.
- **TC-04**: Study goal — Selects Study category and populates relevant defaults.
- **TC-05**: Fitness goal — Selects Fitness category and populates relevant defaults.
- **TC-06**: Commitment creation — Captures category, concrete statement, frequency, cutoff, and cycle length.
- **TC-07**: Invalid / incomplete commitment data — Form validates required fields before submission.
- **TC-08**: Timezone handling — Correctly displays and stores user's chosen timezone.
- **TC-09**: Cutoff configuration — Cutoff time (HH:MM) is configured and displayed accurately.
- **TC-10**: Cycle lengths (14, 21, 30 days) — User can select 14, 21, or 30 days cycle length.

## TEST GROUP 2 — MATCHING
- **TC-11**: Candidate eligibility — Only compatible candidates matching category and schedule are selected.
- **TC-12**: Self-match prevention — User cannot be matched with themselves (`candidate.id !== currentUserId`).
- **TC-13**: Active commitment requirement — Matching requires an active commitment.
- **TC-14**: Active partnership exclusion — Users already in an active partnership cannot enter new matching.
- **TC-15**: Blocked/reported exclusion — Blocked candidates are filtered out from the matching pool.
- **TC-16**: Best match proposal — Single best proposal is presented to the user (no catalog browsing).
- **TC-17**: Human-readable match reasons — 2-3 human-readable alignment reasons displayed.
- **TC-18**: Accept proposal — User accepts proposal to initiate/activate mutual pact.
- **TC-19**: Reject / try another — User can decline proposal and view the second candidate.
- **TC-20**: Second proposal — Second proposal correctly displayed with candidate details.
- **TC-21**: Free 2-proposal / 7-day limit — Reaching 2 proposals locks further proposals until reset.
- **TC-22**: Proposal expiry — Proposals have a defined valid window.
- **TC-23**: Two users accepting simultaneously — Concurrent acceptance resolves idempotently without duplication.
- **TC-24**: Duplicate partnership prevention — Enforces strictly 1 active partnership at a time.

## TEST GROUP 3 — DAILY ACCOUNTABILITY
- **TC-25**: Today screen — Displays "What do I need to do today?" with clear commitment headline.
- **TC-26**: Correct commitment for today — Displays user's specific commitment threshold and cutoff.
- **TC-27**: Waiting state before cutoff — Shows "Waiting for check-in" before local cutoff passes.
- **TC-28**: Done check-in — One-tap Done check-in logs 100% completion in <10 seconds.
- **TC-29**: Partial check-in — Partial check-in recorded as a first-class honest outcome.
- **TC-30**: Missed state only after cutoff — Status switches to overdue/missed only after cutoff time.
- **TC-31**: Optional note — User can optionally attach a brief note or proof link.
- **TC-32**: Partner status — Displays partner's live status (Waiting, Done, Partial, Missed, Recovery).
- **TC-33**: Lightweight nudge/message actions — Send nudge, Pact Kept, Solid, Respect, and short notes.
- **TC-34**: Duplicate check-in prevention — Check-in for the same date updates idempotently without duplicate records.
- **TC-35**: Timezone/cutoff edge cases — Respects user's local timezone cutoff correctly.

## TEST GROUP 4 — RECOVERY
- **TC-36**: Missed → recovery — Missed commitment triggers the 24-hour recovery protocol.
- **TC-37**: Complete missed now — User can choose "Complete the missed work now" to recover.
- **TC-38**: Smaller recovery — User can choose "Do a smaller recovery version" to recover.
- **TC-39**: Reschedule once — User can choose "Reschedule once for early tomorrow" to recover.
- **TC-40**: Cannot recover — User can honestly record inability to recover without shame.
- **TC-41**: Partner sees Recovery in progress — Partner status reads "Recovery in progress" without negative labels.
- **TC-42**: Repeated misses — System surfaces rematch eligibility or Solo continuation after repeated misses.
- **TC-43**: Rematch eligibility — User can initiate respectful rematch.
- **TC-44**: Rematch flow — Concludes partnership gracefully and returns to candidate matching pool.
- **TC-45**: Continue Solo — User can choose Continue Solo if partnership is no longer working.
- **TC-46**: Commitment remains active after Continue Solo — Daily commitment stays active and check-ins continue.

## TEST GROUP 5 — RELIABILITY & CYCLE
- **TC-47**: Reliability calculation — Formula: (Done * 1.0 + Partial * 0.5 + Recovered * 0.8) / Total * 100.
- **TC-48**: Reliability updates after Done — Kept commitment increments completed count and recalculates.
- **TC-49**: Reliability updates after Partial — Partial credit awarded appropriately.
- **TC-50**: Reliability updates after Missed — Missed commitment reflects in unrecovered deduction.
- **TC-51**: Cycle day progression — Daily check-ins increment currentDay towards cycleDays.
- **TC-52**: Cycle completion — When currentDay reaches cycleDays, triggers completion state.
- **TC-53**: Completion summary — Displays total days completed, partial days, and recovered days.
- **TC-54**: Start another Pact — Allows creating a fresh commitment and matching for a new cycle.
- **TC-55**: Basic history — Displays completed and past pacts with outcome summary.

## TEST GROUP 6 — PACT ASSIST (TWO SEPARATE CONDITIONS)
- **TC-56**: 48h without human match — Evaluates `waitingHours >= 48`.
- **TC-57**: Pact Assist offer — Surfaces Pact Assist bridge when 48h condition is met.
- **TC-58**: Plan — Scoped prompt to clarify daily commitment tasks.
- **TC-59**: Start — Scoped prompt to trigger focus block.
- **TC-60**: Check — Scoped prompt to check daily progress.
- **TC-61**: Recover — Scoped prompt for make-up guidance during recovery.
- **TC-62**: Human matching continues — Background search remains active while Pact Assist is in place.
- **TC-63**: Human match becomes available while Assist is active — Notification when human partner accepts.
- **TC-64**: User accepts human match — User transitions from Pact Assist to human partner.
- **TC-65**: Correct transition from Pact Assist → human Pact — Preserves cycle progress without data loss.
- **TC-66**: No duplicate active Pact/partnership — Enforces strictly 1 active pact during and after transition.
- **TC-67**: Proposal limit remains independent from Pact Assist — Proposal exhaustion does NOT trigger Assist without 48h wait.

## TEST GROUP 7 — SECURITY & AUTHORIZATION
- Profiles, goals, commitments, check-ins, and partnerships enforce strict user ownership.
- Unauthorized cross-user mutation prevented.
- Concurrency locks on state transitions.

## TEST GROUP 8 — CONCURRENCY & IDEMPOTENCE
- Simultaneous mutual acceptance handled atomically.
- Duplicate check-in requests are idempotent for the same date.
- Rematch requests prevent race conditions.

## TEST GROUP 9 — UI/UX
- Mobile-first layout verified with no horizontal overflow.
- Minimum 44px touch targets.
- Accessible color contrast and calm typography.
- Zero anti-AI slop (no decorative blobs, no vanity gamification, no unnecessary cards).

## TEST GROUP 10 — TECHNICAL VERIFICATION
- `npm run lint` passes with 0 errors.
- `npm run build` passes with 0 errors.
- Automated tests pass with 100% success rate.
