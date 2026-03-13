# PlayMatch API Audit Report

## Scope
- `apps/web/src/app/api/games/route.js`
- `apps/web/src/app/api/games/[id]/route.js`
- `apps/web/src/app/api/games/[id]/join/route.js`
- `apps/web/src/app/api/auth/token/route.js`

## Findings

### 1) Missing authentication/authorization on game mutation endpoints (High)
**What happens**
- Game create/update/delete and join/leave flows trust client-provided IDs (`organizerId`, `userId`) and do not validate the authenticated user context.

**Risk**
- Any caller can impersonate another user, update arbitrary games, or delete games they do not own.

**Evidence**
- `POST /api/games` accepts `organizerId` directly from request body and writes it to DB.
- `PUT`/`DELETE /api/games/[id]` have no auth or ownership check.
- `POST`/`DELETE /api/games/[id]/join` accept `userId` from body/query string.

**Recommendation**
- Resolve user identity from server-side session/JWT only.
- Enforce organizer ownership checks for update/delete.
- Reject requests without valid auth with 401/403.

### 2) Input validation gaps for route/query IDs (Medium)
**What happens**
- Several handlers run `parseInt(...)` on route/query values without guarding against `NaN`.

**Risk**
- Invalid IDs can trigger DB errors and inconsistent behavior (500s instead of 400s), reducing API reliability and observability quality.

**Evidence**
- `parseInt(params.id)` and `parseInt(userId)` are used without `Number.isInteger` checks.

**Recommendation**
- Validate all numeric inputs up front and return 400 for malformed values.

### 3) Race condition on game join capacity check (High)
**What happens**
- Join flow checks current participant count, then inserts participant in a separate step outside a transaction/locking strategy.

**Risk**
- Concurrent requests can overbook a game beyond `max_players`.

**Evidence**
- `current_participants` is computed in one query, insert is executed later.

**Recommendation**
- Use a transaction with row lock (`SELECT ... FOR UPDATE`) or a single atomic SQL statement to enforce capacity.

### 4) Unbounded pagination parameters on list endpoint (Low)
**What happens**
- `limit`/`offset` are accepted from user input without max bounds.

**Risk**
- Large `limit` values can create heavy DB load and slow API responses.

**Evidence**
- `limit` defaults to 20 but is not clamped.

**Recommendation**
- Clamp `limit` to a safe max (e.g., 50/100) and validate `offset >= 0`.

### 5) Fragile env var handling in token endpoint (Low)
**What happens**
- Token route calls `process.env.AUTH_URL.startsWith('https')` without checking if `AUTH_URL` exists.

**Risk**
- Missing env configuration causes runtime exception and 500 response.

**Evidence**
- Direct `startsWith` call on possibly undefined env var.

**Recommendation**
- Use a safe fallback: `const authUrl = process.env.AUTH_URL ?? ''; const secureCookie = authUrl.startsWith('https');`

## Quick quality checks run
- `npm --prefix apps/web run typecheck` (passed)
- `npm --prefix apps/web run build` (passed with warning: unused import in SSR build output)
