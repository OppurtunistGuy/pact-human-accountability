# Pact Architecture Specification

## 1. System Components
- **Client App**: React 19 + TypeScript + Vite + Tailwind CSS.
- **State Engine**: Authoritative client context (`AccountabilityContext`) backed by `pactEngine` domain logic and synchronized to persistent storage.
- **Security & Authorization Model**:
  - User isolation: Only authenticated user can modify their goals, check-ins, and preferences.
  - Invariant enforcement: Strictly 1 active pact per user.
  - Concurrency & Idempotency: Mutex-like transition guards prevent duplicate check-ins, race-condition mutual acceptance, or concurrent rematch requests.

## 2. State Machine Transitions
- Partnership States:
  - `pending` → `active` (mutual acceptance)
  - `pending` → `dissolved` (rejection or expiry)
  - `active` → `recovering` (missed commitment)
  - `recovering` → `active` (recovery resolved)
  - `active` → `solo` (continue solo)
  - `active` → `completed` (cycle completed)
  - `active` → `dissolved` (rematch)
