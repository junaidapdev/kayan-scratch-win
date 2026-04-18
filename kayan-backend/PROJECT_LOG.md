# Kayan Sweets Backend — Project Log

Every Claude Code session appends an entry here. Read the most recent entry before
starting any task.

## Entry Template

### [YYYY-MM-DD] Chunk N: <Chunk Name>
- **Built:** <what was delivered>
- **Files changed:** <list>
- **Decisions:** <any non-obvious choices made>
- **Open questions for human:** <anything needing input>
- **Next:** <what the next chunk should tackle>

---

### [2026-04-18] Chunk 0: Backend foundation scaffold
- **Built:**
  - Node.js + TypeScript + Express project scaffold with strict `tsconfig.json`
    and `@/*` → `src/*` path alias (resolved via `tsconfig-paths` in dev and
    `tsc-alias` in build).
  - Folder skeleton under `src/`: `config`, `constants`, `controllers`,
    `interfaces`, `lib`, `middleware`, `routes`, `services`. Every folder has
    a barrel `index.ts` — feature folders currently export nothing (placeholder).
  - Zod-validated env loader (`src/config/env.ts`) — the ONLY place
    `process.env` is accessed. Throws at startup if any required var is missing.
  - Constants: `http.ts` (HTTP_STATUS), `errors.ts` (ERROR_CODES +
    bilingual ERROR_MESSAGES en/ar), `business.ts` (stamp / OTP / reward / phone
    regex rules), plus a barrel.
  - `src/lib/logger.ts`: Winston singleton — pretty console in dev, JSON to
    stdout in prod. ESLint override permits `console.*` only in this file.
  - `src/lib/apiResponse.ts`: `ApiResponse<T>` discriminated union, `apiSuccess`
    and `apiError` helpers, plus an `ApiError` class + `createApiError` factory
    for throw-based error flow.
  - `src/lib/validation.ts`: Zod-based `validate({ body, params, query })`
    Express middleware and a `parseOrThrow` helper — both emit consistent
    `VALIDATION_FAILED` (422) `apiError` responses.
  - `src/middleware/errorHandler.ts`: global Express error handler + 404
    fallback. Logs via Winston, masks stack traces in production,
    handles `ApiError` and `ZodError` specially.
  - `src/server.ts`: Express app factory with `helmet`, `cors` (origins from
    env), JSON body parser, and a `GET /health` endpoint. Entry point guarded
    by `require.main === module` so `createApp()` is importable from tests.
  - `tsconfig.json`, `.eslintrc.cjs`, `package.json` with `dev` / `build` /
    `start` / `lint` / `lint:fix` / `typecheck` scripts.
  - `.gitignore` (excludes `node_modules`, `dist`, `.env*`, `.cursor/`,
    `*Fix.md`, `*Notes.md`, `SCRATCH.md`, etc. — allows CLAUDE/README/PROJECT_LOG).
  - `.env.example` with every required variable.
  - `CLAUDE.md` (verbatim coding standards), `README.md` (setup + structure),
    this `PROJECT_LOG.md`.
- **Files changed:**
  - `package.json`, `tsconfig.json`, `.eslintrc.cjs`, `.gitignore`,
    `.env.example`
  - `src/config/env.ts`
  - `src/constants/{http,errors,business,index}.ts`
  - `src/lib/{logger,apiResponse,validation,index}.ts`
  - `src/middleware/{errorHandler,index}.ts`
  - `src/{interfaces,routes,services,controllers}/index.ts` (placeholders)
  - `src/server.ts`
  - `CLAUDE.md`, `README.md`, `PROJECT_LOG.md`
- **Decisions:**
  - Chose Express (not NestJS) per the simplicity directive.
  - Module = CommonJS with ES2022 target — matches the Node 20 LTS runtime and
    avoids ESM interop friction with Winston / ts-node.
  - `@/*` alias is rewritten at build time by `tsc-alias` so the compiled JS in
    `dist/` has no path-alias runtime dependency.
  - `ApiError` + `createApiError` pattern (throw-based) chosen over returning
    `Result`-style unions, so service/controller code can bail out cleanly and
    the global handler produces the single canonical error response shape.
  - Added `notFoundHandler` alongside `errorHandler` — unmatched routes return
    an `ApiResponse` failure rather than Express's default HTML.
  - Logger is a true singleton (module-level `createLogger`) rather than a
    factory — there is only one process, one logger.
- **Open questions for human:**
  - SMS provider: `SMS_PROVIDER_API_KEY` + `SMS_PROVIDER_SENDER_ID` are in the
    env schema as generic. Which provider (Unifonic, Msegat, Twilio, …)? That
    drives the client shape in `src/lib/sms.ts`.
  - JWT vs Supabase Auth sessions: do admin users authenticate via a
    backend-issued JWT (`JWT_SECRET`) or via Supabase Auth tokens? Both vars
    are reserved in the env, but only one will ultimately be used.
  - Rate limiter: not yet added. Do you want `express-rate-limit` (in-process)
    or the Supabase-backed approach (so limits hold across instances)?
- **Next (Chunk 1 suggestion):**
  - Wire up the Supabase client (`src/lib/supabase.ts` — service role for
    server calls, anon for pass-through if needed).
  - Define the `customers` table's first interface + Zod schema, and stub
    `POST /customers` end-to-end (route → controller → service → supabase)
    as the reference example every subsequent feature will copy.

---

### [2026-04-18] Chunk 1: Backend Foundation
- **Built:**
  - Supabase migrations and RLS policies for branches, customers, visits, rewards_catalog, rewards_issued, admin_users, sms_log, and feedback.
  - Supabase seed script for Kayan branches.
  - `supabase.ts` exporting `supabaseAdmin` and `supabaseAnon`.
  - Expanded `errors.ts` to include business and infrastructure error codes.
  - `validator.ts` middleware for Zod schema validation (returning `400 BAD_REQUEST`).
  - `requestLogger.ts` middleware using Winston and automatically masking PII phone numbers.
  - Branch module foundation (`Branch.ts` interface, `branch.service.ts`, `branch.controller.ts`, `branch.routes.ts`) with `listActiveBranches` integration setup.
  - Integrated request logger and branches route into `server.ts`.
- **Files changed:**
  - `src/supabase/migrations/*.sql`
  - `src/supabase/seed.sql`
  - `src/lib/supabase.ts`
  - `src/constants/errors.ts`
  - `src/middleware/validator.ts`
  - `src/middleware/requestLogger.ts`
  - `src/interfaces/branch/Branch.ts`, `src/interfaces/branch/index.ts`
  - `src/modules/branch/branch.service.ts`, `branch.controller.ts`, `branch.routes.ts`, `index.ts`
  - `src/server.ts`
- **Decisions:**
  - `validator.ts` issues a `400 BAD_REQUEST` aligning with REST validation error expectations from PRD, in contrast to Chunk 0's validation.ts returning 422.
  - Added `NOT_FOUND` into `errors.ts` because it was required by the global fallback handler.
  - Implemented phone number regex in `requestLogger.ts` to mask URLs or bodies appropriately.
- **Open questions for human:**
  - Migrations and Seed script must be manually applied using `npx supabase db push` and `npx supabase db reset` (or run manually via SQL) against local/cloud DB.
- **Next:**
  - Test E2E using `GET /branches` if Supabase has been provisioned.
  - Stub `customers` endpoint with comprehensive test case and Zod schemas.

---

### [2026-04-18] Chunk 2: Auth & Customer Registration
- **Built:**
  - Migrated `otp_tokens` with dynamic `verify_otp` and `register_customer_and_visit` atomic RPCs using `pgcrypto`.
  - Added SMS (`src/lib/sms.ts`) logic implementing both a stub Unifonic payload and development logger mock.
  - Added JWT handler `jwt.ts` and Express authentication middleware handling `registration` vs `session` scopes.
  - Added Auth endpoints (`POST /auth/otp/request` and `POST /auth/otp/verify`) with rate limiting and retry lockouts.
  - Added Customer endpoints (`POST /customers/register` and `GET /customers/me`).
  - Implemented unit/integration tests targeting auth flows via Jest and Supertest.
- **Files changed:**
  - `src/supabase/migrations/20260418130000_otp_tokens.sql`
  - `src/lib/sms.ts`, `src/lib/jwt.ts`
  - `src/interfaces/auth/*`, `src/modules/auth/*`
  - `src/interfaces/customer/*`, `src/modules/customer/*`
  - `src/server.ts`
  - `tests/integration/auth.test.ts`, `tests/integration/customer.test.ts`
  - `jest.config.js`
  - `package.json` (Injected dependencies manually)
- **Decisions:**
  - Handled hash comparisons inside Postgres via `pgcrypto` crypt function, keeping the operation atomic. Node-side uses traditional bcrypt configuration dynamically storing tokens.
  - Opted to write the tests and configure Jest locally mocking database imports so logic can be validated sans infrastructure.
- **Open questions for human:**
  - Need to run `npm install` natively to resolve the packages added to `package.json`.
- **Next:**
  - Existing user login workflow & returning visitor logic handled in Chunk 3.

---

### [2026-04-18] Chunk 3: Returning Customer Scan
- **Built:**
  - `audit_log` table (ip, action, phone, metadata, created_at) and
    `fn_process_scan` atomic RPC. The RPC row-locks the customer
    (`SELECT … FOR UPDATE`), evaluates the chain-wide 24-hour lockout
    against `last_scan_at`, inserts a `visits` row (always, even during
    lockout or when the card is full), updates aggregates, and caps
    `current_stamps` at 10. Returns `{success, visit_id, stamp_awarded,
    lockout_applied, current_stamps, ready_for_reward, next_eligible_at}`.
  - New visit module: `visit.validators.ts` (zod schemas for
    `/scan/lookup` and `/scan`), `visit.service.ts` (rate-limit ladder,
    customer/branch lookups, `processScan`, `computeNextEligibleAt`),
    `visit.controller.ts` (maps `lockout_applied=true` → 422
    `SCAN_LOCKOUT_ACTIVE` with `next_eligible_at` details; card-full →
    200 with `ready_for_reward:true`), `visit.routes.ts` (mounts
    `POST /visits/scan/lookup` unauth and `POST /visits/scan` with
    `requireAuth(['scan','session'])`).
  - Five visit interfaces under `src/interfaces/visit/`:
    `ScanLookupPayload`, `ScanLookupResult` (with `ScanLookupProfile`),
    `ScanPayload`, `ScanResult`, `LockoutResult`, plus barrel.
  - `signScanToken` helper and `'scan'` scope added to `jwt.ts`. The
    scan token carries `customerId` so `/visits/scan` skips a second
    phone-→-customer lookup.
  - `RATE_LIMITED` error code + bilingual (en/ar) messages.
  - `GET /customers/me` now returns `next_eligible_at` on the profile,
    computed off `last_scan_at` + `current_stamps`.
  - `app.set('trust proxy', 1)` in `server.ts` so `req.ip` reflects the
    real client behind one reverse-proxy hop (Vercel / Nginx).
  - Six Jest + Supertest integration tests in
    `tests/integration/visit.test.ts` — happy path, lockout (422 with
    `next_eligible_at`), 10th stamp (`ready_for_reward:true`), inactive
    branch (422 `BRANCH_INACTIVE` without RPC call), rate-limit (429
    `RATE_LIMITED` on >10 lookups/min), silence mode (`exists:false`
    after >5 lookups/hour even for a registered phone). Custom supabase
    builder helpers mock the fluent chains without needing a real DB.
- **Files changed:**
  - `src/supabase/migrations/20260418140000_audit_log_and_scan_rpc.sql`
  - `src/lib/jwt.ts`
  - `src/constants/errors.ts`
  - `src/interfaces/visit/{ScanLookupPayload,ScanLookupResult,ScanPayload,ScanResult,LockoutResult,index}.ts`
  - `src/modules/visit/{visit.validators,visit.service,visit.controller,visit.routes,index}.ts`
  - `src/modules/customer/customer.controller.ts`
  - `src/server.ts`
  - `tests/integration/visit.test.ts`
- **Decisions:**
  - Introduced `RATE_LIMITED` as a distinct code rather than reusing
    `OTP_RATE_LIMIT` — lookup is not OTP-shaped, and callers need to
    branch on it separately.
  - Two-tier rate-limit ladder on `/scan/lookup`: >10/min/IP → 429
    hard stop (`RATE_LIMITED`); >5/hr/IP → silent `exists:false`
    regardless of whether the phone is registered. The silent branch
    defends against PII-enumeration scraping without tipping off
    attackers that they've been throttled.
  - Card-full semantics: when `current_stamps` is already 10, the RPC
    still records the visit and bill_amount but does NOT increment,
    and the controller returns 200 with `ready_for_reward:true`. A
    full card is not an error state — redemption is a separate flow.
  - Scan JWT (5-minute TTL) carries `customerId` so `/visits/scan`
    doesn't need to re-lookup the customer from the phone. The
    controller accepts either this short-lived `scan` token or a
    long-lived `session` token.
  - `trust proxy = 1` now, not later — the rate limiter's correctness
    depends on truthful `req.ip`. Tune the hop count if deployment
    adds more proxies in front of the app.
  - Visit insert happens inside the atomic RPC, not from Node, so the
    lockout check and the visit write cannot interleave with a
    concurrent scan from the same phone.
- **Open questions for human:**
  - Deployment proxy depth: `trust proxy = 1` is correct for a single
    reverse-proxy hop. Confirm whether Vercel + any CDN adds more
    before production.
  - Should the 10th-stamp response trigger a "reward ready"
    notification hook here (SMS / push), or defer that to Chunk 4's
    reward-issuance flow? Leaning defer.
  - `audit_log` retention: no pruning job yet. Volume will grow
    linearly with scan/lookup traffic — decide on a TTL (30d?) before
    production.
- **Next (Chunk 4 suggestion):**
  - Reward issuance on the 10th stamp: reset the card to 0, insert a
    `rewards_issued` row with a unique redemption code, SMS the code
    to the customer, and expose `POST /rewards/redeem` for the admin
    app to mark it used. Should reuse the same atomic-RPC pattern.
