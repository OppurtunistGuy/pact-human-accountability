# Pact Data Model (Free V1)

## Entities

### 1. UserProfile
- `id`: string (UUID)
- `email`: string
- `name`: string
- `avatar`: string
- `timezone`: string
- `primaryCategory`: 'study' | 'fitness'
- `accountabilityStyle`: 'strict' | 'balanced' | 'gentle'
- `preferredCheckInTime`: string (HH:MM)
- `reliabilityScore`: number (0-100)
- `totalCommitments`: number
- `completedCommitments`: number
- `badge`: 'Rock Solid' | 'Steady Partner' | 'Rising' | 'Building Trust'

### 2. Goal / Commitment
- `id`: string
- `userId`: string
- `title`: string
- `category`: 'study' | 'fitness'
- `commitmentStatement`: string
- `frequencyDaysPerWeek`: number
- `commitmentDays`: string[]
- `dailyTargetTime`: string (HH:MM)
- `cycleLengthDays`: 14 | 21 | 30
- `proofType`: 'text_summary' | 'photo_link' | 'binary_honor'
- `antiExcusePledge`: string

### 3. CheckIn
- `id`: string
- `partnershipId`: string
- `userId`: string
- `goalId`: string
- `date`: string (YYYY-MM-DD)
- `status`: 'done' | 'partial' | 'missed'
- `note`?: string
- `timestamp`: string
- `partnerReaction`?: 'pact_kept' | 'solid' | 'nudge' | 'respect'

### 4. RecoveryProtocol
- `id`: string
- `partnershipId`: string
- `userId`: string
- `missedDate`: string
- `actionType`: 'complete_work' | 'smaller_version' | 'reschedule' | 'cannot_recover'
- `makeUpAction`: string
- `deadlineHoursRemaining`: number
- `status`: 'pending' | 'resolved' | 'expired'

### 5. Partnership & PactCycle
- `id`: string
- `user1Id`: string
- `user2Id`: string
- `partner`?: UserProfile
- `isPactAssist`: boolean
- `isSolo`: boolean
- `status`: 'pending' | 'active' | 'recovering' | 'dissolved' | 'completed' | 'solo'
- `cycle`: PactCycle (cycleDays, currentDay, completedDays, partialDays, recoveredDays, missedDays, isCompleted)

### 6. MatchingState
- `proposalsUsedThisWeek`: number (0-2)
- `waitingHours`: number
- `pactAssistOffered`: boolean
- `isSearching`: boolean
